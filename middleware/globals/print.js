global.Print = class Print {
  constructor(props) {
    if (typeof props === 'string') {
      this.printMessage(props)
    } else {
      this.printMessage(props.message, props.type)
    }
  }

  TYPE_TO_COLOR_MAP = {
    'info': 'white',
    'success': 'green',
    'error': 'red',
    'warning': 'yellow',
    'prompt': 'magenta'
  }

  printMessage(message, type = this.TYPE_TO_COLOR_MAP['info']) {
    console.log(message[this.TYPE_TO_COLOR_MAP[type]]);
  }
}
