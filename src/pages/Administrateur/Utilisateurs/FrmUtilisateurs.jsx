import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './FrmUtilisateurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTextarea from '../../../components/Input/InputTextarea';
import Button from '../../../components/Button/Button';
import { 
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoCloudUploadOutline,
  IoPencilOutline,
  IoCloudDoneOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline,
  IoRefreshOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAddOutline,
  IoAlertCircleOutline,
  IoDuplicateOutline,
  IoLogOutOutline,
  IoBusinessOutline,
  IoNotificationsOutline,
  IoSettingsOutline,
  IoLocationOutline,
  IoLanguageOutline,
  IoStatsChartOutline
} from "react-icons/io5";
import { 
  FaUserTie, 
  FaUserShield, 
  FaUserCheck,
  FaUserTimes,
  FaIdCard,
  FaBusinessTime,
  FaChartLine,
  FaUsers,
  FaTachometerAlt
} from "react-icons/fa";
import { TbUserStar, TbUserExclamation, TbCertificate } from "react-icons/tb";
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
const mockUsers = [
  {
    id: 1,
    nom: 'Jean Rakoto',
    email: 'jrakoto@quincaillerie.mg',
    telephone: '+261 32 12 345 67',
    role: 'Administrateur',
    identifiant: 'jrakoto',
    isActive: true,
    dateCreation: '2024-01-15',
    derniereConnexion: '2024-03-20T14:30:00',
    permissions: [
      'Accès dashboard',
      'Gestion stocks',
      'Gestion ventes',
      'Gestion clients',
      'Gestion fournisseurs',
      'Gestion produits',
      'Gestion utilisateurs',
      'Gestion rapports',
      'Export données',
      'Paramètres système'
    ],
    notes: 'Administrateur principal',
    motDePasse: 'password123',
    poste: 'Administrateur système',
    salaire: 1500000,
    dateEmbauche: '2024-01-15',
    adresse: 'Lotissement ABC, Tanjombato',
    ville: 'Antananarivo',
    codePostal: '101',
    pays: 'Madagascar',
    photo: null,
    langue: 'fr',
    fuseauHoraire: 'UTC+3',
    formatDate: 'DD/MM/YYYY',
    notificationsEmail: true,
    notificationsSMS: false,
    notificationsPush: true,
    signature: 'Jean Rakoto\nAdministrateur système'
  }
];

// Rôles disponibles
const roles = [
  { value: 'Administrateur', label: 'Administrateur' },
  { value: 'Superviseur', label: 'Superviseur' },
  { value: 'Vendeur Senior', label: 'Vendeur Senior' },
  { value: 'Vendeur', label: 'Vendeur' },
  { value: 'Gestionnaire Stock', label: 'Gestionnaire Stock' },
  { value: 'Comptable', label: 'Comptable' },
  { value: 'Support Technique', label: 'Support Technique' },
  { value: 'Directeur', label: 'Directeur' },
  { value: 'Responsable Achat', label: 'Responsable Achat' },
  { value: 'Chef d\'équipe', label: 'Chef d\'équipe' }
];

// Permissions disponibles
const availablePermissions = [
  { id: 'dashboard', label: 'Accès dashboard', description: 'Accéder au tableau de bord' },
  { id: 'stocks', label: 'Gestion stocks', description: 'Gérer les stocks et inventaires' },
  { id: 'ventes', label: 'Gestion ventes', description: 'Gérer les ventes et factures' },
  { id: 'clients', label: 'Gestion clients', description: 'Gérer la base clients' },
  { id: 'fournisseurs', label: 'Gestion fournisseurs', description: 'Gérer les fournisseurs' },
  { id: 'produits', label: 'Gestion produits', description: 'Gérer les produits' },
  { id: 'utilisateurs', label: 'Gestion utilisateurs', description: 'Gérer les utilisateurs' },
  { id: 'rapports', label: 'Gestion rapports', description: 'Générer et consulter les rapports' },
  { id: 'export', label: 'Export données', description: 'Exporter les données' },
  { id: 'parametres', label: 'Paramètres système', description: 'Modifier les paramètres système' },
  { id: 'caisse', label: 'Gestion caisse', description: 'Gérer la caisse et les encaissements' },
  { id: 'credits', label: 'Gestion crédits', description: 'Gérer les ventes à crédit' },
  { id: 'retours', label: 'Gestion retours', description: 'Gérer les retours produits' },
  { id: 'promotions', label: 'Gestion promotions', description: 'Gérer les promotions et réductions' },
  { id: 'prix', label: 'Modification prix', description: 'Modifier les prix des produits' },
  { id: 'annulation', label: 'Annulation ventes', description: 'Annuler des ventes' },
  { id: 'statistiques', label: 'Vue statistiques', description: 'Consulter les statistiques' },
  { id: 'audit', label: 'Accès audit', description: 'Consulter les logs d\'audit' },
  { id: 'catalogues', label: 'Gestion catalogues', description: 'Gérer les catalogues produits' },
  { id: 'commandes', label: 'Gestion commandes', description: 'Gérer les commandes fournisseurs' }
];

