'use strict';

const Server = require('../../actions/ServerAction');

module.exports = {
  description: 'Create a new server configuration or overwrite an existing one',
  alias: 'cr',
  options: [
    [
      '-i,--init [server_uid | server_name | server_host]',
      'Initialize an existing server configuration'
    ]
  ],
  action: (options, commander) => {
    const serverInstance = new Server(options, commander);

    if (options.init) {
      console.log('target output >>> commander', options);
      console.log('target output >>> 222124151', 222124151);
    }
  }
};
