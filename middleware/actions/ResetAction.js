'use strict';

const ActionConstructor = require('./ActionConstructor');

module.exports = class Reset extends ActionConstructor {
  constructor(options, commander) {
    super(options, commander);
  }
};
