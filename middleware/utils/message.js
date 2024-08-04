const { MESSAGE_TYPE_TO_COLOR_MAP } = require('./constants');

global.$message = function (message = '', type = 'info') {
  console.log(message[MESSAGE_TYPE_TO_COLOR_MAP[type]]);
}

$message.success = function (message) {
  return $message(message, 'success')
}

$message.warning = function (message) {
  return $message(message, 'warning')
}

$message.error = function (message) {
  return $message(message, 'error')
}

$message.info = function (message) {
  return $message(message, 'info')
}