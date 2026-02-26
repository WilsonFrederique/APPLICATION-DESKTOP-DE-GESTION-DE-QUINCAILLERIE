import React, { useState, useMemo } from 'react';
import styles from './VenteFactures.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import { 
  IoSearchOutline,
  IoEyeOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoReceiptOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoTimeOutline,
  IoCashOutline,
  IoPersonOutline,
  IoStorefrontOutline,
  IoStatsChartOutline,
  IoRefreshOutline,
  IoGridOutline,
  IoListOutline
} from "react-icons/io5";
import { 
  FaChartLine,
  FaFileInvoiceDollar,
  FaRegFilePdf,
  FaRegFileExcel,
  FaMoneyBillWave
} from "react-icons/fa";
import { 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbListDetails
} from "react-icons/tb";
import { 
  MdOutlineSell,
  MdOutlineStorefront,
  MdOutlineTrendingUp
} from "react-icons/md";
import { GiShoppingCart } from "react-icons/gi";

// Données mock pour les factures
const mockFactures = [
  {
    id: 1,
    numero: 'FAC-2024-00158',
    client: 'SARL Batiment Plus',
    date: '2024-03-15 14:30',
    montant: 1250000,
    statut: 'paye',
    paiement: 'espèces',
    livraison: 'livre',
    items: 12,
    vendeur: 'Jean Dupont',
    commission: 125000
  },
  {
    id: 2,
    numero: 'FAC-2024-00157',
    client: 'Mr. Rakoto Jean',
    date: '2024-03-14 11:20',
    montant: 380000,
    statut: 'credit',
    paiement: 'crédit',
    livraison: 'non_livre',
    items: 3,
    vendeur: 'Jean Dupont',
    commission: 38000
  },
  {
    id: 3,
    numero: 'FAC-2024-00156',
    client: 'Entreprise Construction Pro',
    date: '2024-03-14 09:45',
    montant: 2450000,
    statut: 'paye',
    paiement: 'virement',
    livraison: 'livre',
    items: 25,
    vendeur: 'Marie Martin',
    commission: 245000
  },
  {
    id: 4,
    numero: 'FAC-2024-00155',
    client: 'Mr. Andriana',
    date: '2024-03-13 16:15',
    montant: 845000,
    statut: 'paye',
    paiement: 'mvola',
    livraison: 'livre',
    items: 8,
    vendeur: 'Jean Dupont',
    commission: 84500
  },
  {
    id: 5,
    numero: 'FAC-2024-00154',
    client: 'SARL Materiaux Pro',
    date: '2024-03-12 10:30',
    montant: 1520000,
    statut: 'paye',
    paiement: 'espèces',
    livraison: 'non_livre',
    items: 15,
    vendeur: 'Jean Dupont',
    commission: 152000
  },
  {
    id: 6,
    numero: 'FAC-2024-00153',
    client: 'Mr. Ravelojaona',
    date: '2024-03-11 15:45',
    montant: 620000,
    statut: 'credit',
    paiement: 'crédit',
    livraison: 'livre',
    items: 6,
    vendeur: 'Marie Martin',
    commission: 62000
  },
  {
    id: 7,
    numero: 'FAC-2024-00152',
    client: 'Entreprise BTP Plus',
    date: '2024-03-10 13:20',
    montant: 1850000,
    statut: 'paye',
    paiement: 'virement',
    livraison: 'livre',
    items: 18,
    vendeur: 'Jean Dupont',
    commission: 185000
  },
  {
    id: 8,
    numero: 'FAC-2024-00151',
    client: 'Mr. Randria',
    date: '2024-03-09 11:10',
    montant: 340000,
    statut: 'paye',
    paiement: 'espèces',
    livraison: 'non_livre',
    items: 4,
    vendeur: 'Jean Dupont',
    commission: 34000
  },
  {
    id: 9,
    numero: 'FAC-2024-00150',
    client: 'SARL Batiment Plus',
    date: '2024-03-08 09:30',
    montant: 890000,
    statut: 'paye',
    paiement: 'virement',
    livraison: 'livre',
    items: 9,
    vendeur: 'Jean Dupont',
    commission: 89000
  },
  {
    id: 10,
    numero: 'FAC-2024-00149',
    client: 'Mr. Rakoto Jean',
    date: '2024-03-07 16:45',
    montant: 450000,
    statut: 'paye',
    paiement: 'mvola',
    livraison: 'non_livre',
    items: 5,
    vendeur: 'Jean Dupont',
    commission: 45000
  }
];

