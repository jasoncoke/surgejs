'use strict';

module.exports = class ActionConstructor {
  /**
   * Creates an instance of ActionConstructor.
   * @param {object} options - The options object.
   * @param {object} commander - The commander instance.
   */
  constructor(options, commander) {
    this.options = options;
    this.commander = commander;
  }
};
