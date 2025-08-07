'use strict';

module.exports = {
  description: 'Enabling streamlined deployment and management of applications using Amazon S3',
  options: [['mv', 'Move local files to S3']],
  action: (options, commander) => {
    const AwsProvider = new AwsProvider();
  }
};
