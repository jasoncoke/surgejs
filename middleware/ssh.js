require('colors');
const readline = require('readline');
const util = require('util');

const { displayOptions, getFormatDate, readJsonFile, writeJsonFile } = require('./helper');

async function initConfig() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question = util.promisify(rl.question).bind(rl);

  // console.log('Before using surgejs, please initialize according to the prompts: '.yellow);
  const host = await question('Host:  ');
  const port = await question('Port (Default 22): ');
  const username = await question('Username: ');

  const wayOpt = await new Promise((resolve, reject) => {
    console.log('Choose how to connect: ');
    const options = [
      { value: 'password', label: 'Password' },
      { value: 'key_path', label: 'Identity File' }
    ];
    let selectedIndex = 0;

    displayOptions(options, selectedIndex)

    rl.input.on('keypress', (str, key) => {
      if (key) {
        if (key.name === 'up') {
          process.stdout.write('\x1b[2A\x1b[K');
          process.stdout.write('');

          selectedIndex = Math.max(0, selectedIndex - 1);
          displayOptions(options, selectedIndex);
        } else if (key.name === 'down') {
          process.stdout.write('\x1b[2A\x1b[K');
          process.stdout.write('');

          selectedIndex = Math.min(options.length - 1, selectedIndex + 1);
          displayOptions(options, selectedIndex);
        } else if (key.name === 'return') {
          resolve(options[selectedIndex])
        }
      }
    });
  })

  const value = await question(`${wayOpt.label}: `);
  const name = await question(`[optional] You can give the current configuration a name: `);

  rl.close();

  const configs = {
    host,
    port,
    username,
    [wayOpt.value]: value,
    name
  }
  return Promise.resolve(configs);
}

const JSON_KEY = 'servers'
module.exports = class SshConfig {
  constructor(props = {
    autoSave: false
  }) {
    const timestamp = new Date();

    this.id = timestamp.getTime();
    this.created_time = getFormatDate(timestamp)

    this.init()
  }

  async init() {
    this.configs = await initConfig()
  }

  saveConfigs() {
    const config = readJsonFile('config')
    const params = {
      ...this.configs,
      id: this.id,
      created_time: this.created_time
    }

    config[JSON_KEY].push(params)
    writeJsonFile('config', JSON_KEY, config[JSON_KEY])
  }
}
