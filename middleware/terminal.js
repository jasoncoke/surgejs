require('colors');
const { program } = require('commander');
const { readEnvFile, writeEnvFile } = require('./env');

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
    action: (args, options) => {
      console.log('deploy')
    }
  },
  'servers': {
    description: 'Show all servers',
    action: (args, options) => {
      if (options.args.length === 0) {
        console.log('无参数');
      }
    }
  }
}
