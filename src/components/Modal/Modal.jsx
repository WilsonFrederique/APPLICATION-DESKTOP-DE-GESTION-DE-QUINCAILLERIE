import React, { useEffect, useRef } from "react";
import styles from './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  className = "",
  title = "",
  showHeader = true,
  showFooter = false,
  size = "medium", // small, medium, large, xlarge, fullscreen
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  animation = "slide-up", // fade, slide-up, slide-down, scale, slide-right
  overlayBlur = true,
  preventScroll = true,
  maxHeight = "90vh",
  overlayClassName = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  headerLeftContent = null,
  headerRightContent = null,
  footerLeftContent = null,
  footerRightContent = null,
  hideDefaultFooterButtons = false,
  footerShadow = true,
  footerSticky = true // Option pour rendre le footer sticky/fixe
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const lastFocusedElement = useRef(null);

  // Gestion du scroll et focus
  useEffect(() => {
    if (isOpen) {
      // Sauvegarder l'élément ayant le focus
      lastFocusedElement.current = document.activeElement;
      
      if (preventScroll) {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
      
      // Focus sur la modal
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
      
      // Gestion de la touche ESC
      const handleEscKey = (e) => {
        if (e.key === "Escape" && closeOnEsc) {
          onClose();
        }
      };
      
      document.addEventListener("keydown", handleEscKey);
      return () => {
        document.removeEventListener("keydown", handleEscKey);
        if (lastFocusedElement.current) {
          lastFocusedElement.current.focus();
        }
      };
    } else {
      if (preventScroll) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }
    
    return () => {
      if (preventScroll) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [isOpen, onClose, closeOnEsc, preventScroll]);

  // Gestion du clic sur l'overlay
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // Empêcher la fermeture si on clique dans le contenu
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const modalSizeClass = styles[`modalSize_${size}`] || styles.modalSize_medium;
  const animationClass = styles[`animation_${animation}`] || styles.animation_slideUp;
  const overlayBlurClass = overlayBlur ? styles.overlayBlurred : '';
  const footerShadowClass = footerShadow ? styles.footerShadow : '';
  const footerStickyClass = footerSticky ? styles.footerSticky : '';

  return (
    <div 
      className={`${styles.overlay} ${overlayBlurClass} ${overlayClassName} ${animationClass}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div 
        ref={modalRef}
        className={`${styles.modalContainer} ${modalSizeClass} ${className}`}
        tabIndex="-1"
        onClick={handleContentClick}
        style={{ maxHeight }}
      >
        {/* Header - Fixe en haut */}
        {showHeader && (
          <div className={`${styles.modalHeader} ${headerClassName}`}>
            <div className={styles.headerLeft}>
              {headerLeftContent || (title && (
                <h2 
                  id="modal-title"
                  className={styles.modalTitle}
                >
                  {title}
                </h2>
              ))}
            </div>
            
            <div className={styles.headerRight}>
              {headerRightContent}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={styles.closeButton}
                  aria-label="Fermer la modale"
                  data-testid="modal-close-button"
                >
                  <svg 
                    className={styles.closeIcon}
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    aria-hidden="true"
                  >
                    <path 
                      d="M18 6L6 18M6 6l12 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Contenu principal avec scroll */}
        <div 
          ref={contentRef}
          className={`${styles.modalContent} ${contentClassName} ${showFooter ? styles.contentWithFooter : ''} ${showHeader ? styles.contentWithHeader : ''}`}
          data-scroll-lock-scrollable
        >
          {children}
        </div>
        
        {/* Footer - Fixe en bas */}
        {showFooter && (
          <div className={`${styles.modalFooter} ${footerClassName} ${footerShadowClass} ${footerStickyClass}`}>
            <div className={styles.footerLeft}>
              {footerLeftContent}
            </div>
            
            <div className={styles.footerRight}>
              {footerRightContent || (!hideDefaultFooterButtons && (
                <div className={styles.defaultFooter}>
                  <button
                    onClick={onClose}
                    className={styles.cancelButton}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={onClose}
                    className={styles.confirmButton}
                  >
                    Confirmer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Bouton de fermeture flottant pour mobile */}
        <button
          onClick={onClose}
          className={styles.mobileCloseButton}
          aria-label="Fermer la modale"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Modal;