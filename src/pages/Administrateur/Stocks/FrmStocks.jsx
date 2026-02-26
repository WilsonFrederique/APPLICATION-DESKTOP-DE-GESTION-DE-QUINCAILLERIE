// FrmStocks.jsx - Version modifiée pour la modification
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './FrmStocks.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Import de tous les icônes nécessaires
import { 
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCalculatorOutline,
  IoReloadOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoCalendarOutline,
  IoDocumentsOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCashOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoChevronDownOutline,
  IoBarcodeOutline,
  IoQrCodeOutline,
  IoSaveOutline,
  IoShareSocialOutline,
  IoNotificationsOutline,
  IoWalletOutline,
  IoRemoveOutline,
  IoAddOutline,
  IoGridOutline,
  IoListOutline,
  IoLocationOutline,
  IoCallOutline,
  IoDuplicateOutline // Ajouté pour l'icône de duplication
} from "react-icons/io5";

import { 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaCreditCard,
  FaPercentage,
  FaClipboardList,
  FaChartLine,
  FaUserTie,
  FaWarehouse,
  FaBarcode,
  FaTags,
  FaWeightHanging,
  FaStore,
  FaShoppingCart,
  FaExchangeAlt,
  FaHistory,
  FaSortAmountDownAlt,
  FaSortAmountUpAlt,
  FaRegSave,
  FaFileInvoice,
  FaPaintBrush,
  FaTools
} from "react-icons/fa";

import { 
  TbBuildingWarehouse, 
  TbCategory, 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbArrowsSort,
  TbSortAscending,
  TbSortDescending,
  TbListDetails,
  TbGraph
} from "react-icons/tb";

import { 
  MdInventory, 
  MdLocalShipping, 
  MdAttachMoney,
  MdPayment,
  MdCategory as MdCategoryIcon,
  MdPointOfSale,
  MdOutlineSell,
  MdOutlineTrendingUp,
  MdOutlineStorefront,
  MdOutlineShoppingCart,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdOutlineSecurity,
  MdOutlineAttachMoney as MdOutlineMoney
} from "react-icons/md";

import { 
  GiWeight, 
  GiCash, 
  GiShoppingCart 
} from "react-icons/gi";

import { 
  CiMoneyBill, 
  CiCreditCard1, 
  CiShoppingTag 
} from "react-icons/ci";

import { Chip, emphasize, styled } from '@mui/material';

// Import de tous vos composants personnalisés
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
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
];

const mockProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    stock: 15,
    seuilMin: 20,
    seuilAlerte: 30,
    prixAchat: 35000,
    prixVente: 50000,
    unite: 'sac',
    fournisseur: 'Holcim Madagascar',
    emplacement: 'Entrepôt A, Zone 1',
    image: productImages[0],
    peutEtreVenduEnDetail: true,
    uniteDetail: 'kg',
    prixDetail: 1000
  },
  {
    id: 2,
    nom: 'Tôle Galvanisée 3m',
    reference: 'TOL-GALV-3M',
    categorie: 'Ferronnerie',
    stock: 8,
    seuilMin: 10,
    seuilAlerte: 25,
    prixAchat: 250000,
    prixVente: 300000,
    unite: 'feuille',
    fournisseur: 'Metaltron',
    emplacement: 'Entrepôt B, Zone 3',
    image: productImages[1],
    peutEtreVenduEnDetail: false
  },
  {
    id: 3,
    nom: 'Vis à Bois 5x50',
    reference: 'VIS-BOIS-5x50',
    categorie: 'Quincaillerie',
    stock: 1200,
    seuilMin: 500,
    seuilAlerte: 2000,
    prixAchat: 150,
    prixVente: 250,
    prixDetail: 10,
    unite: 'pièce',
    uniteDetail: 'pièce',
    fournisseur: 'Bricodépôt',
    emplacement: 'Rayon 2, Boîte 15',
    image: productImages[2],
    peutEtreVenduEnDetail: true
  },
  {
    id: 4,
    nom: 'Peinture Blanche 10L',
    reference: 'PEINT-BLANC-10L',
    categorie: 'Peinture',
    stock: 5,
    seuilMin: 15,
    seuilAlerte: 30,
    prixAchat: 80000,
    prixVente: 120000,
    prixDetail: 12000,
    unite: 'pot',
    uniteDetail: 'L',
    fournisseur: 'Dulux',
    emplacement: 'Rayon 4',
    image: productImages[3],
    peutEtreVenduEnDetail: true
  },
  {
    id: 5,
    nom: 'Clou 10cm',
    reference: 'CLOU-10CM',
    categorie: 'Quincaillerie',
    stock: 2000,
    seuilMin: 500,
    seuilAlerte: 3000,
    prixAchat: 50,
    prixVente: 100,
    prixDetail: 5,
    unite: 'kg',
    uniteDetail: 'pièce',
    fournisseur: 'MetalPro',
    emplacement: 'Rayon 3',
    image: productImages[4],
    peutEtreVenduEnDetail: true
  }
];

