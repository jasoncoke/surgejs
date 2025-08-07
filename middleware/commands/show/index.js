'use strict';

const Show = require('../../actions/ShowAction');

module.exports = {
  description: 'Display configuration information',
  options: [
    ['-s,--server', 'Displays a list of configured servers'],
    ['-p,--project', 'Displays a list of configured projects']
  ],
  action: (options, commander) => {
    const show = new Show(options, commander);

    if (options.server) {
      return show.showServerList();
    }

    if (options.project) {
      return show.showProjectList();
    }

    if (commander.args.length === 0) {
      return show.showCurrent();
    }
  }
};
