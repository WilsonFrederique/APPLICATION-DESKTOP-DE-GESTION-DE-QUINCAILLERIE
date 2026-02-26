import React, { useState, useMemo, useCallback } from 'react';
import styles from './Ventes.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import { 
  IoTrashOutline,
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoBarcodeOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoWalletOutline,
  IoLocationOutline,
  IoCallOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaPercentage,
  FaChartLine,
  FaWarehouse
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCategory, 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbListDetails
} from "react-icons/tb";
import { 
  MdPayment,
  MdPointOfSale,
  MdOutlineSell,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from "react-icons/md";
import { GiShoppingCart } from "react-icons/gi";
import { Chip, emphasize, styled } from '@mui/material';

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

const mockHistoriqueVentes = [
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

// Composant de produit dans la liste (LIST VIEW) - ULTRA RESPONSIVE
const ProductItem = ({ product, onAddToCart }) => {
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

  return (
    <div className={styles.productListItem}>
      <div className={styles.productImageMobile}>
        <img src={product.image} alt={product.nom} />
        {product.stock <= product.seuilMin && (
          <div className={styles.stockWarningMobile}>
            <IoWarningOutline />
          </div>
        )}
      </div>
      
      <div className={styles.productContent}>
        <div className={styles.productHeader}>
          <div className={styles.productTitleSection}>
            <h4 className={styles.productName}>{product.nom}</h4>
            <div className={styles.productMeta}>
              <span className={styles.productRef}>
                <IoBarcodeOutline /> {product.reference}
              </span>
              <span className={styles.productCategory}>
                <TbCategory /> {product.categorie}
              </span>
              {product.stock <= product.seuilMin && (
                  <span className={styles.lowStockIndicator}>
                    <IoWarningOutline /> Stock faible
                  </span>
                )}
            </div>
          </div>
          
          <div className={styles.productStockInfo}>
            <div className={styles.stockContainer}>
              <FaWarehouse className={styles.stockIcon} />
              <div className={styles.stockDetails}>
                <span className={styles.stockQuantity}>{product.stock} {product.unite}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.productDetails}>
          <div className={styles.locationInfo}>
            <TbBuildingWarehouse />
            <span>{product.emplacement}</span>
          </div>
          
          <div className={styles.priceSection}>
            <div className={styles.priceMain}>
              <span className={styles.priceLabel}>Prix gros:</span>
              <span className={styles.priceValue}>
                {formatCurrency(product.prixVente)}/{product.unite}
              </span>
            </div>
            {product.peutEtreVenduEnDetail && (
              <div className={styles.priceDetail}>
                <span className={styles.priceLabel}>Prix détail:</span>
                <span className={styles.priceValue}>
                  {formatCurrency(product.prixDetail)}/{product.uniteDetail}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.productControls}>
          <div className={styles.controlGroup}>
            {product.peutEtreVenduEnDetail && (
              <div className={styles.unitSelector}>
                <select 
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className={styles.unitSelect}
                  aria-label="Sélectionner l'unité"
                >
                  <option value={product.unite}>{product.unite}</option>
                  <option value={product.uniteDetail}>{product.uniteDetail}</option>
                </select>
              </div>
            )}
            
            <div className={styles.quantitySelector}>
              <Button 
                variant="ghost"
                size="small"
                icon="minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Diminuer la quantité"
                className={styles.qtyButton}
              />
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(product.stock, value)));
                }}
                className={styles.qtyInput}
                aria-label="Quantité"
              />
              <Button 
                variant="ghost"
                size="small"
                icon="plus"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                aria-label="Augmenter la quantité"
                className={styles.qtyButton}
              />
            </div>
          </div>
          
          <div className={styles.actionSection}>
            <div className={styles.totalPreview}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalValue}>{formatCurrency(calculatePrice())}</span>
            </div>
            <Button 
              variant="primary"
              size="small"
              icon="cart"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              aria-label={`Ajouter ${product.nom} au panier`}
              className={styles.addToCartButton}
            >
              <span className={styles.buttonText}>Ajouter</span>
              <span className={styles.mobileOnly}>({quantity})</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant d'élément du panier (ULTRA RESPONSIVE)
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

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartItemImage}>
        <img src={item.image} alt={item.nom} />
        <div className={styles.cartItemQuantity}>
          {item.quantity}
        </div>
      </div>
      
      <div className={styles.cartItemContent}>
        <div className={styles.cartItemHeader}>
          <div className={styles.cartItemInfo}>
            <h5 className={styles.cartItemTitle}>{item.nom}</h5>
            <div className={styles.cartItemMeta}>
              <span className={styles.cartItemRef}>{item.reference}</span>
              <span className={styles.cartItemUnit}>{item.unit}</span>
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
        </div>
        
        <div className={styles.cartItemDetails}>
          <div className={styles.quantityControls}>
            <div className={styles.quantityButtons}>
              <Button 
                variant="ghost"
                size="small"
                icon="minus"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                aria-label="Diminuer la quantité"
                className={styles.quantityButton}
              />
              <span className={styles.quantityDisplay}>
                {item.quantity} {item.unit}
              </span>
              <Button 
                variant="ghost"
                size="small"
                icon="plus"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
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

