import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'boxicons/css/boxicons.min.css';

// Vérifier que l'API Electron est disponible
if (window.api) {
  console.log('✅ API Electron disponible');
} else {
  console.warn('⚠️ API Electron non disponible - Mode navigateur');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)