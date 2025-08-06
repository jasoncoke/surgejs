const fs = require('fs');
const path = require('path');

module.exports.SURGEJS_CONFIG_JSON_FILENAME = 'surgejs-config.json';
module.exports.SURGEJS_CONFIG_JSON_PATH = path.resolve(
  __dirname,
  '../../',
  module.exports.SURGEJS_CONFIG_JSON_FILENAME
);
module.exports.CHANNEL_SERVERS = 'servers';
module.exports.CHANNEL_PROJECTS = 'projects';
module.exports.CHANNEL_USER = 'user';
module.exports.CHANNEL_STORES = 'stores';

module.exports.USER_KEY_SSH_PRIVATE_PATH = 'ssh_private_path';

/**
 *
 * @returns {object}
 */
module.exports.readConfigFile = () => {
  const path = module.exports.SURGEJS_CONFIG_JSON_PATH;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  return {};
};

/**
 *
 * @param {string} channel
 * @param {*} defaultValue
 * @returns {*}
 */
module.exports.getConfigByChannel = (channel, defaultValue = null) => {
  const configs = module.exports.readConfigFile();

  return configs[channel] || defaultValue;
};

/**
 *
 * @param {string} channel
 * @param {*} data
 * @returns {void}
 */
module.exports.updateSingleConfig = (channel, data) => {
  const configs = module.exports.readConfigFile();
  configs[channel] = data;

  fs.writeFileSync(
    path.resolve(module.exports.SURGEJS_CONFIG_JSON_PATH),
    JSON.stringify(configs, null, 4)
  );
};

/**
 *
 * @param {string} channel
 * @param {string} key
 * @param {*} value
 * @returns {void}
 */
module.exports.updateConfigForObject = (channel, key, value = null) => {
  const configs = module.exports.readConfigFile();
  const data = configs[channel] ?? {};

  data[key] = value;
  module.exports.updateSingleConfig(channel, data);
};

/**
 *
 * @param {string} channel
 * @param {string} key
 * @param {*} defaultValue
 * @returns {*}
 */
module.exports.getValueForObject = (channel, key, defaultValue = null) => {
  const configs = module.exports.readConfigFile();
  const data = configs[channel] ?? {};

  return data[key] || defaultValue;
};

/**
 *
 * @returns {array}
 */
module.exports.getProjectConfigs = () => {
  return module.exports.getConfigByChannel(this.CHANNEL_PROJECTS, []);
};

/**
 *
 * @returns {array}
 */
module.exports.getServerConfigs = () => {
  return module.exports.getConfigByChannel(this.CHANNEL_SERVERS, []);
};
