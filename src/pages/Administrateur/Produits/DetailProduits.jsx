import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './DetailProduits.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTogglerIcons from '../../../components/Input/InputTogglerIcons';
import InputSelect from '../../../components/Input/InputSelect';
import Button from '../../../components/Button/Button';
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCartOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoRefreshOutline,
  IoCashOutline,
  IoReceiptOutline,
  IoPersonOutline,
  IoBarcodeOutline,
  IoCalculatorOutline,
  IoQrCodeOutline,
  IoSaveOutline,
  IoNotificationsOutline,
  IoWalletOutline,
  IoAddOutline,
  IoRemoveOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaWarehouse,
  FaBarcode,
  FaChartLine,
  FaExternalLinkAlt,
  FaHistory,
  FaMoneyBillWave,
  FaCreditCard,
  FaPercentage,
  FaClipboardList,
  FaUserTie,
  FaTags,
  FaWeightHanging,
  FaStore,
  FaShoppingCart
} from "react-icons/fa";
import { 
  TbCurrencyDollar,
  TbPercentage,
  TbBuildingWarehouse,
  TbCategory,
  TbTruckDelivery,
  TbArrowsSort,
  TbListDetails
} from "react-icons/tb";
import { 
  MdAttachMoney,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdInventory,
  MdLocalShipping,
  MdPayment,
  MdCategory,
  MdPointOfSale,
  MdOutlineSell,
  MdOutlineTrendingUp,
  MdOutlineStorefront
} from "react-icons/md";
import { CiSettings, CiMoneyBill, CiCreditCard1, CiShoppingTag } from "react-icons/ci";
import { GiWeight, GiCash, GiShoppingCart } from "react-icons/gi";
import { Chip, emphasize, styled } from '@mui/material';
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

// Données mock pour la démonstration
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
];

const mockProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    description: 'Ciment Portland de haute qualité pour construction générale. Idéal pour les travaux de maçonnerie, béton et enduits. Résistant aux intempéries et durable.',
    stock: 15,
    seuilMin: 20,
    seuilAlerte: 30,
    prixAchat: 35000,
    prixVente: 50000,
    unite: 'sac',
    fournisseur: 'Holcim Madagascar',
    emplacement: 'Entrepôt A, Zone 1, Rack 3',
    peutEtreVenduEnDetail: true,
    prixDetail: 1000,
    uniteDetail: 'kg',
    tvaApplicable: true,
    tauxTVA: 20,
    estPerequitable: false,
    estFragile: false,
    instructionsSpeciales: 'Protéger de l\'humidité. Stocker dans un endroit sec et ventilé.',
    delaiLivraison: '3-5 jours',
    dateCreation: '2024-03-15',
    creerPar: 'Admin',
    derniereModification: '2024-03-25T10:30:00',
    ventesMois: 45,
    revenuMois: 2250000,
    tendance: 'up',
    image: productImages[0]
  },
  {
    id: 2,
    nom: 'Tôle Galvanisée 3m',
    reference: 'TOL-GALV-3M',
    categorie: 'Ferronnerie',
    description: 'Tôle galvanisée de 3m, épaisseur 0.5mm. Excellente résistance à la corrosion. Utilisation: toiture, bardage, gouttières.',
    stock: 8,
    seuilMin: 10,
    seuilAlerte: 25,
    prixAchat: 250000,
    prixVente: 300000,
    unite: 'feuille',
    fournisseur: 'Metaltron',
    emplacement: 'Entrepôt B, Zone 3',
    peutEtreVenduEnDetail: false,
    tvaApplicable: true,
    tauxTVA: 20,
    estPerequitable: false,
    estFragile: true,
    instructionsSpeciales: 'Manutention avec gants. Éviter les rayures sur la surface galvanisée.',
    delaiLivraison: '2-3 jours',
    dateCreation: '2024-02-20',
    creerPar: 'Admin',
    derniereModification: '2024-03-22T14:15:00',
    ventesMois: 12,
    revenuMois: 3600000,
    tendance: 'stable',
    image: productImages[1]
  },
  {
    id: 3,
    nom: 'Vis à Bois 5x50',
    reference: 'VIS-BOIS-5x50',
    categorie: 'Quincaillerie',
    description: 'Vis à bois tête plate, acier galvanisé. Paquet de 100 unités. Excellente résistance à la traction.',
    stock: 1200,
    seuilMin: 500,
    seuilAlerte: 2000,
    prixAchat: 150,
    prixVente: 250,
    unite: 'pièce',
    fournisseur: 'Bricodépôt',
    emplacement: 'Rayon 2, Boîte 15',
    peutEtreVenduEnDetail: true,
    prixDetail: 10,
    uniteDetail: 'pièce',
    tvaApplicable: true,
    tauxTVA: 20,
    estPerequitable: true,
    estFragile: false,
    instructionsSpeciales: '',
    delaiLivraison: '24h',
    dateCreation: '2024-01-10',
    creerPar: 'Manager',
    derniereModification: '2024-03-20T09:45:00',
    ventesMois: 85,
    revenuMois: 21250,
    tendance: 'up',
    image: productImages[2]
  },
  {
    id: 4,
    nom: 'Peinture Blanche 10L',
    reference: 'PEINT-BLANC-10L',
    categorie: 'Peinture',
    description: 'Peinture acrylique mate pour intérieur/extérieur. Haute couvrance, résistante aux intempéries. Rendement: 10m²/L.',
    stock: 5,
    seuilMin: 15,
    seuilAlerte: 25,
    prixAchat: 80000,
    prixVente: 120000,
    unite: 'pot',
    fournisseur: 'Détaillant Local',
    emplacement: 'Rayon 4, Étagère 2',
    peutEtreVenduEnDetail: true,
    prixDetail: 12000,
    uniteDetail: 'L',
    tvaApplicable: true,
    tauxTVA: 20,
    estPerequitable: false,
    estFragile: true,
    instructionsSpeciales: 'Protéger du gel. Bien mélanger avant utilisation. Appliquer à température ambiante.',
    delaiLivraison: '3-5 jours',
    dateCreation: '2024-03-05',
    creerPar: 'Admin',
    derniereModification: '2024-03-18T16:20:00',
    ventesMois: 8,
    revenuMois: 960000,
    tendance: 'down',
    image: productImages[3]
  }
];

