// This is the terminal command collection file
const { program } = require('commander');
const path = require('path');

const Deploy = require('./actions/deploy');
const Show = require('./actions/show');
const Server = require('./actions/server');
const AwsS3 = require('./aws-s3');

const { readEnvFile, writeEnvFile } = require('./env');

module.exports = {
  'config': {
    description: 'Configuration variables' + `\nYou can also edit the configuration files directly in ${path.dirname(require.main.filename)}/`.brightYellow,
    options: [
      ['<key> <value>', 'Set env by key value'],
      ['-l, --list', 'List current configuration items'],
    ],
    action: (args, options) => {
      // if (options.args.length === 0) {
      //   log.info('Configuration variables'.green);
      // }

      // if (typeof args.list === "boolean" && args.list) {
      //   Object.entries(readEnvFile()).forEach(([key, value]) => {
      //     console.log(`${key}:${value}`.green);
      //   });
      // }

      if (args.set) {
        const keys = Object.keys(readEnvFile());
        if (!keys.includes(args.set)) {
          program.error('Invalid key, use config keys to get the keys list'.bgRed);
        } else {
          writeEnvFile(args.set, options.args[0])
        }
      }

      if (options.args[0] === 'keys') {
        console.log(Object.keys(readEnvFile()).join(', ').green);
      }
    }
  },
  'deploy': {
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
  },
  'show': {
    description: 'Diaplay something',
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
  },
  'server': {
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
  },
  's3': {
    description: 'Enabling streamlined deployment and management of applications using Amazon S3',
    options: [
      ['mv', 'Move local files to S3'],
    ],
    action: (args, options) => {
      const awsS3 = new AwsS3()
      if (['mv'].includes(options.args[0])) {
        awsS3.moveFilesToBucket()
      }
    }
  }
}
