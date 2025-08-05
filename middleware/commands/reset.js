"use strict";

const Reset = require('../actions/Reset');

module.exports = {
  description: 'Add, delete, modify and check the saved server list',
  options: [
    ['-l', 'Show all servers'],
    ['cr, create', 'Add new server'],
    ['rm, remove <server_host | server_name>', 'Remove a server'],
    ['edt, edit <server_host | server_name>', 'Remove a server']
  ],
  action: (args, options) => {
    console.log('target output >>> args', args);
    new Reset(args, options);
  }
}