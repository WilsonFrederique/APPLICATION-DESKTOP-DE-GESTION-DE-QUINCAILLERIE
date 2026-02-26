import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './DetailCategories.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Import de vos composants personnalisés
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputSelect from '../../../components/Input/InputSelect';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTogglerIcons from '../../../components/Input/InputTogglerIcons';
import InputRadio from '../../../components/Input/InputRadio';
import Button from '../../../components/Button/Button';
import Table from '../../../components/Table/Table';

// Import des icônes
import { TbTimelineEventExclamation } from "react-icons/tb";
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
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
  IoDuplicateOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoEyeOutline,
  IoListOutline,
  IoGridOutline,
  IoRefreshOutline,
  IoAddOutline,
  IoCopyOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoSearchOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaChartLine, 
  FaTags, 
  FaProductHunt,
  FaStore,
  FaWeightHanging,
  FaRegClock,
  FaUsers,
  FaHistory,
  FaMoneyBillWave,
  FaWarehouse,
  FaTruck
} from "react-icons/fa";
import { 
  MdCategory, 
  MdOutlineInventory, 
  MdOutlineLocalOffer,
  MdOutlineViewCarousel,
  MdOutlineSettings,
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdOutlineSecurity
} from "react-icons/md";
import { 
  TbCategory, 
  TbCategoryPlus,
  TbCategoryMinus,
  TbCurrencyDollar,
  TbPercentage
} from "react-icons/tb";
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

// Données mock pour la démonstration (similaires à celles de Categories.js)
const mockCategories = [
  {
    id: 1,
    name: 'Matériaux Construction',
    code: 'MAT-CONST',
    description: 'Matériaux de construction générale pour tous types de travaux. Inclut ciment, briques, sable, gravier et produits dérivés.',
    parentId: null,
    parentName: null,
    status: 'active',
    color: 'primary',
    icon: 'FaBox',
    iconElement: <FaBox />,
    canBeSold: true,
    requiresSpecialHandling: false,
    hasWarranty: false,
    warrantyPeriod: 0,
    tags: ['construction', 'bâtiment', 'gros œuvre', 'matériaux'],
    profitMargin: 25,
    minStockAlert: 50,
    maxStockAlert: 500,
    
    // Statistiques (corrigées pour correspondre à Categories.js)
    productCount: 156,
    activeProducts: 142,
    outOfStockProducts: 5,
    totalStockValue: 45000000,
    salesCount: 1245, // Utilisé au lieu de monthlySales
    stockValue: 45000000, // Utilisé au lieu de totalStockValue
    margin: 32.5,
    averageRating: 4.2,
    
    // Métadonnées
    createdAt: '15/01/2024',
    updatedAt: '20/03/2024',
    createdBy: 'Admin',
    lastModifiedBy: 'Manager',
    
    // Produits populaires
    topProducts: [
      { id: 1, name: 'Ciment 50kg', sales: 1250, revenue: 47500000, stock: 15 },
      { id: 2, name: 'Tôle Galvanisée 3m', sales: 845, revenue: 25350000, stock: 8 },
      { id: 3, name: 'Briques Rouges', sales: 520, revenue: 15600000, stock: 120 },
      { id: 4, name: 'Sable de Construction', sales: 320, revenue: 6400000, stock: 45 },
      { id: 5, name: 'Gravier 5-15mm', sales: 280, revenue: 5600000, stock: 32 }
    ],
    
    // Sous-catégories
    subCategories: [
      { id: 7, name: 'Ciment Spécial', productCount: 12 },
      { id: 8, name: 'Briques et Blocs', productCount: 35 },
      { id: 9, name: 'Sable et Gravier', productCount: 28 },
      { id: 10, name: 'Tôles et Métaux', productCount: 45 }
    ],
  },
  {
    id: 2,
    name: 'Ferronnerie',
    code: 'FERRO',
    description: 'Produits métalliques pour construction et fabrication. Fer à béton, tôles, profilés et accessoires métalliques.',
    parentId: null,
    parentName: null,
    status: 'active',
    color: 'warning',
    icon: 'FaTools',
    iconElement: <IoGridOutline />,
    canBeSold: true,
    requiresSpecialHandling: true,
    hasWarranty: true,
    warrantyPeriod: 12,
    tags: ['métal', 'construction', 'acier', 'ferronnerie'],
    profitMargin: 30,
    minStockAlert: 20,
    maxStockAlert: 200,
    
    // Statistiques
    productCount: 89,
    activeProducts: 82,
    outOfStockProducts: 3,
    totalStockValue: 18500000,
    salesCount: 658,
    stockValue: 18500000,
    margin: 35.2,
    averageRating: 4.5,
    
    // Métadonnées
    createdAt: '10/02/2024',
    updatedAt: '18/03/2024',
    createdBy: 'Admin',
    lastModifiedBy: 'Admin'
  },
  {
    id: 3,
    name: 'Quincaillerie',
    code: 'QUINC',
    description: 'Petite quincaillerie et accessoires de fixation. Vis, clous, écrous, boulons et produits similaires.',
    parentId: null,
    parentName: null,
    status: 'active',
    color: 'accent',
    icon: 'MdOutlineLocalOffer',
    iconElement: <MdOutlineLocalOffer />,
    canBeSold: true,
    requiresSpecialHandling: false,
    hasWarranty: false,
    warrantyPeriod: 0,
    tags: ['quincaillerie', 'fixation', 'accessoires', 'petite quincaillerie'],
    profitMargin: 40,
    minStockAlert: 100,
    maxStockAlert: 1000,
    
    // Statistiques
    productCount: 245,
    activeProducts: 230,
    outOfStockProducts: 8,
    totalStockValue: 8500000,
    salesCount: 3580,
    stockValue: 8500000,
    margin: 45.8,
    averageRating: 4.0,
    
    // Métadonnées
    createdAt: '05/01/2024',
    updatedAt: '15/03/2024',
    createdBy: 'Manager',
    lastModifiedBy: 'Admin'
  }
];

