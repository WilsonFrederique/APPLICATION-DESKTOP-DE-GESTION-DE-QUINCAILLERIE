import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './FrmClients.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputRadio from '../../../components/Input/InputRadio';
import InputTogglerIcons from '../../../components/Input/InputTogglerIcons';
import Table from '../../../components/Table/Table';
import Toast from '../../../components/Toast/Toast';
import { 
  IoPersonOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoRefreshOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoLockClosedOutline,
  IoCloudDoneOutline,
  IoAddOutline,
  IoWalletOutline,
  IoReceiptOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoEyeOffOutline
} from "react-icons/io5";
import { 
  FaUserTie,
  FaBuilding,
  FaStore,
  FaChartLine,
  FaTags,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaIdCard,
  FaMoneyBillWave,
  FaBox,
  FaTruck,
  FaBarcode,
  FaClipboardList
} from "react-icons/fa";
import { 
  TbBuildingStore,
  TbCategory,
  TbCurrencyDollar,
  TbTrendingUp,
  TbListDetails,
  TbPercentage
} from "react-icons/tb";
import { 
  MdOutlineStorefront,
  MdOutlineCategory,
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdOutlineDateRange,
  MdOutlineGroup,
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocationOn,
  MdOutlineSecurity
} from "react-icons/md";
import { GiWeight, GiPayMoney } from "react-icons/gi";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Chip, emphasize, styled } from '@mui/material';

// Données mock pour simulation
const mockClients = [
  {
    id: 1,
    nom: 'SARL Batiment Plus',
    type: 'entreprise',
    contact: 'Mr. Rakoto Jean',
    telephone: '+261 34 00 123 45',
    email: 'contact@batimentplus.mg',
    adresse: 'Analakely, Antananarivo 101',
    categorie: 'premium',
    credit_autorise: 5000000,
    credit_utilise: 1500000,
    total_achats: 8500000,
    dernier_achat: '2024-03-15',
    statut: 'actif',
    notes: 'Client fidèle depuis 3 ans. Paiement ponctuel.',
    date_creation: '2022-05-10',
    creer_par: 'Admin',
    derniere_modification: '2024-03-25T10:30:00',
    ville: 'Antananarivo',
    code_postal: '101',
    pays: 'Madagascar',
    site_web: 'www.batimentplus.mg',
    tva_intracommunautaire: 'MG0123456789',
    conditions_paiement: '30 jours fin de mois',
    taux_remise: 5,
    notification_par_email: true,
    notification_par_sms: true
  },
  {
    id: 2,
    nom: 'Entreprise Construction Pro',
    type: 'entreprise',
    contact: 'Mr. Rabe Andriana',
    telephone: '+261 32 00 987 65',
    email: 'info@constructionpro.mg',
    adresse: 'Ivandry, Antananarivo',
    categorie: 'gold',
    credit_autorise: 3000000,
    credit_utilise: 0,
    total_achats: 4200000,
    dernier_achat: '2024-03-14',
    statut: 'actif',
    notes: 'Nouveau client. Potentiel élevé.',
    date_creation: '2023-08-15',
    creer_par: 'Vendeur1',
    derniere_modification: '2024-03-22T14:15:00',
    ville: 'Antananarivo',
    code_postal: '101',
    pays: 'Madagascar',
    site_web: 'www.constructionpro.mg',
    tva_intracommunautaire: 'MG0987654321',
    conditions_paiement: '45 jours',
    taux_remise: 3,
    notification_par_email: true,
    notification_par_sms: false
  },
  {
    id: 3,
    nom: 'Mr. Randria Jean-Pierre',
    type: 'particulier',
    contact: 'Mr. Randria Jean-Pierre',
    telephone: '+261 33 00 456 78',
    email: 'randria.jp@gmail.com',
    adresse: 'Ambohibao, Antananarivo',
    categorie: 'standard',
    credit_autorise: 1000000,
    credit_utilise: 250000,
    total_achats: 1800000,
    dernier_achat: '2024-03-10',
    statut: 'actif',
    notes: 'Petits travaux réguliers.',
    date_creation: '2024-01-20',
    creer_par: 'Vendeur2',
    derniere_modification: '2024-03-20T09:45:00',
    ville: 'Antananarivo',
    code_postal: '101',
    pays: 'Madagascar',
    site_web: '',
    tva_intracommunautaire: '',
    conditions_paiement: 'Comptant',
    taux_remise: 0,
    notification_par_email: false,
    notification_par_sms: true
  }
];

