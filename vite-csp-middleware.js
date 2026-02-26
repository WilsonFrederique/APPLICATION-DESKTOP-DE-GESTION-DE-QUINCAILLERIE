// vite-csp-middleware.js
export function cspMiddleware() {
  return {
    name: 'csp-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Supprimer les en-têtes CSP de Vite
        const originalWriteHead = res.writeHead;
        res.writeHead = function (statusCode, statusMessage, headers) {
          const newHeaders = headers || {};
          
          // Supprimer CSP
          delete newHeaders['content-security-policy'];
          delete newHeaders['Content-Security-Policy'];
          
          return originalWriteHead.call(this, statusCode, statusMessage, newHeaders);
        };
        next();
      });
    }
  };
}