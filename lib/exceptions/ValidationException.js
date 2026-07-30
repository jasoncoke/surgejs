'use strict';

const ExceptionConstructor = require('./ExceptionConstructor');

/**
 * Exception thrown for validation errors.
 * @class ValidationException
 * @extends ExceptionConstructor
 */
module.exports = class ValidationException extends ExceptionConstructor {
  /**
   * @param {string} message
   */
  constructor(channel, message, code = 1) {
    super(channel, message, code);

    this.output();
  }

  static throw(channel, message, code = 1) {
    return new ValidationException(channel, message, code);
  }
};
