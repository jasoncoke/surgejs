module.exports = class ProgressBar {
  constructor(options) {
    this.total = options.total;
    this.options = {
      barCount: 50,
      ...options,
    };
    this.percent = 0;
    this.bar = '';
    this.barLength = 20;
    this.barChar = '█';
    this.emptyChar = '░';
    this.progressChar = '>';
    this.progress = 0;
    this.progressChar = '>';
    this.progressStr = '';
    this._current = 0;

    this.init();
  }

  init() {
    for (let index = 0; index < this.options.barCount; index++) {
      this.progressStr += this.emptyChar;
    }

    console.log(`\n${this.progressStr}`);
  }

  get current() {
    return this._current;
  }
  set current(value) {
    this._current = value;
    this.getProgressStr()
  }

  getProgressStr() {
    let progressStr = '';
    for (let index = 0; index < this.options.barCount; index++) {
      progressStr += this.emptyChar;
    }
    const progress = Math.round((this.current / this.total) * this.options.barCount);

    if (this.current <= this.total) {
      process.stdout.write('\x1B[2A\x1B[K');
      console.log(`\n${this.barChar.repeat(progress) + progressStr.slice(progress)}`.brightGreen, `${this.current}/${this.total}`);
    }
  }
}
