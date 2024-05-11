const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const ProgressBar = require('./progressBar');

const { getFolderSize, formatBytes } = require('./helper');

module.exports = async function deploySftp({ localPath, remotePath, sftpConfig }) {
  const sftp = new SftpClient();
  try {
    const startTimesStamp = Date.now();
    const folderSizeBytes = getFolderSize(localPath)
    const folderName = path.basename(localPath);
    let remoteSize = 0;

    // 连接到 SFTP 服务器
    await sftp.connect(sftpConfig);

    const progressBar = new ProgressBar({
      total: folderSizeBytes,
    })
    setInterval(() => {
      progressBar.current += 100;
    }, 100);

    sftp.on('upload', info => {
      const file = fs.statSync(info.source);
      remoteSize += file.size
      progressBar.current = remoteSize;
    });

    // 上传文件
    await sftp.uploadDir(localPath, path.join(remotePath, folderName));

    new Print({
      message: `\nDepoly completed 🚀🚀🚀! Folder size: ${formatBytes(folderSizeBytes)}. Time cost: ${Date.now() - startTimesStamp}ms`,
      type: 'success'
    })
    process.exit();
  } catch (err) {
    console.error(`Upload failed: `, err);
  } finally {
    // 关闭 SFTP 连接
    await sftp.end();
  }
}
