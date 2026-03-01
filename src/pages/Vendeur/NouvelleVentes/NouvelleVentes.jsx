import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './NouvelleVentes.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import {
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoBarcodeOutline,
  IoWarningOutline,
  IoWalletOutline,
} from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import {
  FaBox,
  FaTruck,
  FaWarehouse
} from "react-icons/fa";
import {
  TbBuildingWarehouse,
  TbCategory,
  TbCurrencyDollar,
} from "react-icons/tb";
import {
  MdOutlineShoppingCart
} from "react-icons/md";
import { GiShoppingCart } from "react-icons/gi";

// Import du nouveau modal
import InvoiceModal from './InvoiceModal';

// Images d'exemple pour les produits
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
];

// Données mock
const mockProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    stock: 15,
    seuilMin: 20,
    prixAchat: 35000,
    prixVente: 50000,
    prixDetail: 1000,
    unite: 'sac',
    uniteDetail: 'kg',
    peutEtreVenduEnDetail: true,
    image: productImages[0],
    emplacement: 'Entrepôt A',
    fournisseur: 'Lafarge',
    codeBarre: '123456789012',
    tva: 20,
    dateAjout: '2024-01-15'
  },
  {
    id: 2,
    nom: 'Tôle Galvanisée 3m',
    reference: 'TOL-GALV-3M',
    categorie: 'Ferronnerie',
    stock: 8,
    seuilMin: 10,
    prixAchat: 250000,
    prixVente: 300000,
    unite: 'feuille',
    peutEtreVenduEnDetail: false,
    image: productImages[1],
    emplacement: 'Entrepôt B',
    fournisseur: 'MetalPro',
    codeBarre: '234567890123',
    tva: 20,
    dateAjout: '2024-02-10'
  },
  {
    id: 3,
    nom: 'Vis à Bois 5x50',
    reference: 'VIS-BOIS-5x50',
    categorie: 'Quincaillerie',
    stock: 1200,
    seuilMin: 500,
    prixAchat: 150,
    prixVente: 250,
    prixDetail: 10,
    unite: 'pièce',
    uniteDetail: 'pièce',
    peutEtreVenduEnDetail: true,
    image: productImages[2],
    emplacement: 'Rayon 2',
    fournisseur: 'Bricolux',
    codeBarre: '345678901234',
    tva: 20,
    dateAjout: '2024-01-20'
  },
  {
    id: 4,
    nom: 'Peinture Blanche 10L',
    reference: 'PEINT-BLANC-10L',
    categorie: 'Peinture',
    stock: 5,
    seuilMin: 15,
    prixAchat: 80000,
    prixVente: 120000,
    prixDetail: 12000,
    unite: 'pot',
    uniteDetail: 'L',
    peutEtreVenduEnDetail: true,
    image: productImages[3],
    emplacement: 'Rayon 4',
    fournisseur: 'Dulux',
    codeBarre: '456789012345',
    tva: 20,
    dateAjout: '2024-03-01'
  },
  {
    id: 5,
    nom: 'Clou 10cm',
    reference: 'CLOU-10CM',
    categorie: 'Quincaillerie',
    stock: 2000,
    seuilMin: 500,
    prixAchat: 50,
    prixVente: 100,
    prixDetail: 5,
    unite: 'kg',
    uniteDetail: 'pièce',
    peutEtreVenduEnDetail: true,
    image: productImages[4],
    emplacement: 'Rayon 3',
    fournisseur: 'MetalPro',
    codeBarre: '567890123456',
    tva: 20,
    dateAjout: '2024-02-15'
  },
  {
    id: 6,
    nom: 'Sable Fin 25kg',
    reference: 'SABLE-FIN-25KG',
    categorie: 'Matériaux Construction',
    stock: 30,
    seuilMin: 20,
    prixAchat: 8000,
    prixVente: 12000,
    prixDetail: 500,
    unite: 'sac',
    uniteDetail: 'kg',
    peutEtreVenduEnDetail: true,
    image: productImages[5],
    emplacement: 'Entrepôt A',
    fournisseur: 'Carrière Pro',
    codeBarre: '678901234567',
    tva: 20,
    dateAjout: '2024-01-25'
  },
  {
    id: 7,
    nom: 'Marteau Professionnel',
    reference: 'MART-PRO',
    categorie: 'Outillage',
    stock: 12,
    seuilMin: 10,
    prixAchat: 45000,
    prixVente: 65000,
    unite: 'pièce',
    peutEtreVenduEnDetail: false,
    image: productImages[6],
    emplacement: 'Rayon 1',
    fournisseur: 'ToolsPro',
    codeBarre: '789012345678',
    tva: 20,
    dateAjout: '2024-02-28'
  },
  {
    id: 8,
    nom: 'Gravier 20mm 50kg',
    reference: 'GRAVIER-20MM-50KG',
    categorie: 'Matériaux Construction',
    stock: 18,
    seuilMin: 25,
    prixAchat: 12000,
    prixVente: 18000,
    prixDetail: 400,
    unite: 'sac',
    uniteDetail: 'kg',
    peutEtreVenduEnDetail: true,
    image: productImages[7],
    emplacement: 'Entrepôt B',
    fournisseur: 'Carrière Pro',
    codeBarre: '890123456789',
    tva: 20,
    dateAjout: '2024-03-05'
  }
];

