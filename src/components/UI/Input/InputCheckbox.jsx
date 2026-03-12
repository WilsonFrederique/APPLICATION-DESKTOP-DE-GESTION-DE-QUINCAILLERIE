// InputCheckbox.jsx
import React, { useId } from "react";
import styles from './InputCheckbox.module.css';

export const InputCheckbox = ({
  label,
  checked,
  onChange,
  name = "",
  className = "",
  color = "blue",
  disabled = false,
  error = "",
  required = false,
  id = "",
  helperText = "",
  ...rest
}) => {
  const generatedId = useId();
  
  // Filtrer les props qui ne doivent pas aller sur l'input
  const inputProps = { ...rest };
  delete inputProps.helperText; // Supprimer helperText

  const getColorClass = () => {
    switch(color) {
      case 'blue': return styles.checkboxBlue;
      case 'red': return styles.checkboxRed;
      case 'green': return styles.checkboxGreen;
      case 'purple': return styles.checkboxPurple;
      default: return styles.checkboxBlue;
    }
  };

  const colorClass = getColorClass();
  const checkboxId = id || name || generatedId;

  return (
    <div className={`${styles.container} ${className}`}>
      <label
        className={`
          ${styles.checkboxContainer}
          ${disabled ? styles.checkboxDisabled : ''}
          ${error ? styles.containerError : ''}
        `}
        htmlFor={checkboxId}
      >
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`${styles.checkboxInput} ${colorClass}`}
          required={required}
          {...inputProps} // Nettoyé de helperText
        />
        <span className={`${styles.checkboxCustom} ${colorClass}`}>
          <svg
            className={styles.checkboxIcon}
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2L4.5 7.5L2 5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span className={styles.checkboxLabel}>
            {label}
            {required && <span className={styles.required}> *</span>}
          </span>
        )}
      </label>
      {error && <span className={styles.errorMessage}>{error}</span>}
      {!error && helperText && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  );
};

export default InputCheckbox;