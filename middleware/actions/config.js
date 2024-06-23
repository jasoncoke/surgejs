module.exports = class Config {
  constructor() {
    this.CONFIG_KEY = 'projects';
    this.list = readJsonFile('config')[this.CONFIG_KEY] || [];

    this.configs = {
      rootPath: process.cwd()
    };
  }
}