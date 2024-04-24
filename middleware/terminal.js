require('colors');
const { program } = require('commander');
const Table = require('cli-table3');

const Deploy = require('./actions/deploy');
const Server = require('./actions/server');

const { readEnvFile, writeEnvFile } = require('./env');
const { displayOptions, getFormatDate, readJsonFile, writeJsonFile } = require('./helper');

// 终端命令集合
module.exports = {
  'config': {
    description: 'Configuration variables',
    options: [
      ['-l, --list', 'List current configuration items'],
      ['--set <key> [value]', 'Set env by key [value]'],
      ['keys', 'Get invalid keys']
    ],
    action: (args, options) => {
      if (typeof args.list === "boolean" && args.list) {
        Object.entries(readEnvFile()).forEach(([key, value]) => {
          console.log(`${key}:${value}`.green);
        });
      }

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
      }
    }
  },
  'show': {
    description: 'Diaplay something',
    options: [
      ['servers', 'Show all servers']
      ['configs', 'Show all configs']
    ],
    action: (args, options) => {
      if (options.args[0] === 'servers') {
        const table = new Table({
          head: ['id', 'name', 'host', 'created_time']
        });
        readJsonFile('config')['servers'].forEach(server => {
          table.push([server.id, server.name, server.host, server.created_time]);
        })

        console.log(table.toString());
      }
    }
  },
  'server': {
    description: 'Diaplay something',
    options: [
      ['add', 'Add new server'],
      ['remove <server_id | server_name>', 'Remove a server']
    ],
    action: (args, options) => {
      const server = new Server();
      if (options.args[0] === 'add') {
        server.add()
      } else if (options.args[0] === 'remove') {
        server.remove(options.args[1])
      }
    }
  }
}
