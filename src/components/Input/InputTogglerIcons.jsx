import React, { useId } from "react";
import styles from './InputTogglerIcons.module.css';

export const InputTogglerIcons = ({
  label = "",
  checked = false,
  onChange,
  name = "",
  className = "",
  disabled = false,
  showIcons = false,
  error = "",
  required = false,
  helperText = "",
  size = "medium",
  color = "blue",
  id = "",
  ...rest
}) => {
  // Générer un ID unique stable avec useId (React 18+)
  const generatedId = useId();
  
  // Obtenir la classe de taille
  const getSizeClass = () => {
    const sizeMap = {
      small: styles.sizeSmall,
      medium: styles.sizeMedium,
      large: styles.sizeLarge,
    };
    return sizeMap[size] || styles.sizeMedium;
  };

  // Obtenir la classe de couleur
  const getColorClass = () => {
    const colorMap = {
      blue: styles.colorBlue,
      red: styles.colorRed,
      green: styles.colorGreen,
      purple: styles.colorPurple,
      indigo: styles.colorIndigo,
      pink: styles.colorPink,
      yellow: styles.colorYellow,
    };
    return colorMap[color] || styles.colorBlue;
  };

  const sizeClass = getSizeClass();
  const colorClass = getColorClass();
  
  // Utiliser l'ID fourni, le nom, ou l'ID généré par React
  const togglerId = id || name || `toggler-${generatedId}`;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`
        ${styles.togglerContainer}
        ${disabled ? styles.togglerDisabled : ''}
        ${error ? styles.containerError : ''}
      `}>
        {label && (
          <label 
            className={`${styles.togglerLabel} ${disabled ? styles.labelDisabled : ''}`}
            htmlFor={togglerId}
          >
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
        )}
        
        <label className={`${styles.togglerWrapper} ${sizeClass}`}>
          <input
            type="checkbox"
            id={togglerId}
            name={name}
            className={styles.togglerInput}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            aria-describedby={error ? `${togglerId}-error` : helperText ? `${togglerId}-helper` : undefined}
            aria-invalid={!!error}
            {...rest}
          />
          <div className={`${styles.togglerTrack} ${colorClass}`}>
            {showIcons && (
              <>
                <svg 
                  className={`${styles.iconOn} ${sizeClass}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M5 12L10 17L19 7" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                <svg 
                  className={`${styles.iconOff} ${sizeClass}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path 
                    d="M6 18L18 6M6 6L18 18" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </div>
          <div className={`${styles.togglerThumb} ${sizeClass}`} />
        </label>
      </div>
      
      {error && (
        <span 
          id={`${togglerId}-error`} 
          className={styles.errorMessage}
          role="alert"
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span 
          id={`${togglerId}-helper`} 
          className={styles.helperText}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default InputTogglerIcons;