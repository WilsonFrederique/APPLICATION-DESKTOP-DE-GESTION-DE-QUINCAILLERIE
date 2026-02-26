// src/hooks/useElectron.js
import { useEffect, useState } from 'react';

export const useElectron = () => {
  const [isElectron, setIsElectron] = useState(false);
  const [api, setApi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiDetails, setApiDetails] = useState({});

  useEffect(() => {
    console.log('🔍 Début détection Electron...');
    
    const detectElectron = () => {
      try {
        // Vérifier les différents indicateurs
        const hasProcess = !!(window.process && window.process.type === 'renderer');
        const hasUserAgent = navigator.userAgent.toLowerCase().includes('electron');
        const hasAPI = !!window.api;
        const hasElectronObject = !!window.electron;
        
        console.log('Indicateurs Electron:');
        console.log('- window.process:', hasProcess);
        console.log('- userAgent:', hasUserAgent);
        console.log('- window.api existe?', hasAPI);
        console.log('- window.electron existe?', hasElectronObject);
        
        // Debug: inspecter l'objet window.api
        if (window.api) {
          console.log('🔍 Contenu de window.api:');
          Object.keys(window.api).forEach(key => {
            console.log(`  - ${key}:`, typeof window.api[key]);
          });
        }
        
        const detected = hasProcess || hasUserAgent || hasAPI || hasElectronObject;
        
        setIsElectron(detected);
        
        if (detected) {
          console.log('⚡ Electron détecté!');
          
          if (window.api) {
            console.log('✅ API détectée, vérification des méthodes...');
            
            // Vérifier quelles méthodes sont disponibles
            const availableMethods = {};
            Object.keys(window.api).forEach(key => {
              availableMethods[key] = typeof window.api[key];
            });
            
            setApiDetails(availableMethods);
            console.log('📋 Méthodes disponibles:', availableMethods);
            
            // Tester seulement si ping est une fonction
            if (typeof window.api.ping === 'function') {
              try {
                const result = window.api.ping();
                if (result && typeof result.then === 'function') {
                  // C'est une Promise
                  result.then(() => {
                    console.log('✅ Ping réussi (Promise)');
                  }).catch(err => {
                    console.warn('⚠️ Ping échoué:', err);
                  });
                } else {
                  // C'est une valeur simple
                  console.log('✅ Ping retourné:', result);
                }
              } catch (err) {
                console.warn('⚠️ Erreur lors du test ping:', err);
              }
            } else if (window.api.getStocks && typeof window.api.getStocks === 'function') {
              // Tester avec getStocks à la place
              console.log('🔄 Test avec getStocks à la place de ping');
              try {
                const result = window.api.getStocks();
                if (result && typeof result.then === 'function') {
                  result.then(stocks => {
                    console.log('✅ getStocks réussi:', stocks?.length || 0, 'stocks');
                  }).catch(err => {
                    console.warn('⚠️ getStocks échoué:', err);
                  });
                }
              } catch (err) {
                console.warn('⚠️ Erreur lors du test getStocks:', err);
              }
            }
            
            setApi(window.api);
            setError(null);
            
          } else if (window.electron) {
            console.log('ℹ️ window.electron disponible mais pas window.api');
            setError('API via window.api non disponible, mais Electron détecté');
          } else {
            console.warn('⚠️ Electron détecté mais aucune API disponible');
            setError('Electron détecté mais API non disponible');
          }
        } else {
          console.log('🌐 Mode navigateur détecté');
          setError(null);
        }
        
      } catch (err) {
        console.error('❌ Erreur lors de la détection:', err);
        setError('Erreur de détection: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Détection initiale
    detectElectron();
    
    // Écouter l'événement quand l'API est prête
    const handleApiReady = () => { // Retirer le paramètre 'event' non utilisé
      console.log('🎯 Événement electron-api-ready reçu');
      detectElectron();
    };
    
    window.addEventListener('electron-api-ready', handleApiReady);
    
    // Réessayer plusieurs fois
    const attempts = [1000, 2000, 3000];
    attempts.forEach(delay => {
      setTimeout(detectElectron, delay);
    });
    
    return () => {
      window.removeEventListener('electron-api-ready', handleApiReady);
    };
  }, []);

  return { isElectron, api, loading, error, apiDetails };
};