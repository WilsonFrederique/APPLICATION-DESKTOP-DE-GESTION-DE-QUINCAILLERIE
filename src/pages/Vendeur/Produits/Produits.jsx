import React, { useState, useMemo } from 'react';
import styles from './Produits.module.css';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Button from '../../../components/Button/Button';
import FrmProduits from './FrmProduits';
import DetailProduits from './DetailProduits';
import Toast from '../../../components/Toast/Toast';
import { 
  IoSearchOutline,
  IoDuplicateOutline,
  IoWarningOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCartOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { 
  FaBox, 
  FaBarcode,
  FaWarehouse,
  FaTags,
  FaTruck,
  FaCheckCircle
} from "react-icons/fa";
import { 
  TbCategory, 
  TbCurrencyDollar,
  TbArrowsSort,
  TbBuildingWarehouse,
  TbDiscount
} from "react-icons/tb";

// Images d'exemple pour les produits
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=100&h=100&fit=crop',
];

const Produits = () => {  
  // États pour les modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  // État pour les toasts
  const [toasts, setToasts] = useState([]);
  
  // Données mock pour la démonstration
  const mockProducts = useMemo(() => [
    {
      id: 1,
      nom: 'Ciment 50kg',
      reference: 'CIM-50KG',
      categorie: 'Matériaux Construction',
      description: 'Ciment Portland de haute qualité pour construction générale.',
      stock: 15,
      stockInitial: 100,
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
      instructionsSpeciales: 'Protéger de l\'humidité.',
      delaiLivraison: '3-5 jours',
      image: productImages[0],
      dateAjout: '2024-01-15',
      dateCreation: '2024-03-15',
      creerPar: 'Admin',
      derniereModification: '2024-03-25T10:30:00',
      ventesMois: 45,
      revenuMois: 2250000,
      tendance: 'up',
      dernierMouvement: '2024-02-10',
      statut: 'actif'
    },
    {
      id: 2,
      nom: 'Tôle Galvanisée 3m',
      reference: 'TOL-GALV-3M',
      categorie: 'Ferronnerie',
      description: 'Tôle galvanisée de 3m, épaisseur 0.5mm.',
      stock: 8,
      stockInitial: 50,
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
      instructionsSpeciales: 'Manutention avec gants.',
      delaiLivraison: '2-3 jours',
      image: productImages[1],
      dateAjout: '2024-01-20',
      dateCreation: '2024-02-20',
      creerPar: 'Admin',
      derniereModification: '2024-03-22T14:15:00',
      ventesMois: 12,
      revenuMois: 3600000,
      tendance: 'stable',
      dernierMouvement: '2024-02-09',
      statut: 'actif'
    },
    {
      id: 3,
      nom: 'Vis à Bois 5x50',
      reference: 'VIS-BOIS-5x50',
      categorie: 'Quincaillerie',
      description: 'Vis à bois tête plate, acier galvanisé. Paquet de 100 unités.',
      stock: 1200,
      stockInitial: 2000,
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
      image: productImages[2],
      dateAjout: '2024-01-10',
      dateCreation: '2024-01-10',
      creerPar: 'Manager',
      derniereModification: '2024-03-20T09:45:00',
      ventesMois: 85,
      revenuMois: 21250,
      tendance: 'up',
      dernierMouvement: '2024-02-11',
      statut: 'actif'
    },
    {
      id: 4,
      nom: 'Peinture Blanche 10L',
      reference: 'PEINT-BLANC-10L',
      categorie: 'Peinture',
      description: 'Peinture acrylique mate pour intérieur/extérieur.',
      stock: 5,
      stockInitial: 30,
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
      instructionsSpeciales: 'Protéger du gel.',
      delaiLivraison: '3-5 jours',
      image: productImages[3],
      dateAjout: '2024-01-05',
      dateCreation: '2024-03-05',
      creerPar: 'Admin',
      derniereModification: '2024-03-18T16:20:00',
      ventesMois: 8,
      revenuMois: 960000,
      tendance: 'down',
      dernierMouvement: '2024-02-08',
      statut: 'alerte'
    },
    {
      id: 5,
      nom: 'Tuyau PVC 50mm',
      reference: 'TUY-PVC-50',
      categorie: 'Plomberie',
      description: 'Tuyau PVC pression 50mm, longueur 3m.',
      stock: 22,
      stockInitial: 60,
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
      image: productImages[4],
      dateAjout: '2024-01-12',
      dateCreation: '2024-01-12',
      creerPar: 'Admin',
      derniereModification: '2024-03-15T11:20:00',
      ventesMois: 15,
      revenuMois: 375000,
      tendance: 'up',
      dernierMouvement: '2024-02-07',
      statut: 'normal'
    },
    {
      id: 6,
      nom: 'Câble Électrique 2.5mm²',
      reference: 'CABLE-2.5',
      categorie: 'Électricité',
      description: 'Câble électrique rigide 2.5mm², 100m.',
      stock: 45,
      stockInitial: 60,
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
      estPerequitable: false,
      estFragile: false,
      instructionsSpeciales: 'Stocker à l\'abri de l\'humidité.',
      delaiLivraison: '3-5 jours',
      image: productImages[5],
      dateAjout: '2024-01-18',
      dateCreation: '2024-01-18',
      creerPar: 'Admin',
      derniereModification: '2024-03-21T09:30:00',
      ventesMois: 8,
      revenuMois: 600000,
      tendance: 'stable',
      dernierMouvement: '2024-02-10',
      statut: 'normal'
    },
    {
      id: 7,
      nom: 'Marteau Professionnel',
      reference: 'MART-PRO',
      categorie: 'Outillage',
      description: 'Marteau de charpentier, tête 500g. Manche en bois de hêtre.',
      stock: 12,
      stockInitial: 20,
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
      image: productImages[6],
      dateAjout: '2024-01-22',
      dateCreation: '2024-01-22',
      creerPar: 'Admin',
      derniereModification: '2024-03-19T14:45:00',
      ventesMois: 5,
      revenuMois: 125000,
      tendance: 'down',
      dernierMouvement: '2024-02-09',
      statut: 'normal'
    },
    {
      id: 8,
      nom: 'Clou 4cm',
      reference: 'CLOU-4CM',
      categorie: 'Quincaillerie',
      description: 'Clou à béton 4cm, paquet de 100. Acier trempé.',
      stock: 80,
      stockInitial: 150,
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
      estPerequitable: true,
      estFragile: false,
      instructionsSpeciales: '',
      delaiLivraison: '24h',
      image: productImages[7],
      dateAjout: '2024-01-08',
      dateCreation: '2024-01-08',
      creerPar: 'Manager',
      derniereModification: '2024-03-22T10:15:00',
      ventesMois: 25,
      revenuMois: 200000,
      tendance: 'up',
      dernierMouvement: '2024-02-11',
      statut: 'normal'
    }
  ], []);

  // États pour les données
  const [products, setProducts] = useState(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [categories] = useState([
    { id: '1', nom: 'Matériaux Construction', count: 12 },
    { id: '2', nom: 'Ferronnerie', count: 8 },
    { id: '3', nom: 'Quincaillerie', count: 15 },
    { id: '4', nom: 'Peinture', count: 6 },
    { id: '5', nom: 'Plomberie', count: 9 },
    { id: '6', nom: 'Électricité', count: 11 },
    { id: '7', nom: 'Outillage', count: 14 }
  ]);

  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  // Options pour les InputSelect
  const categoryOptions = useMemo(() => [
    { value: 'all', label: 'Toutes les catégories' },
    ...categories.map(cat => ({
      value: cat.nom,
      label: `${cat.nom} (${cat.count})`
    }))
  ], [categories]);

  const stockOptions = [
    { value: 'all', label: 'Tous les stocks' },
    { value: 'critical', label: 'Critique' },
    { value: 'warning', label: 'Faible' },
    { value: 'good', label: 'Bon' },
    { value: 'out', label: 'Rupture' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'stock-low', label: 'Stock (croissant)' },
    { value: 'stock-high', label: 'Stock (décroissant)' },
    { value: 'price-low', label: 'Prix (bas → haut)' },
    { value: 'price-high', label: 'Prix (haut → bas)' },
    { value: 'recent', label: 'Plus récent' }
  ];

  // Fonction pour ajouter un toast
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Fonction pour supprimer un toast
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Calcul des produits filtrés
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categorie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.fournisseur.toLowerCase().includes(searchTerm.toLowerCase())
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
        case 'recent':
          return new Date(b.dateAjout) - new Date(a.dateAjout);
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
    const turnoverRate = ((products.reduce((sum, p) => sum + p.stockInitial, 0) - 
                          products.reduce((sum, p) => sum + p.stock, 0)) / 
                          products.reduce((sum, p) => sum + p.stockInitial, 0) * 100).toFixed(1);

    return {
      totalProducts,
      totalStockValue,
      criticalStock,
      warningStock,
      outOfStock,
      retailProducts,
      turnoverRate
    };
  }, [products]);

  // Fonction de formatage de devise
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k`;
    }
    return `${amount}`;
  };

  // Fonction pour déterminer le statut du stock
  const getStockStatus = (product) => {
    if (product.stock === 0) return 'out';
    if (product.stock <= product.seuilMin) return 'critical';
    if (product.stock <= product.seuilMin * 2) return 'warning';
    return 'good';
  };

  const getStockStatusLabel = (status) => {
    const labels = {
      out: 'Rupture',
      critical: 'Critique',
      warning: 'Faible',
      good: 'Normal'
    };
    return labels[status];
  };

  // Gestion des événements
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleOpenDetailModal = (product) => {
    setSelectedProductForDetail(product);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProductForDetail(null);
  };

  const handleSaveProduct = (productData) => {
    if (modalMode === 'create') {
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id)) + 1,
        dateAjout: new Date().toISOString().split('T')[0],
        dernierMouvement: new Date().toISOString().split('T')[0],
        stockInitial: productData.stock,
        image: productData.image || productImages[Math.floor(Math.random() * productImages.length)]
      };
      setProducts([...products, newProduct]);
      addToast('Produit créé avec succès', 'success');
    } else {
      setProducts(products.map(p => 
        p.id === productData.id ? { ...p, ...productData } : p
      ));
      addToast('Produit modifié avec succès', 'success');
    }
    handleCloseModal();
  };

  const handleViewProduct = (product) => {
    handleOpenDetailModal(product);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      setProducts(products.filter(p => p.id !== product.id));
      addToast(`"${product.nom}" a été supprimé`, 'warning');
    }
  };

  // Fonction pour ajouter au panier
  const addToCart = (product, quantity = 1) => {
    // Créer un objet produit avec les informations nécessaires pour le panier
    const productForCart = {
      id: product.id,
      nom: product.nom,
      reference: product.reference,
      image: product.image,
      prixVente: product.prixVente,
      prixDetail: product.prixDetail || product.prixVente,
      unite: product.unite,
      uniteDetail: product.uniteDetail || product.unite,
      stock: product.stock,
      peutEtreVenduEnDetail: product.peutEtreVenduEnDetail || false,
      quantite: quantity,
      unit: product.unite // Unité par défaut
    };

    // Récupérer les paniers existants du localStorage
    const existingCarts = JSON.parse(localStorage.getItem('vendeurCarts') || '[]');
    
    // Trouver ou créer un panier en cours
    let targetCart = existingCarts.find(cart => cart.status === 'en_cours' && cart.items.length === 0);
    
    if (!targetCart) {
      // Si aucun panier vide, trouver un panier en cours avec des articles
      targetCart = existingCarts.find(cart => cart.status === 'en_cours');
    }
    
    if (targetCart) {
      // Ajouter au panier existant
      const existingItem = targetCart.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Mettre à jour la quantité si le produit existe déjà
        existingItem.quantite += quantity;
      } else {
        // Ajouter le nouveau produit
        targetCart.items.push(productForCart);
      }
      
      // Mettre à jour le total
      targetCart.total = targetCart.items.reduce((sum, item) => sum + (item.prixVente * item.quantite), 0);
      
      // Mettre à jour dans le tableau
      const updatedCarts = existingCarts.map(cart => 
        cart.id === targetCart.id ? targetCart : cart
      );
      
      // Sauvegarder dans localStorage
      localStorage.setItem('vendeurCarts', JSON.stringify(updatedCarts));
      
      // Afficher toast de succès
      addToast(`✓ "${product.nom}" ajouté au panier`, 'success');
      
    } else {
      // Créer un nouveau panier
      const newCart = {
        id: Date.now(),
        date: new Date().toISOString(),
        client: null,
        items: [productForCart],
        total: product.prixVente * quantity,
        status: 'en_cours'
      };
      
      // Ajouter le nouveau panier
      existingCarts.push(newCart);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('vendeurCarts', JSON.stringify(existingCarts));
      
      // Afficher toast de succès
      addToast(`✓ Nouveau panier créé avec "${product.nom}"`, 'success');
    }
    
    // Déclencher un événement personnalisé pour informer Navbar de mettre à jour le compteur
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { 
      detail: { timestamp: Date.now() } 
    });
    window.dispatchEvent(cartUpdatedEvent);
  };

  // Fonction pour la vente groupée (produits sélectionnés)
  const handleBulkSale = () => {
    if (selectedProducts.length === 0) return;
    
    // Récupérer les produits sélectionnés
    const productsToAdd = products.filter(p => selectedProducts.includes(p.id));
    
    if (productsToAdd.length === 0) return;
    
    // Récupérer les paniers existants du localStorage
    const existingCarts = JSON.parse(localStorage.getItem('vendeurCarts') || '[]');
    
    // Trouver ou créer un panier en cours
    let targetCart = existingCarts.find(cart => cart.status === 'en_cours');
    
    const itemsToAdd = productsToAdd.map(product => ({
      id: product.id,
      nom: product.nom,
      reference: product.reference,
      image: product.image,
      prixVente: product.prixVente,
      prixDetail: product.prixDetail || product.prixVente,
      unite: product.unite,
      uniteDetail: product.uniteDetail || product.unite,
      stock: product.stock,
      peutEtreVenduEnDetail: product.peutEtreVenduEnDetail || false,
      quantite: 1,
      unit: product.unite
    }));
    
    if (targetCart) {
      // Ajouter au panier existant
      itemsToAdd.forEach(newItem => {
        const existingItem = targetCart.items.find(item => item.id === newItem.id);
        
        if (existingItem) {
          existingItem.quantite += 1;
        } else {
          targetCart.items.push(newItem);
        }
      });
      
      // Mettre à jour le total
      targetCart.total = targetCart.items.reduce((sum, item) => sum + (item.prixVente * item.quantite), 0);
      
      // Mettre à jour dans le tableau
      const updatedCarts = existingCarts.map(cart => 
        cart.id === targetCart.id ? targetCart : cart
      );
      
      // Sauvegarder dans localStorage
      localStorage.setItem('vendeurCarts', JSON.stringify(updatedCarts));
      
      // Afficher toast de succès
      addToast(`✓ ${selectedProducts.length} produit(s) ajouté(s) au panier`, 'success');
      
    } else {
      // Créer un nouveau panier
      const newCart = {
        id: Date.now(),
        date: new Date().toISOString(),
        client: null,
        items: itemsToAdd,
        total: itemsToAdd.reduce((sum, item) => sum + (item.prixVente * item.quantite), 0),
        status: 'en_cours'
      };
      
      // Ajouter le nouveau panier
      existingCarts.push(newCart);
      
      // Sauvegarder dans localStorage
      localStorage.setItem('vendeurCarts', JSON.stringify(existingCarts));
      
      // Afficher toast de succès
      addToast(`✓ Nouveau panier créé avec ${selectedProducts.length} produit(s)`, 'success');
    }
    
    // Réinitialiser la sélection
    setSelectedProducts([]);
    
    // Déclencher un événement personnalisé pour informer Navbar
    const cartUpdatedEvent = new CustomEvent('cartUpdated', { 
      detail: { timestamp: Date.now() } 
    });
    window.dispatchEvent(cartUpdatedEvent);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`Supprimer ${selectedProducts.length} produit(s) ?`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      addToast(`${selectedProducts.length} produit(s) supprimé(s)`, 'warning');
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
    a.download = `produits-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast('Export réussi', 'success');
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

  const handleDuplicate = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1,
      nom: `${product.nom} (copie)`,
      reference: `${product.reference}-COPY`,
      stock: 0
    };
    setProducts([...products, newProduct]);
    addToast(`"${product.nom}" dupliqué avec succès`, 'success');
  };

  // Rendu en mode grille
  const renderGridView = () => (
    <div className={styles.productsGrid}>
      {filteredProducts.map(product => {
        const stockStatus = getStockStatus(product);
        return (
          <div key={product.id} className={`${styles.productCard} ${styles[stockStatus]}`}>
            <div className={styles.productCardHeader}>
              <div className={styles.productImageWrapper}>
                <img src={product.image} alt={product.nom} className={styles.productImage} />
                {product.peutEtreVenduEnDetail && (
                  <span className={styles.detailBadge} title="Vente au détail">
                    <TbDiscount />
                  </span>
                )}
              </div>
              
              <div className={styles.productQuickActions}>
                <button 
                  className={`${styles.quickActionBtn} ${styles.viewBtn}`}
                  onClick={() => handleViewProduct(product)}
                  title="Voir détails"
                >
                  <IoEyeOutline />
                </button>
                <button 
                  className={`${styles.quickActionBtn} ${styles.cartBtn}`}
                  onClick={() => addToCart(product, 1)}
                  title="Ajouter au panier"
                >
                  <IoCartOutline />
                </button>
              </div>
            </div>

            <div className={styles.productCardBody}>
              <div className={styles.productTitleSection}>
                <h3 className={styles.productName} title={product.nom}>
                  {product.nom}
                </h3>
                <div className={styles.productRef} title={product.reference}>
                  <FaBarcode size={10} />
                  <span>{product.reference}</span>
                </div>
              </div>

              <div className={styles.productMetaGrid}>
                <div className={styles.metaItem} title={product.categorie}>
                  <TbCategory size={12} />
                  <span>{product.categorie}</span>
                </div>
                <div className={styles.metaItem} title={product.emplacement}>
                  <TbBuildingWarehouse size={12} />
                  <span>{product.emplacement}</span>
                </div>
              </div>

              <div className={styles.productStockSection}>
                <div className={styles.stockHeader}>
                  <span className={styles.stockLabel}>Stock</span>
                  <span className={`${styles.stockValue} ${styles[stockStatus]}`}>
                    {product.stock} {product.unite}
                  </span>
                </div>
                <div className={styles.stockBar}>
                  <div 
                    className={`${styles.stockBarFill} ${styles[stockStatus]}`}
                    style={{ width: `${Math.min((product.stock / product.stockInitial) * 100, 100)}%` }}
                  />
                </div>
                <span className={`${styles.stockStatusBadge} ${styles[stockStatus]}`}>
                  {getStockStatusLabel(stockStatus)}
                </span>
              </div>

              <div className={styles.productPriceSection}>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Achat</span>
                  <span className={styles.priceValue}>{formatCurrency(product.prixAchat)}</span>
                </div>
                <div className={styles.priceDivider}>→</div>
                <div className={styles.priceItem}>
                  <span className={styles.priceLabel}>Vente</span>
                  <span className={`${styles.priceValue} ${styles.sellingPrice}`}>
                    {formatCurrency(product.prixVente)}
                  </span>
                </div>
              </div>

              <div className={styles.productSupplier} title={product.fournisseur}>
                <FaTruck size={10} />
                <span>{product.fournisseur}</span>
              </div>
            </div>

            <div className={styles.productCardFooter}>
              <button 
                className={styles.footerActionBtn}
                onClick={() => handleOpenEditModal(product)}
                title="Modifier"
              >
                <IoPencilOutline />
                <span>Modifier</span>
              </button>
              <button 
                className={`${styles.footerActionBtn} ${styles.duplicateBtn}`}
                onClick={() => handleDuplicate(product)}
                title="Dupliquer"
              >
                <IoDuplicateOutline />
                <span>Dupliquer</span>
              </button>
              <button 
                className={`${styles.footerActionBtn} ${styles.deleteBtn}`}
                onClick={() => handleDeleteProduct(product)}
                title="Supprimer"
              >
                <IoTrashOutline />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Rendu en mode liste
  const renderListView = () => (
    <div className={styles.tableContainer}>
      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th className={styles.checkboxCell}>
              <input 
                type="checkbox" 
                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                onChange={handleSelectAll}
              />
            </th>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Stock</th>
            <th>Emplacement</th>
            <th>Prix Achat</th>
            <th>Prix Vente</th>
            <th>Fournisseur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => {
            const stockStatus = getStockStatus(product);
            return (
              <tr key={product.id} className={styles[stockStatus]}>
                <td className={styles.checkboxCell}>
                  <input 
                    type="checkbox" 
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                  />
                </td>
                
                <td>
                  <div className={styles.tableProductInfo}>
                    <div className={styles.tableProductImage}>
                      <img src={product.image} alt={product.nom} />
                      {product.peutEtreVenduEnDetail && (
                        <span className={styles.tableDetailBadge} title="Vente au détail">
                          <TbDiscount size={8} />
                        </span>
                      )}
                    </div>
                    <div className={styles.tableProductDetails}>
                      <span className={styles.tableProductName} title={product.nom}>
                        {product.nom}
                      </span>
                      <span className={styles.tableProductRef} title={product.reference}>
                        <FaBarcode size={8} /> {product.reference}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={styles.tableCategory} title={product.categorie}>
                    <TbCategory size={12} />
                    <span>{product.categorie}</span>
                  </div>
                </td>

                <td>
                  <div className={`${styles.tableStock} ${styles[stockStatus]}`}>
                    <span className={styles.tableStockValue}>
                      {product.stock} {product.unite}
                    </span>
                    <span className={`${styles.tableStockBadge} ${styles[stockStatus]}`}>
                      {getStockStatusLabel(stockStatus)}
                    </span>
                  </div>
                </td>

                <td>
                  <div className={styles.tableLocation} title={product.emplacement}>
                    <TbBuildingWarehouse size={12} />
                    <span>{product.emplacement}</span>
                  </div>
                </td>

                <td>
                  <span className={styles.tablePrice}>
                    {formatCurrency(product.prixAchat)} Ar
                  </span>
                </td>

                <td>
                  <span className={`${styles.tablePrice} ${styles.sellingPrice}`}>
                    {formatCurrency(product.prixVente)} Ar
                  </span>
                </td>

                <td>
                  <div className={styles.tableSupplier} title={product.fournisseur}>
                    <FaTruck size={10} />
                    <span>{product.fournisseur}</span>
                  </div>
                </td>

                <td>
                  <div className={styles.tableActions}>
                    <button 
                      className={styles.tableActionBtn}
                      onClick={() => handleViewProduct(product)}
                      title="Voir détails"
                    >
                      <IoEyeOutline />
                    </button>
                    <button 
                      className={styles.tableActionBtn}
                      onClick={() => handleOpenEditModal(product)}
                      title="Modifier"
                    >
                      <IoPencilOutline />
                    </button>
                    <button 
                      className={styles.tableActionBtn}
                      onClick={() => addToCart(product, 1)}
                      title="Ajouter au panier"
                    >
                      <IoCartOutline />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.dashboardModern}>
      {/* Conteneur des toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={3000}
            position="top-right"
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* En-tête avec titre et actions principales */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <div className={styles.pageIcon}>
            <FaBox />
          </div>
          <div className={styles.pageTitle}>
            <h1>Gestion des Produits</h1>
            <p className={styles.pageSubtitle}>
              <span>{stats.totalProducts} produits</span>
              <span className={styles.subtitleDot}>•</span>
              <span className={styles.criticalCount}>{stats.criticalStock} critique</span>
              <span className={styles.subtitleDot}>•</span>
              <span>{formatCurrency(stats.totalStockValue)} Ar valeur</span>
            </p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <Button 
            variant="outline"
            size="medium"
            icon="download"
            onClick={handleExport}
          >
            Exporter
          </Button>
          <Button 
            variant="primary"
            size="medium"
            icon="add"
            onClick={handleOpenCreateModal}
          >
            Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Barre de recherche et contrôles */}
      <div className={styles.controlsBar}>
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <Input
              type="text"
              placeholder="Rechercher par nom, référence, catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              name="productSearch"
              icon={<IoSearchOutline />}
            />
            {searchTerm && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchTerm('')}
              >
                <IoCloseOutline />
              </button>
            )}
          </div>

          <div className={styles.viewControls}>
            <button 
              className={`${styles.viewModeBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vue grille"
            >
              <IoGridOutline />
            </button>
            <button 
              className={`${styles.viewModeBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="Vue liste"
            >
              <IoListOutline />
            </button>
          </div>

          <button 
            className={`${styles.filterBtn} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <IoFilterOutline />
            <span>Filtres</span>
            {(selectedCategory !== 'all' || stockFilter !== 'all') && (
              <span className={styles.filterBadge}>
                {selectedCategory !== 'all' && stockFilter !== 'all' ? 2 : 1}
              </span>
            )}
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filtersRow}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <TbCategory />
                  Catégorie
                </label>
                <InputSelect
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value)}
                  options={categoryOptions}
                  placeholder="Sélectionner une catégorie"
                  fullWidth
                  size="small"
                  variant="outline"
                  clearable
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <FaWarehouse />
                  État du stock
                </label>
                <InputSelect
                  value={stockFilter}
                  onChange={(value) => setStockFilter(value)}
                  options={stockOptions}
                  placeholder="Filtrer par stock"
                  fullWidth
                  size="small"
                  variant="outline"
                  clearable
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  <TbArrowsSort />
                  Trier par
                </label>
                <InputSelect
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  options={sortOptions}
                  placeholder="Trier par"
                  fullWidth
                  size="small"
                  variant="outline"
                />
              </div>

              <div className={styles.filterActions}>
                <Button 
                  variant="outline"
                  size="small"
                  onClick={handleViewCritical}
                >
                  Stock critique
                </Button>
                <Button 
                  variant="outline"
                  size="small"
                  onClick={handleResetFilters}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions groupées */}
      {selectedProducts.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            <FaCheckCircle className={styles.bulkIcon} />
            <span>{selectedProducts.length} produit(s) sélectionné(s)</span>
          </div>
          <div className={styles.bulkButtons}>
            <Button 
              variant="outline"
              size="small"
              onClick={handleBulkSale}
            >
              Ajouter au panier
            </Button>
            <Button 
              variant="danger"
              size="small"
              onClick={handleBulkDelete}
            >
              Supprimer
            </Button>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      <div className={styles.productsContainer}>
        <div className={styles.productsWrapper}>
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <div className={styles.noResults}>
              <FaBox className={styles.noResultsIcon} />
              <h3>Aucun produit trouvé</h3>
              <p>Aucun produit ne correspond à vos critères de recherche.</p>
              <Button 
                variant="primary"
                size="medium"
                onClick={handleResetFilters}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className={styles.quickActionsBar}>
        <div className={styles.quickActionItem}>
          <div className={`${styles.quickActionIcon} ${styles.warning}`}>
            <IoWarningOutline />
          </div>
          <div className={styles.quickActionContent}>
            <h4>{stats.criticalStock} produits en stock critique</h4>
            <p>Nécessite un réapprovisionnement urgent</p>
          </div>
          <Button 
            variant="warning"
            size="medium"
            onClick={handleViewCritical}
          >
            Voir
          </Button>
        </div>
        
        <div className={styles.quickActionItem}>
          <div className={`${styles.quickActionIcon} ${styles.accent}`}>
            <FaTags />
          </div>
          <div className={styles.quickActionContent}>
            <h4>{stats.retailProducts} produits vendables au détail</h4>
            <p>Configuration de prix détail disponible</p>
          </div>
          <Button 
            variant="secondary"
            size="medium"
            onClick={handleOpenCreateModal}
          >
            Ajouter
          </Button>
        </div>
      </div>

      {/* Modal Formulaire Produit */}
      {showProductModal && (
        <FrmProduits
          isOpen={showProductModal}
          onClose={handleCloseModal}
          onSave={handleSaveProduct}
          mode={modalMode}
          productData={editingProduct}
        />
      )}

      {/* Modal Détails Produit */}
      {showDetailModal && selectedProductForDetail && (
        <DetailProduits
          isOpen={showDetailModal}
          onClose={handleCloseDetailModal}
          product={selectedProductForDetail}
          onEdit={handleOpenEditModal}
        />
      )}
    </div>
  );
};

export default Produits;