// Options de langue
const languages = [
  { value: 'fr', label: 'Français' },
  { value: 'mg', label: 'Malagasy' },
  { value: 'en', label: 'English' }
];

// Options de fuseau horaire
const timezones = [
  { value: 'UTC+3', label: 'UTC+3 (Madagascar)' },
  { value: 'UTC+1', label: 'UTC+1 (Europe de l\'Ouest)' },
  { value: 'UTC+0', label: 'UTC+0 (GMT)' },
  { value: 'UTC-5', label: 'UTC-5 (Est USA)' },
  { value: 'UTC+8', label: 'UTC+8 (Chine)' }
];

// Options de format de date
const dateFormats = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY' }
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
          </button>
        ))}
      </div>
    </div>
  );
};

// Composant principal
const FrmUtilisateurs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    email: '',
    telephone: '',
    identifiant: '',
    poste: '',
    role: '',
    salaire: 0,
    dateEmbauche: new Date().toISOString().split('T')[0],
    
    // Adresse
    adresse: '',
    ville: '',
    codePostal: '',
    pays: 'Madagascar',
    
    // Sécurité
    motDePasse: '',
    confirmMotDePasse: '',
    isActive: true,
    forceChangementMDP: false,
    
    // Permissions
    permissions: [],
    
    // Préférences
    langue: 'fr',
    fuseauHoraire: 'UTC+3',
    formatDate: 'DD/MM/YYYY',
    notificationsEmail: true,
    notificationsSMS: false,
    notificationsPush: true,
    
    // Métadonnées
    dateCreation: new Date().toISOString().split('T')[0],
    creerPar: 'Admin',
    derniereModification: new Date().toISOString(),
    notes: '',
    signature: ''
  });

  // États pour l'UI
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stepValidations, setStepValidations] = useState({
    1: false, 2: false, 3: true, 4: true, 5: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  // Définition des étapes
  const steps = [
    { id: 1, label: 'Informations Personnelles', icon: <IoPersonOutline /> },
    { id: 2, label: 'Sécurité & Accès', icon: <IoShieldCheckmarkOutline /> },
    { id: 3, label: 'Permissions', icon: <FaUserShield /> },
    { id: 4, label: 'Préférences', icon: <IoSettingsOutline /> },
    { id: 5, label: 'Récapitulatif', icon: <IoCheckmarkCircleOutline /> }
  ];

  // Validation des étapes
  const validateStep = useCallback((step) => {
    const errors = {};
    let isValid = true;
    
    switch(step) {
      case 1:
        if (!formData.nom.trim()) {
          errors.nom = 'Le nom complet est requis';
          isValid = false;
        }
        if (!formData.email.trim()) {
          errors.email = 'L\'email est requis';
          isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Email invalide';
          isValid = false;
        }
        if (!formData.role) {
          errors.role = 'Le rôle est requis';
          isValid = false;
        }
        if (!formData.identifiant.trim()) {
          errors.identifiant = 'L\'identifiant est requis';
          isValid = false;
        }
        break;
        
      case 2:
        if (!isEditing && !formData.motDePasse) {
          errors.motDePasse = 'Le mot de passe est requis';
          isValid = false;
        } else if (!isEditing && formData.motDePasse.length < 8) {
          errors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
          isValid = false;
        }
        if (!isEditing && formData.motDePasse !== formData.confirmMotDePasse) {
          errors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
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
  }, [formData, isEditing]);

  // Charger les données de l'utilisateur
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      let userData = null;
      
      // Vérifier si on a des données dans le state de navigation
      if (location.state?.userData) {
        userData = location.state.userData;
      } 
      // Sinon, vérifier si on a un ID dans l'URL et charger les données mock
      else if (id) {
        const userId = parseInt(id);
        
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = mockUsers.find(u => u.id === userId);
        
        if (user) {
          userData = user;
        } else {
          console.error(`Utilisateur avec ID ${id} non trouvé`);
          alert('Utilisateur non trouvé');
          navigate('/utilisateursAdmin');
          return;
        }
      }
      
      if (userData) {
        setFormData(prev => ({
          ...prev,
          ...userData,
          confirmMotDePasse: userData.motDePasse || '',
          // Initialiser les permissions sélectionnées
          permissions: userData.permissions || []
        }));
        
        // Initialiser les permissions sélectionnées
        const permSet = new Set(userData.permissions || []);
        setSelectedPermissions(permSet);
        
        setIsEditing(true);
        
        // Marquer toutes les étapes comme valides en mode édition
        setStepValidations({
          1: true, 2: true, 3: true, 4: true, 5: true
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      alert('Erreur lors du chargement de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  }, [id, location.state, navigate]);

  // Initialiser depuis l'URL et l'état de navigation
  useEffect(() => {
    // Détecter si on est en mode édition
    const isEditMode = id || location.state?.userData;
    
    if (isEditMode) {
      loadUserData();
    } else {
      // Mode création : générer un identifiant automatique
      const timestamp = Date.now().toString().slice(-4);
      const randomChars = Math.random().toString(36).substring(2, 4).toLowerCase();
      const identifiant = `user${timestamp}${randomChars}`;
      
      setFormData(prev => ({
        ...prev,
        identifiant,
        dateCreation: new Date().toISOString().split('T')[0],
        derniereModification: new Date().toISOString()
      }));
    }
  }, [id, location.state, loadUserData]);

  // Valider l'étape actuelle à chaque changement de données
  useEffect(() => {
    validateStep(currentStep);
  }, [formData, currentStep, validateStep]);

  // Gestion des changements de formulaire
  const handleChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      derniereModification: new Date().toISOString()
    }));
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Gestion des permissions
  const handlePermissionToggle = useCallback((permission) => {
    const newSelectedPermissions = new Set(selectedPermissions);
    if (newSelectedPermissions.has(permission)) {
      newSelectedPermissions.delete(permission);
    } else {
      newSelectedPermissions.add(permission);
    }
    
    setSelectedPermissions(newSelectedPermissions);
    
    // Mettre à jour les permissions dans formData
    const permissionsArray = Array.from(newSelectedPermissions);
    handleChange('permissions', permissionsArray);
  }, [selectedPermissions, handleChange]);

  // Gestion des changements de rôle
  const handleRoleChange = useCallback((role) => {
    handleChange('role', role);
    
    // Appliquer des permissions par défaut selon le rôle
    let defaultPermissions = [];
    
    switch(role) {
      case 'Administrateur':
        defaultPermissions = [
          'Accès dashboard',
          'Gestion stocks',
          'Gestion ventes',
          'Gestion clients',
          'Gestion fournisseurs',
          'Gestion produits',
          'Gestion utilisateurs',
          'Gestion rapports',
          'Export données',
          'Paramètres système'
        ];
        break;
      case 'Vendeur':
        defaultPermissions = [
          'Accès dashboard',
          'Gestion ventes',
          'Gestion clients',
          'Vue statistiques'
        ];
        break;
      case 'Gestionnaire Stock':
        defaultPermissions = [
          'Accès dashboard',
          'Gestion stocks',
          'Gestion produits',
          'Gestion fournisseurs',
          'Export données'
        ];
        break;
      default:
        defaultPermissions = ['Accès dashboard'];
    }
    
    // Mettre à jour les permissions sélectionnées
    setSelectedPermissions(new Set(defaultPermissions));
    handleChange('permissions', defaultPermissions);
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

  // Générer un mot de passe sécurisé
  const generateSecurePassword = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    handleChange('motDePasse', password);
    handleChange('confirmMotDePasse', password);
  }, [handleChange]);

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
        // Nettoyer les données sensibles si nécessaire
        motDePasse: isEditing && !formData.motDePasse ? '********' : formData.motDePasse,
        derniereModification: new Date().toISOString()
      };
      
      console.log('Utilisateur sauvegardé:', finalData);
      
      // Simuler la sauvegarde dans localStorage pour la démonstration
      const savedUsers = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
      
      if (isEditing) {
        // Mettre à jour l'utilisateur existant
        const index = savedUsers.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
          savedUsers[index] = finalData;
        } else {
          savedUsers.push(finalData);
        }
      } else {
        // Ajouter un nouvel utilisateur
        savedUsers.push(finalData);
      }
      
      localStorage.setItem('utilisateurs', JSON.stringify(savedUsers));
      
      setHasUnsavedChanges(false);
      
      // Message de succès
      alert(isEditing ? '✅ Utilisateur modifié avec succès!' : '✅ Utilisateur créé avec succès!');
      
      // Redirection
      navigate('/utilisateursAdmin');
      
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
        // En mode édition, recharger les données originales
        loadUserData();
      } else {
        // En mode création, réinitialiser à zéro
        const timestamp = Date.now().toString().slice(-4);
        const randomChars = Math.random().toString(36).substring(2, 4).toLowerCase();
        const identifiant = `user${timestamp}${randomChars}`;
        
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          identifiant: identifiant,
          poste: '',
          role: '',
          salaire: 0,
          dateEmbauche: new Date().toISOString().split('T')[0],
          adresse: '',
          ville: '',
          codePostal: '',
          pays: 'Madagascar',
          motDePasse: '',
          confirmMotDePasse: '',
          isActive: true,
          forceChangementMDP: false,
          permissions: [],
          langue: 'fr',
          fuseauHoraire: 'UTC+3',
          formatDate: 'DD/MM/YYYY',
          notificationsEmail: true,
          notificationsSMS: false,
          notificationsPush: true,
          dateCreation: new Date().toISOString().split('T')[0],
          creerPar: 'Admin',
          derniereModification: new Date().toISOString(),
          notes: '',
          signature: ''
        });
        
        setSelectedPermissions(new Set());
        setHasUnsavedChanges(false);
        setValidationErrors({});
        setCurrentStep(1);
        setStepValidations({
          1: false, 2: false, 3: true, 4: true, 5: true
        });
      }
    }
  }, [isEditing, loadUserData]);

  // Rendu conditionnel par étape
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Chargement de l'utilisateur...</p>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoPersonOutline /> Informations Personnelles
              </h3>
              <p className={styles.stepDescription}>
                Saisissez les informations de base de l'utilisateur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Nom complet"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  name="nom"
                  placeholder="Ex: Jean Rakoto"
                  icon={<IoPersonOutline />}
                  required
                  maxLength={100}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  name="email"
                  placeholder="exemple@quincaillerie.mg"
                  icon={<IoMailOutline />}
                  required
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="tel"
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  name="telephone"
                  placeholder="+261 32 12 345 67"
                  icon={<IoCallOutline />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Identifiant"
                  value={formData.identifiant}
                  onChange={(e) => handleChange('identifiant', e.target.value)}
                  name="identifiant"
                  placeholder="Ex: jrakoto"
                  icon={<FaIdCard />}
                  required
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Rôle *"
                  value={formData.role}
                  onChange={handleRoleChange}
                  options={[
                    { value: '', label: 'Sélectionner un rôle', disabled: true },
                    ...roles
                  ]}
                  placeholder="Choisir un rôle"
                  icon={<FaUserTie />}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Poste"
                  value={formData.poste}
                  onChange={(e) => handleChange('poste', e.target.value)}
                  name="poste"
                  placeholder="Ex: Vendeur senior"
                  icon={<IoBusinessOutline />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Salaire (Ar)"
                  value={formData.salaire}
                  onChange={(e) => handleChange('salaire', parseFloat(e.target.value) || 0)}
                  name="salaire"
                  min="0"
                  step="10000"
                  icon={<TbCertificate />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="date"
                  label="Date d'embauche"
                  value={formData.dateEmbauche}
                  onChange={(e) => handleChange('dateEmbauche', e.target.value)}
                  name="dateEmbauche"
                  icon={<IoCalendarOutline />}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Adresse"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  name="adresse"
                  placeholder="Lotissement, quartier, rue"
                  icon={<IoLocationOutline />}
                  className={styles.formInput}
                />
              </div>
            </div>
            
            <div className={styles.formGrid}>            
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Ville"
                  value={formData.ville}
                  onChange={(e) => handleChange('ville', e.target.value)}
                  name="ville"
                  placeholder="Ex: Antananarivo"
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Code postal"
                  value={formData.codePostal}
                  onChange={(e) => handleChange('codePostal', e.target.value)}
                  name="codePostal"
                  placeholder="Ex: 101"
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Pays"
                  value={formData.pays}
                  onChange={(e) => handleChange('pays', e.target.value)}
                  name="pays"
                  placeholder="Ex: Madagascar"
                  className={styles.formInput}
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
          <div className={styles}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoShieldCheckmarkOutline /> Sécurité & Accès
              </h3>
              <p className={styles.stepDescription}>
                Configurez les paramètres de sécurité et d'accès de l'utilisateur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              {!isEditing && (
                <>
                  <div className={styles.formGroup}>
                    <div className={styles.passwordField}>
                      <Input
                        type={showPassword ? "text" : "password"}
                        label="Mot de passe *"
                        value={formData.motDePasse}
                        onChange={(e) => handleChange('motDePasse', e.target.value)}
                        name="motDePasse"
                        placeholder="Mot de passe sécurisé"
                        icon={<IoKeyOutline />}
                        required={!isEditing}
                        error={validationErrors.motDePasse}
                        className={styles.formInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles.togglePassword}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                    <div className={styles.passwordStrength}>
                      <div 
                        className={`${styles.strengthBar} ${
                          formData.motDePasse.length >= 8 ? styles.strong : 
                          formData.motDePasse.length >= 6 ? styles.medium : styles.weak
                        }`}
                      ></div>
                      <span className={styles.strengthText}>
                        {formData.motDePasse.length >= 8 ? 'Fort' : 
                         formData.motDePasse.length >= 6 ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <div className={styles.passwordField}>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        label="Confirmer le mot de passe *"
                        value={formData.confirmMotDePasse}
                        onChange={(e) => handleChange('confirmMotDePasse', e.target.value)}
                        name="confirmMotDePasse"
                        placeholder="Confirmer le mot de passe"
                        icon={<IoKeyOutline />}
                        required={!isEditing}
                        error={validationErrors.confirmMotDePasse}
                        className={styles.formInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={styles.togglePassword}
                        aria-label={showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'}
                      >
                        {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <Button
                      variant="secondary"
                      size="small"
                      icon="key"
                      onClick={generateSecurePassword}
                      className={styles.generateBtn}
                    >
                      Générer un mot de passe sécurisé
                    </Button>
                  </div>
                </>
              )}
              
              <div className={styles.formGroup}>
                <div className={styles.statusToggle}>
                  <label className={styles.toggleLabel}>
                    <span className={styles.toggleText}>
                      {formData.isActive ? (
                        <>
                          <IoCheckmarkCircleOutline /> Compte actif
                        </>
                      ) : (
                        <>
                          <IoAlertCircleOutline /> Compte inactif
                        </>
                      )}
                    </span>
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.statusToggle}>
                  <label className={styles.toggleLabel}>
                    <span className={styles.toggleText}>
                      <IoKeyOutline /> Forcer le changement de mot de passe
                    </span>
                    <input
                      type="checkbox"
                      name="forceChangementMDP"
                      checked={formData.forceChangementMDP}
                      onChange={(e) => handleChange('forceChangementMDP', e.target.checked)}
                      className={styles.toggleInput}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className={styles.securityNote}>
                <IoInformationCircleOutline />
                <span>
                  En mode édition, laissez les champs mot de passe vides pour conserver le mot de passe actuel.
                  Remplissez-les uniquement si vous souhaitez le modifier.
                </span>
              </div>
            )}
            
            {/* Aide de validation */}
            {!stepValidations[2] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez corriger les erreurs de mot de passe pour continuer</span>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <FaUserShield /> Permissions
              </h3>
              <p className={styles.stepDescription}>
                Définissez les permissions d'accès de l'utilisateur
              </p>
            </div>
            
            <div className={styles.permissionsHeader}>
              <div className={styles.selectedCount}>
                {selectedPermissions.size} permission{selectedPermissions.size > 1 ? 's' : ''} sélectionnée{selectedPermissions.size > 1 ? 's' : ''}
              </div>
              <div className={styles.permissionActions}>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    const allPermissions = new Set(availablePermissions.map(p => p.label));
                    setSelectedPermissions(allPermissions);
                    handleChange('permissions', Array.from(allPermissions));
                  }}
                >
                  Sélectionner tout
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => {
                    setSelectedPermissions(new Set());
                    handleChange('permissions', []);
                  }}
                >
                  Désélectionner tout
                </Button>
              </div>
            </div>
            
            <div className={styles.permissionsGrid}>
              {availablePermissions.map((permission) => (
                <div key={permission.id} className={styles.permissionItem}>
                  <InputCheckbox
                    label={permission.label}
                    checked={selectedPermissions.has(permission.label)}
                    onChange={() => handlePermissionToggle(permission.label)}
                    color="blue"
                    className={styles.permissionCheckbox}
                  />
                  <div className={styles.permissionDescription}>
                    {permission.description}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.permissionsNote}>
              <IoInformationCircleOutline />
              <span>
                Les permissions définissent les actions que l'utilisateur peut effectuer dans le système.
                Soyez prudent lors de l'attribution des permissions.
              </span>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoSettingsOutline /> Préférences
              </h3>
              <p className={styles.stepDescription}>
                Configurez les préférences personnelles de l'utilisateur
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <InputSelect
                  label="Langue"
                  value={formData.langue}
                  onChange={(value) => handleChange('langue', value)}
                  options={languages}
                  placeholder="Choisir une langue"
                  icon={<IoLanguageOutline />}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Fuseau horaire"
                  value={formData.fuseauHoraire}
                  onChange={(value) => handleChange('fuseauHoraire', value)}
                  options={timezones}
                  placeholder="Choisir un fuseau horaire"
                  icon={<IoTimeOutline />}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Format de date"
                  value={formData.formatDate}
                  onChange={(value) => handleChange('formatDate', value)}
                  options={dateFormats}
                  placeholder="Choisir un format"
                  icon={<IoCalendarOutline />}
                />
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <h4 className={styles.sectionTitle}>
                  <IoNotificationsOutline /> Notifications
                </h4>
                <div className={styles.notificationsGrid}>
                  <InputCheckbox
                    label="Notifications par email"
                    checked={formData.notificationsEmail}
                    onChange={(e) => handleChange('notificationsEmail', e.target.checked)}
                    color="blue"
                  />
                  <InputCheckbox
                    label="Notifications SMS"
                    checked={formData.notificationsSMS}
                    onChange={(e) => handleChange('notificationsSMS', e.target.checked)}
                    color="blue"
                  />
                  <InputCheckbox
                    label="Notifications push"
                    checked={formData.notificationsPush}
                    onChange={(e) => handleChange('notificationsPush', e.target.checked)}
                    color="blue"
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Signature (pour les emails)"
                  value={formData.signature}
                  onChange={(e) => handleChange('signature', e.target.value)}
                  name="signature"
                  placeholder="Ex: Jean Rakoto\nVendeur senior\nQuincaillerie Malagasy"
                  rows={4}
                  maxLength={500}
                  className={styles.formTextarea}
                />
                <div className={styles.charCount}>
                  {formData.signature.length}/500 caractères
                </div>
              </div>
              
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  name="notes"
                  placeholder="Notes supplémentaires sur l'utilisateur..."
                  rows={3}
                  maxLength={250}
                  className={styles.formTextarea}
                />
                <div className={styles.charCount}>
                  {formData.notes.length}/250 caractères
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
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
                    <IoPersonOutline /> Informations Personnelles
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nom complet:</span>
                      <span className={styles.summaryValue}>{formData.nom || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Email:</span>
                      <span className={styles.summaryValue}>{formData.email || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Téléphone:</span>
                      <span className={styles.summaryValue}>{formData.telephone || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Identifiant:</span>
                      <span className={styles.summaryValue}>{formData.identifiant || 'Auto-généré'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Rôle:</span>
                      <span className={styles.summaryValue}>{formData.role || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Poste:</span>
                      <span className={styles.summaryValue}>{formData.poste || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Salaire:</span>
                      <span className={styles.summaryValue}>
                        {formData.salaire ? new Intl.NumberFormat('fr-MG').format(formData.salaire) + ' Ar' : 'Non renseigné'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date d\'embauche:</span>
                      <span className={styles.summaryValue}>{formData.dateEmbauche || 'Non renseignée'}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoShieldCheckmarkOutline /> Sécurité
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Statut du compte:</span>
                      <span className={`${styles.summaryValue} ${formData.isActive ? styles.active : styles.inactive}`}>
                        {formData.isActive ? 'ACTIF' : 'INACTIF'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Changement MDP:</span>
                      <span className={styles.summaryValue}>
                        {formData.forceChangementMDP ? 'Forcé à la prochaine connexion' : 'Non forcé'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <FaUserShield /> Permissions
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItemFull}>
                      <span className={styles.summaryLabel}>Permissions accordées:</span>
                      <div className={styles.permissionsSummary}>
                        {formData.permissions.length > 0 ? (
                          <div className={styles.permissionsList}>
                            {formData.permissions.slice(0, 5).map((perm, index) => (
                              <span key={index} className={styles.permissionBadge}>
                                {perm}
                              </span>
                            ))}
                            {formData.permissions.length > 5 && (
                              <span className={styles.morePermissions}>
                                +{formData.permissions.length - 5} autres
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className={styles.noPermissions}>Aucune permission</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoSettingsOutline /> Préférences
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Langue:</span>
                      <span className={styles.summaryValue}>
                        {languages.find(l => l.value === formData.langue)?.label || 'Français'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Fuseau horaire:</span>
                      <span className={styles.summaryValue}>{formData.fuseauHoraire}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Notifications:</span>
                      <span className={styles.summaryValue}>
                        {[
                          formData.notificationsEmail && 'Email',
                          formData.notificationsSMS && 'SMS',
                          formData.notificationsPush && 'Push'
                        ].filter(Boolean).join(', ') || 'Aucune'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.summaryActions}>
                <div className={styles.summaryStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Permissions</div>
                    <div className={styles.statValue}>{formData.permissions.length}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Statut</div>
                    <div className={`${styles.statValue} ${formData.isActive ? styles.active : styles.inactive}`}>
                      {formData.isActive ? 'ACTIF' : 'INACTIF'}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Mode</div>
                    <div className={`${styles.statValue} ${isEditing ? styles.edit : styles.new}`}>
                      {isEditing ? 'MODIFICATION' : 'NOUVEAU'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vérification finale */}
            <div className={styles.finalValidation} role="status">
              <IoCheckmarkCircleOutline />
              <span>Toutes les étapes sont validées. Vous pouvez sauvegarder l'utilisateur.</span>
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
                {isEditing ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEditing ? 'Modifiez les informations de l\'utilisateur existant' : 'Créez un nouvel utilisateur pour votre système'}
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
                  label="Utilisateurs"
                  onClick={() => navigate('/utilisateursAdmin')}
                  style={{ cursor: 'pointer' }}
                  role="link"
                />
                <StyledBreadcrumb
                  label={isEditing ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}
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
                  iconPosition='right'
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
                  icon="check"
                  iconPosition='right'
                  type="submit"
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
                      {isEditing ? 'Mettre à jour' : 'Créer l\'utilisateur'}
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
              icon="share"
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
                navigate('/utilisateursAdmin');
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
              <IoShieldCheckmarkOutline />
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
              icon="arrowUp"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={styles.footerBtn}
            >
              <IoArrowBackOutline style={{ transform: 'rotate(-90deg)' }} /> Haut de page
            </Button>
          </div>
        </footer>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default FrmUtilisateurs;