const DetailProduits = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  
  // États pour les champs éditables (pour démonstration)
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});
  
  // Options pour les sélecteurs
  const [categories] = useState([
    { value: 'Matériaux Construction', label: 'Matériaux Construction' },
    { value: 'Ferronnerie', label: 'Ferronnerie' },
    { value: 'Quincaillerie', label: 'Quincaillerie' },
    { value: 'Peinture', label: 'Peinture' },
    { value: 'Plomberie', label: 'Plomberie' },
    { value: 'Électricité', label: 'Électricité' },
    { value: 'Outillage', label: 'Outillage' }
  ]);
  
  const [unites] = useState([
    { value: 'sac', label: 'Sac' },
    { value: 'feuille', label: 'Feuille' },
    { value: 'pièce', label: 'Pièce' },
    { value: 'pot', label: 'Pot' },
    { value: 'tuyau', label: 'Tuyau' },
    { value: 'rouleau', label: 'Rouleau' },
    { value: 'paquet', label: 'Paquet' }
  ]);

  // Fonction pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour calculer la marge
  const calculateMarge = () => {
    if (product && product.prixAchat > 0 && product.prixVente > 0) {
      return ((product.prixVente - product.prixAchat) / product.prixAchat * 100).toFixed(2);
    }
    return 0;
  };

  // Fonction pour calculer la valeur du stock
  const calculateStockValue = () => {
    if (product) {
      return product.stock * product.prixVente;
    }
    return 0;
  };

  // Fonction pour déterminer le statut du stock
  const getStockStatus = () => {
    if (!product) return 'good';
    
    if (product.stock <= product.seuilMin) return 'critical';
    if (product.stock <= product.seuilAlerte) return 'warning';
    return 'good';
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  // Charger les données du produit
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      
      // Vérifier si les données sont passées via le state de navigation
      if (location.state?.productData) {
        setProduct(location.state.productData);
        setEditedProduct(location.state.productData);
        setLoading(false);
      } else {
        // Sinon, chercher dans les données mock
        const productId = parseInt(id);
        const foundProduct = mockProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setEditedProduct(foundProduct);
        }
        
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, location.state]);

  // Gestion de l'édition
  const handleEdit = () => {
    if (editMode) {
      // Sauvegarder les modifications
      setProduct(editedProduct);
      alert('Modifications enregistrées !');
    }
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    setEditedProduct(product);
    setEditMode(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des actions
  const handleDelete = () => {
    if (product && window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      // Ici, vous feriez l'appel API pour supprimer le produit
      console.log('Produit supprimé:', product.id);
      navigate('/produitAdmin');
    }
  };

  const handleSale = () => {
    if (product) {
      alert(`Redirection vers le module vente avec: ${product.nom}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (product) {
      const content = `
        Fiche Produit: ${product.nom}
        Référence: ${product.reference}
        Catégorie: ${product.categorie}
        Stock: ${product.stock} ${product.unite}
        Prix d'achat: ${formatCurrency(product.prixAchat)}
        Prix de vente: ${formatCurrency(product.prixVente)}
        Fournisseur: ${product.fournisseur}
        Emplacement: ${product.emplacement}
        Date création: ${formatDate(product.dateCreation)}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-produit-${product.reference}.txt`;
      a.click();
    }
  };

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des détails du produit...</p>
      </div>
    );
  }

  // Si le produit n'est pas trouvé
  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <IoCloseCircleOutline />
        </div>
        <h2 className={styles.errorTitle}>Produit non trouvé</h2>
        <p className={styles.errorText}>
          Le produit que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button 
          variant="primary"
          icon="back"
          onClick={() => navigate('/produitAdmin')}
          className={styles.errorButton}
        >
          Retour à la liste des produits
        </Button>
      </div>
    );
  }

  const stockStatus = getStockStatus();
  const marge = calculateMarge();
  const stockValue = calculateStockValue();
  const prixTTC = product.tvaApplicable 
    ? product.prixVente * (1 + product.tauxTVA / 100)
    : product.prixVente;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* Header avec navigation */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <Button 
              variant="outline"
              size="medium"
              icon="back"
              onClick={() => navigate('/produitAdmin')}
              className={styles.backButton}
            >
              Retour aux produits
            </Button>
            
            <div className={styles.headerActions}>
              <Button 
                variant="secondary"
                size="small"
                icon="print"
                onClick={handlePrint}
                className={styles.headerActionBtn}
              >
                Imprimer
              </Button>
              <Button 
                variant="secondary"
                size="small"
                icon="download"
                onClick={handleExport}
                className={styles.headerActionBtn}
              >
                Exporter
              </Button>
              <Button 
                variant="secondary"
                size="small"
                icon="share"
                onClick={() => alert('Partager via...')}
                className={styles.headerActionBtn}
              >
                Partager
              </Button>
            </div>
          </div>

          <div className={styles.headerMain}>
            <div className={styles.headerInfo}>
              <div className={styles.productTitleSection}>
                <h1 className={styles.productTitle}>{product.nom}</h1>
                <div className={styles.productMeta}>
                  <span className={styles.productRef}>
                    <FaBarcode /> {product.reference}
                  </span>
                  <span className={`${styles.productStatus} ${styles[stockStatus]}`}>
                    {stockStatus === 'critical' ? 'STOCK CRITIQUE' : 
                     stockStatus === 'warning' ? 'STOCK FAIBLE' : 'STOCK DISPONIBLE'}
                  </span>
                </div>
              </div>
              
              <div className={styles.headerStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Valeur stock</div>
                  <div className={styles.statValue}>{formatCurrency(stockValue)}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Marge unitaire</div>
                  <div className={styles.statValue}>{marge}%</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Ventes ce mois</div>
                  <div className={styles.statValue}>
                    {product.ventesMois || 0}
                    <span className={`${styles.trendIndicator} ${styles[product.tendance || 'stable']}`}>
                      {product.tendance === 'up' ? <IoArrowUpOutline /> : 
                       product.tendance === 'down' ? <IoArrowDownOutline /> : '−'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActionsMain}>
              <Button 
                variant="primary"
                size="medium"
                icon={editMode ? "save" : "edit"}
                onClick={handleEdit}
                className={styles.editButton}
              >
                {editMode ? 'Sauvegarder' : 'Modifier'}
              </Button>
              {editMode && (
                <Button 
                  variant="outline"
                  size="medium"
                  icon="close"
                  onClick={handleCancelEdit}
                  className={styles.cancelButton}
                >
                  Annuler
                </Button>
              )}
              <Button 
                variant="secondary"
                size="medium"
                icon="cart"
                onClick={handleSale}
                className={styles.saleButton}
              >
                Vendre
              </Button>
              <Button 
                variant="danger"
                size="medium"
                icon="trash"
                onClick={handleDelete}
                className={styles.deleteButton}
              >
                Supprimer
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
                label="Produits"
                onClick={() => navigate('/produitAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Détails Produit"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </header>

        {/* Navigation par onglets */}
        <nav className={styles.tabNavigation}>
          <Button 
            variant={activeTab === 'general' ? 'primary' : 'outline'}
            size="small"
            icon="box"
            onClick={() => setActiveTab('general')}
            className={styles.tabButton}
          >
            Informations Générales
          </Button>
          <Button 
            variant={activeTab === 'stock' ? 'primary' : 'outline'}
            size="small"
            icon="warehouse"
            onClick={() => setActiveTab('stock')}
            className={styles.tabButton}
          >
            Stock & Prix
          </Button>
          <Button 
            variant={activeTab === 'advanced' ? 'primary' : 'outline'}
            size="small"
            icon="settings"
            onClick={() => setActiveTab('advanced')}
            className={styles.tabButton}
          >
            Options Avancées
          </Button>
          <Button 
            variant={activeTab === 'history' ? 'primary' : 'outline'}
            size="small"
            icon="history"
            onClick={() => setActiveTab('history')}
            className={styles.tabButton}
          >
            Historique
          </Button>
        </nav>

        {/* Contenu principal */}
        <main className={styles.mainContent}>
          {/* Section image et informations principales */}
          <section className={styles.productOverview}>
            <div className={styles.productImageSection}>
              <div className={styles.productImageWrapper}>
                <img 
                  src={product.image || productImages[product.id % productImages.length]} 
                  alt={product.nom}
                  className={styles.productImage}
                />
                <div className={`${styles.stockIndicator} ${styles[stockStatus]}`}>
                  <div className={styles.stockIndicatorText}>
                    <span className={styles.stockNumber}>{product.stock}</span>
                    <span className={styles.stockUnit}>{product.unite}</span>
                  </div>
                  <div className={styles.stockStatusText}>
                    {stockStatus === 'critical' ? 'CRITIQUE' : 
                     stockStatus === 'warning' ? 'FAIBLE' : 'DISPONIBLE'}
                  </div>
                </div>
              </div>
              
              <div className={styles.quickStatsGrid}>
                <div className={styles.quickStat}>
                  <div className={styles.quickStatIcon}>
                    <MdOutlineStorage />
                  </div>
                  <div className={styles.quickStatContent}>
                    <div className={styles.quickStatValue}>{product.stock} {product.unite}</div>
                    <div className={styles.quickStatLabel}>Stock actuel</div>
                  </div>
                </div>
                <div className={styles.quickStat}>
                  <div className={styles.quickStatIcon}>
                    <TbCurrencyDollar />
                  </div>
                  <div className={styles.quickStatContent}>
                    <div className={styles.quickStatValue}>{formatCurrency(product.prixVente)}</div>
                    <div className={styles.quickStatLabel}>Prix de vente</div>
                  </div>
                </div>
                <div className={styles.quickStat}>
                  <div className={styles.quickStatIcon}>
                    <FaWarehouse />
                  </div>
                  <div className={styles.quickStatContent}>
                    <div className={styles.quickStatValue}>{product.emplacement}</div>
                    <div className={styles.quickStatLabel}>Emplacement</div>
                  </div>
                </div>
                <div className={styles.quickStat}>
                  <div className={styles.quickStatIcon}>
                    <FaTruck />
                  </div>
                  <div className={styles.quickStatContent}>
                    <div className={styles.quickStatValue}>{product.fournisseur}</div>
                    <div className={styles.quickStatLabel}>Fournisseur</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contenu de l'onglet actif */}
            <div className={styles.tabContent}>
              {activeTab === 'general' && (
                <div className={styles.tabPanel}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <FaBox /> Informations de Base
                    </h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Nom du produit"
                        value={editMode ? editedProduct.nom : product.nom}
                        onChange={(e) => handleFieldChange('nom', e.target.value)}
                        placeholder="Entrez le nom du produit"
                        icon={<FaBox />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <Input
                        label="Référence"
                        value={editMode ? editedProduct.reference : product.reference}
                        onChange={(e) => handleFieldChange('reference', e.target.value)}
                        placeholder="Entrez la référence"
                        icon={<FaBarcode />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <InputSelect
                        label="Catégorie"
                        value={editMode ? editedProduct.categorie : product.categorie}
                        onChange={(value) => handleFieldChange('categorie', value)}
                        options={categories}
                        placeholder="Sélectionnez une catégorie"
                        icon={<TbCategory />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <InputSelect
                        label="Unité"
                        value={editMode ? editedProduct.unite : product.unite}
                        onChange={(value) => handleFieldChange('unite', value)}
                        options={unites}
                        placeholder="Sélectionnez une unité"
                        icon={<GiWeight />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <InputTextarea
                        label="Description"
                        value={editMode ? editedProduct.description : product.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Description détaillée du produit..."
                        rows={4}
                        icon={<IoInformationCircleOutline />}
                        disabled={!editMode}
                        fullWidth
                        showCharCount
                        maxLength={500}
                        className={styles.formTextarea}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stock' && (
                <div className={styles.tabPanel}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <MdOutlineStorage /> Stock & Prix
                    </h3>
                    <div className={styles.formGrid}>
                      <div className={styles.formRow}>
                        <Input
                          label="Stock actuel"
                          type="number"
                          value={editMode ? editedProduct.stock : product.stock}
                          onChange={(e) => handleFieldChange('stock', parseInt(e.target.value))}
                          placeholder="Quantité en stock"
                          icon={<MdOutlineStorage />}
                          disabled={!editMode}
                          className={styles.formInputHalf}
                        />
                        
                        <Input
                          label="Seuil minimum"
                          type="number"
                          value={editMode ? editedProduct.seuilMin : product.seuilMin}
                          onChange={(e) => handleFieldChange('seuilMin', parseInt(e.target.value))}
                          placeholder="Seuil d'alerte"
                          icon={<IoWarningOutline />}
                          disabled={!editMode}
                          className={styles.formInputHalf}
                        />
                      </div>
                      
                      <div className={styles.formRow}>
                        <Input
                          label="Prix d'achat (HT)"
                          type="number"
                          value={editMode ? editedProduct.prixAchat : product.prixAchat}
                          onChange={(e) => handleFieldChange('prixAchat', parseInt(e.target.value))}
                          placeholder="Prix d'achat"
                          icon={<GiCash />}
                          disabled={!editMode}
                          className={styles.formInputHalf}
                        />
                        
                        <Input
                          label="Prix de vente (HT)"
                          type="number"
                          value={editMode ? editedProduct.prixVente : product.prixVente}
                          onChange={(e) => handleFieldChange('prixVente', parseInt(e.target.value))}
                          placeholder="Prix de vente"
                          icon={<TbCurrencyDollar />}
                          disabled={!editMode}
                          className={styles.formInputHalf}
                        />
                      </div>
                      
                      <div className={styles.formRow}>
                        <InputCheckbox
                          label="Peut être vendu au détail"
                          checked={editMode ? editedProduct.peutEtreVenduEnDetail : product.peutEtreVenduEnDetail}
                          onChange={(e) => handleFieldChange('peutEtreVenduEnDetail', e.target.checked)}
                          disabled={!editMode}
                          color="blue"
                          className={styles.formCheckbox}
                        />
                        
                        {product.peutEtreVenduEnDetail && (
                          <div className={styles.retailOptions}>
                            <Input
                              label="Prix détail"
                              type="number"
                              value={editMode ? editedProduct.prixDetail : product.prixDetail}
                              onChange={(e) => handleFieldChange('prixDetail', parseInt(e.target.value))}
                              placeholder="Prix au détail"
                              icon={<CiShoppingTag />}
                              disabled={!editMode}
                              className={styles.formInput}
                            />
                            <Input
                              label="Unité détail"
                              value={editMode ? editedProduct.uniteDetail : product.uniteDetail}
                              onChange={(e) => handleFieldChange('uniteDetail', e.target.value)}
                              placeholder="Unité pour la vente au détail"
                              icon={<GiWeight />}
                              disabled={!editMode}
                              className={styles.formInput}
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.formRow}>
                        <InputCheckbox
                          label="TVA applicable"
                          checked={editMode ? editedProduct.tvaApplicable : product.tvaApplicable}
                          onChange={(e) => handleFieldChange('tvaApplicable', e.target.checked)}
                          disabled={!editMode}
                          color="green"
                          className={styles.formCheckbox}
                        />
                        
                        {product.tvaApplicable && (
                          <Input
                            label="Taux de TVA (%)"
                            type="number"
                            value={editMode ? editedProduct.tauxTVA : product.tauxTVA}
                            onChange={(e) => handleFieldChange('tauxTVA', parseInt(e.target.value))}
                            placeholder="Taux de TVA"
                            icon={<FaPercentage />}
                            disabled={!editMode}
                            className={styles.formInputHalf}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <TbCurrencyDollar /> Détails TVA
                    </h3>
                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                          <div className={styles.statCardLabel}>Montant TVA unitaire</div>
                          <div className={styles.statCardValue}>
                            {formatCurrency(product.prixVente * (product.tauxTVA / 100))}
                          </div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                          <div className={styles.statCardLabel}>Prix TTC unitaire</div>
                          <div className={styles.statCardValue}>
                            {formatCurrency(prixTTC)}
                          </div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                          <div className={styles.statCardLabel}>Marge unitaire</div>
                          <div className={styles.statCardValue}>
                            {marge}%
                          </div>
                        </div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statCardContent}>
                          <div className={styles.statCardLabel}>Valeur totale du stock</div>
                          <div className={styles.statCardValue}>
                            {formatCurrency(stockValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className={styles.tabPanel}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <CiSettings /> Options Avancées
                    </h3>
                    <div className={styles.formGrid}>
                      <Input
                        label="Fournisseur"
                        value={editMode ? editedProduct.fournisseur : product.fournisseur}
                        onChange={(e) => handleFieldChange('fournisseur', e.target.value)}
                        placeholder="Nom du fournisseur"
                        icon={<FaTruck />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <Input
                        label="Emplacement"
                        value={editMode ? editedProduct.emplacement : product.emplacement}
                        onChange={(e) => handleFieldChange('emplacement', e.target.value)}
                        placeholder="Emplacement dans l'entrepôt"
                        icon={<MdOutlineLocationOn />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <Input
                        label="Délai de livraison"
                        value={editMode ? editedProduct.delaiLivraison : product.delaiLivraison}
                        onChange={(e) => handleFieldChange('delaiLivraison', e.target.value)}
                        placeholder="Délai de livraison"
                        icon={<TbTruckDelivery />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formInput}
                      />
                      
                      <div className={styles.formRow}>
                        <InputCheckbox
                          label="Produit péréquitable"
                          checked={editMode ? editedProduct.estPerequitable : product.estPerequitable}
                          onChange={(e) => handleFieldChange('estPerequitable', e.target.checked)}
                          disabled={!editMode}
                          color="purple"
                          className={styles.formCheckbox}
                        />
                        
                        <InputCheckbox
                          label="Produit fragile"
                          checked={editMode ? editedProduct.estFragile : product.estFragile}
                          onChange={(e) => handleFieldChange('estFragile', e.target.checked)}
                          disabled={!editMode}
                          color="red"
                          className={styles.formCheckbox}
                        />
                      </div>
                      
                      <InputTextarea
                        label="Instructions spéciales"
                        value={editMode ? editedProduct.instructionsSpeciales : product.instructionsSpeciales}
                        onChange={(e) => handleFieldChange('instructionsSpeciales', e.target.value)}
                        placeholder="Instructions de manipulation, stockage..."
                        rows={3}
                        icon={<IoWarningOutline />}
                        disabled={!editMode}
                        fullWidth
                        className={styles.formTextarea}
                      />
                    </div>
                  </div>

                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <IoInformationCircleOutline /> Métadonnées
                    </h3>
                    <div className={styles.metadataGrid}>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>Date de création</div>
                        <div className={styles.metadataValue}>{formatDate(product.dateCreation)}</div>
                      </div>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>Créé par</div>
                        <div className={styles.metadataValue}>{product.creerPar}</div>
                      </div>
                      <div className={styles.metadataItem}>
                        <div className={styles.metadataLabel}>Dernière modification</div>
                        <div className={styles.metadataValue}>{formatDateTime(product.derniereModification)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className={styles.tabPanel}>
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <FaHistory /> Historique Récent
                    </h3>
                    <div className={styles.historyList}>
                      <div className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <IoCalendarOutline />
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyTitle}>Produit ajouté au catalogue</div>
                          <div className={styles.historyDetails}>
                            <span className={styles.historyDate}>{formatDate(product.dateCreation)}</span>
                            <span className={styles.historySeparator}>•</span>
                            <span className={styles.historyUser}>Par: {product.creerPar}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <IoCartOutline />
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyTitle}>Dernière vente enregistrée</div>
                          <div className={styles.historyDetails}>
                            <span className={styles.historyDate}>15 Mars 2024</span>
                            <span className={styles.historySeparator}>•</span>
                            <span className={styles.historyUser}>Quantité: 5 {product.unite}</span>
                            <span className={styles.historySeparator}>•</span>
                            <span className={styles.historyUser}>Montant: {formatCurrency(5 * product.prixVente)}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <IoPencilOutline />
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyTitle}>Dernière modification</div>
                          <div className={styles.historyDetails}>
                            <span className={styles.historyDate}>{formatDateTime(product.derniereModification)}</span>
                            <span className={styles.historySeparator}>•</span>
                            <span className={styles.historyUser}>Par: {product.creerPar}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <IoStatsChartOutline />
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyTitle}>Statistiques du mois</div>
                          <div className={styles.historyDetails}>
                            <span className={styles.historyStat}>
                              Ventes: {product.ventesMois || 0} unités
                            </span>
                            <span className={styles.historySeparator}>•</span>
                            <span className={styles.historyStat}>
                              Revenu: {formatCurrency(product.revenuMois || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Barre latérale avec informations rapides */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <IoWarningOutline /> Aperçu du Stock
              </h3>
              <div className={styles.stockOverview}>
                <div className={styles.stockLevel}>
                  <div className={styles.stockLevelLabel}>Niveau actuel</div>
                  <div className={`${styles.stockLevelValue} ${styles[stockStatus]}`}>
                    {product.stock} {product.unite}
                  </div>
                </div>
                <div className={styles.stockBarContainer}>
                  <div 
                    className={`${styles.stockBar} ${styles[stockStatus]}`}
                    style={{ 
                      width: `${Math.min(100, (product.stock / product.seuilAlerte) * 100)}%` 
                    }}
                  ></div>
                  <div className={styles.stockMarkers}>
                    <div className={styles.stockMarker} style={{ left: '0%' }}>
                      <span className={styles.markerLabel}>0</span>
                    </div>
                    <div 
                      className={styles.stockMarker} 
                      style={{ left: `${(product.seuilMin / product.seuilAlerte) * 100}%` }}
                    >
                      <span className={styles.markerLabel}>Min</span>
                    </div>
                    <div className={styles.stockMarker} style={{ left: '100%' }}>
                      <span className={styles.markerLabel}>Max</span>
                    </div>
                  </div>
                </div>
                <div className={styles.stockDetails}>
                  <div className={styles.stockDetail}>
                    <span className={styles.detailLabel}>Seuil minimum:</span>
                    <span className={styles.detailValue}>{product.seuilMin} {product.unite}</span>
                  </div>
                  <div className={styles.stockDetail}>
                    <span className={styles.detailLabel}>Seuil alerte:</span>
                    <span className={styles.detailValue}>{product.seuilAlerte} {product.unite}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FaChartLine /> Performances
              </h3>
              <div className={styles.performanceStats}>
                <div className={styles.performanceItem}>
                  <div className={styles.performanceIcon}>
                    <IoCartOutline />
                  </div>
                  <div className={styles.performanceContent}>
                    <div className={styles.performanceValue}>{product.ventesMois || 0}</div>
                    <div className={styles.performanceLabel}>Ventes ce mois</div>
                  </div>
                </div>
                <div className={styles.performanceItem}>
                  <div className={styles.performanceIcon}>
                    <TbCurrencyDollar />
                  </div>
                  <div className={styles.performanceContent}>
                    <div className={styles.performanceValue}>
                      {formatCurrency(product.revenuMois || 0)}
                    </div>
                    <div className={styles.performanceLabel}>Revenu mensuel</div>
                  </div>
                </div>
                <div className={styles.performanceItem}>
                  <div className={styles.performanceIcon}>
                    <TbPercentage />
                  </div>
                  <div className={styles.performanceContent}>
                    <div className={`${styles.performanceValue} ${marge > 0 ? styles.positive : styles.negative}`}>
                      {marge}%
                    </div>
                    <div className={styles.performanceLabel}>Marge moyenne</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>
                <FaExternalLinkAlt /> Actions Rapides
              </h3>
              <div className={styles.quickActions}>
                <Button 
                  variant="outline"
                  size="small"
                  icon="add"
                  onClick={() => {
                    const quantity = prompt(`Quantité à ajouter pour ${product.nom}:`, '0');
                    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                      alert(`${quantity} ${product.unite} ajouté(s) au stock`);
                    }
                  }}
                  className={styles.quickActionBtn}
                  fullWidth
                >
                  Ajouter au stock
                </Button>
                <Button 
                  variant="outline"
                  size="small"
                  icon="truck"
                  onClick={() => {
                    alert(`Commande passée pour ${product.nom}`);
                  }}
                  className={styles.quickActionBtn}
                  fullWidth
                >
                  Commander
                </Button>
                <Button 
                  variant="outline"
                  size="small"
                  icon="attachMoney"
                  onClick={() => {
                    const price = prompt(`Nouveau prix de vente pour ${product.nom}:`, product.prixVente);
                    if (price && !isNaN(price) && parseFloat(price) > 0) {
                      alert(`Prix mis à jour: ${formatCurrency(parseFloat(price))}`);
                    }
                  }}
                  className={styles.quickActionBtn}
                  fullWidth
                >
                  Modifier prix
                </Button>
                <Button 
                  variant="outline"
                  size="small"
                  icon="location"
                  onClick={() => {
                    const emplacement = prompt(`Nouvel emplacement pour ${product.nom}:`, product.emplacement);
                    if (emplacement) {
                      alert(`Emplacement mis à jour: ${emplacement}`);
                    }
                  }}
                  className={styles.quickActionBtn}
                  fullWidth
                >
                  Changer emplacement
                </Button>
              </div>
            </div>
          </aside>
        </main>

        {/* Pied de page avec informations supplémentaires */}
        <footer className={styles.detailFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.footerItem}>
              <IoInformationCircleOutline />
              <span>Dernière mise à jour: {formatDateTime(product.derniereModification)}</span>
            </div>
            <div className={styles.footerItem}>
              <IoCheckmarkCircleOutline />
              <span>Produit actif dans le catalogue</span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
              size="small"
              icon="arrowUp"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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

export default DetailProduits;