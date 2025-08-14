'use strict';

const inquirer = require('inquirer');

const ValidationException = require('../exceptions/ValidationException');
const {
  getFormatDate,
  getPrivateKetPath,
  generateSimpleHash,
  stringify
} = require('../utils/helper');
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

    this.servers = getServerConfigs();
  }

  async create() {
    return this.upsert(await this.askQuestions());
  }

  /**
   *
   * @param {object} attributes
   */
  upsert(attributes) {
    if (!attributes.uid) {
      attributes.createdAt = getFormatDate();
      attributes.uid = generateSimpleHash(stringify(attributes));

      if (attributes.authMethod === 2) {
        updateConfigForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH, attributes.privateKeyPath);
      }

      this.servers.push(attributes);
    } else {
      this.servers = this.servers.filter((item) => item.uid !== attributes.uid).concat(attributes);
    }

    this._saveToFile();
    return attributes.uid;
  }

  _saveToFile() {
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
      this._saveToFile();
      $message.success(`Server「 ${value} 」 removed successfully!`);
    }
  }

  /**
   *
   * @param {array[]} serverChoices
   * @param {string} message
   * @returns {Promise<string>} selected server UID
   */
  async select(serverChoices, message = 'Please select a server: ') {
    const defaultChooseIndex = serverChoices.findIndex((choice) => choice.default);

    const questions = [
      {
        type: 'list',
        name: 'selectedServerUid',
        default: defaultChooseIndex,
        message: message,
        choices: serverChoices
      }
    ];

    const { selectedServerUid } = await inquirer.prompt(questions);

    return Promise.resolve(selectedServerUid);
  }

  /**
   * Build choose list
   * @param {object} options
   * @param {array} options.filter_uids Specify a uid set
   * @param {number} options.point_uid
   * @return {array}
   */
  buildChooseList({ filter_uids, point_uid } = { filter_uids: [], point_uid: 0 }) {
    return this.servers
      .filter((server) => {
        if (filter_uids && Array.isArray(filter_uids) && filter_uids.length > 0) {
          return filter_uids.includes(server.uid);
        }

        return true;
      })
      .map((server) => {
        const { uid, name, host } = server;

        return {
          default: point_uid === uid,
          name: (point_uid === uid ? '[Last choice] ' : '') + `${name} (${host})`,
          value: uid
        };
      });
  }

  static getServerByUid(uid) {
    return getServerConfigs().find((server) => server.uid === uid);
  }

  async askQuestions(uid) {
    return this._inputServerQuestions(this.servers, uid);
  }

  async _inputServerQuestions(servers, pointUid = 0) {
    const server = servers.find((server) => server.uid === pointUid);

    const questions = [
      {
        type: 'input',
        name: 'host',
        message: 'Host: ',
        default: server?.host || null,
        required: true,
        validate(value) {
          if (!value) return 'Host cannot be empty';

          return !pointUid && servers.find((server) => server.host === value)
            ? 'Host already exists'
            : true;
        }
      },
      {
        type: 'input',
        name: 'port',
        message: 'Port: ',
        default: server?.port || 22
      },
      {
        type: 'input',
        name: 'username',
        message: 'Username: ',
        default: server?.username || 'root'
      },
      {
        type: 'list',
        name: 'authMethod',
        message: 'Select authentication method: ',
        default: server?.authMethod - 1 || 0,
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
        default: server?.name || null,
        validate(value) {
          return !pointUid && servers.find((server) => server.name === value)
            ? 'Server name already exists'
            : true;
        }
      }
    ];

    if (answers.authMethod === 1) {
      questionsNext.unshift({
        type: 'password',
        name: 'password',
        message: 'Password: ',
        default: server?.password || null
      });
    } else if (answers.authMethod === 2) {
      questionsNext.unshift({
        type: 'input',
        name: 'privateKeyPath',
        default:
          server?.privateKeyPath ||
          getValueForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH) ||
          getPrivateKetPath() ||
          null,
        message: 'Private key path: '
      });
    }

    const answersNext = await inquirer.prompt(questionsNext);

    const allAnswers = Object.assign(server ?? {}, answers, answersNext);

    return Promise.resolve(allAnswers);
  }

  /**
   *
   * @param {number|null} uid
   */
  async choose(uid) {
    if (this.servers.length === 0) {
      $message.warning('No server configuration available, please create one first~');
      return await this.create();
    } else {
      const servers = this.buildChooseList({
        point_uid: uid
      }).concat({
        name: 'Create a new server',
        value: 'create'
      });

      const activeUid = await this.select(servers);

      if (activeUid === 'create') {
        return await this.create();
      }

      return activeUid;
    }
  }

  /**
   *
   * @param {string} keyword
   * @returns {array<number>}
   */
  searchByKeyword(keyword) {
    return this.servers
      .filter((server) => {
        return (
          server.name.includes(keyword) ||
          server.host.includes(keyword) ||
          server.uid.toString().includes(keyword)
        );
      })
      .map((server) => server.uid);
  }
};
