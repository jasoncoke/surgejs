require('colors');
const fs = require('fs');

// Create necessary files
fs.writeFileSync('.env', '')
fs.writeFileSync('config.json', '{}')
