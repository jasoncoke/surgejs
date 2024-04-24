require('colors');
const inquirer = require('inquirer');

const { getFormatDate, readJsonFile, writeJsonFile } = require('../helper');
const { readEnvFile } = require('../env');

module.exports = class Server {
  constructor() {
    const timestamp = new Date();

    this.created_time = getFormatDate(timestamp)

    this.CONFIG_KEY = 'servers';
    this.list = readJsonFile('config')[this.CONFIG_KEY] || [];

    this.activeServer = null;
  }

  async add() {
    this.configs = await this.inputServerConfig(this.list);
    this.save();
  }

  save() {
    const params = {
      ...this.configs,
      created_time: this.created_time
    }

    this.activeServer = params;
    this.list.push(params)
    this.write();
  }

  write() {
    writeJsonFile('config', this.CONFIG_KEY, this.list)
  }

  remove(value) {
    if (!value) {
      return console.log('Please input server host or server name'.bgRed);
    }

    const server = this.list.find(server => server.name === value || server.host === value)
    if (!server) {
      console.log(`Server not found`.bgRed, `You can use 'surgejs show servers' to view all servers`);
    } else {
      this.list = this.list.filter(item => item.host !== server.host)
      console.log(`Server 「 ${value} 」 removed`.green);
      this.write();
    }
  }

  async select(rl) {
    const questions = [
      {
        type: 'list',
        name: 'selectServerHost',
        message: 'Select or add a server: ',
        choices: this.list.map(server => ({
          name: `${server.name} - ${server.host}`,
          value: server.host
        })).concat({
          name: 'Add new server',
          value: 'add'
        })
      }
    ]

    const { selectServerHost } = await inquirer.prompt(questions)

    if (selectServerHost === 'add') {
      await this.add()
    } else {
      this.activeServer = this.list.find(server => server.host === selectServerHost);
    }
  }

  async inputServerConfig(list) {
    const questions = [
      {
        type: 'input',
        name: 'host',
        message: 'Host: ',
        validate(value) {
          return list.find(server => server.host === value) ? 'Host already exists' : true;
        }
      },
      {
        type: 'input',
        name: 'port',
        default: 22,
        message: 'Port (Default 22): ',
      },
      {
        type: 'input',
        name: 'username',
        message: 'Username: ',
      },
      {
        type: 'list',
        name: 'connectMethod',
        message: 'Choose how to connect: ',
        choices: [
          { value: 1, name: 'Password' },
          { value: 2, name: 'Private Key' }
        ]
      }
    ];

    const answers = await inquirer.prompt(questions)

    const questionsNext = [
      {
        type: 'input',
        name: 'name',
        message: '[optional] You can give the current configuration a name: ',
        validate(value) {
          return list.find(server => server.name === value) ? 'Server name already exists' : true;
        }
      }
    ]

    if (answers.connectMethod === 1) {
      questionsNext.unshift({
        type: 'password',
        name: 'password',
        message: 'Password: ',
      })
    } else if (answers.connectMethod === 2) {
      questionsNext.unshift({
        type: 'input',
        name: 'privateKeyPath',
        default: readEnvFile().SSH_PRIVATE_KEY_PATH || '',
        message: 'Private key path: ',
      })
    }

    const answersNext = await inquirer.prompt(questionsNext)

    return Promise.resolve({
      ...answers,
      ...answersNext
    });
  }
}
