require('colors');
const inquirer = require('inquirer');

const Server = require('./server')
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
    console.log('You do not have any optional servers, please add first.'.yellow);
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
      console.log('Project not found'.bgRed, `Please use 'surgejs deploy init' to initialize the current project`.magenta);
    } else {
      const server = new Server().getServerByHost(currentProject.host);
      console.log(`Deploying project ${server.name}`.bgGreen);
    }
  }
}
