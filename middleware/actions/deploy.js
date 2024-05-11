const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const Server = require('./server');
const deploySftp = require('../sftp');
const { readJsonFile, writeJsonFile } = require('../helper');

async function inputDeployConfig() {
  const questions = [
    {
      type: 'input',
      name: 'folderName',
      default: `dist`,
      message: `Enter the deployment folder name: ${process.cwd()}/`,
    },
    {
      type: 'input',
      name: 'remotePath',
      message: 'Enter the remote file path: ',
    },
  ]

  const answers = await inquirer.prompt(questions)

  const server = new Server();
  if (server.list.length === 0) {
    new Print({
      message: 'You do not have any optional servers, please add first.',
      type: 'warnning',
    })
    await server.add()
  } else {
    await server.select()
  }

  return Promise.resolve({
    ...answers,
    host: server.activeServer.host,
  })
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
    const configs = await inputDeployConfig()
    this.configs = {
      ...this.configs,
      ...configs,
      localPath: path.resolve(this.configs.rootPath, configs.folderName)
    }

    this.list.push(this.configs)
    this.save()
  }

  save() {
    writeJsonFile('config', this.CONFIG_KEY, this.list)
  }

  clean() { }

  deploy() {
    const currentProject = this.list.find(project => project.rootPath === this.configs.rootPath)
    if (!currentProject) {
      new Print({
        message: 'Project not found! Please use [ surgejs deploy init ] to initialize the current project.',
        type: 'error',
      })
    } else {
      const server = new Server().getServerByHost(currentProject.host);
      new Print({
        message: `\nDeploying project to ${server.name || server.host}...`,
        type: 'info',
      })

      deploySftp({
        localPath: currentProject.localPath,
        remotePath: currentProject.remotePath,
        sftpConfig: this.getSftpConfig(server)
      })
    }
  }

  getSftpConfig(server) {
    const sftpConfig = {
      host: server.host,
      port: server.port,
      username: server.username,
    }

    if (server.connectMethod === 1) {
      sftpConfig.password = server.password
    } else if (server.connectMethod === 2) {
      sftpConfig.privateKey = fs.readFileSync(server.privateKeyPath)
    }

    return sftpConfig
  }
}
