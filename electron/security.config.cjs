module.exports = {
  // Configuration pour le développement
  development: {
    webSecurity: false, // Désactivé pour permettre le chargement local
    allowRunningInsecureContent: false,
    sandbox: false,
    enableRemoteModule: false,
    contextIsolation: true,
    nodeIntegration: false
  },
  
  // Configuration pour la production
  production: {
    webSecurity: true,
    allowRunningInsecureContent: false,
    sandbox: true,
    enableRemoteModule: false,
    contextIsolation: true,
    nodeIntegration: false
  },
  
  // Politique de sécurité du contenu
  csp: {
    development: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' http://localhost:* ws://localhost:*;
    `,
    production: `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self' data:;
      connect-src 'self';
    `
  }
};