// Input.jsx
import React from "react";
import styles from './Input.module.css';

export const Input = ({
  type = "text",
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
  name = "",
  className = "",
  required = false,
  disabled = false,
  icon,
  hasExternalIcon = false,
  helperText = "",
  fullWidth = false,
  ...rest
}) => {
  const inputClasses = [
    styles.input,
    error ? styles.inputError : '',
    disabled ? styles.inputDisabled : '',
    className,
    icon && !hasExternalIcon ? styles.withIcon : ''
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : ''
  ].filter(Boolean).join(' ');

  // Filtrer les props qui ne doivent pas aller sur l'input natif
  const inputProps = { ...rest };
  delete inputProps.helperText; // Supprimer helperText des props de l'input

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          className={`${styles.label} ${disabled ? styles.labelDisabled : ''}`}
          htmlFor={name}
        >
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {icon && !hasExternalIcon && <div className={styles.iconLeft}>{icon}</div>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          required={required}
          style={hasExternalIcon ? { paddingLeft: '1rem' } : {}}
          {...inputProps} // Nettoyé de helperText
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {!error && helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default Input;