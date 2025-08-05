"use strict";

const fs = require('fs');
const path = require('path');

module.exports.getFormatDate = function (date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

module.exports.formatNumber = function (number) {
  const numStr = String(number);
  const [integerPart, decimalPart] = numStr.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedDecimal = decimalPart ? `.${decimalPart}` : '';

  return formattedInteger + formattedDecimal;
}

module.exports.getFolderSize = function (folderPath) {
  let totalSize = 0;
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      totalSize += getFolderSize(filePath);
    } else {
      // 如果是文件，则累加其大小
      totalSize += stats.size;
    }
  });
  return totalSize;
}

module.exports.formatBytes = function (bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports.displayOptions = function (options, selectedIndex) {
  options.forEach((option, index) => {
    console.log(`${index === selectedIndex ? `* ${option.label}`.green : `  ${option.label}`} `);
  });
}

module.exports.readJsonFile = function (fileName) {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../..', `${fileName}.json`), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
}

module.exports.writeJsonFile = function (fileName, key, value) {
  try {
    const data = readJsonFile(fileName);
    if (value) {
      data[key] = value;
    } else {
      delete data[key];
    }

    fs.writeFileSync(path.resolve(__dirname, '../..', `${fileName}.json`), JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
}

module.exports.isDirectory = function (path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}
