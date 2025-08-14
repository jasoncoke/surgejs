# surgejs - A front-end rapid deployment tool

![version-0.1.5-blue](./vendor/images/version-0.1.5-blue.svg)

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

It’s easier to show than tell, so let’s get started!

The following command will deploy the packaged files in the current directory to the server.

```bash
$ surgejs deploy
```

Run `surgejs --help` to see the following overview of the `surgejs` command...

```bash
Usage: surgejs [command] [sub-command] [options] [<value>]

Options:
  -v, --version     Output the current version
  -h, --help        Display help information

Commands:
  deploy [command]            Deploy project to server
  server [command] [options]  Add, delete, modify and check the saved server list
  show [options]              Diaplay something

```

#### Deploy

Deploy your project to server:

```bash
surgejs deploy          # Deploy current project
surgejs deploy init     # Initialize deployment configuration
```

#### Show

Display server or project information:

```bash
surgejs show --server    # Show server information (-s shorthand)
surgejs show --project   # Show project information (-p shorthand)
```

#### Server

Manage your server configurations:

```bash
surgejs server create           # Create a new server configuration
```



### Examples

For convenience, usually execute the command in the root directory of the project.

> All configuration items can be found in the configuration file in the root directory of the package.

If you are deploying the current project for the first time, please use `surgejs deploy init` to initialize it and follow the prompts to complete it.

Initialize a new deployment configuration:

```bash
surgejs deploy init
```

After the initialization is successful, you can use `surgejs deploy` to deploy your project.

```bash
surgejs deploy
```

Display the configuration information in the current directory:

```bash
surgejs show
```

To reconfigure or overwrite the current directory configuration, you can use:

```bash
surgejs deploy init
```



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

#### Future plans

- [ ] Compatible with Amazon S3
- [ ] Improve terminal commands
