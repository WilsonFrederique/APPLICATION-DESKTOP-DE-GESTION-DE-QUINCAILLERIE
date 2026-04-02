// InputFile.jsx
import React, { useState, useRef, useId, useEffect } from "react";
import styles from './InputFile.module.css';

export const InputFile = ({
  label,
  onChange,
  variant = "primary",
  size = "md",
  name = "",
  accept = "",
  className = "",
  disabled = false,
  error = "",
  required = false,
  multiple = false,
  buttonText = "Choisir un fichier",
  helperText = "",
  fullWidth = false,
  id = "",
  showAcceptText = true,
  maxFileSize,
  maxFiles,
  showFilePreview = false,
  previewType = 'icon',
  showFileSize = true,
  compactMode = false,
  dragDropEnabled = true,
  showClearButton = true,
  icon,
  placeholder = "Glissez-déposez ou cliquez pour télécharger",
  dropPlaceholder = "Lâchez vos fichiers ici",
  onFileRemove,
  onFilesCleared,
  ...rest
}) => {
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrls, setPreviewUrls] = useState({});
  const fileInputRef = useRef(null);
  const generatedId = useId();
  
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('zip') || fileType.includes('compressed')) return '📦';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('audio')) return '🎵';
    return '📎';
  };

  const validateFiles = (fileList) => {
    setFileError("");
    
    const fileArray = Array.from(fileList);
    
    if (maxFiles && fileArray.length > maxFiles) {
      setFileError(`Maximum ${maxFiles} fichier(s) autorisé(s)`);
      return false;
    }
    
    if (maxFileSize) {
      const oversizedFiles = fileArray.filter(file => file.size > maxFileSize);
      if (oversizedFiles.length > 0) {
        const sizeInMB = (maxFileSize / (1024 * 1024)).toFixed(1);
        if (oversizedFiles.length === 1) {
          setFileError(`Le fichier "${oversizedFiles[0].name}" dépasse la taille maximale de ${sizeInMB}MB`);
        } else {
          setFileError(`${oversizedFiles.length} fichiers dépassent la taille maximale de ${sizeInMB}MB`);
        }
        return false;
      }
    }
    
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const invalidFiles = fileArray.filter(file => {
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.includes('/')) {
            const pattern = type.replace('*', '.*');
            return file.type.match(pattern);
          }
          return true;
        });
        return !isAccepted;
      });
      
      if (invalidFiles.length > 0) {
        if (invalidFiles.length === 1) {
          setFileError(`Le type de fichier "${invalidFiles[0].name}" n'est pas autorisé`);
        } else {
          setFileError(`${invalidFiles.length} fichiers ont un type non autorisé`);
        }
        return false;
      }
    }
    
    return true;
  };

  const handleChange = (e) => {
    const fileList = e.target.files;
    
    if (!fileList || fileList.length === 0) {
      setFiles([]);
      setPreviewUrls({});
      onChange(null, e);
      return;
    }
    
    if (!validateFiles(fileList)) {
      e.target.value = '';
      setFiles([]);
      setPreviewUrls({});
      onChange(null, e);
      return;
    }
    
    const fileArray = Array.from(fileList);
    const newFiles = [];
    const newPreviewUrls = {};
    
    fileArray.forEach((file, index) => {
      newFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        file: file
      });
      
      if (showFilePreview && previewType === 'image' && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        newPreviewUrls[index] = previewUrl;
      }
    });
    
    if (multiple) {
      setFiles(prevFiles => {
        const combinedFiles = [...prevFiles, ...newFiles];
        if (maxFiles && combinedFiles.length > maxFiles) {
          return combinedFiles.slice(0, maxFiles);
        }
        return combinedFiles;
      });
      
      setPreviewUrls(prevUrls => ({
        ...prevUrls,
        ...newPreviewUrls
      }));
      
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        const allFiles = [...files.map(f => f.file), ...fileArray];
        allFiles.forEach(file => file && dataTransfer.items.add(file));
        fileInputRef.current.files = dataTransfer.files;
      }
      
      onChange(fileArray, e);
    } else {
      setFiles(newFiles);
      setPreviewUrls(newPreviewUrls);
      onChange(fileArray, e);
    }
  };

  const handleButtonClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClearFiles = () => {
    Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
    
    setFiles([]);
    setPreviewUrls({});
    setFileError("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (onFilesCleared) {
      onFilesCleared();
    }
    
    onChange(null);
  };

  const handleRemoveFile = (index) => {
    const fileToRemove = files[index];
    
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    
    const newPreviewUrls = {};
    newFiles.forEach((_, newIndex) => {
      if (newIndex < index) {
        if (previewUrls[newIndex]) {
          newPreviewUrls[newIndex] = previewUrls[newIndex];
        }
      } else {
        if (previewUrls[newIndex + 1]) {
          newPreviewUrls[newIndex] = previewUrls[newIndex + 1];
        }
      }
    });
    setPreviewUrls(newPreviewUrls);
    
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      newFiles.forEach(fileInfo => {
        dataTransfer.items.add(fileInfo.file);
      });
      fileInputRef.current.files = dataTransfer.files;
      
      const changeEvent = new Event('change', { bubbles: true });
      Object.defineProperty(changeEvent, 'target', { writable: false, value: fileInputRef.current });
      handleChange(changeEvent);
    }
    
    if (onFileRemove) {
      onFileRemove(fileToRemove.file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && dragDropEnabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled || !dragDropEnabled || !fileInputRef.current) return;
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < droppedFiles.length; i++) {
        dataTransfer.items.add(droppedFiles[i]);
      }
      fileInputRef.current.files = dataTransfer.files;
      
      const changeEvent = new Event('change', { bubbles: true });
      Object.defineProperty(changeEvent, 'target', { writable: false, value: fileInputRef.current });
      handleChange(changeEvent);
    }
  };

  const getVariantClass = () => {
    const variantMap = {
      primary: styles.buttonPrimary,
      secondary: styles.buttonSecondary,
      danger: styles.buttonDanger,
      outline: styles.buttonOutline,
      success: styles.buttonSuccess,
      warning: styles.buttonWarning,
      ghost: styles.buttonGhost,
    };
    return variantMap[variant] || styles.buttonPrimary;
  };

  const getSizeClass = () => {
    const sizeMap = {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
      xl: styles.sizeXl,
    };
    return sizeMap[size] || styles.sizeMd;
  };

  const variantClass = getVariantClass();
  const sizeClass = getSizeClass();
  const fileInputId = id || name || generatedId;
  const errorMessage = error || fileError;
  const hasFiles = files.length > 0;
  
  const containerClasses = [
    styles.container,
    fullWidth ? styles.fullWidth : '',
    compactMode ? styles.compact : '',
    disabled ? styles.containerDisabled : '',
    className
  ].filter(Boolean).join(' ');

  const fileInputContainerClasses = [
    styles.fileInputContainer,
    isDragging ? styles.dragOver : '',
    errorMessage ? styles.containerError : '',
    disabled ? styles.inputDisabled : '',
    hasFiles ? styles.hasFiles : '',
  ].filter(Boolean).join(' ');

  const placeholderText = hasFiles 
    ? `${files.length} fichier${files.length > 1 ? 's' : ''} sélectionné${files.length > 1 ? 's' : ''}`
    : placeholder;

  return (
    <div className={containerClasses}>
      {label && (
        <div className={styles.labelWrapper}>
          <label 
            className={`${styles.label} ${disabled ? styles.labelDisabled : ''}`}
            htmlFor={fileInputId}
          >
            {label}
            {required && <span className={styles.required}> *</span>}
          </label>
          
          {multiple && maxFiles && (
            <span className={styles.fileCounter}>
              {files.length}/{maxFiles}
            </span>
          )}
        </div>
      )}
      
      <div 
        className={fileInputContainerClasses}
        onDragOver={dragDropEnabled ? handleDragOver : undefined}
        onDragLeave={dragDropEnabled ? handleDragLeave : undefined}
        onDrop={dragDropEnabled ? handleDrop : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={fileInputId}
          name={name}
          onChange={handleChange}
          accept={accept}
          disabled={disabled}
          multiple={multiple}
          className={styles.hiddenInput}
          required={required}
          {...rest}
        />
        
        {isDragging && dragDropEnabled && (
          <div className={styles.dropOverlay}>
            <div className={styles.dropContent}>
              <svg className={styles.dropIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13L12 20L5 13M12 4V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.dropText}>{dropPlaceholder}</span>
            </div>
          </div>
        )}
        
        <div className={styles.dragDropArea}>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={handleButtonClick}
              disabled={disabled}
              className={`
                ${styles.uploadButton}
                ${variantClass}
                ${sizeClass}
                ${disabled ? styles.buttonDisabled : ''}
              `}
              aria-describedby={errorMessage ? `${fileInputId}-error` : helperText ? `${fileInputId}-helper` : undefined}
            >
              {icon || (
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10H19C20.1046 10 21 10.8954 21 12V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V12C3 10.8954 3.89543 10 5 10H7ZM19 12H5V20H19V12ZM9 10H15V9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9V10Z" 
                    fill="currentColor"/>
                </svg>
              )}
              {buttonText}
            </button>
            
            <div className={styles.fileInfoContainer}>
              {hasFiles ? (
                <div className={styles.filesList}>
                  {files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className={styles.fileItem}>
                      {showFilePreview && previewType === 'image' && previewUrls[index] && (
                        <div className={styles.previewImage}>
                          <img 
                            src={previewUrls[index]} 
                            alt={`Preview of ${file.name}`}
                            className={styles.previewImg}
                            loading="lazy"
                          />
                        </div>
                      )}
                      
                      <div className={styles.fileDetails}>
                        <div className={styles.fileHeader}>
                          {previewType === 'icon' && (
                            <span className={styles.fileTypeIcon}>{getFileIcon(file.type)}</span>
                          )}
                          <span className={`${styles.fileName} ${disabled ? styles.fileNameDisabled : ''}`}>
                            {file.name}
                          </span>
                          {showClearButton && !disabled && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className={styles.removeFileButton}
                              aria-label={`Supprimer ${file.name}`}
                            >
                              <svg className={styles.removeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          )}
                        </div>
                        
                        <div className={styles.fileMeta}>
                          {showFileSize && (
                            <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                          )}
                          <span className={styles.fileType}>{file.type || 'Inconnu'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noFileInfo}>
                  <svg className={styles.folderIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 19C22 19.5304 21.7893 20.0391 21.4142 20.4142C21.0391 20.7893 20.5304 21 20 21H4C3.46957 21 2.96086 20.7893 2.58579 20.4142C2.21071 20.0391 2 19.5304 2 19V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3H9L11 6H20C20.5304 6 21.0391 6.21071 21.4142 6.58579C21.7893 6.96086 22 7.46957 22 8V19Z" 
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={`${styles.noFileText} ${disabled ? styles.noFileTextDisabled : ''}`}>
                    {placeholderText}
                  </span>
                </div>
              )}
              
              {showAcceptText && (accept || maxFileSize) && (
                <div className={styles.acceptInfo}>
                  {accept && (
                    <div className={styles.acceptBadge}>
                      <svg className={styles.acceptIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={`${styles.fileAccept} ${disabled ? styles.fileAcceptDisabled : ''}`}>
                        {accept.split(',').map(ext => ext.trim()).join(', ')}
                      </span>
                    </div>
                  )}
                  {maxFileSize && (
                    <div className={styles.sizeBadge}>
                      <svg className={styles.sizeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 15H21M9 10H11M13 6H15M7 21H17C18.1046 21 19 20.1046 19 19V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21Z" 
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={styles.fileSizeLimit}>
                        Max: {(maxFileSize / (1024 * 1024)).toFixed(1)}MB
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {hasFiles && showClearButton && !disabled && (
            <div className={styles.clearAllWrapper}>
              <button
                type="button"
                onClick={handleClearFiles}
                className={styles.clearAllButton}
                aria-label="Effacer tous les fichiers"
              >
                <svg className={styles.clearIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Effacer tout
              </button>
            </div>
          )}
          
          {dragDropEnabled && !compactMode && !hasFiles && (
            <div className={styles.dragDropHint}>
              <svg className={styles.dragDropIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13L12 20L5 13M12 4V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>ou glissez-déposez vos fichiers</span>
            </div>
          )}
        </div>
      </div>
      
      {errorMessage && (
        <div className={styles.errorContainer}>
          <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            id={`${fileInputId}-error`} 
            className={styles.errorMessage}
          >
            {errorMessage}
          </span>
        </div>
      )}
      
      {!errorMessage && helperText && (
        <div className={styles.helperContainer}>
          <svg className={styles.helperIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span 
            id={`${fileInputId}-helper`} 
            className={styles.helperText}
          >
            {helperText}
          </span>
        </div>
      )}
      
      {multiple && maxFiles && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(files.length / maxFiles) * 100}%` }}
            />
          </div>
          <div className={styles.progressText}>
            {files.length} sur {maxFiles} fichiers
          </div>
        </div>
      )}
    </div>
  );
};

export default InputFile;