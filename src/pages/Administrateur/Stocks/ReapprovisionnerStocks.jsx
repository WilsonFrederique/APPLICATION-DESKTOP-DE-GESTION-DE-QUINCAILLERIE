// ReapprovisionnerStocks.jsx - Version corrigée
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './ReapprovisionnerStocks.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoEyeOutline,
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
  IoReloadOutline,
  IoTimeOutline,
  IoDocumentsOutline,
  IoAlertCircleOutline,
  IoSearchOutline,
  IoCalendarOutline // Ajouté ici
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaBarcode,
  FaClipboardList,
  FaRegSave,
  FaUsers
} from "react-icons/fa";
import { 
  TbCategory, 
  TbCurrencyDollar,
} from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { CiMoneyBill, CiDeliveryTruck } from "react-icons/ci";
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

// Données mock pour la démonstration
const mockProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    description: 'Ciment Portland de haute qualité pour construction générale.',
    stock: 15,
    seuilMin: 50,
    seuilAlerte: 100,
    prixAchat: 35000,
    prixVente: 50000,
    unite: 'sac',
    fournisseur: 'Holcim Madagascar',
    emplacement: 'Entrepôt A, Zone 1, Rack 3',
    delaiLivraison: '3-5 jours',
    dateCreation: '2024-03-15',
    creerPar: 'Admin',
    derniereModification: '2024-03-25T10:30:00',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    nom: 'Tôle Galvanisée 3m',
    reference: 'TOL-GALV-3M',
    categorie: 'Ferronnerie',
    description: 'Tôle galvanisée de 3m, épaisseur 0.5mm',
    stock: 8,
    seuilMin: 25,
    seuilAlerte: 50,
    prixAchat: 250000,
    prixVente: 300000,
    unite: 'feuille',
    fournisseur: 'Metaltron',
    emplacement: 'Entrepôt B, Zone 3',
    delaiLivraison: '2-3 jours',
    dateCreation: '2024-02-20',
    creerPar: 'Admin',
    derniereModification: '2024-03-22T14:15:00',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  }
];

const mockSuppliers = [
  {
    id: 1,
    nom: 'Holcim Madagascar',
    contact: '034 12 345 67',
    email: 'contact@holcim.mg',
    adresse: 'Lot II K 34 Bis, Antananarivo',
    delaiLivraisonMoyen: '3-5 jours',
    conditionsPaiement: '30 jours fin de mois',
    rating: 4.5,
    notes: 'Fournisseur fiable, produits de qualité'
  },
  {
    id: 2,
    nom: 'Metaltron',
    contact: '020 22 333 44',
    email: 'info@metaltron.mg',
    adresse: 'Zone Industrielle, Antsirabe',
    delaiLivraisonMoyen: '2-3 jours',
    conditionsPaiement: '50% à la commande, 50% à la livraison',
    rating: 4.2,
    notes: 'Spécialiste ferronnerie'
  },
  {
    id: 3,
    nom: 'Bricodépôt',
    contact: '032 11 222 33',
    email: 'ventes@bricodepot.mg',
    adresse: 'Route Circulaire, Tanjombato',
    delaiLivraisonMoyen: '24h',
    conditionsPaiement: 'Comptant',
    rating: 4.7,
    notes: 'Large gamme disponible'
  },
  {
    id: 4,
    nom: 'ElectroPlus',
    contact: '033 55 666 77',
    email: 'electro@plus.mg',
    adresse: 'Analakely, Antananarivo',
    delaiLivraisonMoyen: '1 semaine',
    conditionsPaiement: '60 jours',
    rating: 3.8,
    notes: 'Matériel électrique'
  }
];

