'use strict';

const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const ProgressBar = require('../../components/ProgressBar');

const ValidationException = require('../exceptions/ValidationException');
const { getFolderInfo } = require('../utils/helper');

module.exports = async function deploySftp({ localPath, remotePath, sftpConfig }) {
  const sftp = new SftpClient();
  const progressBar = new ProgressBar();

  try {
    const startTimestamp = Date.now();
    const folderName = path.basename(localPath);
    const { size, count } = getFolderInfo(localPath);

    if (count === 0) {
      return $message.error('No files need to be transferred to the remote end');
    }

    let remoteFileCount = 0;
    let remoteFileSize = 0;

    progressBar.start('Connecting to the server...');
    await sftp.connect(sftpConfig);

    progressBar
      .succeedAndHold()
      .setProgressPrefix(`Uploading the files...`, { breakLine: true })
      .startProgress(count);

    sftp.on('upload', (info) => {
      const file = fs.statSync(info.source);

      remoteFileCount += 1;
      remoteFileSize += file.size;

      progressBar.advance();
    });

    await sftp.uploadDir(localPath, path.join(remotePath, folderName));

    progressBar.finish();

    $message.success('\nDeploy success 🚀');
    $message.success(
      `Uploaded ${remoteFileCount} files, ${remoteFileSize} bytes, Time cost: ${Date.now() - startTimestamp}ms`
    );

    process.exit();
  } catch (err) {
    progressBar.fail();
    ValidationException.throw('\nUpload failed', err.message);
  } finally {
    await sftp.end();
  }
};
