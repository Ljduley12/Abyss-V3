import createServer from '@tomphttp/bare-server-node';
import http from 'http';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import nodeStatic from 'node-static';
import chalk from 'chalk';
import readline from 'readline'; // Import readline correctly
import fs from 'fs';
import { start } from 'repl';

const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({ // Create the readline interface
  input: process.stdin,
  output: process.stdout
});
if (fs.existsSync(".eula")) {
  startServer();
} else {
  console.log(chalk.red.bold('You must read and agree to the Developer Kit License and Terms of Service to use this software: ') + 'https://git.nebulaproxy.dev/dynamic/devkitone#terms');
  rl.question('Do you agree to the terms? (Y/N) ', (answer) => {
    if (answer.toUpperCase() !== 'Y') {
      console.log(chalk.red.bold('You must agree to the Developer Kit License and Terms of Service to use this software.'));
      rl.close();
      return;
    }
  console.log(chalk.green.bold('Thank you!'))
  fs.writeFileSync(".eula", Buffer.alloc(0));
    startServer();
  });
}
function startServer() {
  const bare = createServer('/bare/');
  const serve = new nodeStatic.Server('static/');

  const server = http.createServer();

  server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
      bare.routeRequest(req, res);
    } else {
      serve.serve(req, res);
    }
  });

  server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req, socket, head)) {
      bare.routeUpgrade(req, socket, head);
    } else {
      socket.end();
    }
  });

  server.listen({
    port: port,
    host: '0.0.0.0',
  }, () => {
    console.log(chalk.green.bold('[Dynamic] ') + 'live at port ' + chalk.underline.bold.green(port));
  });

  rl.close();
}
