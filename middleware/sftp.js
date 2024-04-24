require('colors');

const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const progress = require('progress-stream');

const { formatBytes } = require('./helper');
const { log } = require('console');

module.exports = async function deploySftp({ localPath, remotePath, sftpConfig }) {
  const sftp = new SftpClient();
  try {
    const startTimesStamp = Date.now();
    const stat = fs.statSync(localPath);
    const progressStream = progress({
      time: 100,
      length: stat.size,
    });
    // 创建进度条
    progressStream.on('progress', (progress) => {
      console.log(`Uploading: ${progress.transferred}/${progress.length}`);
    });

    // 连接到 SFTP 服务器
    await sftp.connect(sftpConfig);

    // 获取本地文件夹名称
    const folderName = path.basename(localPath);

    // 上传文件
    await sftp.uploadDir(localPath, path.join(remotePath, folderName), progressStream);

    console.log('');
    console.log(`Depoly completed 🚀🚀🚀! Folder size: ${formatBytes(stat.size)}. Time cost: ${Date.now() - startTimesStamp}ms`.green);
  } catch (err) {
    console.error(`Upload failed: `.red, err);
  } finally {
    // 关闭 SFTP 连接
    await sftp.end();
  }
}
