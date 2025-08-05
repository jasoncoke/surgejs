'use strict';

const { INFO, WARNING, ERROR, SUCCESS } = require('../constants/messageType');
const { WHITE, GREEN, RED, YELLOW } = require('../constants/messageColor');

const TYPE_TO_COLOR_MAPPING = {
  [INFO]: WHITE,
  [WARNING]: YELLOW,
  [ERROR]: RED,
  [SUCCESS]: GREEN
};

global.$message = function (message = '', type = INFO) {
  console.log(message[TYPE_TO_COLOR_MAPPING[type]]);
};

$message.success = function (message) {
  return $message(message, SUCCESS);
};

$message.warning = function (message) {
  return $message(message, WARNING);
};

$message.error = function (message) {
  return $message(message, ERROR);
};

$message.info = function (message) {
  return $message(message, INFO);
};
