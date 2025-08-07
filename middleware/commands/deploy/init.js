'use strict';

const Deploy = require('../../actions/DeployAction');

module.exports = {
  description: 'Initialize the configuration in the current working directory',
  options: [],
  action: (options, commander) => {
    const deployInstance = new Deploy(options, commander);

    if (commander.args.length === 0) {
      return deployInstance.init();
    }
  }
};