// Composant pour les étapes du réapprovisionnement
const StepIndicator = ({ currentStep, totalSteps, steps, onStepClick }) => {
  return (
    <div className={styles.stepIndicator}>
      <div className={styles.stepProgressBar}>
        <div 
          className={styles.stepProgressFill}
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      <div className={styles.stepDots}>
        {steps.map((step) => (
          <button
            key={step.id}
            className={`${styles.stepDot} ${
              currentStep === step.id ? styles.active : 
              currentStep > step.id ? styles.completed : ''
            }`}
            onClick={() => onStepClick(step.id)}
            disabled={step.id > currentStep}
          >
            <div className={styles.stepDotNumber}>{step.id}</div>
            <div className={styles.stepDotLabel}>{step.label}</div>
            {currentStep > step.id && (
              <div className={styles.stepDotCheck}>
                <IoCheckmarkCircleOutline />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const ReapprovisionnerStocks = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // États principaux
  const [currentStep, setCurrentStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // États du formulaire
  const [formData, setFormData] = useState({
    productId: '',
    quantite: 1,
    prixUnitaire: 0,
    fournisseurId: '',
    referenceCommande: '',
    dateLivraisonPrevue: '',
    conditionsPaiement: '',
    notes: '',
    fraisTransport: 0,
    tvaApplicable: true,
    tauxTVA: 20,
    dateCommande: new Date().toISOString().split('T')[0]
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  
  // Données statiques
  const conditionsPaiementOptions = [
    { value: 'comptant', label: 'Paiement comptant' },
    { value: '30j_fdm', label: '30 jours fin de mois' },
    { value: '60j', label: '60 jours' },
    { value: 'acompte', label: 'Acompte 50%' },
    { value: 'livraison', label: 'Paiement à la livraison' }
  ];
  
  const steps = [
    { id: 1, label: 'Sélection Produit', icon: <FaBox /> },
    { id: 2, label: 'Choix Fournisseur', icon: <FaTruck /> },
    { id: 3, label: 'Détails Commande', icon: <IoDocumentsOutline /> },
    { id: 4, label: 'Validation', icon: <IoCheckmarkCircleOutline /> }
  ];
  
  // Fonction utilitaire pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculer la date de livraison par défaut (7 jours)
  const getDefaultDeliveryDate = useCallback(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }, []);
  
  // Calculs
  const calculateSousTotal = () => {
    return formData.quantite * formData.prixUnitaire;
  };
  
  const calculateTVA = () => {
    if (formData.tvaApplicable) {
      return calculateSousTotal() * (formData.tauxTVA / 100);
    }
    return 0;
  };
  
  const calculateTotal = () => {
    return calculateSousTotal() + calculateTVA() + parseFloat(formData.fraisTransport || 0);
  };
  
  // Charger les données du produit
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      
      // Vérifier si l'ID est passé dans l'URL
      if (id) {
        const productId = parseInt(id);
        const foundProduct = mockProducts.find(p => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setFormData(prev => ({
            ...prev,
            productId: foundProduct.id,
            prixUnitaire: foundProduct.prixAchat,
            quantite: Math.max(10, foundProduct.seuilMin - foundProduct.stock)
          }));
          
          // Trouver le fournisseur par défaut
          const defaultSupplier = mockSuppliers.find(s => s.nom === foundProduct.fournisseur);
          if (defaultSupplier) {
            setSelectedSupplier(defaultSupplier);
            setFormData(prev => ({
              ...prev,
              fournisseurId: defaultSupplier.id.toString()
            }));
          }
        }
      }
      
      // Vérifier si les données sont passées via le state de navigation
      if (location.state?.productData) {
        const productData = location.state.productData;
        setProduct(productData);
        setFormData(prev => ({
          ...prev,
          productId: productData.id,
          prixUnitaire: productData.prixAchat,
          quantite: Math.max(10, productData.seuilMin - productData.stock)
        }));
        
        const defaultSupplier = mockSuppliers.find(s => s.nom === productData.fournisseur);
        if (defaultSupplier) {
          setSelectedSupplier(defaultSupplier);
          setFormData(prev => ({
            ...prev,
            fournisseurId: defaultSupplier.id.toString()
          }));
        }
      }
      
      setLoading(false);
    };
    
    loadData();
  }, [id, location.state]);
  
  // Initialiser la date de livraison
  useEffect(() => {
    if (!formData.dateLivraisonPrevue) {
      const defaultDate = getDefaultDeliveryDate();
      setFormData(prev => ({
        ...prev,
        dateLivraisonPrevue: defaultDate
      }));
    }
  }, [formData.dateLivraisonPrevue, getDefaultDeliveryDate]);
  
  // Gestion des changements de formulaire
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Si changement de fournisseur, mettre à jour les infos
    if (name === 'fournisseurId') {
      const supplier = mockSuppliers.find(s => s.id === parseInt(value));
      if (supplier) {
        setSelectedSupplier(supplier);
      }
    }
  };
  
  // Validation des étapes
  const validateStep = (step) => {
    const errors = {};
    let isValid = true;
    
    switch(step) {
      case 1:
        if (!formData.productId) {
          errors.productId = 'Veuillez sélectionner un produit';
          isValid = false;
        }
        if (formData.quantite <= 0) {
          errors.quantite = 'La quantité doit être positive';
          isValid = false;
        }
        if (formData.prixUnitaire <= 0) {
          errors.prixUnitaire = 'Le prix unitaire doit être positif';
          isValid = false;
        }
        break;
        
      case 2:
        if (!formData.fournisseurId) {
          errors.fournisseurId = 'Veuillez sélectionner un fournisseur';
          isValid = false;
        }
        break;
        
      case 3:
        if (!formData.referenceCommande) {
          errors.referenceCommande = 'La référence de commande est requise';
          isValid = false;
        }
        if (!formData.dateLivraisonPrevue) {
          errors.dateLivraisonPrevue = 'La date de livraison prévue est requise';
          isValid = false;
        }
        break;
        
      default:
        isValid = true;
    }
    
    setValidationErrors(errors);
    return isValid;
  };
  
  // Gestion des quantités
  const handleQuantityChange = (amount) => {
    const newQuantity = Math.max(1, formData.quantite + amount);
    setFormData(prev => ({ ...prev, quantite: newQuantity }));
  };
  
  // Navigation entre les étapes
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const goToStep = (step) => {
    if (step <= currentStep && validateStep(currentStep)) {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider toutes les étapes
    let allValid = true;
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        allValid = false;
      }
    }
    
    if (!allValid) {
      alert('Veuillez corriger toutes les erreurs avant de soumettre la commande.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Commande de réapprovisionnement:', {
        ...formData,
        supplier: selectedSupplier,
        product: product,
        total: calculateTotal()
      });
      
      // Afficher message de succès
      alert(`Commande de réapprovisionnement créée avec succès!\nRéférence: ${formData.referenceCommande}\nMontant total: ${formatCurrency(calculateTotal())}`);
      
      // Redirection
      navigate('/stocksAdmin');
      
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Générer une référence de commande
  const generateReference = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const reference = `CMD-REAPP-${timestamp}-${randomChars}`;
    setFormData(prev => ({ ...prev, referenceCommande: reference }));
    setValidationErrors(prev => ({ ...prev, referenceCommande: '' }));
  };
  
  // Rendu conditionnel par étape
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <FaBox /> Sélection du Produit
              </h3>
              <p className={styles.stepDescription}>
                Choisissez le produit à réapprovisionner
              </p>
            </div>
            
            <div className={styles.productSelection}>
              {product ? (
                <div className={styles.selectedProductCard}>
                  <div className={styles.productImageSection}>
                    <img 
                      src={product.image} 
                      alt={product.nom}
                      className={styles.productImage}
                    />
                    <div className={styles.productStockInfo}>
                      <div className={styles.stockIndicator}>
                        <span className={styles.stockLabel}>Stock actuel:</span>
                        <span className={`${styles.stockValue} ${product.stock < product.seuilMin ? styles.critical : styles.normal}`}>
                          {product.stock} {product.unite}
                        </span>
                      </div>
                      <div className={styles.stockIndicator}>
                        <span className={styles.stockLabel}>Seuil minimum:</span>
                        <span className={styles.stockValue}>{product.seuilMin} {product.unite}</span>
                      </div>
                      <div className={styles.stockIndicator}>
                        <span className={styles.stockLabel}>Quantité recommandée:</span>
                        <span className={styles.stockValue}>
                          {Math.max(10, product.seuilMin - product.stock)} {product.unite}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.productDetails}>
                    <h4 className={styles.productName}>{product.nom}</h4>
                    <div className={styles.productMeta}>
                      <span className={styles.productRef}>
                        <FaBarcode /> {product.reference}
                      </span>
                      <span className={styles.productCategory}>
                        <TbCategory /> {product.categorie}
                      </span>
                    </div>
                    
                    <div className={styles.productStats}>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Prix d'achat habituel</div>
                        <div className={styles.statValue}>{formatCurrency(product.prixAchat)}</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Prix de vente</div>
                        <div className={styles.statValue}>{formatCurrency(product.prixVente)}</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Fournisseur habituel</div>
                        <div className={styles.statValue}>{product.fournisseur}</div>
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Quantité à commander *
                        {validationErrors.quantite && (
                          <span className={styles.errorText}> {validationErrors.quantite}</span>
                        )}
                      </label>
                      <div className={styles.quantityInput}>
                        <Button 
                          type="button"
                          variant="outline"
                          size="small"
                          icon="minus"
                          onClick={() => handleQuantityChange(-1)}
                          className={styles.quantityBtn}
                        />
                        <Input
                          type="number"
                          name="quantite"
                          value={formData.quantite}
                          onChange={(e) => handleChange('quantite', parseInt(e.target.value) || 1)}
                          min="1"
                          step="1"
                          required
                          error={validationErrors.quantite}
                          className={styles.quantityInputField}
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          size="small"
                          icon="plus"
                          onClick={() => handleQuantityChange(1)}
                          className={styles.quantityBtn}
                        />
                        <span className={styles.quantityUnit}>{product.unite}</span>
                      </div>
                      <div className={styles.quantitySuggestions}>
                        <Button 
                          type="button"
                          variant="outline"
                          size="small"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            quantite: Math.max(1, product.seuilMin - product.stock) 
                          }))}
                          className={styles.suggestionBtn}
                        >
                          Pour atteindre le seuil ({Math.max(1, product.seuilMin - product.stock)})
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="small"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            quantite: Math.max(1, product.seuilAlerte - product.stock) 
                          }))}
                          className={styles.suggestionBtn}
                        >
                          Pour atteindre l'alerte ({Math.max(1, product.seuilAlerte - product.stock)})
                        </Button>
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <Input
                        type="number"
                        label="Prix unitaire"
                        value={formData.prixUnitaire}
                        onChange={(e) => handleChange('prixUnitaire', parseFloat(e.target.value) || 0)}
                        name="prixUnitaire"
                        min="0"
                        step="100"
                        required
                        error={validationErrors.prixUnitaire}
                        icon={<TbCurrencyDollar />}
                        className={styles.formInput}
                      />
                      <div className={styles.priceSuggestions}>
                        <span>Prix habituel: {formatCurrency(product.prixAchat)}</span>
                        <Button 
                          type="button"
                          variant="outline"
                          size="small"
                          onClick={() => setFormData(prev => ({ ...prev, prixUnitaire: product.prixAchat }))}
                          className={styles.suggestionBtnSmall}
                        >
                          Utiliser
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.noProductSelected}>
                  <FaBox className={styles.noProductIcon} />
                  <h4 className={styles.noProductTitle}>Aucun produit sélectionné</h4>
                  <p className={styles.noProductText}>
                    Sélectionnez un produit à réapprovisionner depuis la liste des stocks.
                  </p>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="search"
                    onClick={() => navigate('/stocksAdmin')}
                    className={styles.primaryBtn}
                  >
                    Aller aux stocks
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <FaTruck /> Choix du Fournisseur
              </h3>
              <p className={styles.stepDescription}>
                Sélectionnez le fournisseur pour cette commande
              </p>
            </div>
            
            <div className={styles.supplierSelection}>
              <div className={styles.formGroup}>
                <InputSelect
                  label="Fournisseur"
                  value={formData.fournisseurId}
                  onChange={(value) => handleChange('fournisseurId', value)}
                  options={[
                    { value: '', label: 'Sélectionner un fournisseur' },
                    ...mockSuppliers.map(supplier => ({
                      value: supplier.id.toString(),
                      label: `${supplier.nom} - ${supplier.contact} (${supplier.delaiLivraisonMoyen})`
                    }))
                  ]}
                  error={validationErrors.fournisseurId}
                  required
                  searchable
                  icon={<FaTruck />}
                  size="medium"
                  variant="outline"
                  fullWidth
                />
              </div>
              
              {selectedSupplier && (
                <div className={styles.supplierDetailsCard}>
                  <div className={styles.supplierHeader}>
                    <div className={styles.supplierInfo}>
                      <h4 className={styles.supplierName}>{selectedSupplier.nom}</h4>
                      <div className={styles.supplierMeta}>
                        <span className={styles.supplierContact}>
                          <FaUsers /> {selectedSupplier.contact}
                        </span>
                        <span className={styles.supplierEmail}>
                          <IoInformationCircleOutline /> {selectedSupplier.email}
                        </span>
                      </div>
                    </div>
                    <div className={styles.supplierRating}>
                      <div className={styles.ratingStars}>
                        {'★'.repeat(Math.floor(selectedSupplier.rating))}
                        {'☆'.repeat(5 - Math.floor(selectedSupplier.rating))}
                      </div>
                      <span className={styles.ratingValue}>{selectedSupplier.rating}/5</span>
                    </div>
                  </div>
                  
                  <div className={styles.supplierBody}>
                    <div className={styles.supplierStats}>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <CiDeliveryTruck />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statLabel}>Délai livraison</div>
                          <div className={styles.statValue}>{selectedSupplier.delaiLivraisonMoyen}</div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <CiMoneyBill />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statLabel}>Conditions paiement</div>
                          <div className={styles.statValue}>{selectedSupplier.conditionsPaiement}</div>
                        </div>
                      </div>
                      <div className={styles.statItem}>
                        <div className={styles.statIcon}>
                          <MdOutlineLocationOn />
                        </div>
                        <div className={styles.statContent}>
                          <div className={styles.statLabel}>Adresse</div>
                          <div className={styles.statValue}>{selectedSupplier.adresse}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.supplierNotes}>
                      <div className={styles.notesHeader}>
                        <IoInformationCircleOutline />
                        <span>Notes sur le fournisseur</span>
                      </div>
                      <div className={styles.notesContent}>
                        {selectedSupplier.notes}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Conditions de paiement"
                  value={formData.conditionsPaiement}
                  onChange={(value) => handleChange('conditionsPaiement', value)}
                  options={[
                    { value: '', label: 'Utiliser les conditions du fournisseur' },
                    ...conditionsPaiementOptions.map(option => ({
                      value: option.value,
                      label: option.label
                    }))
                  ]}
                  searchable
                  icon={<CiMoneyBill />}
                  size="medium"
                  variant="outline"
                  fullWidth
                />
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoDocumentsOutline /> Détails de la Commande
              </h3>
              <p className={styles.stepDescription}>
                Complétez les informations de la commande
              </p>
            </div>
            
            <div className={styles.orderDetails}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <div className={styles.referenceSection}>
                    <Input
                      type="text"
                      label="Référence commande"
                      value={formData.referenceCommande}
                      onChange={(e) => handleChange('referenceCommande', e.target.value)}
                      name="referenceCommande"
                      placeholder="Ex: CMD-2024-001"
                      error={validationErrors.referenceCommande}
                      required
                      icon={<FaClipboardList />}
                      className={styles.formInput}
                      helperText="Référence unique pour cette commande"
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
                    type="date"
                    label="Date de commande"
                    value={formData.dateCommande}
                    onChange={(e) => handleChange('dateCommande', e.target.value)}
                    name="dateCommande"
                    required
                    icon={<IoTimeOutline />}
                    className={styles.formInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="date"
                    label="Date livraison prévue"
                    value={formData.dateLivraisonPrevue}
                    onChange={(e) => handleChange('dateLivraisonPrevue', e.target.value)}
                    name="dateLivraisonPrevue"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    error={validationErrors.dateLivraisonPrevue}
                    icon={<IoCalendarOutline />}
                    className={styles.formInput}
                    helperText={`Délai estimé du fournisseur: ${selectedSupplier?.delaiLivraisonMoyen || 'Non spécifié'}`}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="number"
                    label="Frais de transport"
                    value={formData.fraisTransport}
                    onChange={(e) => handleChange('fraisTransport', parseFloat(e.target.value) || 0)}
                    name="fraisTransport"
                    min="0"
                    step="1000"
                    icon={<CiDeliveryTruck />}
                    className={styles.formInput}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputTextarea
                  label="Notes supplémentaires"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Instructions spéciales, détails sur la livraison, notes pour le service achat..."
                  rows={4}
                  fullWidth
                  icon={<IoInformationCircleOutline />}
                  helperText="Informations complémentaires pour le service achats"
                  showCharCount
                  maxLength={1000}
                  className={styles.notesInput}
                />
              </div>
              
              <div className={styles.taxSection}>
                <div className={styles.formGroup}>
                  <InputTogglerIcons
                    label="TVA applicable"
                    checked={formData.tvaApplicable}
                    onChange={(e) => handleChange('tvaApplicable', e.target.checked)}
                    name="tvaApplicable"
                    showIcons
                    color="blue"
                    size="medium"
                  />
                </div>
                
                {formData.tvaApplicable && (
                  <div className={styles.taxRate}>
                    <label className={styles.formLabel}>
                      Taux de TVA (%)
                    </label>
                    <div className={styles.taxRateGrid}>
                      {[5, 10, 20].map(rate => (
                        <Button
                          key={rate}
                          type="button"
                          variant={formData.tauxTVA == rate ? "primary" : "outline"}
                          size="small"
                          onClick={() => handleChange('tauxTVA', rate)}
                          className={`${styles.taxRateBtn} ${
                            formData.tauxTVA == rate ? styles.selected : ''
                          }`}
                        >
                          {rate}%
                        </Button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      name="tauxTVA"
                      value={formData.tauxTVA}
                      onChange={(e) => handleChange('tauxTVA', parseFloat(e.target.value) || 0)}
                      min="0"
                      max="100"
                      step="0.5"
                      icon={<CiMoneyBill />}
                      className={styles.formInput}
                    />
                  </div>
                )}
              </div>
              
              {/* Résumé de la commande */}
              <div className={styles.orderSummaryPreview}>
                <h4 className={styles.summaryTitle}>
                  <FaClipboardList /> Résumé de la commande
                </h4>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Produit:</span>
                    <span className={styles.summaryValue}>{product?.nom}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Quantité:</span>
                    <span className={styles.summaryValue}>{formData.quantite} {product?.unite}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Prix unitaire:</span>
                    <span className={styles.summaryValue}>{formatCurrency(formData.prixUnitaire)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Sous-total:</span>
                    <span className={styles.summaryValue}>{formatCurrency(calculateSousTotal())}</span>
                  </div>
                  {formData.tvaApplicable && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>TVA ({formData.tauxTVA}%):</span>
                      <span className={styles.summaryValue}>{formatCurrency(calculateTVA())}</span>
                    </div>
                  )}
                  {formData.fraisTransport > 0 && (
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Frais transport:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.fraisTransport)}</span>
                    </div>
                  )}
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total commande:</span>
                    <span className={`${styles.summaryValue} ${styles.total}`}>
                      {formatCurrency(calculateTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoCheckmarkCircleOutline /> Validation finale
              </h3>
              <p className={styles.stepDescription}>
                Vérifiez les informations avant de créer la commande
              </p>
            </div>
            
            <div className={styles.validationContent}>
              <div className={styles.orderSummaryCard}>
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <FaBox /> Détails du produit
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Produit:</span>
                      <span className={styles.summaryValue}>{product?.nom}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Référence:</span>
                      <span className={styles.summaryValue}>{product?.reference}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Quantité:</span>
                      <span className={styles.summaryValue}>{formData.quantite} {product?.unite}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Prix unitaire:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.prixUnitaire)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Sous-total:</span>
                      <span className={styles.summaryValue}>{formatCurrency(calculateSousTotal())}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <FaTruck /> Fournisseur
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nom:</span>
                      <span className={styles.summaryValue}>{selectedSupplier?.nom}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Contact:</span>
                      <span className={styles.summaryValue}>{selectedSupplier?.contact}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Délai livraison:</span>
                      <span className={styles.summaryValue}>{selectedSupplier?.delaiLivraisonMoyen}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Conditions paiement:</span>
                      <span className={styles.summaryValue}>
                        {formData.conditionsPaiement || selectedSupplier?.conditionsPaiement}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoDocumentsOutline /> Informations commande
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Référence:</span>
                      <span className={styles.summaryValue}>{formData.referenceCommande}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date commande:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.dateCommande).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Livraison prévue:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.dateLivraisonPrevue).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>TVA:</span>
                      <span className={styles.summaryValue}>
                        {formData.tvaApplicable ? `${formData.tauxTVA}%` : 'Non applicable'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Frais transport:</span>
                      <span className={styles.summaryValue}>
                        {formatCurrency(formData.fraisTransport)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <TbCurrencyDollar /> Récapitulatif financier
                  </h4>
                  <div className={styles.financialSummary}>
                    <div className={styles.financialRow}>
                      <span className={styles.financialLabel}>Sous-total:</span>
                      <span className={styles.financialValue}>{formatCurrency(calculateSousTotal())}</span>
                    </div>
                    {formData.tvaApplicable && (
                      <div className={styles.financialRow}>
                        <span className={styles.financialLabel}>TVA ({formData.tauxTVA}%):</span>
                        <span className={styles.financialValue}>{formatCurrency(calculateTVA())}</span>
                    </div>
                    )}
                    {formData.fraisTransport > 0 && (
                      <div className={styles.financialRow}>
                        <span className={styles.financialLabel}>Frais transport:</span>
                        <span className={styles.financialValue}>{formatCurrency(formData.fraisTransport)}</span>
                      </div>
                    )}
                    <div className={styles.financialRowTotal}>
                      <span className={styles.financialLabel}>Total à payer:</span>
                      <span className={styles.financialValueTotal}>{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {formData.notes && (
                <div className={styles.notesCard}>
                  <h4 className={styles.notesTitle}>
                    <IoInformationCircleOutline /> Notes supplémentaires
                  </h4>
                  <div className={styles.notesContent}>
                    {formData.notes}
                  </div>
                </div>
              )}
              
              <div className={styles.validationAlert}>
                <IoAlertCircleOutline />
                <div className={styles.alertContent}>
                  <h4 className={styles.alertTitle}>Validation requise</h4>
                  <p className={styles.alertText}>
                    En validant cette commande, vous créez une demande de réapprovisionnement qui sera 
                    envoyée au service achats pour traitement. Vérifiez bien toutes les informations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className={styles.reapproContainer}>
      <div className={styles.reapproWrapper}>
        {/* Header */}
        <div className={styles.reapproHeader}>
          <div className={styles.headerContent}>
            <Button 
              variant="outline"
              size="medium"
              icon="back"
              onClick={() => navigate('/stocksAdmin')}
              className={styles.backBtn}
            >
              Retour aux stocks
            </Button>
            
            <div className={styles.headerText}>
              <h1 className={styles.reapproTitle}>
                Réapprovisionnement de Stock
                <span className={styles.reapproSubtitle}>
                  {product ? `Pour: ${product.nom}` : 'Commander de nouveaux produits'}
                </span>
              </h1>
              
              <div className={styles.headerBadges}>
                {product && product.stock < product.seuilMin && (
                  <span className={styles.alertBadge}>
                    <IoAlertCircleOutline /> Stock critique
                  </span>
                )}
                <span className={styles.stepBadge}>
                  Étape {currentStep} sur {steps.length}
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
                  label="Réapprovisionner"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>
        
        {/* Indicateur d'étapes */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={goToStep}
        />
        
        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className={styles.mainForm}>
          {renderStepContent()}
          
          {/* Actions de navigation */}
          <div className={styles.formActions}>
            <div className={styles.actionsLeft}>
              {currentStep > 1 && (
                <Button
                  variant="secondary"
                  size="medium"
                  icon="arrowBackCircle"
                  onClick={prevStep}
                  className={styles.btnSecondary}
                >
                  Précédent
                </Button>
              )}
              
              <Button
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire?')) {
                    setFormData({
                      productId: product?.id || '',
                      quantite: product ? Math.max(10, product.seuilMin - product.stock) : 1,
                      prixUnitaire: product?.prixAchat || 0,
                      fournisseurId: '',
                      referenceCommande: '',
                      dateLivraisonPrevue: getDefaultDeliveryDate(),
                      conditionsPaiement: '',
                      notes: '',
                      fraisTransport: 0,
                      tvaApplicable: true,
                      tauxTVA: 20,
                      dateCommande: new Date().toISOString().split('T')[0]
                    });
                    setValidationErrors({});
                  }
                }}
                className={styles.btnReset}
              >
                Réinitialiser
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              {currentStep < steps.length && (
                <Button
                  variant="primary"
                  size="medium"
                  icon="arrowForwardCircle"
                  onClick={nextStep}
                  className={styles.btnPrimary}
                  iconPosition="right"
                >
                  Suivant
                </Button>
              )}
              
              {currentStep === steps.length && (
                <Button
                  variant="success"
                  size="medium"
                  icon="save"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className={styles.btnSuccess}
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer la commande'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className={styles.formInfo}>
            <div className={styles.infoItem}>
              <IoInformationCircleOutline />
              <span>Toutes les commandes sont soumises à validation par le service achats.</span>
            </div>
            <div className={styles.infoItem}>
              <IoTimeOutline />
              <span>Délai moyen de traitement: 24-48 heures</span>
            </div>
          </div>
        </form>
        
        {/* Pied de page */}
        <div className={styles.reapproFooter}>
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
              size="small"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.footerBtn}
            >
              Haut de page
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="eye"
              onClick={() => setShowPreview(!showPreview)}
              className={styles.footerBtn}
            >
              {showPreview ? 'Masquer aperçu' : 'Aperçu bon de commande'}
            </Button>
          </div>
        </div>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default ReapprovisionnerStocks;