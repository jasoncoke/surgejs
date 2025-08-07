'use strict';

const Server = require('../../actions/ServerAction');

module.exports = {
  description: 'Add, delete, modify and check the saved server list',
  options: [
    ['-l', 'Show all servers'],
    ['cr, create', 'Add new server'],
    ['rm, remove <server_host | server_name>', 'Remove a server'],
    ['edt, edit <server_host | server_name>', 'Remove a server']
  ],
  action: (options, commander) => {
    const serverInstance = new Server(options, commander);

    if (options.list) {
      return serverInstance.getServerList();
    }

    if (['cr', 'create'].includes(commander.args[0])) {
      return serverInstance.create();
    }

    if (['rm', 'remove'].includes(commander.args[0])) {
      return serverInstance.remove(commander.args[1]);
    }

    if (['edt', 'edit'].includes(commander.args[0])) {
      return serverInstance.edit(commander.args[1]);
    }
  }
};
