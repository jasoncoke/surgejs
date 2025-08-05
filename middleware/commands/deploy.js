"use strict";

const Deploy = require('../actions/DeployAction');

module.exports = {
  description: 'Deploy project to server',
  options: [
    ['init', 'Add new server'],
  ],
  action: (args, options) => {
    const deploy = new Deploy()
    if (options.args[0] === 'init') {
      deploy.init()
    } else if (options.args.length === 0) {
      deploy.deploy()
    }
  }
}