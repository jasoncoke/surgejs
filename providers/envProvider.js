// This is env file help
const fs = require('fs');
const path = require('path');

const envFilePath = path.resolve(__dirname, '..', '.env');
/**
 * Function to read the .env file
 * 
 * @returns {Object} An object containing key-value pairs of environment variables. If the read fails, an empty object is returned.
 */
function readEnvFile() {
  try {
    const data = fs.readFileSync(envFilePath, 'utf8');
    const envVariables = {};
    data.split('\n').forEach(line => {
      if (line) {
        const [key, value] = line.split('=');
        envVariables[key.trim()] = value.trim();
      }
    });
    return envVariables;
  } catch (err) {
    console.error('Error reading .env file:', err);
    return {};
  }
}

/**
 * Writes a key-value pair into the `.env` file.
 * If a non-empty `value` is provided, it adds or updates the value for the given `key`.
 * If an empty `value` is provided, it removes the corresponding record for the `key`.
 * @param {string} key - The key name to set within the `.env` file.
 * @param {string} value - The value corresponding to the key. An empty string removes the key.
 */
function writeEnvFile(key, value) {
  try {
    const envVariables = readEnvFile();
    if (value) {
      envVariables[key] = value;
    } else {
      delete envVariables[key];
    }

    let envData = '';
    for (const key in envVariables) {
      envData += `${key}=${envVariables[key]}\n`;
    }

    fs.writeFileSync(envFilePath, envData);
  } catch (err) {
    console.error('Error writing .env file:', err);
  }
}

/**
 * Get the value of the specified key in the env file
 * @param {string} key 
 * @returns 
 */
function getEnvValue(key) {
  const envVariables = readEnvFile();

  if (!envVariables[key]) return null;
  return envVariables[key];
}

/**
 * Get the set of env file keys
 * @returns array[string]
 */
function getEnvKeys() {
  const envVariables = readEnvFile();
  return Object.keys(envVariables);
}

module.exports = {
  readEnvFile,
  writeEnvFile,
  getEnvValue,
  getEnvKeys
};
