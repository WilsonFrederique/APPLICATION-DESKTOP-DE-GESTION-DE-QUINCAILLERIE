import React, { useState, useMemo } from 'react';
import styles from './Produits.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table'; // IMPORT MODIFIÉ
import Button from '../../../components/Button/Button';
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoDownloadOutline,
  IoRefreshOutline,
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
  IoCreateOutline
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
  FaExternalLinkAlt
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCategory, 
  TbCurrencyDollar,
  TbArrowsSort
} from "react-icons/tb";
import { CiMoneyBill } from "react-icons/ci";
import { MdInventory, MdCategory, MdLocalShipping, MdAttachMoney } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { Chip, emphasize, styled } from '@mui/material';

// Images d'exemple pour les produits
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

// Composant de carte de produit (pour la vue grille)
const ProductCard = ({ 
  product, 
  onEdit, 
  onDelete, 
  onView, 
  onSale, 
  onAddStock,
  delay = 0 
}) => {
  const stockStatus = product.stock <= product.seuilMin ? 'critical' : 
                     product.stock <= product.seuilMin * 2 ? 'warning' : 'good';
  
  const calculateTotalValue = () => {
    return product.stock * product.prixVente;
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
      className={`${styles.productCard} ${styles[stockStatus]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.productCardHeader}>
        <div className={styles.productImage}>
          <img 
            src={product.image || productImages[product.id % productImages.length]} 
            alt={product.nom}
            loading="lazy"
          />
          <div className={`${styles.stockBadge} ${styles[stockStatus]}`}>
            {stockStatus === 'critical' ? 'CRITIQUE' : 
             stockStatus === 'warning' ? 'ALERTE' : 'OK'}
          </div>
        </div>
        
        <div className={styles.productQuickActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => onView(product)}
            className={styles.iconButton}
          />
          <Button 
            variant="cartbg"
            size="small"
            icon="cart"
            onClick={() => onSale(product)}
            className={styles.iconButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => onEdit(product)}
            className={styles.iconButton}
          />
        </div>
      </div>
      
      <div className={styles.productCardBody}>
        <div className={styles.productInfo}>
          <h4 className={styles.productName}>{product.nom}</h4>
          <div className={styles.productMeta}>
            <span className={styles.productRef}>
              <FaBarcode /> {product.reference}
            </span>
            <span className={styles.productCategory}>
              <TbCategory /> {product.categorie}
            </span>
          </div>
          
          <div className={styles.productPricing}>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Achat:</span>
              <span className={styles.priceValue}>{formatCurrency(product.prixAchat)}</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Vente:</span>
              <span className={`${styles.priceValue} ${styles.sellingPrice}`}>
                {formatCurrency(product.prixVente)}
              </span>
            </div>
          </div>
        </div>
        
        <div className={styles.productStock}>
          <div className={styles.stockInfo}>
            <div className={styles.stockHeader}>
              <span className={styles.stockLabel}>Stock:</span>
              <span className={`${styles.stockValue} ${styles[stockStatus]}`}>
                {product.stock} {product.unite}
              </span>
            </div>
            
            <div className={styles.stockBarContainer}>
              <div 
                className={`${styles.stockBar} ${styles[stockStatus]}`}
                style={{ 
                  width: `${Math.min(100, (product.stock / product.seuilMin) * 20)}%` 
                }}
              ></div>
            </div>
            
            <div className={styles.stockDetails}>
              <span className={styles.stockDetail}>Min: {product.seuilMin}</span>
              <span className={styles.stockDetail}>Seuil: {product.seuilAlerte}</span>
            </div>
          </div>
          
          <div className={styles.stockValueDisplay}>
            <span className={styles.valueLabel}>Valeur:</span>
            <span className={styles.valueAmount}>{formatCurrency(calculateTotalValue())}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.productCardFooter}>
        <div className={styles.productActions}>
          <Button 
            variant="outline"
            size="small"
            icon="add"
            onClick={() => onAddStock(product)}
            className={styles.actionButton}
          >
            Réappro
          </Button>
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => onDelete(product)}
            className={styles.actionButton}
          />
        </div>
        
        <div className={styles.productSupplier}>
          <span className={styles.supplierLabel}>Fournisseur:</span>
          <span className={styles.supplierName}>{product.fournisseur || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

const Produits = () => {
  const navigate = useNavigate();
  
  // Données mock pour la démonstration
  const mockProducts = useMemo(() => [
    {
      id: 1,
      nom: 'Ciment 50kg',
      reference: 'CIM-50KG',
      categorie: 'Matériaux Construction',
      description: 'Ciment Portland de haute qualité pour construction',
      stock: 15,
      seuilMin: 20,
      seuilAlerte: 30,
      prixAchat: 35000,
      prixVente: 50000,
      unite: 'sac',
      fournisseur: 'Holcim Madagascar',
      emplacement: 'Entrepôt A, Zone 1',
      peutEtreVenduEnDetail: true,
      prixDetail: 1000,
      uniteDetail: 'kg',
      tvaApplicable: true,
      tauxTVA: 20,
      estPerequitable: false,
      estFragile: false,
      instructionsSpeciales: 'Protéger de l\'humidité',
      delaiLivraison: '3-5 jours',
      dateCreation: '2024-03-15',
      creerPar: 'Admin',
      derniereModification: '2024-03-25T10:30:00',
      image: productImages[0]
    },
    {
      id: 2,
      nom: 'Tôle Galvanisée 3m',
      reference: 'TOL-GALV-3M',
      categorie: 'Ferronnerie',
      description: 'Tôle galvanisée de 3m, épaisseur 0.5mm',
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
      instructionsSpeciales: 'Manutention avec gants',
      delaiLivraison: '2-3 jours',
      dateCreation: '2024-02-20',
      creerPar: 'Admin',
      derniereModification: '2024-03-22T14:15:00',
      image: productImages[1]
    },
    {
      id: 3,
      nom: 'Vis à Bois 5x50',
      reference: 'VIS-BOIS-5x50',
      categorie: 'Quincaillerie',
      description: 'Vis à bois tête plate, acier galvanisé',
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
      image: productImages[2]
    },
    {
      id: 4,
      nom: 'Peinture Blanche 10L',
      reference: 'PEINT-BLANC-10L',
      categorie: 'Peinture',
      description: 'Peinture acrylique mate pour intérieur/extérieur',
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
      instructionsSpeciales: 'Protéger du gel',
      delaiLivraison: '3-5 jours',
      dateCreation: '2024-03-05',
      creerPar: 'Admin',
      derniereModification: '2024-03-18T16:20:00',
      image: productImages[3]
    },
    {
      id: 5,
      nom: 'Tuyau PVC 50mm',
      reference: 'TUY-PVC-50',
      categorie: 'Plomberie',
      description: 'Tuyau PVC pression 50mm, longueur 3m',
      stock: 22,
      seuilMin: 30,
      seuilAlerte: 50,
      prixAchat: 15000,
      prixVente: 25000,
      unite: 'tuyau',
      fournisseur: 'Bricodépôt',
      emplacement: 'Entrepôt C, Zone 2',
      peutEtreVenduEnDetail: false,
      tvaApplicable: true,
      tauxTVA: 20,
      estPerequitable: false,
      estFragile: false,
      instructionsSpeciales: '',
      delaiLivraison: '2-3 jours',
      dateCreation: '2024-02-28',
      creerPar: 'Manager',
      derniereModification: '2024-03-15T11:10:00',
      image: productImages[4]
    },
    {
      id: 6,
      nom: 'Câble Électrique 2.5mm²',
      reference: 'CABLE-2.5',
      categorie: 'Électricité',
      description: 'Câble électrique rigide 2.5mm², 100m',
      stock: 45,
      seuilMin: 20,
      seuilAlerte: 40,
      prixAchat: 50000,
      prixVente: 75000,
      unite: 'rouleau',
      fournisseur: 'Détaillant Local',
      emplacement: 'Rayon 5, Boîte 8',
      peutEtreVenduEnDetail: true,
      prixDetail: 750,
      uniteDetail: 'm',
      tvaApplicable: true,
      tauxTVA: 20,
      estPerequitable: true,
      estFragile: false,
      instructionsSpeciales: 'Protéger des rayons UV',
      delaiLivraison: '1 semaine',
      dateCreation: '2024-01-25',
      creerPar: 'Admin',
      derniereModification: '2024-03-10T13:45:00',
      image: productImages[5]
    },
    {
      id: 7,
      nom: 'Marteau Professionnel',
      reference: 'MART-PRO',
      categorie: 'Outillage',
      description: 'Marteau de charpentier, tête 500g',
      stock: 12,
      seuilMin: 5,
      seuilAlerte: 15,
      prixAchat: 15000,
      prixVente: 25000,
      unite: 'pièce',
      fournisseur: 'Bricodépôt',
      emplacement: 'Rayon 1, Étagère 4',
      peutEtreVenduEnDetail: false,
      tvaApplicable: true,
      tauxTVA: 20,
      estPerequitable: false,
      estFragile: false,
      instructionsSpeciales: '',
      delaiLivraison: '24h',
      dateCreation: '2024-03-12',
      creerPar: 'Manager',
      derniereModification: '2024-03-22T08:30:00',
      image: productImages[6]
    },
    {
      id: 8,
      nom: 'Clou 4cm',
      reference: 'CLOU-4CM',
      categorie: 'Quincaillerie',
      description: 'Clou à béton 4cm, paquet de 100',
      stock: 80,
      seuilMin: 50,
      seuilAlerte: 100,
      prixAchat: 5000,
      prixVente: 8000,
      unite: 'paquet',
      fournisseur: 'Bricodépôt',
      emplacement: 'Rayon 2, Boîte 12',
      peutEtreVenduEnDetail: true,
      prixDetail: 80,
      uniteDetail: 'pièce',
      tvaApplicable: true,
      tauxTVA: 20,
      estPerequitable: false,
      estFragile: false,
      instructionsSpeciales: '',
      delaiLivraison: '24h',
      dateCreation: '2024-02-15',
      creerPar: 'Admin',
      derniereModification: '2024-03-19T15:25:00',
      image: productImages[7]
    }
  ], []);

  // États pour les données - Initialisation directe avec les données mock
  const [products, setProducts] = useState(mockProducts);
  const [categories] = useState([
    { id: '1', nom: 'Matériaux Construction' },
    { id: '2', nom: 'Ferronnerie' },
    { id: '3', nom: 'Quincaillerie' },
    { id: '4', nom: 'Peinture' },
    { id: '5', nom: 'Plomberie' },
    { id: '6', nom: 'Électricité' },
    { id: '7', nom: 'Outillage' }
  ]);

  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('list');

  // Calcul des produits filtrés avec useMemo
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categorie === selectedCategory);
    }

    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'critical':
          filtered = filtered.filter(product => product.stock <= product.seuilMin);
          break;
        case 'warning':
          filtered = filtered.filter(product => 
            product.stock > product.seuilMin && product.stock <= product.seuilMin * 2
          );
          break;
        case 'good':
          filtered = filtered.filter(product => product.stock > product.seuilMin * 2);
          break;
        case 'out':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nom.localeCompare(b.nom);
        case 'stock-low':
          return a.stock - b.stock;
        case 'stock-high':
          return b.stock - a.stock;
        case 'price-low':
          return a.prixVente - b.prixVente;
        case 'price-high':
          return b.prixVente - a.prixVente;
        case 'category':
          return a.categorie.localeCompare(b.categorie);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy]);

  // Gestion des statistiques
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => 
      sum + (product.stock * product.prixVente), 0
    );
    const criticalStock = products.filter(p => p.stock <= p.seuilMin).length;
    const warningStock = products.filter(p => 
      p.stock > p.seuilMin && p.stock <= p.seuilMin * 2
    ).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const retailProducts = products.filter(p => p.peutEtreVenduEnDetail).length;

    return {
      totalProducts,
      totalStockValue,
      criticalStock,
      warningStock,
      outOfStock,
      retailProducts
    };
  }, [products]);

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M Ar`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K Ar`;
    }
    return `${amount} Ar`;
  };

  // Fonction pour déterminer le statut du stock
  const getStockStatus = (product) => {
    if (product.stock <= product.seuilMin) return 'critical';
    if (product.stock <= product.seuilMin * 2) return 'warning';
    return 'good';
  };

  // Gestion des événements
  const handleEditProduct = (product) => {
    navigate(`/frmProduitsAdmin/${product.id}`, { 
      state: { productData: product }
    });
  };

  const handleViewProduct = (product) => {
    navigate(`/detailProduitsAdmin/${product.id}`, {
      state: { productData: product }
    });
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const handleSaleProduct = (product) => {
    alert(`Redirection vers le module vente avec: ${product.nom}`);
  };

  const handleAddStock = (product) => {
    const quantity = prompt(`Quantité à ajouter pour ${product.nom}:`, '0');
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
      const updatedProducts = products.map(p => 
        p.id === product.id 
          ? { ...p, stock: p.stock + parseInt(quantity) }
          : p
      );
      setProducts(updatedProducts);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Nom', 'Référence', 'Catégorie', 'Stock', 'Unité', 'Prix Achat', 'Prix Vente', 'Fournisseur', 'Emplacement'],
      ...products.map(p => [
        p.nom,
        p.reference,
        p.categorie,
        p.stock,
        p.unite,
        p.prixAchat,
        p.prixVente,
        p.fournisseur,
        p.emplacement
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'produits-quincaillerie.csv';
    a.click();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStockFilter('all');
    setSortBy('name');
  };

  const handleViewCritical = () => {
    setStockFilter('critical');
    setSelectedCategory('all');
  };

  // Configuration des colonnes pour le tableau
  const tableColumns = [
    {
      label: 'Produit',
      accessor: 'nom',
      render: (row) => (
        <div className={styles.tableProductInfo}>
          <div className={styles.tableProductImage}>
            <img 
              src={row.image || productImages[row.id % productImages.length]} 
              alt={row.nom}
              loading="lazy"
            />
          </div>
          <div className={styles.tableProductDetails}>
            <div className={styles.tableProductName}>{row.nom}</div>
            <div className={styles.tableProductRef}>
              <FaBarcode size={12} /> {row.reference}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Catégorie',
      accessor: 'categorie',
      render: (row) => (
        <div className={styles.tableCategory}>
          {row.categorie}
        </div>
      )
    },
    {
      label: 'Stock',
      accessor: 'stock',
      align: 'center',
      render: (row) => {
        const status = getStockStatus(row);
        const statusText = status === 'critical' ? 'CRITIQUE' : 
                          status === 'warning' ? 'ALERTE' : 'OK';
        return (
          <div className={`${styles.tableStock} ${styles[status]}`}>
            <div className={styles.tableStockValue}>
              {row.stock} {row.unite}
            </div>
            <span className={`${styles.tableStockBadge} ${styles[status]}`}>
              {statusText}
            </span>
          </div>
        );
      }
    },
    {
      label: 'Prix Achat',
      accessor: 'prixAchat',
      align: 'right',
      render: (row) => (
        <div className={styles.tablePrice}>
          {formatCurrency(row.prixAchat)}
        </div>
      )
    },
    {
      label: 'Prix Vente',
      accessor: 'prixVente',
      align: 'right',
      render: (row) => (
        <div className={`${styles.tablePrice} ${styles.tableSellingPrice}`}>
          {formatCurrency(row.prixVente)}
        </div>
      )
    },
    {
      label: 'Valeur Stock',
      accessor: 'valeurStock',
      align: 'right',
      render: (row) => (
        <div className={styles.tableTotalValue}>
          {formatCurrency(row.stock * row.prixVente)}
        </div>
      )
    },
    {
      label: 'Fournisseur',
      accessor: 'fournisseur',
      render: (row) => (
        <div className={styles.tableSupplier}>
          {row.fournisseur || 'N/A'}
        </div>
      )
    },
    {
      label: 'Actions',
      accessor: 'actions',
      align: 'center',
      render: (row) => (
        <div className={styles.tableActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => handleViewProduct(row)}
            title="Voir détails"
            className={styles.tableActionButton}
          />
          <Button 
            variant="cartbg"
            size="small"
            icon="cart"
            onClick={() => handleSaleProduct(row)}
            title="Vendre"
            className={styles.tableActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => handleEditProduct(row)}
            title="Modifier"
            className={styles.tableActionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => handleDeleteProduct(row)}
            title="Supprimer"
            className={styles.tableActionButton}
          />
        </div>
      )
    }
  ];

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <div className={`${styles.header} ${styles.administrationHeader}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.dashboardTitle}>
                  Gestion des <span className={styles.highlight}>Produits</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Gérez votre inventaire, les prix et le stock de votre quincaillerie
                </p>
              </div>
            </div>
          </div>
          
          <div className={styles.headerBreadcrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="span"
                label="Accueil"
                icon={<HomeIcon fontSize="small" />}
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Administration"
              />
              <StyledBreadcrumb
                label="Produits"
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques détaillées */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoStatsChartOutline className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Aperçu du Stock</h2>
            </div>

            {/* Barre de contrôle */}
            <div className={styles.dashboardControls}>
              <div className={styles.actionsSection}>
                <Link 
                  to="/frmProduitsAdmin"
                  className={styles.newProductLink}
                >
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="add"
                    className={styles.actionButton}
                  >
                    Nouveau Produit
                  </Button>
                </Link>
                <Button 
                  variant="secondary"
                  size="medium"
                  icon="download"
                  onClick={handleExport}
                  className={styles.actionButton}
                >
                  Exporter
                </Button>
                <Button 
                  variant="secondary"
                  size="medium"
                  icon="print"
                  onClick={() => window.print()}
                  className={styles.actionButton}
                >
                  Imprimer
                </Button>
              </div>
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <FaBox />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalProducts}</span>
                <span className={styles.statLabel}>Total Produits</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <IoAlertCircleOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.criticalStock}</span>
                <span className={styles.statLabel}>Stock Critique</span>
              </div>
            </div>

            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}><div className={styles}>{formatCurrency(stats.totalStockValue)}</div></span>
                <span className={styles.statLabel}>Valeur Totale</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.detail}`}>
                <IoDuplicateOutline /> 
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.retailProducts}</span>
                <span className={styles.statLabel}>Vente Détail</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filtres */}
        <div className={styles.quickFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Catégorie:</label>
            <InputSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: 'all', label: 'Toutes les catégories' },
                ...categories.map(cat => ({
                  value: cat.nom,
                  label: cat.nom
                }))
              ]}
              placeholder="Catégorie"
              size="small"
              icon={<TbCategory />}
              fullWidth
              className={styles}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Stock:</label>
            <InputSelect
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { value: 'all', label: 'Tous les stocks' },
                { value: 'critical', label: 'Critique' },
                { value: 'warning', label: 'Faible' },
                { value: 'good', label: 'Bon' },
                { value: 'out', label: 'Rupture' }
              ]}
              placeholder="État du stock"
              size="small"
              icon={<FaBox />}
              fullWidth
              className={styles}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trier par:</label>
            <InputSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'name', label: 'Nom (A-Z)' },
                { value: 'stock-low', label: 'Stock (faible à élevé)' },
                { value: 'stock-high', label: 'Stock (élevé à faible)' },
                { value: 'price-low', label: 'Prix (bas à haut)' },
                { value: 'price-high', label: 'Prix (haut à bas)' },
                { value: 'category', label: 'Catégorie' }
              ]}
              placeholder="Trier par"
              size="small"
              icon={<TbArrowsSort />}
              fullWidth
              className={styles}
            />
          </div>
        </div>

        {/* Liste des produits */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <FaBox className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Inventaire des Produits</h2>
                <p className={styles.sectionSubtitle}>
                  {filteredProducts.length} produit(s) trouvé(s)
                </p>
              </div>
            </div>


            <div className={styles.sectionActions}>
            {/* Rechercher produit, référence, catégorie... */}
            <div className={styles.searchSection}>
              <Input
                type="text"
                placeholder="Rechercher produit, référence, catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="productSearch"
                icon={<IoSearchOutline />}
                className={styles}
              />
            </div>
              <div className={styles.viewToggle}>
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="small"
                  icon="list"
                  onClick={() => setViewMode('list')}
                  className={styles.viewButton}
                  title="Vue liste"
                />
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="small"
                  icon="grid"
                  onClick={() => setViewMode('grid')}
                  className={styles.viewButton}
                  title="Vue grille"
                />
              </div>
              
              <Button 
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={handleResetFilters}
                className={styles.resetButton}
              >
                Réinitialiser
              </Button>
              <Button 
                variant="outline"
                size="medium"
                icon="warning"
                onClick={handleViewCritical}
                className={styles.alertButton}
              >
                Voir critique
              </Button>
            </div>
          </div>
          
          {/* Vue grille ou tableau */}
          {viewMode === 'grid' ? (
            <div className={styles.productsGrid}>
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onView={handleViewProduct}
                  onSale={handleSaleProduct}
                  onAddStock={handleAddStock}
                  delay={index * 100}
                />
              ))}
              
              {filteredProducts.length === 0 && (
                <div className={styles.noResults}>
                  <FaBox className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun produit trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun produit ne correspond à vos critères de recherche.
                  </p>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersButton}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table 
                columns={tableColumns}
                data={filteredProducts}
                className={styles.productTable}
              />
              
              {filteredProducts.length === 0 && (
                <div className={styles.noResults}>
                  <FaBox className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun produit trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun produit ne correspond à vos critères de recherche.
                  </p>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersButton}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className={styles.pagination}>
              <Button 
                variant="outline"
                size="small"
                icon="precedant"
                disabled={true}
                className={styles.paginationButton}
              />
              <span className={styles.paginationInfo}>
                Produits 1-{filteredProducts.length} sur {filteredProducts.length}
              </span>
              <Button 
                variant="outline"
                size="small"
                icon="suivant"
                className={styles.paginationButton}
              />
            </div>
          )}
        </section>

        {/* Actions rapides */}
        <div className={styles.quickActionsBar}>
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.warning}`}>
              <IoWarningOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.criticalStock} produits en stock critique</h4>
              <p className={styles.quickActionText}>Nécessite réapprovisionnement urgent</p>
            </div>
            <Link 
              to="/frmProduitsAdmin"
              className={styles.quickActionLink}
            >
              <Button 
                variant="warning"
                size="medium"
                icon="add"
                className={styles.quickActionButton}
              >
                Ajouter Produit
              </Button>
            </Link>
          </div>
          
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.accent}`}>
              <IoDuplicateOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.retailProducts} produits vendables au détail</h4>
              <p className={styles.quickActionText}>Configuration de prix détail disponible</p>
            </div>
            <Link 
              to="/frmProduitsAdmin"
              className={styles.quickActionLink}
            >
              <Button 
                variant="secondary"
                size="medium"
                icon="externalLink"
                className={styles.quickActionButton}
              >
                Formulaire Produit
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Produits;