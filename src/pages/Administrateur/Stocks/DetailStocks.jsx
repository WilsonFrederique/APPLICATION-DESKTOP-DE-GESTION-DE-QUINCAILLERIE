// DetailStocks.jsx - Version corrigée complète sans IoPersonOutline
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './DetailStocks.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoDuplicateOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoDocumentTextOutline,
  IoReceiptOutline,
  IoEyeOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaBarcode,
  FaClipboardList,
  FaWeightHanging,
  FaChartLine,
  FaUsers,
  FaExchangeAlt,
  FaUserCheck,
  FaHistory
} from "react-icons/fa";
import { 
  TbCategory, 
  TbCurrencyDollar,
  TbPercentage
} from "react-icons/tb";
import { 
  MdAttachMoney,
  MdOutlineStorage,
  MdOutlineAccountBalance,
  MdOutlineSecurity
} from "react-icons/md";
import { Chip, emphasize, styled } from '@mui/material';

// Import des composants personnalisés
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTogglerIcons from '../../../components/Input/InputTogglerIcons';
import InputFile from '../../../components/Input/InputFile';
import InputRadio from '../../../components/Input/InputRadio';
import Button from '../../../components/Button/Button';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';

// Définir StyledBreadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

// Données mock
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop',
];

const mockMovements = [
  {
    id: 1,
    type: 'entree',
    productId: 1,
    productName: 'Ciment 50kg',
    productRef: 'CIM-50KG',
    productCategory: 'Matériaux Construction',
    productDescription: 'Ciment Portland de haute qualité pour construction générale',
    productImage: productImages[0],
    quantity: 50,
    stockBefore: 15,
    stockAfter: 65,
    unit: 'sac',
    prixUnitaire: 35000,
    montantTotal: 1750000,
    userName: 'Admin',
    userRole: 'Administrateur',
    userEmail: 'admin@quincaillerie.mg',
    reference: 'FACT-2024-001',
    fournisseur: 'Holcim Madagascar',
    fournisseurContact: '034 12 345 67',
    commentaire: 'Réapprovisionnement mensuel - Commande #CMD-2024-003',
    date: '2024-03-20T10:30:00',
    status: 'completed',
    emplacement: 'Entrepôt A, Zone 1, Rack 3',
    tvaApplicable: true,
    tauxTVA: 20,
    remise: 0,
    fraisLivraison: 15000,
    bonLivraison: 'BL-2024-001',
    facture: 'FACT-2024-001',
    createdAt: '2024-03-20T10:28:00',
    updatedAt: '2024-03-20T10:30:00'
  },
  {
    id: 2,
    type: 'sortie',
    productId: 1,
    productName: 'Ciment 50kg',
    productRef: 'CIM-50KG',
    productCategory: 'Matériaux Construction',
    productDescription: 'Ciment Portland de haute qualité pour construction générale',
    productImage: productImages[0],
    quantity: -35,
    stockBefore: 65,
    stockAfter: 30,
    unit: 'sac',
    prixUnitaire: 50000,
    montantTotal: 1750000,
    userName: 'Vendeur1',
    userRole: 'Vendeur',
    userEmail: 'vendeur1@quincaillerie.mg',
    reference: 'VENT-2024-001',
    client: 'Entreprise BTP Madagascar',
    clientContact: '034 98 765 43',
    commentaire: 'Vente client entreprise - Projet construction immeuble',
    date: '2024-03-21T14:20:00',
    status: 'completed',
    emplacement: 'Entrepôt A, Zone 1, Rack 3',
    tvaApplicable: true,
    tauxTVA: 20,
    remise: 5,
    fraisLivraison: 25000,
    bonLivraison: 'BL-2024-002',
    facture: 'FACT-2024-002',
    createdAt: '2024-03-21T14:15:00',
    updatedAt: '2024-03-21T14:20:00'
  }
];

