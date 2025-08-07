'use strict';

const Table = require('cli-table3');
const Server = require('./ServerAction');
const { getServerConfigs, getProjectConfigs } = require('../utils/config');
const { prettierPrint } = require('../utils/helper');

module.exports = class Show extends require('./ActionConstructor') {
  constructor(options, commander) {
    super(options, commander);
  }

  showServerList() {
    const data = getServerConfigs();
    const headers = {
      uid: 'UID',
      name: 'Name',
      host: 'Host',
      authMethod: 'Authentication method',
      lastConnectedAt: 'Last Connected At',
      createdAt: 'Created At'
    };

    this._tableBuilder(
      Object.values(headers),
      data.map((item) => {
        const body = this._arrayPick(item, Object.keys(headers));
        switch (body.authMethod) {
          case 1:
            body.authMethod = 'Password Authentication';
          case 2:
            body.authMethod = 'Key-based Authentication';
        }

        return Object.values(body);
      })
    );
  }

  showProjectList() {
    const data = getProjectConfigs();
    const headers = {
      localPath: 'Local Path',
      remotePath: 'Remote Path'
    };

    this._tableBuilder(
      Object.values(headers),
      data.map((item) => {
        const body = this._arrayPick(item, Object.keys(headers));

        return Object.values(body);
      })
    );
  }

  showCurrent() {
    const projects = getProjectConfigs();
    const currentProject = projects.find((project) => project.rootPath === process.cwd());

    if (!currentProject) {
      $message.warning('The current directory has no relevant configuration');
      $message.info(
        'You can use "surgejs show --project" to display a list of all configured projects'
      );

      return false;
    }

    const relatedServer = Server.getServerByUid(currentProject.server_uid);

    const rows = [];
    rows.push(`Current project root path: ${currentProject.rootPath}`);
    rows.push(`Local path: ${currentProject.localPath}`);
    rows.push(`Remote path: ${currentProject.remotePath}`);
    rows.push(`Remote server name: ${relatedServer.name}`);
    rows.push(`Remote server host: ${relatedServer.host}`);

    prettierPrint(rows.join('\n'));
  }

  /**
   *
   * @param {array} headers
   * @param {array} bodies
   */
  _tableBuilder(headers, bodies) {
    const table = new Table({
      head: headers
    });

    bodies.forEach((item) => {
      table.push(item);
    });

    console.log(table.toString());
  }

  /**
   *
   * @param {object} $object
   * @param {array} $keys
   * @return {object}
   */
  _arrayPick(array, keys) {
    const newObject = {};
    keys.forEach((key) => {
      newObject[key] = array[key];
    });

    return newObject;
  }
};
