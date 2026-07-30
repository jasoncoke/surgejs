/**
 * @fileoverview Configuration management utilities for SurgeJS.
 * Handles reading/writing to the surgejs-config.json file.
 */

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
 * Reads and parses the configuration file.
 * @returns {Object} Parsed configuration object.
 */
module.exports.readConfigFile = () => {
  const path = module.exports.SURGEJS_CONFIG_JSON_PATH;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  return {};
};

/**
 * Retrieves a specific configuration channel.
 * @param {string} channel - The configuration channel name.
 * @param {*} [defaultValue=null] - Default value if channel is not found.
 * @returns {*} The configuration value or default.
 */
module.exports.getConfigByChannel = (channel, defaultValue = null) => {
  const configs = module.exports.readConfigFile();

  return configs[channel] || defaultValue;
};

/**
 * Updates a single configuration channel and writes to file.
 * @param {string} channel - The configuration channel name.
 * @param {*} data - The data to store.
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
 * Updates a nested key within a configuration channel.
 * @param {string} channel - The configuration channel name.
 * @param {string} key - The key to update.
 * @param {*} [value=null] - The value to set.
 * @returns {void}
 */
module.exports.updateConfigForObject = (channel, key, value = null) => {
  const configs = module.exports.readConfigFile();
  const data = configs[channel] ?? {};

  data[key] = value;
  module.exports.updateSingleConfig(channel, data);
};

/**
 * Retrieves a value from a nested configuration object.
 * @param {string} channel - The configuration channel name.
 * @param {string} key - The key to retrieve.
 * @param {*} [defaultValue=null] - Default value if key is not found.
 * @returns {*} The retrieved value or default.
 */
module.exports.getValueForObject = (channel, key, defaultValue = null) => {
  const configs = module.exports.readConfigFile();
  const data = configs[channel] ?? {};

  return data[key] ?? defaultValue;
};

/**
 * Retrieves the projects configuration channel.
 * @returns {Array<Object>} Array of project configurations.
 */
module.exports.getProjectConfigs = () => {
  return module.exports.getConfigByChannel(module.exports.CHANNEL_PROJECTS, []);
};

/**
 * Retrieves the servers configuration channel.
 * @returns {Array<Object>} Array of server configurations.
 */
module.exports.getServerConfigs = () => {
  return module.exports.getConfigByChannel(module.exports.CHANNEL_SERVERS, []);
};
