'use strict';

module.exports = class ExceptionConstructor {
  /**
   *
   * @param {string} channel
   * @param {string} message
   * @param {number} code
   */
  constructor(channel, message, code = 1) {
    this.channel = channel;
    this.message = message;
    this.code = code;

    this.errorInstance = new Error(message);
    this.setStackDepth();
  }

  setStackDepth(depth = 4) {
    this.stackDepth = depth;

    return this;
  }

  getTracesAsString() {
    const stackLines = this.errorInstance.stack.split('\n');
    const limitedStack = stackLines.slice(1, this.stackDepth + 1).join('\n');

    return limitedStack;
  }

  output() {
    const message = `${this.channel}: ${this.message}`;
    const traces = this.getTracesAsString();

    console.log(message.red + '\n' + traces.yellow);
    this.exit();
  }

  exit() {
    process.exit(this.code);
  }
};
