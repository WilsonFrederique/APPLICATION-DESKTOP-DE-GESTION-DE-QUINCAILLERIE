import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

const Toast = ({
  message,
  type = "info",
  duration = 3000,
  position = "top-right",
  onClose,
}) => {
  const [visible, setVisible] = useState(true); // Commence directement visible

  useEffect(() => {
    // Timer pour la disparition (fade-out)
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    // Timer pour la suppression complète
    const removeTimer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]); // Retirer setVisible des dépendances

  const getTypeClass = () => {
    switch(type) {
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'warning': return styles.warning;
      default: return styles.info;
    }
  };

  const getPositionClass = () => {
    switch(position) {
      case 'top-left': return styles.topLeft;
      case 'top-center': return styles.topCenter;
      case 'top-right': return styles.topRight;
      case 'bottom-left': return styles.bottomLeft;
      case 'bottom-center': return styles.bottomCenter;
      case 'bottom-right': return styles.bottomRight;
      default: return styles.topRight;
    }
  };

  const getProgressBarClass = () => {
    switch(type) {
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'warning': return styles.warning;
      default: return styles.info;
    }
  };

  return (
    <div 
      className={`${styles.toast} ${getTypeClass()} ${getPositionClass()} ${
        visible ? styles.visible : styles.hidden
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={styles.content}>
        {/* Icône selon le type */}
        <div className={styles.icon}>
          {type === 'success' && '✓'}
          {type === 'error' && '✗'}
          {type === 'warning' && '⚠'}
          {type === 'info' && 'ℹ'}
        </div>
        
        {/* Message */}
        <div className={styles.message}>
          {message}
        </div>
        
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Fermer la notification"
        >
          ×
        </button>
      </div>
      
      {/* Barre de progression */}
      <div 
        className={`${styles.progressBar} ${getProgressBarClass()}`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default Toast;