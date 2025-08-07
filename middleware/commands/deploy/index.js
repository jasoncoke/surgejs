'use strict';

const Deploy = require('../../actions/DeployAction');
const Init = require('./init');

module.exports = {
  description: 'Deploy project to server',
  commanders: {
    init: Init
  },
  options: [],
  action: (options, commander) => {
    const deployInstance = new Deploy(options, commander);

    if (commander.args.length === 0) {
      return deployInstance.deploy();
    }
  }
};
