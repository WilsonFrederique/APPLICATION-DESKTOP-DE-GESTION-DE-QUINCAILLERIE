// FrmFournisseurs.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './FrmFournisseurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputFile from '../../../components/Input/InputFile';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import Button from '../../../components/Button/Button';
import { 
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoBusinessOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoDocumentTextOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoRefreshOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAddOutline,
  IoCloudUploadOutline,
  IoCloudDoneOutline,
  IoShareOutline,
  IoStatsChartOutline,
  IoCartOutline,
  IoCashOutline,
  IoStarOutline,
  IoStar,
  IoPencilOutline,
  IoLockClosedOutline,
  IoCheckmarkOutline,
  IoCloseCircleOutline,
  IoDuplicateOutline,
  IoArchiveOutline
} from "react-icons/io5";
import { 
  FaTruck, 
  FaMoneyBillWave, 
  FaBalanceScale,
  FaChartLine,
  FaUsers,
  FaBoxOpen,
  FaRegCreditCard,
  FaClipboardCheck,
  FaBuilding,
  FaPhoneAlt,
  FaAddressCard
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCurrencyDollar, 
  TbTruckDelivery,
  TbCategory,
  TbPercentage,
  TbReceipt
} from "react-icons/tb";
import { 
  MdInventory, 
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlinePayment,
  MdOutlineSecurity,
  MdOutlineContactPhone,
  MdOutlineStorefront
} from "react-icons/md";
import { CiMoneyBill, CiSettings, CiCreditCard1 } from "react-icons/ci";
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

// Données mock pour la simulation
const mockSuppliers = [
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
    preferredPaymentMethod: 'bank_transfer',
    bankAccount: 'BNI Madagascar - 123456789',
    creditLimit: 5000000,
    currentCredit: 1250000,
    logo: null,
    dateCreated: '2023-01-15',
    createdBy: 'Admin',
    lastModified: '2024-03-25T10:30:00',
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
    preferredPaymentMethod: 'check',
    bankAccount: 'BOA Madagascar - 987654321',
    creditLimit: 3000000,
    currentCredit: 0,
    logo: null,
    dateCreated: '2023-02-20',
    createdBy: 'Admin',
    lastModified: '2024-03-22T14:15:00'
  }
];

