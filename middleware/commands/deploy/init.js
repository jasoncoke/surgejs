'use strict';

const Deploy = require('../../actions/DeployAction');

module.exports = {
  description: 'Initialize the configuration in the current directory',
  options: [],
  action: (options, commander) => {
    if (commander.args.length === 0) {
      new Deploy(options, commander).init();
    }
  }
};
