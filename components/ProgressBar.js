'use strict';

const ora = require('ora');

module.exports = class ProgressBar {
  _text = '';

  constructor() {
    this.progress = 0;
    this.spinner = ora();

    this.setEmptyBarCharacter('░'.gray)
      .setBarCharacter('█'.green)
      .setProgressPrefix('')
      .setProgressWidth(50)
      .setProgressSuffix(
        ({ progress, max, breakLine }) => `${breakLine ? '\n ' : ''} ${progress} / ${max}`
      );

    return this;
  }

  /**
   *
   * @param {string} char
   */
  setEmptyBarCharacter(char) {
    this.emptyChar = char;

    return this;
  }

  /**
   *
   * @param {string} char
   * @returns {ProgressBar}
   */
  setBarCharacter(char) {
    this.barChar = char;

    return this;
  }

  /**
   *
   * @param {number} char
   * @returns {ProgressBar}
   */
  setProgressWidth(width) {
    this.progressWidth = width;

    return this;
  }

  /**
   *
   * @param {string} text
   * @returns {ProgressBar}
   */
  setProgressPrefix(text, { breakLine } = { breakLine: false }) {
    this.progressPrefix = text + (breakLine ? '\n ' : '');

    return this;
  }

  /**
   * @param {function(Object): string} callback
   * @param {number} callback.progress
   * @param {number} callback.max
   * @returns {void}
   * @example
   * setProgressSuffix(({ progress, max }) => `${progress} / ${max}`);
   */
  setProgressSuffix(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (callback) {
      this.progressSuffixCallback = callback;
      this.progressSuffix = callback({
        progress: this.progress,
        max: this.max,
        breakLine: false
      });
    }

    return this;
  }

  /**
   *
   * @param {string} text
   * @returns {ProgressBar}
   */
  start(text) {
    this._text = text;
    this.spinner.start(this._text);

    return this;
  }

  /**
   *
   * @param {number} max
   * @returns {ProgressBar}
   */
  startProgress(max) {
    this.max = max;
    this.progress = 0;

    this._buildProgressBar();
    this.spinner.start();

    return this;
  }

  _buildProgressBarTemplate($chars) {
    return `${this.progressPrefix} ${$chars} ${this.progressSuffix}`;
  }

  _buildProgressBar() {
    const fillCount = Math.min(
      Math.round((this.progress / this.max) * this.progressWidth),
      this.progressWidth
    );
    const emptyCount = this.progressWidth - fillCount;

    this.progressSuffixCallback && this.setProgressSuffix(this.progressSuffixCallback);
    this._text = this._buildProgressBarTemplate(
      this.barChar.repeat(fillCount) + this.emptyChar.repeat(emptyCount)
    );
    this.spinner.text = this._text;
  }

  /**
   *
   * @returns {ProgressBar}
   */
  succeedAndHold() {
    this.spinner.stopAndPersist({
      symbol: '✔'.green
    });

    return this;
  }

  /**
   *
   * @param {number} step
   * @returns {ProgressBar}
   */
  advance(step = 1) {
    this.progress += step;
    this._buildProgressBar();

    return this;
  }

  /**
   *
   * @returns {ProgressBar}
   */
  succeed() {
    return this;
  }

  /**
   *
   * @param {string} text
   * @returns {ProgressBar}
   */
  finish(text) {
    if (text) {
      this.setProgressPrefix(text);
    }

    this.spinner.succeed(this._buildProgressBar());
  }

  /**
   *
   * @param {string} text
   * @returns {ProgressBar}
   */
  fail(text) {
    this.spinner.fail(text);

    return this;
  }
};
