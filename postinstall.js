'use strict';

// This is the callback after installing this package
const fs = require('fs');
const path = require('path');
const { getPrivateKetPath } = require('./middleware/utils/helper');
const {
  SURGEJS_CONFIG_JSON_FILENAME,
  CHANNEL_USER,
  USER_KEY_SSH_PRIVATE_PATH,
  updateSingleConfig
} = require('./middleware/utils/config');

function createFile(fileName, content, filePath = path.resolve(__dirname, fileName)) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(fileName, content);
  }
}

// Create necessary files
createFile(SURGEJS_CONFIG_JSON_FILENAME, '{}');
updateSingleConfig(CHANNEL_USER, {
  [USER_KEY_SSH_PRIVATE_PATH]: getPrivateKetPath()
});
