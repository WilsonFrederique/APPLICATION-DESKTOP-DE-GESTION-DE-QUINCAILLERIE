// vite-no-csp.js - Plugin pour supprimer complètement la CSP de Vite
export default function viteNoCspPlugin() {
  return {
    name: 'vite-no-csp',
    
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Intercepter les réponses avant l'envoi
        const originalWriteHead = res.writeHead;
        const originalSetHeader = res.setHeader;
        
        // Override setHeader pour bloquer les CSP
        res.setHeader = function(name, value) {
          const lowerName = name.toLowerCase();
          if (lowerName.includes('content-security-policy') || lowerName.includes('csp')) {
            console.log('🚫 Vite: Blocage de l\'en-tête CSP:', name);
            return this;
          }
          return originalSetHeader.call(this, name, value);
        };
        
        // Override writeHead pour filtrer les headers
        res.writeHead = function(statusCode, statusMessage, headers) {
          const newHeaders = headers || {};
          
          // Supprimer TOUS les headers CSP
          Object.keys(newHeaders).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('content-security-policy') || lowerKey.includes('csp')) {
              console.log('🗑️ Vite: Suppression de CSP:', key);
              delete newHeaders[key];
            }
          });
          
          // Convertir si c'est un array
          if (Array.isArray(statusMessage)) {
            return originalWriteHead.call(this, statusCode, ...statusMessage);
          }
          
          return originalWriteHead.call(this, statusCode, statusMessage, newHeaders);
        };
        
        next();
      });
    },
    
    transformIndexHtml(html) {
      // Supprimer les meta tags CSP du HTML
      return html
        .replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, '')
        .replace(/<meta[^>]+content=["'][^"']*Content-Security-Policy[^"']*["'][^>]*>/gi, '');
    }
  };
}