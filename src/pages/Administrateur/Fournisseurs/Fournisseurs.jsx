// Fournisseurs.jsx
import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './Fournisseurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import Button from '../../../components/Button/Button';
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
  IoBusinessOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoCartOutline,
  IoCashOutline,
  IoTimeOutline,
  IoChevronForwardOutline,
  IoStarOutline,
  IoStar,
  IoPrintOutline,
  IoShareSocialOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoArchiveOutline,
  IoDuplicateOutline
} from "react-icons/io5";
import { 
  FaTruck, 
  FaMoneyBillWave, 
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaRegCreditCard,
  FaClipboardCheck
} from "react-icons/fa";
import { TbBuildingWarehouse, TbCurrencyDollar, TbTruckDelivery } from "react-icons/tb";
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

// Composant de carte de fournisseur
const SupplierCard = ({ 
  supplier, 
  onEdit, 
  onDelete, 
  onView, 
  onOrders, 
  onContact,
  delay = 0 
}) => {
  const ratingStars = Array(5).fill(0).map((_, index) => (
    <span key={index} className={styles.starIcon}>
      {index < Math.floor(supplier.rating) ? <IoStar /> : <IoStarOutline />}
    </span>
  ));

  return (
    <div 
      className={`${styles.supplierCard} ${styles[supplier.status]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.supplierCardHeader}>
        <div className={styles.supplierLogo}>
          <div className={styles.logoPlaceholder}>
            {supplier.name.charAt(0)}
          </div>
        </div>

        <div className={`${styles.statusBadge} ${styles[supplier.status]}`}>
          {supplier.status === 'active' ? 'ACTIF' : 
            supplier.status === 'pending' ? 'EN ATTENTE' : 'INACTIF'}
        </div>
        
        <div className={styles.supplierQuickActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => onView(supplier)}
            className={styles.iconButton}
            title="Voir détails"
          />
          <Button 
            variant="success"
            size="small"
            icon="cart"
            onClick={() => onOrders(supplier)}
            className={styles.iconButton}
            title="Voir commandes"
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => onEdit(supplier)}
            className={styles.iconButton}
            title="Modifier"
          />
        </div>
      </div>
      
      <div className={styles.supplierCardBody}>
        <div className={styles.supplierInfo}>
          <h4 className={styles.supplierName}>{supplier.name}</h4>
          <div className={styles.supplierCategory}>
            <IoBusinessOutline />
            <span>{supplier.category}</span>
          </div>
          
          <div className={styles.supplierRating}>
            <div className={styles.stars}>
              {ratingStars}
            </div>
            <span className={styles.ratingValue}>{supplier.rating.toFixed(1)}/5</span>
          </div>
          
          <div className={styles.supplierContacts}>
            <div className={styles.contactItem}>
              <IoMailOutline />
              <span className={styles.contactText}>{supplier.email}</span>
            </div>
            <div className={styles.contactItem}>
              <IoCallOutline />
              <span className={styles.contactText}>{supplier.phone}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.supplierStats}>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Produits</span>
              <span className={styles.statValue}>{supplier.productsCount}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Commandes</span>
              <span className={styles.statValue}>{supplier.ordersCount}</span>
            </div>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Délai moyen</span>
              <span className={styles.statValue}>{supplier.avgDeliveryTime}j</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Fiabilité</span>
              <span className={`${styles.statValue} ${styles.reliability}`}>
                {supplier.reliability}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.supplierCardFooter}>
        <div className={styles.supplierActions}>
          <Button 
            variant="outline"
            size="small"
            icon="call"
            onClick={() => onContact(supplier)}
            className={styles.actionButton}
          >
            Contacter
          </Button>
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => onDelete(supplier)}
            className={styles.actionButton}
            title="Supprimer"
          />
        </div>
        
        <div className={styles.supplierLastOrder}>
          <span className={styles.lastOrderLabel}>Dernière commande:</span>
          <span className={styles.lastOrderDate}>{supplier.lastOrderDate}</span>
        </div>
      </div>
    </div>
  );
};

const Fournisseurs = () => {
  const navigate = useNavigate();
  
  // Données mock pour la démonstration
  const mockSuppliers = useMemo(() => [
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
      taxId: '000123456789',
      paymentTerms: '30',
      deliveryTime: '3',
      status: 'active',
      rating: 4.7,
      notes: 'Fournisseur principal de ciment, livraison rapide et fiable.',
      productsCount: 25,
      ordersCount: 48,
      totalValue: 125000000,
      avgDeliveryTime: 2.5,
      reliability: 98.5,
      lastOrderDate: '15/03/2024',
      recentOrders: [
        { reference: 'CMD-2024-00158', date: '15/03/2024', amount: 2500000, status: 'livré' },
        { reference: 'CMD-2024-00142', date: '28/02/2024', amount: 1800000, status: 'livré' },
        { reference: 'CMD-2024-00125', date: '15/02/2024', amount: 3200000, status: 'livré' }
      ]
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
      taxId: '000987654321',
      paymentTerms: '15',
      deliveryTime: '5',
      status: 'active',
      rating: 4.3,
      notes: 'Spécialiste en tôles galvanisées et produits métalliques.',
      productsCount: 18,
      ordersCount: 32,
      totalValue: 85000000,
      avgDeliveryTime: 4.2,
      reliability: 95.2,
      lastOrderDate: '10/03/2024',
      recentOrders: [
        { reference: 'CMD-2024-00155', date: '10/03/2024', amount: 1250000, status: 'livré' },
        { reference: 'CMD-2024-00130', date: '25/02/2024', amount: 950000, status: 'livré' }
      ]
    },
    {
      id: 3,
      name: 'Bricodépôt Madagascar',
      category: 'Quincaillerie',
      email: 'ventes@bricodepot.mg',
      phone: '+261 20 22 345 67',
      address: "Route d'Andravoahangy, Antananarivo 101",
      website: 'https://www.bricodepot.mg',
      contactPerson: 'M. Rabe Jean',
      contactPhone: '+261 34 34 567 89',
      taxId: '001234567890',
      paymentTerms: '30',
      deliveryTime: '2',
      status: 'active',
      rating: 4.8,
      notes: 'Large gamme de produits de quincaillerie et outillage.',
      productsCount: 156,
      ordersCount: 125,
      totalValue: 45000000,
      avgDeliveryTime: 1.8,
      reliability: 99.1,
      lastOrderDate: '14/03/2024',
      recentOrders: [
        { reference: 'CMD-2024-00157', date: '14/03/2024', amount: 850000, status: 'en cours' },
        { reference: 'CMD-2024-00144', date: '02/03/2024', amount: 420000, status: 'livré' },
        { reference: 'CMD-2024-00129', date: '20/02/2024', amount: 680000, status: 'livré' }
      ]
    },
    {
      id: 4,
      name: 'Dulux Madagascar',
      category: 'Peinture',
      email: 'commercial@dulux.mg',
      phone: '+261 20 22 456 78',
      address: 'Lotissement Industriel, Antsirabe',
      website: 'https://www.dulux.mg',
      contactPerson: 'M. Rajaonarivelo',
      contactPhone: '+261 34 45 678 90',
      taxId: '002345678901',
      paymentTerms: '45',
      deliveryTime: '7',
      status: 'active',
      rating: 4.2,
      notes: 'Produits de peinture de qualité, parfois des retards de livraison.',
      productsCount: 42,
      ordersCount: 28,
      totalValue: 32000000,
      avgDeliveryTime: 6.5,
      reliability: 88.7,
      lastOrderDate: '05/03/2024',
      recentOrders: [
        { reference: 'CMD-2024-00148', date: '05/03/2024', amount: 1850000, status: 'en attente' }
      ]
    },
    {
      id: 5,
      name: 'Plomberie Pro',
      category: 'Plomberie',
      email: 'contact@plomberiepro.mg',
      phone: '+261 20 22 567 89',
      address: 'Route Circulaire, Ampahibe, Antananarivo',
      contactPerson: 'M. Andriamihaja',
      contactPhone: '+261 34 56 789 01',
      taxId: '003456789012',
      paymentTerms: '7',
      deliveryTime: '1',
      status: 'active',
      rating: 4.9,
      notes: 'Excellente réactivité, toujours en stock.',
      productsCount: 68,
      ordersCount: 92,
      totalValue: 28000000,
      avgDeliveryTime: 1.2,
      reliability: 99.8,
      lastOrderDate: '12/03/2024',
      recentOrders: [
        { reference: 'CMD-2024-00153', date: '12/03/2024', amount: 650000, status: 'livré' },
        { reference: 'CMD-2024-00147', date: '04/03/2024', amount: 420000, status: 'livré' }
      ]
    },
    {
      id: 6,
      name: 'Electro-Mad',
      category: 'Électricité',
      email: 'ventes@electromad.mg',
      phone: '+261 20 22 678 90',
      address: 'Ankorondrano, Antananarivo',
      website: 'https://www.electromad.mg',
      contactPerson: 'Mme. Ravao',
      contactPhone: '+261 34 67 890 12',
      taxId: '004567890123',
      paymentTerms: '30',
      deliveryTime: '4',
      status: 'pending',
      rating: 3.8,
      notes: 'Nouveau fournisseur, en phase de test.',
      productsCount: 35,
      ordersCount: 8,
      totalValue: 12500000,
      avgDeliveryTime: 4.5,
      reliability: 85.0,
      lastOrderDate: '28/02/2024'
    },
    {
      id: 7,
      name: 'Outillage Express',
      category: 'Outillage',
      email: 'info@outillage.mg',
      phone: '+261 20 22 789 01',
      address: '67 Ha, Analakely, Antananarivo',
      contactPerson: 'M. Randriamampionona',
      contactPhone: '+261 34 78 901 23',
      taxId: '005678901234',
      paymentTerms: '0',
      deliveryTime: '1',
      status: 'active',
      rating: 4.4,
      notes: 'Paiement comptant uniquement, livraison express.',
      productsCount: 89,
      ordersCount: 65,
      totalValue: 38000000,
      avgDeliveryTime: 1.0,
      reliability: 96.3,
      lastOrderDate: '13/03/2024'
    },
    {
      id: 8,
      name: 'Transport Logistique',
      category: 'Transport',
      email: 'logistique@transport.mg',
      phone: '+261 20 22 890 12',
      address: 'Gare Routière, Anosibe, Antananarivo',
      contactPerson: 'M. Rakotondrainibe',
      contactPhone: '+261 34 89 012 34',
      taxId: '006789012345',
      paymentTerms: '7',
      deliveryTime: 'N/A',
      status: 'inactive',
      rating: 3.5,
      notes: 'Service suspendu temporairement.',
      productsCount: 0,
      ordersCount: 15,
      totalValue: 8500000,
      avgDeliveryTime: 3.2,
      reliability: 92.1,
      lastOrderDate: '15/01/2024'
    }
  ], []);

  // États pour les données
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  
  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  // Calcul des fournisseurs filtrés
  const filteredSuppliers = useMemo(() => {
    let filtered = [...suppliers];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm) ||
        (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(supplier => supplier.category === selectedCategory);
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(supplier => supplier.status === statusFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'orders-high':
          return b.ordersCount - a.ordersCount;
        case 'reliability-high':
          return b.reliability - a.reliability;
        case 'date-new':
          return new Date(b.lastOrderDate.split('/').reverse().join('-')) - 
                 new Date(a.lastOrderDate.split('/').reverse().join('-'));
        case 'date-old':
          return new Date(a.lastOrderDate.split('/').reverse().join('-')) - 
                 new Date(b.lastOrderDate.split('/').reverse().join('-'));
        default:
          return 0;
      }
    });

    return filtered;
  }, [suppliers, searchTerm, selectedCategory, statusFilter, sortBy]);

  // Gestion des statistiques
  const stats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
    const pendingSuppliers = suppliers.filter(s => s.status === 'pending').length;
    const inactiveSuppliers = suppliers.filter(s => s.status === 'inactive').length;
    const totalProducts = suppliers.reduce((sum, s) => sum + s.productsCount, 0);
    const totalOrders = suppliers.reduce((sum, s) => sum + s.ordersCount, 0);
    const avgRating = suppliers.length > 0 
      ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length 
      : 0;
    const highReliability = suppliers.filter(s => s.reliability >= 95).length;

    return {
      totalSuppliers,
      activeSuppliers,
      pendingSuppliers,
      inactiveSuppliers,
      totalProducts,
      totalOrders,
      avgRating,
      highReliability
    };
  }, [suppliers]);

  // Extraction des catégories uniques
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(suppliers.map(s => s.category))];
    return uniqueCategories;
  }, [suppliers]);

  // Gestion des événements
  const handleAddSupplier = () => {
    navigate('/frmFournisseursAdmin');
  };

  const handleEditSupplier = (supplier) => {
    navigate(`/frmFournisseursAdmin/${supplier.id}`, {
      state: { supplierData: supplier }
    });
  };

  const handleDeleteSupplier = (supplier) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${supplier.name}" ?\nCette action est irréversible.`)) {
      setSuppliers(suppliers.filter(s => s.id !== supplier.id));
    }
  };

  const handleViewSupplier = (supplier) => {
    navigate(`/detailFournisseursAdmin/${supplier.id}`, {
      state: { supplierData: supplier }
    });
  };

  const handleSupplierOrders = (supplier) => {
    alert(`Redirection vers les commandes de: ${supplier.name}`);
    // Dans une application réelle, on redirigerait vers le module des commandes
  };

  const handleContactSupplier = (supplier) => {
    if (supplier.email || supplier.phone) {
      const message = `Contacter ${supplier.name}:\nEmail: ${supplier.email}\nTéléphone: ${supplier.phone}`;
      alert(message);
    }
  };

  const handleExportSuppliers = () => {
    const csvContent = [
      ['Nom', 'Catégorie', 'Email', 'Téléphone', 'Statut', 'Note', 'Produits', 'Commandes', 'Fiabilité'],
      ...suppliers.map(s => [
        s.name,
        s.category,
        s.email,
        s.phone,
        s.status,
        s.rating,
        s.productsCount,
        s.ordersCount,
        `${s.reliability}%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fournisseurs-quincaillerie.csv';
    a.click();
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setStatusFilter('all');
    setSortBy('name');
  };

  const handleViewActive = () => {
    setStatusFilter('active');
    setSelectedCategory('all');
  };

  const handleViewPending = () => {
    setStatusFilter('pending');
    setSelectedCategory('all');
  };

  // Configuration des colonnes pour le tableau
  const tableColumns = [
    {
      label: 'Fournisseur',
      accessor: 'name',
      render: (row) => (
        <div className={styles.tableSupplierInfo}>
          <div className={styles.supplierLogoSmall}>
            <div className={styles.logoPlaceholderSmall}>
              {row.name.charAt(0)}
            </div>
          </div>
          <div className={styles.tableSupplierDetails}>
            <div className={styles.tableSupplierName}>{row.name}</div>
            <div className={styles.tableSupplierCategory}>
              <IoBusinessOutline size={12} /> {row.category}
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Contact',
      accessor: 'contact',
      render: (row) => (
        <div className={styles.tableContact}>
          <div className={styles.contactItem}>
            <IoMailOutline size={12} /> {row.email}
          </div>
          <div className={styles.contactItem}>
            <IoCallOutline size={12} /> {row.phone}
          </div>
        </div>
      )
    },
    {
      label: 'Statut',
      accessor: 'status',
      align: 'center',
      render: (row) => (
        <div className={`${styles.tableStatus} ${styles[row.status]}`}>
          {row.status === 'active' ? 'ACTIF' : 
           row.status === 'pending' ? 'EN ATTENTE' : 'INACTIF'}
        </div>
      )
    },
    {
      label: 'Note',
      accessor: 'rating',
      align: 'center',
      render: (row) => {
        const stars = Array(5).fill(0).map((_, index) => (
          <span key={index} className={styles.starIconSmall}>
            {index < Math.floor(row.rating) ? <IoStar /> : <IoStarOutline />}
          </span>
        ));
        return (
          <div className={styles.tableRating}>
            <div className={styles.starsSmall}>{stars}</div>
            <span className={styles.ratingValueSmall}>{row.rating.toFixed(1)}</span>
          </div>
        );
      }
    },
    {
      label: 'Fiabilité',
      accessor: 'reliability',
      align: 'center',
      render: (row) => (
        <div className={styles.tableReliability}>
          <div className={styles.reliabilityBar}>
            <div 
              className={styles.reliabilityFill}
              style={{ width: `${row.reliability}%` }}
            ></div>
          </div>
          <span className={styles.reliabilityValue}>{row.reliability}%</span>
        </div>
      )
    },
    {
      label: 'Produits',
      accessor: 'productsCount',
      align: 'center',
      render: (row) => (
        <div className={styles.tableProducts}>
          {row.productsCount}
        </div>
      )
    },
    {
      label: 'Commandes',
      accessor: 'ordersCount',
      align: 'center',
      render: (row) => (
        <div className={styles.tableOrders}>
          {row.ordersCount}
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
            onClick={() => handleViewSupplier(row)}
            title="Voir détails"
            className={styles.tableActionButton}
          />
          <Button 
            variant="success"
            size="small"
            icon="cart"
            onClick={() => handleSupplierOrders(row)}
            title="Voir commandes"
            className={styles.tableActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => handleEditSupplier(row)}
            title="Modifier"
            className={styles.tableActionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => handleDeleteSupplier(row)}
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
                  Gestion des <span className={styles.highlight}>Fournisseurs</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Gérez vos partenaires fournisseurs et optimisez votre chaîne d'approvisionnement
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <IoBusinessOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.totalSuppliers}</span>
                  <span className={styles.statLabel}>Fournisseurs</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.success}`}>
                  <IoCheckmarkCircleOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.activeSuppliers}</span>
                  <span className={styles.statLabel}>Actifs</span>
                </div>
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
              />
              <StyledBreadcrumb
                label="Fournisseurs"
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className={styles.dashboardControls}>
          <div className={styles.actionsSection}>
            <Button 
              variant="primary"
              size="medium"
              icon="add"
              onClick={handleAddSupplier}
              className={styles.actionButton}
            >
              Nouveau Fournisseur
            </Button>
            <Button 
              variant="secondary"
              size="medium"
              icon="download"
              onClick={handleExportSuppliers}
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

        {/* Rechercher fournisseur */}
        <div className={styles.searchSection}>
          <Input
            type="text"
            placeholder="Rechercher fournisseur, email, téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            name="supplierSearch"
            icon={<IoSearchOutline />}
            className={styles}
          />
        </div>

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
                  value: cat,
                  label: cat
                }))
              ]}
              placeholder="Catégorie"
              size="small"
              icon={<IoBusinessOutline />}
              fullWidth
              className={styles}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Statut:</label>
            <InputSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actif' },
                { value: 'pending', label: 'En attente' },
                { value: 'inactive', label: 'Inactif' }
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
                { value: 'rating-high', label: 'Note (élevée à faible)' },
                { value: 'rating-low', label: 'Note (faible à élevée)' },
                { value: 'orders-high', label: 'Commandes (décroissant)' },
                { value: 'reliability-high', label: 'Fiabilité (décroissante)' },
                { value: 'date-new', label: 'Date récente' },
                { value: 'date-old', label: 'Date ancienne' }
              ]}
              placeholder="Trier par"
              size="small"
              icon={<IoFilterOutline />}
              fullWidth
              className={styles}
            />
          </div>
        </div>

        {/* Statistiques détaillées */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoStatsChartOutline className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Aperçu des Fournisseurs</h2>
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <IoBusinessOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalSuppliers}</span>
                <span className={styles.statLabel}>Total Fournisseurs</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <IoCheckmarkCircleOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.activeSuppliers}</span>
                <span className={styles.statLabel}>Fournisseurs Actifs</span>
              </div>
            </div>

            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <FaBoxOpen />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.totalProducts}</span>
                <span className={styles.statLabel}>Produits Fournis</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.detail}`}>
                <FaClipboardCheck /> 
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.highReliability}</span>
                <span className={styles.statLabel}>Haute Fiabilité</span>
              </div>
            </div>
          </div>
        </section>

        {/* Liste des fournisseurs */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <IoBusinessOutline className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Répertoire des Fournisseurs</h2>
                <p className={styles.sectionSubtitle}>
                  {filteredSuppliers.length} fournisseur(s) trouvé(s)
                </p>
              </div>
            </div>

            <div className={styles.sectionActions}>
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
                icon="checkmark"
                onClick={handleViewActive}
                className={styles.alertButton}
              >
                Voir actifs
              </Button>
              <Button 
                variant="outline"
                size="medium"
                icon="time"
                onClick={handleViewPending}
                className={styles.alertButton}
              >
                Voir en attente
              </Button>
            </div>
          </div>
          
          {/* Vue grille ou tableau */}
          {viewMode === 'grid' ? (
            <div className={styles.suppliersGrid}>
              {filteredSuppliers.map((supplier, index) => (
                <SupplierCard
                  key={supplier.id}
                  supplier={supplier}
                  onEdit={handleEditSupplier}
                  onDelete={handleDeleteSupplier}
                  onView={handleViewSupplier}
                  onOrders={handleSupplierOrders}
                  onContact={handleContactSupplier}
                  delay={index * 100}
                />
              ))}
              
              {filteredSuppliers.length === 0 && (
                <div className={styles.noResults}>
                  <IoBusinessOutline className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun fournisseur trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun fournisseur ne correspond à vos critères de recherche.
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
                data={filteredSuppliers}
                className={styles.supplierTable}
              />
              
              {filteredSuppliers.length === 0 && (
                <div className={styles.noResults}>
                  <IoBusinessOutline className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun fournisseur trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun fournisseur ne correspond à vos critères de recherche.
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
          {filteredSuppliers.length > 0 && (
            <div className={styles.pagination}>
              <Button 
                variant="outline"
                size="small"
                icon="precedant"
                disabled={true}
                className={styles.paginationButton}
              />
              <span className={styles.paginationInfo}>
                Fournisseurs 1-{filteredSuppliers.length} sur {filteredSuppliers.length}
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
            <div className={`${styles.quickActionIcon} ${styles.success}`}>
              <IoCheckmarkCircleOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.activeSuppliers} fournisseurs actifs</h4>
              <p className={styles.quickActionText}>Relations commerciales en cours</p>
            </div>
            <Button 
              variant="success"
              size="medium"
              icon="add"
              onClick={handleAddSupplier}
              className={styles.quickActionButton}
            >
              Ajouter
            </Button>
          </div>
          
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.warning}`}>
              <IoTimeOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.pendingSuppliers} fournisseurs en attente</h4>
              <p className={styles.quickActionText}>Nécessitent validation ou test</p>
            </div>
            <Button 
              variant="warning"
              size="medium"
              icon="eye"
              className={styles.quickActionButton}
            >
              Vérifier
            </Button>
          </div>
          
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.accent}`}>
              <IoStar />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.highReliability} fournisseurs très fiables</h4>
              <p className={styles.quickActionText}>Fiabilité supérieure à 95%</p>
            </div>
            <Button 
              variant="accent"
              size="medium"
              icon="star"
              className={styles.quickActionButton}
            >
              Voir
            </Button>
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

export default Fournisseurs;