// Fonction utilitaire pour générer le numéro de facture
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}${month}${day}`;
  
  // Vérifier si c'est un nouveau jour pour réinitialiser le compteur
  const lastInvoiceDate = localStorage.getItem('lastInvoiceDate');
  
  let counter = 1;
  if (lastInvoiceDate === today) {
    // Même jour, incrémenter le compteur
    counter = parseInt(localStorage.getItem('invoiceCounter')) + 1 || 1;
  }
  
  // Sauvegarder pour la prochaine fois
  localStorage.setItem('invoiceCounter', counter.toString());
  localStorage.setItem('lastInvoiceDate', today);
  
  const counterStr = String(counter).padStart(3, '0');
  return `FAC-${today}-${counterStr}`;
};

// Composant de facture (MODAL)
const InvoiceModal = ({ cart, onClose, onCompleteSale }) => {
  const [paymentMethod, setPaymentMethod] = useState('espèces');
  const [deliveryStatus, setDeliveryStatus] = useState('livre');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  
  // Générer le numéro de facture lors du rendu initial
  const invoiceNumber = useMemo(() => generateInvoiceNumber(), []);
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - discount);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleCompleteSale = () => {
    if (!clientName.trim()) {
      alert('Veuillez saisir le nom du client');
      return;
    }
    
    const invoiceData = {
      numero: invoiceNumber,
      client: {
        nom: clientName,
        telephone: clientPhone,
        adresse: clientAddress
      },
      items: cart,
      subtotal: calculateSubtotal(),
      discount,
      total: calculateTotal(),
      paymentMethod,
      deliveryStatus,
      notes,
      date: new Date().toISOString(),
      statut: paymentMethod === 'credit' ? 'credit' : 'paye'
    };
    
    onCompleteSale(invoiceData);
  };
  
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.invoiceModal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderContent}>
            <h3 className={styles.modalTitle}>
              <MdOutlineSell /> Validation de la Vente
            </h3>
            <p className={styles.modalSubtitle}>
              Finalisez la vente et générez la facture
            </p>
          </div>
          <Button 
            variant="ghost"
            size="medium"
            icon="close"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Fermer"
          />
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.invoiceContainer} id="invoice-content">
            {/* En-tête de facture */}
            <div className={styles.invoiceHeader}>
              <div className={styles.invoiceCompany}>
                <div className={styles.companyLogo}>
                  <MdOutlineStorefront />
                  <h4>QUINCAILLERIE PRO</h4>
                </div>
                <div className={styles.companyDetails}>
                  <p>Analakely, Antananarivo 101</p>
                  <p>Tél: +261 34 00 123 45</p>
                  <p>NIF: 123456789 / STAT: 987654321</p>
                </div>
              </div>
              
              <div className={styles.invoiceInfo}>
                <h1 className={styles.invoiceTitle}>FACTURE</h1>
                <div className={styles.invoiceNumber}>
                  <span>N°:</span>
                  <strong>{invoiceNumber}</strong>
                </div>
                <div className={styles.invoiceDate}>
                  <span>Date:</span>
                  <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>
            </div>
            
            {/* Informations client */}
            <div className={styles.clientSection}>
              <h5 className={styles.sectionTitle}>
                <IoPersonOutline /> INFORMATIONS CLIENT
              </h5>
              <div className={styles.clientForm}>
                <div className={styles.formGroup}>
                  <Input
                    type="text"
                    label="Nom complet du client"
                    placeholder="Entrez le nom du client"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className={styles.formInput}
                    name="clientName"
                    icon={<IoPersonOutline />}
                  />
                </div>
                <div className={styles.formRow}>
                  <Input
                    type="tel"
                    label="Téléphone"
                    placeholder="Entrez le numéro de téléphone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className={styles.formInput}
                    name="clientPhone"
                    icon={<IoCallOutline />}
                  />
                  <Input
                    type="text"
                    label="Adresse"
                    placeholder="Entrez l'adresse du client"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className={styles.formInput}
                    name="clientAddress"
                    icon={<IoLocationOutline />}
                  />
                </div>
              </div>
            </div>
            
            {/* Détails de la vente */}
            <div className={styles.saleDetails}>
              <h5 className={styles.sectionTitle}>
                <IoCartOutline /> DÉTAILS DE LA VENTE
              </h5>
              <div className={styles.cartTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableColProduct}>Produit</div>
                  <div className={styles.tableColQty}>Quantité</div>
                  <div className={styles.tableColPrice}>Prix unit.</div>
                  <div className={styles.tableColTotal}>Total</div>
                </div>
                
                <div className={styles.tableBody}>
                  {cart.map((item, index) => (
                    <div key={`${item.id}-${index}`} className={styles.tableRow}>
                      <div className={styles.tableColProduct}>
                        <div className={styles.productCell}>
                          <img src={item.image} alt={item.nom} className={styles.productTableImage} />
                          <div>
                            <div className={styles.productNameTable}>{item.nom}</div>
                            <div className={styles.productRefTable}>{item.reference}</div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.tableColQty}>
                        <span className={styles.quantityBadge}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className={styles.tableColPrice}>
                        {formatCurrency(item.price)}
                      </div>
                      <div className={styles.tableColTotal}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Options de paiement et livraison */}
            <div className={styles.optionsSection}>
              <div className={styles.paymentOptions}>
                <h5 className={styles.optionTitle}>
                  <MdPayment /> MODE DE PAIEMENT
                </h5>
                <div className={styles.paymentButtons}>
                  <Button 
                    variant={paymentMethod === 'espèces' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setPaymentMethod('espèces')}
                    className={styles.paymentBtn}
                    fullWidth
                  >
                    Espèces
                  </Button>
                  <Button 
                    variant={paymentMethod === 'virement' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setPaymentMethod('virement')}
                    className={styles.paymentBtn}
                    fullWidth
                  >
                    Virement
                  </Button>
                  <Button 
                    variant={paymentMethod === 'mvola' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setPaymentMethod('mvola')}
                    className={styles.paymentBtn}
                    fullWidth
                  >
                    MVola
                  </Button>
                  <Button 
                    variant={paymentMethod === 'credit' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setPaymentMethod('credit')}
                    className={styles.paymentBtn}
                    fullWidth
                  >
                    Crédit
                  </Button>
                </div>
              </div>
              
              <div className={styles.deliveryOptions}>
                <h5 className={styles.optionTitle}>
                  <TbTruckDelivery /> LIVRAISON
                </h5>
                <div className={styles.deliveryButtons}>
                  <Button 
                    variant={deliveryStatus === 'livre' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setDeliveryStatus('livre')}
                    className={styles.deliveryBtn}
                    fullWidth
                  >
                    Livraison
                  </Button>
                  <Button 
                    variant={deliveryStatus === 'non_livre' ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setDeliveryStatus('non_livre')}
                    className={styles.deliveryBtn}
                    fullWidth
                  >
                    Retrait magasin
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Remise et notes */}
            <div className={styles.discountNotes}>
              <div className={styles.discountSection}>
                <h5 className={styles.optionTitle}>
                  <FaPercentage /> REMISE
                </h5>
                <div className={styles.discountInputGroup}>
                  <Input
                    type="number"
                    label="Montant de la remise"
                    placeholder="Entrez le montant de la remise"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                    min="0"
                    max={calculateSubtotal()}
                    className={styles.discountInput}
                    name="discount"
                    icon={<FaPercentage />}
                  />
                  <span className={styles.discountDisplay}>
                    - {formatCurrency(discount)}
                  </span>
                </div>
              </div>
              
              <div className={styles.notesSection}>
                <h5 className={styles.optionTitle}>
                  <IoInformationCircleOutline /> NOTES
                </h5>
                <InputTextarea
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes supplémentaires..."
                  rows={3}
                  fullWidth
                  icon={<IoInformationCircleOutline />}
                  helperText="Informations complémentaires pour la facture"
                  showCharCount
                  maxLength={500}
                  className={styles.notesInput}
                />
              </div>
            </div>
            
            {/* Total */}
            <div className={styles.totalSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Sous-total:</span>
                <span className={styles.totalValue}>{formatCurrency(calculateSubtotal())}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Remise:</span>
                <span className={styles.totalValueDiscount}>- {formatCurrency(discount)}</span>
              </div>
              <div className={styles.totalRowGrand}>
                <span className={styles.totalLabelGrand}>Total à payer:</span>
                <span className={styles.totalValueGrand}>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.modalActions}>
          <Button 
            variant="secondary"
            size="medium"
            icon="back"
            onClick={onClose}
            className={styles.btn}
          >
            Retour
          </Button>
          <Button 
            variant="outline"
            size="medium"
            icon="print"
            onClick={handlePrint}
            className={styles.btn}
          >
            Imprimer
          </Button>
          <Button 
            variant="primary"
            size="medium"
            icon="check"
            onClick={handleCompleteSale}
            disabled={cart.length === 0}
            className={styles.btn}
          >
            Valider et Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant d'historique des ventes (ULTRA RESPONSIVE)
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

const Ventes = () => {
  // États principaux
  const [products] = useState(mockProducts);
  const [historiqueVentes] = useState(mockHistoriqueVentes);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('vente');
  const [productView, setProductView] = useState('list'); // 'list' or 'grid'
  
  // États pour le panier
  const [cart, setCart] = useState([]);
  
  // États pour les modals
  const [showInvoice, setShowInvoice] = useState(false);
  
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
    alert('Vente enregistrée avec succès!');
    setCart([]);
    setShowInvoice(false);
    setViewMode('history');
  }, []);
  
  // Catégories uniques
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.categorie))];
    return ['all', ...uniqueCats];
  }, [products]);
  
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);
  
  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('nom');
    setSortOrder('asc');
  };

  return (
    <div className={styles.dashboardModern}>
      {/* Header */}
      <div className={`${styles.header} ${styles.administrationHeader}`}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <div className={styles.headerTitleContent}>
              <h1 className={styles.dashboardTitle}>
                <MdPointOfSale /> Module de <span className={styles.highlight}>Ventes</span>
              </h1>
              <p className={styles.dashboardSubtitle}>
                Interface de vente en temps réel - Panier interactif
              </p>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className={styles.quickStats}>              
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{formatCurrency(cartStats.subtotal)}</span>
                <span className={styles.statLabel}>Montant total</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <IoReceiptOutline />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{salesStats.todaySales}</span>
                <span className={styles.statLabel}>Ventes aujourd'hui</span>
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
              onClick={() => window.location.href = '/'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.location.href = '/';
                }
              }}
              style={{ cursor: 'pointer' }}
            />
            <StyledBreadcrumb
              label="Administration"
              icon={<ExpandMoreIcon fontSize="small" />}
            />
            <StyledBreadcrumb
              label="Ventes"
              icon={<ExpandMoreIcon fontSize="small" />}
            />
          </Breadcrumbs>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className={styles.navigationTabs}>
        <Button 
          variant={viewMode === 'vente' ? 'primary' : 'ghost'}
          size="medium"
          icon="pointOfSale"
          onClick={() => setViewMode('vente')}
          className={`${styles.tabBtn} ${viewMode === 'vente' ? styles.active : ''}`}
          fullWidth
        >
          Point de Vente
        </Button>
        <Button 
          variant={viewMode === 'history' ? 'primary' : 'ghost'}
          size="medium"
          icon="receipt"
          onClick={() => setViewMode('history')}
          className={`${styles.tabBtn} ${viewMode === 'history' ? styles.active : ''}`}
          fullWidth
        >
          Historique
        </Button>
        <Button 
          variant={viewMode === 'stats' ? 'primary' : 'ghost'}
          size="medium"
          icon="chart"
          onClick={() => setViewMode('stats')}
          className={`${styles.tabBtn} ${viewMode === 'stats' ? styles.active : ''}`}
          fullWidth
        >
          Statistiques
        </Button>
      </div>

      {/* Vue principale - Split Screen */}
      {viewMode === 'vente' && (
        <div className={styles.splitScreenContainer}>
          {/* Colonne gauche - Produits */}
          <div className={styles.productsListColumn}>
            <div className={styles.productsListHeader}>
              <div className={styles.productsListTitle}>
                <div className={styles.titleSection}>
                  <TbListDetails />
                  <h2>Liste des Produits</h2>
                  <span className={styles.productListCount}>
                    {filteredProducts.length} produits
                  </span>
                </div>
                
                <div className={styles.viewToggle}>
                  <Button 
                    variant={productView === 'list' ? 'primary' : 'ghost'}
                    size="small"
                    icon="list"
                    onClick={() => setProductView('list')}
                    className={`${styles.viewToggleBtn} ${productView === 'list' ? styles.active : ''}`}
                    aria-label="Vue liste"
                  />
                  <Button 
                    variant={productView === 'grid' ? 'primary' : 'ghost'}
                    size="small"
                    icon="grid"
                    onClick={() => setProductView('grid')}
                    className={`${styles.viewToggleBtn} ${productView === 'grid' ? styles.active : ''}`}
                    aria-label="Vue grille"
                  />
                </div>
              </div>
              
              <div className={styles.productsListFilters}>
                <div>
                  <Input
                    type="text"
                    placeholder="Rechercher produit, référence, catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    name="productSearch"
                    className={styles.searchInput}
                    icon={<IoTrashOutline />}
                  />
                </div>
                
                <div className={styles.filterControls}>
                  <div className={styles.filterGroup}>
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
                      size="small"
                      variant="outline"
                      icon={<TbCategory />}
                      fullWidth
                    />
                  </div>
                  
                  <div className={styles.filterGroup}>
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
                      size="small"
                      variant="outline"
                      fullWidth
                    />
                  </div>
                  
                  <div>
                    <Button 
                      variant="outline"
                      size="medium"
                      icon="refresh"
                      onClick={handleResetFilters}
                      className={styles.resetBtn}
                    >
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${styles.productsListContainer} ${productView === 'grid' ? styles.gridView : ''}`}>
              <div className={styles.productsListScroll}>
                {filteredProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
                
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
              </div>
            </div>
          </div>
          
          {/* Colonne droite - Panier */}
          <div className={styles.cartColumn}>
            <div className={styles.cartHeader}>
              <div className={styles.cartTitle}>
                <GiShoppingCart />
                <div>
                  <h2>Panier</h2>
                  <p className={styles.cartSubtitle}>
                    {cartStats.totalProducts} articles • {cartStats.totalItems} unités
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
                    
                    <div className={styles.cartSummary}>
                      <div className={styles.summaryRow}>
                        <span>Articles:</span>
                        <span className={styles.summaryValue}>{cartStats.totalItems}</span>
                      </div>
                      <div className={styles.summaryRow}>
                        <span>Produits:</span>
                        <span className={styles.summaryValue}>{cartStats.totalProducts}</span>
                      </div>
                      <div className={styles.summaryRowTotal}>
                        <span>Total:</span>
                        <span className={styles.summaryTotalValue}>{formatCurrency(cartStats.subtotal)}</span>
                      </div>
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
      )}

      {/* Vue Historique */}
      {viewMode === 'history' && (
        <div className={styles.historyView}>
          <div className={styles.historyHeader}>
            <div className={styles.historyTitleSection}>
              <IoReceiptOutline className={styles.historyIcon} />
              <div>
                <h2 className={styles.historyTitle}>Historique des Ventes</h2>
                <p className={styles.historySubtitle}>
                  {historiqueVentes.length} vente(s) enregistrée(s)
                </p>
              </div>
            </div>
            
            <div className={styles.historyFilters}>
              <div className={styles.filterGroup}>
                <Input
                  type="text"
                  placeholder="Filtrer par client, numéro..."
                  className={styles.filterSelect}
                  name="historyFilter"
                  icon={<IoFilterOutline />}
                />
              </div>
              <div className={styles.filterGroup}>
                <Input
                  type="date"
                  className={styles.dateFilter}
                  name="historyDate"
                  icon={<IoCalendarOutline />}
                />
              </div>              
            </div>
          </div>
          
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
        <div className={styles.statsView}>
          <div className={styles.statsHeader}>
            <div className={styles.statsTitleSection}>
              <FaChartLine className={styles.statsIcon} />
              <div>
                <h2 className={styles.statsTitle}>Statistiques des Ventes</h2>
                <p className={styles.statsSubtitle}>
                  Vue d'ensemble des performances commerciales
                </p>
              </div>
            </div>
          </div>
          
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

      {/* Modal de validation */}
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

export default Ventes;