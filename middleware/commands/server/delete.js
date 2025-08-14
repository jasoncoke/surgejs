'use strict';

const Server = require('../../actions/Server');

module.exports = {
  description: 'Delete a server configuration ',
  alias: 'dl',
  options: [],
  action: (options, commander) => {
    const serverInstance = new Server(options, commander);
  }
};
