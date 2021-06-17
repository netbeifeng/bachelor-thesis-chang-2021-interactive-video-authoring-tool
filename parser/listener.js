const shell = require('shelljs');
const chokidar = require("chokidar");
const path = require('path');
const args = process.argv.slice(2);
const fs = require('fs');

chokidar.watch(args[0]).on('change', (event, _path) => {
    shell.echo('Regenerate ilvJSON');
    // fs.writeFileSync(path.resolve(process.cwd() + `/parser/${args[1]}.ilv`), fs.readFileSync(args[0], 'utf-8'));
    shell.echo(shell.exec('node --version && node parser/parser.js ' + args[1] + ' ' + args[0].replace(`${args[1]}.ilv`, '')));
});