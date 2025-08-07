'use strict';

const { S3, PutObjectCommand } = require('@aws-sdk/client-s3');
const ora = require('ora');
const path = require('path');
const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs');
const { isDirectory } = require('../utils/helper');
const { SURGEJS_CONFIG } = require('../utils/config');

const processPath = process.cwd();

function getAwsParams() {
  if (existsSync(path.resolve(processPath, SURGEJS_CONFIG))) {
    const data = readFileSync(path.resolve(processPath, SURGEJS_CONFIG), 'utf8');
    return JSON.parse(data);
  }

  return {};
}

function getAwsFiles(folderPath, preFolderPath = '') {
  const keys = readdirSync(folderPath);

  return keys.flatMap((key) => {
    const filePath = `${folderPath}/${key}`;
    if (isDirectory(filePath)) {
      return getAwsFiles(filePath, folderPath);
    } else {
      const fileContent = readFileSync(filePath);
      return {
        Key: preFolderPath ? `${path.basename(folderPath)}/${key}` : key,
        Body: fileContent
      };
    }
  });
}

module.exports = class AwsS3Client {
  constructor(awsConfig = getAwsParams()) {
    if (!awsConfig.region) {
      awsConfig.region = 'aws-global';
    }

    this.config = awsConfig;
    this.client = new S3(awsConfig);
    const bucket = this.config.params?.Bucket;
    const src = this.config.aws?.src;

    if (!bucket) {
      program.error('Missing `params.Bucket` config value.'.bgRed);
    }

    if (!src) {
      program.error('Missing `aws.src` config value.'.bgRed);
    }
  }

  async moveFilesToBucket({ bucketName, folderPath }, keepFolder = false) {
    const files = getAwsFiles(folderPath);

    if (keepFolder) {
      const parentFolderName = path.basename(folderPath);
      files.forEach((file) => {
        file.Key = `${parentFolderName}/${file.Key}`;
      });
    }

    const totalCount = files.length;
    let uploadedCount = 0;
    const spinner = ora('').start();
    await Promise.all(
      files.map(async (file) => {
        spinner.text = `uploading ${file.Key}  ${uploadedCount}/${totalCount}}`;
        await this.client.send(
          new PutObjectCommand({
            Bucket: bucketName,
            Body: file.Body,
            Key: file.Key
          })
        );
        uploadedCount++;
      })
    );

    spinner.succeed(`uploaded ${uploadedCount}/${totalCount} files`);
    spinner.clear();
  }
};
