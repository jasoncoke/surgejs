'use strict';

const Show = require('../../actions/ShowAction');

module.exports = {
  description: 'Display configuration information',
  options: [
    ['-s,--server', 'Displays a list of configured servers'],
    ['-p,--project', 'Displays a list of configured projects']
  ],
  action: (options, commander) => {
    const showInstance = new Show(options, commander);

    if (options.server) {
      return showInstance.showServerList();
    }

    if (options.project) {
      return showInstance.showProjectList();
    }

    if (commander.args.length === 0) {
      return showInstance.showCurrent();
    }
  }
};
