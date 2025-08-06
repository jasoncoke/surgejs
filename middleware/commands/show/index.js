'use strict';

const Show = require('../../actions/ShowAction');

module.exports = {
  description: 'Display configuration information',
  options: [
    ['-s,--server', 'Displays a list of configured servers'],
    ['-p,--project', 'Displays a list of configured projects']
  ],
  action: (args, options) => {
    const show = new Show(args, options);

    if (args.server) {
      return show.showServerList();
    }

    if (args.project) {
      return show.showProjectList();
    }

    if (options.args.length === 0) {
      return show.showCurrent();
    }
  }
};
