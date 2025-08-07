'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');

/**
 *
 * @param {Date} date
 * @returns {string}
 */
module.exports.getFormatDate = function (date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

/**
 *
 * @param {number} number
 * @returns {string}
 */
module.exports.formatNumber = function (number) {
  const numStr = String(number);
  const [integerPart, decimalPart] = numStr.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDecimal = decimalPart ? `.${decimalPart}` : '';

  return formattedInteger + formattedDecimal;
};

/**
 *
 * @param {string} folderPath
 * @returns {number}
 */
module.exports.getFolderInfo = function (folderPath) {
  let totalFiles = 0;
  let totalSize = 0;

  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const { size, count } = module.exports.getFolderInfo(filePath);
      totalFiles += count;
      totalSize += size;
    } else {
      totalFiles++;
      totalSize += stats.size;
    }
  });

  return {
    size: totalSize,
    count: totalFiles
  };
};

/**
 *
 * @param {number} bytes
 * @param {number} decimals
 * @returns {number}
 */
module.exports.formatBytes = function (bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 *
 * @param {array} options
 * @param {number} selectedIndex
 */
module.exports.displayOptions = function (options, selectedIndex) {
  options.forEach((option, index) => {
    console.log(`${index === selectedIndex ? `* ${option.label}`.green : `  ${option.label}`} `);
  });
};

/**
 *
 * @param {string} path
 * @returns {boolean}
 */
module.exports.isDirectory = function (path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};

/**
 *
 * @returns {string}
 */
module.exports.getPlatForm = function () {
  const osValue = process.platform;

  if (osValue == 'darwin') {
    return 'Mac OS';
  } else if (osValue == 'win32') {
    return 'Window OS';
  } else if (osValue == 'linux') {
    return 'Linux OS';
  } else {
    return 'Unknown OS';
  }
};

/**
 *
 * @returns {string}
 */
module.exports.getPrivateKetPath = function () {
  const platform = module.exports.getPlatForm();
  const homeDir = os.homedir();

  switch (platform) {
    case 'Mac OS':
    case 'Linux OS':
    case 'Window OS':
      return path.join(homeDir, '.ssh', 'id_rsa');

    default:
      return '';
  }
};

/**
 *
 * @param {string} string
 * @returns {number}
 */
module.exports.generateSimpleHash = function (string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }

  return Math.abs(hash);
};

/**
 *
 * @param {object} object
 * @param {string} symbol
 * @returns {string}
 */
module.exports.stringify = function (object, symbol = '&') {
  const sortedObject = Object.keys(object)
    .sort()
    .reduce((acc, key) => {
      acc[key] = object[key];
      return acc;
    }, {});

  const array = [];
  for (const key in sortedObject) {
    array.push(`${key}=${sortedObject[key]}`);
  }

  return array.join(symbol);
};

module.exports.prettierPrint = function (content, split = ':') {
  const rows = content.split('\n');
  const data = rows.map((row) => {
    const [label, ...values] = row.split(split);
    return {
      label,
      value: values.join(split)
    };
  });
  const labels = data.map((item) => item.label);
  const maxLabelLength = Math.max(...labels.map((label) => label.length));
  const maxValueLength = Math.max(...data.map((item) => item.value.length));
  const maxRowLength = maxLabelLength + maxValueLength + 2;

  const horizontalLine = '═'.repeat(maxRowLength + 3);
  const topBorder = `╔${horizontalLine}╗`;
  const bottomBorder = `╚${horizontalLine}╝`;

  console.log(topBorder);

  data.forEach(({ label, value }, index) => {
    const paddedLabel = label.padStart(maxLabelLength, ' ');
    console.log(
      `║ ${paddedLabel}: ${value}${' '.repeat(Math.abs(maxRowLength - paddedLabel.length - value.length))}║`
    );
  });

  console.log(bottomBorder);
};