// Données pour les statistiques
const mockStats = {
  totalVentes: 8250000,
  ventesMois: 12,
  creditEnCours: 430000,
  tauxConversion: 78
};

const VenteFactures = () => {
  // États
  const [factures] = useState(mockFactures);
  const [stats] = useState(mockStats);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [statutFilter, setStatutFilter] = useState('all');
  const [paiementFilter, setPaiementFilter] = useState('all');
  const [livraisonFilter, setLivraisonFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' ou 'stats' ou 'grid'
  const [displayMode, setDisplayMode] = useState('grid'); // 'table' ou 'grid'

  // Formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la date courte
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filtrer les factures
  const filteredFactures = useMemo(() => {
    return factures.filter(facture => {
      // Recherche par client ou numéro
      if (searchTerm && !facture.client.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !facture.numero.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtre par statut
      if (statutFilter !== 'all' && facture.statut !== statutFilter) {
        return false;
      }
      
      // Filtre par paiement
      if (paiementFilter !== 'all' && facture.paiement !== paiementFilter) {
        return false;
      }
      
      // Filtre par livraison
      if (livraisonFilter !== 'all' && facture.livraison !== livraisonFilter) {
        return false;
      }
      
      // Filtre par date
      if (dateDebut || dateFin) {
        const factureDate = new Date(facture.date);
        
        if (dateDebut) {
          const debutDate = new Date(dateDebut);
          if (factureDate < debutDate) return false;
        }
        
        if (dateFin) {
          const finDate = new Date(dateFin);
          finDate.setHours(23, 59, 59, 999);
          if (factureDate > finDate) return false;
        }
      }
      
      return true;
    });
  }, [factures, searchTerm, statutFilter, paiementFilter, livraisonFilter, dateDebut, dateFin]);

  // Colonnes pour le tableau
  const columns = [
    {
      key: 'numero',
      label: 'N° Facture',
      accessor: 'numero',
      render: (row) => (
        <div className={styles.factureNumero}>
          <IoReceiptOutline />
          <strong>{row.numero}</strong>
        </div>
      ),
      width: '180px'
    },
    {
      key: 'client',
      label: 'Client',
      accessor: 'client',
      render: (row) => (
        <div className={styles.clientCell}>
          <IoPersonOutline />
          <span>{row.client}</span>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Date & Heure',
      accessor: 'date',
      render: (row) => formatDate(row.date),
      width: '180px'
    },
    {
      key: 'montant',
      label: 'Montant',
      accessor: 'montant',
      render: (row) => (
        <div className={styles.montantCell}>
          <TbCurrencyDollar />
          <span className={styles.montantValue}>{formatCurrency(row.montant)}</span>
        </div>
      ),
      align: 'right',
      width: '150px'
    },
    {
      key: 'commission',
      label: 'Commission',
      accessor: 'commission',
      render: (row) => (
        <div className={styles.commissionCell}>
          <FaMoneyBillWave />
          <span className={styles.commissionValue}>{formatCurrency(row.commission)}</span>
        </div>
      ),
      align: 'right',
      width: '150px'
    },
    {
      key: 'statut',
      label: 'Statut',
      accessor: 'statut',
      render: (row) => (
        <div className={`${styles.statutBadge} ${styles[row.statut]}`}>
          {row.statut === 'paye' && <IoCheckmarkCircleOutline />}
          {row.statut === 'credit' && <IoAlertCircleOutline />}
          <span>{row.statut === 'paye' ? 'Payé' : 'Crédit'}</span>
        </div>
      ),
      width: '120px'
    },
    {
      key: 'paiement',
      label: 'Paiement',
      accessor: 'paiement',
      render: (row) => (
        <div className={styles.paiementCell}>
          {row.paiement === 'espèces' && <IoCashOutline />}
          {row.paiement === 'virement' && <FaMoneyBillWave />}
          {row.paiement === 'mvola' && <IoCashOutline />}
          {row.paiement === 'crédit' && <IoTimeOutline />}
          <span>{row.paiement}</span>
        </div>
      ),
      width: '140px'
    },
    {
      key: 'livraison',
      label: 'Livraison',
      accessor: 'livraison',
      render: (row) => (
        <div className={`${styles.livraisonBadge} ${styles[row.livraison]}`}>
          <TbTruckDelivery />
          <span>{row.livraison === 'livre' ? 'Livré' : 'À retirer'}</span>
        </div>
      ),
      width: '130px'
    },
    {
      key: 'actions',
      label: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div className={styles.actionsCell}>
          <Button
            variant="outline"
            size="small"
            icon="eye"
            onClick={() => handleViewFacture(row)}
            className={styles.actionBtn}
            aria-label="Voir la facture"
          />
          <Button
            variant="outline"
            size="small"
            icon="print"
            onClick={() => handlePrintFacture(row)}
            className={styles.actionBtn}
            aria-label="Imprimer la facture"
          />
          <Button
            variant="outline"
            size="small"
            icon="download"
            onClick={() => handleDownloadFacture(row)}
            className={styles.actionBtn}
            aria-label="Télécharger la facture"
          />
        </div>
      ),
      width: '180px',
      align: 'center'
    }
  ];

  // Gestion des actions
  const handleViewFacture = (facture) => {
    alert(`Voir la facture: ${facture.numero}`);
    // À implémenter: navigation vers la vue détaillée
  };

  const handlePrintFacture = (facture) => {
    alert(`Imprimer la facture: ${facture.numero}`);
    // À implémenter: impression PDF
  };

  const handleDownloadFacture = (facture) => {
    alert(`Télécharger la facture: ${facture.numero}`);
    // À implémenter: téléchargement PDF
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDateDebut('');
    setDateFin('');
    setStatutFilter('all');
    setPaiementFilter('all');
    setLivraisonFilter('all');
  };

  const handleExportExcel = () => {
    alert('Export Excel des factures');
    // À implémenter: export Excel
  };

  const handleExportPDF = () => {
    alert('Export PDF des factures');
    // À implémenter: export PDF
  };

  // Calcul des statistiques
  const calculateStats = () => {
    const today = new Date().toLocaleDateString('fr-FR');
    const facturesToday = factures.filter(f => 
      new Date(f.date).toLocaleDateString('fr-FR') === today
    );
    
    const totalToday = facturesToday.reduce((sum, f) => sum + f.montant, 0);
    const totalCommissionToday = facturesToday.reduce((sum, f) => sum + f.commission, 0);
    const creditTotal = factures.filter(f => f.statut === 'credit')
      .reduce((sum, f) => sum + f.montant, 0);
    
    return {
      totalToday,
      totalCommissionToday,
      facturesToday: facturesToday.length,
      creditTotal
    };
  };

  const todayStats = calculateStats();

  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <GiShoppingCart /> Mes <span className={styles.highlight}>Factures de Vente</span>
            </h1>
            <p className={styles.subtitle}>
              Gérez et suivez toutes vos factures de vente
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <div className={styles.statsQuick}>
              <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <TbCurrencyDollar />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{formatCurrency(todayStats.totalToday)}</span>
                  <span className={styles.statLabel}>Ventes aujourd'hui</span>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.success}`}>
                  <FaMoneyBillWave />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{formatCurrency(todayStats.totalCommissionToday)}</span>
                  <span className={styles.statLabel}>Commission</span>
                </div>
              </div>
              
              <div className={styles.statItem}>
                <div className={`${styles.statIcon} ${styles.info}`}>
                  <IoReceiptOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{todayStats.facturesToday}</span>
                  <span className={styles.statLabel}>Factures</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.navigationTabs}>
        <Button 
          variant={viewMode === 'list' ? 'primary' : 'ghost'}
          size="medium"
          icon="list"
          onClick={() => setViewMode('list')}
          className={`${styles.tabBtn} ${viewMode === 'list' ? styles.active : ''}`}
        >
          Liste des Factures
        </Button>
        <Button 
          variant={viewMode === 'stats' ? 'primary' : 'ghost'}
          size="medium"
          icon="chart"
          onClick={() => setViewMode('stats')}
          className={`${styles.tabBtn} ${viewMode === 'stats' ? styles.active : ''}`}
        >
          Statistiques
        </Button>
      </div>

      {/* Vue Liste des Factures */}
      {viewMode === 'list' && (
        <div className={styles.listView}>
          {/* Filtres */}
          <div className={styles.filtersSection}>
            <div className={styles.filterRow}>
              <div className={styles.searchBox}>
                <Input
                  type="text"
                  placeholder="Rechercher client, n° facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                  icon={<IoSearchOutline />}
                  fullWidth
                />
              </div>
              
              <div className={styles.filterControls}>
                <div className={styles.filterGroup}>
                  <InputSelect
                    value={statutFilter}
                    onChange={setStatutFilter}
                    options={[
                      { value: 'all', label: 'Tous statuts' },
                      { value: 'paye', label: 'Payé' },
                      { value: 'credit', label: 'Crédit' }
                    ]}
                    placeholder="Statut"
                    size="small"
                    variant="outline"
                    icon={<IoCheckmarkCircleOutline />}
                    fullWidth
                  />
                </div>
                
                <div className={styles.filterGroup}>
                  <InputSelect
                    value={paiementFilter}
                    onChange={setPaiementFilter}
                    options={[
                      { value: 'all', label: 'Tous paiements' },
                      { value: 'espèces', label: 'Espèces' },
                      { value: 'virement', label: 'Virement' },
                      { value: 'mvola', label: 'Mvola' },
                      { value: 'crédit', label: 'Crédit' }
                    ]}
                    placeholder="Paiement"
                    size="small"
                    variant="outline"
                    icon={<IoCashOutline />}
                    fullWidth
                  />
                </div>
                
                <div className={styles.filterGroup}>
                  <InputSelect
                    value={livraisonFilter}
                    onChange={setLivraisonFilter}
                    options={[
                      { value: 'all', label: 'Toutes livraisons' },
                      { value: 'livre', label: 'Livré' },
                      { value: 'non_livre', label: 'À retirer' }
                    ]}
                    placeholder="Livraison"
                    size="small"
                    variant="outline"
                    icon={<TbTruckDelivery />}
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.filterRow}>
              <div className={styles.dateFilters}>
                <div className={styles.dateGroup}>
                  <Input
                    type="date"
                    label="Du"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className={styles.dateInput}
                    icon={<IoCalendarOutline />}
                    fullWidth
                  />
                </div>
                
                <div className={styles.dateGroup}>
                  <Input
                    type="date"
                    label="Au"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className={styles.dateInput}
                    icon={<IoCalendarOutline />}
                    fullWidth
                  />
                </div>
              </div>
              
              <div className={styles.filterActions}>
                <Button 
                  variant="outline"
                  size="medium"
                  icon="refresh"
                  onClick={handleResetFilters}
                  className={styles.resetBtn}
                >
                  Réinitialiser
                </Button>
                
                <div className={styles.displayControls}>
                  <Button 
                    variant={displayMode === 'table' ? 'primary' : 'outline'}
                    size="small"
                    icon="list"
                    onClick={() => setDisplayMode('table')}
                    className={styles.displayBtn}
                    title="Vue Tableau"
                  />
                  <Button 
                    variant={displayMode === 'grid' ? 'primary' : 'outline'}
                    size="small"
                    icon="grid"
                    onClick={() => setDisplayMode('grid')}
                    className={styles.displayBtn}
                    title="Vue Grille"
                  />
                </div>
                
                <div className={styles.exportButtons}>
                  <Button 
                    variant="outline"
                    size="medium"
                    icon="download"
                    onClick={handleExportExcel}
                    className={styles.exportBtn}
                  >
                    Excel
                  </Button>
                  <Button 
                    variant="outline"
                    size="medium"
                    icon="download"
                    onClick={handleExportPDF}
                    className={styles.exportBtn}
                  >
                    PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu - Tableau ou Grille */}
          {displayMode === 'table' ? (
            // Vue Tableau
            <div className={styles.tableSection}>
              <div className={styles.tableHeader}>
                <div className={styles.tableTitle}>
                  <TbListDetails />
                  <h2>Liste des Factures</h2>
                  <span className={styles.countBadge}>
                    {filteredFactures.length} facture(s)
                  </span>
                </div>
                
                <div className={styles.tableSummary}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total:</span>
                    <span className={styles.summaryValue}>
                      {formatCurrency(filteredFactures.reduce((sum, f) => sum + f.montant, 0))}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Commission:</span>
                    <span className={styles.summaryValue}>
                      {formatCurrency(filteredFactures.reduce((sum, f) => sum + f.commission, 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.tableContainer}>
                <Table
                  columns={columns}
                  data={filteredFactures}
                  selectable={false}
                  sortable={true}
                  pagination={true}
                  itemsPerPage={8}
                  hoverEffect={true}
                  striped={true}
                  compact={false}
                  onRowClick={handleViewFacture}
                  className={styles.customTable}
                />
              </div>
            </div>
          ) : (
            // Vue Grille
            <div className={styles.gridSection}>
              <div className={styles.gridHeader}>
                <div className={styles.gridTitle}>
                  <IoGridOutline />
                  <h2>Vue Grille des Factures</h2>
                  <span className={styles.countBadge}>
                    {filteredFactures.length} facture(s)
                  </span>
                </div>
                
                <div className={styles.gridSummary}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total ventes:</span>
                    <span className={styles.summaryValue}>
                      {formatCurrency(filteredFactures.reduce((sum, f) => sum + f.montant, 0))}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total commission:</span>
                    <span className={styles.summaryValue}>
                      {formatCurrency(filteredFactures.reduce((sum, f) => sum + f.commission, 0))}
                    </span>
                  </div>
                </div>
              </div>
              
              {filteredFactures.length > 0 ? (
                <div className={styles.gridContainer}>
                  <div className={styles.facturesGrid}>
                    {filteredFactures.map((facture) => (
                      <div key={facture.id} className={styles.factureCard}>
                        <div className={styles.cardHeader}>
                          <div className={styles.cardNumero}>
                            <IoReceiptOutline />
                            <h3 className={styles.factureNum}>{facture.numero}</h3>
                          </div>
                          <span className={`${styles.cardStatut} ${styles[facture.statut]}`}>
                            {facture.statut === 'paye' && <IoCheckmarkCircleOutline />}
                            {facture.statut === 'credit' && <IoAlertCircleOutline />}
                            {facture.statut === 'paye' ? 'Payé' : 'Crédit'}
                          </span>
                        </div>
                        
                        <div className={styles.cardClient}>
                          <IoPersonOutline />
                          <span className={styles.clientName}>{facture.client}</span>
                        </div>
                        
                        <div className={styles.cardDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Date:</span>
                            <span className={styles.detailValue}>{formatShortDate(facture.date)}</span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Heure:</span>
                            <span className={styles.detailValue}>
                              {new Date(facture.date).toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Montant:</span>
                            <span className={styles.detailValueAmount}>
                              {formatCurrency(facture.montant)}
                            </span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Commission:</span>
                            <span className={styles.detailValueCommission}>
                              {formatCurrency(facture.commission)}
                            </span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Paiement:</span>
                            <span className={styles.detailValue}>
                              {facture.paiement}
                            </span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Livraison:</span>
                            <span className={`${styles.livraisonStatus} ${styles[facture.livraison]}`}>
                              <TbTruckDelivery />
                              {facture.livraison === 'livre' ? 'Livré' : 'À retirer'}
                            </span>
                          </div>
                          
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>Articles:</span>
                            <span className={styles.detailValue}>{facture.items} articles</span>
                          </div>
                        </div>
                        
                        <div className={styles.cardActions}>
                          <Button
                            variant="outline"
                            size="small"
                            icon="eye"
                            onClick={() => handleViewFacture(facture)}
                            className={styles.cardBtn}
                            fullWidth
                          >
                            Détails
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            icon="print"
                            onClick={() => handlePrintFacture(facture)}
                            className={styles.cardBtn}
                            fullWidth
                          >
                            Imprimer
                          </Button>
                          <Button
                            variant="outline"
                            size="small"
                            icon="download"
                            onClick={() => handleDownloadFacture(facture)}
                            className={styles.cardBtn}
                            fullWidth
                          >
                            PDF
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.noResults}>
                  <IoReceiptOutline className={styles.noResultsIcon} />
                  <h3>Aucune facture trouvée</h3>
                  <p>Ajustez vos filtres ou consultez une autre période</p>
                  <Button
                    variant="outline"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersBtn}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Vue Statistiques */}
      {viewMode === 'stats' && (
        <div className={styles.statsView}>
          <div className={styles.statsHeader}>
            <div className={styles.statsTitle}>
              <FaChartLine />
              <h2>Statistiques des Ventes</h2>
            </div>
            <p className={styles.statsSubtitle}>
              Analyse de vos performances commerciales
            </p>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.primary}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(stats.totalVentes)}</span>
                <span className={styles.statLabel}>Total ventes (mois)</span>
                <div className={styles.statTrend}>
                  <MdOutlineTrendingUp />
                  <span className={styles.trendText}>+12.5% vs mois dernier</span>
                </div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.success}`}>
                <IoReceiptOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.ventesMois}</span>
                <span className={styles.statLabel}>Factures émises</span>
                <div className={styles.statTrend}>
                  <MdOutlineTrendingUp />
                  <span className={styles.trendText}>+3 factures vs mois dernier</span>
                </div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.warning}`}>
                <IoTimeOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(stats.creditEnCours)}</span>
                <span className={styles.statLabel}>Crédit en cours</span>
                <div className={styles.statTrend}>
                  <IoAlertCircleOutline />
                  <span className={styles.trendText}>À recouvrer</span>
                </div>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIconWrapper} ${styles.info}`}>
                <IoCheckmarkCircleOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.tauxConversion}%</span>
                <span className={styles.statLabel}>Taux de conversion</span>
                <div className={styles.statTrend}>
                  <MdOutlineTrendingUp />
                  <span className={styles.trendText}>+5.2% vs mois dernier</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.statsDetails}>
            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <IoPersonOutline />
                Top 3 Clients
              </h3>
              <div className={styles.detailList}>
                {factures
                  .reduce((acc, f) => {
                    const existing = acc.find(item => item.client === f.client);
                    if (existing) {
                      existing.montant += f.montant;
                      existing.count += 1;
                    } else {
                      acc.push({
                        client: f.client,
                        montant: f.montant,
                        count: 1
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.montant - a.montant)
                  .slice(0, 3)
                  .map((client, index) => (
                    <div key={index} className={styles.clientItem}>
                      <div className={styles.clientInfo}>
                        <span className={styles.clientName}>{client.client}</span>
                        <span className={styles.clientCount}>{client.count} factures</span>
                      </div>
                      <span className={styles.clientAmount}>
                        {formatCurrency(client.montant)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            
            <div className={styles.detailCard}>
              <h3 className={styles.detailTitle}>
                <IoCashOutline />
                Méthodes de Paiement
              </h3>
              <div className={styles.detailList}>
                {Object.entries(
                  factures.reduce((acc, f) => {
                    acc[f.paiement] = (acc[f.paiement] || 0) + 1;
                    return acc;
                  }, {})
                ).map(([paiement, count], index) => (
                  <div key={index} className={styles.paiementItem}>
                    <div className={styles.paiementInfo}>
                      <span className={styles.paiementName}>
                        {paiement === 'espèces' && 'Espèces'}
                        {paiement === 'virement' && 'Virement'}
                        {paiement === 'mvola' && 'Mvola'}
                        {paiement === 'crédit' && 'Crédit'}
                      </span>
                    </div>
                    <div className={styles.paiementStats}>
                      <span className={styles.paiementCount}>{count} factures</span>
                      <span className={styles.paiementPercent}>
                        {Math.round((count / factures.length) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.statsFooter}>
            <Button 
              variant="outline"
              size="medium"
              icon="download"
              onClick={handleExportExcel}
              className={styles.exportStatsBtn}
            >
              Exporter les statistiques
            </Button>
            <Button 
              variant="outline"
              size="medium"
              icon="print"
              onClick={() => window.print()}
              className={styles.printStatsBtn}
            >
              Imprimer le rapport
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenteFactures;