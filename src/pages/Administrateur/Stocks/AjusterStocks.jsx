// AjusterStocks.jsx - Version utilisant vos composants
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './AjusterStocks.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCalculatorOutline,
  IoCalendarOutline,
  IoDocumentsOutline,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoReloadOutline,
  IoEyeOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaClipboardList,
  FaUndo,
  FaExchangeAlt,
  FaUserCheck,
  FaFileInvoice
} from "react-icons/fa";
import { TbCurrencyDollar } from "react-icons/tb";
import { 
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdOutlineSecurity
} from "react-icons/md";
import { Chip, emphasize, styled } from '@mui/material';

// Import de vos composants
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
];

const mockProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    description: 'Ciment Portland de haute qualité pour construction générale',
    stock: 15,
    seuilMin: 20,
    seuilAlerte: 30,
    prixAchat: 35000,
    prixVente: 50000,
    unite: 'sac',
    fournisseur: 'Holcim Madagascar',
    emplacement: 'Entrepôt A, Zone 1',
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
    image: productImages[2]
  }
];

const AjusterStocks = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // États du formulaire
  const [formData, setFormData] = useState({
    dateOperation: new Date().toISOString().split('T')[0],
    quantiteAvant: 0,
    quantiteApres: 0,
    raison: '',
    sousRaison: '',
    commentaire: '',
    emplacement: '',
    reference: '',
    createdBy: 'Admin',
    status: 'pending'
  });

  // États pour l'UI
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Raisons d'ajustement
  const raisons = [
    { value: 'inventaire', label: 'Inventaire physique', icon: <MdOutlineStorage /> },
    { value: 'casse', label: 'Produit cassé/détérioré', icon: <IoWarningOutline /> },
    { value: 'erreur', label: 'Erreur de saisie', icon: <IoInformationCircleOutline /> },
    { value: 'vol', label: 'Vol/perte', icon: <MdOutlineSecurity /> },
    { value: 'don', label: 'Don/production interne', icon: <FaTruck /> },
    { value: 'autre', label: 'Autre raison', icon: <FaClipboardList /> }
  ];

  // Sous-raisons
  const sousRaisons = {
    inventaire: [
      { value: 'différence', label: 'Différence d\'inventaire' },
      { value: 'comptage', label: 'Erreur de comptage' },
      { value: 'unite', label: 'Changement d\'unité' }
    ],
    casse: [
      { value: 'transport', label: 'Cassé lors du transport' },
      { value: 'manutention', label: 'Cassé lors de la manutention' },
      { value: 'defaut', label: 'Défaut de fabrication' },
      { value: 'peremption', label: 'Périmé/détérioré' }
    ],
    erreur: [
      { value: 'saisie', label: 'Erreur de saisie manuelle' },
      { value: 'systeme', label: 'Erreur système' },
      { value: 'commande', label: 'Erreur de commande' }
    ],
    vol: [
      { value: 'interne', label: 'Vol interne' },
      { value: 'externe', label: 'Vol externe' },
      { value: 'non_trouve', label: 'Produit non retrouvé' }
    ],
    don: [
      { value: 'client', label: 'Don à un client' },
      { value: 'employe', label: 'Don à un employé' },
      { value: 'production', label: 'Production interne' },
      { value: 'echantillon', label: 'Échantillon' }
    ],
    autre: [
      { value: 'divers', label: 'Raison diverse' },
      { value: 'speciale', label: 'Circonstance spéciale' }
    ]
  };

  // Formater la monnaie
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  // Calculer la différence
  const calculateDifference = useCallback(() => {
    return formData.quantiteApres - formData.quantiteAvant;
  }, [formData.quantiteApres, formData.quantiteAvant]);

  // Obtenir la couleur de la différence
  const getDifferenceColor = useCallback(() => {
    const diff = calculateDifference();
    if (diff > 0) return 'success';
    if (diff < 0) return 'danger';
    return 'warning';
  }, [calculateDifference]);

  // Obtenir l'icône de la différence
  const getDifferenceIcon = useCallback(() => {
    const diff = calculateDifference();
    if (diff > 0) return 'arrowUp';
    if (diff < 0) return 'arrowDown';
    return 'refresh';
  }, [calculateDifference]);

  // Obtenir le libellé de la différence
  const getDifferenceLabel = useCallback(() => {
    const diff = calculateDifference();
    if (diff > 0) return 'Augmentation';
    if (diff < 0) return 'Diminution';
    return 'Aucun changement';
  }, [calculateDifference]);

  // Générer une référence automatique
  const generateReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const reference = `AJUST-${timestamp}-${randomChars}`;
    setFormData(prev => ({ ...prev, reference }));
  };

  // Charger le produit
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      
      // Vérifier si les données sont passées via le state de navigation
      if (location.state?.productData) {
        const productData = location.state.productData;
        setProduct(productData);
        setFormData(prev => ({
          ...prev,
          quantiteAvant: productData.stock,
          quantiteApres: productData.stock,
          emplacement: productData.emplacement
        }));
      } else {
        // Sinon, chercher dans les données mock
        const productId = parseInt(id);
        const foundProduct = mockProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData(prev => ({
            ...prev,
            quantiteAvant: foundProduct.stock,
            quantiteApres: foundProduct.stock,
            emplacement: foundProduct.emplacement
          }));
        }
      }
      
      // Générer une référence automatique
      generateReference();
      setLoading(false);
    };

    loadProduct();
  }, [id, location.state]);

  // Gérer les changements du formulaire
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur de validation si elle existe
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Réinitialiser la sous-raison si la raison change
    if (name === 'raison') {
      setFormData(prev => ({ ...prev, sousRaison: '' }));
    }
  };

  // Ajuster la quantité
  const adjustQuantity = (amount) => {
    setFormData(prev => ({
      ...prev,
      quantiteApres: Math.max(0, prev.quantiteApres + amount)
    }));
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.raison) {
      errors.raison = 'Veuillez sélectionner une raison';
    }
    
    if (formData.quantiteApres < 0) {
      errors.quantiteApres = 'La quantité ne peut pas être négative';
    }
    
    if (!formData.commentaire) {
      errors.commentaire = 'Veuillez ajouter un commentaire';
    }
    
    if (!formData.reference) {
      errors.reference = 'La référence est requise';
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
      
      const adjustmentData = {
        ...formData,
        productId: product.id,
        productName: product.nom,
        productRef: product.reference,
        difference: calculateDifference(),
        valeurDifference: Math.abs(calculateDifference()) * product.prixAchat,
        date: new Date().toISOString()
      };
      
      console.log('Ajustement créé:', adjustmentData);
      
      // Redirection avec message de succès
      alert('Ajustement de stock créé avec succès!');
      navigate('/stocksAdmin');
      
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      setFormData({
        dateOperation: new Date().toISOString().split('T')[0],
        quantiteAvant: product?.stock || 0,
        quantiteApres: product?.stock || 0,
        raison: '',
        sousRaison: '',
        commentaire: '',
        emplacement: product?.emplacement || '',
        reference: '',
        createdBy: 'Admin',
        status: 'pending'
      });
      generateReference();
      setValidationErrors({});
      setShowPreview(false);
    }
  };

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement du produit...</p>
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
          size="medium"
          icon="back"
          onClick={() => navigate('/stocksAdmin')}
          className={styles.errorButton}
        >
          Retour à la gestion des stocks
        </Button>
      </div>
    );
  }

  const difference = calculateDifference();
  const differenceColor = getDifferenceColor();
  const differenceIcon = getDifferenceIcon();
  const differenceLabel = getDifferenceLabel();
  const valeurDifference = Math.abs(difference) * product.prixAchat;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.formTitle}>
                Ajustement de Stock
                <span className={styles.formSubtitle}>
                  Corrigez manuellement la quantité en stock
                </span>
              </h1>
              
              <div className={styles.headerBadges}>
                <span className={styles.productBadge}>
                  <FaBox /> {product.nom} ({product.reference})
                </span>
                <span className={styles.stockBadge}>
                  <MdOutlineStorage /> Stock actuel: {product.stock} {product.unite}
                </span>
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
                  label="Ajustement de Stock"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>
        
        {/* Informations produit */}
        <div className={styles.productSection}>
          <div className={styles.productCard}>
            <div className={styles.productHeader}>
              <div className={styles.productImage}>
                <img src={product.image} alt={product.nom} />
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.nom}</h3>
                <div className={styles.productDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Référence:</span>
                    <span className={styles.detailValue}>{product.reference}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Catégorie:</span>
                    <span className={styles.detailValue}>{product.categorie}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Unité:</span>
                    <span className={styles.detailValue}>{product.unite}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Prix d'achat:</span>
                    <span className={styles.detailValue}>{formatCurrency(product.prixAchat)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.productStats}>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <MdOutlineStorage />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Stock actuel</div>
                  <div className={styles.statValue}>{product.stock} {product.unite}</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <IoWarningOutline />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Seuil minimum</div>
                  <div className={styles.statValue}>{product.seuilMin} {product.unite}</div>
                </div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIcon}>
                  <TbCurrencyDollar />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statLabel}>Valeur du stock</div>
                  <div className={styles.statValue}>{formatCurrency(product.stock * product.prixAchat)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className={styles.mainForm}>
          <div className={styles.formContent}>
            {/* Section ajustement */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaExchangeAlt /> Détails de l'ajustement
              </h3>
              
              <div className={styles.adjustmentSection}>
                <div className={styles.quantityDisplay}>
                  <div className={styles.quantityColumn}>
                    <label className={styles.quantityLabel}>Quantité actuelle</label>
                    <div className={styles.quantityValue}>{formData.quantiteAvant} {product.unite}</div>
                  </div>
                  
                  <div className={styles.quantityChange}>
                    <div className={`${styles.changeIcon} ${styles[differenceColor]}`}>
                      {differenceIcon === 'arrowUp' && <IoArrowUpOutline />}
                      {differenceIcon === 'arrowDown' && <IoArrowDownOutline />}
                      {differenceIcon === 'refresh' && <IoReloadOutline />}
                    </div>
                    <div className={`${styles.changeValue} ${styles[differenceColor]}`}>
                      {difference > 0 ? '+' : ''}{difference} {product.unite}
                    </div>
                    <div className={styles.changeLabel}>{differenceLabel}</div>
                  </div>
                  
                  <div className={styles.quantityColumn}>
                    <label className={styles.quantityLabel}>Nouvelle quantité *</label>
                    <div className={styles.quantityInput}>
                      <Button 
                        type="button"
                        variant="outline"
                        size="small"
                        icon="minus"
                        onClick={() => adjustQuantity(-1)}
                        className={styles.quantityBtn}
                        disabled={formData.quantiteApres <= 0}
                      />
                      <Input
                        type="number"
                        name="quantiteApres"
                        value={formData.quantiteApres}
                        onChange={(e) => handleChange('quantiteApres', parseInt(e.target.value) || 0)}
                        error={validationErrors.quantiteApres}
                        min="0"
                        step="1"
                        required
                        className={`${styles.quantityInputField} ${validationErrors.quantiteApres ? styles.error : ''}`}
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="small"
                        icon="plus"
                        onClick={() => adjustQuantity(1)}
                        className={styles.quantityBtn}
                      />
                      <span className={styles.quantityUnit}>{product.unite}</span>
                    </div>
                    {validationErrors.quantiteApres && (
                      <div className={styles.errorMessage}>{validationErrors.quantiteApres}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <Input
                    type="date"
                    label="Date d'ajustement"
                    value={formData.dateOperation}
                    onChange={(e) => handleChange('dateOperation', e.target.value)}
                    name="dateOperation"
                    required
                    icon={<IoCalendarOutline />}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="text"
                    label="Emplacement"
                    value={formData.emplacement}
                    onChange={(e) => handleChange('emplacement', e.target.value)}
                    name="emplacement"
                    placeholder="Ex: Entrepôt A, Zone 1"
                    icon={<MdOutlineLocationOn />}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
            
            {/* Section raison */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <FaClipboardList /> Raison de l'ajustement
              </h3>
              
              <div className={styles.reasonSection}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Raison principale *
                    {validationErrors.raison && (
                      <span className={styles.errorText}> {validationErrors.raison}</span>
                    )}
                  </label>
                  <div className={styles.reasonGrid}>
                    {raisons.map(raison => (
                      <button
                        key={raison.value}
                        type="button"
                        className={`${styles.reasonOption} ${
                          formData.raison === raison.value ? styles.selected : ''
                        }`}
                        onClick={() => handleChange('raison', raison.value)}
                      >
                        <div className={styles.reasonIcon}>{raison.icon}</div>
                        <span className={styles.reasonLabel}>{raison.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {formData.raison && sousRaisons[formData.raison] && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Sous-raison (optionnel)</label>
                    <div className={styles.subReasonGrid}>
                      {sousRaisons[formData.raison].map(sousRaison => (
                        <button
                          key={sousRaison.value}
                          type="button"
                          className={`${styles.subReasonOption} ${
                            formData.sousRaison === sousRaison.value ? styles.selected : ''
                          }`}
                          onClick={() => handleChange('sousRaison', sousRaison.value)}
                        >
                          {sousRaison.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Section informations supplémentaires */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <IoDocumentsOutline /> Informations supplémentaires
              </h3>
              
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <div className={styles.referenceSection}>
                    <Input
                      type="text"
                      label="Référence"
                      value={formData.reference}
                      onChange={(e) => handleChange('reference', e.target.value)}
                      name="reference"
                      placeholder="Ex: AJUST-2024-001"
                      error={validationErrors.reference}
                      required
                      icon={<FaFileInvoice />}
                      className={styles.formInput}
                    />
                    <div className={styles.referenceActions}>
                      <Button 
                        variant="outline"
                        size="small"
                        icon="refresh"
                        onClick={generateReference}
                        className={styles.generateBtn}
                      >
                        Générer
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="text"
                    label="Effectué par"
                    value={formData.createdBy}
                    onChange={(e) => handleChange('createdBy', e.target.value)}
                    name="createdBy"
                    readOnly
                    icon={<FaUserCheck />}
                    className={styles.formInput}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputTextarea
                  label="Commentaire détaillé"
                  value={formData.commentaire}
                  onChange={(e) => handleChange('commentaire', e.target.value)}
                  placeholder="Détaillez les raisons de cet ajustement de stock..."
                  rows={4}
                  fullWidth
                  icon={<FaClipboardList />}
                  helperText="Expliquez clairement pourquoi cet ajustement est nécessaire"
                  showCharCount
                  maxLength={500}
                  error={validationErrors.commentaire}
                  required
                  className={styles.commentaireInput}
                />
              </div>
            </div>
            
            {/* Récapitulatif */}
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  <IoCalculatorOutline /> Récapitulatif
                </h3>
                <Button 
                  variant="outline"
                  size="small"
                  icon={showPreview ? "chevronDown" : "chevronDown"}
                  onClick={() => setShowPreview(!showPreview)}
                  className={styles.toggleBtn}
                >
                  {showPreview ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
              
              {showPreview && (
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <h4 className={styles.summaryTitle}>Impact de l'ajustement</h4>
                    <span className={`${styles.differenceBadge} ${styles[differenceColor]}`}>
                      {differenceIcon === 'arrowUp' && <IoArrowUpOutline />}
                      {differenceIcon === 'arrowDown' && <IoArrowDownOutline />}
                      {differenceIcon === 'refresh' && <IoReloadOutline />}
                      {difference > 0 ? '+' : ''}{difference} {product.unite}
                    </span>
                  </div>
                  
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Produit:</span>
                      <span className={styles.summaryValue}>{product.nom}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Référence:</span>
                      <span className={styles.summaryValue}>{formData.reference}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.dateOperation).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Ancien stock:</span>
                      <span className={styles.summaryValue}>{formData.quantiteAvant} {product.unite}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nouveau stock:</span>
                      <span className={styles.summaryValue}>{formData.quantiteApres} {product.unite}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Différence:</span>
                      <span className={`${styles.summaryValue} ${styles[differenceColor]}`}>
                        {difference > 0 ? '+' : ''}{difference} {product.unite}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Valeur du changement:</span>
                      <span className={styles.summaryValue}>{formatCurrency(valeurDifference)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Raison:</span>
                      <span className={styles.summaryValue}>
                        {raisons.find(r => r.value === formData.raison)?.label || 'Non spécifiée'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.summaryWarning}>
                    <IoWarningOutline />
                    <div className={styles.warningContent}>
                      <h4 className={styles.warningTitle}>Attention importante</h4>
                      <p className={styles.warningText}>
                        Les ajustements de stock modifient directement l'inventaire. Cette action est irréversible et doit être justifiée.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions du formulaire */}
          <div className={styles.formActions}>
            <div className={styles.actionsLeft}>
              <Button 
                variant="secondary"
                size="medium"
                icon="undo"
                onClick={handleReset}
                className={styles.btnSecondary}
              >
                Réinitialiser
              </Button>
              <Button 
                variant="outline"
                size="medium"
                onClick={() => navigate('/stocksAdmin')}
                className={styles.btnOutline}
              >
                Annuler
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              <Button 
                variant="outline"
                size="medium"
                icon={showPreview ? "eyeOff" : "eye"}
                onClick={() => setShowPreview(!showPreview)}
                className={styles.btnPreview}
              >
                {showPreview ? 'Masquer aperçu' : 'Aperçu'}
              </Button>
              <Button 
                variant="warning"
                size="medium"
                icon="exchangeAlt"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                className={`${styles.btnPrimary} ${isSubmitting ? styles.loading : ''}`}
              >
                {isSubmitting ? 'Enregistrement...' : 'Confirmer l\'ajustement'}
              </Button>
            </div>
          </div>
        </form>
        
        {/* Pied de page */}
        <div className={styles.formFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.infoItem}>
              <IoWarningOutline />
              <span>Les ajustements de stock sont audités et traçables</span>
            </div>
            <div className={styles.infoItem}>
              <FaFileInvoice />
              <span>Une référence unique est générée pour chaque ajustement</span>
            </div>
          </div>
        </div>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default AjusterStocks;