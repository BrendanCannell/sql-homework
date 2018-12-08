let init = require('fs').readFileSync('./init.sql', 'utf8');

require('child_process').spawn('mysql', ['-u', 'root', '-e', init]);