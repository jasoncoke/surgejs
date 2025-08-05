'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const ValidationException = require('../exceptions/ValidationException');
const Server = require('./ServerAction');
const deploySftp = require('../../providers/sftpProvider');
const { readJsonFile, writeJsonFile } = require('../utils/helper');

async function inputDeployConfig() {
  const questions = [
    {
      type: 'input',
      name: 'folderName',
      default: `dist`,
      message: `Enter the deployment folder name: ${process.cwd()}/`
    },
    {
      type: 'input',
      name: 'remotePath',
      message: 'Enter the remote file path: '
    }
  ];

  const answers = await inquirer.prompt(questions);

  const server = new Server();
  if (server.list.length === 0) {
    $message.warning('No servers found, please add first.');
    await server.create();
  } else {
    await server.select();
  }

  return Promise.resolve({
    ...answers,
    host: server.activeServer.host
  });
}

module.exports = class Deploy {
  constructor() {
    this.CONFIG_KEY = 'projects';
    this.list = readJsonFile('config')[this.CONFIG_KEY] || [];

    this.configs = {
      rootPath: process.cwd()
    };
  }

  async init() {
    const configs = await inputDeployConfig();
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
    writeJsonFile('config', this.CONFIG_KEY, this.list);
  }

  clean() {}

  /**
   * Update or insert configuration information
   */
  upsert() {
    const data = this.list.find((project) => project.rootPath === this.configs.rootPath);
    if (data) {
      Object.assign(data, this.configs);
    } else {
      this.list.push(this.configs);
    }
  }

  deploy() {
    const currentProject = this.list.find((project) => project.rootPath === this.configs.rootPath);
    if (!currentProject) {
      ValidationException.throw(
        'Deploy failed',
        'Project not found! Please use [ surgejs deploy init ] to initialize the current project.'
      );
    } else {
      const server = new Server().getServerByHost(currentProject.host);
      $message.info(`Deploying project to ${server.name || server.host}...`);

      deploySftp({
        localPath: currentProject.localPath,
        remotePath: currentProject.remotePath,
        sftpConfig: this.getSftpConfig(server)
      });
    }
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
