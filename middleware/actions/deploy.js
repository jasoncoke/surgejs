require('colors');
const inquirer = require('inquirer');

const Server = require('./server')

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

  console.log(server.activeServer);
}

module.exports = class Deploy {
  constructor(props = {
    rootDir: process.cwd(),
  }) {
    this.CONFIG_KEY = 'projects';
  }

  async init() {
    await inputDeployConfig()
  }

  save() { }

  clean() { }
}
