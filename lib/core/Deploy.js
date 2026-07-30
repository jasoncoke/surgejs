'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const ValidationException = require('../exceptions/ValidationException');
const Server = require('./Server');
const deploySftp = require('../providers/sftpProvider');
const { getFormatDate } = require('../utils/helper');
const {
  CHANNEL_PROJECTS,
  CHANNEL_USER,
  USER_KEY_SSH_PRIVATE_PATH,
  getProjectConfigs,
  getValueForObject,
  updateSingleConfig
} = require('../utils/config');

/**
 * Prompt user for deployment configuration via interactive CLI.
 * @param {Object} configs - Existing project configuration.
 * @returns {Promise<Object>} User input combined with selected server UID.
 */
async function inputDeployConfig(configs) {
  const questions = [
    {
      type: 'input',
      name: 'folderName',
      default: configs.folderName ?? 'dist',
      message: `Enter the deployment folder name: ${process.cwd()}/`
    },
    {
      type: 'input',
      name: 'remotePath',
      default: configs.remotePath ?? '',
      message: 'Enter the remote file path: '
    }
  ];

  const answers = await inquirer.prompt(questions);

  const server = new Server();
  const uid = await server.choose(configs.server_uid);

  return Promise.resolve({
    ...answers,
    server_uid: uid
  });
}

/**
 * Handles project deployment to remote servers via SFTP.
 * @class Deploy
 * @extends ActionConstructor
 */
module.exports = class Deploy extends require('./ActionConstructor') {
  /**
   * Creates an instance of Deploy.
   * @param {Object} options - CLI options.
   * @param {Object} commander - Commander.js instance.
   */
  constructor(options, commander) {
    super(options, commander);

    this.projects = getProjectConfigs();
    this.rootPath = process.cwd();

    const project = this.projects.find((project) => project.rootPath === this.rootPath);

    this.configs = project ?? {
      rootPath: process.cwd()
    };
  }

  /**
   * Initializes deployment configuration for the current project.
   * @returns {Promise<void>}
   */
  async init() {
    const configs = await inputDeployConfig(this.configs);
    this.configs = {
      ...this.configs,
      ...configs,
      localPath: path.resolve(this.configs.rootPath, configs.folderName)
    };

    this.upsert();
    this.save();
  }

  /**
   * Saves the project configurations to the config file.
   * @returns {void}
   */
  save() {
    updateSingleConfig(CHANNEL_PROJECTS, this.projects);
  }

  clean() {}

  /**
   * Updates existing or inserts new project configuration.
   * @returns {void}
   */
  upsert() {
    this.configs.updated_at = getFormatDate();
    const data = this.projects.find((project) => project.rootPath === this.configs.rootPath);

    if (data) {
      Object.assign(data, this.configs);
    } else {
      this.projects.push(this.configs);
    }
  }

  /**
   * Executes the deployment process to the configured remote server.
   * @returns {void}
   */
  deploy() {
    const currentProject = this.projects.find(
      (project) => project.rootPath === this.configs.rootPath
    );

    if (!currentProject) {
      return ValidationException.throw(
        'Deploy failed',
        'Project not found! Please use [ surgejs deploy init ] to initialize the current project.'
      );
    }

    const server = Server.getServerByUid(currentProject.server_uid);
    $message.info(`Deploying project to ${server.name || server.host}...`);

    deploySftp({
      localPath: currentProject.localPath,
      remotePath: currentProject.remotePath,
      sftpConfig: this.getSftpConfig(server)
    });
  }

  /**
   * Builds SFTP configuration from server data.
   * @param {Object} server - Server configuration object.
   * @returns {Object} SFTP configuration object.
   */
  getSftpConfig(server) {
    const sftpConfig = {
      host: server.host,
      port: server.port,
      username: server.username
    };

    if (server.authMethod === 1) {
      sftpConfig.password = server.password;
    } else if (server.authMethod === 2) {
      sftpConfig.privateKey = fs.readFileSync(
        getValueForObject(CHANNEL_USER, USER_KEY_SSH_PRIVATE_PATH)
      );
    }

    return sftpConfig;
  }
};
