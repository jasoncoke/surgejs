const { program } = require('commander');
const path = require('path');
const { readEnvFile, writeEnvFile } = require('../../providers/envProvider');

module.exports = {
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
}
