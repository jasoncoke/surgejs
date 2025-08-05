'use strict';

const AwsProvider = require('../../providers/awsProvider');

module.exports = {
  description: 'Enabling streamlined deployment and management of applications using Amazon S3',
  options: [['mv', 'Move local files to S3']],
  action: (args, options) => {
    const AwsProvider = new AwsProvider();
    if (['mv'].includes(options.args[0])) {
      AwsProvider.moveFilesToBucket();
    }
  }
};
