const fs = require('fs');
const path = require('path');

module.exports.SURGEJS_CONFIG_JSON_FILENAME = 'surgejs-config.json';
module.exports.SURGEJS_CONFIG_JSON_PATH = path.resolve(
  __dirname,
  '../',
  module.exports.SURGEJS_CONFIG_JSON_FILENAME
);

module.exports.readConfigFile = () => {
  const path = module.exports.SURGEJS_CONFIG_JSON_PATH;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  return {};
};

module.exports.writeConfigFile = () => {
  const path = module.exports.SURGEJS_CONFIG_JSON_PATH;
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  return {};
};
