'use strict';

// This is the terminal command collection file
const Deploy = require('./commands/deploy');
const Server = require('./commands/server');
const Show = require('./commands/show');

module.exports = {
  deploy: Deploy,
  server: Server,
  show: Show
};
