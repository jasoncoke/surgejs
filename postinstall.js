// This is the callback after installing this package
const fs = require('fs');
const path = require('path');

function createFile(fileName, content, filePath = path.resolve(__dirname, fileName)) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(fileName, content)
  }
}

// Create necessary files
createFile('.env', '')
createFile('config.json', '{}')
