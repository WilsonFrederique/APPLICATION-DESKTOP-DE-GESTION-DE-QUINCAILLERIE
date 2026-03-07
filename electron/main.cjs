const { app, BrowserWindow, session } = require('electron');
const path = require('node:path');

const isDev = !app.isPackaged;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    resizable: true,
    center: true,
    show: false,
    backgroundColor: '#ffffff',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: !isDev,
      devTools: isDev,
      preload: preloadPath
    }
  });

  if (isDev) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      const headers = details.responseHeaders || {};
      delete headers['content-security-policy'];
      delete headers['Content-Security-Policy'];
      callback({ responseHeaders: headers });
    });
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });

  if (isDev) {
    const tryLoad = () => {
      mainWindow.loadURL('http://127.0.0.1:5173')
        .catch(() => setTimeout(tryLoad, 1000));
    };
    tryLoad();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
