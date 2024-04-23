require('colors');

const fs = require('fs');
const SftpClient = require('ssh2-sftp-client');
const path = require('path');
const progress = require('progress-stream');

const { formatBytes } = require('./helper')
const { readEnvFile } = require('./env');
const envObj = readEnvFile();

const localFilePath = path.resolve(process.cwd(), 'upload-test');
const remoteFilePath = '/apps';

const sftpconfig = {
  host: envObj.SSH_HOST,
  port: envObj.SSH_PORT,
  username: envObj.SSH_USERNAME,
  privateKey: fs.readFileSync(envObj.SSH_KEY_PATH)
};

const sftp = new SftpClient();

async function deployDir() {
  try {
    const startTimesStamp = Date.now();
    const stat = fs.statSync(localFilePath);
    const progressStream = progress({
      time: 100,
      length: stat.size,
    });
    // 创建进度条
    progressStream.on('progress', (progress) => {
      console.log(`Uploading: ${progress.transferred}/${progress.length}`);
    });

    // 连接到 SFTP 服务器
    await sftp.connect(sftpconfig);

    // 获取本地文件夹名称
    const folderName = path.basename(localFilePath);

    // 上传文件
    await sftp.uploadDir(localFilePath, path.join(remoteFilePath, folderName), progressStream);

    console.log(`Depoly completed 🚀🚀🚀! Folder size: ${formatBytes(stat.size)}. Time cost: ${Date.now() - startTimesStamp}ms`.green);
  } catch (err) {
    console.error(`Upload failed: `.red, err);
  } finally {
    // 关闭 SFTP 连接
    await sftp.end();
  }
}

module.exports = {
  deployDir
}