// Données mock pour historique
const initialHistoriqueVentes = [
  {
    id: 1,
    numero: 'FAC-2024-00158',
    client: 'SARL Batiment Plus',
    montant: 1250000,
    date: '2024-03-15 14:30',
    statut: 'paye',
    livraison: 'livre',
    items: 12,
    vendeur: 'Admin',
    paiement: 'espèces'
  },
  {
    id: 2,
    numero: 'FAC-2024-00157',
    client: 'Mr. Rakoto Jean',
    montant: 380000,
    date: '2024-03-14 11:20',
    statut: 'credit',
    livraison: 'non_livre',
    items: 3,
    vendeur: 'Admin',
    paiement: 'crédit'
  },
  {
    id: 3,
    numero: 'FAC-2024-00156',
    client: 'Entreprise Construction Pro',
    montant: 2450000,
    date: '2024-03-14 09:45',
    statut: 'paye',
    livraison: 'livre',
    items: 25,
    vendeur: 'Vendeur1',
    paiement: 'virement'
  },
  {
    id: 4,
    numero: 'FAC-2024-00155',
    client: 'Entreprise Construction Pro',
    montant: 845000,
    date: '2024-03-13 16:15',
    statut: 'paye',
    livraison: 'livre',
    items: 8,
    vendeur: 'Vendeur2',
    paiement: 'mvola'
  },
  {
    id: 5,
    numero: 'FAC-2024-00154',
    client: 'Mr. Andriana',
    montant: 152000,
    date: '2024-03-12 10:30',
    statut: 'credit',
    livraison: 'non_livre',
    items: 2,
    vendeur: 'Admin',
    paiement: 'crédit'
  }
];

