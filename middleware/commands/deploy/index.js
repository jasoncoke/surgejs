'use strict';

/**
 * @description Deploy project to server
 * @description This command allows you to deploy your project to a specified server.
 * @description You can initialize the configuration in the current working directory using the 'init' sub-command.
 * @description The main command is 'surgejs deploy', and the initialization command is 'surgejs deploy init'.
 *
 * @usage surgejs deploy
 * @usage surgejs deploy init
 */

const Deploy = require('../../actions/Deploy');
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
