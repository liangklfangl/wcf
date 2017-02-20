#!/usr/bin/env node
const program = require('commander');
program.cwd=process.cwd();

program
  .version(require('../package.json').version, '-v, --version')
  .option('-w, --watch [delay]', 'watch file changes and rebuild')
  .option('--hash', 'build with hash and output map.json')
  .option('--devtool <devtool>', 'sourcemap generate method, default is null')
  .parse(process.argv);

if (program.watch) {
  require('../lib/build')(program);
} else {
  require('../lib/build')(program, function () {
    process.exit(0);
  });
}

// require('atool-monitor').emit();
