/**
 * @file setup.js
 * @description Script pour initialiser le projet backend et frontend en mode développement
 */

const { exec, spawn } = require('child_process');
const path = require('path');
const net = require('net');

// Détermine les chemins absolus vers les dossiers 'server' et 'client'
const serverPath = path.join(__dirname, 'server');
const clientPath = path.join(__dirname, 'client');

// Liste pour stocker les processus enfants
let childProcesses = [];

// Codes de couleur ANSI
const colors = {
  reset: "\x1b[0m",
  fg: {
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m"
  }
};

// Fonction pour vérifier et libérer le port
function freePort(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`${colors.fg.red}[ERROR] Port ${port} est occupé, tentative de libération...${colors.reset}`);
        const command = process.platform === 'win32'
          ? `netstat -ano | findstr :${port}`
          : `lsof -i tcp:${port} | grep LISTEN`;

        exec(command, (err, stdout) => {
          if (stdout) {
            const pid = process.platform === 'win32'
              ? stdout.split('\n')[0].trim().split(/\s+/).pop()
              : stdout.split('\n')[0].split(/\s+/)[1];
            const killCommand = process.platform === 'win32'
              ? `taskkill /PID ${pid} /F`
              : `kill -9 ${pid}`;

            exec(killCommand, (err) => {
              if (err) reject(err);
              console.log(`${colors.fg.green}[SUCCESS] Processus sur le port ${port} terminé.${colors.reset}`);
              resolve();
            });
          } else {
            reject(new Error(`Impossible de libérer le port ${port}`));
          }
        });
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve();
    });

    server.listen(port);
  });
}

// Fonction pour démarrer un processus enfant
function startProcess(command) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, { shell: true, detached: true, stdio: 'ignore' });
    if (childProcess) {
      childProcess.unref();
      childProcesses.push(childProcess);
      resolve(childProcess);
    } else {
      reject(new Error('Échec de la création du processus enfant.'));
    }
  });
}

// Fonction principale pour démarrer les serveurs
async function startServers() {
  try {
    let osType;
    if (process.platform === 'win32') {
      osType = 'Windows';
    } else if (process.platform === 'darwin') {
      osType = 'macOS';
    } else {
      osType = 'Linux';
    }
    
    console.log(`${colors.fg.yellow}[INFO] Application développé par Clément, Sofiane, Julien et Galaad${colors.reset}`);
    
    console.log(`${colors.fg.magenta}[INFO] Système d'exploitation détecté : ${osType}${colors.reset}`);

    await freePort(4000);
    console.log(`${colors.fg.blue}[INFO] Démarrage du serveur backend...${colors.reset}`);

    let backendCommand;
    if (process.platform === 'win32') {
      backendCommand = `start cmd.exe /K "cd /d ${serverPath} && npm install && npm run init"`;
    } else if (process.platform === 'darwin') {
      backendCommand = `osascript -e 'tell application "Terminal" to do script "cd ${serverPath} && npm install && npm run init"'`;
    } else {
      backendCommand = `gnome-terminal -- bash -c "cd ${serverPath} && npm install && npm run init; exec bash"`;
    }

    await startProcess(backendCommand);
    setTimeout(() => {
      console.log(`${colors.fg.green}[SUCCESS] Serveur backend démarré.${colors.reset}`);
    }, 5000);

    const interval = setInterval(async () => {
      try {
        const isOccupied = await checkPort(4000);
        if (isOccupied) {
          clearInterval(interval);
          console.log(`${colors.fg.blue}[INFO] Lancement du serveur frontend...${colors.reset}`);

          let frontendCommand;
          if (process.platform === 'win32') {
            frontendCommand = `start cmd.exe /K "cd /d ${serverPath} && npm run codegen && cd /d ${clientPath} && npm install && npm run generate && npm run dev"`;
          } else if (process.platform === 'darwin') {
            frontendCommand = `osascript -e 'tell application "Terminal" to do script "cd ${serverPath} && npm run codegen && cd ${clientPath} && npm install && npm run generate && npm run dev"'`;
          } else {
            frontendCommand = `gnome-terminal -- bash -c "cd ${serverPath} && npm run codegen && cd ${clientPath} && npm install && npm run generate && npm run dev; exec bash"`;
          }

          await startProcess(frontendCommand);
          setTimeout(() => {
            console.log(`${colors.fg.green}[SUCCESS] Serveur frontend démarré.${colors.reset}`);
          }, 5000);
        }
      } catch (error) {
        console.error(`${colors.fg.red}[ERROR] ${error.message}${colors.reset}`);
      }
    }, 1000);
  } catch (error) {
    console.error(`${colors.fg.red}[ERROR] ${error.message}${colors.reset}`);
  }
}

// Fonction pour vérifier si le port est occupé
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      resolve(err.code === 'EADDRINUSE');
    });

    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(port);
  });
}

// Démarrage des serveurs
startServers();
