"use strict";

const Show = require('../actions/ShowAction');

module.exports = {
  description: 'Display something',
  options: [
    ['-server', 'Show all servers'],
    ['-product', 'Show all configs'],
    ['-config', 'Show all configs'],
  ],
  action: (args, options) => {
    const show = new Show();
    if (options.args[0] === 'servers') {
      show.getServerList();
    }
  }
}