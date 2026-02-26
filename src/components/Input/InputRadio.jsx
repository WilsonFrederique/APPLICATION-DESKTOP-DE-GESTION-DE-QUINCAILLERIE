import React, { useId } from "react";
import styles from './InputRadio.module.css';

export const InputRadio = ({
  label,
  value,
  name,
  checked,
  onChange,
  className = "",
  disabled = false,
  color = "blue",
  size = "medium",
  error = "",
  required = false,
  id = "",
  helperText = "",
  ...rest
}) => {
  // Générer un ID unique stable
  const generatedId = useId();
  
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

  // Obtenir la classe de taille
  const getSizeClass = () => {
    const sizeMap = {
      small: styles.sizeSmall,
      medium: styles.sizeMedium,
      large: styles.sizeLarge,
    };
    return sizeMap[size] || styles.sizeMedium;
  };

  const colorClass = getColorClass();
  const sizeClass = getSizeClass();
  
  // IMPORTANT : Correction de la logique conditionnelle
  // `${name}-${value}` ne doit être utilisé que si name ET value existent
  const radioId = id || (name && value ? `${name}-${value}` : generatedId);

  return (
    <div className={`${styles.container} ${className}`}>
      <label
        className={`
          ${styles.radioContainer}
          ${disabled ? styles.disabled : ''}
          ${error ? styles.containerError : ''}
        `}
        htmlFor={radioId}
      >
        <input
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={styles.radioInput}
          required={required}
          aria-describedby={error ? `${radioId}-error` : helperText ? `${radioId}-helper` : undefined}
          {...rest}
        />
        <span className={`${styles.radioCircle} ${colorClass} ${sizeClass}`}>
          <span className={styles.radioInnerCircle}></span>
        </span>
        {label && (
          <span className={`${styles.labelText} ${disabled ? styles.labelDisabled : ''}`}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </span>
        )}
      </label>
      
      {error && (
        <span 
          id={`${radioId}-error`} 
          className={styles.errorMessage}
        >
          {error}
        </span>
      )}
      {!error && helperText && (
        <span 
          id={`${radioId}-helper`} 
          className={styles.helperText}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default InputRadio;