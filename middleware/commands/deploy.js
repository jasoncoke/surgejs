'use strict';

const Deploy = require('../actions/DeployAction');

module.exports = {
  description: 'Deploy project to server',
  options: [['init', 'Initialize the configuration in the current directory']],
  action: (args, options) => {
    const deploy = new Deploy(args, options);
    if (options.args[0] === 'init') {
      deploy.init();
    } else if (options.args.length === 0) {
      deploy.deploy();
    }
  }
};
