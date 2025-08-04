const Server = require('../actions/server');

module.exports = {
  description: 'Add, delete, modify and check the saved server list',
  options: [
    ['-l', 'Show all servers'],
    ['cr, create', 'Add new server'],
    ['rm, remove <server_host | server_name>', 'Remove a server'],
    ['edt, edit <server_host | server_name>', 'Remove a server']
  ],
  action: (args, options) => {
    const server = new Server();
    if (args.list) {
      server.getServerList()
    } else if (['cr', 'create'].includes(options.args[0])) {
      server.create()
    } else if (['rm', 'remove'].includes(options.args[0])) {
      server.remove(options.args[1])
    } else if (['edt', 'edit'].includes(options.args[0])) {
      server.edit(options.args[1])
    }
  }
}