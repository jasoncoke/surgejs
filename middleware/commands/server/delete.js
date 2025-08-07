'use strict';

const Server = require('../../actions/ServerAction');

module.exports = {
  description: 'Delete a server configuration ',
  alias: 'dl',
  options: [],
  action: (options, commander) => {
    const serverInstance = new Server(options, commander);
  }
};
