// electron/preload.cjs
const { contextBridge, ipcRenderer } = require("electron");

console.log('🔌 Preload script exécuté!');

try {
  // Exposer l'API Electron à la page web
  contextBridge.exposeInMainWorld("api", {
    // Stock operations
    getStocks: () => {
      console.log('[Preload] getStocks appelé');
      return ipcRenderer.invoke("stock:get");
    },
    addStock: (data) => {
      console.log('[Preload] addStock appelé avec:', data);
      return ipcRenderer.invoke("stock:add", data);
    },
    updateStock: (id, updates) => {
      console.log('[Preload] updateStock appelé:', id, updates);
      return ipcRenderer.invoke("stock:update", id, updates);
    },
    deleteStock: (id) => {
      console.log('[Preload] deleteStock appelé:', id);
      return ipcRenderer.invoke("stock:delete", id);
    },
    
    // Utilitaires
    showNotification: (title, body) => {
      console.log('[Preload] Notification:', title, body);
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    },
    
    // Méthode de test
    testConnection: async () => {
      console.log('[Preload] Test de connexion');
      return 'API Electron fonctionnelle!';
    },
    
    // Vérification - CORRECTION: Retourner une Promise
    ping: async () => {
      console.log('[Preload] ping appelé');
      return 'pong';
    }
  });
  
  console.log('✅ API Electron exposée avec succès');
  
  // Exposer aussi une méthode pour vérifier
  contextBridge.exposeInMainWorld("electron", {
    isElectron: true,
    version: process.versions.electron,
    preloadLoaded: true
  });
  
} catch (error) {
  console.error('❌ Erreur lors de l\'exposition de l\'API:', error);
  console.error('Stack:', error.stack);
}