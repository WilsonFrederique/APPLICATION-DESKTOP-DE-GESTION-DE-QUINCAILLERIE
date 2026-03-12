import React, { useState, useMemo } from "react";
import styles from './Table.module.css';

const Table = ({ 
  columns, 
  data, 
  className = "", 
  selectable = false,
  sortable = false,
  pagination = false,
  itemsPerPage = 10,
  loading = false,
  onRowClick,
  onSelectionChange,
  striped = false,
  compact = false,
  stickyHeader = false,
  hoverEffect = true
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Tri des données
  const sortedData = useMemo(() => {
    if (!sortable || !sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, sortable]);

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Gestion de la sélection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = new Set(data.map((_, index) => index));
      setSelectedRows(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (rowIndex) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowIndex)) {
      newSelected.delete(rowIndex);
    } else {
      newSelected.add(rowIndex);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  // Gestion du tri
  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Classes dynamiques
  const tableClasses = [
    styles.table,
    compact && styles.compact,
    striped && styles.striped,
    stickyHeader && styles.stickyHeader,
    hoverEffect && styles.hoverEffect,
    className
  ].filter(Boolean).join(' ');

  const rowClasses = (rowIndex) => [
    styles.tr,
    selectedRows.has(rowIndex) && styles.selected,
    striped && rowIndex % 2 === 0 && styles.stripedRow,
    onRowClick && styles.clickable,
    hoverEffect && styles.hoverable
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={tableClasses}>
          <thead className={`${styles.thead} ${stickyHeader ? styles.sticky : ''}`}>
            <tr>
              {selectable && (
                <th className={`${styles.th} ${styles.selectColumn}`}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                    aria-label="Sélectionner toutes les lignes"
                  />
                </th>
              )}
              
              {columns.map((col, i) => (
                <th
                  key={col.key || i}
                  className={styles.th}
                  style={{ 
                    textAlign: col.align || "left", 
                    width: col.width,
                    minWidth: col.minWidth
                  }}
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                >
                  <div className={`${styles.thContent} ${sortable && col.sortable !== false ? styles.sortable : ''}`}>
                    <span className={styles.thLabel}>{col.label}</span>
                    {sortable && col.sortable !== false && (
                      <span className={`${styles.sortIndicator} ${
                        sortConfig.key === col.accessor ? styles.active : ''
                      }`}>
                        {sortConfig.key === col.accessor ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className={styles.tbody}>
            {loading ? (
              // Skeleton loading moderne
              Array.from({ length: itemsPerPage }).map((_, idx) => (
                <tr key={`loading-${idx}`} className={styles.loadingRow}>
                  {selectable && (
                    <td className={styles.td}>
                      <div className={styles.skeletonCheckbox}></div>
                    </td>
                  )}
                  {columns.map((_, colIdx) => (
                    <td key={colIdx} className={styles.td}>
                      <div className={styles.skeletonText}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => {
                const absoluteIndex = (currentPage - 1) * itemsPerPage + idx;
                return (
                  <tr 
                    key={row.id || idx} 
                    className={rowClasses(absoluteIndex)}
                    onClick={() => onRowClick?.(row)}
                    role={onRowClick ? "button" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                  >
                    {selectable && (
                      <td className={styles.td}>
                        <input
                          type="checkbox"
                          checked={selectedRows.has(absoluteIndex)}
                          onChange={() => handleSelectRow(absoluteIndex)}
                          className={styles.checkbox}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Sélectionner la ligne ${idx + 1}`}
                        />
                      </td>
                    )}
                    
                    {columns.map((col, colIdx) => (
                      <td
                        key={col.key || colIdx}
                        className={styles.td}
                        style={{ textAlign: col.align || "left" }}
                        data-label={col.label}
                      >
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className={styles.noData}
                >
                  <div className={styles.noDataContent}>
                    <div className={styles.noDataIcon}>📊</div>
                    <p>Aucune donnée disponible</p>
                    <small>Ajoutez des données pour commencer</small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination moderne */}
      {pagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationControls}>
            <button
              className={`${styles.paginationButton} ${styles.prevButton}`}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              aria-label="Page précédente"
            >
              <span>←</span>
            </button>
            
            <div className={styles.pageNumbers}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    className={`${styles.pageButton} ${
                      currentPage === pageNum ? styles.activePage : ''
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              className={`${styles.paginationButton} ${styles.nextButton}`}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
            >
              <span>→</span>
            </button>
          </div>
          
          <div className={styles.pageInfo}>
            <span className={styles.pageInfoText}>
              Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
            </span>
            <span className={styles.resultsInfo}>
              {paginatedData.length} de {sortedData.length} résultats
            </span>
          </div>
        </div>
      )}

      {/* Informations de sélection */}
      {selectable && selectedRows.size > 0 && (
        <div className={styles.selectionInfo}>
          <div className={styles.selectionCount}>
            <span className={styles.selectionIcon}>✓</span>
            {selectedRows.size} élément{selectedRows.size > 1 ? 's' : ''} sélectionné{selectedRows.size > 1 ? 's' : ''}
          </div>
          <button 
            className={styles.clearSelection}
            onClick={() => {
              setSelectedRows(new Set());
              onSelectionChange?.([]);
            }}
            aria-label="Effacer la sélection"
          >
            Effacer
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;