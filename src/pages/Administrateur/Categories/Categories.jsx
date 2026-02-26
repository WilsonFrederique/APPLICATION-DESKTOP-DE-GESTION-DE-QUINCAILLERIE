import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Categories.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Import de vos composants personnalisés
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import Button from '../../../components/Button/Button';

// Import des icônes
import { 
  IoSearchOutline,
  IoAddOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoFilterOutline,
  IoRefreshOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoStatsChartOutline,
  IoFolderOutline,
  IoColorPaletteOutline,
  IoTrendingUpOutline,
  IoDuplicateOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoShareSocialOutline,
  IoInformationCircleOutline,
  IoGridOutline,
  IoListOutline,
  IoChevronDownOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoTimeOutline,
  IoCalendarOutline
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
  MdOutlineDescription,
  MdOutlineLocationOn
} from "react-icons/md";
import { TbCategoryPlus, TbCategoryMinus, TbCurrencyDollar, TbPercentage, TbArrowsSort } from "react-icons/tb";

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

// Composant de carte de catégorie
const CategoryCard = ({ 
  category, 
  onEdit, 
  onDelete, 
  onView, 
  delay = 0 
}) => {
  const statusColor = category.status === 'active' ? 'active' : 
                     category.status === 'inactive' ? 'inactive' : 'draft';
  
  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'ACTIF';
      case 'inactive': return 'INACTIF';
      case 'draft': return 'BROUILLON';
      default: return status.toUpperCase();
    }
  };

  const getIconElement = (icon) => {
    const iconMap = {
      'FaBox': <FaBox />,
      'FaTools': <IoFolderOutline />,
      'MdOutlineLocalOffer': <MdOutlineLocalOffer />,
      'FaWeightHanging': <FaWeightHanging />,
      'FaChartLine': <FaChartLine />,
      'FaStore': <FaStore />,
      'FaProductHunt': <FaProductHunt />,
      'IoColorPaletteOutline': <IoColorPaletteOutline />,
      'IoGridOutline': <IoGridOutline />,
      'IoStatsChartOutline': <IoStatsChartOutline />
    };
    return iconMap[icon] || <FaBox />;
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
      className={`${styles.categoryCard} ${styles[statusColor]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.categoryCardHeader}>
        <div className={styles.categoryHeaderContent}>
          <div className={`${styles.categoryIconCircle} ${styles[category.color]}`}>
            {getIconElement(category.icon)}
          </div>
          <div className={styles.categoryHeaderText}>
            <h4 className={styles.categoryCardName}>{category.name}</h4>
            <span className={styles.categoryCardCode}>{category.code}</span>
          </div>
        </div>
        <div className={styles.categoryCardActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => onView(category)}
            title="Voir détails"
            className={styles.actionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => onEdit(category)}
            title="Modifier"
            className={styles.actionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => onDelete(category)}
            title="Supprimer"
            className={styles.actionButton}
          />
        </div>
      </div>
      
      <div className={styles.categoryCardBody}>
        <p className={styles.categoryCardDescription}>
          {category.description.length > 100 
            ? `${category.description.substring(0, 100)}...` 
            : category.description}
        </p>
        
        <div className={styles.categoryCardStats}>
          <div className={styles.statItem}>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{category.productCount}</span>
              <span className={styles.statLabel}>Produits</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{category.salesCount}</span>
              <span className={styles.statLabel}>Ventes</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{formatCurrency(category.stockValue)}</span>
              <span className={styles.statLabel}>Valeur</span>
            </div>
          </div>
        </div>
        
        <div className={styles.categoryCardTags}>
          <div className={styles.tagsContainer}>
            {category.tags.slice(0, 3).map((tag, tagIndex) => (
              <span key={tagIndex} className={styles.tagItem}>{tag}</span>
            ))}
            {category.tags.length > 3 && (
              <span className={styles.moreTags}>+{category.tags.length - 3}</span>
            )}
          </div>
          <span className={`${styles.statusBadge} ${styles[statusColor]}`}>
            {getStatusText(category.status)}
          </span>
        </div>
      </div>
      
      <div className={styles.categoryCardFooter}>
        <div className={styles.categoryCardMeta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Créée:</span>
            <span className={styles.metaValue}>{category.createdAt}</span>
          </div>
          {category.parent && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Parent:</span>
              <span className={styles.metaValueParent}>{category.parent}</span>
            </div>
          )}
        </div>
        <div className={styles.categoryCardFeatures}>
          {category.canBeSold && <span className={styles.feature} title="Peut être vendu">💰</span>}
          {category.requiresSpecialHandling && <span className={styles.feature} title="Manipulation spéciale">⚠️</span>}
          {category.hasWarranty && <span className={styles.feature} title={`Garantie ${category.warrantyPeriod} mois`}>🛡️</span>}
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour convertir les dates
const convertDateString = (dateString) => {
  if (!dateString) return new Date(0);
  const parts = dateString.split('/');
  if (parts.length !== 3) return new Date(0);
  return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
};

const Categories = () => {
  const navigate = useNavigate();
  
  // Données mock pour la démonstration
  const mockCategories = useMemo(() => [
    {
      id: 1,
      name: 'Matériaux Construction',
      code: 'MAT-CONST',
      description: 'Matériaux de construction générale pour tous types de travaux. Inclut ciment, briques, sable, gravier et produits dérivés.',
      status: 'active',
      color: 'primary',
      icon: 'FaBox',
      parent: null,
      productCount: 156,
      salesCount: 1245,
      stockValue: 45000000,
      margin: 32.5,
      createdAt: '15/01/2024',
      updatedAt: '20/03/2024',
      tags: ['construction', 'bâtiment', 'gros œuvre', 'matériaux'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: false,
      warrantyPeriod: 0,
      topProducts: [
        { name: 'Ciment 50kg', sales: 1250, revenue: 47500000 },
        { name: 'Tôle Galvanisée', sales: 845, revenue: 25350000 },
        { name: 'Briques', sales: 520, revenue: 15600000 }
      ]
    },
    {
      id: 2,
      name: 'Ferronnerie',
      code: 'FERRO',
      description: 'Produits métalliques pour construction et fabrication. Fer à béton, tôles, profilés et accessoires métalliques.',
      status: 'active',
      color: 'warning',
      icon: 'FaTools',
      parent: null,
      productCount: 89,
      salesCount: 658,
      stockValue: 18500000,
      margin: 35.2,
      createdAt: '10/02/2024',
      updatedAt: '18/03/2024',
      tags: ['métal', 'construction', 'acier', 'ferronnerie'],
      canBeSold: true,
      requiresSpecialHandling: true,
      hasWarranty: true,
      warrantyPeriod: 12,
      topProducts: [
        { name: 'Fer à Béton', sales: 420, revenue: 12600000 },
        { name: 'Tôle Galvanisée', sales: 320, revenue: 9600000 },
        { name: 'Grillage', sales: 150, revenue: 4500000 }
      ]
    },
    {
      id: 3,
      name: 'Quincaillerie',
      code: 'QUINC',
      description: 'Petite quincaillerie et accessoires de fixation. Vis, clous, écrous, boulons et produits similaires.',
      status: 'active',
      color: 'accent',
      icon: 'MdOutlineLocalOffer',
      parent: null,
      productCount: 245,
      salesCount: 3580,
      stockValue: 8500000,
      margin: 45.8,
      createdAt: '05/01/2024',
      updatedAt: '15/03/2024',
      tags: ['quincaillerie', 'fixation', 'accessoires', 'petite quincaillerie'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: false,
      warrantyPeriod: 0,
      topProducts: [
        { name: 'Vis à Bois', sales: 12500, revenue: 1875000 },
        { name: 'Clous', sales: 8500, revenue: 1275000 },
        { name: 'Écrous', sales: 4200, revenue: 630000 }
      ]
    },
    {
      id: 4,
      name: 'Peinture',
      code: 'PEINT',
      description: 'Peintures et produits de finition. Gamme complète de peintures intérieures et extérieures, vernis, solvants.',
      status: 'active',
      color: 'danger',
      icon: 'IoColorPaletteOutline',
      parent: null,
      productCount: 67,
      salesCount: 420,
      stockValue: 12500000,
      margin: 40.3,
      createdAt: '20/02/2024',
      updatedAt: '10/03/2024',
      tags: ['finition', 'décoration', 'couleurs', 'peinture'],
      canBeSold: true,
      requiresSpecialHandling: true,
      hasWarranty: true,
      warrantyPeriod: 24,
      topProducts: [
        { name: 'Peinture Blanche', sales: 320, revenue: 9600000 },
        { name: 'Vernis', sales: 180, revenue: 5400000 },
        { name: 'Solvant', sales: 120, revenue: 3600000 }
      ]
    },
    {
      id: 5,
      name: 'Plomberie',
      code: 'PLOMB',
      description: 'Tuyauterie et accessoires plomberie. Tuyaux PVC, raccords, robinetterie et équipements sanitaires.',
      status: 'active',
      color: 'info',
      icon: 'FaWeightHanging',
      parent: null,
      productCount: 98,
      salesCount: 780,
      stockValue: 9500000,
      margin: 38.7,
      createdAt: '12/02/2024',
      updatedAt: '22/03/2024',
      tags: ['tuyauterie', 'sanitaire', 'eau', 'plomberie'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: true,
      warrantyPeriod: 36,
      topProducts: [
        { name: 'Tuyau PVC', sales: 580, revenue: 2900000 },
        { name: 'Robinet', sales: 320, revenue: 2560000 },
        { name: 'Raccord', sales: 450, revenue: 1350000 }
      ]
    },
    {
      id: 6,
      name: 'Électricité',
      code: 'ELEC',
      description: 'Matériel électrique et câblage. Câbles, interrupteurs, prises, disjoncteurs et accessoires électriques.',
      status: 'active',
      color: 'success',
      icon: 'FaChartLine',
      parent: null,
      productCount: 112,
      salesCount: 920,
      stockValue: 18500000,
      margin: 42.1,
      createdAt: '08/03/2024',
      updatedAt: '25/03/2024',
      tags: ['électricité', 'câblage', 'installation', 'électrique'],
      canBeSold: true,
      requiresSpecialHandling: true,
      hasWarranty: true,
      warrantyPeriod: 24,
      topProducts: [
        { name: 'Câble Électrique', sales: 450, revenue: 33750000 },
        { name: 'Interrupteur', sales: 280, revenue: 1400000 },
        { name: 'Prise', sales: 190, revenue: 950000 }
      ]
    },
    {
      id: 7,
      name: 'Ciment Spécial',
      code: 'CIM-SPEC',
      description: 'Ciments spéciaux et adjuvants. Ciments rapides, alumineux, expansifs et produits techniques.',
      status: 'inactive',
      color: 'gray',
      icon: 'FaBox',
      parent: 'Matériaux Construction',
      productCount: 12,
      salesCount: 45,
      stockValue: 2500000,
      margin: 28.5,
      createdAt: '25/01/2024',
      updatedAt: '05/03/2024',
      tags: ['spécial', 'adjuvant', 'ciment', 'technique'],
      canBeSold: false,
      requiresSpecialHandling: true,
      hasWarranty: false,
      warrantyPeriod: 0,
      topProducts: [
        { name: 'Ciment Rapide', sales: 25, revenue: 1250000 },
        { name: 'Ciment Alumineux', sales: 15, revenue: 750000 },
        { name: 'Adjuvant', sales: 5, revenue: 250000 }
      ]
    },
    {
      id: 8,
      name: 'Outillage',
      code: 'OUTIL',
      description: 'Outils manuels et électroportatifs. Marteaux, tournevis, perceuses, scies et équipements professionnels.',
      status: 'draft',
      color: 'warning',
      icon: 'FaTools',
      parent: null,
      productCount: 0,
      salesCount: 0,
      stockValue: 0,
      margin: 0,
      createdAt: '28/03/2024',
      updatedAt: null,
      tags: ['outils', 'manuels', 'électroportatifs', 'professionnel'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: true,
      warrantyPeriod: 12,
      topProducts: []
    },
    {
      id: 9,
      name: 'Sécurité',
      code: 'SECU',
      description: 'Équipements de protection individuelle et sécurité. Casques, gants, lunettes, extincteurs.',
      status: 'active',
      color: 'danger',
      icon: 'IoLockClosedOutline',
      parent: null,
      productCount: 34,
      salesCount: 210,
      stockValue: 6500000,
      margin: 48.2,
      createdAt: '15/03/2024',
      updatedAt: '30/03/2024',
      tags: ['sécurité', 'protection', 'EPI', 'équipement'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: true,
      warrantyPeriod: 6,
      topProducts: [
        { name: 'Casque de sécurité', sales: 120, revenue: 2400000 },
        { name: 'Gants de protection', sales: 180, revenue: 900000 },
        { name: 'Extincteur', sales: 45, revenue: 1800000 }
      ]
    },
    {
      id: 10,
      name: 'Jardinage',
      code: 'JARD',
      description: 'Outils et produits pour jardinage. Terreaux, engrais, outils de jardin, accessoires.',
      status: 'active',
      color: 'success',
      icon: 'IoGridOutline',
      parent: null,
      productCount: 56,
      salesCount: 380,
      stockValue: 4200000,
      margin: 52.3,
      createdAt: '05/03/2024',
      updatedAt: '28/03/2024',
      tags: ['jardinage', 'outils', 'terreau', 'engrais'],
      canBeSold: true,
      requiresSpecialHandling: false,
      hasWarranty: false,
      warrantyPeriod: 0,
      topProducts: [
        { name: 'Terreau Universel', sales: 220, revenue: 880000 },
        { name: 'Engrais NPK', sales: 150, revenue: 750000 },
        { name: 'Râteau', sales: 85, revenue: 425000 }
      ]
    }
  ], []);

  // États pour les données
  const [categories, setCategories] = useState(mockCategories);

  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'

  // Fonction de tri avec useCallback pour éviter les déclarations dans useMemo
  const sortCategories = useCallback((a, b, sortType) => {
    switch (sortType) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'products':
        return b.productCount - a.productCount;
      case 'sales':
        return b.salesCount - a.salesCount;
      case 'value':
        return b.stockValue - a.stockValue;
      case 'recent':
        return convertDateString(b.createdAt) - convertDateString(a.createdAt);
      default:
        return 0;
    }
  }, []);

  // Calcul des catégories filtrées
  const filteredCategories = useMemo(() => {
    let filtered = [...categories];

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchLower) ||
        category.code.toLowerCase().includes(searchLower) ||
        category.description.toLowerCase().includes(searchLower) ||
        category.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => category.status === statusFilter);
    }

    // Tri
    filtered.sort((a, b) => sortCategories(a, b, sortBy));

    return filtered;
  }, [categories, searchTerm, statusFilter, sortBy, sortCategories]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const activeCategories = categories.filter(c => c.status === 'active').length;
    const inactiveCategories = categories.filter(c => c.status === 'inactive').length;
    const draftCategories = categories.filter(c => c.status === 'draft').length;
    const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);
    const totalSales = categories.reduce((sum, cat) => sum + cat.salesCount, 0);
    const totalStockValue = categories.reduce((sum, cat) => sum + cat.stockValue, 0);
    const averageMargin = categories.length > 0 
      ? (categories.reduce((sum, cat) => sum + cat.margin, 0) / categories.length).toFixed(1)
      : 0;

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      draftCategories,
      totalProducts,
      totalSales,
      totalStockValue,
      averageMargin
    };
  }, [categories]);

  // Gestion des événements
  const handleDeleteCategory = useCallback((category) => {
    if (category.productCount > 0) {
      if (!window.confirm(
        `La catégorie "${category.name}" contient ${category.productCount} produits. ` +
        `Êtes-vous sûr de vouloir la supprimer ? Cette action est irréversible.`
      )) {
        return;
      }
    } else if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${category.name}" ?`)) {
      return;
    }
    
    setCategories(categories.filter(c => c.id !== category.id));
  }, [categories]);

  const handleViewCategory = useCallback((category) => {
    navigate(`/detailCategoriesAdmin/${category.id}`, {
      state: { categoryData: category }
    });
  }, [navigate]);

  const handleEditCategory = useCallback((category) => {
    navigate(`/frmCategoriesAdmin/${category.id}`, {
      state: { categoryData: category }
    });
  }, [navigate]);

  const handleExport = useCallback(() => {
    const csvContent = [
      ['Nom', 'Code', 'Description', 'Statut', 'Produits', 'Ventes', 'Valeur Stock', 'Marge', 'Tags'],
      ...categories.map(c => [
        c.name,
        c.code,
        c.description,
        c.status,
        c.productCount,
        c.salesCount,
        c.stockValue,
        c.margin,
        c.tags.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `categories-quincaillerie-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }, [categories]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('name');
  }, []);

  const formatCurrency = useCallback((amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M Ar`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K Ar`;
    }
    return `${amount} Ar`;
  }, []);

  // Fonction pour vérifier si une catégorie a été créée ce mois-ci
  const isCreatedThisMonth = useCallback((category) => {
    const createdDate = convertDateString(category.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && 
           createdDate.getFullYear() === now.getFullYear();
  }, []);

  // Configuration des colonnes pour le tableau
  const tableColumns = [
    {
      label: 'Catégorie',
      accessor: 'name',
      render: (row) => (
        <div className={styles.tableCategoryInfo}>
          <div className={styles.tableCategoryDetails}>
            <div className={styles.tableCategoryName}>
              {row.name.length > 10 
              ? `${row.name.substring(0, 20)}...` 
              : row.name}
            </div>
            <div className={styles.tableCategoryCode}>
              {row.code.length > 10 
              ? `${row.code.substring(0, 20)}...` 
              : row.code}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Description',
      accessor: 'description',
      render: (row) => (
        <div className={styles.tableDescription}>
          {row.description.length > 50 
            ? `${row.description.substring(0, 20)}...` 
            : row.description}
        </div>
      )
    },
    {
      label: 'Produits',
      accessor: 'productCount',
      align: 'center',
      render: (row) => (
        <div className={styles.tableProductCount}>
          <span className={styles.tableCountValue}>{row.productCount}</span>
        </div>
      )
    },
    {
      label: 'Ventes',
      accessor: 'salesCount',
      align: 'center',
      render: (row) => (
        <div className={styles.tableSalesCount}>
          {row.salesCount}
        </div>
      )
    },
    {
      label: 'Valeur Stock',
      accessor: 'stockValue',
      align: 'right',
      render: (row) => (
        <div className={styles.tableStockValue}>
          {formatCurrency(row.stockValue)}
        </div>
      )
    },
    {
      label: 'Statut',
      accessor: 'status',
      align: 'center',
      render: (row) => {
        const statusText = row.status === 'active' ? 'ACTIF' : 
                          row.status === 'inactive' ? 'INACTIF' : 'BROUILLON';
        return (
          <span className={`${styles.tableStatusBadge} ${styles[row.status]}`}>
            {statusText}
          </span>
        );
      }
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
            onClick={() => handleViewCategory(row)}
            title="Voir détails"
            className={styles.tableActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => handleEditCategory(row)}
            title="Modifier"
            className={styles.tableActionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => handleDeleteCategory(row)}
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
                  Gestion des <span className={styles.highlight}>Catégories</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Organisez vos produits par catégories pour une meilleure gestion du stock et des ventes
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
                onClick={() => navigate('/dashboardAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Administration"
                onClick={() => navigate('/dashboardAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Catégories"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className={styles.dashboardControls}>
          <div className={styles.actionsSection}>
            <Link 
              to="/frmCategoriesAdmin"
              className={styles.newCategoryLink}
            >
              <Button 
                variant="primary"
                size="medium"
                icon="add"
                className={styles.actionButton}
              >
                Nouvelle Catégorie
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

        {/* Statistiques détaillées */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoStatsChartOutline className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Aperçu des Catégories</h2>
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
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <MdCategory />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.activeCategories} <b>/</b> {stats.totalCategories}</span>
                <span className={styles.statLabel}>Catégories Actives</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <FaBox />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalProducts}</span>
                <span className={styles.statLabel}>Produits Total</span>
              </div>
            </div>

            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <IoTrendingUpOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalSales}</span>
                <span className={styles.statLabel}>Ventes Total</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.detail}`}>
                <FaChartLine /> 
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}><div className={styles}>{formatCurrency(stats.totalStockValue)}</div></span>
                <span className={styles.statLabel}>Valeur Stock Total</span>
              </div>
            </div>
          </div>
        </section>

        {/* Rechercher catégorie */}
        <div className={styles.searchSection}>
          <Input
            type="text"
            placeholder="Rechercher catégorie, code, description, tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            name="categorySearch"
            icon={<IoSearchOutline />}
            className={styles}
          />
        </div>

        {/* Filtres */}
        <div className={styles.quickFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Statut:</label>
            <InputSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actives' },
                { value: 'inactive', label: 'Inactives' },
                { value: 'draft', label: 'Brouillons' }
              ]}
              placeholder="Statut"
              size="small"
              icon={<IoCheckmarkCircleOutline />}
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
                { value: 'products', label: 'Produits (décroissant)' },
                { value: 'sales', label: 'Ventes (décroissant)' },
                { value: 'value', label: 'Valeur (décroissant)' },
                { value: 'recent', label: 'Plus récentes' }
              ]}
              placeholder="Trier par"
              size="small"
              icon={<TbArrowsSort />}
              fullWidth
              className={styles}
            />
          </div>
        </div>

        {/* Liste des catégories */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <MdCategory className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Catégories de Produits</h2>
                <p className={styles.sectionSubtitle}>
                  {filteredCategories.length} catégorie(s) trouvée(s) sur {categories.length}
                </p>
              </div>
            </div>


            <div className={styles.sectionActions}>
              <div className={styles.filterGroup}>
                <div className={styles.viewToggle}>
                  <Button 
                    variant={viewMode === 'grid' ? 'primary' : 'outline'}
                    size="small"
                    icon="grid"
                    onClick={() => setViewMode('grid')}
                    className={styles.viewButton}
                    title="Vue grille"
                  />
                  <Button 
                    variant={viewMode === 'list' ? 'primary' : 'outline'}
                    size="small"
                    icon="list"
                    onClick={() => setViewMode('list')}
                    className={styles.viewButton}
                    title="Vue liste"
                  />
                </div>
              </div>

              <Link 
                to="/frmCategoriesAdmin"
                className={styles.newCategoryLink}
              >
                <Button 
                  variant="primary"
                  size="medium"
                  icon="add"
                  className={styles.actionButton}
                >
                  Ajouter Catégorie
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Vue grille ou tableau */}
          {viewMode === 'grid' ? (
            <div className={styles.categoriesGrid}>
              {filteredCategories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onView={handleViewCategory}
                  delay={index * 100}
                />
              ))}
              
              {filteredCategories.length === 0 && (
                <div className={styles.noResults}>
                  <MdCategory className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucune catégorie trouvée</h3>
                  <p className={styles.noResultsText}>
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Aucune catégorie ne correspond à vos critères de recherche.'
                      : 'Aucune catégorie n\'a été créée pour le moment.'}
                  </p>
                  <div className={styles.noResultsActions}>
                    {searchTerm || statusFilter !== 'all' ? (
                      <Button 
                        variant="primary"
                        size="medium"
                        icon="refresh"
                        onClick={handleResetFilters}
                        className={styles.resetFiltersButton}
                      >
                        Réinitialiser les filtres
                      </Button>
                    ) : (
                      <Link 
                        to="/frmCategoriesAdmin"
                        className={styles.newCategoryLink}
                      >
                        <Button 
                          variant="primary"
                          size="medium"
                          icon="add"
                          className={styles.actionButton}
                        >
                          Créer votre première catégorie
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table 
                columns={tableColumns}
                data={filteredCategories}
                className={styles.categoryTable}
              />
              
              {filteredCategories.length === 0 && (
                <div className={styles.noResults}>
                  <MdCategory className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucune catégorie trouvée</h3>
                  <p className={styles.noResultsText}>
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Aucune catégorie ne correspond à vos critères de recherche.'
                      : 'Aucune catégorie n\'a été créée pour le moment.'}
                  </p>
                  <div className={styles.noResultsActions}>
                    {searchTerm || statusFilter !== 'all' ? (
                      <Button 
                        variant="primary"
                        size="medium"
                        icon="refresh"
                        onClick={handleResetFilters}
                        className={styles.resetFiltersButton}
                      >
                        Réinitialiser les filtres
                      </Button>
                    ) : (
                      <Link 
                        to="/frmCategoriesAdmin"
                        className={styles.newCategoryLink}
                      >
                        <Button 
                          variant="primary"
                          size="medium"
                          icon="add"
                          className={styles.actionButton}
                        >
                          Créer votre première catégorie
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {filteredCategories.length > 0 && (
            <div className={styles.pagination}>
              <Button 
                variant="outline"
                size="small"
                icon="precedant"
                disabled={true}
                className={styles.paginationButton}
              />
              <span className={styles.paginationInfo}>
                Catégories 1-{filteredCategories.length} sur {filteredCategories.length}
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
              <h4 className={styles.quickActionTitle}>
                {categories.filter(c => c.productCount === 0).length} catégories vides
              </h4>
              <p className={styles.quickActionText}>Catégories sans produit - À vérifier</p>
            </div>
            <Button 
              variant="warning"
              size="medium"
              icon="warning"
              onClick={() => {
                const emptyCategories = categories.filter(c => c.productCount === 0);
                if (emptyCategories.length > 0) {
                  alert(`${emptyCategories.length} catégorie(s) vide(s) :\n${emptyCategories.map(c => `• ${c.name}`).join('\n')}`);
                } else {
                  alert('Aucune catégorie vide !');
                }
              }}
              className={styles.quickActionButton}
            >
              Vérifier
            </Button>
          </div>
          
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.accent}`}>
              <IoDuplicateOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>
                {categories.filter(c => !c.canBeSold).length} catégories non vendables
              </h4>
              <p className={styles.quickActionText}>Configuration nécessaire pour autoriser la vente</p>
            </div>
            <Button 
              variant="accent"
              size="medium"
              icon="settings"
              onClick={() => {
                const nonSellable = categories.filter(c => !c.canBeSold);
                if (nonSellable.length > 0) {
                  if (window.confirm(`Configurer ${nonSellable.length} catégorie(s) non vendables ?`)) {
                    // Rediriger vers la première catégorie non vendable
                    navigate(`/frmCategoriesAdmin/${nonSellable[0].id}`, {
                      state: { categoryData: nonSellable[0] }
                    });
                  }
                } else {
                  alert('Toutes les catégories peuvent être vendues !');
                }
              }}
              className={styles.quickActionButton}
            >
              Configurer
            </Button>
          </div>

          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.success}`}>
              <IoCalendarOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>
                Catégories créées ce mois
              </h4>
              <p className={styles.quickActionText}>
                {categories.filter(isCreatedThisMonth).length} nouvelles catégories
              </p>
            </div>
            <Link 
              to="/frmCategoriesAdmin"
              className={styles.quickActionLink}
            >
              <Button 
                variant="success"
                size="medium"
                icon="add"
                className={styles.quickActionButton}
              >
                Nouvelle Catégorie
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

export default Categories;