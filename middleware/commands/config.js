const { program } = require('commander');
const path = require('path');
const { getEnvKeys, writeEnvFile } = require('../../providers/envProvider');

module.exports = {
  description: 'Configuration variables' + `\nYou can also edit the configuration files directly in ${path.dirname(require.main.filename)}/`.brightYellow,
  options: [
    ['<key> <value>', 'Set env by key value'],
    ['-l, --list', 'List current configuration items'],
  ],
  action: (args, options) => {
    if (args.set) {
      const keys = getEnvKeys();
      if (!keys.includes(args.set)) {
        program.error('Invalid key, use config keys to get the keys list'.bgRed);
      } else {
        writeEnvFile(args.set, options.args[0])
      }
    }

    if (options.args[0] === 'keys') {
      console.log(getEnvKeys().join(', ').green);
    }
  }
}
