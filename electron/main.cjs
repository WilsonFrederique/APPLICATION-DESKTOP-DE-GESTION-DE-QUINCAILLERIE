process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
process.env.NODE_ENV = 'development';

const { app, BrowserWindow, session } = require("electron");
const path = require("path");
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  console.log('🚀 Création de la fenêtre principale...');
  
  const preloadPath = path.join(__dirname, 'preload.cjs');
  console.log('📁 Chemin preload:', preloadPath);
  
  if (fs.existsSync(preloadPath)) {
    console.log('✅ Fichier preload.cjs trouvé');
  } else {
    console.error('❌ ERREUR: Fichier preload.cjs INTROUVABLE à:', preloadPath);
    console.log('📁 Contenu du dossier electron:', fs.readdirSync(__dirname));
  }
  
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    maxWidth: 2560,
    maxHeight: 1440,
    resizable: true,
    movable: true,
    minimizable: true,
    maximizable: true,
    closable: true,
    fullscreenable: true,
    frame: true,
    titleBarStyle: 'default',
    autoHideMenuBar: true,
    transparent: false,
    hasShadow: true,
    thickFrame: true,
    center: true,
    show: false,
    backgroundColor: '#ffffff',
    icon: path.join(__dirname, '../public/logo.png'),
    
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      enableRemoteModule: false,
      devTools: true,
      scrollBounce: false,
      preload: preloadPath
    }
  });

  // Variable pour limiter les logs
  let mainPageCSPApplied = false;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = details.responseHeaders || {};
    
    // N'appliquer que sur la page principale
    const isMainPage = details.url === 'http://127.0.0.1:5173/' || 
                      details.url === 'http://localhost:5173/' ||
                      details.url === 'http://127.0.0.1:5173/index.html' ||
                      details.url === 'http://localhost:5173/index.html';
    
    if (isMainPage && !mainPageCSPApplied) {
      mainPageCSPApplied = true;
      
      // Supprimer toutes les CSP existantes
      const cspHeaders = [
        'content-security-policy',
        'Content-Security-Policy',
        'x-content-security-policy',
        'X-Content-Security-Policy',
        'x-webkit-csp',
        'X-WebKit-CSP'
      ];
      
      cspHeaders.forEach(header => {
        delete responseHeaders[header];
      });
      
      // CSP COMPLÈTE via HEADERS (toutes directives autorisées)
      const ultraPermissiveCSP = [
        // Directives de base
        "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        "style-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        
        // Spécifiquement pour les workers
        "worker-src * blob: data: 'self'",
        
        // Autres ressources
        "font-src * data: blob:",
        "img-src * data: blob:",
        "media-src * data: blob:",
        "object-src * blob: data:",
        
        // Connexions réseau
        "connect-src * 'self' ws://127.0.0.1:5173 ws://localhost:5173 http://127.0.0.1:5173 http://localhost:5173 blob:",
        
        // Frame et iframe
        "frame-src * blob: data:",
        "child-src * blob: data:",
        "frame-ancestors *",  // Seulement dans les headers
        
        // Autres
        "manifest-src *",
        "form-action *",
        "base-uri *",
        "navigate-to *"
      ].join('; ');
      
      responseHeaders['Content-Security-Policy'] = [ultraPermissiveCSP];
      
      // Logger une seule fois
      console.log('🔓 CSP configurée via headers (avec frame-ancestors)');
      
    } else if (!isMainPage) {
      // Pour les autres ressources, juste supprimer les CSP existantes
      ['content-security-policy', 'Content-Security-Policy'].forEach(header => {
        delete responseHeaders[header];
      });
    }
    
    callback({
      responseHeaders: responseHeaders
    });
  });

  const viteUrl = 'http://127.0.0.1:5173';
  
  console.log('⏳ Tentative de connexion à Vite...');
  
  const loadViteApp = () => {
    mainWindow.loadURL(viteUrl)
      .then(() => {
        console.log('✅ Application chargée');
        mainWindow.show();
        mainWindow.webContents.openDevTools();
        
        // Injecter une CSP simplifiée via meta tag (sans frame-ancestors)
        setTimeout(() => {
          mainWindow.webContents.executeJavaScript(`
            // Supprimer tous les meta tags CSP existants
            const existingMetaTags = document.querySelectorAll('meta[http-equiv*="security"], meta[http-equiv*="Security"], meta[http-equiv*="CSP"]');
            existingMetaTags.forEach(el => el.remove());
            
            // Créer une CSP simplifiée compatible avec meta tags
            const cspMeta = document.createElement('meta');
            cspMeta.httpEquiv = 'Content-Security-Policy';
            
            // Version simplifiée pour meta tags (sans frame-ancestors, sandbox, etc.)
            const cspDirectives = [
              // Directives de base compatibles meta
              "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "script-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "style-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              
              // Workers
              "worker-src * blob: data: 'self'",
              
              // Ressources
              "font-src * data: blob:",
              "img-src * data: blob:",
              "media-src * data: blob:",
              "object-src * blob: data:",
              
              // Connexions (sans frame-ancestors qui n'est pas supporté)
              "connect-src * 'self' ws://127.0.0.1:5173 ws://localhost:5173 http://127.0.0.1:5173 http://localhost:5173 blob:",
              
              // Frames (simplifié)
              "frame-src * blob: data:",
              "child-src * blob: data:",
              
              // Autres compatibles meta
              "manifest-src *",
              "form-action *",
              "base-uri *"
            ].join('; ');
            
            cspMeta.content = cspDirectives;
            document.head.appendChild(cspMeta);
            
            console.log('✅ Meta CSP injectée (version compatible)');
            
            // Vérification rapide
            if (typeof window.api !== 'undefined') {
              console.log('✅ API Electron disponible');
              // Notifier React que l'API est prête
              window.dispatchEvent(new Event('electron-ready'));
            }
          `);
        }, 1000);
      })
      .catch(err => {
        console.error('❌ Erreur de chargement:', err.message);
        setTimeout(loadViteApp, 1000);
      });
  };
  
  const checkServer = () => {
    const { net } = require('electron');
    const request = net.request(viteUrl);
    
    request.on('response', () => {
      console.log('✅ Serveur Vite trouvé');
      loadViteApp();
    });
    
    request.on('error', (err) => {
      console.log('⏳ Serveur non disponible, nouvel essai dans 1s...');
      setTimeout(checkServer, 1000);
    });
    
    request.end();
  };
  
  setTimeout(checkServer, 2000);
}

app.whenReady().then(() => {
  console.log('🎯 Electron prêt');
  
  // Nettoyage initial
  session.defaultSession.clearCache();
  session.defaultSession.clearStorageData();
  
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});