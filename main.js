const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

let serverProcess;
let mainWindow;

function startServer() {
  serverProcess = spawn('npm', ['start'], {
    shell: true,
    cwd: __dirname,
    stdio: 'inherit'
  });
}

function waitForServer(url, callback) {
  const check = () => {
    http
      .get(url, () => callback())
      .on('error', () => setTimeout(check, 100));
  };
  check();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.on('closed', () => { mainWindow = null; });
}
app.whenReady().then(() => {
  startServer();
  waitForServer('http://localhost:3000', createWindow);
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (serverProcess) serverProcess.kill();
    app.quit();
  }
});
