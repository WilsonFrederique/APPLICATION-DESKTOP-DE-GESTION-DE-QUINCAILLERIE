// Stocks.jsx - Correction des imports MUI
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Stocks.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home"; // Note: @mui/icons-material, pas @mui/icons/material
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoBarChartOutline,
  IoCartOutline,
  IoCubeOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoReceiptOutline,
  IoStatsChartOutline,
  IoStorefrontOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoChevronDownOutline,
  IoDuplicateOutline,
  IoArchiveOutline,
  IoPrintOutline,
  IoShareSocialOutline,
  IoSettingsOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCloudUploadOutline,
  IoDocumentsOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaWarehouse,
  FaTags,
  FaWeightHanging,
  FaBarcode,
  FaClipboardList,
  FaChartLine,
  FaExchangeAlt,
  FaHistory,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt
} from "react-icons/fa";
import { TbBuildingWarehouse, TbCategory, TbCurrencyDollar, TbGraph } from "react-icons/tb";
import { CiMoneyBill } from "react-icons/ci";
import { MdInventory, MdCategory, MdLocalShipping, MdAttachMoney } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { Chip } from '@mui/material';

// Import des composants personnalisés
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import Button from '../../../components/Button/Button';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';

// Images de produits par défaut
const productImages = [
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w-400&h-400&fit-crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&auto=format',
];

// Composant StyledBreadcrumb
const StyledBreadcrumb = ({ label, icon, onClick, style }) => (
  <div style={style} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </div>
);

