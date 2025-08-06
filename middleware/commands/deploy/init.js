'use strict';

const Deploy = require('../../actions/DeployAction');

module.exports = {
  description: 'Initialize the configuration in the current directory',
  options: [],
  action: (args, options) => {
    if (options.args.length === 0) {
      new Deploy(args, options).init();
    }
  }
};