// Composant pour chaque étape du formulaire
const StepIndicator = ({ currentStep, totalSteps, steps, onStepClick, stepValidations }) => {
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
            aria-label={`Étape ${step.id}: ${step.label}`}
            aria-current={currentStep === step.id ? 'step' : undefined}
          >
            <div className={styles.stepDotNumber}>
              {stepValidations[step.id] && step.id < currentStep ? (
                <IoCheckmarkCircleOutline />
              ) : (
                step.id
              )}
            </div>
            <div className={styles.stepDotLabel}>{step.label}</div>
            {stepValidations[step.id] && step.id < currentStep && (
              <div className={styles.stepDotCheck} aria-hidden="true">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant de formulaire avec pagination par étapes
const FrmFournisseurs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    name: '',
    category: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    logo: null,
    
    // Contact principal
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    
    // Informations légales
    taxId: '',
    legalForm: 'SARL',
    registrationDate: '',
    
    // Conditions commerciales
    paymentTerms: '30',
    deliveryTime: '3',
    preferredPaymentMethod: 'bank_transfer',
    bankAccount: '',
    creditLimit: 0,
    currentCredit: 0,
    
    // Évaluation
    rating: 0,
    reliability: 0,
    notes: '',
    
    // Statut
    status: 'active',
    
    // Métadonnées
    dateCreated: new Date().toISOString().split('T')[0],
    createdBy: 'Admin',
    lastModified: new Date().toISOString(),
  });

  // États pour l'UI
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stepValidations, setStepValidations] = useState({
    1: false, 2: false, 3: false, 4: true, 5: true, 6: true
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ratingStars, setRatingStars] = useState(0);

  // Données statiques
  const categories = [
    { value: 'Matériaux Construction', label: 'Matériaux Construction' },
    { value: 'Ferronnerie', label: 'Ferronnerie' },
    { value: 'Quincaillerie', label: 'Quincaillerie' },
    { value: 'Peinture', label: 'Peinture' },
    { value: 'Plomberie', label: 'Plomberie' },
    { value: 'Électricité', label: 'Électricité' },
    { value: 'Outillage', label: 'Outillage' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Services', label: 'Services' },
    { value: 'Divers', label: 'Divers' }
  ];

  const legalForms = [
    { value: 'SARL', label: 'SARL' },
    { value: 'SA', label: 'SA' },
    { value: 'EURL', label: 'EURL' },
    { value: 'SNC', label: 'SNC' },
    { value: 'SCS', label: 'SCS' },
    { value: 'SCA', label: 'SCA' },
    { value: 'GIE', label: 'GIE' },
    { value: 'Entreprise Individuelle', label: 'Entreprise Individuelle' },
    { value: 'Autre', label: 'Autre' }
  ];

  const paymentTermsOptions = [
    { value: '0', label: 'Comptant' },
    { value: '7', label: '7 jours' },
    { value: '15', label: '15 jours' },
    { value: '30', label: '30 jours' },
    { value: '45', label: '45 jours' },
    { value: '60', label: '60 jours' },
    { value: '90', label: '90 jours' }
  ];

  const deliveryTimeOptions = [
    { value: '1', label: '24 heures' },
    { value: '2', label: '2-3 jours' },
    { value: '3', label: '3-5 jours' },
    { value: '5', label: '5-7 jours' },
    { value: '7', label: '1 semaine' },
    { value: '14', label: '2 semaines' },
    { value: '30', label: '1 mois' },
    { value: '0', label: 'Sur commande' }
  ];

  const paymentMethods = [
    { value: 'bank_transfer', label: 'Virement bancaire' },
    { value: 'check', label: 'Chèque' },
    { value: 'cash', label: 'Espèces' },
    { value: 'credit_card', label: 'Carte de crédit' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Autre' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Actif' },
    { value: 'pending', label: 'En attente' },
    { value: 'inactive', label: 'Inactif' },
    { value: 'suspended', label: 'Suspendu' },
    { value: 'blacklisted', label: 'Blacklisté' }
  ];

  // Définition des étapes
  const steps = [
    { id: 1, label: 'Informations de Base', icon: <IoBusinessOutline /> },
    { id: 2, label: 'Contact & Adresse', icon: <MdOutlineContactPhone /> },
    { id: 3, label: 'Informations Légales', icon: <IoDocumentTextOutline /> },
    { id: 4, label: 'Conditions Commerciales', icon: <TbCurrencyDollar /> },
    { id: 5, label: 'Évaluation', icon: <IoStarOutline /> },
    { id: 6, label: 'Récapitulatif', icon: <IoCheckmarkCircleOutline /> }
  ];

  // Fonction utilitaire pour formater la monnaie
  const formatCurrency = useCallback((amount) => {
    const num = parseFloat(amount) || 0;
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M Ar`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K Ar`;
    }
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }, []);

  // Validation des étapes
  const validateStep = useCallback((step) => {
    const errors = {};
    let isValid = true;
    
    switch(step) {
      case 1:
        if (!formData.name.trim()) {
          errors.name = 'Le nom du fournisseur est requis';
          isValid = false;
        }
        if (!formData.category) {
          errors.category = 'La catégorie est requise';
          isValid = false;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Email invalide';
          isValid = false;
        }
        if (!formData.phone) {
          errors.phone = 'Le téléphone est requis';
          isValid = false;
        }
        break;
        
      case 2:
        if (!formData.contactPerson.trim()) {
          errors.contactPerson = 'Le contact principal est requis';
          isValid = false;
        }
        if (!formData.address.trim()) {
          errors.address = 'L\'adresse est requise';
          isValid = false;
        }
        break;
        
      case 3:
        if (!formData.taxId.trim()) {
          errors.taxId = 'Le numéro fiscal est requis';
          isValid = false;
        }
        if (!formData.legalForm) {
          errors.legalForm = 'La forme juridique est requise';
          isValid = false;
        }
        break;
          
      case 4:
        if (formData.paymentTerms === '') {
          errors.paymentTerms = 'Les conditions de paiement sont requises';
          isValid = false;
        }
        if (formData.deliveryTime === '') {
          errors.deliveryTime = 'Le délai de livraison est requis';
          isValid = false;
        }
        if (formData.creditLimit < 0) {
          errors.creditLimit = 'Le crédit ne peut pas être négatif';
          isValid = false;
        }
        break;
        
      case 5:
        if (formData.rating < 0 || formData.rating > 5) {
          errors.rating = 'La note doit être entre 0 et 5';
          isValid = false;
        }
        if (formData.reliability < 0 || formData.reliability > 100) {
          errors.reliability = 'La fiabilité doit être entre 0% et 100%';
          isValid = false;
        }
        break;
        
      default:
        isValid = true;
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, ...errors }));
    
    // Mettre à jour l'état de validation de l'étape
    setStepValidations(prev => ({
      ...prev,
      [step]: isValid
    }));
    
    return isValid;
  }, [formData]);

  // Charger les données du fournisseur
  const loadSupplierData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let supplierData = null;
      
      // Vérifier si on a des données dans le state de navigation
      if (location.state?.supplierData) {
        supplierData = location.state.supplierData;
      } 
      // Sinon, vérifier si on a un ID dans l'URL et charger les données mock
      else if (id) {
        const supplierId = parseInt(id);
        
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const supplier = mockSuppliers.find(s => s.id === supplierId);
        
        if (supplier) {
          supplierData = supplier;
        } else {
          console.error(`Fournisseur avec ID ${id} non trouvé`);
          alert('Fournisseur non trouvé');
          navigate('/fournisseursAdmin');
          return;
        }
      }
      
      if (supplierData) {
        const updatedData = {
          name: supplierData.name || '',
          category: supplierData.category || '',
          email: supplierData.email || '',
          phone: supplierData.phone || '',
          address: supplierData.address || '',
          website: supplierData.website || '',
          logo: supplierData.logo || null,
          contactPerson: supplierData.contactPerson || '',
          contactPhone: supplierData.contactPhone || '',
          contactEmail: supplierData.contactEmail || supplierData.email || '',
          taxId: supplierData.taxId || '',
          legalForm: supplierData.legalForm || 'SARL',
          registrationDate: supplierData.registrationDate || supplierData.dateCreated || '',
          paymentTerms: supplierData.paymentTerms || '30',
          deliveryTime: supplierData.deliveryTime || '3',
          preferredPaymentMethod: supplierData.preferredPaymentMethod || 'bank_transfer',
          bankAccount: supplierData.bankAccount || '',
          creditLimit: supplierData.creditLimit || 0,
          currentCredit: supplierData.currentCredit || 0,
          rating: supplierData.rating || 0,
          reliability: supplierData.reliability || 0,
          notes: supplierData.notes || '',
          status: supplierData.status || 'active',
          dateCreated: supplierData.dateCreated || new Date().toISOString().split('T')[0],
          createdBy: supplierData.createdBy || 'Admin',
          lastModified: supplierData.lastModified || new Date().toISOString()
        };
        
        setFormData(updatedData);
        setRatingStars(Math.floor(updatedData.rating || 0));
        setIsEditing(true);
        
        // Marquer toutes les étapes comme valides en mode édition
        setStepValidations({
          1: true, 2: true, 3: true, 4: true, 5: true, 6: true
        });
        
        // Mettre à jour l'image de prévisualisation si disponible
        if (supplierData.logo) {
          setPreviewLogo(supplierData.logo);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du fournisseur:', error);
      alert('Erreur lors du chargement du fournisseur');
    } finally {
      setIsLoading(false);
    }
  }, [id, location.state, navigate]);

  // Initialiser depuis l'URL et l'état de navigation
  useEffect(() => {
    // Détecter si on est en mode édition
    const isEditMode = id || location.state?.supplierData;
    
    if (isEditMode) {
      loadSupplierData();
    } else {
      // Mode création : définir les valeurs par défaut
      setFormData({
        name: '',
        category: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        logo: null,
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        taxId: '',
        legalForm: 'SARL',
        registrationDate: '',
        paymentTerms: '30',
        deliveryTime: '3',
        preferredPaymentMethod: 'bank_transfer',
        bankAccount: '',
        creditLimit: 0,
        currentCredit: 0,
        rating: 0,
        reliability: 0,
        notes: '',
        status: 'active',
        dateCreated: new Date().toISOString().split('T')[0],
        createdBy: 'Admin',
        lastModified: new Date().toISOString(),
      });
    }
  }, [id, location.state, loadSupplierData]);

  // Valider l'étape actuelle à chaque changement de données
  useEffect(() => {
    validateStep(currentStep);
  }, [formData, currentStep, validateStep]);

  // Mettre à jour les étoiles de notation
  useEffect(() => {
    setRatingStars(Math.floor(formData.rating));
  }, [formData.rating]);

  // Gestion des changements de formulaire
  const handleChange = useCallback((name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      updated.lastModified = new Date().toISOString();
      return updated;
    });
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Gestion spécifique pour InputSelect
  const handleSelectChange = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  // Gestion du fichier logo
  const handleLogoUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          logo: 'La taille du fichier ne doit pas dépasser 5MB'
        }));
        return;
      }
      
      if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
        setValidationErrors(prev => ({
          ...prev,
          logo: 'Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
        handleChange('logo', file);
      };
      reader.readAsDataURL(file);
    }
  }, [handleChange]);

  // Supprimer le logo
  const handleRemoveLogo = useCallback(() => {
    setPreviewLogo(null);
    handleChange('logo', null);
  }, [handleChange]);

  // Gestion des étoiles de notation
  const handleStarClick = useCallback((stars) => {
    handleChange('rating', stars);
  }, [handleChange]);

  // Navigation entre les étapes
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      alert('Veuillez corriger les erreurs avant de passer à l\'étape suivante.');
    }
  }, [currentStep, validateStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step <= currentStep) {
      if (validateStep(currentStep)) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Veuillez corriger les erreurs avant de changer d\'étape.');
      }
    }
  }, [currentStep, validateStep]);

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider toutes les étapes avant soumission
    let allStepsValid = true;
    for (let step = 1; step <= steps.length; step++) {
      if (!validateStep(step)) {
        allStepsValid = false;
      }
    }
    
    if (!allStepsValid) {
      alert('Veuillez corriger toutes les erreurs avant de soumettre le formulaire.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Préparer les données finales
      const finalData = {
        ...formData,
        id: isEditing ? parseInt(id) : Date.now(),
        lastModified: new Date().toISOString()
      };
      
      console.log('Fournisseur sauvegardé:', finalData);
      
      // Simuler la sauvegarde dans localStorage
      const savedSuppliers = JSON.parse(localStorage.getItem('fournisseurs') || '[]');
      
      if (isEditing) {
        const index = savedSuppliers.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
          savedSuppliers[index] = finalData;
        } else {
          savedSuppliers.push(finalData);
        }
      } else {
        savedSuppliers.push(finalData);
      }
      
      localStorage.setItem('fournisseurs', JSON.stringify(savedSuppliers));
      
      setHasUnsavedChanges(false);
      
      alert(isEditing ? '✅ Fournisseur modifié avec succès!' : '✅ Fournisseur créé avec succès!');
      
      navigate('/fournisseursAdmin');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      if (isEditing) {
        loadSupplierData();
      } else {
        setFormData({
          name: '',
          category: '',
          email: '',
          phone: '',
          address: '',
          website: '',
          logo: null,
          contactPerson: '',
          contactPhone: '',
          contactEmail: '',
          taxId: '',
          legalForm: 'SARL',
          registrationDate: '',
          paymentTerms: '30',
          deliveryTime: '3',
          preferredPaymentMethod: 'bank_transfer',
          bankAccount: '',
          creditLimit: 0,
          currentCredit: 0,
          rating: 0,
          reliability: 0,
          notes: '',
          status: 'active',
          dateCreated: new Date().toISOString().split('T')[0],
          createdBy: 'Admin',
          lastModified: new Date().toISOString(),
        });
        setPreviewLogo(null);
        setRatingStars(0);
        setHasUnsavedChanges(false);
        setValidationErrors({});
        setCurrentStep(1);
        setStepValidations({
          1: false, 2: false, 3: false, 4: true, 5: true, 6: true
        });
      }
    }
  }, [isEditing, loadSupplierData]);

  // Générer un numéro fiscal automatique
  const generateTaxId = useCallback(() => {
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const taxId = `NIF-${timestamp}-${randomChars}`;
    handleChange('taxId', taxId);
  }, [handleChange]);

  // Rendu des étoiles de notation
  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => (
      <button
        key={index}
        type="button"
        className={`${styles.starButton} ${index < ratingStars ? styles.starFilled : styles.starEmpty}`}
        onClick={() => handleStarClick(index + 1)}
        onMouseEnter={() => setRatingStars(index + 1)}
        onMouseLeave={() => setRatingStars(Math.floor(formData.rating))}
        aria-label={`Noter ${index + 1} étoile${index + 1 > 1 ? 's' : ''}`}
      >
        {index < ratingStars ? <IoStar /> : <IoStarOutline />}
      </button>
    ));
  };

  // Rendu conditionnel par étape
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Chargement du fournisseur...</p>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoBusinessOutline /> Informations de Base
              </h3>
              <p className={styles.stepDescription}>
                Saisissez les informations principales du fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Nom du Fournisseur"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  name="name"
                  placeholder="Ex: Holcim Madagascar"
                  icon={<FaBuilding />}
                  required
                  maxLength={100}
                  className={styles.formInput}
                />
                <div className={styles.charCount}>
                  {(formData.name || '').length}/100 caractères
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Catégorie"
                  value={formData.category || ''}
                  onChange={(value) => handleSelectChange('category', value)}
                  options={[
                    { value: '', label: 'Sélectionner une catégorie', disabled: true },
                    ...categories
                  ]}
                  placeholder="Choisir une catégorie"
                  icon={<TbCategory />}
                  required
                  // error={validationErrors.category}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  type="email"
                  label="Email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  name="email"
                  placeholder="contact@entreprise.mg"
                  icon={<IoMailOutline />}
                  error={validationErrors.email}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="tel"
                  label="Téléphone"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  name="phone"
                  placeholder="+261 20 22 123 45"
                  icon={<IoCallOutline />}
                  required
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  type="url"
                  label="Site Web"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  name="website"
                  placeholder="https://www.entreprise.mg"
                  icon={<IoGlobeOutline />}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div className={styles.logoUploadSection}>
                  <label className={styles.formLabel}>
                    <IoBusinessOutline /> Logo
                  </label>
                  <div className={styles.logoUploadContainer}>
                    {previewLogo ? (
                      <div className={styles.logoPreview}>
                        <img 
                          src={previewLogo} 
                          alt="Logo du fournisseur" 
                          className={styles.previewLogo}
                        />
                        <Button
                          variant="danger"
                          size="small"
                          onClick={handleRemoveLogo}
                          className={styles.removeLogoBtn}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.uploadArea}>
                        <IoCloudUploadOutline className={styles.uploadIcon} />
                        <p className={styles.uploadText}>Télécharger un logo</p>
                        <InputFile
                          label=""
                          onChange={handleLogoUpload}
                          variant="outline"
                          name="logo"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          error={validationErrors.logo}
                          buttonText="Choisir un fichier"
                          helperText="JPG, PNG, GIF ou WebP - max 5MB"
                          fullWidth={true}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {!stepValidations[1] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez remplir tous les champs obligatoires (*) pour continuer</span>
              </div>
            )}
          </div>
        );
        
      case 2:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <MdOutlineContactPhone /> Contact & Adresse
              </h3>
              <p className={styles.stepDescription}>
                Informations de contact et adresse du fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Contact Principal"
                  value={formData.contactPerson || ''}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  name="contactPerson"
                  placeholder="Ex: M. Rakoto Andriamalala"
                  icon={<FaUsers />}
                  required
                  error={validationErrors.contactPerson}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="tel"
                  label="Téléphone Contact"
                  value={formData.contactPhone || ''}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  name="contactPhone"
                  placeholder="+261 34 12 345 67"
                  icon={<FaPhoneAlt />}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  type="email"
                  label="Email Contact"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  name="contactEmail"
                  placeholder="contact.person@entreprise.mg"
                  icon={<IoMailOutline />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Adresse"
                  value={formData.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  name="address"
                  placeholder="Ex: Lot IVK 32 Bis, Ambohidratrimo, Antananarivo"
                  icon={<IoLocationOutline />}
                  required
                  error={validationErrors.address}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Notes de contact"
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  name="notes"
                  placeholder="Informations supplémentaires sur le contact..."
                  rows={3}
                  maxLength={250}
                  className={styles.formTextarea}
                />
                <div className={styles.charCount}>
                  {(formData.notes || '').length}/250 caractères
                </div>
              </div>
            </div>
            
            {!stepValidations[2] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez remplir les champs obligatoires</span>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoDocumentTextOutline /> Informations Légales
              </h3>
              <p className={styles.stepDescription}>
                Informations légales et fiscales du fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.inputWithButton}>
                  <Input
                    type="text"
                    label="Numéro Fiscal"
                    value={formData.taxId || ''}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    name="taxId"
                    placeholder="Ex: 000123456789"
                    icon={<FaAddressCard />}
                    required
                    error={validationErrors.taxId}
                    className={styles.formInput}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={generateTaxId}
                    className={styles.generateBtn}
                  >
                    Générer
                  </Button>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Forme Juridique"
                  value={formData.legalForm || ''}
                  onChange={(value) => handleSelectChange('legalForm', value)}
                  options={legalForms}
                  placeholder="Choisir une forme juridique"
                  icon={<IoDocumentTextOutline />}
                  required
                  error={validationErrors.legalForm}
                />
              </div>
              
              <div className={styles.formGroupFull}>
                <Input
                  type="date"
                  label="Date d'immatriculation"
                  value={formData.registrationDate || ''}
                  onChange={(e) => handleChange('registrationDate', e.target.value)}
                  name="registrationDate"
                  icon={<IoCalendarOutline />}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div className={styles.legalInfo}>
                  <h4 className={styles.sectionSubtitle}>Informations bancaires</h4>
                  <Input
                    type="text"
                    label="Compte Bancaire"
                    value={formData.bankAccount || ''}
                    onChange={(e) => handleChange('bankAccount', e.target.value)}
                    name="bankAccount"
                    placeholder="Ex: BNI Madagascar - 123456789"
                    icon={<CiCreditCard1 />}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
            
            {!stepValidations[3] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez remplir les informations légales obligatoires</span>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <TbCurrencyDollar /> Conditions Commerciales
              </h3>
              <p className={styles.stepDescription}>
                Définissez les conditions commerciales avec ce fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <InputSelect
                  label="Conditions Paiement"
                  value={formData.paymentTerms || ''}
                  onChange={(value) => handleSelectChange('paymentTerms', value)}
                  options={paymentTermsOptions}
                  placeholder="Choisir les conditions"
                  icon={<MdOutlinePayment />}
                  required
                  error={validationErrors.paymentTerms}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Délai Livraison"
                  value={formData.deliveryTime || ''}
                  onChange={(value) => handleSelectChange('deliveryTime', value)}
                  options={deliveryTimeOptions}
                  placeholder="Choisir le délai"
                  icon={<MdOutlineLocalShipping />}
                  required
                  error={validationErrors.deliveryTime}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Méthode Paiement"
                  value={formData.preferredPaymentMethod || ''}
                  onChange={(value) => handleSelectChange('preferredPaymentMethod', value)}
                  options={paymentMethods}
                  placeholder="Choisir la méthode"
                  icon={<CiMoneyBill />}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Crédit Autorisé"
                  value={formData.creditLimit || 0}
                  onChange={(e) => handleChange('creditLimit', parseFloat(e.target.value) || 0)}
                  name="creditLimit"
                  min="0"
                  step="1000"
                  icon={<TbCurrencyDollar />}
                  error={validationErrors.creditLimit}
                  className={styles.formInput}
                />
                <div className={styles.inputHint}>
                  <IoInformationCircleOutline />
                  <span>Crédit maximum autorisé</span>
                </div>
              </div>
              
              <div className={styles.formGroupFull}>
                <Input
                  type="number"
                  label="Crédit Utilisé"
                  value={formData.currentCredit || 0}
                  onChange={(e) => handleChange('currentCredit', parseFloat(e.target.value) || 0)}
                  name="currentCredit"
                  min="0"
                  max={formData.creditLimit}
                  step="1000"
                  icon={<FaRegCreditCard />}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div className={styles.creditInfo}>
                  <h4 className={styles.sectionSubtitle}>Statut du crédit</h4>
                  <div className={styles.creditStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Crédit disponible:</span>
                      <span className={styles.statValue}>
                        {formatCurrency(formData.creditLimit - formData.currentCredit)}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>Taux d'utilisation:</span>
                      <span className={`${styles.statValue} ${
                        formData.creditLimit > 0 && (formData.currentCredit / formData.creditLimit) > 0.8 ? styles.warning : ''
                      }`}>
                        {formData.creditLimit > 0 
                          ? `${((formData.currentCredit / formData.creditLimit) * 100).toFixed(1)}%`
                          : '0%'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {!stepValidations[4] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez corriger les erreurs dans les conditions commerciales</span>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoStarOutline /> Évaluation
              </h3>
              <p className={styles.stepDescription}>
                Évaluez la performance et la fiabilité du fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <div className={styles.ratingSection}>
                  <label className={styles.formLabel}>
                    <IoStarOutline /> Note du fournisseur
                  </label>
                  <div className={styles.ratingControls}>
                    <div className={styles.starsContainer}>
                      {renderStars()}
                    </div>
                    <div className={styles.ratingValue}>
                      <span className={styles.ratingNumber}>{formData.rating.toFixed(1)}</span>
                      <span className={styles.ratingMax}>/5</span>
                    </div>
                  </div>
                  <div className={styles.ratingInput}>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                      className={styles.ratingSlider}
                    />
                    <div className={styles.ratingLabels}>
                      <span>0</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.numberInputWithControls}>
                  <Input
                    type="number"
                    label="Fiabilité (%)"
                    value={formData.reliability}
                    onChange={(e) => handleChange('reliability', parseFloat(e.target.value) || 0)}
                    name="reliability"
                    min="0"
                    max="100"
                    step="1"
                    icon={<FaClipboardCheck />}
                    required
                    error={validationErrors.reliability}
                    className={styles.formInput}
                  />
                  <div className={styles.numberControls}>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleChange('reliability', Math.max(0, formData.reliability - 5))}
                      className={styles.numberBtn}
                    >
                      -
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => handleChange('reliability', Math.min(100, formData.reliability + 5))}
                      className={styles.numberBtn}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className={styles.inputHint}>
                  <IoInformationCircleOutline />
                  <span>Pourcentage de commandes livrées à temps</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Statut"
                  value={formData.status || ''}
                  onChange={(value) => handleSelectChange('status', value)}
                  options={statusOptions}
                  placeholder="Choisir le statut"
                  icon={<IoCheckmarkOutline />}
                />
              </div>

              <div className={styles.formGroupFull}>
                <div className={styles.performanceStats}>
                  <h4 className={styles.sectionSubtitle}>Résumé de performance</h4>
                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <IoStar />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formData.rating.toFixed(1)}</div>
                        <div className={styles.statLabel}>Note moyenne</div>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <FaClipboardCheck />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formData.reliability}%</div>
                        <div className={styles.statLabel}>Fiabilité</div>
                      </div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statIcon}>
                        <IoTimeOutline />
                      </div>
                      <div className={styles.statContent}>
                        <div className={styles.statValue}>{formData.deliveryTime}j</div>
                        <div className={styles.statLabel}>Délai moyen</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {!stepValidations[5] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez corriger les erreurs dans l'évaluation</span>
              </div>
            )}
          </div>
        );
        
      case 6:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoCheckmarkCircleOutline /> Récapitulatif
              </h3>
              <p className={styles.stepDescription}>
                Vérifiez les informations avant de sauvegarder
              </p>
            </div>
            
            <div className={styles.summaryContainer}>
              <div className={styles.summaryCard}>
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoBusinessOutline /> Informations de Base
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nom:</span>
                      <span className={styles.summaryValue}>{formData.name || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Catégorie:</span>
                      <span className={styles.summaryValue}>{formData.category || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Email:</span>
                      <span className={styles.summaryValue}>{formData.email || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Téléphone:</span>
                      <span className={styles.summaryValue}>{formData.phone || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Site web:</span>
                      <span className={styles.summaryValue}>{formData.website || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <MdOutlineContactPhone /> Contact & Adresse
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Contact principal:</span>
                      <span className={styles.summaryValue}>{formData.contactPerson || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Tél contact:</span>
                      <span className={styles.summaryValue}>{formData.contactPhone || formData.phone || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Adresse:</span>
                      <span className={styles.summaryValue}>{formData.address || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoDocumentTextOutline /> Informations Légales
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Numéro fiscal:</span>
                      <span className={styles.summaryValue}>{formData.taxId || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Forme juridique:</span>
                      <span className={styles.summaryValue}>{formData.legalForm || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date immatriculation:</span>
                      <span className={styles.summaryValue}>{formData.registrationDate || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Compte bancaire:</span>
                      <span className={styles.summaryValue}>{formData.bankAccount || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <TbCurrencyDollar /> Conditions Commerciales
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Paiement:</span>
                      <span className={styles.summaryValue}>
                        {formData.paymentTerms === '0' ? 'Comptant' : `${formData.paymentTerms} jours`}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Livraison:</span>
                      <span className={styles.summaryValue}>
                        {formData.deliveryTime === '0' ? 'Sur commande' : 
                         formData.deliveryTime === '1' ? '24 heures' :
                         formData.deliveryTime === '2' ? '2-3 jours' :
                         formData.deliveryTime === '3' ? '3-5 jours' :
                         formData.deliveryTime === '5' ? '5-7 jours' :
                         formData.deliveryTime === '7' ? '1 semaine' :
                         formData.deliveryTime === '14' ? '2 semaines' :
                         formData.deliveryTime === '30' ? '1 mois' : `${formData.deliveryTime} jours`}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Méthode paiement:</span>
                      <span className={styles.summaryValue}>
                        {formData.preferredPaymentMethod === 'bank_transfer' ? 'Virement bancaire' :
                         formData.preferredPaymentMethod === 'check' ? 'Chèque' :
                         formData.preferredPaymentMethod === 'cash' ? 'Espèces' :
                         formData.preferredPaymentMethod === 'credit_card' ? 'Carte de crédit' :
                         formData.preferredPaymentMethod === 'mobile_money' ? 'Mobile Money' : 'Autre'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Crédit autorisé:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.creditLimit)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Crédit utilisé:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.currentCredit)}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoStarOutline /> Évaluation
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Note:</span>
                      <div className={styles.summaryRating}>
                        <div className={styles.starsSummary}>
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i} className={i < Math.floor(formData.rating) ? styles.starFilled : styles.starEmpty}>
                              {i < Math.floor(formData.rating) ? <IoStar /> : <IoStarOutline />}
                            </span>
                          ))}
                        </div>
                        <span className={styles.ratingNumberSummary}>{formData.rating.toFixed(1)}/5</span>
                      </div>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Fiabilité:</span>
                      <span className={styles.summaryValue}>{formData.reliability}%</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Statut:</span>
                      <span className={`${styles.summaryValue} ${
                        formData.status === 'active' ? styles.statusActive :
                        formData.status === 'pending' ? styles.statusPending :
                        formData.status === 'inactive' ? styles.statusInactive :
                        formData.status === 'suspended' ? styles.statusSuspended :
                        styles.statusBlacklisted
                      }`}>
                        {formData.status === 'active' ? 'ACTIF' :
                         formData.status === 'pending' ? 'EN ATTENTE' :
                         formData.status === 'inactive' ? 'INACTIF' :
                         formData.status === 'suspended' ? 'SUSPENDU' : 'BLACKLISTÉ'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Notes:</span>
                      <span className={styles.summaryValue}>
                        {formData.notes || 'Aucune note'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.summaryActions}>
                
                <div className={styles.summaryStats}>
                <Button
                  variant={showPreview ? "secondary" : "outline"}
                  size="medium"
                  onClick={() => setShowPreview(!showPreview)}
                  className={styles.previewBtn}
                >
                  {showPreview ? 'Masquer aperçu' : 'Aperçu fiche'}
                </Button>
                  <div className={styles.statCardSummary}>
                    <div className={styles.statLabel}>Crédit disponible</div>
                    <div className={styles.statValue}>
                      {formatCurrency(formData.creditLimit - formData.currentCredit)}
                    </div>
                  </div>
                  <div className={styles.statCardSummary}>
                    <div className={styles.statLabel}>Performance</div>
                    <div className={`${styles.statValue} ${
                      formData.rating >= 4 ? styles.performanceHigh :
                      formData.rating >= 3 ? styles.performanceMedium :
                      styles.performanceLow
                    }`}>
                      {formData.rating >= 4 ? 'EXCELLENT' :
                       formData.rating >= 3 ? 'BON' : 'À AMÉLIORER'}
                    </div>
                  </div>
                  <div className={styles.statCardSummary}>
                    <div className={styles.statLabel}>Statut</div>
                    <div className={`${styles.statValue} ${isEditing ? styles.edit : styles.new}`}>
                      {isEditing ? 'MODIFICATION' : 'NOUVEAU'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.finalValidation} role="status">
              <IoCheckmarkCircleOutline />
              <span>Toutes les étapes sont validées. Vous pouvez sauvegarder le fournisseur.</span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        {/* Header */}
        <header className={styles.formHeader}>
          <div className={styles.headerContent}>            
            <div className={styles.headerText}>
              <h1 className={styles.formTitle}>
                {isEditing ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEditing ? 'Modifiez les informations du fournisseur existant' : 'Créez un nouveau fournisseur pour votre réseau'}
              </p>
              
              <div className={styles.headerBadges}>
                {hasUnsavedChanges && (
                  <span className={styles.unsavedBadge} role="alert">
                    <IoWarningOutline /> Modifications non sauvegardées
                  </span>
                )}
                {isEditing && (
                  <span className={styles.editBadge}>
                    <IoPencilOutline /> Mode édition • ID: {id}
                  </span>
                )}
                <span className={`${styles.stepBadge} ${stepValidations[currentStep] ? styles.valid : styles.invalid}`}>
                  {stepValidations[currentStep] ? '✓ Étape validée' : '✗ Étape non validée'}
                </span>
              </div>
            </div>
            
            <nav className={styles.headerBreadcrumbs} aria-label="Fil d'Ariane">
              <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                  component="span"
                  label="Accueil"
                  icon={<HomeIcon fontSize="small" />}
                  onClick={() => navigate('/dashboardAdmin')}
                  style={{ cursor: 'pointer' }}
                  role="link"
                />
                <StyledBreadcrumb
                  label="Fournisseurs"
                  onClick={() => navigate('/fournisseursAdmin')}
                  style={{ cursor: 'pointer' }}
                  role="link"
                />
                <StyledBreadcrumb
                  label={isEditing ? 'Modifier Fournisseur' : 'Nouveau Fournisseur'}
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </nav>
          </div>
        </header>
        
        {/* Indicateur d'étapes */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={goToStep}
          stepValidations={stepValidations}
        />
        
        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className={styles.mainForm} noValidate>
          {renderStepContent()}
          
          {/* Actions de navigation */}
          <div className={styles.formActions}>
            <div className={styles.actionsLeft}>
              {currentStep > 1 && (
                <Button
                  variant="secondary"
                  size="medium"
                  icon="precedant"
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
                onClick={handleReset}
                className={styles.btnReset}
              >
                {isEditing ? 'Annuler modifications' : 'Réinitialiser'}
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              {currentStep < steps.length && (
                <Button
                  variant="primary"
                  size="medium"
                  icon="suivant"
                  iconPosition="right"
                  onClick={nextStep}
                  disabled={isSubmitting || !stepValidations[currentStep]}
                  className={styles.btnPrimary}
                >
                  Suivant
                </Button>
              )}
              
              {currentStep === steps.length && (
                <Button
                  variant="success"
                  size="medium"
                  type="submit"
                  icon="check"
                  iconPosition='right'
                  disabled={isSubmitting}
                  className={`${styles.btnSuccess} ${isSubmitting ? styles.loading : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true"></span>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      {isEditing ? 'Mettre à jour' : 'Créer le fournisseur'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Indicateur de progression */}
          <div className={styles.progressIndicator}>
            <div className={styles.progressInfo}>
              <span>Étape {currentStep} sur {steps.length} • {Math.round((currentStep / steps.length) * 100)}% complété</span>
              <span className={styles.progressStatus}>
                {stepValidations[currentStep] ? '✓ Validé' : '✗ À valider'}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
                role="progressbar"
                aria-valuenow={currentStep}
                aria-valuemin={1}
                aria-valuemax={steps.length}
              ></div>
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className={styles.quickActions}>
            <Button 
              variant="outline"
              size="small"
              icon="print"
              className={styles.quickAction}
              onClick={() => window.print()}
            >
              Imprimer
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="download"
              className={styles.quickAction}
            >
              Exporter
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="partager"
              className={styles.quickAction}
            >
              Partager
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="close"
              onClick={() => {
                if (hasUnsavedChanges && !window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?')) {
                  return;
                }
                navigate('/fournisseursAdmin');
              }}
              className={styles.quickAction}
            >
              Annuler
            </Button>
          </div>
        </form>
        
        {/* Pied de page */}
        <footer className={styles.formFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.infoItem}>
              <IoCloudDoneOutline />
              <span>Sauvegarde automatique activée</span>
            </div>
            <div className={styles.infoItem}>
              <MdOutlineSecurity />
              <span>Toutes les données sont sécurisées</span>
            </div>
            <div className={styles.infoItem}>
              <IoInformationCircleOutline />
              <span>Mode: {isEditing ? 'Édition' : 'Création'}</span>
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Button
              variant="outline"
              size="small"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.footerBtn}
            >
              Haut de page
            </Button>
          </div>
        </footer>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default FrmFournisseurs;