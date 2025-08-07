'use strict';

const inquirer = require('inquirer');
const Table = require('cli-table3');
const path = require('path');

const ValidationException = require('../exceptions/ValidationException');
const { getFormatDate, generateSimpleHash, stringify } = require('../utils/helper');
const {
  CHANNEL_USER,
  CHANNEL_SERVERS,
  USER_KEY_SSH_PRIVATE_PATH,
  SURGEJS_CONFIG_JSON_PATH,
  getServerConfigs,
  getValueForObject,
  updateSingleConfig,
  updateConfigForObject
} = require('../utils/config');

module.exports = class Server extends require('./ActionConstructor') {
  constructor(options, commander) {
    super(options, commander);

    this.servers = getServerConfigs();

    this.uid = null;
    this.activeServer = null;
  }

  async create() {
    this.configs = await this.inputServerConfig(this.servers);

    this._save();
  }

  _save() {
    const params = {
      ...this.configs,
      created_at: getFormatDate()
    };

    params.uid = generateSimpleHash(stringify(params));

    // 保存至 env
    if (params.connectMethod === 2) {
      updateConfigForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH, params.privateKeyPath);
    }

    this.activeServer = params;
    this.servers.push(params);
    this.write();
  }

  write() {
    updateSingleConfig(CHANNEL_SERVERS, this.servers);
  }

  remove(value) {
    if (!value) {
      ValidationException.throw('Serve remove failed', 'Please input server host or server name');
    }

    const server = this.servers.find((server) => server.name === value || server.host === value);
    if (!server) {
      ValidationException.throw(
        'Serve remove failed',
        'Server not found! You can use [ surgejs show servers ] to view all servers'
      );
    } else {
      this.servers = this.servers.filter((item) => item.host !== server.host);
      this.write();
      $message.success(`Server「 ${value} 」 removed successfully!`);
    }
  }

  // TODO
  edit(value) {
    if (!value) {
      ValidationException.throw('Serve edit failed', 'Please input server host or server name');
    }

    const server = this.servers.find((server) => server.name === value || server.host === value);
    if (!server) {
      ValidationException.throw(
        'Serve edit failed',
        'Server not found! You can use [ surgejs show servers ] to view all server'
      );
    } else {
      console.log('Features under development...');
    }
  }

  async select(uid) {
    const defaultChooseIndex = this.servers.findIndex((server) => server.uid === uid);

    const questions = [
      {
        type: 'list',
        name: 'selectServerHost',
        default: defaultChooseIndex,
        message: 'Select or add a server: ',
        choices: this.servers
          .map((server, index) => {
            const choice = {
              name: `${server.name} - ${server.host}`,
              value: server.host
            };

            if (defaultChooseIndex === index) {
              choice.name = '[Last choice] ' + choice.name;
            }

            return choice;
          })
          .concat({
            name: 'Add new server',
            value: 'add'
          })
      }
    ];

    const { selectServerHost } = await inquirer.prompt(questions);

    if (selectServerHost === 'add') {
      await this.create();
    } else {
      this.activeServer = this.servers.find((server) => server.host === selectServerHost);
    }
  }

  getServerByHost(host) {
    return this.servers.find((server) => server.host === host);
  }

  static getServerByUid(uid) {
    return getServerConfigs().find((server) => server.uid === uid);
  }

  getServerList() {
    const table = new Table({
      head: ['name', 'username', 'host', 'created_at']
    });
    this.servers.forEach((server) => {
      table.push([server.name, server.username, server.host, server.created_at]);
    });

    console.log(table.toString());
    console.log(
      `You can view more configuration content in ${SURGEJS_CONFIG_JSON_PATH}`.brightYellow
    );
  }

  async inputServerConfig(list) {
    const questions = [
      {
        type: 'input',
        name: 'host',
        message: 'Host: ',
        required: true,
        validate(value) {
          return list.find((server) => server.host === value) ? 'Host already exists' : true;
        }
      },
      {
        type: 'input',
        name: 'port',
        default: 22,
        message: 'Port (Default 22): '
      },
      {
        type: 'input',
        name: 'username',
        default: 'root',
        message: 'Username (Default root): '
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

    const answers = await inquirer.prompt(questions);

    const questionsNext = [
      {
        type: 'input',
        name: 'name',
        message: '[optional] You can give the current configuration a name: ',
        validate(value) {
          return list.find((server) => server.name === value) ? 'Server name already exists' : true;
        }
      }
    ];

    if (answers.connectMethod === 1) {
      questionsNext.unshift({
        type: 'password',
        name: 'password',
        message: 'Password: '
      });
    } else if (answers.connectMethod === 2) {
      questionsNext.unshift({
        type: 'input',
        name: 'privateKeyPath',
        default: getValueForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH, ''),
        message: 'Private key path: '
      });
    }

    const answersNext = await inquirer.prompt(questionsNext);

    return Promise.resolve({
      ...answers,
      ...answersNext
    });
  }

  async choose(uid) {
    if (this.servers.length === 0) {
      $message.warning('No servers found, please add first~');
      await this.create();
    } else {
      await this.select(uid);
    }
  }
};
