'use strict';

const Deploy = require('../../actions/DeployAction');
const DeployInit = require('./init');

module.exports = {
  description: 'Deploy project to server',
  commanders: {
    init: DeployInit
  },
  options: [['-l,--log', 'Get the current project deployment log']],
  action: (args, options) => {
    const deploy = new Deploy(args, options);

    if (options.args.length === 0) {
      return deploy.deploy();
    }
  }
};
