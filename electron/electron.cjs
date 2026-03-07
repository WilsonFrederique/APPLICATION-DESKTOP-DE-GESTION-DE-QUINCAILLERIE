const { app } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

const userDataPath = path.join(app.getPath('appData'), 'quincaillerie-havana');
const cachePath    = path.join(userDataPath, 'cache');
const sessionPath  = path.join(userDataPath, 'session');

[userDataPath, cachePath, sessionPath].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

app.setPath('userData', userDataPath);
app.setPath('cache', cachePath);
app.setPath('sessionData', sessionPath);

app.commandLine.appendSwitch('disable-software-rasterizer');

try {
  require('./main.cjs');
} catch (err) {
  console.error('Erreur chargement main.js:', err);
  process.exit(1);
}