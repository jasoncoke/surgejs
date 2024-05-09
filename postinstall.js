require('colors');
const fs = require('fs');

// 创建必要文件
// 创建 .env 文件
fs.writeFileSync('.env', '')
// 创建 config.json 文件
fs.writeFileSync('config.json', '{}')

console.log('Now you can use surgejs.'.green)