const DetailStocks = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [movement, setMovement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Fonction pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour formater la date et heure
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir l'icône du type d'opération
  const getTypeIcon = (type) => {
    switch (type) {
      case 'entree': return <IoArrowDownOutline />;
      case 'sortie': return <IoArrowUpOutline />;
      case 'ajustement': return <FaExchangeAlt />;
      case 'retour': return <IoDuplicateOutline />;
      default: return <FaBox />;
    }
  };

  // Obtenir le libellé du type d'opération
  const getTypeLabel = (type) => {
    switch (type) {
      case 'entree': return 'Entrée de stock';
      case 'sortie': return 'Sortie de stock';
      case 'ajustement': return 'Ajustement';
      case 'retour': return 'Retour fournisseur';
      default: return type;
    }
  };

  // Obtenir la couleur du type d'opération
  const getTypeColor = (type) => {
    switch (type) {
      case 'entree': return 'success';
      case 'sortie': return 'danger';
      case 'ajustement': return 'warning';
      case 'retour': return 'accent';
      default: return 'primary';
    }
  };

  // Obtenir le libellé du statut
  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  };

  // Calculer le montant TVA
  const calculateTVA = () => {
    if (movement && movement.tvaApplicable) {
      return movement.montantTotal * (movement.tauxTVA / 100);
    }
    return 0;
  };

  // Calculer le montant total TTC
  const calculateTotalTTC = () => {
    if (movement) {
      const tva = calculateTVA();
      const remise = movement.remise ? movement.montantTotal * (movement.remise / 100) : 0;
      return movement.montantTotal - remise + tva + (movement.fraisLivraison || 0);
    }
    return 0;
  };

  // Charger les données
  useEffect(() => {
    const loadMovement = () => {
      setLoading(true);
      
      // Vérifier si les données sont passées via le state de navigation
      if (location.state?.movementData) {
        const movementData = location.state.movementData;
        setMovement(movementData);
        setLoading(false);
      } else {
        // Sinon, chercher dans les données mock
        const movementId = parseInt(id);
        const foundMovement = mockMovements.find(m => m.id === movementId);
        
        if (foundMovement) {
          setMovement(foundMovement);
        } else {
          console.warn(`Mouvement avec ID ${id} non trouvé`);
        }
        
        setLoading(false);
      }
    };

    loadMovement();
  }, [id, location.state]);

  // Gestion des actions
  const handleEdit = () => {
    if (!movement) return;
    
    // Navigation vers le formulaire de modification avec les données
    navigate('/frmStocksAdmin', {
      state: { 
        isEdit: true,
        movementId: movement.id,
        movementData: movement
      }
    });
  };

  const handleDelete = () => {
    if (movement && window.confirm(`Êtes-vous sûr de vouloir supprimer le mouvement "${movement.reference}" ?`)) {
      console.log('Mouvement supprimé:', movement.id);
      navigate('/stocksAdmin');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (movement) {
      const content = `
        Fiche Mouvement de Stock
        ========================
        
        Référence: ${movement.reference}
        Type: ${getTypeLabel(movement.type)}
        Date: ${formatDateTime(movement.date)}
        
        Produit: ${movement.productName}
        Référence produit: ${movement.productRef}
        Catégorie: ${movement.productCategory}
        
        Quantité: ${movement.quantity > 0 ? '+' : ''}${movement.quantity} ${movement.unit}
        Stock avant: ${movement.stockBefore} ${movement.unit}
        Stock après: ${movement.stockAfter} ${movement.unit}
        
        Prix unitaire: ${formatCurrency(movement.prixUnitaire)}
        Montant HT: ${formatCurrency(movement.montantTotal)}
        
        TVA: ${movement.tvaApplicable ? `${movement.tauxTVA}%` : 'Non applicable'}
        Montant TVA: ${formatCurrency(calculateTVA())}
        Frais livraison: ${formatCurrency(movement.fraisLivraison || 0)}
        Montant TTC: ${formatCurrency(calculateTotalTTC())}
        
        Éffectué par: ${movement.userName} (${movement.userRole})
        Date création: ${formatDateTime(movement.createdAt)}
        
        Commentaire: ${movement.commentaire}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-mouvement-${movement.reference}.txt`;
      a.click();
    }
  };

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des détails du mouvement...</p>
      </div>
    );
  }

  // Si le mouvement n'est pas trouvé
  if (!movement) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <IoCloseCircleOutline />
        </div>
        <h2 className={styles.errorTitle}>Mouvement non trouvé</h2>
        <p className={styles.errorText}>
          Le mouvement que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button 
          variant="primary"
          size="medium"
          icon="back"
          onClick={() => navigate('/stocksAdmin')}
          className={styles.errorButton}
        >
          Retour à la liste des mouvements
        </Button>
      </div>
    );
  }

  const typeColor = getTypeColor(movement.type);
  const statusColor = getStatusColor(movement.status);
  const tvaAmount = calculateTVA();
  const totalTTC = calculateTotalTTC();
  const remiseAmount = movement.remise ? movement.montantTotal * (movement.remise / 100) : 0;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* Header */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <Button 
              variant="outline"
              size="medium"
              icon="back"
              onClick={() => navigate('/stocksAdmin')}
              className={styles.backButton}
            >
              Retour aux stocks
            </Button>
            
            <div className={styles.headerActions}>
              <Button 
                variant="outline"
                size="small"
                icon="print"
                onClick={handlePrint}
                className={styles.headerActionBtn}
              >
                Imprimer
              </Button>
              <Button 
                variant="outline"
                size="small"
                icon="download"
                onClick={handleExport}
                className={styles.headerActionBtn}
              >
                Exporter
              </Button>
              <Button 
                variant="outline"
                size="small"
                icon="share"
                onClick={() => alert('Partager via...')}
                className={styles.headerActionBtn}
              >
                Partager
              </Button>
            </div>
          </div>

          <div className={styles.headerBreadcrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="span"
                label="Accueil"
                icon={<HomeIcon fontSize="small" />}
                onClick={() => navigate('/dashboardAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Stocks"
                onClick={() => navigate('/stocksAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Détails Mouvement"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </header>

        <header className={styles.detailHeader}>

          <div className={styles.headerMain}>
            <div className={styles.headerInfo}>
              <div className={styles.titleSection}>
                <h1 className={styles.pageTitle}>
                  <span className={`${styles.typeBadge} ${styles[typeColor]}`}>
                    {getTypeIcon(movement.type)}
                    {getTypeLabel(movement.type)}
                  </span>
                  {movement.reference}
                </h1>
                <div className={styles.headerMeta}>
                  <span className={styles.dateInfo}>
                    <IoCalendarOutline />
                    {formatDateTime(movement.date)}
                  </span>
                  <span className={`${styles.statusBadge} ${styles[statusColor]}`}>
                    {getStatusLabel(movement.status)}
                  </span>
                </div>
              </div>
              
              <div className={styles.headerStats}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <MdOutlineAccountBalance />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statLabel}>Montant HT</div>
                    <div className={styles.statValue}>{formatCurrency(movement.montantTotal)}</div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaWeightHanging />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statLabel}>Quantité</div>
                    <div className={`${styles.statValue} ${styles[typeColor]}`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                    </div>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FaUserCheck />
                  </div>
                  <div className={styles.statContent}>
                    <div className={styles.statLabel}>Effectué par</div>
                    <div className={styles.statValue}>{movement.userName}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActionsMain}>
              <Button 
                variant="primary"
                size="medium"
                icon="edit"
                onClick={handleEdit}
                className={styles.primaryActionBtn}
              >
                Modifier
              </Button>
              <Button 
                variant="danger"
                size="medium"
                icon="trash"
                onClick={handleDelete}
                className={styles.dangerActionBtn}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation par onglets */}
        <nav className={styles.tabNavigation}>
          <Button 
            variant={activeTab === 'details' ? 'primary' : 'outline'}
            size="small"
            icon="listDetails"
            onClick={() => setActiveTab('details')}
            className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
          >
            Détails
          </Button>
          <Button 
            variant={activeTab === 'product' ? 'primary' : 'outline'}
            size="small"
            icon="box"
            onClick={() => setActiveTab('product')}
            className={`${styles.tabButton} ${activeTab === 'product' ? styles.active : ''}`}
          >
            Produit
          </Button>
          <Button 
            variant={activeTab === 'financial' ? 'primary' : 'outline'}
            size="small"
            icon="currencyDollar"
            onClick={() => setActiveTab('financial')}
            className={`${styles.tabButton} ${activeTab === 'financial' ? styles.active : ''}`}
          >
            Financier
          </Button>
          <Button 
            variant={activeTab === 'documents' ? 'primary' : 'outline'}
            size="small"
            icon="receipt"
            onClick={() => setActiveTab('documents')}
            className={`${styles.tabButton} ${activeTab === 'documents' ? styles.active : ''}`}
          >
            Documents
          </Button>
        </nav>

        {/* Contenu principal */}
        <main className={styles.mainContent}>
          {/* Section produit */}
          <section className={styles.productSection}>
            <div className={styles.productCard}>
              <div className={styles.productHeader}>
                <div className={styles.productImageWrapper}>
                  <img 
                    src={movement.productImage} 
                    alt={movement.productName}
                    className={styles.productImage}
                  />
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{movement.productName}</h3>
                  <div className={styles.productMeta}>
                    <span className={styles.productRef}>
                      <FaBarcode /> {movement.productRef}
                    </span>
                    <span className={styles.productCategory}>
                      <TbCategory /> {movement.productCategory}
                    </span>
                    <span className={styles.productUnit}>
                      <MdOutlineStorage /> {movement.unit}
                    </span>
                  </div>
                  <p className={styles.productDescription}>
                    {movement.productDescription}
                  </p>
                </div>
              </div>
              
              <div className={styles.stockEvolution}>
                <div className={styles.stockBefore}>
                  <div className={styles.stockLabel}>Stock avant</div>
                  <div className={styles.stockValue}>{movement.stockBefore} {movement.unit}</div>
                </div>
                
                <div className={styles.stockChange}>
                  <div className={`${styles.changeIcon} ${styles[typeColor]}`}>
                    {getTypeIcon(movement.type)}
                  </div>
                  <div className={`${styles.changeValue} ${styles[typeColor]}`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                  </div>
                </div>
                
                <div className={styles.stockAfter}>
                  <div className={styles.stockLabel}>Stock après</div>
                  <div className={styles.stockValue}>{movement.stockAfter} {movement.unit}</div>
                </div>
              </div>
            </div>
          </section>
          
          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>
              <IoInformationCircleOutline /> Informations générales
            </h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Type d'opération</div>
                <div className={`${styles.infoValue} ${styles[typeColor]}`}>
                  {getTypeLabel(movement.type)}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Référence</div>
                <div className={styles.infoValue}>{movement.reference}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Date et heure</div>
                <div className={styles.infoValue}>{formatDateTime(movement.date)}</div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Statut</div>
                <div className={`${styles.infoValue} ${styles[statusColor]}`}>
                  {getStatusLabel(movement.status)}
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Emplacement</div>
                <div className={styles.infoValue}>{movement.emplacement}</div>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h3 className={styles.sectionTitle}>
              <FaUserCheck /> Responsable
            </h3>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <span>{movement.userName.charAt(0)}</span>
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userName}>{movement.userName}</div>
                <div className={styles.userRole}>{movement.userRole}</div>
                <div className={styles.userEmail}>{movement.userEmail}</div>
              </div>
            </div>
          </div>

          {/* Contenu de l'onglet actif */}
          <div className={styles.tabContent}>
            {activeTab === 'details' && (
              <div className={styles.detailsGrid}>
                {movement.type === 'entree' && movement.fournisseur && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <FaTruck /> Fournisseur
                    </h3>
                    <div className={styles.supplierInfo}>
                      <div className={styles.supplierName}>{movement.fournisseur}</div>
                      <div className={styles.supplierContact}>{movement.fournisseurContact}</div>
                    </div>
                  </div>
                )}

                {movement.type === 'sortie' && movement.client && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <FaUsers /> Client
                    </h3>
                    <div className={styles.clientInfo}>
                      <div className={styles.clientName}>{movement.client}</div>
                      <div className={styles.clientContact}>{movement.clientContact}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'product' && (
              <div className={styles.productDetails}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaBox /> Détails du produit
                  </h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Nom du produit</div>
                      <div className={styles.infoValue}>{movement.productName}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Référence</div>
                      <div className={styles.infoValue}>{movement.productRef}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Catégorie</div>
                      <div className={styles.infoValue}>{movement.productCategory}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Description</div>
                      <div className={styles.infoValue}>{movement.productDescription}</div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <MdOutlineStorage /> Évolution du stock
                  </h3>
                  <div className={styles.stockChart}>
                    <div className={styles.chartBar}>
                      <div 
                        className={`${styles.barSegment} ${styles.before}`}
                        style={{ width: `${(movement.stockBefore / (movement.stockAfter + 100)) * 100}%` }}
                      >
                        <span className={styles.barLabel}>Avant: {movement.stockBefore}</span>
                      </div>
                      <div 
                        className={`${styles.barSegment} ${styles.change} ${styles[typeColor]}`}
                        style={{ width: `${(Math.abs(movement.quantity) / (movement.stockAfter + 100)) * 100}%` }}
                      >
                        <span className={styles.barLabel}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </div>
                      <div 
                        className={`${styles.barSegment} ${styles.after}`}
                        style={{ width: `${(movement.stockAfter / (movement.stockAfter + 100)) * 100}%` }}
                      >
                        <span className={styles.barLabel}>Après: {movement.stockAfter}</span>
                      </div>
                    </div>
                    <div className={styles.chartLegend}>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.before}`}></div>
                        <span>Stock avant</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles[typeColor]}`}></div>
                        <span>Changement</span>
                      </div>
                      <div className={styles.legendItem}>
                        <div className={`${styles.legendColor} ${styles.after}`}></div>
                        <span>Stock après</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className={styles.financialDetails}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <TbCurrencyDollar /> Détails financiers
                  </h3>
                  <div className={styles.financialGrid}>
                    <div className={styles.financialItem}>
                      <div className={styles.financialLabel}>Prix unitaire</div>
                      <div className={styles.financialValue}>{formatCurrency(movement.prixUnitaire)}</div>
                    </div>
                    <div className={styles.financialItem}>
                      <div className={styles.financialLabel}>Quantité</div>
                      <div className={styles.financialValue}>
                        {movement.quantity > 0 ? '+' : ''}{movement.quantity} {movement.unit}
                      </div>
                    </div>
                    <div className={styles.financialItem}>
                      <div className={styles.financialLabel}>Montant HT</div>
                      <div className={styles.financialValue}>{formatCurrency(movement.montantTotal)}</div>
                    </div>
                    
                    {movement.remise > 0 && (
                      <div className={styles.financialItem}>
                        <div className={styles.financialLabel}>Remise ({movement.remise}%)</div>
                        <div className={`${styles.financialValue} ${styles.discount}`}>
                          -{formatCurrency(remiseAmount)}
                        </div>
                      </div>
                    )}
                    
                    {movement.tvaApplicable && (
                      <div className={styles.financialItem}>
                        <div className={styles.financialLabel}>TVA ({movement.tauxTVA}%)</div>
                        <div className={styles.financialValue}>+{formatCurrency(tvaAmount)}</div>
                      </div>
                    )}
                    
                    {movement.fraisLivraison > 0 && (
                      <div className={styles.financialItem}>
                        <div className={styles.financialLabel}>Frais de livraison</div>
                        <div className={styles.financialValue}>+{formatCurrency(movement.fraisLivraison)}</div>
                      </div>
                    )}
                    
                    <div className={styles.financialItem}>
                      <div className={`${styles.financialLabel} ${styles.totalLabel}`}>Montant TTC</div>
                      <div className={`${styles.financialValue} ${styles.totalValue}`}>
                        {formatCurrency(totalTTC)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaChartLine /> Analyse financière
                  </h3>
                  <div className={styles.analysisGrid}>
                    <div className={styles.analysisCard}>
                      <div className={styles.analysisIcon}>
                        <TbPercentage />
                      </div>
                      <div className={styles.analysisContent}>
                        <div className={styles.analysisLabel}>Marge unitaire</div>
                        <div className={styles.analysisValue}>
                          {movement.type === 'sortie' 
                            ? `${((movement.prixUnitaire - 35000) / 35000 * 100).toFixed(1)}%`
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.analysisCard}>
                      <div className={styles.analysisIcon}>
                        <MdAttachMoney />
                      </div>
                      <div className={styles.analysisContent}>
                        <div className={styles.analysisLabel}>Valeur stock avant</div>
                        <div className={styles.analysisValue}>
                          {formatCurrency(movement.stockBefore * 35000)}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.analysisCard}>
                      <div className={styles.analysisIcon}>
                        <MdOutlineAccountBalance />
                      </div>
                      <div className={styles.analysisContent}>
                        <div className={styles.analysisLabel}>Valeur stock après</div>
                        <div className={styles.analysisValue}>
                          {formatCurrency(movement.stockAfter * 35000)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className={styles.documentsSection}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <IoReceiptOutline /> Documents associés
                  </h3>
                  
                  <div className={styles.documentsGrid}>
                    {movement.bonLivraison && (
                      <div className={styles.documentCard}>
                        <div className={styles.documentIcon}>
                          <IoDocumentTextOutline />
                        </div>
                        <div className={styles.documentInfo}>
                          <h4 className={styles.documentTitle}>Bon de livraison</h4>
                          <div className={styles.documentRef}>{movement.bonLivraison}</div>
                          <div className={styles.documentDate}>
                            Émis le {formatDateTime(movement.date)}
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <Button 
                            variant="outline"
                            size="small"
                            icon="eye"
                            className={styles.documentBtn}
                          >
                            Voir
                          </Button>
                          <Button 
                            variant="outline"
                            size="small"
                            icon="download"
                            className={styles.documentBtn}
                          >
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {movement.facture && (
                      <div className={styles.documentCard}>
                        <div className={styles.documentIcon}>
                          <IoReceiptOutline />
                        </div>
                        <div className={styles.documentInfo}>
                          <h4 className={styles.documentTitle}>Facture</h4>
                          <div className={styles.documentRef}>{movement.facture}</div>
                          <div className={styles.documentDate}>
                            Émise le {formatDateTime(movement.date)}
                          </div>
                        </div>
                        <div className={styles.documentActions}>
                          <Button 
                            variant="outline"
                            size="small"
                            icon="eye"
                            className={styles.documentBtn}
                          >
                            Voir
                          </Button>
                          <Button 
                            variant="outline"
                            size="small"
                            icon="download"
                            className={styles.documentBtn}
                          >
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className={styles.documentCard}>
                      <div className={styles.documentIcon}>
                        <FaClipboardList />
                      </div>
                      <div className={styles.documentInfo}>
                        <h4 className={styles.documentTitle}>Rapport de mouvement</h4>
                        <div className={styles.documentRef}>{movement.reference}</div>
                        <div className={styles.documentDate}>
                          Généré le {formatDateTime(new Date().toISOString())}
                        </div>
                      </div>
                      <div className={styles.documentActions}>
                        <Button 
                          variant="outline"
                          size="small"
                          icon="print"
                          onClick={handlePrint}
                          className={styles.documentBtn}
                        >
                          Imprimer
                        </Button>
                        <Button 
                          variant="outline"
                          size="small"
                          icon="download"
                          onClick={handleExport}
                          className={styles.documentBtn}
                        >
                          Exporter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <IoInformationCircleOutline /> Commentaire
                  </h3>
                  <div className={styles.commentCard}>
                    <p className={styles.commentText}>{movement.commentaire}</p>
                    <div className={styles.commentMeta}>
                      <span className={styles.commentAuthor}>
                        <FaUserCheck /> {movement.userName}
                      </span>
                      <span className={styles.commentDate}>
                        <IoCalendarOutline /> {formatDateTime(movement.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <div className={styles.sidebarCard}>
          <h3 className={styles.sidebarTitle}>
            <IoTimeOutline /> Historique
          </h3>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <IoCalendarOutline />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitle}>Création</div>
                <div className={styles.timelineDate}>
                  {formatDateTime(movement.createdAt)}
                </div>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <IoCheckmarkCircleOutline />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitle}>Mouvement effectué</div>
                <div className={styles.timelineDate}>
                  {formatDateTime(movement.date)}
                </div>
              </div>
            </div>
            
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <IoDocumentTextOutline />
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineTitle}>Dernière modification</div>
                <div className={styles.timelineDate}>
                  {formatDateTime(movement.updatedAt)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className={styles.quickActions}>
            <h3 className={styles.sidebarTitle}>
              <IoInformationCircleOutline /> Actions rapides
            </h3>
            <Button 
              variant="outline"
              size="small"
              icon="duplicate"
              onClick={() => navigate('/frmStocksAdmin', {
                state: { 
                  isDuplicate: true,
                  movementData: movement
                }
              })}
              className={styles.quickActionBtn}
              fullWidth
            >
              Dupliquer ce mouvement
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="refresh"
              onClick={() => window.location.reload()}
              className={styles.quickActionBtn}
              fullWidth
            >
              Actualiser les données
            </Button>
          </div>
        </div>

        {/* Pied de page */}
        <footer className={styles.detailFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.footerItem}>
              <IoInformationCircleOutline />
              <span>ID: {movement.id} | Créé le: {formatDateTime(movement.createdAt)}</span>
            </div>
            <div className={styles.footerItem}>
              <IoCheckmarkCircleOutline />
              <span>Mouvement vérifié et validé</span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
              size="small"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.footerBtn}
            >
              Retour en haut
            </Button>
          </div>
        </footer>
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default DetailStocks;