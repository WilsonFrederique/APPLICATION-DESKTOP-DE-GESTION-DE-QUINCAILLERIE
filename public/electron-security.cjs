// Script pour gérer la sécurité en développement
if (process.env.NODE_ENV === 'development') {
  // Désactiver certains avertissements en développement
  const originalWarn = console.warn;
  console.warn = function(...args) {
    const message = args[0] || '';
    // Filtrer les avertissements de sécurité spécifiques
    if (typeof message === 'string' && 
        (message.includes('Electron Security Warning') || 
         message.includes('webSecurity') ||
         message.includes('allowRunningInsecureContent') ||
         message.includes('Content-Security-Policy'))) {
      // Ne rien afficher ou afficher un message réduit
      console.log('⚠️ Avertissement de sécurité (mode développement)');
      return;
    }
    originalWarn.apply(console, args);
  };
}

// Vérifier si nous sommes dans Electron
if (window.electronAPI || window.api) {
  console.log('🔒 Mode Electron avec sécurité activée');
}