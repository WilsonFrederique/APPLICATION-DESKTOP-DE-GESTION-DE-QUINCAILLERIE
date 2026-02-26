import React, { useState, useMemo } from 'react';
import styles from './VenteHistorique.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import {
  IoReceiptOutline,
  IoFilterOutline,
  IoCalendarOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoEyeOutline,
  IoSearchOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoTimeOutline,
  IoRefreshOutline,
  IoStatsChartOutline
} from "react-icons/io5";
import { FaChartLine, FaPercentage, FaMoneyBillWave } from "react-icons/fa";
import { TbCurrencyDollar, TbTruckDelivery } from "react-icons/tb";
import { MdOutlineSell, MdPayment } from "react-icons/md";

// Données mock pour l'historique des ventes
const mockVentes = [
  {
    id: 1,
    numero: 'FAC-2024-00158',
    client: 'SARL Batiment Plus',
    montant: 1250000,
    date: '2024-03-15 14:30',
    statut: 'payé',
    livraison: 'livrée',
    items: 12,
    vendeur: 'Jean Dupont',
    paiement: 'espèces',
    commission: 125000
  },
  {
    id: 2,
    numero: 'FAC-2024-00157',
    client: 'Mr. Rakoto Jean',
    montant: 380000,
    date: '2024-03-14 11:20',
    statut: 'crédit',
    livraison: 'en attente',
    items: 3,
    vendeur: 'Jean Dupont',
    paiement: 'crédit',
    commission: 38000
  },
  {
    id: 3,
    numero: 'FAC-2024-00156',
    client: 'Entreprise Construction Pro',
    montant: 2450000,
    date: '2024-03-14 09:45',
    statut: 'payé',
    livraison: 'livrée',
    items: 25,
    vendeur: 'Marie Curie',
    paiement: 'virement',
    commission: 245000
  },
  {
    id: 4,
    numero: 'FAC-2024-00155',
    client: 'SARL Batiment Plus',
    montant: 845000,
    date: '2024-03-13 16:15',
    statut: 'payé',
    livraison: 'livrée',
    items: 8,
    vendeur: 'Jean Dupont',
    paiement: 'MVola',
    commission: 84500
  },
  {
    id: 5,
    numero: 'FAC-2024-00154',
    client: 'Mr. Andriana',
    montant: 152000,
    date: '2024-03-12 10:30',
    statut: 'crédit',
    livraison: 'en attente',
    items: 2,
    vendeur: 'Jean Dupont',
    paiement: 'crédit',
    commission: 15200
  },
  {
    id: 6,
    numero: 'FAC-2024-00153',
    client: 'Entreprise Construction Pro',
    montant: 1850000,
    date: '2024-03-11 15:20',
    statut: 'payé',
    livraison: 'livrée',
    items: 18,
    vendeur: 'Marie Curie',
    paiement: 'espèces',
    commission: 185000
  },
  {
    id: 7,
    numero: 'FAC-2024-00152',
    client: 'Mr. Rakoto Jean',
    montant: 620000,
    date: '2024-03-10 13:45',
    statut: 'payé',
    livraison: 'livrée',
    items: 6,
    vendeur: 'Jean Dupont',
    paiement: 'MVola',
    commission: 62000
  },
  {
    id: 8,
    numero: 'FAC-2024-00151',
    client: 'SARL Batiment Plus',
    montant: 3150000,
    date: '2024-03-09 11:10',
    statut: 'payé',
    livraison: 'en cours',
    items: 32,
    vendeur: 'Jean Dupont',
    paiement: 'virement',
    commission: 315000
  },
  {
    id: 9,
    numero: 'FAC-2024-00150',
    client: 'Entreprise Construction Pro',
    montant: 950000,
    date: '2024-03-08 17:30',
    statut: 'payé',
    livraison: 'livrée',
    items: 9,
    vendeur: 'Marie Curie',
    paiement: 'espèces',
    commission: 95000
  },
  {
    id: 10,
    numero: 'FAC-2024-00149',
    client: 'Mr. Andriana',
    montant: 280000,
    date: '2024-03-07 14:15',
    statut: 'payé',
    livraison: 'livrée',
    items: 4,
    vendeur: 'Jean Dupont',
    paiement: 'espèces',
    commission: 28000
  }
];

