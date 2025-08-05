'use strict';

const ActionConstructor = require('./ActionConstructor');

module.exports = class Reset extends ActionConstructor {
  constructor(args, options) {
    super(args, options);
    console.log('target output >>> this.args', this.args);
    console.log('target output >>> this.args', args);
    // console.log('target output >>> this.options', this.options);
  }
};
