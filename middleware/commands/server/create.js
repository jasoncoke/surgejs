'use strict';

const Server = require('../../actions/Server');

module.exports = {
  description: 'Create a new server configuration or overwrite an existing one',
  alias: 'cr',
  options: [
    [
      '-i,--init <server_uid | server_name | server_host>',
      'Initialize an existing server configuration'
    ]
  ],
  action: async (options, commander) => {
    const serverInstance = new Server(options, commander);

    if (options.init) {
      const idealUids = serverInstance.searchByKeyword(options.init);
      if (!idealUids.length) {
        return $message.error(
          'No server found with keyword: ' +
            options.init +
            ', Please check the keyword and try again'
        );
      }

      serverInstance.upsert(await serverInstance.askQuestions(idealUids[0]));
      $message.success('Server configuration initialized successfully');
      process.exit(0);
    }

    if (commander.args.length === 0) {
      await serverInstance.create();
      process.exit(0);
    }
  }
};