const DetailCategories = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statsPeriod, setStatsPeriod] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('all');
  const [productSortBy, setProductSortBy] = useState('name');

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

  // Fonction pour formater la date (gère le format dd/MM/yyyy)
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    // Si la date est au format dd/MM/yyyy
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
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
    
    // Si la date est au format dd/MM/yyyy
    if (dateTimeString.includes('/')) {
      const parts = dateTimeString.split('/');
      if (parts.length === 3) {
        const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return date.toLocaleString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
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

  // Calculer le revenu mensuel
  const getMonthlyRevenue = (category) => {
    if (!category) return 0;
    
    if (category.topProducts && category.topProducts.length > 0) {
      return category.topProducts.reduce((total, product) => total + (product.revenue || 0), 0);
    }
    
    // Estimation basée sur salesCount et profitMargin
    const estimatedValue = (category.salesCount || 0) * 10000;
    return estimatedValue;
  };

  // Calculer les ventes mensuelles
  const getMonthlySales = (category) => {
    if (!category) return 0;
    
    if (category.topProducts && category.topProducts.length > 0) {
      return category.topProducts.reduce((total, product) => total + (product.sales || 0), 0);
    }
    
    return category.salesCount || 0;
  };

  // Charger les données de la catégorie
  useEffect(() => {
    const loadCategory = () => {
      setLoading(true);
      
      if (location.state?.categoryData) {
        const loadedCategory = location.state.categoryData;
        
        // S'assurer que les champs nécessaires existent
        const enhancedCategory = {
          ...loadedCategory,
          totalStockValue: loadedCategory.totalStockValue || loadedCategory.stockValue || 0,
          productCount: loadedCategory.productCount || 0,
          salesCount: loadedCategory.salesCount || 0,
          profitMargin: loadedCategory.profitMargin || loadedCategory.margin || 0,
          topProducts: loadedCategory.topProducts || [],
          subCategories: loadedCategory.subCategories || [],
          recentActivity: loadedCategory.recentActivity || [],
          activeProducts: loadedCategory.activeProducts || loadedCategory.productCount || 0,
          outOfStockProducts: loadedCategory.outOfStockProducts || 0,
          averageRating: loadedCategory.averageRating || 4.0
        };
        
        setCategory(enhancedCategory);
      } else {
        const categoryId = parseInt(id);
        const foundCategory = mockCategories.find(c => c.id === categoryId);
        
        if (foundCategory) {
          // Compléter les données manquantes
          const completeCategory = {
            ...foundCategory,
            // Données simulées si manquantes
            topProducts: foundCategory.topProducts || [],
            subCategories: foundCategory.subCategories || [],
            recentActivity: foundCategory.recentActivity || [],
            activeProducts: foundCategory.activeProducts || foundCategory.productCount || 0,
            outOfStockProducts: foundCategory.outOfStockProducts || 0,
            averageRating: foundCategory.averageRating || 4.0
          };
          setCategory(completeCategory);
        }
      }
      
      setLoading(false);
    };

    loadCategory();
  }, [id, location.state]);

  // Gestion des actions
  const handleEdit = () => {
    if (category) {
      navigate(`/frmCategoriesAdmin/${category.id}`, {
        state: { categoryData: category }
      });
    }
  };

  const handleDelete = () => {
    if (category && window.confirm(`Êtes-vous sûr de vouloir supprimer "${category.name}" ? Cette action affectera tous les produits de cette catégorie.`)) {
      // Ici, vous feriez l'appel API pour supprimer la catégorie
      console.log('Catégorie supprimée:', category.id);
      navigate('/categoriesAdmin');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (category) {
      const monthlyRevenueValue = getMonthlyRevenue(category);
      const monthlySalesValue = getMonthlySales(category);
      
      const content = `
        Fiche Catégorie: ${category.name}
        Code: ${category.code}
        Description: ${category.description}
        Statut: ${category.status}
        Produits: ${category.productCount}
        Valeur Stock: ${formatCurrency(category.totalStockValue || category.stockValue)}
        Ventes mensuelles: ${monthlySalesValue}
        Revenu mensuel: ${formatCurrency(monthlyRevenueValue)}
        Marge bénéficiaire: ${category.profitMargin || category.margin || 0}%
        Date création: ${formatDate(category.createdAt)}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-categorie-${category.code}.txt`;
      a.click();
    }
  };

  const handleDuplicate = () => {
    if (category) {
      const newCategory = {
        ...category,
        id: null,
        name: `${category.name} (Copie)`,
        code: `${category.code}-COPY`,
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: 'Admin'
      };
      
      navigate('/frmCategoriesAdmin', {
        state: { categoryData: newCategory }
      });
    }
  };

  // Fonction pour filtrer les produits
  const getFilteredProducts = () => {
    if (!category?.topProducts) return [];
    
    let filtered = [...category.topProducts];
    
    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtre par statut
    if (productStatusFilter === 'lowStock') {
      filtered = filtered.filter(product => (product.stock || 0) < 10);
    } else if (productStatusFilter === 'outOfStock') {
      filtered = filtered.filter(product => (product.stock || 0) === 0);
    }
    
    // Tri
    switch (productSortBy) {
      case 'sales':
        filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
        break;
      case 'revenue':
        filtered.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
        break;
      case 'stock':
        filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      default: // 'name'
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  };

  // Configuration des colonnes pour le tableau des produits
  const productTableColumns = [
    {
      label: 'Produit',
      accessor: 'name',
      render: (row) => (
        <div className={styles.productTableCell}>
          <div className={styles.productName}>{row.name}</div>
        </div>
      )
    },
    {
      label: 'Ventes',
      accessor: 'sales',
      align: 'center',
      render: (row) => (
        <div className={styles.productSalesCell}>
          {row.sales || 0}
        </div>
      )
    },
    {
      label: 'Revenu',
      accessor: 'revenue',
      align: 'right',
      render: (row) => (
        <div className={styles.productRevenueCell}>
          {formatCurrency(row.revenue || 0)}
        </div>
      )
    },
    {
      label: 'Stock',
      accessor: 'stock',
      align: 'center',
      render: (row) => {
        const stock = row.stock || 0;
        let stockClass = '';
        if (stock === 0) stockClass = styles.stockOut;
        else if (stock < 10) stockClass = styles.stockLow;
        else if (stock < 50) stockClass = styles.stockMedium;
        else stockClass = styles.stockHigh;
        
        return (
          <div className={`${styles.productStockCell} ${stockClass}`}>
            {stock} unités
          </div>
        );
      }
    },
    {
      label: 'Actions',
      accessor: 'actions',
      align: 'center',
      render: (row) => (
        <div className={styles.productActionsCell}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => navigate(`/detailProduitsAdmin/${row.id}`)}
            title="Voir détails"
            className={styles.productActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => navigate(`/frmProduitsAdmin/${row.id}`)}
            title="Modifier"
            className={styles.productActionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => alert(`Supprimer ${row.name}`)}
            title="Supprimer"
            className={styles.productActionButton}
          />
        </div>
      )
    }
  ];

  // Configuration des colonnes pour le tableau des sous-catégories
  const subCategoryTableColumns = [
    {
      label: 'Nom',
      accessor: 'name',
      render: (row) => (
        <div className={styles.subCategoryTableCell}>
          <div className={styles.subCategoryName}>{row.name}</div>
          <div className={styles.subCategoryId}>ID: {row.id}</div>
        </div>
      )
    },
    {
      label: 'Produits',
      accessor: 'productCount',
      align: 'center',
      render: (row) => (
        <div className={styles.subCategoryProductCell}>
          {row.productCount || 0}
        </div>
      )
    },
    {
      label: 'Actions',
      accessor: 'actions',
      align: 'center',
      render: (row) => (
        <div className={styles.subCategoryActionsCell}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => {
              const subCategory = mockCategories.find(c => c.id === row.id);
              if (subCategory) {
                navigate(`/detailCategoriesAdmin/${row.id}`, {
                  state: { categoryData: subCategory }
                });
              }
            }}
            title="Voir détails"
            className={styles.subCategoryActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => {
              const subCategory = mockCategories.find(c => c.id === row.id);
              if (subCategory) {
                navigate(`/frmCategoriesAdmin/${row.id}`, {
                  state: { categoryData: subCategory }
                });
              }
            }}
            title="Modifier"
            className={styles.subCategoryActionButton}
          />
        </div>
      )
    }
  ];

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des détails de la catégorie...</p>
      </div>
    );
  }

  // Si la catégorie n'est pas trouvée
  if (!category) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <IoCloseCircleOutline />
        </div>
        <h2 className={styles.errorTitle}>Catégorie non trouvée</h2>
        <p className={styles.errorText}>
          La catégorie que vous recherchez n'existe pas ou a été supprimée.
        </p>
        <Button 
          variant="primary"
          icon="back"
          onClick={() => navigate('/categoriesAdmin')}
          className={styles.errorButton}
        >
          Retour à la liste des catégories
        </Button>
      </div>
    );
  }

  // Calculer les valeurs dynamiques
  const monthlyRevenueValue = getMonthlyRevenue(category);
  const monthlySalesValue = getMonthlySales(category);
  const totalStockValue = category.totalStockValue || category.stockValue || 0;
  const filteredProducts = getFilteredProducts();

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailContent}>
        {/* Header avec navigation */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <Button 
              variant="outline"
              icon="back"
              onClick={() => navigate('/categoriesAdmin')}
              className={styles.backButton}
            >
              Retour aux catégories
            </Button>
            
            <div className={styles.headerActions}>
              <Button 
                variant="outline"
                icon="print"
                onClick={handlePrint}
                className={styles.headerActionBtn}
              >
                Imprimer
              </Button>
              <Button 
                variant="outline"
                icon="download"
                onClick={handleExport}
                className={styles.headerActionBtn}
              >
                Exporter
              </Button>
              <Button 
                variant="outline"
                icon="copy"
                onClick={handleDuplicate}
                className={styles.headerActionBtn}
              >
                Dupliquer
              </Button>
              <Button 
                variant="outline"
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
              <div className={styles.categoryTitleSection}>
                <div className={styles.categoryTitleContent}>
                  <h1 className={styles.categoryTitle}>{category.name}</h1>
                  <div className={styles.categoryMeta}>
                    <span className={styles.categoryCode}>
                      <FaBox /> {category.code}
                    </span>
                    <span className={`${styles.categoryStatus} ${styles[category.status]}`}>
                      {category.status === 'active' ? 'ACTIVE' : 
                       category.status === 'inactive' ? 'INACTIVE' : 'BROUILLON'}
                    </span>
                    <span className={styles.categoryCreated}>
                      <IoCalendarOutline />
                      {formatDate(category.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
              
            </div>
            
            <div className={styles.headerActionsMain}>
              <Button 
                variant="warning"
                icon="edit"
                onClick={handleEdit}
                className={styles.primaryActionBtn}
              >
                Modifier
              </Button>
              <Button 
                variant="primary"
                icon="add"
                onClick={() => navigate('/frmCategoriesAdmin')}
                className={styles.secondaryActionBtn}
              >
                Nouvelle Catégorie
              </Button>
              <Button 
                variant="danger"
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
                label="Catégories"
                onClick={() => navigate('/categoriesAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Détails Catégorie"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </header>

        <div className={styles.quickStats}>
          <div className={styles.quickStatItem}>
            <div className={`${styles.statIcon} ${styles.primary}`}>
              <FaBox />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{category.productCount || 0}</span>
              <span className={styles.statLabel}>Total Produits</span>
            </div>
          </div>
          
          <div className={styles.quickStatItem}>
            <div className={`${styles.statIcon} ${styles.warning}`}>
              <TbCurrencyDollar />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{formatCurrency(totalStockValue)}</span>
              <span className={styles.statLabel}>Valeur Stock</span>
            </div>
          </div>

          <div className={styles.quickStatItem}>
            <div className={`${styles.statIcon} ${styles.success}`}>
              <TbTimelineEventExclamation />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{monthlySalesValue}</span>
              <span className={styles.statLabel}>Ventes mensuelles</span>
            </div>
          </div>
          
          <div className={styles.quickStatItem}>
            <div className={`${styles.statIcon} ${styles.detail}`}>
              <IoDuplicateOutline /> 
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{category.profitMargin || category.margin || 0}%</span>
              <span className={styles.statLabel}>Marge moyenne</span>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <nav className={styles.tabNavigation}>
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'outline'}
            icon="category"
            onClick={() => setActiveTab('overview')}
            className={styles.tabButton}
          >
            Aperçu
          </Button>
          <Button 
            variant={activeTab === 'products' ? 'primary' : 'outline'}
            icon="box"
            onClick={() => setActiveTab('products')}
            className={styles.tabButton}
          >
            Produits ({category.productCount || 0})
          </Button>
          <Button 
            variant={activeTab === 'subcategories' ? 'primary' : 'outline'}
            icon="list"
            onClick={() => setActiveTab('subcategories')}
            className={styles.tabButton}
          >
            Sous-catégories
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'primary' : 'outline'}
            icon="chart"
            onClick={() => setActiveTab('analytics')}
            className={styles.tabButton}
          >
            Analytiques
          </Button>
        </nav>

        {/* Contenu principal */}
        <main className={styles.mainContent}>
          {/* Section de gauche - Informations principales */}
          <div className={styles.contentLeft}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <IoInformationCircleOutline /> Informations de Base
              </h3>
              
              <div className={styles.infoGrid}>
                <InputTextarea
                  label="Description"
                  value={category.description}
                  readOnly={true}
                  rows={4}
                  fullWidth={true}
                  className={styles.readOnlyInput}
                />
                
                <InputSelect
                  label="Catégorie Parent"
                  value={category.parentId || ''}
                  options={[
                    { value: '', label: 'Catégorie racine' },
                    ...mockCategories
                      .filter(c => c.id !== category.id)
                      .map(c => ({ value: c.id, label: c.name }))
                  ]}
                  onChange={() => {}}
                  disabled={true}
                  fullWidth={true}
                  className={styles.readOnlyInput}
                />
                
                <Input
                  type="text"
                  label="Marge bénéficiaire"
                  value={`${category.profitMargin || category.margin || 0}%`}
                  readOnly={true}
                  fullWidth={true}
                  className={styles.readOnlyInput}
                  icon={<TbPercentage />}
                />
                
                <div className={styles.stockAlerts}>
                  <Input
                    type="number"
                    label="Seuil Min"
                    value={category.minStockAlert || 0}
                    readOnly={true}
                    fullWidth={true}
                    className={styles.stockAlertInput}
                    icon={<IoWarningOutline />}
                  />
                  <Input
                    type="number"
                    label="Seuil Max"
                    value={category.maxStockAlert || 0}
                    readOnly={true}
                    fullWidth={true}
                    className={styles.stockAlertInput}
                    icon={<IoWarningOutline />}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <FaTags /> Tags & Configuration
              </h3>
              
              <div className={styles.tagsContainer}>
                {category.tags && category.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
                {(!category.tags || category.tags.length === 0) && (
                  <span className={styles.noTags}>Aucun tag</span>
                )}
              </div>
              
              <div className={styles.configGrid}>
                <InputCheckbox
                  label="Peut être vendu"
                  checked={category.canBeSold}
                  onChange={() => {}}
                  disabled={true}
                  color="green"
                  className={styles.configCheckbox}
                />
                
                <InputCheckbox
                  label="Manipulation spéciale"
                  checked={category.requiresSpecialHandling}
                  onChange={() => {}}
                  disabled={true}
                  color="yellow"
                  className={styles.configCheckbox}
                />
                
                <InputCheckbox
                  label="Garantie incluse"
                  checked={category.hasWarranty}
                  onChange={() => {}}
                  disabled={true}
                  color="purple"
                  className={styles.configCheckbox}
                  helperText={category.hasWarranty ? `${category.warrantyPeriod || 0} mois` : ''}
                />
              </div>
            </div>
            
            {category.subCategories && category.subCategories.length > 0 && (
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <IoListOutline /> Sous-catégories ({category.subCategories.length})
                </h3>
                
                <div className={styles.subCategories}>
                  {category.subCategories.slice(0, 3).map((subCat, index) => (
                    <div key={index} className={styles.subCategory}>
                      <div className={styles.subCategoryInfo}>
                        <h4 className={styles.subCategoryName}>{subCat.name}</h4>
                        <span className={styles.subCategoryProducts}>
                          {subCat.productCount || 0} produits
                        </span>
                      </div>
                      <Button 
                        variant="eyebg"
                        size="small"
                        icon="eye"
                        onClick={() => {
                          const subCategory = mockCategories.find(c => c.id === subCat.id);
                          if (subCategory) {
                            navigate(`/detailCategoriesAdmin/${subCat.id}`, {
                              state: { categoryData: subCategory }
                            });
                          }
                        }}
                        className={styles.viewSubCategoryBtn}
                        title="Voir détails"
                      />
                    </div>
                  ))}
                  {category.subCategories.length > 3 && (
                    <div className={styles.moreSubCategories}>
                      <Button 
                        variant="outline"
                        size="small"
                        onClick={() => setActiveTab('subcategories')}
                        className={styles.viewMoreBtn}
                      >
                        Voir {category.subCategories.length - 3} de plus...
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Section de droite - Détails spécifiques à l'onglet */}
          <div className={styles.contentRight}>
            {activeTab === 'overview' && (
              <div className={styles.tabContent}>
                <div className={styles.overviewSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaChartLine /> Vue d'ensemble
                  </h3>
                  
                  <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.primary}`}>
                      <div className={styles.statIcon}>
                        <FaBox />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{category.productCount || 0}</div>
                        <div className={styles.statLabel}>Produits total</div>
                        <div className={styles.statSubtitle}>
                          {category.activeProducts || 0} actifs, {category.outOfStockProducts || 0} rupture
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${styles.statCard} ${styles.success}`}>
                      <div className={styles.statIcon}>
                        <TbCurrencyDollar />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formatCurrency(totalStockValue)}</div>
                        <div className={styles.statLabel}>Valeur stock</div>
                        <div className={styles.statSubtitle}>
                          Inventaire total
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${styles.statCard} ${styles.accent}`}>
                      <div className={styles.statIcon}>
                        <FaMoneyBillWave />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formatCurrency(monthlyRevenueValue)}</div>
                        <div className={styles.statLabel}>Revenu mensuel</div>
                        <div className={styles.statSubtitle}>
                          {monthlySalesValue} ventes
                        </div>
                      </div>
                    </div>
                    
                    <div className={`${styles.statCard} ${styles.warning}`}>
                      <div className={styles.statIcon}>
                        <TbPercentage />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{category.averageRating || 4.0}/5</div>
                        <div className={styles.statLabel}>Note moyenne</div>
                        <div className={styles.statSubtitle}>
                          Satisfaction clients
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.periodSelector}>
                    <Button 
                      variant={statsPeriod === 'day' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => setStatsPeriod('day')}
                      className={styles.periodBtn}
                    >
                      Jour
                    </Button>
                    <Button 
                      variant={statsPeriod === 'week' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => setStatsPeriod('week')}
                      className={styles.periodBtn}
                    >
                      Semaine
                    </Button>
                    <Button 
                      variant={statsPeriod === 'month' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => setStatsPeriod('month')}
                      className={styles.periodBtn}
                    >
                      Mois
                    </Button>
                    <Button 
                      variant={statsPeriod === 'year' ? 'primary' : 'outline'}
                      size="small"
                      onClick={() => setStatsPeriod('year')}
                      className={styles.periodBtn}
                    >
                      Année
                    </Button>
                  </div>
                </div>
                
                <div className={styles.overviewSection}>
                  <h3 className={styles.sectionTitle}>
                    <MdOutlineDescription /> Description Complète
                  </h3>
                  <div className={styles.descriptionFull}>
                    <p>{category.description}</p>
                    <p className={styles.descriptionAdditional}>
                      Cette catégorie regroupe l'ensemble des produits nécessaires aux travaux de construction et de rénovation. 
                      Les produits sont soigneusement sélectionnés pour leur qualité et leur durabilité, garantissant ainsi 
                      une satisfaction optimale pour nos clients professionnels et particuliers.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'products' && (
              <div className={styles.tabContent}>
                <div className={styles.productsSection}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <FaBox /> Produits de la Catégorie ({category.productCount || 0})
                    </h3>
                    <Button 
                      variant="primary"
                      icon="add"
                      onClick={() => navigate('/frmProduitsAdmin')}
                      className={styles.addProductBtn}
                    >
                      Ajouter un produit
                    </Button>
                  </div>
                  
                  <div className={styles.productsFilters}>
                    <Input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      name="productSearch"
                      icon={<IoSearchOutline />}
                      className={styles.productSearchInput}
                      fullWidth={true}
                    />
                    
                    <div className={styles.filterGroup}>
                      <InputSelect
                        value={productStatusFilter}
                        onChange={setProductStatusFilter}
                        options={[
                          { value: 'all', label: 'Tous les produits' },
                          { value: 'lowStock', label: 'Stock faible (<10)' },
                          { value: 'outOfStock', label: 'Rupture de stock' }
                        ]}
                        placeholder="Statut"
                        size="small"
                        icon={<IoCheckmarkCircleOutline />}
                        fullWidth={true}
                        className={styles.statusFilter}
                      />
                      
                      <InputSelect
                        value={productSortBy}
                        onChange={setProductSortBy}
                        options={[
                          { value: 'name', label: 'Nom (A-Z)' },
                          { value: 'sales', label: 'Ventes (décroissant)' },
                          { value: 'revenue', label: 'Revenu (décroissant)' },
                          { value: 'stock', label: 'Stock (décroissant)' }
                        ]}
                        placeholder="Trier par"
                        size="small"
                        icon={<IoArrowDownOutline />}
                        fullWidth={true}
                        className={styles.sortFilter}
                      />
                    </div>
                  </div>
                  
                  {category.topProducts && category.topProducts.length > 0 ? (
                    <>
                      <div className={styles.tableContainer}>
                        <Table 
                          columns={productTableColumns}
                          data={filteredProducts}
                          className={styles.productTable}
                          hoverEffect={true}
                          striped={true}
                        />
                        
                        {filteredProducts.length === 0 && (
                          <div className={styles.noProducts}>
                            <FaBox className={styles.noProductsIcon} />
                            <h4 className={styles.noProductsTitle}>Aucun produit trouvé</h4>
                            <p className={styles.noProductsText}>
                              Aucun produit ne correspond à vos critères de recherche.
                            </p>
                            <Button 
                              variant="outline"
                              icon="refresh"
                              onClick={() => {
                                setSearchTerm('');
                                setProductStatusFilter('all');
                                setProductSortBy('name');
                              }}
                              className={styles.resetFiltersBtn}
                            >
                              Réinitialiser les filtres
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.productsFooter}>
                        <Button 
                          variant="outline"
                          icon="list"
                          onClick={() => {
                            navigate('/produitAdmin', {
                              state: { filterByCategory: category.id }
                            });
                          }}
                          className={styles.viewAllBtn}
                        >
                          Voir tous les produits ({category.productCount || 0})
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className={styles.noProducts}>
                      <FaBox className={styles.noProductsIcon} />
                      <h4 className={styles.noProductsTitle}>Aucun produit</h4>
                      <p className={styles.noProductsText}>
                        Cette catégorie ne contient aucun produit pour le moment.
                      </p>
                      <Button 
                        variant="primary"
                        icon="add"
                        onClick={() => navigate('/frmProduitsAdmin')}
                        className={styles.addFirstProductBtn}
                      >
                        Ajouter le premier produit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'subcategories' && (
              <div className={styles.tabContent}>
                <div className={styles.subcategoriesSection}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      <IoListOutline /> Sous-catégories ({category.subCategories?.length || 0})
                    </h3>
                    <Button 
                      variant="primary"
                      icon="add"
                      onClick={() => navigate('/frmCategoriesAdmin', {
                        state: { parentCategory: category }
                      })}
                      className={styles.addSubCategoryBtn}
                    >
                      Nouvelle sous-catégorie
                    </Button>
                  </div>
                  
                  {category.subCategories && category.subCategories.length > 0 ? (
                    <div className={styles.tableContainer}>
                      <Table 
                        columns={subCategoryTableColumns}
                        data={category.subCategories}
                        className={styles.subCategoryTable}
                        hoverEffect={true}
                        striped={true}
                      />
                    </div>
                  ) : (
                    <div className={styles.noSubcategories}>
                      <IoListOutline className={styles.noSubcategoriesIcon} />
                      <h4 className={styles.noSubcategoriesTitle}>Aucune sous-catégorie</h4>
                      <p className={styles.noSubcategoriesText}>
                        Cette catégorie ne contient aucune sous-catégorie.
                      </p>
                      <Button 
                        variant="primary"
                        icon="add"
                        onClick={() => navigate('/frmCategoriesAdmin', {
                          state: { parentCategory: category }
                        })}
                        className={styles.addFirstSubCategoryBtn}
                      >
                        Créer une sous-catégorie
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div className={styles.tabContent}>
                <div className={styles.analyticsSection}>
                  <h3 className={styles.sectionTitle}>
                    <FaChartLine /> Analyse des Performances
                  </h3>
                  
                  <div className={styles.analyticsGrid}>
                    <div className={styles.analyticsCard}>
                      <h4 className={styles.analyticsCardTitle}>Ventes par période</h4>
                      <div className={styles.salesChart}>
                        <div className={styles.chartPlaceholder}>
                          <FaChartLine className={styles.chartIcon} />
                          <span>Graphique des ventes</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.analyticsCard}>
                      <h4 className={styles.analyticsCardTitle}>Répartition des produits</h4>
                      <div className={styles.distributionChart}>
                        <div className={styles.chartPlaceholder}>
                          <IoGridOutline className={styles.chartIcon} />
                          <span>Graphique de répartition</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.analyticsStats}>
                    <Input
                      type="text"
                      label="Taux de rotation"
                      value="3.2 fois/mois"
                      readOnly={true}
                      fullWidth={true}
                      className={styles.analyticsStatInput}
                      icon={<IoRefreshOutline />}
                    />
                    <Input
                      type="text"
                      label="Marge moyenne"
                      value={`${category.profitMargin || category.margin || 0}%`}
                      readOnly={true}
                      fullWidth={true}
                      className={styles.analyticsStatInput}
                      icon={<TbPercentage />}
                    />
                    <Input
                      type="text"
                      label="Panier moyen"
                      value={monthlySalesValue > 0 
                        ? formatCurrency(monthlyRevenueValue / monthlySalesValue) 
                        : formatCurrency(0)}
                      readOnly={true}
                      fullWidth={true}
                      className={styles.analyticsStatInput}
                      icon={<FaMoneyBillWave />}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Pied de page */}
        <footer className={styles.detailFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.footerItem}>
              <IoInformationCircleOutline />
              <span>Dernière mise à jour: {formatDateTime(category.updatedAt)}</span>
            </div>
            <div className={styles.footerItem}>
              <IoCheckmarkCircleOutline />
              <span>Catégorie {category.status === 'active' ? 'active' : 'inactive'}</span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
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

export default DetailCategories;