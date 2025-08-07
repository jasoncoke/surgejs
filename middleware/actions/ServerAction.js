'use strict';

const inquirer = require('inquirer');

const ValidationException = require('../exceptions/ValidationException');
const { getFormatDate, generateSimpleHash, stringify } = require('../utils/helper');
const {
  CHANNEL_USER,
  CHANNEL_SERVERS,
  USER_KEY_SSH_PRIVATE_PATH,
  getServerConfigs,
  getValueForObject,
  updateSingleConfig,
  updateConfigForObject
} = require('../utils/config');

module.exports = class Server extends require('./ActionConstructor') {
  constructor(options, commander) {
    super(options, commander);

    this.uid = null;
    this.servers = getServerConfigs();
  }

  async create() {
    this.configs = await this.inputServerConfig(this.servers);

    this._save();
  }

  _save() {
    const params = {
      ...this.configs,
      createdAt: getFormatDate()
    };

    params.uid = generateSimpleHash(stringify(params));

    // 保存至 env
    if (params.authMethod === 2) {
      updateConfigForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH, params.privateKeyPath);
    }

    this.uid = params.uid;
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
        'Server not found! You can use "surgejs show --server" to view all servers'
      );
    } else {
      this.servers = this.servers.filter((item) => item.host !== server.host);
      this.write();
      $message.success(`Server「 ${value} 」 removed successfully!`);
    }
  }

  async select(uid) {
    const defaultChooseIndex = this.servers.findIndex((server) => server.uid === uid);

    const questions = [
      {
        type: 'list',
        name: 'selectedServerUid',
        default: defaultChooseIndex,
        message: 'Select or add a server: ',
        choices: this.servers
          .map((server, index) => {
            const choice = {
              name: `${server.name} - ${server.host}`,
              value: server.uid
            };

            if (defaultChooseIndex === index) {
              choice.name = '[Last choice] ' + choice.name;
            }

            return choice;
          })
          .concat({
            name: 'Create a new server',
            value: 'create'
          })
      }
    ];

    const { selectedServerUid } = await inquirer.prompt(questions);

    if (selectedServerUid === 'create') {
      await this.create();
    } else {
      this.uid = selectedServerUid;
    }
  }

  static getServerByUid(uid) {
    return getServerConfigs().find((server) => server.uid === uid);
  }

  async inputServerConfig(list) {
    const questions = [
      {
        type: 'input',
        name: 'host',
        message: 'Host: ',
        required: true,
        validate(value) {
          if (!value) return 'Host cannot be empty';
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
        name: 'authMethod',
        message: 'Select authentication method: ',
        choices: [
          { value: 1, name: 'Password Authentication' },
          { value: 2, name: 'Key-based Authentication' }
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

    if (answers.authMethod === 1) {
      questionsNext.unshift({
        type: 'password',
        name: 'password',
        message: 'Password: '
      });
    } else if (answers.authMethod === 2) {
      questionsNext.unshift({
        type: 'input',
        name: 'privateKeyPath',
        default: getValueForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH, ''),
        message: 'Private key path: '
      });
    }

    const answersNext = await inquirer.prompt(questionsNext);

    const allAnswers = Object.assign(answers, answersNext);
    if (allAnswers.authMethod === 2) {
      delete allAnswers.privateKeyPath;
    }

    return Promise.resolve(allAnswers);
  }

  async choose(uid) {
    if (this.servers.length === 0) {
      $message.warning('No server configuration available, please create one first~');
      await this.create();
    } else {
      await this.select(uid);
    }
  }

  searchByKeyword(keyword) {
    return this.servers
      .filter((server) => {
        return (
          server.name.includes(keyword) ||
          server.host.includes(keyword) ||
          server.uid.includes(keyword)
        );
      })
      .map((server) => server.uid);
  }
};
