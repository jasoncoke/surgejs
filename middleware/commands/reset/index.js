'use strict';

const Reset = require('../../actions/ResetAction');

module.exports = {
  description: 'Add, delete, modify and check the saved server list',
  options: [
    ['-l', 'Show all servers'],
    ['cr, create', 'Add new server'],
    ['rm, remove <server_host | server_name>', 'Remove a server'],
    ['edt, edit <server_host | server_name>', 'Remove a server']
  ],
  action: (options, commander) => {
    new Reset(options, commander);
  }
};
