// InputSelect.jsx
import React, { useState, useRef, useEffect, useMemo, useId, useCallback } from "react";
import styles from './InputSelect.module.css';

export const InputSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Sélectionner...",
  className = "",
  error = "",
  searchable = false,
  multiple = false,
  disabled = false,
  icon,
  required = false,
  fullWidth = false,
  size = "medium",
  variant = "default",
  helperText = "",
  name,
  id,
  maxVisibleTags = 2,
  loading = false,
  noResultsText = "Aucun résultat trouvé",
  searchPlaceholder = "Rechercher...",
  clearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const ref = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRefs = useRef([]);
  
  const generatedId = useId();
  const selectId = id || `input-select-${generatedId}`;
  const labelId = label ? `${selectId}-label` : undefined;

  const selectedValues = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return value;
    } else if (value !== undefined && value !== null && !Array.isArray(value)) {
      return [value];
    } else {
      return [];
    }
  }, [value, multiple]);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const getSizeClass = () => {
    switch(size) {
      case 'small': return styles.sizeSmall;
      case 'large': return styles.sizeLarge;
      default: return styles.sizeMedium;
    }
  };

  const getVariantClass = () => {
    switch(variant) {
      case 'outline': return styles.variantOutline;
      case 'ghost': return styles.variantGhost;
      default: return styles.variantDefault;
    }
  };

  // Toggle option function with useCallback to avoid dependency issues
  const toggleOption = useCallback((val) => {
    if (disabled) return;
    
    setHasUserInteracted(true);
    
    if (multiple) {
      const exists = selectedValues.includes(val);
      const newValue = exists
        ? selectedValues.filter((v) => v !== val)
        : [...selectedValues, val];
      
      onChange?.(newValue);
    } else {
      onChange?.(val);
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
    }
  }, [disabled, multiple, selectedValues, onChange]);

  // Focus sur le champ de recherche quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Gestion du clic externe
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen || disabled) return;

      switch(event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
          
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            toggleOption(filteredOptions[highlightedIndex].value);
          }
          break;
          
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
          
        case 'Tab':
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(-1);
          break;
      }
    };

    const element = document;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, highlightedIndex, filteredOptions, disabled, toggleOption]);

  // Scroll vers l'option highlightée
  useEffect(() => {
    if (highlightedIndex >= 0 && optionsRefs.current[highlightedIndex]) {
      optionsRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  const clearSelection = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setHasUserInteracted(true);
    
    if (multiple) {
      onChange?.([]);
    } else {
      onChange?.("");
    }
  };

  const removeValue = (e, val) => {
    e.stopPropagation();
    e.preventDefault();
    setHasUserInteracted(true);
    
    if (multiple) {
      const newValue = selectedValues.filter((v) => v !== val);
      onChange?.(newValue);
    }
  };

  const isSelected = (val) => {
    return selectedValues.includes(val);
  };

  const getDisplayValue = () => {
    if (multiple) {
      if (selectedValues.length === 0) return placeholder;
      
      const selectedOptions = options.filter((opt) => 
        selectedValues.includes(opt.value)
      );
      
      if (selectedOptions.length > maxVisibleTags) {
        return `${selectedOptions.length} éléments sélectionnés`;
      }
      
      return selectedOptions.map((opt) => opt.label).join(", ");
    } else {
      const opt = options.find((o) => o.value === value);
      return opt?.label || placeholder;
    }
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearch("");
        setHighlightedIndex(-1);
        setHasUserInteracted(true);
      }
    }
  };

  const displayTags = useMemo(() => {
    if (!multiple || selectedValues.length === 0) return [];
    
    const filtered = options.filter(opt => selectedValues.includes(opt.value));
    return filtered.slice(0, maxVisibleTags);
  }, [selectedValues, options, multiple, maxVisibleTags]);

  const showTagCount = useMemo(() => {
    return multiple && selectedValues.length > maxVisibleTags;
  }, [multiple, selectedValues.length, maxVisibleTags]);

  const containerClasses = [
    styles.selectContainer,
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  const triggerClasses = [
    styles.selectTrigger,
    error ? styles.selectError : '',
    disabled ? styles.selectDisabled : '',
    isOpen ? styles.selectOpen : '',
    icon ? styles.withIcon : '',
    getSizeClass(),
    getVariantClass()
  ].filter(Boolean).join(' ');

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleOptionMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  const handleOptionMouseLeave = () => {
    setHighlightedIndex(-1);
  };

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    
    switch(e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleToggle();
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
    }
  };

  const getInputValue = () => {
    if (multiple) {
      return Array.isArray(value) ? value.join(',') : '';
    } else {
      return typeof value === 'string' || typeof value === 'number' 
        ? String(value) 
        : '';
    }
  };

  const isLoading = loading && options.length === 0;
  const hasError = error && hasUserInteracted;

  // Nouvelle fonction pour gérer le clic sur le conteneur des icônes
  const handleIconsClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={containerClasses} ref={ref}>
      {label && (
        <label className={styles.selectLabel} htmlFor={selectId} id={labelId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && <div className={styles.iconLeft}>{icon}</div>}
        
        <div className={styles.triggerContainer}>
          <button
            type="button"
            className={triggerClasses}
            onClick={handleToggle}
            onKeyDown={handleTriggerKeyDown}
            id={selectId}
            data-testid="select-trigger"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={labelId}
            aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          >
            <div className={styles.selectValue}>
              {multiple && selectedValues.length > 0 && (
                <div className={styles.selectedTags}>
                  {displayTags.map(opt => (
                    <span key={opt.value} className={styles.tag}>
                      {opt.icon && <span className={styles.tagIcon}>{opt.icon}</span>}
                      <span className={styles.tagLabel}>{opt.label}</span>
                    </span>
                  ))}
                  {showTagCount && (
                    <span className={styles.tagCount}>
                      +${selectedValues.length - maxVisibleTags}
                    </span>
                  )}
                </div>
              )}
              
              {(!multiple || selectedValues.length === 0) && (
                <span className={selectedValues.length > 0 ? styles.selectedText : styles.placeholder}>
                  {getDisplayValue()}
                </span>
              )}
            </div>
          </button>
          
          {/* Les boutons de contrôle sont maintenant en dehors du bouton principal */}
          <div className={styles.controlButtons} onClick={handleIconsClick}>
            {clearable && selectedValues.length > 0 && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className={styles.clearButton}
                disabled={disabled}
                aria-label="Effacer la sélection"
              >
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {isLoading && (
              <div className={styles.loadingSpinner}>
                <div className={styles.spinner}></div>
              </div>
            )}
            <svg
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          {/* Boutons pour retirer les tags (pour le mode multiple) */}
          {multiple && selectedValues.length > 0 && !showTagCount && (
            <div className={styles.tagRemoveButtons}>
              {displayTags.map(opt => (
                <button
                  key={`remove-${opt.value}`}
                  type="button"
                  onClick={(e) => removeValue(e, opt.value)}
                  className={styles.tagRemoveButton}
                  aria-label={`Retirer ${opt.label}`}
                  disabled={disabled}
                >
                  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="hidden"
          name={name}
          value={getInputValue()}
          readOnly
        />

        {isOpen && !disabled && (
          <div 
            className={styles.selectDropdown}
            role="listbox"
            aria-multiselectable={multiple}
            aria-labelledby={labelId}
          >
            {searchable && (
              <div className={styles.searchContainer}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className={styles.searchInput}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Rechercher dans la liste"
                  aria-controls={`${selectId}-options`}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className={styles.searchClear}
                    aria-label="Effacer la recherche"
                  >
                    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M4 4L12 12M12 4L4 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            
            <div 
              className={styles.optionsContainer}
              id={`${selectId}-options`}
              role="presentation"
            >
              {isLoading ? (
                <div className={styles.loadingOptions}>
                  <div className={styles.loadingSpinnerSmall}>
                    <div className={styles.spinner}></div>
                  </div>
                  <span>Chargement...</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <button
                    ref={(el) => { optionsRefs.current[index] = el; }}
                    type="button"
                    key={opt.value}
                    onClick={() => !opt.disabled && toggleOption(opt.value)}
                    onMouseEnter={() => handleOptionMouseEnter(index)}
                    onMouseLeave={handleOptionMouseLeave}
                    className={`
                      ${styles.option}
                      ${isSelected(opt.value) ? styles.optionSelected : ''}
                      ${opt.disabled ? styles.optionDisabled : ''}
                      ${highlightedIndex === index ? styles.optionHighlighted : ''}
                    `}
                    role="option"
                    aria-selected={isSelected(opt.value)}
                    aria-disabled={opt.disabled}
                    disabled={opt.disabled}
                    data-value={opt.value}
                  >
                    {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                    
                    {multiple ? (
                      <>
                        <span className={`
                          ${styles.checkbox}
                          ${isSelected(opt.value) ? styles.checkboxChecked : ''}
                          ${opt.disabled ? styles.checkboxDisabled : ''}
                        `}>
                          {isSelected(opt.value) && (
                            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M10 2L4.5 7.5L2 5"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className={styles.optionLabel}>{opt.label}</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.optionLabel}>{opt.label}</span>
                        {isSelected(opt.value) && (
                          <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M5 13L9 17L19 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </>
                    )}
                  </button>
                ))
              ) : (
                <div className={styles.noResults}>
                  {noResultsText}
                </div>
              )}
            </div>
            
            {!isLoading && filteredOptions.length > 0 && (
              <div className={styles.dropdownFooter}>
                <span className={styles.resultCount}>
                  {filteredOptions.length} résultat{filteredOptions.length > 1 ? 's' : ''}
                </span>
                {multiple && selectedValues.length > 0 && (
                  <span className={styles.selectedCount}>
                    {selectedValues.length} sélectionné{selectedValues.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {hasError && (
        <p 
          className={styles.errorText} 
          role="alert" 
          id={`${selectId}-error`}
        >
          <svg className={styles.errorIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 4V8M8 12H8.01M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <span 
          className={styles.helperText}
          id={`${selectId}-helper`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};

export default InputSelect;