// Composant de produit en vue grille compacte
const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState(product.unite);

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      quantity: unit === product.unite ? quantity : 1,
      unit,
      price: unit === product.unite ? product.prixVente : product.prixDetail
    };
    onAddToCart(itemToAdd);
    setQuantity(1);
    setUnit(product.unite);
  };

  const calculatePrice = () => {
    if (unit === product.unite) {
      return product.prixVente * quantity;
    } else {
      return product.prixDetail * quantity;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, Math.min(product.stock, value)));
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className={styles.productCardCompact}>
      <div className={styles.productCardImageCompact}>
        <img src={product.image} alt={product.nom} />
        {product.stock <= product.seuilMin && (
          <div className={styles.stockWarningCompact}>
            <IoWarningOutline />
          </div>
        )}
        <div className={styles.cardBadgeCompact}>
          {product.categorie.split(' ')[0]}
        </div>
      </div>

      <div className={styles.productCardContentCompact}>
        <div className={styles.cardHeaderCompact}>
          <h4 className={styles.productCardNameCompact}>{product.nom}</h4>
        </div>

        {product.peutEtreVenduEnDetail ? (
          <div className={styles.unitSelectorCompactContainer}>
            <div className={styles.unitSelectorCompact}>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className={styles.unitSelectCompact}
                aria-label="Sélectionner l'unité"
              >
                <option value={product.unite}>{product.unite} ({formatCurrency(product.prixVente)})</option>
                <option value={product.uniteDetail}>{product.uniteDetail} ({formatCurrency(product.prixDetail)})</option>
              </select>
            </div>
            <Button
              variant="primary"
              size="small"
              icon="plus"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              aria-label={`Ajouter ${product.nom} au panier`}
            />
          </div>
        ) : (
          <div className={styles.unitSelectorCompactContainer}>
            <div className={styles.unitSelectorCompact}></div>
            <Button
              variant="primary"
              size="small"
              icon="plus"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              aria-label={`Ajouter ${product.nom} au panier`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Composant d'élément du panier
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    return item.price * item.quantity;
  };

  const incrementQuantity = () => {
    if (item.quantity < item.stock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    onUpdateQuantity(item.id, Math.max(1, Math.min(item.stock, value)));
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemImage}>
        <img src={item.image} alt={item.nom} />
        <div className={styles.cartItemQuantity}>
          {item.quantity}
        </div>
      </div>

      <Button
        variant="ghost"
        size="small"
        icon="trash"
        onClick={() => onRemove(item.id)}
        aria-label="Supprimer du panier"
        className={styles.removeButton}
      />

      <div className={styles.cartItemContent}>
        <div className={styles.cartItemHeader}>
          <div className={styles.cartItemInfo}>
            <h5 className={styles.cartItemTitle}>{item.nom}</h5>
            <span className={styles.cartItemUnit}>{item.unit}</span>
          </div>
        </div>

        <div className={styles.cartItemDetails}>
          <div className={styles.quantityControls}>
            <div className={styles.quantityButtons}>
              <Button
                variant="ghost"
                size="small"
                icon="minus"
                onClick={decrementQuantity}
                disabled={item.quantity <= 1}
                aria-label="Diminuer la quantité"
                className={styles.quantityButton}
              />
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={handleQuantityChange}
                className={styles.quantityInput}
                aria-label="Quantité"
              />
              <Button
                variant="ghost"
                size="small"
                icon="plus"
                onClick={incrementQuantity}
                disabled={item.quantity >= item.stock}
                aria-label="Augmenter la quantité"
                className={styles.quantityButton}
              />
            </div>
            <div className={styles.stockInfo}>
              Stock: {item.stock} {item.unit}
            </div>
          </div>

          <div className={styles.priceInfo}>
            <div className={styles.unitPrice}>
              {formatCurrency(item.price)}/{item.unit}
            </div>
            <div className={styles.totalPrice}>
              {formatCurrency(calculateTotal())}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant d'historique des ventes
const VenteHistoryItem = ({ vente }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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

  return (
    <div className={styles.historyItem}>
      <div className={styles.historyItemHeader}>
        <div className={styles.historyMainInfo}>
          <div className={styles.historyNumber}>{vente.numero}</div>
          <div className={styles.historyClient}>{vente.client}</div>
        </div>

        <div className={styles.historyStatusInfo}>
          <span className={`${styles.statusBadge} ${styles[vente.statut]}`}>
            {vente.statut === 'paye' && <IoCheckmarkCircleOutline />}
            {vente.statut === 'credit' && <IoAlertCircleOutline />}
            <span className={styles.statusText}>{vente.statut}</span>
          </span>
          <span className={`${styles.deliveryBadge} ${styles[vente.livraison]}`}>
            {vente.livraison === 'livre' && <FaTruck />}
            {vente.livraison === 'non_livre' && <IoTimeOutline />}
            <span className={styles.deliveryText}>{vente.livraison}</span>
          </span>
        </div>
      </div>

      <div className={styles.historyItemDetails}>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Montant:</div>
            <div className={styles.detailValue}>{formatCurrency(vente.montant)}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Articles:</div>
            <div className={styles.detailValue}>{vente.items} produits</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Paiement:</div>
            <div className={styles.detailValue}>{vente.paiement}</div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>Vendeur:</div>
            <div className={styles.detailValue}>{vente.vendeur}</div>
          </div>
        </div>

        <div className={styles.historyMeta}>
          <div className={styles.historyDate}>
            <IoCalendarOutline />
            <span>{formatDate(vente.date)}</span>
          </div>
          <div className={styles.historyActions}>
            <Button
              variant="outline"
              size="small"
              icon="eye"
              className={`${styles.historyActionBtn} ${styles.viewBtn}`}
            >
              <span className={styles.actionText}>Voir</span>
            </Button>
            <Button
              variant="outline"
              size="small"
              icon="print"
              className={`${styles.historyActionBtn} ${styles.printBtn}`}
            >
              <span className={styles.actionText}>Imprimer</span>
            </Button>
            {vente.statut === 'credit' && (
              <Button
                variant="outline"
                size="small"
                icon="wallet"
                className={`${styles.historyActionBtn} ${styles.creditBtn}`}
              >
                <span className={styles.actionText}>Payer</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NouvelleVentes = () => {
  // États principaux
  const [products] = useState(mockProducts);
  const [historiqueVentes, setHistoriqueVentes] = useState(initialHistoriqueVentes);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('vente'); // Initialiser avec 'vente'

  // États pour le panier
  const [cart, setCart] = useState([]);

  // États pour les modals
  const [showInvoice, setShowInvoice] = useState(false);

  // Récupérer les paramètres d'URL
  const [searchParams] = useSearchParams();

  // Utiliser une fonction pour déterminer la vue initiale basée sur l'URL
  // sans appeler setState dans un effet
  const initialViewMode = useMemo(() => {
    const viewParam = searchParams.get('view');
    return viewParam === 'history' ? 'history' : 'vente';
  }, [searchParams]);

  // Initialiser viewMode avec la valeur calculée
  useState(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  // Fonction de formatage de devise
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Gestionnaire de changement de vue avec navigation
  const handleViewChange = (newView) => {
    setViewMode(newView);
    // Mettre à jour l'URL sans rechargement
    const url = new URL(window.location.href);
    if (newView === 'history') {
      url.searchParams.set('view', 'history');
    } else {
      url.searchParams.delete('view');
    }
    window.history.replaceState({}, '', url);
  };

  // Filtrage et tri des produits
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

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'nom' || sortBy === 'categorie' || sortBy === 'reference') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Calcul des statistiques
  const cartStats = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalProducts = cart.length;

    return { subtotal, totalItems, totalProducts };
  }, [cart]);

  const salesStats = useMemo(() => {
    const today = new Date().toLocaleDateString('fr-FR');
    const todaySales = historiqueVentes.filter(v =>
      new Date(v.date).toLocaleDateString('fr-FR') === today
    );

    const totalToday = todaySales.reduce((sum, v) => sum + v.montant, 0);
    const creditSales = historiqueVentes.filter(v => v.statut === 'credit');
    const totalCredit = creditSales.reduce((sum, v) => sum + v.montant, 0);

    return {
      todaySales: todaySales.length,
      totalToday,
      creditSales: creditSales.length,
      totalCredit
    };
  }, [historiqueVentes]);

  // Gestion du panier
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item =>
      item.id === product.id && item.unit === product.unit
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + product.quantity;
      if (newQuantity > product.stock) {
        alert(`Stock insuffisant! Il reste ${product.stock - existingItem.quantity} ${product.unit} disponibles.`);
        return;
      }

      setCart(cart.map(item =>
        item.id === product.id && item.unit === product.unit
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else {
      if (product.quantity > product.stock) {
        alert(`Stock insuffisant! Il reste ${product.stock} ${product.unit} disponibles.`);
        return;
      }

      setCart([...cart, product]);
    }
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    const product = cart.find(item => item.id === productId);

    if (newQuantity > product.stock) {
      alert(`Stock insuffisant! Maximum ${product.stock} ${product.unit} disponibles.`);
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    if (cart.length > 0 && window.confirm('Vider tout le panier ?')) {
      setCart([]);
    }
  };

  // Gestion des ventes
  const handleCompleteSale = useCallback((invoiceData) => {
    console.log('Vente complétée:', invoiceData);

    // Créer la nouvelle vente pour l'historique
    const newVente = {
      id: Date.now(),
      numero: invoiceData.numero,
      client: invoiceData.client.nom,
      montant: invoiceData.grandTotal,
      date: new Date().toLocaleString('fr-FR'),
      statut: invoiceData.paymentMethod === 'credit' ? 'credit' : 'paye',
      livraison: 'non_livre', // Valeur par défaut
      items: invoiceData.items.length,
      vendeur: 'Admin',
      paiement: invoiceData.paymentMethod,
      clientDetails: {
        telephone: invoiceData.client.telephone,
        adresse: invoiceData.client.adresse
      }
    };

    // Ajouter à l'historique
    setHistoriqueVentes(prev => [newVente, ...prev]);

    // Mettre à jour le stock des produits (note: ceci est une simulation, en production ce serait via API)
    invoiceData.items.forEach(cartItem => {
      const productIndex = mockProducts.findIndex(p => p.id === cartItem.id);
      if (productIndex !== -1) {
        mockProducts[productIndex].stock = Math.max(0, mockProducts[productIndex].stock - cartItem.quantity);
      }
    });

    // Afficher notification
    const paymentLabels = {
      'espèces': 'Espèces',
      'virement': 'Virement',
      'mvola': 'MVola',
      'airtelmoney': 'AirtelMoney',
      'orangemoney': 'OrangeMoney',
      'credit': 'Crédit'
    };

    const successMessage = `✅ Vente enregistrée avec succès !
    
Numéro facture: ${invoiceData.numero}
Client: ${invoiceData.client.nom}
Montant total: ${formatCurrency(invoiceData.grandTotal)}
Mode de paiement: ${paymentLabels[invoiceData.paymentMethod] || invoiceData.paymentMethod}`;

    alert(successMessage);

    // Vider le panier et fermer le modal
    setCart([]);
    setShowInvoice(false);
    handleViewChange('history');

  }, [formatCurrency]);

  // Catégories uniques
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.categorie))];
    return ['all', ...uniqueCats];
  }, [products]);

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('nom');
    setSortOrder('asc');
  };

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.splitScreenContainer}>
        {/* Colonne gauche - Contenu principal */}
        <div className={styles.productsListColumn}>
          <div className={styles.productsListHeader}>
            {/* Navigation tabs dans l'en-tête */}
            <div className={styles.navigationTabsInline}>
              <Button
                variant={viewMode === 'vente' ? 'primary' : 'ghost'}
                size="medium"
                icon="pointOfSale"
                onClick={() => handleViewChange('vente')}
                className={`${styles.tabBtnInline} ${viewMode === 'vente' ? styles.active : ''}`}
              >
                Point de Vente
              </Button>
              <Button
                variant={viewMode === 'history' ? 'primary' : 'ghost'}
                size="medium"
                icon="receipt"
                onClick={() => handleViewChange('history')}
                className={`${styles.tabBtnInline} ${viewMode === 'history' ? styles.active : ''}`}
              >
                Historique
              </Button>
              <Button
                variant={viewMode === 'stats' ? 'primary' : 'ghost'}
                size="medium"
                icon="chart"
                onClick={() => handleViewChange('stats')}
                className={`${styles.tabBtnInline} ${viewMode === 'stats' ? styles.active : ''}`}
              >
                Statistiques
              </Button>
            </div>

            {/* Filtres selon la vue */}
            {viewMode === 'vente' && (
              <div className={styles.venteFilters}>
                <Input
                  type="text"
                  placeholder="Rechercher produit, référence, catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  name="productSearch"
                  className={styles.searchInput}
                  icon={<IoSearchOutline />}
                />
                <InputSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={[
                    { value: 'all', label: 'Toutes catégories' },
                    ...categories.filter(cat => cat !== 'all').map(cat => ({
                      value: cat,
                      label: cat
                    }))
                  ]}
                  placeholder="Catégorie"
                  variant="outline"
                  icon={<TbCategory />}
                  fullWidth
                />
                <InputSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: 'nom', label: 'Nom' },
                    { value: 'prixVente', label: 'Prix' },
                    { value: 'categorie', label: 'Catégorie' },
                    { value: 'stock', label: 'Stock' }
                  ]}
                  placeholder="Trier par"
                  variant="outline"
                  fullWidth
                />
                <Button
                  variant="outline"
                  size="medium"
                  icon="refresh"
                  onClick={handleResetFilters}
                  className={styles.resetBtn}
                />
              </div>
            )}

            {viewMode === 'history' && (
              <div className={styles.venteFilters}>
                <Input
                  type="text"
                  placeholder="Filtrer par client, numéro..."
                  className={styles.searchInput}
                  name="historyFilter"
                  icon={<IoFilterOutline />}
                />
                <Input
                  type="date"
                  className={styles.searchInput}
                  name="historyDate"
                  icon={<IoCalendarOutline />}
                />
              </div>
            )}
          </div>

          {/* Contenu selon la vue */}
          <div className={styles.productsListContainer}>
            <div className={styles.productsListScroll}>
              {/* Vue Point de Vente */}
              {viewMode === 'vente' && (
                <>
                  <div className={styles.productsGridCompact}>
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className={styles.noProducts}>
                      <FaBox className={styles.noProductsIcon} />
                      <h3>Aucun produit trouvé</h3>
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
                </>
              )}

              {/* Vue Historique */}
              {viewMode === 'history' && (
                <div className={styles.historyViewContainer}>
                  <div className={styles.historyList}>
                    {historiqueVentes.map((vente) => (
                      <VenteHistoryItem
                        key={vente.id}
                        vente={vente}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Vue Statistiques */}
              {viewMode === 'stats' && (
                <div className={styles.statsViewContainer}>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.primary}`}>
                        <TbCurrencyDollar />
                      </div>
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{formatCurrency(salesStats.totalToday)}</span>
                        <span className={styles.statLabel}>Chiffre d'affaires aujourd'hui</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.success}`}>
                        <IoCheckmarkCircleOutline />
                      </div>
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{salesStats.todaySales}</span>
                        <span className={styles.statLabel}>Ventes du jour</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.warning}`}>
                        <IoWalletOutline />
                      </div>
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{salesStats.creditSales}</span>
                        <span className={styles.statLabel}>Ventes à crédit</span>
                      </div>
                    </div>

                    <div className={styles.statCard}>
                      <div className={`${styles.statIconWrapper} ${styles.danger}`}>
                        <IoAlertCircleOutline />
                      </div>
                      <div className={styles.statContent}>
                        <span className={styles.statValue}>{formatCurrency(salesStats.totalCredit)}</span>
                        <span className={styles.statLabel}>Total crédit en cours</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.statsFooter}>
                    <Button
                      variant="outline"
                      size="medium"
                      icon="download"
                      className={styles.exportBtn}
                    >
                      Exporter les statistiques
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - Panier (toujours visible) */}
        <div className={styles.cartColumn}>
          <div className={styles.cartHeader}>
            <div className={styles.cartTitle}>
              <div>
                <h2><GiShoppingCart /> Panier</h2>
                <p className={styles.cartSubtitle}>
                  {cartStats.totalProducts} produits • {cartStats.totalItems} unités
                </p>
              </div>
            </div>

            <div className={styles.cartTotal}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>{formatCurrency(cartStats.subtotal)}</span>
            </div>
          </div>

          <div className={styles.cartContainer}>
            <div className={styles.cartScroll}>
              {cart.length > 0 ? (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item, index) => (
                      <CartItem
                        key={`${item.id}-${item.unit}-${index}`}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveFromCart}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.emptyCart}>
                  <MdOutlineShoppingCart className={styles.emptyCartIcon} />
                  <h3>Panier vide</h3>
                  <p>Ajoutez des produits depuis la liste</p>
                </div>
              )}
            </div>

            {/* Actions fixes en bas du panier */}
            <div className={styles.cartActions}>
              <Button
                variant="outline"
                size="medium"
                icon="trash"
                onClick={handleClearCart}
                disabled={cart.length === 0}
                className={`${styles.cartActionBtn} ${styles.clearBtn}`}
                fullWidth
              >
                Vider panier
              </Button>
              <Button
                variant="primary"
                size="medium"
                icon="check"
                onClick={() => setShowInvoice(true)}
                disabled={cart.length === 0}
                className={`${styles.cartActionBtn} ${styles.checkoutBtn}`}
                fullWidth
              >
                Paiement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de validation plein écran */}
      {showInvoice && (
        <InvoiceModal
          cart={cart}
          onClose={() => setShowInvoice(false)}
          onCompleteSale={handleCompleteSale}
        />
      )}
    </div>
  );
};

export default NouvelleVentes;