// Composant de carte de mouvement de stock
const StockMovementCard = ({ movement, index, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'entree': return 'success';
      case 'sortie': return 'danger';
      case 'ajustement': return 'warning';
      case 'retour': return 'accent';
      default: return 'primary';
    }
  };

  const getMovementTypeIcon = (type) => {
    switch (type) {
      case 'entree': return <IoArrowDownOutline />;
      case 'sortie': return <IoArrowUpOutline />;
      case 'ajustement': return <FaExchangeAlt />;
      case 'retour': return <IoRefreshOutline />;
      default: return <FaBox />;
    }
  };

  const getMovementTypeLabel = (type) => {
    switch (type) {
      case 'entree': return 'ENTRÉE';
      case 'sortie': return 'SORTIE';
      case 'ajustement': return 'AJUSTEMENT';
      case 'retour': return 'RETOUR';
      default: return type.toUpperCase();
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M Ar`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K Ar`;
    }
    return `${amount} Ar`;
  };

  return (
    <div 
      className={`${styles.stockMovementCard} ${styles[getMovementTypeColor(movement.type)]}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={styles.movementHeader}>
        <div className={styles.movementType}>
          <div className={`${styles.movementIcon} ${styles[getMovementTypeColor(movement.type)]}`}>
            {getMovementTypeIcon(movement.type)}
          </div>
          <span className={styles.movementTypeLabel}>
            {getMovementTypeLabel(movement.type)}
          </span>
        </div>
        <div className={styles.movementDate}>
          <IoCalendarOutline />
          <span>{formatDate(movement.date)}</span>
        </div>
      </div>
      
      <div className={styles.movementBody}>
        <div className={styles.productInfo}>
          <div className={styles.productImageSmall}>
            <img 
              src={movement.productImage || productImages[movement.productId % productImages.length]} 
              alt={movement.productName}
            />
          </div>
          <div className={styles.productDetails}>
            <h4 className={styles.productName}>{movement.productName}</h4>
            <div className={styles.productMeta}>
              <span className={styles.productRef}>
                <FaBarcode /> {movement.productRef}
              </span>
              <span className={styles.productCategory}>
                <TbCategory /> {movement.productCategory}
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.movementDetails}>
          {movement.prixUnitaire && (
            <div className={styles.priceSection}>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Quantité</span>
                <span className={styles.priceValue}>{movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}</span>
              </div>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Stock après</span>
                <span className={styles.priceValue}>{movement.stockAfter} {movement.unit}</span>
              </div>
            </div>
          )}

          {movement.prixUnitaire && (
            <div className={styles.priceSection}>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Prix unitaire</span>
                <span className={styles.priceValue}>{formatCurrency(movement.prixUnitaire)}</span>
              </div>
              <div className={styles.priceItem}>
                <span className={styles.priceLabel}>Montant total</span>
                <span className={styles.priceValue}>{formatCurrency(movement.montantTotal)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.movementFooter}>
        <div className={styles.movementInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Effectué par:</span>
            <span className={styles.infoValue}>{movement.userName}</span>
          </div>
          {movement.reference && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Référence:</span>
              <span className={styles.infoValue}>{movement.reference}</span>
            </div>
          )}
        </div>
        
        <div className={styles.movementActions}>
          {movement.commentaire && (
            <Button 
              variant="outline"
              size="small"
              icon="info"
              title={movement.commentaire}
              className={styles.outlineBtn}
            >
              Note
            </Button>
          )}
          <Button 
            variant="primary"
            size="small"
            icon="eye"
            onClick={() => onViewDetails(movement)}
            title="Voir détails"
            className={styles.viewBtn}
          />
        </div>
      </div>
    </div>
  );
};

const Stocks = () => {
  const navigate = useNavigate();
  
  // Fonction pour initialiser la date range (30 jours en arrière)
  const initializeDateRange = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    return {
      start: thirtyDaysAgo.toISOString().split('T')[0],
      end: now.toISOString().split('T')[0]
    };
  };

  // Données mock
  const mockProducts = useMemo(() => [
    {
      id: 1,
      nom: 'Ciment 50kg',
      reference: 'CIM-50KG',
      categorie: 'Matériaux Construction',
      stock: 15,
      seuilMin: 20,
      seuilAlerte: 30,
      prixAchat: 35000,
      prixVente: 50000,
      unite: 'sac',
      fournisseur: 'Holcim Madagascar',
      emplacement: 'Entrepôt A, Zone 1',
      image: productImages[0]
    },
    {
      id: 2,
      nom: 'Tôle Galvanisée 3m',
      reference: 'TOL-GALV-3M',
      categorie: 'Ferronnerie',
      stock: 8,
      seuilMin: 10,
      seuilAlerte: 25,
      prixAchat: 250000,
      prixVente: 300000,
      unite: 'feuille',
      fournisseur: 'Metaltron',
      emplacement: 'Entrepôt B, Zone 3',
      image: productImages[1]
    },
    {
      id: 3,
      nom: 'Vis à Bois 5x50',
      reference: 'VIS-BOIS-5x50',
      categorie: 'Quincaillerie',
      stock: 1200,
      seuilMin: 500,
      seuilAlerte: 2000,
      prixAchat: 150,
      prixVente: 250,
      unite: 'pièce',
      fournisseur: 'Bricodépôt',
      emplacement: 'Rayon 2, Boîte 15',
      image: productImages[2]
    }
  ], []);

  const mockMovements = useMemo(() => [
    {
      id: 1,
      type: 'entree',
      productId: 1,
      productName: 'Ciment 50kg',
      productRef: 'CIM-50KG',
      productCategory: 'Matériaux Construction',
      productImage: productImages[0],
      quantity: 50,
      stockBefore: 15,
      stockAfter: 65,
      unit: 'sac',
      prixUnitaire: 35000,
      montantTotal: 1750000,
      userName: 'Admin',
      reference: 'FACT-2024-001',
      commentaire: 'Réapprovisionnement mensuel',
      date: '2024-03-20T10:30:00'
    },
    {
      id: 2,
      type: 'sortie',
      productId: 1,
      productName: 'Ciment 50kg',
      productRef: 'CIM-50KG',
      productCategory: 'Matériaux Construction',
      productImage: productImages[0],
      quantity: -35,
      stockBefore: 65,
      stockAfter: 30,
      unit: 'sac',
      prixUnitaire: 50000,
      montantTotal: 1750000,
      userName: 'Vendeur1',
      reference: 'VENT-2024-001',
      commentaire: 'Vente client entreprise',
      date: '2024-03-21T14:20:00'
    },
    {
      id: 3,
      type: 'retour',
      productId: 2,
      productName: 'Tôle Galvanisée 3m',
      productRef: 'TOL-GALV-3M',
      productCategory: 'Ferronnerie',
      productImage: productImages[1],
      quantity: 20,
      stockBefore: 8,
      stockAfter: 28,
      unit: 'feuille',
      prixUnitaire: 250000,
      montantTotal: 5000000,
      userName: 'Admin',
      reference: 'FACT-2024-002',
      commentaire: 'Commande urgente',
      date: '2024-03-18T09:15:00'
    }
  ], []);

  // États pour les données
  const [products] = useState(mockProducts);
  const [stockMovements] = useState(mockMovements);
  const [filteredMovements] = useState(mockMovements);
  
  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [setDateRange] = useState(initializeDateRange());
  const [sortBy, setSortBy] = useState('date-desc');

  // Gestion des événements
  const handleViewDetails = (movement) => {
    navigate(`/detailStocksAdmin/${movement.id}`, {
      state: { movementData: movement }
    });
  };

  const handleAddStock = () => {
    navigate('/frmStocksAdmin');
  };

  const handleAdjustStock = (product) => {
    navigate(`/ajusterStocksAdmin/${product.id}`, {
      state: { productData: product }
    });
  };

  const handleReapprovisionner = (product) => {
    navigate(`/reapprovisionnerStocksAdmin/${product.id}`, {
      state: { productData: product }
    });
  };

  const handleExportMovements = () => {
    const csvContent = [
      ['Date', 'Type', 'Produit', 'Référence', 'Quantité', 'Unité', 'Prix Unitaire', 'Montant Total', 'Utilisateur', 'Référence Opération'],
      ...filteredMovements.map(m => [
        new Date(m.date).toLocaleDateString('fr-FR'),
        m.type === 'entree' ? 'Entrée' : m.type === 'sortie' ? 'Sortie' : m.type === 'ajustement' ? 'Ajustement' : 'Retour',
        m.productName,
        m.productRef,
        m.quantity,
        m.unit,
        m.prixUnitaire,
        m.montantTotal,
        m.userName,
        m.reference || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mouvements-stock-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedProduct('all');
    setDateRange(initializeDateRange());
    setSortBy('date-desc');
  };

  // Statistiques
  const stats = useMemo(() => {
    const totalEntries = stockMovements.filter(m => m.type === 'entree').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const totalExits = stockMovements.filter(m => m.type === 'sortie').reduce((sum, m) => sum + Math.abs(m.quantity), 0);
    const totalAdjustments = stockMovements.filter(m => m.type === 'ajustement').length;
    const totalReturns = stockMovements.filter(m => m.type === 'retour').length;
    
    const totalEntryValue = stockMovements.filter(m => m.type === 'entree').reduce((sum, m) => sum + m.montantTotal, 0);
    const totalExitValue = stockMovements.filter(m => m.type === 'sortie').reduce((sum, m) => sum + m.montantTotal, 0);
    
    const lowStockProducts = products.filter(p => p.stock <= p.seuilMin).length;
    const criticalStockProducts = products.filter(p => p.stock <= p.seuilMin * 0.5).length;

    return {
      totalEntries,
      totalExits,
      totalAdjustments,
      totalReturns,
      totalEntryValue,
      totalExitValue,
      lowStockProducts,
      criticalStockProducts,
      totalMovements: stockMovements.length
    };
  }, [stockMovements, products]);

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <div className={`${styles.header} ${styles.administrationHeader}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.dashboardTitle}>
                  Gestion des <span className={styles.highlight}>Stocks</span>
                </h1>
                <div className={styles.headerBreadcrumbs}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb
                      component="span"
                      label="Accueil"
                      onClick={() => navigate('/')}
                      style={{ cursor: 'pointer' }}
                    />
                    <StyledBreadcrumb
                      label="Gestion des Stocks"
                    />
                  </Breadcrumbs>
                </div>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <IoArrowDownOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.totalEntries}</span>
                  <span className={styles.statLabel}>Entrées</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.danger}`}>
                  <IoArrowUpOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.totalExits}</span>
                  <span className={styles.statLabel}>Sorties</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.searchSection}>
          <Input
            type="text"
            placeholder="Rechercher produit, référence, utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            name="search"
            className={styles.searchInput}
            icon={<IoSearchOutline />}
          />
        </div>

        {/* Barre de contrôle - Utilisation du composant Input */}
        <div className={styles.dashboardControls}>
          
          <div className={styles.actionsSection}>
            <Button 
              variant="primary"
              size="medium"
              icon="add"
              onClick={handleAddStock}
              className={styles.actionBtn}
            >
              Nouveau Mouvement
            </Button>
            <Button 
              variant="secondary"
              size="medium"
              icon="download"
              onClick={handleExportMovements}
              className={styles.actionBtn}
            >
              Exporter
            </Button>
            <Button 
              variant="secondary"
              size="medium"
              icon="print"
              onClick={() => window.print()}
              className={styles.actionBtn}
            >
              Imprimer
            </Button>
          </div>
        </div>

        {/* Filtres - Utilisation du composant InputSelect */}
        <div className={styles.quickFilters}>
          <div className={styles.filterGroup}>
            <InputSelect
              label="Type"
              value={selectedType}
              onChange={(value) => setSelectedType(value)}
              options={[
                { value: 'all', label: 'Tous les types' },
                { value: 'entree', label: 'Entrées' },
                { value: 'sortie', label: 'Sorties' },
                { value: 'ajustement', label: 'Ajustements' },
                { value: 'retour', label: 'Retours' }
              ]}
              size="small"
              variant="outline"
              icon={<IoFilterOutline />}
              fullWidth
            />
          </div>
          
          <div className={styles.filterGroup}>
            <InputSelect
              label="Produit"
              value={selectedProduct}
              onChange={(value) => setSelectedProduct(value)}
              options={[
                { value: 'all', label: 'Tous les produits' },
                ...products.map(product => ({
                  value: product.id,
                  label: product.nom
                }))
              ]}
              size="small"
              variant="outline"
              icon={<FaBox />}
              fullWidth
            />
          </div>
          
          <div className={styles.filterGroup}>
            <InputSelect
              label="Trier par"
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              options={[
                { value: 'date-desc', label: 'Date (récent)' },
                { value: 'date-asc', label: 'Date (ancien)' },
                { value: 'quantity-desc', label: 'Quantité (haut)' },
                { value: 'quantity-asc', label: 'Quantité (bas)' },
                { value: 'value-desc', label: 'Valeur (haut)' },
                { value: 'value-asc', label: 'Valeur (bas)' }
              ]}
              size="small"
              variant="outline"
              icon={<FaSortAmountDownAlt />}
              fullWidth
            />
          </div>
        </div>

        {/* Statistiques détaillées */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoStatsChartOutline className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Vue d'ensemble du stock</h2>
            </div>
            
            <div className={styles.sectionActions}>
              <Button 
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={handleResetFilters}
                className={styles.resetBtn}
              >
                Réinitialiser
              </Button>
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <FaHistory />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalMovements}</span>
                <span className={styles.statLabel}>Mouvements Totaux</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.danger}`}>
                <IoArrowDownOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalEntryValue}</span>
                <span className={styles.statLabel}>Valeur Entrées</span>
              </div>
            </div>

            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <IoArrowUpOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalExitValue}</span>
                <span className={styles.statLabel}>Valeur Sorties</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.danger}`}>
                <IoAlertCircleOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalExits}</span>
                <span className={styles.statLabel}>Alertes Stock</span>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des mouvements de stock */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <FaHistory className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Historique des mouvements</h2>
                <p className={styles.sectionSubtitle}>
                  {filteredMovements.length} mouvement(s) trouvé(s)
                </p>
              </div>
            </div>
            
            <div className={styles.sectionActions}>
              <Button 
                variant="warning"
                size="medium"
                icon="warning"
                onClick={() => {
                  const criticalProducts = products.filter(p => p.stock <= p.seuilMin);
                  if (criticalProducts.length > 0) {
                    handleReapprovisionner(criticalProducts[0]);
                  }
                }}
                disabled={stats.criticalStockProducts === 0}
                className={styles.alertBtn}
              >
                Réappro Critiques
              </Button>
            </div>
          </div>
          
          <div className={styles.movementsGrid}>
            {filteredMovements.map((movement, index) => (
              <StockMovementCard
                key={movement.id}
                movement={movement}
                index={index}
                onViewDetails={handleViewDetails}
              />
            ))}
            
            {filteredMovements.length === 0 && (
              <div className={styles.noResults}>
                <FaHistory className={styles.noResultsIcon} />
                <h3 className={styles.noResultsTitle}>Aucun mouvement trouvé</h3>
                <p className={styles.noResultsText}>
                  Aucun mouvement ne correspond à vos critères de recherche.
                </p>
                <Button 
                  variant="primary"
                  size="medium"
                  icon="refresh"
                  onClick={handleResetFilters}
                  className={styles.resetBtn}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredMovements.length > 0 && (
            <div className={styles.pagination}>
              <Button 
                variant="outline"
                size="small"
                icon="chevronDown"
                disabled
                className={styles.paginationBtn}
                style={{ transform: 'rotate(-90deg)' }}
              />
              <span className={styles.paginationInfo}>
                Mouvements 1-{filteredMovements.length} sur {filteredMovements.length}
              </span>
              <Button 
                variant="outline"
                size="small"
                icon="chevronDown"
                className={styles.paginationBtn}
                style={{ transform: 'rotate(90deg)' }}
              />
            </div>
          )}
        </section>

        {/* Produits nécessitant attention */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoWarningOutline className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Produits à surveiller</h2>
                <p className={styles.sectionSubtitle}>
                  {stats.lowStockProducts} produit(s) nécessitant attention
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.warningProducts}>
            {products
              .filter(product => product.stock <= product.seuilMin)
              .map(product => {
                const stockStatus = product.stock <= product.seuilMin * 0.5 ? 'critical' : 'warning';
                const percent = (product.stock / product.seuilMin) * 100;
                
                return (
                  <div key={product.id} className={`${styles.warningProductCard} ${styles[stockStatus]}`}>
                    <div className={styles.warningProductHeader}>
                      <div className={styles.productInfoCompact}>
                        <div className={styles.productImageSmall}>
                          <img 
                            src={product.image || productImages[product.id % productImages.length]} 
                            alt={product.nom}
                          />
                        </div>
                        <div className={styles.productDetailsCompact}>
                          <h4 className={styles.productNameCompact}>{product.nom}</h4>
                          <span className={styles.productRefCompact}>{product.reference}</span>
                        </div>
                      </div>
                      <div className={`${styles.stockAlertBadge} ${styles[stockStatus]}`}>
                        {stockStatus === 'critical' ? 'CRITIQUE' : 'ALERTE'}
                      </div>
                    </div>
                    
                    <div className={styles.warningProductBody}>
                      <div className={styles.stockInfo}>
                        <div className={styles.stockProgress}>
                          <div className={styles.progressBar}>
                            <div 
                              className={`${styles.progressFill} ${styles[stockStatus]}`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            ></div>
                          </div>
                          <div className={styles.stockNumbers}>
                            <span className={styles.stockCurrent}>{product.stock} {product.unite}</span>
                            <span className={styles.stockThreshold}>Seuil: {product.seuilMin} {product.unite}</span>
                          </div>
                        </div>
                        
                        <div className={styles.stockActions}>
                          <Button 
                            variant="outline"
                            size="small"
                            icon="add"
                            onClick={() => handleReapprovisionner(product)}
                            className={styles.reapproBtn}
                          >
                            Réapprovisionner
                          </Button>
                          <Button 
                            variant="warning"
                            size="small"
                            icon="exchange"
                            onClick={() => handleAdjustStock(product)}
                            className={styles.adjustBtn}
                          >
                            Ajuster
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            
            {stats.lowStockProducts === 0 && (
              <div className={styles.allGood}>
                <IoCheckmarkCircleOutline className={styles.allGoodIcon} />
                <h3 className={styles.allGoodTitle}>Tous les stocks sont suffisants</h3>
                <p className={styles.allGoodText}>
                  Aucun produit ne nécessite de réapprovisionnement immédiat.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Notes supplémentaires - Utilisation du composant InputTextarea */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoInformationCircleOutline className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Notes & Commentaires</h2>
            </div>
          </div>
          
          <div className={styles.notesSection}>
            <InputTextarea
              label="Ajouter une note sur l'état des stocks"
              placeholder="Ex: Réapprovisionnement prévu pour le ciment le 15/04..."
              rows={4}
              fullWidth
              icon={<IoInformationCircleOutline />}
              helperText="Ces notes sont visibles par tous les gestionnaires de stock"
              showCharCount
              maxLength={500}
            />
            <div className={styles.notesActions}>
              <Button 
                variant="primary"
                size="medium"
                icon="save"
                className={styles.saveNoteBtn}
              >
                Sauvegarder la note
              </Button>
              <Button 
                variant="outline"
                size="medium"
                icon="share"
                className={styles.shareNoteBtn}
              >
                Partager avec l'équipe
              </Button>
            </div>
          </div>
        </section>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Stocks;