const mockSuppliers = [
  { id: '1', nom: 'Holcim Madagascar', contact: '034 12 345 67', email: 'contact@holcim.mg' },
  { id: '2', nom: 'Metaltron', contact: '020 22 333 44', email: 'info@metaltron.mg' },
  { id: '3', nom: 'Bricodépôt', contact: '032 11 222 33', email: 'ventes@bricodepot.mg' },
  { id: '4', nom: 'Détaillant Local', contact: '038 99 888 77', email: 'local@fournisseur.mg' },
  { id: '5', nom: 'MetalPro', contact: '033 44 555 66', email: 'contact@metalpro.mg' },
  { id: '6', nom: 'Dulux Madagascar', contact: '020 77 888 99', email: 'info@dulux.mg' }
];

const mockEmplacements = [
  { id: '1', nom: 'Entrepôt A, Zone 1', type: 'entrepôt' },
  { id: '2', nom: 'Entrepôt B, Zone 3', type: 'entrepôt' },
  { id: '3', nom: 'Rayon 2, Boîte 15', type: 'rayon' },
  { id: '4', nom: 'Rayon 4', type: 'rayon' },
  { id: '5', nom: 'Rayon 3', type: 'rayon' },
  { id: '6', nom: 'Rayon 1', type: 'rayon' }
];

