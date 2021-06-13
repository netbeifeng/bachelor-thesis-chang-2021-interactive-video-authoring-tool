const shell = require('shelljs');
const chokidar = require("chokidar");

const args = process.argv.slice(2);
const _dirname = `parser/${args[0]}/`;

chokidar.watch(_dirname + `${args[0]}.ilv`).on('change', (event, path) => {
    shell.echo('Regenerate ilvJSON');
    shell.exec('node --version && node parser/parser.js ' + args[0]);
});