// Statut du vendeur actuel (à remplacer par le vrai vendeur connecté)
const vendeurActuel = 'Jean Dupont';

const VenteHistorique = () => {
  // États
  const [ventes] = useState(mockVentes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVentes, setSelectedVentes] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const itemsPerPage = 8;

  // Filtrer les ventes du vendeur actuel
  const ventesVendeur = useMemo(() => {
    return ventes.filter(vente => vente.vendeur === vendeurActuel);
  }, [ventes]);

  // Filtrer selon les critères
  const filteredVentes = useMemo(() => {
    let filtered = [...ventesVendeur];
    
    if (searchTerm) {
      filtered = filtered.filter(vente =>
        vente.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vente.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatut !== 'all') {
      filtered = filtered.filter(vente => vente.statut === selectedStatut);
    }
    
    if (selectedDate) {
      filtered = filtered.filter(vente => 
        vente.date.split(' ')[0] === selectedDate
      );
    }
    
    return filtered;
  }, [ventesVendeur, searchTerm, selectedStatut, selectedDate]);

  // Pagination
  const paginatedVentes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredVentes.slice(startIndex, endIndex);
  }, [filteredVentes, currentPage, itemsPerPage]);

  // Statistiques du vendeur
  const statsVendeur = useMemo(() => {
    const ventesVendeur = filteredVentes;
    const aujourdhui = new Date().toLocaleDateString('fr-FR');
    
    const ventesAujourdhui = ventesVendeur.filter(v => 
      new Date(v.date).toLocaleDateString('fr-FR') === aujourdhui
    );
    
    const ventesPayees = ventesVendeur.filter(v => v.statut === 'payé');
    const ventesCredit = ventesVendeur.filter(v => v.statut === 'crédit');
    
    const totalVentes = ventesVendeur.reduce((sum, v) => sum + v.montant, 0);
    const totalCommission = ventesVendeur.reduce((sum, v) => sum + v.commission, 0);
    const totalAujourdhui = ventesAujourdhui.reduce((sum, v) => sum + v.montant, 0);
    const totalCredit = ventesCredit.reduce((sum, v) => sum + v.montant, 0);
    
    return {
      totalVentes: ventesVendeur.length,
      totalMontant: totalVentes,
      totalCommission,
      ventesAujourdhui: ventesAujourdhui.length,
      totalAujourdhui,
      ventesPayees: ventesPayees.length,
      ventesCredit: ventesCredit.length,
      totalCredit
    };
  }, [filteredVentes]);

  // Formatter la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Formatter la date
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

  // Colonnes pour le tableau
  const columns = [
    {
      key: 'numero',
      label: 'N° Facture',
      accessor: 'numero',
      sortable: true,
      width: '140px'
    },
    {
      key: 'client',
      label: 'Client',
      accessor: 'client',
      sortable: true,
      minWidth: '150px'
    },
    {
      key: 'date',
      label: 'Date',
      accessor: 'date',
      sortable: true,
      width: '160px',
      render: (row) => formatDate(row.date)
    },
    {
      key: 'montant',
      label: 'Montant',
      accessor: 'montant',
      sortable: true,
      width: '130px',
      align: 'right',
      render: (row) => formatCurrency(row.montant)
    },
    {
      key: 'commission',
      label: 'Commission',
      accessor: 'commission',
      sortable: true,
      width: '130px',
      align: 'right',
      render: (row) => (
        <span className={styles.commissionBadge}>
          {formatCurrency(row.commission)}
        </span>
      )
    },
    {
      key: 'statut',
      label: 'Statut',
      accessor: 'statut',
      sortable: true,
      width: '120px',
      render: (row) => (
        <span className={`${styles.statusBadge} ${styles[row.statut]}`}>
          {row.statut === 'payé' && <IoCheckmarkCircleOutline />}
          {row.statut === 'crédit' && <IoAlertCircleOutline />}
          {row.statut}
        </span>
      )
    },
    {
      key: 'paiement',
      label: 'Paiement',
      accessor: 'paiement',
      sortable: true,
      width: '120px'
    },
  ];

  // Gérer la sélection des ventes
  const handleSelectionChange = (selectedIds) => {
    setSelectedVentes(selectedIds);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatut('all');
    setSelectedDate('');
    setCurrentPage(1);
  };

  // Exporter les données
  const handleExport = () => {
    alert('Export des données...');
  };

  return (
    <div className={styles.container}>
      {/* En-tête */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>
              <IoReceiptOutline /> Historique de mes Ventes
            </h1>
            <p className={styles.subtitle}>
              Consultez et gérez votre historique de ventes
            </p>
          </div>
          
          {/* Statistiques rapides */}
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <MdOutlineSell />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{statsVendeur.totalVentes}</span>
                <span className={styles.statLabel}>Ventes totales</span>
              </div>
            </div>
            
            <div className={styles.statItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{formatCurrency(statsVendeur.totalCommission)}</span>
                <span className={styles.statLabel}>Commission totale</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.blue}`}>
              <FaMoneyBillWave />
            </div>
            <div className={styles.statCardContent}>
              <h3 className={styles.statCardTitle}>Chiffre d'affaires</h3>
              <p className={styles.statCardValue}>{formatCurrency(statsVendeur.totalMontant)}</p>
              <span className={styles.statCardSubtitle}>Total des ventes</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.green}`}>
              <IoCheckmarkCircleOutline />
            </div>
            <div className={styles.statCardContent}>
              <h3 className={styles.statCardTitle}>Ventes payées</h3>
              <p className={styles.statCardValue}>{statsVendeur.ventesPayees}</p>
              <span className={styles.statCardSubtitle}>{formatCurrency(statsVendeur.totalMontant - statsVendeur.totalCredit)}</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.orange}`}>
              <IoTimeOutline />
            </div>
            <div className={styles.statCardContent}>
              <h3 className={styles.statCardTitle}>À crédit</h3>
              <p className={styles.statCardValue}>{statsVendeur.ventesCredit}</p>
              <span className={styles.statCardSubtitle}>{formatCurrency(statsVendeur.totalCredit)}</span>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.purple}`}>
              <IoStatsChartOutline />
            </div>
            <div className={styles.statCardContent}>
              <h3 className={styles.statCardTitle}>Aujourd'hui</h3>
              <p className={styles.statCardValue}>{statsVendeur.ventesAujourdhui}</p>
              <span className={styles.statCardSubtitle}>{formatCurrency(statsVendeur.totalAujourdhui)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de contrôle */}
      <div className={styles.controlsBar}>
        <div className={styles.searchSection}>
          <Input
            type="text"
            placeholder="Rechercher facture, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            name="search"
            className={styles.searchInput}
            icon={<IoSearchOutline />}
          />
        </div>
        
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <InputSelect
              value={selectedStatut}
              onChange={setSelectedStatut}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'payé', label: 'Payé' },
                { value: 'crédit', label: 'Crédit' }
              ]}
              placeholder="Statut"
              size="small"
              variant="outline"
              icon={<IoFilterOutline />}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              name="date"
              className={styles.dateInput}
              icon={<IoCalendarOutline />}
            />
          </div>
          
          <div className={styles.viewControls}>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'outline'}
              size="small"
              icon="grid"
              onClick={() => setViewMode('cards')}
              className={styles.viewBtn}
              title="Vue cartes"
            />
            <Button
              variant={viewMode === 'table' ? 'primary' : 'outline'}
              size="small"
              icon="list"
              onClick={() => setViewMode('table')}
              className={styles.viewBtn}
              title="Vue tableau"
            />
            <Button
              variant="outline"
              size="small"
              icon="refresh"
              onClick={handleResetFilters}
              className={styles.resetBtn}
              title="Réinitialiser"
            />
          </div>
        </div>
        
        <div className={styles.actionsSection}>
          <Button
            variant="outline"
            size="medium"
            icon="download"
            onClick={handleExport}
            className={styles.exportBtn}
          >
            Exporter
          </Button>
          <Button
            variant="primary"
            size="medium"
            icon="print"
            className={styles.printBtn}
          >
            Imprimer
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        {viewMode === 'table' ? (
          // Vue Tableau
          <div className={styles.tableContainer}>
            <Table
              columns={columns}
              data={paginatedVentes}
              selectable={true}
              sortable={true}
              pagination={true}
              itemsPerPage={itemsPerPage}
              onSelectionChange={handleSelectionChange}
              striped={true}
              hoverEffect={true}
              stickyHeader={true}
              className={styles.dataTable}
            />
          </div>
        ) : (
          // Vue Cartes
          <div className={styles.cardsContainer}>
            <div className={styles.cardsGrid}>
              {paginatedVentes.length > 0 ? (
                paginatedVentes.map((vente) => (
                  <div key={vente.id} className={styles.venteCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardTitle}>
                        <h4 className={styles.cardNumber}>{vente.numero}</h4>
                        <span className={styles.cardClient}>{vente.client}</span>
                      </div>
                      <span className={`${styles.cardStatus} ${styles[vente.statut]}`}>
                        {vente.statut === 'payé' && <IoCheckmarkCircleOutline />}
                        {vente.statut === 'crédit' && <IoAlertCircleOutline />}
                        {vente.statut}
                      </span>
                    </div>
                    
                    <div className={styles.cardContent}>
                      <div className={styles.cardDetail}>
                        <span className={styles.detailLabel}>Date:</span>
                        <span className={styles.detailValue}>{formatDate(vente.date)}</span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.detailLabel}>Montant:</span>
                        <span className={styles.detailValue}>{formatCurrency(vente.montant)}</span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.detailLabel}>Commission:</span>
                        <span className={styles.detailValueCommission}>
                          {formatCurrency(vente.commission)}
                        </span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.detailLabel}>Paiement:</span>
                        <span className={styles.detailValue}>{vente.paiement}</span>
                      </div>
                      <div className={styles.cardDetail}>
                        <span className={styles.detailLabel}>Livraison:</span>
                        <span className={`${styles.deliveryStatus} ${styles[vente.livraison]}`}>
                          <TbTruckDelivery />
                          {vente.livraison}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <IoReceiptOutline className={styles.noResultsIcon} />
                  <h3>Aucune vente trouvée</h3>
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
          </div>
        )}

        {/* Informations de sélection */}
        {selectedVentes.length > 0 && (
          <div className={styles.selectionInfo}>
            <div className={styles.selectionContent}>
              <span className={styles.selectionIcon}>✓</span>
              <span className={styles.selectionText}>
                {selectedVentes.length} vente{selectedVentes.length > 1 ? 's' : ''} sélectionnée{selectedVentes.length > 1 ? 's' : ''}
              </span>
              <Button
                variant="outline"
                size="small"
                icon="print"
                className={styles.selectionAction}
              >
                Imprimer
              </Button>
              <Button
                variant="outline"
                size="small"
                icon="download"
                className={styles.selectionAction}
              >
                Exporter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Pied de page */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <span className={styles.footerText}>
            Vendeur: <strong>{vendeurActuel}</strong>
          </span>
          <span className={styles.footerText}>
            Total des commissions: <strong>{formatCurrency(statsVendeur.totalCommission)}</strong>
          </span>
        </div>
        <div className={styles.footerActions}>
          <Button
            variant="ghost"
            size="small"
            icon="chart"
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
          >
            {viewMode === 'table' ? 'Vue cartes' : 'Vue tableau'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenteHistorique;