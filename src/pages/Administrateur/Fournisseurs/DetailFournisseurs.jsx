import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './DetailFournisseurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  IoTimeOutline,
  IoStatsChartOutline,
  IoBusinessOutline,
  IoDuplicateOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
  IoCashOutline,
  IoCardOutline,
  IoChatboxOutline,
  IoStarOutline,
  IoStar,
  IoArchiveOutline,
  IoFileTrayOutline,
  IoReceiptOutline,
  IoBagHandleOutline,
  IoPeopleOutline
} from "react-icons/io5";
import { 
  FaTruck, 
  FaMoneyBillWave, 
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaRegCreditCard,
  FaClipboardCheck,
  FaFileContract,
  FaHandshake,
  FaShippingFast,
  FaPercent,
  FaCreditCard
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCurrencyDollar, 
  TbPercentage,
  TbTruckDelivery,
  TbCategory,
  TbReceiptTax
} from "react-icons/tb";
import { 
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdOutlineSecurity,
  MdOutlineAccountBalance,
  MdOutlineCorporateFare,
  MdOutlineInventory
} from "react-icons/md";
import { GiPayMoney, GiContract, GiTakeMyMoney } from "react-icons/gi";
import { CiMoneyBill, CiSettings, CiBank, CiDeliveryTruck } from "react-icons/ci";

// Import de vos composants
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import { Chip, emphasize, styled } from '@mui/material';

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

// Fonction pour formater la monnaie
const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) {
    return '0 Ar';
  }
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M Ar`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K Ar`;
  }
  return `${amount.toLocaleString('fr-MG')} Ar`;
};

// Données mock pour la démonstration (corrigées pour correspondre à Fournisseurs.js)
const mockSuppliers = [
  {
    id: 1,
    name: 'Holcim Madagascar',
    category: 'Matériaux Construction',
    email: 'contact@holcim.mg',
    phone: '+261 20 22 123 45',
    address: 'Lot IVK 32 Bis, Ambohidratrimo, Antananarivo',
    website: 'https://www.holcim.mg',
    contactPerson: 'M. Rakoto Andriamalala',
    contactPhone: '+261 34 12 345 67',
    contactEmail: 'rakoto.andriamalala@holcim.mg',
    taxId: '000123456789',
    legalForm: 'SA',
    registrationNumber: 'RCS TANA 2023B1234',
    paymentTerms: '30',
    deliveryTime: '3',
    status: 'active',
    rating: 4.7,
    reliability: 98.5,
    notes: 'Fournisseur principal de ciment depuis 5 ans. Livraison rapide et fiable. Excellente relation commerciale.',
    tags: 'premium, local, fiable',
    bankName: 'BNI Madagascar',
    bankAccount: '00123456789',
    bankIBAN: 'MG46 0000 5012 3456 7890 1234 567',
    bankSwift: 'BICMGMGXXXX',
    contractStart: '2023-01-15',
    contractEnd: '2024-12-31',
    contractReference: 'CONTR-2023-00158',
    creditLimit: 50000000,
    currentCredit: 12500000,
    discountRate: 2.5,
    productsCount: 25,
    ordersCount: 48,
    totalValue: 125000000,
    avgDeliveryTime: 2.5,
    dateCreation: '2023-01-15',
    createdBy: 'Admin',
    lastModified: '2024-03-25T10:30:00',
    recentOrders: [
      { id: 1, reference: 'CMD-2024-00158', date: '15/03/2024', amount: 2500000, status: 'livré', items: 3 },
      { id: 2, reference: 'CMD-2024-00142', date: '28/02/2024', amount: 1800000, status: 'livré', items: 2 },
      { id: 3, reference: 'CMD-2024-00125', date: '15/02/2024', amount: 3200000, status: 'livré', items: 5 }
    ],
    topProducts: [
      { name: 'Ciment 50kg', sales: 1250, revenue: 62500000 },
      { name: 'Ciment 25kg', sales: 850, revenue: 29750000 },
      { name: 'Ciment péréquitable', sales: 420, revenue: 21000000 }
    ],
    performance: {
      onTimeDelivery: 98.5,
      qualityRating: 4.8,
      responseTime: '2h',
      issueResolution: '24h'
    }
  },
  {
    id: 2,
    name: 'Metaltron SA',
    category: 'Ferronnerie',
    email: 'info@metaltron.mg',
    phone: '+261 20 22 234 56',
    address: 'Zone Industrielle, Ivandry, Antananarivo',
    website: 'https://www.metaltron.mg',
    contactPerson: 'Mme. Rasoa Nirina',
    contactPhone: '+261 34 23 456 78',
    contactEmail: 'rasoa.nirina@metaltron.mg',
    taxId: '000987654321',
    legalForm: 'SARL',
    registrationNumber: 'RCS TANA 2022B9876',
    paymentTerms: '15',
    deliveryTime: '5',
    status: 'active',
    rating: 4.3,
    reliability: 95.2,
    notes: 'Spécialiste en tôles galvanisées et produits métalliques. Qualité constante.',
    tags: 'métal, construction, industriel',
    bankName: 'Bank of Africa',
    bankAccount: '00987654321',
    bankIBAN: 'MG46 0000 5098 7654 3210 9876 543',
    bankSwift: 'BOFAMGMGXXXX',
    contractStart: '2023-03-01',
    contractEnd: '2024-12-31',
    contractReference: 'CONTR-2023-00234',
    creditLimit: 30000000,
    currentCredit: 8500000,
    discountRate: 1.5,
    productsCount: 18,
    ordersCount: 32,
    totalValue: 85000000,
    avgDeliveryTime: 4.2,
    dateCreation: '2023-03-01',
    createdBy: 'Manager',
    lastModified: '2024-03-22T14:15:00'
  }
];

const DetailFournisseurs = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  // Fonction pour calculer le crédit disponible
  const calculateAvailableCredit = (supplierData) => {
    if (!supplierData) return 0;
    
    const creditLimit = supplierData.creditLimit || 0;
    const currentCredit = supplierData.currentCredit || 0;
    
    return creditLimit - currentCredit;
  };

  // Fonction pour calculer le taux d'utilisation du crédit
  const calculateCreditUsage = (supplierData) => {
    if (!supplierData) return 0;
    
    const creditLimit = supplierData.creditLimit || 0;
    const currentCredit = supplierData.currentCredit || 0;
    
    if (creditLimit > 0) {
      return (currentCredit / creditLimit) * 100;
    }
    return 0;
  };

  // Fonction pour formater la date (gère le format dd/MM/yyyy)
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    // Si la date est au format dd/MM/yyyy (comme dans Fournisseurs.js)
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        if (isNaN(date.getTime())) {
          return dateString;
        }
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    }
    
    // Sinon, essayer de parser comme Date standard
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour formater la date et heure
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Date inconnue';
    
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      // Essayer de parser si c'est une date au format dd/MM/yyyy
      if (dateTimeString.includes('/')) {
        const parts = dateTimeString.split('/');
        if (parts.length === 3) {
          const simpleDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          if (!isNaN(simpleDate.getTime())) {
            return simpleDate.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
        }
      }
      return dateTimeString;
    }
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction pour obtenir le statut en français
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'inactive': return 'Inactif';
      default: return status;
    }
  };

  // Fonction pour obtenir la classe CSS du statut
  const getStatusClass = (status) => {
    switch(status) {
      case 'active': return 'active';
      case 'pending': return 'pending';
      case 'inactive': return 'inactive';
      default: return '';
    }
  };

  // Charger les données du fournisseur
  useEffect(() => {
    const loadSupplier = () => {
      setLoading(true);
      
      // Vérifier si les données sont passées via le state de navigation
      if (location.state?.supplierData) {
        const loadedSupplier = location.state.supplierData;
        
        // S'assurer que les propriétés de crédit existent
        const enhancedSupplier = {
          ...loadedSupplier,
          creditLimit: loadedSupplier.creditLimit || 0,
          currentCredit: loadedSupplier.currentCredit || 0,
          totalValue: loadedSupplier.totalValue || loadedSupplier.ordersCount * 1000000 || 0,
          productsCount: loadedSupplier.productsCount || 0,
          ordersCount: loadedSupplier.ordersCount || 0,
          rating: loadedSupplier.rating || 0,
          reliability: loadedSupplier.reliability || 0,
          avgDeliveryTime: loadedSupplier.avgDeliveryTime || 0,
          discountRate: loadedSupplier.discountRate || 0,
          recentOrders: loadedSupplier.recentOrders || [],
          topProducts: loadedSupplier.topProducts || [],
          performance: loadedSupplier.performance || {
            onTimeDelivery: 0,
            qualityRating: 0,
            responseTime: 'N/A',
            issueResolution: 'N/A'
          }
        };
        
        setSupplier(enhancedSupplier);
        setLoading(false);
      } else {
        // Sinon, chercher dans les données mock
        const supplierId = parseInt(id);
        const foundSupplier = mockSuppliers.find(s => s.id === supplierId);
        
        if (foundSupplier) {
          // S'assurer que toutes les propriétés existent
          const completeSupplier = {
            ...foundSupplier,
            creditLimit: foundSupplier.creditLimit || 0,
            currentCredit: foundSupplier.currentCredit || 0,
            totalValue: foundSupplier.totalValue || 0,
            productsCount: foundSupplier.productsCount || 0,
            ordersCount: foundSupplier.ordersCount || 0,
            rating: foundSupplier.rating || 0,
            reliability: foundSupplier.reliability || 0,
            avgDeliveryTime: foundSupplier.avgDeliveryTime || 0,
            discountRate: foundSupplier.discountRate || 0,
            recentOrders: foundSupplier.recentOrders || [],
            topProducts: foundSupplier.topProducts || [],
            performance: foundSupplier.performance || {
              onTimeDelivery: 0,
              qualityRating: 0,
              responseTime: 'N/A',
              issueResolution: 'N/A'
            }
          };
          setSupplier(completeSupplier);
        }
        
        setLoading(false);
      }
    };

    loadSupplier();
  }, [id, location.state]);

  // Gestion des actions
  const handleEdit = () => {
    if (supplier) {
      navigate(`/frmFournisseursAdmin/${supplier.id}`, {
        state: { supplierData: supplier }
      });
    }
  };

  const handleDelete = () => {
    if (supplier && window.confirm(`Êtes-vous sûr de vouloir supprimer "${supplier.name}" ?\nCette action est irréversible.`)) {
      console.log('Fournisseur supprimé:', supplier.id);
      navigate('/fournisseursAdmin');
    }
  };

  const handleNewOrder = () => {
    if (supplier) {
      alert(`Créer une nouvelle commande avec: ${supplier.name}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (supplier) {
      const availableCredit = calculateAvailableCredit(supplier);
      const creditUsage = calculateCreditUsage(supplier);
      
      const content = `
        Fiche Fournisseur: ${supplier.name}
        Référence: ${supplier.taxId || 'N/A'}
        Catégorie: ${supplier.category || 'N/A'}
        Contact: ${supplier.contactPerson || 'N/A'}
        Email: ${supplier.email || 'N/A'}
        Téléphone: ${supplier.phone || 'N/A'}
        Adresse: ${supplier.address || 'N/A'}
        Conditions: ${supplier.paymentTerms || 'N/A'} jours net
        Limite de crédit: ${formatCurrency(supplier.creditLimit || 0)}
        Crédit utilisé: ${formatCurrency(supplier.currentCredit || 0)}
        Crédit disponible: ${formatCurrency(availableCredit)}
        Taux d'utilisation: ${creditUsage.toFixed(1)}%
        Date création: ${formatDate(supplier.dateCreation)}
        Statut: ${getStatusText(supplier.status)}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-fournisseur-${supplier.taxId || supplier.name}.txt`;
      a.click();
    }
  };

  // Configuration des colonnes pour le tableau des commandes récentes
  const recentOrdersColumns = [
    {
      label: 'Référence',
      accessor: 'reference',
      render: (row) => (
        <div className={styles.orderRef}>{row.reference}</div>
      )
    },
    {
      label: 'Date',
      accessor: 'date',
      render: (row) => (
        <div className={styles.orderDate}>{row.date}</div>
      )
    },
    {
      label: 'Montant',
      accessor: 'amount',
      align: 'right',
      render: (row) => (
        <div className={styles.orderAmount}>{formatCurrency(row.amount || 0)}</div>
      )
    },
    {
      label: 'Statut',
      accessor: 'status',
      render: (row) => (
        <span className={`${styles.orderStatus} ${styles[row.status]}`}>
          {row.status}
        </span>
      )
    },
    {
      label: 'Articles',
      accessor: 'items',
      align: 'center',
      render: (row) => (
        <div className={styles.orderItems}>{row.items || 0} article(s)</div>
      )
    }
  ];

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des détails du fournisseur...</p>
      </div>
    );
  }

  // Si le fournisseur n'est pas trouvé
  if (!supplier) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <IoCloseCircleOutline />
        </div>
        <h2 className={styles.errorTitle}>Fournisseur non trouvé</h2>
        <p className={styles.errorText}>
          Le fournisseur que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button 
          variant="secondary"
          size="medium"
          icon="back"
          onClick={() => navigate('/fournisseursAdmin')}
          className={styles.errorButton}
        >
          Retour à la liste des fournisseurs
        </Button>
      </div>
    );
  }

  // Calculer les valeurs de crédit
  const availableCredit = calculateAvailableCredit(supplier);
  const creditUsage = calculateCreditUsage(supplier);
  const ratingStars = Array(5).fill(0).map((_, index) => (
    <span key={index} className={styles.starIcon}>
      {index < Math.floor(supplier.rating || 0) ? <IoStar /> : <IoStarOutline />}
    </span>
  ));

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* Header avec navigation */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <Button
              variant="secondary"
              size="medium"
              icon="back"
              onClick={() => navigate('/fournisseursAdmin')}
              className={styles.backButton}
            >
              Retour aux fournisseurs
            </Button>
            
            <div className={styles.headerActions}>
              <Button 
                variant="outline"
                size="medium"
                icon="print"
                onClick={handlePrint}
                className={styles.headerActionBtn}
              >
                Imprimer
              </Button>
              <Button 
                variant="outline"
                size="medium"
                icon="download"
                onClick={handleExport}
                className={styles.headerActionBtn}
              >
                Exporter
              </Button>
              <Button 
                variant="outline"
                size="medium"
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
              <div className={styles.supplierTitleSection}>
                <div className={styles.supplierLogoHeader}>
                  <div className={styles.logoPlaceholderHeader}>
                    {supplier.name.charAt(0)}
                  </div>
                  <div className={styles.supplierHeaderInfo}>
                    <h1 className={styles.supplierTitle}>{supplier.name}</h1>
                    <div className={styles.supplierMeta}>
                      <span className={styles.supplierCategoryBadge}>
                        <TbCategory /> {supplier.category || 'Non catégorisé'}
                      </span>
                      <span className={`${styles.supplierStatus} ${styles[getStatusClass(supplier.status)]}`}>
                        {getStatusText(supplier.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.headerStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Valeur totale</div>
                  <div className={styles.statValue}>{formatCurrency(supplier.totalValue || 0)}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Commandes</div>
                  <div className={styles.statValue}>{supplier.ordersCount || 0}</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Note</div>
                  <div className={styles.statValue}>
                    <div className={styles.ratingStars}>{ratingStars}</div>
                    <span className={styles.ratingValue}>{(supplier.rating || 0).toFixed(1)}/5</span>
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Fiabilité</div>
                  <div className={`${styles.statValue} ${styles.reliability}`}>
                    {(supplier.reliability || 0).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActionsMain}>
              <Button 
                variant="warning"
                size="medium"
                icon="edit"
                onClick={handleEdit}
                className={styles.primaryActionBtn}
              >
                Modifier
              </Button>
              <Button 
                variant="primary"
                size="medium"
                icon="cart"
                onClick={handleNewOrder}
                className={styles.secondaryActionBtn}
              >
                Nouvelle Commande
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
                label="Fournisseurs"
                onClick={() => navigate('/fournisseursAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Détails Fournisseur"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </header>

        {/* Navigation par onglets */}
        <nav className={styles.tabNavigation}>
          <Button 
            variant={activeTab === 'general' ? "primary" : "outline"}
            size="medium"
            icon="business"
            onClick={() => setActiveTab('general')}
            className={styles.tabButton}
          >
            Informations Générales
          </Button>
          <Button 
            variant={activeTab === 'commercial' ? "primary" : "outline"}
            size="medium"
            icon="currencyDollar"
            onClick={() => setActiveTab('commercial')}
            className={styles.tabButton}
          >
            Commercial
          </Button>
          <Button 
            variant={activeTab === 'performance' ? "primary" : "outline"}
            size="medium"
            icon="chartLine"
            onClick={() => setActiveTab('performance')}
            className={styles.tabButton}
          >
            Performance
          </Button>
          <Button 
            variant={activeTab === 'history' ? "primary" : "outline"}
            size="medium"
            icon="time"
            onClick={() => setActiveTab('history')}
            className={styles.tabButton}
          >
            Historique
          </Button>
        </nav>

        {/* Contenu principal */}
        <main className={styles.mainContent}>
          {/* Section informations rapides */}
          <section className={styles.overviewSection}>
            <div className={styles.overviewCard}>
              <div className={styles.overviewHeader}>
                <div className={styles.overviewIcon}>
                  <IoInformationCircleOutline />
                </div>
                <h3 className={styles.overviewTitle}>Informations Rapides</h3>
              </div>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>Contact principal</div>
                  <div className={styles.overviewValue}>{supplier.contactPerson || 'Non renseigné'}</div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>Téléphone</div>
                  <div className={styles.overviewValue}>{supplier.phone || 'Non renseigné'}</div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>Email</div>
                  <div className={styles.overviewValue}>{supplier.email || 'Non renseigné'}</div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>Adresse</div>
                  <div className={styles.overviewValue}>{supplier.address || 'Non renseigné'}</div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>Site web</div>
                  <div className={styles.overviewValue}>
                    {supplier.website ? (
                      <a href={supplier.website} target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                        {supplier.website}
                      </a>
                    ) : 'Non renseigné'}
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <div className={styles.overviewLabel}>NIF/Stat</div>
                  <div className={styles.overviewValue}>{supplier.taxId || 'Non renseigné'}</div>
                </div>
              </div>
            </div>

            {/* Carte de crédit */}
            <div className={styles.creditCard}>
              <div className={styles.creditCardHeader}>
                <div className={styles.creditCardIcon}>
                  <FaCreditCard />
                </div>
                <h3 className={styles.creditCardTitle}>Limite de Crédit</h3>
              </div>
              <div className={styles.creditCardContent}>
                <div className={styles.creditAmounts}>
                  <div className={styles.creditItem}>
                    <div className={styles.creditLabel}>Limite totale</div>
                    <div className={styles.creditValue}>{formatCurrency(supplier.creditLimit || 0)}</div>
                  </div>
                  <div className={styles.creditItem}>
                    <div className={styles.creditLabel}>Utilisé</div>
                    <div className={styles.creditValue}>{formatCurrency(supplier.currentCredit || 0)}</div>
                  </div>
                  <div className={styles.creditItem}>
                    <div className={styles.creditLabel}>Disponible</div>
                    <div className={`${styles.creditValue} ${availableCredit > 0 ? styles.positive : styles.negative}`}>
                      {formatCurrency(availableCredit)}
                    </div>
                  </div>
                </div>
                <div className={styles.creditBar}>
                  <div 
                    className={`${styles.creditBarFill} ${creditUsage > 80 ? styles.danger : creditUsage > 60 ? styles.warning : styles.success}`}
                    style={{ width: `${Math.min(100, creditUsage)}%` }}
                  ></div>
                </div>
                <div className={styles.creditUsage}>
                  <span>Utilisation: {creditUsage.toFixed(1)}%</span>
                  <span className={`${styles.usageStatus} ${creditUsage > 80 ? styles.danger : creditUsage > 60 ? styles.warning : styles.success}`}>
                    {creditUsage > 80 ? 'Élevée' : creditUsage > 60 ? 'Modérée' : 'Basse'}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Contenu de l'onglet actif */}
          <div className={styles.tabContent}>
            {activeTab === 'general' && (
              <div className={styles.tabPanel}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <IoBusinessOutline /> Informations Générales
                  </h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Nom complet</div>
                      <div className={styles.infoValue}>{supplier.name}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Catégorie</div>
                      <div className={styles.infoValue}>
                        <span className={styles.categoryBadge}>{supplier.category || 'Non catégorisé'}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Forme juridique</div>
                      <div className={styles.infoValue}>{supplier.legalForm || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Immatriculation</div>
                      <div className={styles.infoValue}>{supplier.registrationNumber || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Statut</div>
                      <div className={styles.infoValue}>
                        <span className={`${styles.statusBadge} ${styles[getStatusClass(supplier.status)]}`}>
                          {getStatusText(supplier.status)}
                        </span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Tags</div>
                      <div className={styles.infoValue}>
                        <div className={styles.tagsContainer}>
                          {supplier.tags ? (
                            supplier.tags.split(',').map((tag, index) => (
                              <span key={index} className={styles.tag}>
                                {tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className={styles.noTags}>Aucun tag</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaUsers /> Contacts
                  </h3>
                  <div className={styles.contactGrid}>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <IoPeopleOutline />
                      </div>
                      <div className={styles.contactContent}>
                        <div className={styles.contactLabel}>Responsable commercial</div>
                        <div className={styles.contactValue}>{supplier.contactPerson || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <IoCallOutline />
                      </div>
                      <div className={styles.contactContent}>
                        <div className={styles.contactLabel}>Téléphone direct</div>
                        <div className={styles.contactValue}>{supplier.contactPhone || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <IoMailOutline />
                      </div>
                      <div className={styles.contactContent}>
                        <div className={styles.contactLabel}>Email personnel</div>
                        <div className={styles.contactValue}>{supplier.contactEmail || 'Non renseigné'}</div>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.contactIcon}>
                        <IoLocationOutline />
                      </div>
                      <div className={styles.contactContent}>
                        <div className={styles.contactLabel}>Adresse siège</div>
                        <div className={styles.contactValue}>{supplier.address || 'Non renseigné'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <CiBank /> Informations Bancaires
                  </h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Banque</div>
                      <div className={styles.infoValue}>{supplier.bankName || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Numéro de compte</div>
                      <div className={styles.infoValue}>{supplier.bankAccount || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>IBAN</div>
                      <div className={styles.infoValue}>{supplier.bankIBAN || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Code SWIFT/BIC</div>
                      <div className={styles.infoValue}>{supplier.bankSwift || 'Non renseigné'}</div>
                    </div>
                  </div>
                </div>

                {supplier.notes && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <IoDocumentTextOutline /> Notes
                    </h3>
                    <div className={styles.notesContent}>
                      {supplier.notes}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'commercial' && (
              <div className={styles.tabPanel}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaHandshake /> Conditions Commerciales
                  </h3>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Conditions de paiement</div>
                      <div className={styles.infoValue}>
                        {!supplier.paymentTerms || supplier.paymentTerms === '0' ? 'Paiement comptant' : 
                         supplier.paymentTerms === 'end_of_month' ? 'Fin de mois' :
                         supplier.paymentTerms === 'custom' ? 'Conditions personnalisées' :
                         `${supplier.paymentTerms} jours net`}
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Délai de livraison</div>
                      <div className={styles.infoValue}>{supplier.deliveryTime || 0} jours</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Taux de remise</div>
                      <div className={styles.infoValue}>{supplier.discountRate || 0}%</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Contrat référence</div>
                      <div className={styles.infoValue}>{supplier.contractReference || 'Non renseigné'}</div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Durée contrat</div>
                      <div className={styles.infoValue}>
                        Du {formatDate(supplier.contractStart)} au {supplier.contractEnd ? formatDate(supplier.contractEnd) : 'Indéterminée'}
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>Jours restants</div>
                      <div className={styles.infoValue}>
                        {supplier.contractEnd ? 
                          Math.max(0, Math.ceil((new Date(supplier.contractEnd) - new Date()) / (1000 * 60 * 60 * 24))) : 
                          'Indéterminé'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <MdOutlineInventory /> Produits Fournis
                  </h3>
                  <div className={styles.productsStats}>
                    <div className={styles.productStat}>
                      <div className={styles.productStatIcon}>
                        <FaBoxOpen />
                      </div>
                      <div className={styles.productStatContent}>
                        <div className={styles.productStatValue}>{supplier.productsCount || 0}</div>
                        <div className={styles.productStatLabel}>Produits différents</div>
                      </div>
                    </div>
                    <div className={styles.productStat}>
                      <div className={styles.productStatIcon}>
                        <IoCartOutline />
                      </div>
                      <div className={styles.productStatContent}>
                        <div className={styles.productStatValue}>{supplier.ordersCount || 0}</div>
                        <div className={styles.productStatLabel}>Commandes totales</div>
                      </div>
                    </div>
                    <div className={styles.productStat}>
                      <div className={styles.productStatIcon}>
                        <TbCurrencyDollar />
                      </div>
                      <div className={styles.productStatContent}>
                        <div className={styles.productStatValue}>{formatCurrency(supplier.totalValue || 0)}</div>
                        <div className={styles.productStatLabel}>Valeur totale</div>
                      </div>
                    </div>
                    <div className={styles.productStat}>
                      <div className={styles.productStatIcon}>
                        <CiDeliveryTruck />
                      </div>
                      <div className={styles.productStatContent}>
                        <div className={styles.productStatValue}>{supplier.avgDeliveryTime || 0} jours</div>
                        <div className={styles.productStatLabel}>Délai moyen</div>
                      </div>
                    </div>
                  </div>
                </div>

                {supplier.topProducts && supplier.topProducts.length > 0 && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <IoStarOutline /> Produits les Plus Vendants
                    </h3>
                    <div className={styles.topProducts}>
                      {supplier.topProducts.map((product, index) => (
                        <div key={index} className={styles.topProductItem}>
                          <div className={styles.productRank}>
                            <span className={styles.rankNumber}>{index + 1}</span>
                          </div>
                          <div className={styles.productInfo}>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.productStats}>
                              <span className={styles.productSales}>{product.sales || 0} ventes</span>
                              <span className={styles.productRevenue}>{formatCurrency(product.revenue || 0)}</span>
                            </div>
                          </div>
                          <div className={styles.productBar}>
                            <div 
                              className={styles.productBarFill}
                              style={{ 
                                width: `${((product.revenue || 0) / Math.max(...supplier.topProducts.map(p => p.revenue || 0))) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className={styles.tabPanel}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaChartLine /> Évaluation & Performance
                  </h3>
                  <div className={styles.performanceGrid}>
                    <div className={styles.performanceItem}>
                      <div className={styles.performanceIcon}>
                        <IoStar />
                      </div>
                      <div className={styles.performanceContent}>
                        <div className={styles.performanceValue}>{(supplier.rating || 0).toFixed(1)}/5</div>
                        <div className={styles.performanceLabel}>Note globale</div>
                        <div className={styles.performanceStars}>
                          {ratingStars}
                        </div>
                      </div>
                    </div>
                    <div className={styles.performanceItem}>
                      <div className={styles.performanceIcon}>
                        <FaClipboardCheck />
                      </div>
                      <div className={styles.performanceContent}>
                        <div className={styles.performanceValue}>{(supplier.reliability || 0).toFixed(1)}%</div>
                        <div className={styles.performanceLabel}>Fiabilité</div>
                        <div className={styles.performanceTrend}>
                          {(supplier.reliability || 0) >= 95 ? 'Excellente' : 
                           (supplier.reliability || 0) >= 85 ? 'Bonne' : 
                           (supplier.reliability || 0) >= 75 ? 'Moyenne' : 'À améliorer'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.performanceItem}>
                      <div className={styles.performanceIcon}>
                        <FaShippingFast />
                      </div>
                      <div className={styles.performanceContent}>
                        <div className={styles.performanceValue}>{supplier.avgDeliveryTime || 0}j</div>
                        <div className={styles.performanceLabel}>Délai moyen</div>
                        <div className={styles.performanceTrend}>
                          {(supplier.avgDeliveryTime || 0) <= 2 ? 'Rapide' : 
                           (supplier.avgDeliveryTime || 0) <= 5 ? 'Normal' : 'Lent'}
                        </div>
                      </div>
                    </div>
                    <div className={styles.performanceItem}>
                      <div className={styles.performanceIcon}>
                        <FaPercent />
                      </div>
                      <div className={styles.performanceContent}>
                        <div className={styles.performanceValue}>{supplier.discountRate || 0}%</div>
                        <div className={styles.performanceLabel}>Remise moyenne</div>
                        <div className={styles.performanceTrend}>
                          {(supplier.discountRate || 0) >= 5 ? 'Élevée' : 
                           (supplier.discountRate || 0) >= 2 ? 'Standard' : 'Basse'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {supplier.performance && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <IoStatsChartOutline /> Indicateurs de Performance
                    </h3>
                    <div className={styles.metricsGrid}>
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <CiDeliveryTruck />
                          </div>
                          <div className={styles.metricTitle}>Livraison à temps</div>
                        </div>
                        <div className={styles.metricValue}>{supplier.performance.onTimeDelivery || 0}%</div>
                        <div className={styles.metricBar}>
                          <div 
                            className={`${styles.metricBarFill} ${(supplier.performance.onTimeDelivery || 0) >= 95 ? styles.success : 
                                      (supplier.performance.onTimeDelivery || 0) >= 85 ? styles.warning : styles.danger}`}
                            style={{ width: `${supplier.performance.onTimeDelivery || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <IoStarOutline />
                          </div>
                          <div className={styles.metricTitle}>Qualité produits</div>
                        </div>
                        <div className={styles.metricValue}>{supplier.performance.qualityRating || 0}/5</div>
                        <div className={styles.metricBar}>
                          <div 
                            className={`${styles.metricBarFill} ${(supplier.performance.qualityRating || 0) >= 4.5 ? styles.success : 
                                      (supplier.performance.qualityRating || 0) >= 4 ? styles.warning : styles.danger}`}
                            style={{ width: `${((supplier.performance.qualityRating || 0) / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <IoChatboxOutline />
                          </div>
                          <div className={styles.metricTitle}>Temps de réponse</div>
                        </div>
                        <div className={styles.metricValue}>{supplier.performance.responseTime || 'N/A'}</div>
                        <div className={styles.metricTrend}>
                          {supplier.performance.responseTime && 
                           supplier.performance.responseTime.includes('h') && 
                           parseInt(supplier.performance.responseTime) <= 2 ? 'Rapide' : 'Normal'}
                        </div>
                      </div>
                      <div className={styles.metricItem}>
                        <div className={styles.metricHeader}>
                          <div className={styles.metricIcon}>
                            <IoCheckmarkCircleOutline />
                          </div>
                          <div className={styles.metricTitle}>Résolution problèmes</div>
                        </div>
                        <div className={styles.metricValue}>{supplier.performance.issueResolution || 'N/A'}</div>
                        <div className={styles.metricTrend}>
                          {supplier.performance.issueResolution && 
                           supplier.performance.issueResolution.includes('24h') ? 'Efficace' : 'À surveiller'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className={styles.tabPanel}>
                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <IoTimeOutline /> Historique Récent
                  </h3>
                  <div className={styles.historyGrid}>
                    <div className={styles.historyItem}>
                      <div className={styles.historyIcon}>
                        <IoCalendarOutline />
                      </div>
                      <div className={styles.historyContent}>
                        <div className={styles.historyTitle}>Fournisseur ajouté</div>
                        <div className={styles.historyDetails}>
                          <span className={styles.historyDate}>{formatDate(supplier.dateCreation)}</span>
                          <span className={styles.historySeparator}>•</span>
                          <span className={styles.historyUser}>Par: {supplier.createdBy || 'Admin'}</span>
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
                          <span className={styles.historyDate}>{formatDateTime(supplier.lastModified)}</span>
                          <span className={styles.historySeparator}>•</span>
                          <span className={styles.historyUser}>Par: {supplier.createdBy || 'Admin'}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.historyItem}>
                      <div className={styles.historyIcon}>
                        <FaFileContract />
                      </div>
                      <div className={styles.historyContent}>
                        <div className={styles.historyTitle}>Contrat signé</div>
                        <div className={styles.historyDetails}>
                          <span className={styles.historyDate}>{formatDate(supplier.contractStart)}</span>
                          <span className={styles.historySeparator}>•</span>
                          <span className={styles.historyUser}>Réf: {supplier.contractReference || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {supplier.recentOrders && supplier.recentOrders.length > 0 && (
                  <div className={styles.infoSection}>
                    <h3 className={styles.sectionTitle}>
                      <IoReceiptOutline /> Dernières Commandes
                    </h3>
                    <div className={styles.tableContainer}>
                      <Table 
                        columns={recentOrdersColumns}
                        data={supplier.recentOrders}
                        className={styles.ordersTable}
                        compact={true}
                        striped={true}
                        hoverEffect={true}
                      />
                    </div>
                  </div>
                )}

                <div className={styles.infoSection}>
                  <h3 className={styles.sectionTitle}>
                    <IoStatsChartOutline /> Statistiques Globales
                  </h3>
                  <div className={styles.statsOverview}>
                    <div className={styles.statOverview}>
                      <div className={styles.statOverviewValue}>{supplier.ordersCount || 0}</div>
                      <div className={styles.statOverviewLabel}>Commandes totales</div>
                      <div className={styles.statOverviewTrend}>
                        <IoArrowUpOutline />
                        <span>+12% ce mois</span>
                      </div>
                    </div>
                    <div className={styles.statOverview}>
                      <div className={styles.statOverviewValue}>{formatCurrency(supplier.totalValue || 0)}</div>
                      <div className={styles.statOverviewLabel}>Volume d'affaires</div>
                      <div className={styles.statOverviewTrend}>
                        <IoArrowUpOutline />
                        <span>+8% ce mois</span>
                      </div>
                    </div>
                    <div className={styles.statOverview}>
                      <div className={styles.statOverviewValue}>{supplier.productsCount || 0}</div>
                      <div className={styles.statOverviewLabel}>Produits fournis</div>
                      <div className={styles.statOverviewTrend}>
                        <IoArrowUpOutline />
                        <span>+3 nouveaux</span>
                      </div>
                    </div>
                    <div className={styles.statOverview}>
                      <div className={styles.statOverviewValue}>{supplier.avgDeliveryTime || 0}j</div>
                      <div className={styles.statOverviewLabel}>Délai moyen</div>
                      <div className={styles.statOverviewTrend}>
                        <IoArrowDownOutline />
                        <span>-0.5 jour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Pied de page avec informations supplémentaires */}
        <footer className={styles.detailFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.footerItem}>
              <IoInformationCircleOutline />
              <span>Dernière mise à jour: {formatDateTime(supplier.lastModified)}</span>
            </div>
            <div className={styles.footerItem}>
              <IoCheckmarkCircleOutline />
              <span>Fournisseur {supplier.status === 'active' ? 'actif' : supplier.status} dans le système</span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
              size="medium"
              icon="arrowUp"
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

export default DetailFournisseurs;