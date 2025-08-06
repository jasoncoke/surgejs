'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const ValidationException = require('../exceptions/ValidationException');
const Server = require('./ServerAction');
const deploySftp = require('../../providers/sftpProvider');
const { getFormatDate } = require('../utils/helper');
const { CHANNEL_PROJECTS, getProjectConfigs, updateSingleConfig } = require('../utils/config');

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
  await server.choose(configs.server_uid);

  return Promise.resolve({
    ...answers,
    server_uid: server.activeServer.uid
  });
}

module.exports = class Deploy extends require('./ActionConstructor') {
  constructor(args, options) {
    super(args, options);

    this.projects = getProjectConfigs();
    this.rootPath = process.cwd();

    const project = this.projects.find((project) => project.rootPath === this.rootPath);

    this.configs = project ?? {
      rootPath: process.cwd()
    };
  }

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
   * Save the configuration list to a file
   */
  save() {
    updateSingleConfig(CHANNEL_PROJECTS, this.projects);
  }

  clean() {}

  /**
   * Update or insert configuration information
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

  getSftpConfig(server) {
    const sftpConfig = {
      host: server.host,
      port: server.port,
      username: server.username
    };

    if (server.connectMethod === 1) {
      sftpConfig.password = server.password;
    } else if (server.connectMethod === 2) {
      sftpConfig.privateKey = fs.readFileSync(server.privateKeyPath);
    }

    return sftpConfig;
  }
};
