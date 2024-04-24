require('colors');
const inquirer = require('inquirer');

const { getFormatDate, readJsonFile, writeJsonFile } = require('../helper');

async function inputServerConfig() {
  const questions = [
    {
      type: 'input',
      name: 'host',
      message: 'Host: ',
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
      message: '[optional] You can give the current configuration a name: '
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
      message: 'Private key path: ',
    })
  }

  const answersNext = await inquirer.prompt(questionsNext)

  return Promise.resolve({
    ...answers,
    ...answersNext
  });
}

module.exports = class Server {
  constructor() {
    const timestamp = new Date();

    this.id = timestamp.getTime();
    this.created_time = getFormatDate(timestamp)

    this.CONFIG_KEY = 'servers';
    this.list = readJsonFile('config')[this.CONFIG_KEY] || [];

    this.activeServer = null;
  }

  async add() {
    this.configs = await inputServerConfig();
    this.save();
  }

  save() {
    const params = {
      ...this.configs,
      id: this.id,
      created_time: this.created_time
    }

    this.activeServer = params;
    this.list.push(params)
    this.write();
  }

  write() {
    writeJsonFile('config', this.CONFIG_KEY, this.list)
  }

  remove(id) {
    if (!id) {
      return console.log('Please input server id'.bgRed);
    }

    const server = this.list.find(server => server.id === id)
    if (!server) {
      console.log(`Server with id ${id} not found`.bgRed);
    } else {
      this.list = this.list.filter(server => server.id !== id)
      console.log(`Server 「 ${id} 」 removed`.green);
      this.write();
    }
  }

  async select(rl) {
    const questions = [
      {
        type: 'list',
        name: 'selectServerId',
        message: 'Select or add a server: ',
        choices: this.list.map(server => ({
          name: `${server.name} - ${server.host}`,
          value: server.id
        })).concat({
          name: 'Add new server',
          value: 'add'
        })
      }
    ]

    const { selectServerId } = await inquirer.prompt(questions)

    if (selectServerId === 'add') {
      await this.add()
    } else {
      this.activeServer = this.list.find(server => server.id === selectServerId);
    }
  }
}
