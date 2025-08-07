'use strict';

module.exports = class ActionConstructor {
  /**
   *
   * @param {array} args
   * @param {object} options
   */
  constructor(options, commander) {
    this.options = options;
    this.commander = commander;
  }
};
