// InputTextarea.jsx
import React, { useState, useRef } from "react";
import styles from './InputTextarea.module.css';
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

export const InputTextarea = ({
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
  success = false,
  name = "",
  rows = 4,
  className = "",
  required = false,
  disabled = false,
  readOnly = false,
  maxLength,
  showCharCount = false,
  icon,
  fullWidth = false,
  helperText = "",
  autoGrow = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  // Filtrer les props qui ne doivent pas aller sur le textarea
  const textareaProps = { ...rest };
  delete textareaProps.helperText; // Supprimer helperText

  const handleChange = (e) => {
    if (autoGrow && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    onChange?.(e);
  };

  const textareaClasses = [
    styles.textarea,
    error ? styles.textareaError : '',
    success ? styles.textareaSuccess : '',
    disabled ? styles.textareaDisabled : '',
    readOnly ? styles.textareaReadOnly : '',
    isFocused ? styles.textareaFocused : '',
    className,
  ].filter(Boolean).join(' ');

  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    disabled ? styles.containerDisabled : '',
  ].filter(Boolean).join(' ');

  const getCharCountColor = () => {
    if (!maxLength || !showCharCount) return '';
    const length = value?.length || 0;
    if (length > maxLength) return styles.charCountError;
    if (length > maxLength * 0.9) return styles.charCountWarning;
    return '';
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          className={`${styles.label} ${disabled ? styles.labelDisabled : ''}`}
          htmlFor={name}
        >
          {icon && <span className={styles.labelIcon}>{icon}</span>}
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      
      <div className={styles.textareaWrapper}>
        {icon && !label && (
          <div className={styles.inputIcon}>
            {icon}
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          className={textareaClasses}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          {...textareaProps} // Nettoyé de helperText
        />
        
        {showCharCount && maxLength && (
          <div className={`${styles.charCounter} ${getCharCountColor()}`}>
            <span className={styles.charCountCurrent}>
              {value?.length || 0}
            </span>
            <span className={styles.charCountSeparator}>/</span>
            <span className={styles.charCountTotal}>
              {maxLength}
            </span>
          </div>
        )}
        
        {success && !error && (
          <div className={styles.successIndicator}>
            <IoCheckmarkCircleOutline />
          </div>
        )}
      </div>
      
      <div className={styles.footer}>
        {error && (
          <span 
            id={`${name}-error`}
            className={styles.errorMessage}
            role="alert"
          >
            <IoWarningOutline className={styles.errorIcon} />
            {error}
          </span>
        )}
        
        {!error && helperText && (
          <span 
            id={`${name}-helper`}
            className={styles.helperText}
          >
            {helperText}
          </span>
        )}
        
        {!error && !helperText && showCharCount && maxLength && (
          <div className={`${styles.charCounterInline} ${getCharCountColor()}`}>
            {value?.length || 0} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputTextarea;