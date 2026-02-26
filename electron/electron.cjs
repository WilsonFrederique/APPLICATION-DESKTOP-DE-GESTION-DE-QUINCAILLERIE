const { app } = require('electron');

// Configurer les chemins de cache AVANT tout
const path = require('path');
const fs = require('fs');

const userDataPath = path.join(__dirname, '../userData');
const cachePath = path.join(__dirname, '../userData/cache');
const sessionPath = path.join(__dirname, '../userData/session');

// Créer les dossiers
[userDataPath, cachePath, sessionPath].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Définir les chemins
app.setPath('userData', userDataPath);
app.setPath('cache', cachePath);
app.setPath('sessionData', sessionPath);

// Désactiver l'accélération matérielle si problèmes
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disable-gpu');

// Importer le main après la configuration
require('./main.cjs');