// Historique des achats mock
const mockHistoriqueAchats = [
  {
    id: 1,
    client: 'SARL Batiment Plus',
    date: '2024-03-15',
    montant: 500000,
    reference: 'FAC-2024-00158',
    statut: 'payé',
    produit: 'Ciment 50kg',
    quantite: 10,
    prix_unitaire: 50000
  },
  {
    id: 2,
    client: 'Entreprise Construction Pro',
    date: '2024-03-14',
    montant: 300000,
    reference: 'FAC-2024-00157',
    statut: 'payé',
    produit: 'Tôle Galvanisée',
    quantite: 5,
    prix_unitaire: 60000
  },
  {
    id: 3,
    client: 'Mr. Randria Jean-Pierre',
    date: '2024-03-10',
    montant: 150000,
    reference: 'FAC-2024-00152',
    statut: 'payé',
    produit: 'Peinture Blanc',
    quantite: 3,
    prix_unitaire: 50000
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
const FrmClients = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    nom: '',
    type: 'particulier',
    contact: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'Madagascar',
    
    // Informations commerciales
    categorie: 'standard',
    credit_autorise: 0,
    conditions_paiement: '30 jours',
    taux_remise: 0,
    tva_intracommunautaire: '',
    site_web: '',
    
    // Préférences
    notification_par_email: true,
    notification_par_sms: false,
    
    // Notes
    notes: '',
    
    // Métadonnées
    statut: 'actif',
    date_creation: new Date().toISOString().split('T')[0],
    creer_par: 'Vendeur',
    derniere_modification: new Date().toISOString(),
    total_achats: 0,
    credit_utilise: 0,
    dernier_achat: ''
  });

  // États pour l'UI
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stepValidations, setStepValidations] = useState({
    1: false, 2: false, 3: true, 4: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Données statiques
  const typesClient = [
    { value: 'particulier', label: 'Particulier' },
    { value: 'entreprise', label: 'Entreprise' },
    { value: 'association', label: 'Association' },
    { value: 'administration', label: 'Administration' }
  ];

  const categoriesClient = [
    { value: 'standard', label: 'Standard' },
    { value: 'silver', label: 'Silver' },
    { value: 'gold', label: 'Gold' },
    { value: 'premium', label: 'Premium' }
  ];

  const conditionsPaiement = [
    { value: 'comptant', label: 'Comptant' },
    { value: '7 jours', label: '7 jours' },
    { value: '30 jours', label: '30 jours' },
    { value: '30 jours fin de mois', label: '30 jours fin de mois' },
    { value: '45 jours', label: '45 jours' },
    { value: '60 jours', label: '60 jours' }
  ];

  const villes = [
    { value: 'Antananarivo', label: 'Antananarivo' },
    { value: 'Toamasina', label: 'Toamasina' },
    { value: 'Antsirabe', label: 'Antsirabe' },
    { value: 'Fianarantsoa', label: 'Fianarantsoa' },
    { value: 'Mahajanga', label: 'Mahajanga' },
    { value: 'Toliara', label: 'Toliara' },
    { value: 'Antsiranana', label: 'Antsiranana' },
    { value: 'Morondava', label: 'Morondava' },
    { value: 'Taolagnaro', label: 'Taolagnaro' }
  ];

  const pays = [
    { value: 'Madagascar', label: 'Madagascar' },
    { value: 'France', label: 'France' },
    { value: 'Maurice', label: 'Maurice' },
    { value: 'Réunion', label: 'Réunion' },
    { value: 'Comores', label: 'Comores' },
    { value: 'Mayotte', label: 'Mayotte' }
  ];

  // Définition des étapes
  const steps = [
    { id: 1, label: 'Informations Client', icon: <IoPersonOutline /> },
    { id: 2, label: 'Coordonnées', icon: <IoLocationOutline /> },
    { id: 3, label: 'Paramètres', icon: <CiSettings /> },
    { id: 4, label: 'Récapitulatif', icon: <IoCheckmarkCircleOutline /> }
  ];

  // Fonction utilitaire pour formater la monnaie
  const formatCurrency = useCallback((amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  }, []);

  // Afficher un toast
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Gestion des changements non sauvegardés
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Validation des étapes
  const validateStep = useCallback((step) => {
    const errors = {};
    let isValid = true;
    
    switch(step) {
      case 1:
        if (!formData.nom.trim()) {
          errors.nom = 'Le nom du client est requis';
          isValid = false;
        }
        if (!formData.type) {
          errors.type = 'Le type de client est requis';
          isValid = false;
        }
        if (!formData.contact.trim()) {
          errors.contact = 'Le contact est requis';
          isValid = false;
        }
        if (!formData.telephone.trim()) {
          errors.telephone = 'Le téléphone est requis';
          isValid = false;
        }
        break;
        
      case 2:
        if (!formData.adresse.trim()) {
          errors.adresse = 'L\'adresse est requise';
          isValid = false;
        }
        if (!formData.ville) {
          errors.ville = 'La ville est requise';
          isValid = false;
        }
        if (!formData.pays) {
          errors.pays = 'Le pays est requis';
          isValid = false;
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = 'Format d\'email invalide';
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

  // Charger les données du client
  const loadClientData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let clientData = null;
      
      // Vérifier si on a des données dans le state de navigation
      if (location.state?.clientData) {
        clientData = location.state.clientData;
      } 
      // Sinon, vérifier si on a un ID dans l'URL et charger les données mock
      else if (id) {
        const clientId = parseInt(id);
        
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const client = mockClients.find(c => c.id === clientId);
        
        if (client) {
          clientData = client;
        } else {
          console.error(`Client avec ID ${id} non trouvé`);
          showToast('Client non trouvé', 'error');
          navigate('/clients');
          return;
        }
      }
      
      if (clientData) {
        setFormData(prev => ({
          ...prev,
          ...clientData,
          // S'assurer que tous les champs ont une valeur par défaut
          notes: clientData.notes || '',
          taux_remise: clientData.taux_remise || 0,
          notification_par_email: clientData.notification_par_email || false,
          notification_par_sms: clientData.notification_par_sms || false,
          date_creation: clientData.date_creation || new Date().toISOString().split('T')[0],
          derniere_modification: new Date().toISOString()
        }));
        
        setIsEditing(true);
        
        // Marquer toutes les étapes comme valides en mode édition
        setStepValidations({
          1: true, 2: true, 3: true, 4: true
        });
        
        showToast('Client chargé avec succès', 'success');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du client:', error);
      showToast('Erreur lors du chargement du client', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, location.state, navigate, showToast]);

  // Initialiser depuis l'URL et l'état de navigation
  useEffect(() => {
    // Détecter si on est en mode édition
    const isEditMode = id || location.state?.clientData;
    
    if (isEditMode) {
      loadClientData();
    } else {
      // Mode création
      setFormData(prev => ({
        ...prev,
        date_creation: new Date().toISOString().split('T')[0],
        derniere_modification: new Date().toISOString(),
        creer_par: 'Vendeur'
      }));
    }
  }, [id, location.state, loadClientData]);

  // Valider l'étape actuelle à chaque changement de données
  useEffect(() => {
    validateStep(currentStep);
  }, [formData, currentStep, validateStep]);

  // Gestion des changements de formulaire
  const handleChange = useCallback((name, value) => {
    setFormData(prev => {
      const updated = { 
        ...prev, 
        [name]: value,
        derniere_modification: new Date().toISOString()
      };
      
      return updated;
    });
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Gestion spécifique pour InputSelect
  const handleSelectChange = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  // Navigation entre les étapes
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      showToast('Veuillez corriger les erreurs avant de continuer', 'warning');
    }
  }, [currentStep, validateStep, steps.length, showToast]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step <= currentStep) {
      // Valider l'étape actuelle avant de changer
      if (validateStep(currentStep)) {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showToast('Veuillez corriger les erreurs avant de changer d\'étape', 'warning');
      }
    }
  }, [currentStep, validateStep, showToast]);

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
      showToast('Veuillez corriger toutes les erreurs avant de soumettre', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Préparer les données finales
      const finalData = {
        ...formData,
        id: isEditing ? parseInt(id) : Date.now(), // Générer un nouvel ID pour la création
        derniere_modification: new Date().toISOString()
      };
      
      console.log('Client sauvegardé:', finalData);
      
      // Simuler la sauvegarde dans localStorage pour la démonstration
      const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
      
      if (isEditing) {
        // Mettre à jour le client existant
        const index = savedClients.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          savedClients[index] = finalData;
        } else {
          savedClients.push(finalData);
        }
      } else {
        // Ajouter un nouveau client
        savedClients.push(finalData);
      }
      
      localStorage.setItem('clients', JSON.stringify(savedClients));
      
      setHasUnsavedChanges(false);
      
      // Message de succès
      showToast(isEditing ? '✅ Client modifié avec succès!' : '✅ Client créé avec succès!', 'success');
      
      // Redirection
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showToast('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      if (isEditing) {
        // En mode édition, recharger les données originales
        loadClientData();
      } else {
        // En mode création, réinitialiser à zéro
        setFormData({
          nom: '',
          type: 'particulier',
          contact: '',
          telephone: '',
          email: '',
          adresse: '',
          ville: '',
          code_postal: '',
          pays: 'Madagascar',
          categorie: 'standard',
          credit_autorise: 0,
          conditions_paiement: '30 jours',
          taux_remise: 0,
          tva_intracommunautaire: '',
          site_web: '',
          notification_par_email: true,
          notification_par_sms: false,
          notes: '',
          statut: 'actif',
          date_creation: new Date().toISOString().split('T')[0],
          creer_par: 'Vendeur',
          derniere_modification: new Date().toISOString(),
          total_achats: 0,
          credit_utilise: 0,
          dernier_achat: ''
        });
        setHasUnsavedChanges(false);
        setValidationErrors({});
        setCurrentStep(1);
        setStepValidations({
          1: false, 2: false, 3: true, 4: true
        });
      }
    }
  }, [isEditing, loadClientData]);

  // Filtrer l'historique des achats
  const filteredHistorique = mockHistoriqueAchats.filter(item =>
    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.produit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Rendu conditionnel par étape
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Chargement du client...</p>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoPersonOutline /> Informations Client
              </h3>
              <p className={styles.stepDescription}>
                Saisissez les informations principales du client
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Nom complet / Raison sociale"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  name="nom"
                  placeholder="Ex: SARL Batiment Plus"
                  icon={<FaBuilding />}
                  required
                  maxLength={100}
                  className={styles.formInput}
                  aria-required="true"
                />
                <div className={styles.charCount}>
                  {formData.nom.length}/100 caractères
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Type de client *"
                  value={formData.type}
                  onChange={(value) => handleSelectChange('type', value)}
                  options={[
                    { value: '', label: 'Sélectionner un type', disabled: true },
                    ...typesClient
                  ]}
                  placeholder="Choisir un type"
                  icon={<FaUserTie />}
                  required
                  error={validationErrors.type}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Personne de contact"
                  value={formData.contact}
                  onChange={(e) => handleChange('contact', e.target.value)}
                  name="contact"
                  placeholder="Ex: Mr. Rakoto Jean"
                  icon={<FaUserTie />}
                  required
                  maxLength={50}
                  className={styles.formInput}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="tel"
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  name="telephone"
                  placeholder="+261 34 00 123 45"
                  icon={<IoCallOutline />}
                  required
                  maxLength={20}
                  className={styles.formInput}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  name="email"
                  placeholder="client@email.com"
                  icon={<IoMailOutline />}
                  error={validationErrors.email}
                  maxLength={100}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Catégorie"
                  value={formData.categorie}
                  onChange={(value) => handleSelectChange('categorie', value)}
                  options={categoriesClient}
                  placeholder="Choisir une catégorie"
                  icon={<FaTags />}
                />
              </div>
            </div>
            
            {/* Aide de validation */}
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
                <IoLocationOutline /> Coordonnées
              </h3>
              <p className={styles.stepDescription}>
                Saisissez les coordonnées du client
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  label="Adresse complète"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  name="adresse"
                  placeholder="Rue, Quartier, Commune..."
                  icon={<IoLocationOutline />}
                  rows={3}
                  required
                  error={validationErrors.adresse}
                  maxLength={200}
                  showCharCount={true}
                  className={styles.formTextarea}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Ville"
                  value={formData.ville}
                  onChange={(value) => handleSelectChange('ville', value)}
                  options={[
                    { value: '', label: 'Sélectionner une ville', disabled: true },
                    ...villes
                  ]}
                  placeholder="Choisir une ville"
                  icon={<MdOutlineLocationOn />}
                  required
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Code postal"
                  value={formData.code_postal}
                  onChange={(e) => handleChange('code_postal', e.target.value)}
                  name="code_postal"
                  placeholder="101"
                  icon={<FaIdCard />}
                  maxLength={10}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Pays"
                  value={formData.pays}
                  onChange={(value) => handleSelectChange('pays', value)}
                  options={pays}
                  placeholder="Choisir un pays"
                  icon={<FaMapMarkerAlt />}
                  required
                  error={validationErrors.pays}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="url"
                  label="Site web"
                  value={formData.site_web}
                  onChange={(e) => handleChange('site_web', e.target.value)}
                  name="site_web"
                  placeholder="www.siteweb.com"
                  icon={<FaBuilding />}
                  maxLength={100}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="TVA intracommunautaire"
                  value={formData.tva_intracommunautaire}
                  onChange={(e) => handleChange('tva_intracommunautaire', e.target.value)}
                  name="tva_intracommunautaire"
                  placeholder="FR01234567890"
                  icon={<CiMoneyBill />}
                  maxLength={20}
                  className={styles.formInput}
                />
              </div>
            </div>
            
            {/* Aide de validation */}
            {!stepValidations[2] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez remplir tous les champs obligatoires (*) pour continuer</span>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <CiSettings /> Paramètres
              </h3>
              <p className={styles.stepDescription}>
                Configurez les paramètres commerciaux du client
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Crédit autorisé (MGA)"
                  value={formData.credit_autorise}
                  onChange={(e) => handleChange('credit_autorise', parseFloat(e.target.value) || 0)}
                  name="credit_autorise"
                  min="0"
                  step="10000"
                  icon={<IoWalletOutline />}
                  className={styles.formInput}
                />
                <div className={styles.inputHint}>
                  <IoInformationCircleOutline />
                  <span>Limite de crédit accordée au client</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Conditions de paiement"
                  value={formData.conditions_paiement}
                  onChange={(value) => handleSelectChange('conditions_paiement', value)}
                  options={conditionsPaiement}
                  placeholder="Choisir des conditions"
                  icon={<MdOutlinePayment />}
                />
              </div>
              
              <div className={styles.formGroupFull}>
                <Input
                  type="number"
                  label="Taux de remise (%)"
                  value={formData.taux_remise}
                  onChange={(e) => handleChange('taux_remise', parseFloat(e.target.value) || 0)}
                  name="taux_remise"
                  min="0"
                  max="100"
                  step="0.5"
                  icon={<TbPercentage />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Notes et observations"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  name="notes"
                  placeholder="Informations supplémentaires sur le client..."
                  icon={<FaClipboardList />}
                  rows={4}
                  maxLength={500}
                  showCharCount={true}
                  className={styles.formTextarea}
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
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
                    <IoPersonOutline /> Informations Client
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nom:</span>
                      <span className={styles.summaryValue}>{formData.nom || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Type:</span>
                      <span className={styles.summaryValue}>
                        {formData.type === 'entreprise' ? 'Entreprise' : 
                         formData.type === 'particulier' ? 'Particulier' : 
                         formData.type === 'association' ? 'Association' : 'Administration'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Contact:</span>
                      <span className={styles.summaryValue}>{formData.contact || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Téléphone:</span>
                      <span className={styles.summaryValue}>{formData.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Email:</span>
                      <span className={styles.summaryValue}>{formData.email || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Catégorie:</span>
                      <span className={styles.summaryValue}>
                        {formData.categorie === 'premium' ? 'Premium' :
                         formData.categorie === 'gold' ? 'Gold' :
                         formData.categorie === 'silver' ? 'Silver' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoLocationOutline /> Coordonnées
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Adresse:</span>
                      <span className={styles.summaryValue}>{formData.adresse || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Ville:</span>
                      <span className={styles.summaryValue}>{formData.ville || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Code postal:</span>
                      <span className={styles.summaryValue}>{formData.code_postal || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Pays:</span>
                      <span className={styles.summaryValue}>{formData.pays || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Site web:</span>
                      <span className={styles.summaryValue}>{formData.site_web || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>TVA intra:</span>
                      <span className={styles.summaryValue}>{formData.tva_intracommunautaire || 'Non applicable'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <CiSettings /> Paramètres
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Crédit autorisé:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.credit_autorise)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Conditions paiement:</span>
                      <span className={styles.summaryValue}>{formData.conditions_paiement}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Taux remise:</span>
                      <span className={styles.summaryValue}>{formData.taux_remise}%</span>
                    </div>
                  </div>
                </div>
                
                {isEditing && (
                  <div className={styles.summarySection}>
                    <h4 className={styles.summarySectionTitle}>
                      <IoReceiptOutline /> Historique commercial
                    </h4>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Total achats:</span>
                        <span className={styles.summaryValue}>{formatCurrency(formData.total_achats)}</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Crédit utilisé:</span>
                        <span className={styles.summaryValue}>{formatCurrency(formData.credit_utilise)}</span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Crédit disponible:</span>
                        <span className={styles.summaryValueHighlight}>
                          {formatCurrency(formData.credit_autorise - formData.credit_utilise)}
                        </span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Dernier achat:</span>
                        <span className={styles.summaryValue}>
                          {formData.dernier_achat ? new Date(formData.dernier_achat).toLocaleDateString('fr-FR') : 'Aucun'}
                        </span>
                    </div>
                  </div>
                </div>
                )}
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <FaClipboardList /> Notes
                  </h4>
                  <div className={styles.summaryNotes}>
                    {formData.notes || 'Aucune note'}
                  </div>
                </div>
              </div>
              
              {/* Historique des achats (uniquement en mode édition) */}
              {isEditing && (
                <div className={styles.historySection}>
                  <div className={styles.historyHeader}>
                    <h4 className={styles.historyTitle}>
                      <IoReceiptOutline /> Historique des achats
                    </h4>
                    <div className={styles.historyControls}>
                      <Input
                        type="text"
                        placeholder="Rechercher dans l'historique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                        size="small"
                      />
                      <Button
                        variant={showHistory ? "secondary" : "outline"}
                        size="small"
                        icon={showHistory ? "eyeOff" : "eye"}
                        onClick={() => setShowHistory(!showHistory)}
                        className={styles.toggleHistoryBtn}
                      >
                        {showHistory ? 'Masquer' : 'Afficher'}
                      </Button>
                    </div>
                  </div>
                  
                  {showHistory && (
                    <div className={styles.historyTable}>
                      <Table
                        columns={[
                          { 
                            key: 'date', 
                            label: 'Date', 
                            accessor: 'date',
                            render: (row) => new Date(row.date).toLocaleDateString('fr-FR')
                          },
                          { key: 'reference', label: 'Référence', accessor: 'reference' },
                          { key: 'produit', label: 'Produit', accessor: 'produit' },
                          { 
                            key: 'quantite', 
                            label: 'Qté', 
                            accessor: 'quantite',
                            align: 'center'
                          },
                          { 
                            key: 'montant', 
                            label: 'Montant', 
                            accessor: 'montant',
                            render: (row) => formatCurrency(row.montant),
                            align: 'right'
                          },
                          { 
                            key: 'statut', 
                            label: 'Statut', 
                            accessor: 'statut',
                            render: (row) => (
                              <span className={`${styles.paymentStatus} ${
                                row.statut === 'payé' ? styles.paid : styles.pending
                              }`}>
                                {row.statut}
                              </span>
                            )
                          }
                        ]}
                        data={filteredHistorique}
                        pagination={true}
                        itemsPerPage={5}
                        sortable={true}
                        compact={true}
                        striped={true}
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className={styles.summaryStats}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Statut</div>
                  <div className={`${styles.statValue} ${isEditing ? styles.edit : styles.new}`}>
                    {isEditing ? 'MODIFICATION' : 'NOUVEAU CLIENT'}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Créé le</div>
                  <div className={styles.statValue}>
                    {new Date(formData.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Dernière modification</div>
                  <div className={styles.statValue}>
                    {new Date(formData.derniere_modification).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vérification finale */}
            <div className={styles.finalValidation} role="status">
              <IoCheckmarkCircleOutline />
              <span>Toutes les étapes sont validées. Vous pouvez sauvegarder le client.</span>
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
                {isEditing ? 'Modifier Client' : 'Nouveau Client'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEditing ? 'Modifiez les informations du client existant' : 'Créez un nouveau client pour votre CRM'}
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
                  label="Clients"
                  onClick={() => navigate('/clients')}
                  style={{ cursor: 'pointer' }}
                  role="link"
                />
                <StyledBreadcrumb
                  label={isEditing ? 'Modifier Client' : 'Nouveau Client'}
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
                  aria-label="Retour à l'étape précédente"
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
                aria-label="Réinitialiser le formulaire"
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
                  iconPosition='right'
                  onClick={nextStep}
                  disabled={isSubmitting || !stepValidations[currentStep]}
                  className={styles.btnPrimary}
                  aria-label="Passer à l'étape suivante"
                >
                  Suivant
                </Button>
              )}
              
              {currentStep === steps.length && (
                <Button
                  variant="success"
                  size="medium"
                  icon="check"
                  iconPosition='right'
                  type="submit"
                  disabled={isSubmitting}
                  className={`${styles.btnSuccess} ${isSubmitting ? styles.loading : ''}`}
                  aria-label={isEditing ? 'Mettre à jour le client' : 'Créer le client'}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true"></span>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      {isEditing ? 'Mettre à jour' : 'Créer le client'}
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
              aria-label="Imprimer le formulaire"
            >
              Imprimer
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="download"
              className={styles.quickAction}
              aria-label="Exporter les données"
            >
              Exporter
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="close"
              onClick={() => {
                if (hasUnsavedChanges && !window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?')) {
                  return;
                }
                navigate('/clients');
              }}
              className={styles.quickAction}
              aria-label="Annuler et retourner à la liste"
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
              aria-label="Retour en haut de la page"
            >
              <IoArrowBackOutline style={{ transform: 'rotate(-90deg)' }} /> Haut de page
            </Button>
          </div>
        </footer>
      </div>
      
      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          position="top-right"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FrmClients;