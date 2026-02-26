import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './FrmCommandes.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import Toast from '../../../components/Toast/Toast';
import { 
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoCalculatorOutline,
  IoCloudUploadOutline,
  IoPencilOutline,
  IoCloudDoneOutline,
  IoArrowBackOutline,
  IoRefreshOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoAddOutline,
  IoSearchOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoLocationOutline,
  IoCardOutline,
  IoReceiptOutline,
  IoCartOutline,
  IoCashOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaUserTie,
  FaClipboardList,
  FaCheckCircle,
  FaSync,
  FaFileInvoiceDollar
} from "react-icons/fa";
import { 
  TbCurrencyDollar,
  TbPercentage,
  TbBuildingWarehouse,
  TbReceipt,
  TbPackage,
  TbTruckDelivery,
  TbDiscount
} from "react-icons/tb";
import { 
  MdInventory,
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineStorefront
} from "react-icons/md";
import { GiWeight, GiPayMoney, GiReceiveMoney } from "react-icons/gi";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Chip, emphasize, styled } from '@mui/material';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';

// Importer les constantes depuis commandesTypes
import { 
  COMMANDE_TYPES,
  mockCommandes 
} from '../../../constants/commandeTypes';

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

// Composant ProduitItem pour la liste des produits
const ProduitItem = ({ produit, index, onUpdate, onRemove }) => {
  const handleQuantityChange = (value) => {
    onUpdate(index, { ...produit, qty: parseInt(value) || 0 });
  };

  const handlePriceChange = (value) => {
    onUpdate(index, { ...produit, prix: parseFloat(value) || 0 });
  };

  return (
    <div className={styles.produitItem}>
      <div className={styles.produitHeader}>
        <span className={styles.produitName}>{produit.nom}</span>
        <Button
          variant="danger"
          size="small"
          icon="trash"
          onClick={() => onRemove(index)}
          className={styles.removeProduitBtn}
          aria-label={`Supprimer ${produit.nom}`}
        />
      </div>
      <div className={styles.produitDetails}>
        <div className={styles.formGroup}>
          <Input
            type="number"
            label="Quantité"
            value={produit.qty}
            onChange={(e) => handleQuantityChange(e.target.value)}
            min="1"
            step="1"
            icon={<TbPackage />}
            className={styles.produitInput}
          />
        </div>
        <div className={styles.formGroup}>
          <Input
            type="number"
            label="Prix unitaire (Ar)"
            value={produit.prix}
            onChange={(e) => handlePriceChange(e.target.value)}
            min="0"
            step="100"
            icon={<MdAttachMoney />}
            className={styles.produitInput}
          />
        </div>
        <div className={styles.formGroup}>
          <div className={styles.totalLabel}>
            <span>Sous-total</span>
            <span className={styles.totalValue}>
              {new Intl.NumberFormat('fr-MG', {
                style: 'currency',
                currency: 'MGA',
                minimumFractionDigits: 0
              }).format(produit.qty * produit.prix)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de formulaire avec pagination par étapes
const FrmCommandes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    numero: '',
    client: '',
    vendeur: '',
    date: new Date().toISOString().split('T')[0],
    dateLivraison: '',
    statut: 'en_cours',
    typeCommande: COMMANDE_TYPES.EN_COURS,
    typeLivraison: 'livraison',
    
    // Informations client
    adresseLivraison: '',
    telephone: '',
    email: '',
    
    // Produits
    produits: [],
    
    // Paiement
    paiement: 'à crédit',
    conditionPaiement: '30 jours',
    montant: 0,
    remise: 0,
    fraisLivraison: 0,
    montantTotal: 0,
    
    // Notes et métadonnées
    notes: '',
    priorite: 'normale',
    creerPar: 'Admin',
    dateCreation: new Date().toISOString().split('T')[0],
    derniereModification: new Date().toISOString(),
  });

  // États pour l'UI
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [stepValidations, setStepValidations] = useState({
    1: false, 2: false, 3: false, 4: true, 5: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showProduitModal, setShowProduitModal] = useState(false);
  const [newProduit, setNewProduit] = useState({
    nom: '',
    qty: 1,
    prix: 0
  });

  // Référence pour les IDs uniques des toasts
  const toastIdRef = useRef(0);

  // Données statiques
  const statuts = [
    { value: 'en_cours', label: 'En cours' },
    { value: 'arrivee_partielle', label: 'Arrivée partielle' },
    { value: 'validee', label: 'Validée' },
    { value: 'en_attente', label: 'En attente' },
    { value: 'annulee', label: 'Annulée' }
  ];

  const typesLivraison = [
    { value: 'livraison', label: 'Livraison' },
    { value: 'a_emporter', label: 'À emporter' }
  ];

  const modesPaiement = [
    { value: 'payée', label: 'Payée' },
    { value: 'acompte', label: 'Acompte' },
    { value: 'à crédit', label: 'À crédit' },
    { value: 'en_attente', label: 'En attente' }
  ];

  const conditionsPaiement = [
    { value: 'Comptant', label: 'Comptant' },
    { value: '30 jours', label: '30 jours' },
    { value: '60 jours', label: '60 jours' },
    { value: '90 jours', label: '90 jours' }
  ];

  const priorites = [
    { value: 'normale', label: 'Normale' },
    { value: 'haute', label: 'Haute' },
    { value: 'urgente', label: 'Urgente' }
  ];

  // Liste des produits disponibles
  const produitsDisponibles = [
    { id: 1, nom: 'Ciment 50kg', prix: 35000, stock: 50, unite: 'sac' },
    { id: 2, nom: 'Tôle Galvanisée 3m', prix: 30000, stock: 20, unite: 'feuille' },
    { id: 3, nom: 'Peinture Blanche', prix: 40000, stock: 15, unite: 'pot' },
    { id: 4, nom: 'Vis 5cm', prix: 500, stock: 1000, unite: 'pièce' },
    { id: 5, nom: 'Clous 3cm', prix: 300, stock: 2000, unite: 'pièce' },
    { id: 6, nom: 'Planche Bois 2m', prix: 25000, stock: 30, unite: 'pièce' },
    { id: 7, nom: 'Tuile Rouge', prix: 1500, stock: 500, unite: 'pièce' },
    { id: 8, nom: 'Câble Électrique 100m', prix: 75000, stock: 10, unite: 'rouleau' }
  ];

  // Définition des étapes
  const steps = [
    { id: 1, label: 'Informations Client', icon: <IoPersonOutline /> },
    { id: 2, label: 'Produits', icon: <FaBox /> },
    { id: 3, label: 'Livraison', icon: <TbTruckDelivery /> },
    { id: 4, label: 'Paiement', icon: <TbCurrencyDollar /> },
    { id: 5, label: 'Validation', icon: <IoCheckmarkCircleOutline /> }
  ];

  // Fonction pour ajouter un toast avec ID unique
  const addToast = useCallback((message, type = "info") => {
    const toastId = Date.now() + '_' + (++toastIdRef.current);
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 5000);
  }, []);

  // Calcul des totaux
  const calculerTotaux = useCallback(() => {
    const sousTotal = formData.produits.reduce((total, produit) => {
      return total + (produit.qty * produit.prix);
    }, 0);
    
    const remise = parseFloat(formData.remise) || 0;
    const fraisLivraison = parseFloat(formData.fraisLivraison) || 0;
    const montant = sousTotal - remise + fraisLivraison;
    
    setFormData(prev => ({
      ...prev,
      montant: montant,
      montantTotal: montant
    }));
  }, [formData.produits, formData.remise, formData.fraisLivraison]);

  // Mettre à jour les totaux quand les produits changent
  useEffect(() => {
    calculerTotaux();
  }, [formData.produits, formData.remise, formData.fraisLivraison, calculerTotaux]);

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
        if (!formData.client.trim()) {
          errors.client = 'Le nom du client est requis';
          isValid = false;
        }
        if (!formData.dateLivraison) {
          errors.dateLivraison = 'La date de livraison est requise';
          isValid = false;
        }
        if (!formData.adresseLivraison && formData.typeLivraison === 'livraison') {
          errors.adresseLivraison = 'L\'adresse de livraison est requise';
          isValid = false;
        }
        break;
        
      case 2:
        if (formData.produits.length === 0) {
          errors.produits = 'Au moins un produit est requis';
          isValid = false;
        }
        break;
        
      case 3:
        if (!formData.typeLivraison) {
          errors.typeLivraison = 'Le type de livraison est requis';
          isValid = false;
        }
        break;
          
      case 4:
        if (!formData.paiement) {
          errors.paiement = 'Le mode de paiement est requis';
          isValid = false;
        }
        if (formData.montant <= 0) {
          errors.montant = 'Le montant doit être positif';
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

  // Fonction pour charger les données d'une commande existante
  const loadCommandeData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      if (id) {
        const commandeId = parseInt(id);
        
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const commande = mockCommandes.find(c => c.id === commandeId);
        
        if (commande) {
          // Transformer les données pour le formulaire
          setFormData({
            // Informations de base
            numero: commande.numero,
            client: commande.client,
            vendeur: commande.vendeur,
            date: commande.date,
            dateLivraison: commande.dateLivraison,
            statut: commande.statut,
            typeCommande: commande.typeCommande,
            typeLivraison: commande.typeLivraison,
            
            // Informations client
            adresseLivraison: commande.adresseLivraison || '',
            telephone: commande.telephone || '',
            email: commande.email || '',
            
            // Produits
            produits: commande.produits || [],
            
            // Paiement
            paiement: commande.paiement,
            conditionPaiement: commande.conditionPaiement || '30 jours',
            montant: commande.montant,
            remise: commande.remise || 0,
            fraisLivraison: commande.fraisLivraison || 0,
            montantTotal: commande.montant,
            
            // Notes et métadonnées
            notes: commande.notes || '',
            priorite: commande.priorite || 'normale',
            creerPar: commande.creerPar || 'Admin',
            dateCreation: commande.dateCreation || new Date().toISOString().split('T')[0],
            derniereModification: new Date().toISOString(),
          });
          
          setIsEditing(true);
          
          // Marquer toutes les étapes comme valides en mode édition
          setStepValidations({
            1: true, 2: true, 3: true, 4: true, 5: true
          });
          
          addToast('Commande chargée avec succès', 'success');
        } else {
          addToast('Commande non trouvée', 'error');
          navigate('/commandesAdmin');
        }
      } else {
        // Mode création : générer un numéro automatique
        const timestamp = Date.now().toString().slice(-6);
        const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
        const numero = `CMD-${new Date().getFullYear()}-${timestamp}-${randomChars}`;
        
        setFormData(prev => ({
          ...prev,
          numero,
          vendeur: 'Admin', // Par défaut
          dateCreation: new Date().toISOString().split('T')[0],
          derniereModification: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
      addToast('Erreur lors du chargement de la commande', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, addToast]);

  // Initialiser
  useEffect(() => {
    loadCommandeData();
  }, [loadCommandeData]);

  // Valider l'étape actuelle à chaque changement de données
  useEffect(() => {
    validateStep(currentStep);
  }, [formData, currentStep, validateStep]);

  // Gestion des changements de formulaire
  const handleChange = useCallback((name, value) => {
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Mettre à jour la date de modification
      updated.derniereModification = new Date().toISOString();
      
      return updated;
    });
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  // Gestion du nouveau produit
  const handleNewProduitChange = useCallback((name, value) => {
    setNewProduit(prev => ({ ...prev, [name]: value }));
  }, []);

  // Ajouter un produit
  const handleAddProduit = useCallback(() => {
    if (!newProduit.nom.trim() || newProduit.qty <= 0 || newProduit.prix <= 0) {
      addToast('Veuillez remplir tous les champs du produit', 'warning');
      return;
    }
    
    const produitExistant = formData.produits.find(p => p.nom === newProduit.nom);
    
    if (produitExistant) {
      setFormData(prev => ({
        ...prev,
        produits: prev.produits.map(p =>
          p.nom === newProduit.nom
            ? { ...p, qty: p.qty + newProduit.qty }
            : p
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        produits: [...prev.produits, { 
          ...newProduit, 
          id: Date.now() + '_' + Math.random().toString(36).substring(2, 9) 
        }]
      }));
    }
    
    setNewProduit({ nom: '', qty: 1, prix: 0 });
    setShowProduitModal(false);
    addToast('Produit ajouté avec succès', 'success');
  }, [newProduit, formData.produits, addToast]);

  // Mettre à jour un produit
  const handleUpdateProduit = useCallback((index, updatedProduit) => {
    setFormData(prev => ({
      ...prev,
      produits: prev.produits.map((p, i) =>
        i === index ? updatedProduit : p
      )
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Supprimer un produit
  const handleRemoveProduit = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      produits: prev.produits.filter((_, i) => i !== index)
    }));
    setHasUnsavedChanges(true);
    addToast('Produit supprimé', 'info');
  }, [addToast]);

  // Navigation entre les étapes
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      addToast('Veuillez corriger les erreurs avant de continuer', 'warning');
    }
  }, [currentStep, validateStep, steps.length, addToast]);

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
        addToast('Veuillez corriger les erreurs avant de changer d\'étape', 'warning');
      }
    }
  }, [currentStep, validateStep, addToast]);

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
      addToast('Veuillez corriger toutes les erreurs avant de soumettre', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Préparer les données finales
      const finalData = {
        ...formData,
        id: isEditing ? parseInt(id) : mockCommandes.length + 1,
        dateLivraison: formData.dateLivraison,
        montant: formData.montantTotal,
        articles: formData.produits.reduce((sum, p) => sum + p.qty, 0),
        derniereModification: new Date().toISOString()
      };
      
      console.log('Commande sauvegardée:', finalData);
      
      // Sauvegarde dans localStorage pour la démonstration
      const savedCommandes = JSON.parse(localStorage.getItem('commandes') || '[]');
      
      if (isEditing) {
        // Mettre à jour la commande existante
        const index = savedCommandes.findIndex(c => c.id === parseInt(id));
        if (index !== -1) {
          savedCommandes[index] = finalData;
        } else {
          savedCommandes.push(finalData);
        }
      } else {
        // Ajouter une nouvelle commande
        savedCommandes.push(finalData);
      }
      
      localStorage.setItem('commandes', JSON.stringify(savedCommandes));
      
      setHasUnsavedChanges(false);
      
      // Message de succès
      addToast(
        isEditing ? '✅ Commande modifiée avec succès!' : '✅ Commande créée avec succès!',
        'success'
      );
      
      // Redirection
      setTimeout(() => {
        navigate('/commandesAdmin');
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      addToast('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Réinitialiser le formulaire
  const handleReset = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      if (isEditing) {
        loadCommandeData();
      } else {
        const timestamp = Date.now().toString().slice(-6);
        const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
        const numero = `CMD-${new Date().getFullYear()}-${timestamp}-${randomChars}`;
        
        setFormData({
          numero: numero,
          client: '',
          vendeur: 'Admin',
          date: new Date().toISOString().split('T')[0],
          dateLivraison: '',
          statut: 'en_cours',
          typeCommande: COMMANDE_TYPES.EN_COURS,
          typeLivraison: 'livraison',
          adresseLivraison: '',
          telephone: '',
          email: '',
          produits: [],
          paiement: 'à crédit',
          conditionPaiement: '30 jours',
          montant: 0,
          remise: 0,
          fraisLivraison: 0,
          montantTotal: 0,
          notes: '',
          priorite: 'normale',
          creerPar: 'Admin',
          dateCreation: new Date().toISOString().split('T')[0],
          derniereModification: new Date().toISOString(),
        });
        setHasUnsavedChanges(false);
        setValidationErrors({});
        setCurrentStep(1);
        setStepValidations({
          1: false, 2: false, 3: false, 4: true, 5: true
        });
      }
    }
  }, [isEditing, loadCommandeData]);

  // Rendu conditionnel par étape
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Chargement de la commande...</p>
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
                Saisissez les informations du client et de la commande
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Numéro de Commande"
                  value={formData.numero}
                  onChange={(e) => handleChange('numero', e.target.value)}
                  name="numero"
                  icon={<TbReceipt />}
                  readOnly={isEditing}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Client *"
                  value={formData.client}
                  onChange={(e) => handleChange('client', e.target.value)}
                  name="client"
                  placeholder="Nom du client ou entreprise"
                  icon={<IoPersonOutline />}
                  required
                  error={validationErrors.client}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Vendeur"
                  value={formData.vendeur}
                  onChange={(e) => handleChange('vendeur', e.target.value)}
                  name="vendeur"
                  placeholder="Nom du vendeur"
                  icon={<FaUserTie />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="date"
                  label="Date de Commande"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  name="date"
                  icon={<IoCalendarOutline />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="date"
                  label="Date de Livraison *"
                  value={formData.dateLivraison}
                  onChange={(e) => handleChange('dateLivraison', e.target.value)}
                  name="dateLivraison"
                  icon={<IoCalendarOutline />}
                  required
                  error={validationErrors.dateLivraison}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Priorité"
                  value={formData.priorite}
                  onChange={(value) => handleChange('priorite', value)}
                  options={priorites}
                  placeholder="Sélectionner la priorité"
                  icon={<IoWarningOutline />}
                  className={styles.formSelect}
                />
              </div>
              
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  name="notes"
                  placeholder="Notes supplémentaires..."
                  icon={<IoInformationCircleOutline />}
                  rows={3}
                  className={styles.formTextarea}
                />
              </div>
            </div>
            
            {/* Informations de contact */}
            <div className={styles.sectionDivider}>
              <h4 className={styles.sectionTitle}>
                <IoPersonOutline /> Informations de Contact
              </h4>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Adresse de Livraison"
                  value={formData.adresseLivraison}
                  onChange={(e) => handleChange('adresseLivraison', e.target.value)}
                  name="adresseLivraison"
                  placeholder="Adresse complète de livraison"
                  icon={<IoLocationOutline />}
                  rows={2}
                  error={validationErrors.adresseLivraison}
                  className={styles.formTextarea}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="tel"
                  label="Téléphone"
                  value={formData.telephone}
                  onChange={(e) => handleChange('telephone', e.target.value)}
                  name="telephone"
                  placeholder="+261 XX XX XX XX"
                  icon={<IoCardOutline />}
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
                  placeholder="email@example.com"
                  icon={<IoCardOutline />}
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
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <FaBox /> Produits
              </h3>
              <p className={styles.stepDescription}>
                Ajoutez les produits à la commande
              </p>
            </div>
            
            {/* Liste des produits */}
            <div className={styles.produitsSection}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>
                  <TbPackage /> Produits commandés ({formData.produits.length})
                </h4>
                <Button
                  variant="primary"
                  size="medium"
                  icon="add"
                  onClick={() => setShowProduitModal(true)}
                  className={styles.addProduitBtn}
                >
                  Ajouter un produit
                </Button>
              </div>
              
              {formData.produits.length === 0 ? (
                <div className={styles.noProduits}>
                  <FaBox className={styles.noProduitsIcon} />
                  <p>Aucun produit ajouté</p>
                  <small>Cliquez sur "Ajouter un produit" pour commencer</small>
                </div>
              ) : (
                <div className={styles.produitsList}>
                  {formData.produits.map((produit, index) => (
                    <ProduitItem
                      key={`produit_${produit.id || index}_${produit.nom}`}
                      produit={produit}
                      index={index}
                      onUpdate={handleUpdateProduit}
                      onRemove={handleRemoveProduit}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Récapitulatif */}
            {formData.produits.length > 0 && (
              <div className={styles.recapSection}>
                <h4 className={styles.recapTitle}>
                  <IoCalculatorOutline /> Récapitulatif
                </h4>
                <div className={styles.recapGrid}>
                  <div className={styles.recapItem}>
                    <span className={styles.recapLabel}>Sous-total:</span>
                    <span className={styles.recapValue}>
                      {new Intl.NumberFormat('fr-MG', {
                        style: 'currency',
                        currency: 'MGA',
                        minimumFractionDigits: 0
                      }).format(
                        formData.produits.reduce((total, p) => total + (p.qty * p.prix), 0)
                      )}
                    </span>
                  </div>
                  <div className={styles.recapItem}>
                    <span className={styles.recapLabel}>Nombre d'articles:</span>
                    <span className={styles.recapValue}>
                      {formData.produits.reduce((total, p) => total + p.qty, 0)}
                    </span>
                  </div>
                  <div className={styles.recapItem}>
                    <span className={styles.recapLabel}>Produits différents:</span>
                    <span className={styles.recapValue}>{formData.produits.length}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Aide de validation */}
            {!stepValidations[2] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Vous devez ajouter au moins un produit pour continuer</span>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <TbTruckDelivery /> Livraison
              </h3>
              <p className={styles.stepDescription}>
                Configurez les options de livraison
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <InputSelect
                  label="Type de Livraison *"
                  value={formData.typeLivraison}
                  onChange={(value) => handleChange('typeLivraison', value)}
                  options={typesLivraison}
                  placeholder="Sélectionner le type"
                  icon={<MdOutlineLocalShipping />}
                  required
                  error={validationErrors.typeLivraison}
                  className={styles.formSelect}
                />
              </div>
              
              {formData.typeLivraison === 'livraison' && (
                <>
                  <div className={styles.formGroupFull}>
                    <InputTextarea
                      label="Adresse de Livraison *"
                      value={formData.adresseLivraison}
                      onChange={(e) => handleChange('adresseLivraison', e.target.value)}
                      name="adresseLivraison"
                      placeholder="Adresse complète de livraison"
                      icon={<IoLocationOutline />}
                      rows={2}
                      required
                      error={validationErrors.adresseLivraison}
                      className={styles.formTextarea}
                    />
                  </div>
                  
                  <div className={styles.formGroup}>
                    <Input
                      type="number"
                      label="Frais de Livraison (Ar)"
                      value={formData.fraisLivraison}
                      onChange={(e) => handleChange('fraisLivraison', parseFloat(e.target.value) || 0)}
                      name="fraisLivraison"
                      min="0"
                      step="1000"
                      icon={<GiPayMoney />}
                      className={styles.formInput}
                    />
                  </div>
                </>
              )}
              
              <div className={styles.formGroupFull}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <IoInformationCircleOutline />
                  </div>
                  <div className={styles.infoContent}>
                    <h5 className={styles.infoTitle}>
                      {formData.typeLivraison === 'livraison' ? 'Livraison à domicile' : 'À emporter'}
                    </h5>
                    <p className={styles.infoText}>
                      {formData.typeLivraison === 'livraison' 
                        ? 'La commande sera livrée à l\'adresse spécifiée.' 
                        : 'Le client viendra récupérer sa commande en magasin.'}
                    </p>
                    {formData.typeLivraison === 'a_emporter' && (
                      <p className={styles.infoHint}>
                        📍 Préparez la commande pour le retrait en magasin
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aide de validation */}
            {!stepValidations[3] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez configurer les options de livraison</span>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <TbCurrencyDollar /> Paiement
              </h3>
              <p className={styles.stepDescription}>
                Configurez les options de paiement
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <InputSelect
                  label="Mode de Paiement *"
                  value={formData.paiement}
                  onChange={(value) => handleChange('paiement', value)}
                  options={modesPaiement}
                  placeholder="Sélectionner le mode"
                  icon={<IoCashOutline />}
                  required
                  error={validationErrors.paiement}
                  className={styles.formSelect}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Condition de Paiement"
                  value={formData.conditionPaiement}
                  onChange={(value) => handleChange('conditionPaiement', value)}
                  options={conditionsPaiement}
                  placeholder="Sélectionner la condition"
                  icon={<IoTimeOutline />}
                  className={styles.formSelect}
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Remise (Ar)"
                  value={formData.remise}
                  onChange={(e) => handleChange('remise', parseFloat(e.target.value) || 0)}
                  name="remise"
                  min="0"
                  step="1000"
                  icon={<TbDiscount />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Statut"
                  value={formData.statut}
                  onChange={(value) => handleChange('statut', value)}
                  options={statuts}
                  placeholder="Sélectionner le statut"
                  icon={<IoCheckmarkCircleOutline />}
                  className={styles.formSelect}
                />
              </div>
            </div>
            
            {/* Récapitulatif financier */}
            <div className={styles.financialSummary}>
              <h4 className={styles.summaryTitle}>
                <IoCalculatorOutline /> Récapitulatif Financier
              </h4>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Sous-total produits:</span>
                  <span className={styles.summaryValue}>
                    {new Intl.NumberFormat('fr-MG', {
                      style: 'currency',
                      currency: 'MGA',
                      minimumFractionDigits: 0
                    }).format(
                      formData.produits.reduce((total, p) => total + (p.qty * p.prix), 0)
                    )}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Remise:</span>
                  <span className={`${styles.summaryValue} ${styles.discount}`}>
                    -{new Intl.NumberFormat('fr-MG', {
                      style: 'currency',
                      currency: 'MGA',
                      minimumFractionDigits: 0
                    }).format(formData.remise)}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Frais de livraison:</span>
                  <span className={styles.summaryValue}>
                    +{new Intl.NumberFormat('fr-MG', {
                      style: 'currency',
                      currency: 'MGA',
                      minimumFractionDigits: 0
                    }).format(formData.fraisLivraison)}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Montant total:</span>
                  <span className={`${styles.summaryValue} ${styles.total}`}>
                    {new Intl.NumberFormat('fr-MG', {
                      style: 'currency',
                      currency: 'MGA',
                      minimumFractionDigits: 0
                    }).format(formData.montantTotal)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Aide de validation */}
            {!stepValidations[4] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez configurer les options de paiement</span>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoCheckmarkCircleOutline /> Validation
              </h3>
              <p className={styles.stepDescription}>
                Vérifiez les informations avant de sauvegarder
              </p>
            </div>
            
            <div className={styles.validationContainer}>
              {/* Récapitulatif complet */}
              <div className={styles.summaryCard}>
                {/* Informations client */}
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <IoPersonOutline /> Informations Client
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Numéro:</span>
                      <span className={styles.summaryValue}>{formData.numero}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Client:</span>
                      <span className={styles.summaryValue}>{formData.client}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Vendeur:</span>
                      <span className={styles.summaryValue}>{formData.vendeur}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Date commande:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Livraison:</span>
                      <span className={styles.summaryValue}>
                        {new Date(formData.dateLivraison).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Priorité:</span>
                      <span className={`${styles.summaryValue} ${
                        formData.priorite === 'haute' ? styles.highPriority : 
                        formData.priorite === 'urgente' ? styles.urgentPriority : ''
                      }`}>
                        {formData.priorite}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Type de commande:</span>
                      <span className={styles.summaryValue}>
                        {formData.typeCommande === COMMANDE_TYPES.EN_COURS ? 'En cours' :
                         formData.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE ? 'Arrivée partielle' :
                         formData.typeCommande === COMMANDE_TYPES.VALIDEE ? 'Validée' : formData.typeCommande}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Produits */}
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <FaBox /> Produits ({formData.produits.length})
                  </h4>
                  <div className={styles.produitsSummary}>
                    {formData.produits.map((produit, index) => (
                      <div key={`summary_${index}_${produit.nom}`} className={styles.produitSummaryItem}>
                        <span className={styles.produitName}>{produit.nom}</span>
                        <span className={styles.produitDetails}>
                          {produit.qty} × {new Intl.NumberFormat('fr-MG', {
                            style: 'currency',
                            currency: 'MGA',
                            minimumFractionDigits: 0
                          }).format(produit.prix)} = {new Intl.NumberFormat('fr-MG', {
                            style: 'currency',
                            currency: 'MGA',
                            minimumFractionDigits: 0
                          }).format(produit.qty * produit.prix)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Livraison */}
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <TbTruckDelivery /> Livraison
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Type:</span>
                      <span className={styles.summaryValue}>
                        {formData.typeLivraison === 'livraison' ? 'Livraison' : 'À emporter'}
                      </span>
                    </div>
                    {formData.typeLivraison === 'livraison' && (
                      <>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Adresse:</span>
                          <span className={styles.summaryValue}>{formData.adresseLivraison}</span>
                        </div>
                        <div className={styles.summaryItem}>
                          <span className={styles.summaryLabel}>Frais:</span>
                          <span className={styles.summaryValue}>
                            {new Intl.NumberFormat('fr-MG', {
                              style: 'currency',
                              currency: 'MGA',
                              minimumFractionDigits: 0
                            }).format(formData.fraisLivraison)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Paiement */}
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <TbCurrencyDollar /> Paiement
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Mode:</span>
                      <span className={styles.summaryValue}>{formData.paiement}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Condition:</span>
                      <span className={styles.summaryValue}>{formData.conditionPaiement}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Statut:</span>
                      <span className={styles.summaryValue}>{formData.statut}</span>
                    </div>
                  </div>
                </div>
                
                {/* Total */}
                <div className={styles.totalSection}>
                  <div className={styles.totalItem}>
                    <span className={styles.totalLabel}>Montant total:</span>
                    <span className={styles.totalAmount}>
                      {new Intl.NumberFormat('fr-MG', {
                        style: 'currency',
                        currency: 'MGA',
                        minimumFractionDigits: 0
                      }).format(formData.montantTotal)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Actions de validation */}
              <div className={styles.validationActions}>
                <Button
                  variant={hasUnsavedChanges ? "primary" : "outline"}
                  size="medium"
                  icon="print"
                  onClick={() => window.print()}
                  className={styles.validationButton}
                >
                  Imprimer
                </Button>
                
                <div className={styles.validationStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Nombre d'articles</div>
                    <div className={styles.statValue}>
                      {formData.produits.reduce((total, p) => total + p.qty, 0)}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Produits différents</div>
                    <div className={styles.statValue}>{formData.produits.length}</div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Mode</div>
                    <div className={styles.statValue}>
                      {isEditing ? 'MODIFICATION' : 'CRÉATION'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vérification finale */}
            <div className={styles.finalValidation} role="status">
              <FaCheckCircle />
              <span>Toutes les étapes sont validées. Vous pouvez sauvegarder la commande.</span>
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
                {isEditing ? 'Modifier Commande' : 'Nouvelle Commande'}
              </h1>
              <p className={styles.formSubtitle}>
                {isEditing ? 'Modifiez les informations de la commande' : 'Créez une nouvelle commande pour votre client'}
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
                  label="Commandes"
                  onClick={() => navigate('/commandesAdmin')}
                  style={{ cursor: 'pointer' }}
                  role="link"
                />
                <StyledBreadcrumb
                  label={isEditing ? 'Modifier Commande' : 'Nouvelle Commande'}
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
                  aria-label={isEditing ? 'Mettre à jour la commande' : 'Créer la commande'}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true"></span>
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      {isEditing ? 'Mettre à jour' : 'Créer la commande'}
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
                navigate('/commandesAdmin');
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
              aria-label="Retour en haut de la page"
            >
              <IoArrowBackOutline style={{ transform: 'rotate(-90deg)' }} /> Haut de page
            </Button>
          </div>
        </footer>
        
        {/* Modale pour ajouter un produit */}
        <Modal
          isOpen={showProduitModal}
          onClose={() => setShowProduitModal(false)}
        >
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <FaBox /> Ajouter un produit
            </h3>
            
            <div className={styles.modalBody}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Produit *"
                    value={newProduit.nom}
                    onChange={(value) => handleNewProduitChange('nom', value)}
                    options={[
                      { value: '', label: 'Sélectionner un produit', disabled: true },
                      ...produitsDisponibles.map(p => ({
                        value: p.nom,
                        label: `${p.nom} - ${new Intl.NumberFormat('fr-MG', {
                          style: 'currency',
                          currency: 'MGA',
                          minimumFractionDigits: 0
                        }).format(p.prix)} (Stock: ${p.stock} ${p.unite})`
                      }))
                    ]}
                    placeholder="Choisir un produit"
                    icon={<FaBox />}
                    searchable
                    className={styles.modalSelect}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="number"
                    label="Quantité *"
                    value={newProduit.qty}
                    onChange={(e) => handleNewProduitChange('qty', parseInt(e.target.value) || 1)}
                    min="1"
                    step="1"
                    icon={<TbPackage />}
                    className={styles.modalInput}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <Input
                    type="number"
                    label="Prix unitaire (Ar) *"
                    value={newProduit.prix}
                    onChange={(e) => handleNewProduitChange('prix', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="100"
                    icon={<MdAttachMoney />}
                    className={styles.modalInput}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <Button
                variant="outline"
                size="medium"
                onClick={() => setShowProduitModal(false)}
                className={styles.modalButton}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={handleAddProduit}
                className={styles.modalButton}
              >
                Ajouter
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* Toasts avec clés uniques */}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            position="top-right"
            onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
          />
        ))}
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default FrmCommandes;