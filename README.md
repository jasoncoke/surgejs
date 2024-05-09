# surgejs

This tool can help you quickly and easily deploy front-end tools as a terminal script command.

### Install

```bash
$ npm install -g surgejs
----- or -----
$ yarn add surgejs -g

# You can use the surgejs command to verify whether the installation is successful.
$ surgejs
```

> After successful installation, surgejs will create some necessary files in the package root directory, including configuration files.

### Usage

It’s easier to show than tell, so let’s get started! The following command will deploy the packaged files in the current directory to the server.

```bash
$ surgejs deploy
```

Run `surgejs --help` to see the following overview of the `surgejs` command...

```bash
Usage: surgejs [command] [options]

Options:
  -v, --version     output the current version
  -h, --help        display help for command

Commands:
  config [options]  Configuration variables
  deploy [options]  Deploy project to server
  show              Diaplay something
  server [options]  Add, delete, modify and check the saved server list
```

### Example

For convenience, usually execute the command in the root directory of the project.

If you are deploying the current project for the first time, please use `surgejs deploy init` to initialize it and follow the prompts to complete it.

After the initialization is successful, you can use `surgejs deploy` to deploy your project.

> All configuration items can be found in the configuration file in the root directory of the package.