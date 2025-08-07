'use strict';

const Deploy = require('../../actions/DeployAction');
const DeployInit = require('./init');

module.exports = {
  description: 'Deploy project to server',
  commanders: {
    init: DeployInit
  },
  options: [['-l,--log', 'Get the current project deployment log']],
  action: (options, commander) => {
    const deploy = new Deploy(options, commander);

    if (commander.args.length === 0) {
      return deploy.deploy();
    }
  }
};
