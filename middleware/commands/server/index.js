'use strict';

/**
 *
 * @description Create, delete, modify and check the saved server list
 * @description This command allows you to create, delete, modify, and check the saved server list.
 * @description You can create a new server configuration or overwrite an existing one using the 'create' sub-command.
 * @description You can delete a server configuration using the 'delete' sub-command.
 * @description You can view the list of saved servers using the 'show' sub-command.
 * @description The main command is 'surgejs server', and the sub-commands are 'create', 'delete', and 'show'.
 *
 * @usage surgejs server create
 * @usage surgejs server create -i|--init <server_uid | server_name | server_host>
 */

const Server = require('../../actions/Server');
const Create = require('./create');

module.exports = {
  description: 'create, delete, modify and check the saved server list',
  commanders: {
    create: Create
  },
  options: [],
  action: (options, commander) => {
    const serverInstance = new Server(options, commander);
  }
};
