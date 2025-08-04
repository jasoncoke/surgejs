const Table = require('cli-table3');
const { readJsonFile, writeJsonFile } = require('../utils/helper');

module.exports = class Show {
  constructor() {
    this.configData = readJsonFile('config');
  }

  getServerList() {
    const table = new Table({
      head: ['name', 'host', 'created_time']
    });
    this.configData['servers'].forEach(server => {
      table.push([server.name, server.host, server.created_time]);
    })

    console.log(table.toString());
  }
}
