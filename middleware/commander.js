const { Command } = require('commander');
const terminal = require('./terminal');
const package = require('../package.json');

const Buffer = require('buffer').Buffer;

const welcomeStr = Buffer.from('CiAgIF9fXyAgICAgXyAgIF8gICAgIF9fXyAgICAgIF9fXyAgICAgIF9fXyAgICAgICAgICAgICAgICAgICBfICAgICBfX18gICAKICAvIF9ffCAgIHwgfCB8IHwgICB8IF8gXCAgICAvIF9ffCAgICB8IF9ffCAgICAgIG8gTyBPICAgIF8gfCB8ICAgLyBfX3wgIAogIFxfXyBcICAgfCB8X3wgfCAgIHwgICAvICAgfCAoXyB8ICAgIHwgX3wgICAgICBvICAgICAgICB8IHx8IHwgICBcX18gXCAgCiAgfF9fXy8gICAgXF9fXy8gICAgfF98X1wgICAgXF9fX3wgICAgfF9fX3wgICAgVFNfX1tPXSAgIF9cX18vICAgIHxfX18vICAKX3wiIiIiInwgX3wiIiIiInwgX3wiIiIiInwgX3wiIiIiInwgX3wiIiIiInwgIHs9PT09PT18IF98IiIiIiJ8IF98IiIiIiJ8IAoiYC0wLTAtJyAiYC0wLTAtJyAiYC0wLTAtJyAiYC0wLTAtJyAiYC0wLTAtJyAuL28tLTAwMCcgImAtMC0wLScgImAtMC0wLScgCg==', 'base64').toString('utf-8');

const program = new Command();

Object.entries(terminal).forEach(([key, value]) => {
  const command = program.command(key).description(value.description).action(value.action);

  if (value.options && Array.isArray(value.options) && value.options.length) {
    value.options.forEach(option => {
      option && command.option(option[0], option[1], option[2]);
    });
  }
});

program.version(package.version, '-v, --version', 'output the current version');
program.usage(`[command] [options]`)

program.action((args, options) => {
  if (options.args.length === 0) {
    console.log(welcomeStr.brightGreen);
    program.help();
  }
});

program.parse(process.argv);

if (program.args.length === 1) {
  console.log(program.help(program.args[0]));
}
