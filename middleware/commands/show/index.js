'use strict';

/**
 * @description This command displays configuration information for SurgeJS.
 * @description You can view a list of configured servers or projects using the '-s|--server' or '-p|--project' options, respectively.
 * @description If no options are provided, it will display the current configuration.
 * @description If you want to view a list of all configured projects, you can use the '-p|--project' option.
 * @description If you want to view a list of all configured servers, you can use the '-s|--server' option.
 * @description If you want to view the current configuration, you can simply run the command without
 *
 * @usage surgejs show
 * @usage surgejs show -s|--server
 * @usage surgejs show -p|--project
 */

const Show = require('../../actions/Show');

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
