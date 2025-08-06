'use strict';

const { program } = require('commander');
const { SURGEJS_CONFIG_JSON_PATH } = require('../../utils/config');

module.exports = {
  description:
    'Configuration variables' +
    `\nYou can also edit the configuration files directly in ${SURGEJS_CONFIG_JSON_PATH}`
      .brightYellow,
  options: [
    ['<key> <value>', 'Set env by key value'],
    ['-l, --list', 'List current configuration items']
  ],
  action: (args, options) => {}
};