const FrmStocks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // États pour gérer le mode édition/duplication
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDuplicateMode, setIsDuplicateMode] = useState(false);
  const [originalMovementId, setOriginalMovementId] = useState(null);

  // États du formulaire principal
  const [formData, setFormData] = useState({
    type: 'entree',
    dateOperation: new Date().toISOString().split('T')[0],
    productId: '',
    quantity: 1,
    prixUnitaire: 0,
    montantTotal: 0,
    fournisseurId: '',
    reference: '',
    commentaire: '',
    createdBy: 'Admin',
    status: 'completed',
    emplacement: '',
    categorie: '',
    uniteVente: 'gros', // 'gros' ou 'detail'
    avecTVA: true,
    tauxTVA: 20,
    documentJoint: null,
    notification: true,
    priorite: 'normal', // 'basse', 'normal', 'haute', 'urgente'
    periodeValidite: ''
  });

  // États supplémentaires
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSummary, setShowSummary] = useState(true);
  const [autoGenerateReference, setAutoGenerateReference] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // Données disponibles
  const [products] = useState(mockProducts);
  const [suppliers] = useState(mockSuppliers);
  const [emplacements] = useState(mockEmplacements);

  // Utiliser useRef pour stocker generateReference et éviter le warning de dépendance
  const generateReferenceRef = useRef(() => {
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const typePrefix = formData.type === 'entree' ? 'ENT' : 
                      formData.type === 'sortie' ? 'SORT' : 
                      formData.type === 'ajustement' ? 'AJUST' : 'RET';
    const reference = `${typePrefix}-${timestamp}-${randomChars}`;
    setFormData(prev => ({ ...prev, reference }));
  });

  // Formater la monnaie
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Calculer le montant total
  const calculateTotal = useCallback(() => {
    const baseAmount = formData.quantity * formData.prixUnitaire;
    const tvaAmount = formData.avecTVA ? (baseAmount * formData.tauxTVA) / 100 : 0;
    return baseAmount + tvaAmount;
  }, [formData.quantity, formData.prixUnitaire, formData.avecTVA, formData.tauxTVA]);

  // Mettre à jour le montant total
  useEffect(() => {
    const total = calculateTotal();
    setFormData(prev => ({ ...prev, montantTotal: total }));
  }, [formData.quantity, formData.prixUnitaire, formData.avecTVA, formData.tauxTVA, calculateTotal]);

  // Mettre à jour le prix unitaire quand le produit change
  useEffect(() => {
    if (selectedProduct) {
      let prixUnitaire = 0;
      switch (formData.type) {
        case 'entree':
          prixUnitaire = selectedProduct.prixAchat;
          break;
        case 'sortie':
          if (formData.uniteVente === 'detail' && selectedProduct.peutEtreVenduEnDetail) {
            prixUnitaire = selectedProduct.prixDetail;
          } else {
            prixUnitaire = selectedProduct.prixVente;
          }
          break;
        default:
          prixUnitaire = 0;
      }
      setFormData(prev => ({ ...prev, prixUnitaire }));
    }
  }, [selectedProduct, formData.type, formData.uniteVente]);

  // Générer automatiquement la référence si activé (sauf en mode édition)
  useEffect(() => {
    if (autoGenerateReference && !formData.reference && !isEditMode) {
      generateReferenceRef.current();
    }
  }, [autoGenerateReference, formData.reference, formData.type, isEditMode]);

  // Charger les données en mode édition/duplication
  useEffect(() => {
    const loadMovementData = () => {
      if (location.state) {
        const { isEdit, isDuplicate, movementId, movementData } = location.state;
        
        if (isEdit && movementData) {
          setIsEditMode(true);
          setOriginalMovementId(movementId);
          setAutoGenerateReference(false); // Désactiver la génération automatique en mode édition
          
          // Mapper les données du mouvement vers le formulaire
          const product = products.find(p => p.id === movementData.productId);
          const supplier = suppliers.find(s => s.nom === movementData.fournisseur);
          
          setFormData({
            type: movementData.type,
            dateOperation: movementData.date.split('T')[0],
            productId: movementData.productId.toString(),
            quantity: Math.abs(movementData.quantity),
            prixUnitaire: movementData.prixUnitaire,
            montantTotal: movementData.montantTotal,
            fournisseurId: supplier?.id || '',
            reference: movementData.reference,
            commentaire: movementData.commentaire,
            createdBy: movementData.userName,
            status: movementData.status,
            emplacement: movementData.emplacement,
            categorie: movementData.productCategory,
            uniteVente: 'gros', // Par défaut, à adapter selon les données
            avecTVA: movementData.tvaApplicable,
            tauxTVA: movementData.tauxTVA || 20,
            documentJoint: null,
            notification: true,
            priorite: 'normal',
            periodeValidite: ''
          });
          
          if (product) {
            setSelectedProduct(product);
          }
        } else if (isDuplicate && movementData) {
          setIsDuplicateMode(true);
          setOriginalMovementId(movementData.id);
          
          // Dupliquer les données mais générer une nouvelle référence
          const product = products.find(p => p.id === movementData.productId);
          const supplier = suppliers.find(s => s.nom === movementData.fournisseur);
          
          // Générer une nouvelle référence pour la duplication
          const timestamp = Date.now().toString().slice(-6);
          const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
          const typePrefix = movementData.type === 'entree' ? 'ENT' : 
                           movementData.type === 'sortie' ? 'SORT' : 
                           movementData.type === 'ajustement' ? 'AJUST' : 'RET';
          const newReference = `${typePrefix}-${timestamp}-${randomChars}`;
          
          setFormData({
            type: movementData.type,
            dateOperation: new Date().toISOString().split('T')[0],
            productId: movementData.productId.toString(),
            quantity: Math.abs(movementData.quantity),
            prixUnitaire: movementData.prixUnitaire,
            montantTotal: movementData.montantTotal,
            fournisseurId: supplier?.id || '',
            reference: newReference,
            commentaire: `${movementData.commentaire} (Dupliqué de ${movementData.reference})`,
            createdBy: 'Admin',
            status: 'completed',
            emplacement: movementData.emplacement,
            categorie: movementData.productCategory,
            uniteVente: 'gros',
            avecTVA: movementData.tvaApplicable,
            tauxTVA: movementData.tauxTVA || 20,
            documentJoint: null,
            notification: true,
            priorite: 'normal',
            periodeValidite: ''
          });
          
          if (product) {
            setSelectedProduct(product);
          }
        }
      }
    };

    loadMovementData();
  }, [location.state, products, suppliers]);

  // Gérer la sélection du produit
  const handleProductSelect = (productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    setFormData(prev => ({ 
      ...prev, 
      productId,
      categorie: product?.categorie || '',
      emplacement: product?.emplacement || ''
    }));
  };

  // Gérer les changements du formulaire
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur de validation si elle existe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.productId) {
      errors.productId = 'Veuillez sélectionner un produit';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      errors.quantity = 'La quantité doit être supérieure à 0';
    }
    
    if (!formData.prixUnitaire || formData.prixUnitaire < 0) {
      errors.prixUnitaire = 'Le prix unitaire doit être positif';
    }
    
    if (formData.type === 'sortie' && selectedProduct) {
      const nouveauStock = selectedProduct.stock - formData.quantity;
      if (nouveauStock < 0) {
        errors.quantity = `Stock insuffisant. Stock disponible: ${selectedProduct.stock} ${selectedProduct.unite}`;
      }
    }
    
    if (!formData.reference) {
      errors.reference = 'La référence est requise';
    }
    
    if (formData.avecTVA && (!formData.tauxTVA || formData.tauxTVA < 0)) {
      errors.tauxTVA = 'Le taux de TVA doit être positif';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const movementData = {
        ...formData,
        id: isEditMode ? originalMovementId : Date.now(),
        quantity: formData.type === 'entree' ? formData.quantity : -formData.quantity,
        updatedAt: new Date().toISOString(),
        productName: selectedProduct?.nom || '',
        productRef: selectedProduct?.reference || '',
        productCategory: selectedProduct?.categorie || '',
        productDescription: selectedProduct?.description || '',
        productImage: selectedProduct?.image || '',
        userName: formData.createdBy,
        userRole: 'Administrateur',
        userEmail: 'admin@quincaillerie.mg',
        stockBefore: selectedProduct?.stock || 0,
        stockAfter: calculateStockAfter(),
        unit: selectedProduct?.unite || 'unité',
        fournisseur: suppliers.find(s => s.id === formData.fournisseurId)?.nom || '',
        fournisseurContact: suppliers.find(s => s.id === formData.fournisseurId)?.contact || '',
        tvaApplicable: formData.avecTVA,
        tauxTVA: formData.tauxTVA,
        fraisLivraison: 0,
        bonLivraison: `BL-${formData.reference}`,
        facture: `FACT-${formData.reference}`,
        createdAt: isEditMode ? new Date().toISOString() : new Date().toISOString()
      };
      
      console.log('Mouvement de stock:', isEditMode ? 'modifié' : 'créé', movementData);
      
      // Message de succès
      alert(isEditMode 
        ? 'Mouvement de stock modifié avec succès!' 
        : isDuplicateMode
        ? 'Mouvement dupliqué avec succès!'
        : 'Mouvement de stock créé avec succès!');
      
      // Redirection
      navigate('/stocksAdmin');
      
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      setFormData({
        type: 'entree',
        dateOperation: new Date().toISOString().split('T')[0],
        productId: '',
        quantity: 1,
        prixUnitaire: 0,
        montantTotal: 0,
        fournisseurId: '',
        reference: '',
        commentaire: '',
        createdBy: 'Admin',
        status: 'completed',
        emplacement: '',
        categorie: '',
        uniteVente: 'gros',
        avecTVA: true,
        tauxTVA: 20,
        documentJoint: null,
        notification: true,
        priorite: 'normal',
        periodeValidite: ''
      });
      setSelectedProduct(null);
      setValidationErrors({});
      setShowSummary(true);
      setIsEditMode(false);
      setIsDuplicateMode(false);
      setOriginalMovementId(null);
      setAutoGenerateReference(true);
    }
  };

  // Obtenir l'icône du type d'opération
  const getTypeIcon = (type) => {
    switch (type) {
      case 'entree': return <IoArrowDownOutline />;
      case 'sortie': return <IoArrowUpOutline />;
      case 'ajustement': return <FaExchangeAlt />;
      case 'retour': return <IoRefreshOutline />;
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

  // Calculer le stock après opération
  const calculateStockAfter = () => {
    if (!selectedProduct) return 0;
    
    const stockChange = formData.type === 'entree' ? formData.quantity : -formData.quantity;
    return Math.max(0, selectedProduct.stock + stockChange);
  };

  // Vérifier si le stock est critique après opération
  const isStockCritical = () => {
    if (!selectedProduct) return false;
    const stockAfter = calculateStockAfter();
    return stockAfter <= selectedProduct.seuilMin;
  };

  // Fonction pour générer une référence manuellement
  const handleGenerateReference = () => {
    generateReferenceRef.current();
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            
            <div className={styles.headerText}>
              <h1 className={styles.formTitle}>
                {isEditMode ? 'Modifier le Mouvement' : 
                 isDuplicateMode ? 'Dupliquer le Mouvement' : 
                 'Nouveau Mouvement de Stock'}
                <span className={styles.formSubtitle}>
                  {isEditMode ? 'Modifiez les détails du mouvement existant' :
                   isDuplicateMode ? 'Créez un nouveau mouvement basé sur un existant' :
                   'Créez une nouvelle entrée, sortie ou ajustement de stock'}
                </span>
              </h1>
              
              <div className={styles.headerBadges}>
                <span className={`${styles.typeBadge} ${styles[getTypeColor(formData.type)]}`}>
                  {getTypeIcon(formData.type)}
                  {getTypeLabel(formData.type)}
                </span>
                <span className={styles.infoBadge}>
                  <IoCalendarOutline />
                  {new Date(formData.dateOperation).toLocaleDateString('fr-FR')}
                </span>
                {formData.priorite !== 'normal' && (
                  <span className={`${styles.priorityBadge} ${styles[formData.priorite]}`}>
                    {formData.priorite === 'urgente' && <IoAlertCircleOutline />}
                    {formData.priorite === 'haute' && <IoWarningOutline />}
                    {formData.priorite === 'basse' && <IoInformationCircleOutline />}
                    {formData.priorite}
                  </span>
                )}
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
                  label={isEditMode ? "Modifier Mouvement" : 
                         isDuplicateMode ? "Dupliquer Mouvement" : 
                         "Nouveau Mouvement"}
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>
        
        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className={styles.mainForm}>
          <div className={styles.formContent}>
            {/* Section type et date */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaFileInvoice /> Type d'opération
              </h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Type d'opération *
                  </label>
                </div>
                
                <div className={styles.typeOptions}>
                  {['entree', 'sortie', 'ajustement', 'retour'].map(type => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typeOption} ${
                        formData.type === type ? styles.selected : ''
                      } ${styles[getTypeColor(type)]}`}
                      onClick={() => handleChange('type', type)}
                    >
                      {getTypeIcon(type)}
                      <span>{getTypeLabel(type)}</span>
                    </button>
                  ))}
                </div>

                <div className={styles.formRow2}>
                  <Input
                    type="date"
                    label="Date d'opération"
                    value={formData.dateOperation}
                    onChange={(e) => handleChange('dateOperation', e.target.value)}
                    name="dateOperation"
                    required
                    icon={<IoCalendarOutline />}
                    className={styles.formInput}
                  />
                  <InputSelect
                    label="Priorité"
                    value={formData.priorite}
                    onChange={(value) => handleChange('priorite', value)}
                    options={[
                      { value: 'basse', label: 'Basse priorité' },
                      { value: 'normal', label: 'Priorité normale' },
                      { value: 'haute', label: 'Haute priorité' },
                      { value: 'urgente', label: 'Urgente' }
                    ]}
                    size="small"
                    variant="outline"
                    icon={<IoWarningOutline />}
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            {/* Section produit */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaBox /> Sélection du produit
              </h3>
              
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Produit"
                    value={formData.productId}
                    onChange={(value) => handleProductSelect(value)}
                    options={[
                      { value: '', label: 'Sélectionner un produit' },
                      ...products.map(product => ({
                        value: product.id,
                        label: `${product.nom} (${product.reference}) - Stock: ${product.stock} ${product.unite}`
                      }))
                    ]}
                    error={validationErrors.productId}
                    required
                    searchable
                    icon={<FaBox />}
                    size="medium"
                    variant="outline"
                    fullWidth
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="text"
                    label="Catégorie"
                    value={formData.categorie}
                    onChange={(e) => handleChange('categorie', e.target.value)}
                    name="categorie"
                    disabled
                    icon={<TbCategory />}
                    className={styles.formInput}
                  />
                </div>
              </div>
              
              {selectedProduct && (
                <div className={styles.productInfoCard}>
                  <div className={styles.productInfoHeader}>
                    <div className={styles.productImageSmall}>
                      <img src={selectedProduct.image} alt={selectedProduct.nom} />
                      {selectedProduct.stock <= selectedProduct.seuilMin && (
                        <div className={styles.stockWarningBadge}>
                          <IoWarningOutline />
                        </div>
                      )}
                    </div>
                    <div className={styles.productDetails}>
                      <h4 className={styles.productName}>{selectedProduct.nom}</h4>
                      <div className={styles.productMeta}>
                        <span className={styles.productRef}>
                          <FaBarcode /> {selectedProduct.reference}
                        </span>
                        <span className={styles.productCategory}>
                          <TbCategory /> {selectedProduct.categorie}
                        </span>
                        <span className={styles.productStock}>
                          <MdOutlineStorage /> {selectedProduct.stock} {selectedProduct.unite}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.productStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Prix d'achat:</span>
                      <span className={styles.statValue}>{formatCurrency(selectedProduct.prixAchat)}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Prix de vente:</span>
                      <span className={styles.statValue}>{formatCurrency(selectedProduct.prixVente)}</span>
                    </div>
                    {selectedProduct.peutEtreVenduEnDetail && (
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Prix détail:</span>
                        <span className={styles.statValue}>{formatCurrency(selectedProduct.prixDetail)}/{selectedProduct.uniteDetail}</span>
                      </div>
                    )}
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Seuil minimum:</span>
                      <span className={styles.statValue}>{selectedProduct.seuilMin} {selectedProduct.unite}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section quantité et prix */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <MdOutlineMoney /> Détails de l'opération
              </h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabelQ}>
                    Quantité <span className='marque'>*</span>
                    {validationErrors.quantity && (
                      <span className={styles.errorText}> {validationErrors.quantity}</span>
                    )}
                  </label>
                  <div className={styles.quantityInput}>
                    <Button 
                      variant="outline"
                      size="small"
                      icon="minus"
                      onClick={() => handleChange('quantity', Math.max(1, formData.quantity - 1))}
                      disabled={formData.quantity <= 1}
                      className={styles.quantityBtn}
                    />
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 1)}
                      name="quantity"
                      min="1"
                      max={selectedProduct?.stock || 99999}
                      error={validationErrors.quantity}
                      className={styles.quantityInputField}
                      required
                    />
                    <Button 
                      variant="outline"
                      size="small"
                      icon="plus"
                      onClick={() => handleChange('quantity', formData.quantity + 1)}
                      disabled={formData.quantity >= (selectedProduct?.stock || 99999)}
                      className={styles.quantityBtn}
                    />
                    <span className={styles.quantityUnit}>
                      {selectedProduct?.unite || 'unité'}
                    </span>

                  </div>
                  
                  {selectedProduct && formData.type === 'sortie' && (
                    <div className={styles.stockWarning}>
                      <IoWarningOutline />
                      <span>
                        Stock après opération: {calculateStockAfter()} {selectedProduct.unite}
                        {isStockCritical() && ' ⚠️ Stock critique!'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  {formData.type === 'sortie' && selectedProduct?.peutEtreVenduEnDetail && (
                    <InputSelect
                      label="Unité de vente"
                      value={formData.uniteVente}
                      onChange={(value) => handleChange('uniteVente', value)}
                      options={[
                        { value: 'gros', label: `Gros (${selectedProduct.unite})` },
                        { value: 'detail', label: `Détail (${selectedProduct.uniteDetail})` }
                      ]}
                      size="small"
                      variant="outline"
                      icon={<FaWeightHanging />}
                      fullWidth
                    />
                  )}
                </div>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <Input
                    type="number"
                    label="Prix unitaire"
                    value={formData.prixUnitaire}
                    onChange={(e) => handleChange('prixUnitaire', parseFloat(e.target.value) || 0)}
                    name="prixUnitaire"
                    error={validationErrors.prixUnitaire}
                    min="0"
                    step="100"
                    required
                    icon={<TbCurrencyDollar />}
                    className={styles.formInput}
                  />
                  <div className={styles.inputHint}>
                    {formData.type === 'entree' ? 'Prix d\'achat' : 
                    formData.uniteVente === 'detail' ? 'Prix détail' : 'Prix de vente'}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Fournisseur"
                    value={formData.fournisseurId}
                    onChange={(value) => handleChange('fournisseurId', value)}
                    options={[
                      { value: '', label: 'Sélectionner un fournisseur' },
                      ...suppliers.map(supplier => ({
                        value: supplier.id,
                        label: `${supplier.nom} (${supplier.contact})`
                      }))
                    ]}
                    searchable
                    icon={<FaTruck />}
                    size="medium"
                    variant="outline"
                    fullWidth
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Emplacement"
                    value={formData.emplacement}
                    onChange={(value) => handleChange('emplacement', value)}
                    options={[
                      { value: '', label: 'Sélectionner un emplacement' },
                      ...emplacements.map(emp => ({
                        value: emp.nom,
                        label: emp.nom
                      }))
                    ]}
                    searchable
                    icon={<MdOutlineLocationOn />}
                    size="medium"
                    variant="outline"
                    fullWidth
                  />
                </div>
              </div>
            </div>
            
            {/* Section TVA et options avancées */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <IoCalculatorOutline /> Options financières
                </h3>
                <Button 
                  variant="outline"
                  size="small"
                  icon={showAdvancedOptions ? "chevronDown" : "chevronDown"}
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className={styles.toggleBtn}
                >
                  {showAdvancedOptions ? 'Masquer' : 'Afficher plus'}
                </Button>
              </div>
              
              {showAdvancedOptions && (
                <div className={styles.advancedOptions}>
                  <div className={styles.formGrid}>

                    <div className={styles.formGroup}>
                      <InputTogglerIcons
                        label="Notification par email"
                        checked={formData.notification}
                        onChange={(e) => handleChange('notification', e.target.checked)}
                        name="notification"
                        showIcons
                        color="green"
                        size="medium"
                      />
                      <p className={styles.inputHelperText}>
                        Recevoir une confirmation par email
                      </p>
                    </div>

                    <div className={styles.formGroup}>
                      <InputTogglerIcons
                        label="Inclure TVA"
                        checked={formData.avecTVA}
                        onChange={(e) => handleChange('avecTVA', e.target.checked)}
                        name="avecTVA"
                        showIcons
                        color="blue"
                        size="medium"
                      />
                    </div>
                    
                    <div className={styles.formGroup}>
                      <Input
                        type="number"
                        label="Taux TVA (%)"
                        value={formData.tauxTVA}
                        onChange={(e) => handleChange('tauxTVA', parseFloat(e.target.value) || 0)}
                        name="tauxTVA"
                        disabled={!formData.avecTVA}
                        min="0"
                        max="100"
                        step="0.5"
                        icon={<FaPercentage />}
                        className={styles.formInput}
                        error={validationErrors.tauxTVA}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <Input
                        type="text"
                        label="Période de validité"
                        value={formData.periodeValidite}
                        onChange={(e) => handleChange('periodeValidite', e.target.value)}
                        name="periodeValidite"
                        placeholder="Ex: 30 jours"
                        icon={<IoTimeOutline />}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <InputFile
                      label="Document joint"
                      onChange={(e) => handleChange('documentJoint', e.target.files[0])}
                      name="documentJoint"
                      accept=".pdf,.jpg,.png,.doc,.docx"
                      variant="outline"
                      buttonText="Choisir un fichier"
                      helperText="Facture, bon de livraison, etc."
                      fullWidth
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Section informations supplémentaires */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <IoDocumentsOutline /> Informations supplémentaires
              </h3>
              
              <div className={styles.formGrid2}>
                <div className={styles.formGroup}>
                  <div className={styles.referenceSection}>
                    <Input
                      type="text"
                      label="Référence"
                      value={formData.reference}
                      onChange={(e) => handleChange('reference', e.target.value)}
                      name="reference"
                      placeholder="Ex: FACT-2024-001"
                      error={validationErrors.reference}
                      required
                      icon={<FaBarcode />}
                      className={styles.formInput}
                    />
                    <div className={styles.referenceActions}>
                      {!isEditMode && (
                        <InputCheckbox
                          label="Générer automatiquement"
                          checked={autoGenerateReference}
                          onChange={(e) => setAutoGenerateReference(e.target.checked)}
                          color="blue"
                        />
                      )}
                      {!autoGenerateReference && !isEditMode && (
                        <Button 
                          variant="outline"
                          size="small"
                          icon="refresh"
                          onClick={handleGenerateReference}
                          className={styles.generateBtn}
                        >
                          Générer
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Statut"
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                    options={[
                      { value: 'pending', label: 'En attente' },
                      { value: 'completed', label: 'Complété' },
                      { value: 'cancelled', label: 'Annulé' },
                      { value: 'draft', label: 'Brouillon' }
                    ]}
                    size="small"
                    variant="outline"
                    icon={<IoCheckmarkCircleOutline />}
                    fullWidth
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputTextarea
                  label="Commentaire"
                  value={formData.commentaire}
                  onChange={(e) => handleChange('commentaire', e.target.value)}
                  placeholder="Ajoutez un commentaire sur cette opération..."
                  rows={3}
                  fullWidth
                  icon={<FaClipboardList />}
                  helperText="Informations complémentaires sur le mouvement"
                  showCharCount
                  maxLength={500}
                  className={styles.notesInput}
                />
              </div>
            </div>
            
            {/* Récapitulatif */}
            {showSummary && (
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>
                    <IoCalculatorOutline /> Récapitulatif
                  </h3>
                  <Button 
                    variant="outline"
                    size="small"
                    icon="close"
                    onClick={() => setShowSummary(false)}
                    className={styles.toggleBtn}
                  >
                    Masquer
                  </Button>
                </div>
                
                <div className={styles.summaryCard}>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Type d'opération:</span>
                      <span className={`${styles.summaryValue} ${styles[getTypeColor(formData.type)]}`}>
                        {getTypeIcon(formData.type)}
                        {getTypeLabel(formData.type)}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.dateOperation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Produit:</span>
                      <span className={styles.summaryValue}>
                        {selectedProduct?.nom || 'Non sélectionné'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Quantité:</span>
                      <span className={styles.summaryValue}>
                        {formData.quantity} {selectedProduct?.unite || 'unité'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Prix unitaire:</span>
                      <span className={styles.summaryValue}>
                        {formatCurrency(formData.prixUnitaire)}
                      </span>
                    </div>
                    {formData.avecTVA && (
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>TVA ({formData.tauxTVA}%):</span>
                        <span className={styles.summaryValue}>
                          {formatCurrency((formData.quantity * formData.prixUnitaire * formData.tauxTVA) / 100)}
                        </span>
                      </div>
                    )}
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Montant total:</span>
                      <span className={`${styles.summaryValue} ${styles.highlight}`}>
                        {formatCurrency(formData.montantTotal)}
                      </span>
                    </div>
                    {selectedProduct && (
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Stock après opération:</span>
                        <span className={`${styles.summaryValue} ${
                          isStockCritical() ? styles.warning : ''
                        }`}>
                          {calculateStockAfter()} {selectedProduct.unite}
                          {isStockCritical() && ' ⚠️'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.summaryFooter}>
                    <div className={styles.summaryFooterItem}>
                      <span className={styles.footerLabel}>Statut:</span>
                      <span className={`${styles.footerValue} ${
                        formData.status === 'completed' ? styles.success :
                        formData.status === 'pending' ? styles.warning :
                        formData.status === 'cancelled' ? styles.danger : ''
                      }`}>
                        {formData.status === 'completed' ? 'Complété' :
                         formData.status === 'pending' ? 'En attente' :
                         formData.status === 'cancelled' ? 'Annulé' : 'Brouillon'}
                      </span>
                    </div>
                    <div className={styles.summaryFooterItem}>
                      <span className={styles.footerLabel}>Priorité:</span>
                      <span className={`${styles.footerValue} ${styles[formData.priorite]}`}>
                        {formData.priorite}
                      </span>
                    </div>
                    <div className={styles.summaryFooterItem}>
                      <span className={styles.footerLabel}>Notification:</span>
                      <span className={styles.footerValue}>
                        {formData.notification ? 'Activée' : 'Désactivée'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions du formulaire */}
          <div className={styles.formActions}>
            <div className={styles.actionsLeft}>
              <Button 
                variant="secondary"
                size="medium"
                icon="refresh"
                onClick={handleReset}
                className={styles.btnSecondary}
              >
                Réinitialiser
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              <Button 
                variant="outline"
                size="medium"
                onClick={() => navigate('/stocksAdmin')}
                className={styles.btnOutline}
              >
                Annuler
              </Button>
              
              <Button 
                variant={isEditMode ? "warning" : "primary"}
                size="medium"
                icon={isEditMode ? "edit" : "save"}
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                className={isEditMode ? styles.btnWarning : styles.btnPrimary}
              >
                {isSubmitting 
                  ? 'Enregistrement...' 
                  : isEditMode 
                    ? 'Mettre à jour le mouvement'
                    : isDuplicateMode
                    ? 'Dupliquer le mouvement'
                    : 'Enregistrer le mouvement'}
              </Button>
              
              <Button 
                variant="success"
                size="medium"
                icon="check"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={styles.btnSuccess}
              >
                Valider et continuer
              </Button>
            </div>
          </div>
        </form>
        
        {/* Pied de page */}
        <div className={styles.formFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.infoItem}>
              <IoInformationCircleOutline />
              <span>Tous les mouvements sont traçables et auditables</span>
            </div>
            <div className={styles.infoItem}>
              <MdOutlineSecurity />
              <span>Sécurité des données garantie</span>
            </div>
            <div className={styles.infoItem}>
              <FaHistory />
              <span>Historique complet disponible</span>
            </div>
          </div>
          
          <div className={styles.footerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Produits en stock:</span>
              <span className={styles.statValue}>{products.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Fournisseurs:</span>
              <span className={styles.statValue}>{suppliers.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Mouvements aujourd'hui:</span>
              <span className={styles.statValue}>12</span>
            </div>
          </div>
        </div>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default FrmStocks;