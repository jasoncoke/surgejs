'use strict';

// This is the terminal command collection file
const Config = require('./commands/config');
const Deploy = require('./commands/deploy');
const Server = require('./commands/server');
const Show = require('./commands/show');
const Store = require('./commands/store');

module.exports = {
  deploy: Deploy,
  config: Config,
  server: Server,
  show: Show
};
