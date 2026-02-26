import React, { useState, useEffect, useCallback } from 'react';
import styles from './FrmProduits.module.css';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputFile from '../../../components/Input/InputFile';
import InputTextarea from '../../../components/Input/InputTextarea';
import Button from '../../../components/Button/Button';
import { 
  IoCheckmarkCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoDuplicateOutline,
  IoCalculatorOutline,
  IoImageOutline,
  IoCloudUploadOutline,
  IoPencilOutline,
  IoLockClosedOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaBarcode, 
  FaClipboardList, 
  FaCheckCircle
} from "react-icons/fa"; 
import { 
  TbCategory, 
  TbCurrencyDollar, 
  TbPercentage
} from "react-icons/tb";
import { 
  MdInventory, 
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineStorage
} from "react-icons/md";
import { GiWeight, GiPayMoney } from "react-icons/gi";
import { CiMoneyBill, CiSettings } from "react-icons/ci";

// Composant pour chaque étape du formulaire
const StepIndicator = ({ currentStep, steps, onStepClick, stepValidations }) => {
  return (
    <div className={styles.stepIndicator}>
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

// Composant principal
const FrmProduits = ({ 
  isOpen, 
  onClose, 
  onSave, 
  mode = 'create', 
  productData = null 
}) => {
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations de base
    nom: '',
    reference: '',
    categorie: '',
    description: '',
    image: null,
    
    // Stock & Unité
    stock: 0,
    seuilMin: 10,
    seuilAlerte: 20,
    unite: 'unité',
    emplacement: '',
    
    // Prix & Fournisseur
    prixAchat: 0,
    prixVente: 0,
    marge: 0,
    fournisseur: '',
    delaiLivraison: '',
    
    // Vente au détail
    peutEtreVenduEnDetail: false,
    prixDetail: 0,
    uniteDetail: 'kg',
    
    // Options avancées
    tvaApplicable: true,
    tauxTVA: 20,
    estPerequitable: false,
    estFragile: false,
    instructionsSpeciales: '',
    
    // Métadonnées
    dateCreation: new Date().toISOString().split('T')[0],
    creerPar: 'Admin',
    derniereModification: new Date().toISOString(),
  });

  // États pour l'UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [stepValidations, setStepValidations] = useState({
    1: false, 2: false, 3: false, 4: true, 5: true, 6: true
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Données statiques
  const categories = [
    { value: 'Matériaux Construction', label: 'Matériaux Construction' },
    { value: 'Ferronnerie', label: 'Ferronnerie' },
    { value: 'Quincaillerie', label: 'Quincaillerie' },
    { value: 'Peinture', label: 'Peinture' },
    { value: 'Plomberie', label: 'Plomberie' },
    { value: 'Électricité', label: 'Électricité' },
    { value: 'Outillage', label: 'Outillage' },
    { value: 'Sécurité', label: 'Sécurité' },
    { value: 'Jardinage', label: 'Jardinage' },
    { value: 'Éclairage', label: 'Éclairage' }
  ];

  const fournisseurs = [
    { value: 'Holcim Madagascar', label: 'Holcim Madagascar' },
    { value: 'Metaltron', label: 'Metaltron' },
    { value: 'Bricodépôt', label: 'Bricodépôt' },
    { value: 'Détaillant Local', label: 'Détaillant Local' },
    { value: 'ElectroPlus', label: 'ElectroPlus' },
    { value: 'Matériaux Pro', label: 'Matériaux Pro' }
  ];

  const unites = [
    { value: 'unité', label: 'Unité' },
    { value: 'kg', label: 'Kilogramme (kg)' },
    { value: 'g', label: 'Gramme (g)' },
    { value: 'L', label: 'Litre (L)' },
    { value: 'mL', label: 'Millilitre (mL)' },
    { value: 'm', label: 'Mètre (m)' },
    { value: 'cm', label: 'Centimètre (cm)' },
    { value: 'paquet', label: 'Paquet' },
    { value: 'carton', label: 'Carton' },
    { value: 'palette', label: 'Palette' },
    { value: 'boîte', label: 'Boîte' },
    { value: 'rouleau', label: 'Rouleau' },
    { value: 'sac', label: 'Sac' },
    { value: 'feuille', label: 'Feuille' }
  ];

  const delaisLivraison = [
    { value: '', label: 'Sélectionner un délai' },
    { value: '24h', label: '24 heures' },
    { value: '2-3 jours', label: '2-3 jours' },
    { value: '3-5 jours', label: '3-5 jours' },
    { value: '1 semaine', label: '1 semaine' },
    { value: '2 semaines', label: '2 semaines' },
    { value: 'Sur commande', label: 'Sur commande' }
  ];

  const tauxTVAOptions = [
    { value: '5', label: '5%' },
    { value: '10', label: '10%' },
    { value: '20', label: '20%' }
  ];

  // Définition des étapes
  const steps = [
    { id: 1, label: 'Informations de Base', icon: <FaBox /> },
    { id: 2, label: 'Stock & Unité', icon: <MdInventory /> },
    { id: 3, label: 'Prix & Fournisseur', icon: <TbCurrencyDollar /> },
    { id: 4, label: 'Vente Détail', icon: <IoDuplicateOutline /> },
    { id: 5, label: 'Options Avancées', icon: <CiSettings /> },
    { id: 6, label: 'Récapitulatif', icon: <IoCheckmarkCircleOutline /> }
  ];

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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

  // Calcul de la marge
  const calculateMarge = useCallback((achat, vente) => {
    const prixAchat = parseFloat(achat) || 0;
    const prixVente = parseFloat(vente) || 0;
    if (prixAchat > 0 && prixVente > 0) {
      return (((prixVente - prixAchat) / prixAchat) * 100).toFixed(2);
    }
    return '0.00';
  }, []);

  // Calcul du prix TTC
  const calculatePrixTTC = useCallback((prixVente, tvaApplicable, tauxTVA) => {
    const prixHT = parseFloat(prixVente) || 0;
    const taux = parseFloat(tauxTVA) || 0;
    const tva = tvaApplicable ? (prixHT * taux / 100) : 0;
    return prixHT + tva;
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
          errors.nom = 'Le nom du produit est requis';
          isValid = false;
        }
        if (!formData.categorie) {
          errors.categorie = 'La catégorie est requise';
          isValid = false;
        }
        if (formData.reference && formData.reference.length < 3) {
          errors.reference = 'La référence doit avoir au moins 3 caractères';
          isValid = false;
        }
        break;
        
      case 2:
        if (formData.stock < 0) {
          errors.stock = 'Le stock ne peut pas être négatif';
          isValid = false;
        }
        if (formData.seuilMin <= 0) {
          errors.seuilMin = 'Le seuil minimum doit être positif';
          isValid = false;
        }
        if (parseFloat(formData.seuilAlerte) < parseFloat(formData.seuilMin)) {
          errors.seuilAlerte = 'Le seuil d\'alerte doit être supérieur au seuil minimum';
          isValid = false;
        }
        if (!formData.unite) {
          errors.unite = 'L\'unité est requise';
          isValid = false;
        }
        break;
        
      case 3:
        if (formData.prixAchat <= 0) {
          errors.prixAchat = 'Le prix d\'achat doit être positif';
          isValid = false;
        }
        if (formData.prixVente <= 0) {
          errors.prixVente = 'Le prix de vente doit être positif';
          isValid = false;
        }
        if (parseFloat(formData.prixVente) <= parseFloat(formData.prixAchat)) {
          errors.prixVente = 'Le prix de vente doit être supérieur au prix d\'achat';
          isValid = false;
        }
        break;
          
      case 4:
        if (formData.peutEtreVenduEnDetail) {
          if (formData.prixDetail <= 0) {
            errors.prixDetail = 'Le prix détail doit être positif';
            isValid = false;
          }
          if (!formData.uniteDetail) {
            errors.uniteDetail = 'L\'unité détail est requise';
            isValid = false;
          }
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

  // Charger les données du produit en mode édition
  useEffect(() => {
    if (mode === 'edit' && productData) {
      const calculatedMarge = calculateMarge(productData.prixAchat, productData.prixVente);
      
      setFormData(prev => ({
        ...prev,
        ...productData,
        marge: calculatedMarge,
        prixDetail: productData.prixDetail || 0,
        uniteDetail: productData.uniteDetail || 'kg',
        tauxTVA: productData.tauxTVA || 20,
        estPerequitable: productData.estPerequitable || false,
        estFragile: productData.estFragile || false,
        instructionsSpeciales: productData.instructionsSpeciales || '',
        dateCreation: productData.dateCreation || new Date().toISOString().split('T')[0],
        derniereModification: new Date().toISOString()
      }));
      
      // Marquer toutes les étapes comme valides en mode édition
      setStepValidations({
        1: true, 2: true, 3: true, 4: true, 5: true, 6: true
      });
      
      if (productData.image) {
        setPreviewImage(productData.image);
      }
    } else {
      // Mode création : générer une référence automatique
      const timestamp = Date.now().toString().slice(-6);
      const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
      const reference = `PROD-${timestamp}-${randomChars}`;
      
      setFormData(prev => ({
        ...prev,
        reference,
        dateCreation: new Date().toISOString().split('T')[0],
        derniereModification: new Date().toISOString()
      }));
    }
  }, [mode, productData, calculateMarge]);

  // Valider l'étape actuelle à chaque changement de données
  useEffect(() => {
    validateStep(currentStep);
  }, [formData, currentStep, validateStep]);

  // Gestion des changements de formulaire
  const handleChange = useCallback((name, value) => {
    setFormData(prev => {
      let updated = { ...prev, [name]: value };
      
      // Mettre à jour la date de modification
      updated.derniereModification = new Date().toISOString();
      
      // Calcul automatique de la marge pour les prix
      if (autoCalculate && (name === 'prixAchat' || name === 'prixVente')) {
        updated.marge = calculateMarge(
          name === 'prixAchat' ? value : updated.prixAchat,
          name === 'prixVente' ? value : updated.prixVente
        );
      }
      
      return updated;
    });
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  }, [autoCalculate, calculateMarge]);

  // Gestion spécifique pour InputSelect
  const handleSelectChange = useCallback((name, value) => {
    handleChange(name, value);
  }, [handleChange]);

  // Gestion du fichier image
  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors(prev => ({
          ...prev,
          image: 'La taille du fichier ne doit pas dépasser 5MB'
        }));
        return;
      }
      
      if (!file.type.match('image/(jpeg|jpg|png|gif|webp)')) {
        setValidationErrors(prev => ({
          ...prev,
          image: 'Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP'
        }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        handleChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [handleChange]);

  // Supprimer l'image
  const handleRemoveImage = useCallback(() => {
    setPreviewImage(null);
    handleChange('image', null);
  }, [handleChange]);

  // Navigation entre les étapes
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      alert('Veuillez corriger les erreurs avant de passer à l\'étape suivante.');
    }
  }, [currentStep, validateStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step <= currentStep) {
      if (validateStep(currentStep)) {
        setCurrentStep(step);
      } else {
        alert('Veuillez corriger les erreurs avant de changer d\'étape.');
      }
    }
  }, [currentStep, validateStep]);

  // Générer une référence automatique
  const generateReference = useCallback(() => {
    const timestamp = Date.now().toString().slice(-6);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const reference = `PROD-${timestamp}-${randomChars}`;
    handleChange('reference', reference);
  }, [handleChange]);

  // Ajuster le stock
  const adjustStock = useCallback((amount) => {
    const currentStock = parseFloat(formData.stock) || 0;
    const newStock = Math.max(0, currentStock + amount);
    handleChange('stock', newStock);
  }, [formData.stock, handleChange]);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Préparer les données finales
      const finalData = {
        ...formData,
        marge: calculateMarge(formData.prixAchat, formData.prixVente),
        derniereModification: new Date().toISOString()
      };
      
      if (mode === 'edit' && productData) {
        finalData.id = productData.id;
      }
      
      onSave(finalData);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      if (mode === 'edit' && productData) {
        // Recharger les données originales
        const calculatedMarge = calculateMarge(productData.prixAchat, productData.prixVente);
        setFormData({
          ...productData,
          marge: calculatedMarge,
          derniereModification: new Date().toISOString()
        });
        setPreviewImage(productData.image || null);
      } else {
        // Réinitialiser pour création
        const timestamp = Date.now().toString().slice(-6);
        const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
        const reference = `PROD-${timestamp}-${randomChars}`;
        
        setFormData({
          nom: '',
          reference: reference,
          categorie: '',
          description: '',
          image: null,
          stock: 0,
          seuilMin: 10,
          seuilAlerte: 20,
          unite: 'unité',
          emplacement: '',
          prixAchat: 0,
          prixVente: 0,
          marge: 0,
          fournisseur: '',
          delaiLivraison: '',
          peutEtreVenduEnDetail: false,
          prixDetail: 0,
          uniteDetail: 'kg',
          tvaApplicable: true,
          tauxTVA: 20,
          estPerequitable: false,
          estFragile: false,
          instructionsSpeciales: '',
          dateCreation: new Date().toISOString().split('T')[0],
          creerPar: 'Admin',
          derniereModification: new Date().toISOString(),
        });
        setPreviewImage(null);
      }
      setHasUnsavedChanges(false);
      setValidationErrors({});
      setCurrentStep(1);
      setStepValidations({
        1: false, 2: false, 3: false, 4: true, 5: true, 6: true
      });
    }
  }, [mode, productData, calculateMarge]);

  // Rendu conditionnel par étape (identique à votre code existant)
  const renderStepContent = () => {
    // ... (votre code existant pour renderStepContent)
    // Je garde le même contenu que votre original
    switch(currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <FaBox /> Informations de Base
              </h3>
              <p className={styles.stepDescription}>
                Saisissez les informations principales du produit
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <Input
                  type="text"
                  label="Nom du Produit"
                  value={formData.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  name="nom"
                  placeholder="Ex: Ciment Portland 50kg"
                  icon={<FaBox />}
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
                <div className={styles.inputWithButton}>
                  <Input
                    type="text"
                    label="Référence"
                    value={formData.reference}
                    onChange={(e) => handleChange('reference', e.target.value)}
                    name="reference"
                    placeholder="Ex: CIM-50KG-PORT"
                    icon={<FaBarcode />}
                    error={validationErrors.reference}
                    maxLength={20}
                    className={styles.formInput}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={generateReference}
                    className={styles.generateBtn}
                    aria-label="Générer une référence automatique"
                  >
                    Générer
                  </Button>
                </div>
                <div className={styles.inputHint}>
                  <IoInformationCircleOutline />
                  <span>Laisser vide pour générer automatiquement</span>
                </div>
              </div>              
            </div>

            <div className={styles.formGroupFull}>
              <InputSelect
                label="Catégorie"
                value={formData.categorie}
                onChange={(value) => handleSelectChange('categorie', value)}
                options={[
                  { value: '', label: 'Sélectionner une catégorie', disabled: true },
                  ...categories
                ]}
                placeholder="Choisir une catégorie"
                icon={<TbCategory />}
                required
                aria-required="true"
              />
            </div>
            
            <div className={styles.formGroupFull}>
              <InputTextarea
                type="textarea"
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                name="description"
                placeholder="Décrivez le produit, ses caractéristiques, ses utilisations..."
                icon={<MdOutlineDescription />}
                rows={3}
                maxLength={500}
                className={styles.formTextarea}
              />
              <div className={styles.charCount}>
                {formData.description.length}/500 caractères
              </div>
            </div>
            
            <div className={styles.formGroupFull}>
              <div className={styles.imageUploadSection}>
                <label className={styles.formLabel}>
                  <IoImageOutline />
                </label>
                <div className={styles.imageUploadContainer}>
                  {previewImage ? (
                    <div className={styles.imagePreview}>
                      <img 
                        src={previewImage} 
                        alt="Aperçu du produit" 
                        className={styles.previewImage}
                      />
                      <Button
                        variant="danger"
                        size="small"
                        onClick={handleRemoveImage}
                        className={styles.removeImageBtn}
                        aria-label="Supprimer l'image"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ) : (
                    <div className={styles.uploadArea}>
                      <IoCloudUploadOutline className={styles.uploadIcon} />
                      <p className={styles.uploadText}>Glissez-déposez une image ou</p>
                      <InputFile
                        onChange={handleImageUpload}
                        label="Avec prévisualisation d'image"
                        variant="primary"
                        accept=".jpg,.jpeg,.png"
                        buttonText="Upload Image"
                        helperText="Prévisualisation des images"
                        showFilePreview
                        previewType="image"
                      />
                    </div>
                  )}
                </div>
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
                <MdInventory /> Stock & Unité
              </h3>
              <p className={styles.stepDescription}>
                Configurez la gestion du stock et les unités de mesure
              </p>
            </div>
            
            <div className={styles.formGrid1}>
              <div className={styles.formGroup}>
                <div className={styles.numberInputWithControls}>
                  <div className={styles.numberControls}>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => adjustStock(-1)}
                      className={styles.numberBtn}
                      aria-label="Diminuer le stock de 1"
                    >
                      -
                    </Button>
                  </div>
                  <Input
                    type="number"
                    label="Stock Initial"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', parseFloat(e.target.value) || 0)}
                    name="stock"
                    min="0"
                    step="1"
                    icon={<MdOutlineStorage />}
                    required
                    error={validationErrors.stock}
                    className={styles.formInput}
                    aria-required="true"
                  />
                  <div className={styles.numberControls}>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => adjustStock(1)}
                      className={styles.numberBtn}
                      aria-label="Augmenter le stock de 1"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Unité"
                  value={formData.unite}
                  onChange={(value) => handleSelectChange('unite', value)}
                  options={unites}
                  placeholder="Choisir une unité"
                  icon={<GiWeight />}
                  required
                  error={validationErrors.unite}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Seuil Minimum"
                  value={formData.seuilMin}
                  onChange={(e) => handleChange('seuilMin', parseFloat(e.target.value) || 0)}
                  name="seuilMin"
                  min="1"
                  step="1"
                  icon={<IoWarningOutline />}
                  required
                  error={validationErrors.seuilMin}
                  className={styles.formInput}
                  aria-required="true"
                />
                <div className={styles.inputHint}>
                  <span>Commande automatique déclenchée en dessous de ce seuil</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Seuil d'Alerte"
                  value={formData.seuilAlerte}
                  onChange={(e) => handleChange('seuilAlerte', parseFloat(e.target.value) || 0)}
                  name="seuilAlerte"
                  min={formData.seuilMin || 1}
                  step="1"
                  icon={<IoWarningOutline />}
                  error={validationErrors.seuilAlerte}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.formGroupFull}>
                <Input
                  type="text"
                  label="Emplacement"
                  value={formData.emplacement}
                  onChange={(e) => handleChange('emplacement', e.target.value)}
                  name="emplacement"
                  placeholder="Ex: Entrepôt A, Zone 1, Rack 3, Étagère 2"
                  icon={<MdOutlineLocationOn />}
                  className={styles.formInput}
                />
              </div>
              
              <div className={styles.stockStats}>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Niveau actuel</div>
                  <div className={`${styles.statValue} ${
                    formData.stock <= (formData.seuilMin || 10) ? styles.critical : 
                    formData.stock <= (formData.seuilAlerte || 20) ? styles.warning : styles.good
                  }`}>
                    {formData.stock} {formData.unite}
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statLabel}>Statut</div>
                  <div className={`${styles.statBadge} ${
                    formData.stock <= (formData.seuilMin || 10) ? styles.critical : 
                    formData.stock <= (formData.seuilAlerte || 20) ? styles.warning : styles.good
                  }`} aria-live="polite">
                    {formData.stock <= (formData.seuilMin || 10) ? 'CRITIQUE' : 
                     formData.stock <= (formData.seuilAlerte || 20) ? 'ALERTE' : 'NORMAL'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aide de validation */}
            {!stepValidations[2] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez corriger les erreurs avant de continuer</span>
              </div>
            )}
          </div>
        );
        
      case 3:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <TbCurrencyDollar /> Prix & Fournisseur
              </h3>
              <p className={styles.stepDescription}>
                Définissez les prix et les informations fournisseur
              </p>
            </div>
            
            <div className={styles.formGrid2}>
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Prix d'Achat"
                  value={formData.prixAchat}
                  onChange={(e) => handleChange('prixAchat', parseFloat(e.target.value) || 0)}
                  name="prixAchat"
                  min="0"
                  step="100"
                  icon={<GiPayMoney />}
                  required
                  error={validationErrors.prixAchat}
                  className={styles.formInput}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <Input
                  type="number"
                  label="Prix de Vente"
                  value={formData.prixVente}
                  onChange={(e) => handleChange('prixVente', parseFloat(e.target.value) || 0)}
                  name="prixVente"
                  min={formData.prixAchat || 0}
                  step="100"
                  icon={<MdAttachMoney />}
                  required
                  error={validationErrors.prixVente}
                  className={styles.formInput}
                  aria-required="true"
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Fournisseur"
                  value={formData.fournisseur}
                  onChange={(value) => handleSelectChange('fournisseur', value)}
                  options={[
                    { value: '', label: 'Sélectionner un fournisseur', disabled: true },
                    ...fournisseurs
                  ]}
                  placeholder="Choisir un fournisseur"
                  icon={<FaTruck />}
                />
              </div>
              
              <div className={styles.formGroup}>
                <InputSelect
                  label="Délai de Livraison"
                  value={formData.delaiLivraison}
                  onChange={(value) => handleSelectChange('delaiLivraison', value)}
                  options={delaisLivraison}
                  placeholder="Délai de livraison"
                  icon={<MdOutlineLocalShipping />}
                />
              </div>

              <div className={styles.priceSummary}>
                <div className={styles.margeDisplay}>
                  <label className={styles.formLabel}>
                    <TbPercentage /> Marge
                  </label>
                  <div className={`${styles.margeValue} ${
                    parseFloat(formData.marge) > 0 ? styles.positive : styles.negative
                  }`} aria-live="polite">
                    {formData.marge}%
                  </div>
                  <div className={styles.margeControls}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={autoCalculate}
                        onChange={() => setAutoCalculate(!autoCalculate)}
                        aria-label="Activer le calcul automatique de la marge"
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>Calcul auto</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.priceSummary}>
                <h4 className={styles.summaryTitle}>Récapitulatif des Prix</h4>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Prix HT:</span>
                    <span className={styles.summaryValue}>{formatCurrency(formData.prixVente)}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>TVA ({formData.tauxTVA}%):</span>
                    <span className={styles.summaryValue}>
                      {formatCurrency(formData.prixVente * (parseFloat(formData.tauxTVA) / 100))}
                    </span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Prix TTC:</span>
                    <span className={styles.summaryValueHighlight}>
                      {formatCurrency(calculatePrixTTC(formData.prixVente, formData.tvaApplicable, formData.tauxTVA))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aide de validation */}
            {!stepValidations[3] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Les prix doivent être positifs et le prix de vente supérieur au prix d'achat</span>
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <IoDuplicateOutline /> Vente au Détail
              </h3>
              <p className={styles.stepDescription}>
                Configurez les options de vente au détail (optionnel)
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroupFull}>
                <div className={styles.retailToggle}>
                  <label className={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      name="peutEtreVenduEnDetail"
                      checked={formData.peutEtreVenduEnDetail}
                      onChange={(e) => handleChange('peutEtreVenduEnDetail', e.target.checked)}
                      className={styles.toggleInput}
                      aria-label="Peut être vendu au détail"
                    />
                    <span className={styles.toggleSlider}></span>
                    <span className={styles.toggleText}>
                      <IoDuplicateOutline /> Peut être vendu au détail
                    </span>
                  </label>
                  <div className={styles.toggleHint}>
                    Activez cette option si le produit peut être vendu en petites quantités
                  </div>
                </div>
              </div>
              
              {formData.peutEtreVenduEnDetail && (
                <>
                  <div className={styles.formGroup}>
                    <Input
                      type="number"
                      label="Prix au Détail *"
                      value={formData.prixDetail}
                      onChange={(e) => handleChange('prixDetail', parseFloat(e.target.value) || 0)}
                      name="prixDetail"
                      min="0"
                      step="10"
                      icon={<MdAttachMoney />}
                      required={formData.peutEtreVenduEnDetail}
                      error={validationErrors.prixDetail}
                      className={styles.formInput}
                    />
                    <div className={styles.inputHint}>
                      <IoCalculatorOutline />
                      <span>Prix pour 1 {formData.uniteDetail}</span>
                    </div>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <InputSelect
                      label="Unité Détail *"
                      value={formData.uniteDetail}
                      onChange={(value) => handleSelectChange('uniteDetail', value)}
                      options={[
                        { value: '', label: 'Sélectionner une unité', disabled: true },
                        { value: 'kg', label: 'Kilogramme (kg)' },
                        { value: 'g', label: 'Gramme (g)' },
                        { value: 'L', label: 'Litre (L)' },
                        { value: 'mL', label: 'Millilitre (mL)' },
                        { value: 'm', label: 'Mètre (m)' },
                        { value: 'cm', label: 'Centimètre (cm)' },
                        { value: 'pièce', label: 'Pièce' }
                      ]}
                      placeholder="Choisir une unité détail"
                      icon={<GiWeight />}
                      required={formData.peutEtreVenduEnDetail}
                      error={validationErrors.uniteDetail}
                    />
                  </div>
                  
                  <div className={styles.formGroupFull}>
                    <div className={styles.retailExample}>
                      <div className={styles.exampleHeader}>
                        <IoInformationCircleOutline />
                        <span>Exemple de conversion:</span>
                      </div>
                      <div className={styles.exampleContent}>
                        <div className={styles.exampleItem}>
                          <span>1 {formData.unite} =</span>
                          <span className={styles.exampleValue}>{formatCurrency(formData.prixVente)}</span>
                        </div>
                        <div className={styles.exampleItem}>
                          <span>1 {formData.uniteDetail} =</span>
                          <span className={styles.exampleValue}>{formatCurrency(formData.prixDetail)}</span>
                        </div>
                        <div className={styles.exampleItem}>
                          <span>Ratio:</span>
                          <span className={styles.exampleValue}>
                            1 {formData.unite} = {formData.prixDetail > 0 ? (formData.prixVente / formData.prixDetail).toFixed(2) : '0'} {formData.uniteDetail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Aide de validation */}
            {formData.peutEtreVenduEnDetail && !stepValidations[4] && (
              <div className={styles.validationHelp} role="alert">
                <IoWarningOutline />
                <span>Veuillez remplir les informations de vente au détail</span>
              </div>
            )}
          </div>
        );
        
      case 5:
        return (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <h3 className={styles.stepTitle}>
                <CiSettings /> Options Avancées
              </h3>
              <p className={styles.stepDescription}>
                Paramètres supplémentaires et métadonnées
              </p>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <div className={styles.switchGroup}>
                  <label className={styles.formLabel}>
                    <CiMoneyBill /> TVA Applicable
                  </label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="tvaApplicable"
                        checked={formData.tvaApplicable}
                        onChange={(e) => handleChange('tvaApplicable', e.target.checked)}
                        aria-label="TVA applicable"
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>
                      {formData.tvaApplicable ? 'TVA applicable' : 'Hors taxe'}
                    </span>
                  </div>
                </div>
              </div>
              
              {formData.tvaApplicable && (
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Taux de TVA (%)"
                    value={formData.tauxTVA.toString()}
                    onChange={(value) => handleSelectChange('tauxTVA', parseFloat(value))}
                    options={tauxTVAOptions}
                    placeholder="Sélectionner un taux"
                    icon={<TbPercentage />}
                  />
                </div>
              )}
              
              <div className={styles.formGroup}>
                <div className={styles.switchGroup}>
                  <label className={styles.formLabel}>
                    <IoLockClosedOutline /> Produit Péréquitable
                  </label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="estPerequitable"
                        checked={formData.estPerequitable}
                        onChange={(e) => handleChange('estPerequitable', e.target.checked)}
                        aria-label="Produit péréquitable"
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>
                      {formData.estPerequitable ? 'Oui' : 'Non'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <div className={styles.switchGroup}>
                  <label className={styles.formLabel}>
                    <IoWarningOutline /> Produit Fragile
                  </label>
                  <div className={styles.switchContainer}>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="estFragile"
                        checked={formData.estFragile}
                        onChange={(e) => handleChange('estFragile', e.target.checked)}
                        aria-label="Produit fragile"
                      />
                      <span className={styles.slider}></span>
                    </label>
                    <span className={styles.switchLabel}>
                      {formData.estFragile ? 'Fragile' : 'Normal'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.formGroupFull}>
                <InputTextarea
                  label="Instructions Spéciales"
                  value={formData.instructionsSpeciales}
                  onChange={(e) => handleChange('instructionsSpeciales', e.target.value)}
                  name="instructionsSpeciales"
                  placeholder="Instructions de manutention, stockage, sécurité..."
                  icon={<FaClipboardList />}
                  rows={2}
                  maxLength={250}
                  className={styles.formTextarea}
                />
                <div className={styles.charCount}>
                  {formData.instructionsSpeciales.length}/250 caractères
                </div>
              </div>
            </div>
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
                    <FaBox /> Informations de Base
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Nom:</span>
                      <span className={styles.summaryValue}>{formData.nom || 'Non renseigné'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Référence:</span>
                      <span className={styles.summaryValue}>{formData.reference || 'Auto-générée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Catégorie:</span>
                      <span className={styles.summaryValue}>{formData.categorie || 'Non renseignée'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Description:</span>
                      <span className={styles.summaryValue}>
                        {formData.description || 'Aucune description'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <MdInventory /> Stock & Unité
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Stock initial:</span>
                      <span className={styles.summaryValue}>
                        {formData.stock} {formData.unite}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Seuils:</span>
                      <span className={styles.summaryValue}>
                        Min: {formData.seuilMin} | Alerte: {formData.seuilAlerte}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Emplacement:</span>
                      <span className={styles.summaryValue}>
                        {formData.emplacement || 'Non spécifié'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Statut stock:</span>
                      <span className={`${styles.summaryValue} ${
                        formData.stock <= formData.seuilMin ? styles.critical : 
                        formData.stock <= formData.seuilAlerte ? styles.warning : styles.good
                      }`}>
                        {formData.stock <= formData.seuilMin ? 'CRITIQUE' : 
                         formData.stock <= formData.seuilAlerte ? 'ALERTE' : 'NORMAL'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <TbCurrencyDollar /> Prix & Fournisseur
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Prix d'achat:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.prixAchat)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Prix de vente:</span>
                      <span className={styles.summaryValue}>{formatCurrency(formData.prixVente)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Marge:</span>
                      <span className={`${styles.summaryValue} ${
                        parseFloat(formData.marge) > 0 ? styles.positive : styles.negative
                      }`}>
                        {formData.marge}%
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Fournisseur:</span>
                      <span className={styles.summaryValue}>{formData.fournisseur || 'Non spécifié'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Délai livraison:</span>
                      <span className={styles.summaryValue}>{formData.delaiLivraison || 'Non spécifié'}</span>
                    </div>
                  </div>
                </div>
                
                {formData.peutEtreVenduEnDetail && (
                  <div className={styles.summarySection}>
                    <h4 className={styles.summarySectionTitle}>
                      <IoDuplicateOutline /> Vente au Détail
                    </h4>
                    <div className={styles.summaryGrid}>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Prix détail:</span>
                        <span className={styles.summaryValue}>
                          {formatCurrency(formData.prixDetail)} / {formData.uniteDetail}
                        </span>
                      </div>
                      <div className={styles.summaryItem}>
                        <span className={styles.summaryLabel}>Conversion:</span>
                        <span className={styles.summaryValue}>
                          1 {formData.unite} = {formData.prixDetail > 0 ? (formData.prixVente / formData.prixDetail).toFixed(2) : '0'} {formData.uniteDetail}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={styles.summarySection}>
                  <h4 className={styles.summarySectionTitle}>
                    <CiSettings /> Options Avancées
                  </h4>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>TVA:</span>
                      <span className={styles.summaryValue}>
                        {formData.tvaApplicable ? `${formData.tauxTVA}%` : 'Non applicable'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Prix TTC:</span>
                      <span className={styles.summaryValueHighlight}>
                        {formatCurrency(calculatePrixTTC(formData.prixVente, formData.tvaApplicable, formData.tauxTVA))}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Statuts:</span>
                      <span className={styles.summaryValue}>
                        {formData.estPerequitable ? 'Péréquitable' : 'Standard'} • 
                        {formData.estFragile ? ' Fragile' : ' Normal'}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Instructions:</span>
                      <span className={styles.summaryValue}>
                        {formData.instructionsSpeciales || 'Aucune instruction spéciale'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.summaryActions}>
                <Button
                  variant={showPreview ? "secondary" : "outline"}
                  size="medium"
                  icon={showPreview ? "eyeOff" : "eye"}
                  onClick={() => setShowPreview(!showPreview)}
                  className={styles.previewBtn}
                  aria-label={showPreview ? 'Masquer aperçu' : 'Afficher aperçu'}
                >
                  {showPreview ? 'Masquer aperçu' : 'Aperçu produit'}
                </Button>
                
                <div className={styles.summaryStats}>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Valeur stock</div>
                    <div className={styles.statValue}>
                      {formatCurrency(formData.stock * formData.prixVente)}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Marge unitaire</div>
                    <div className={`${styles.statValue} ${parseFloat(formData.marge) > 0 ? styles.positive : styles.negative}`}>
                      {formatCurrency(formData.prixVente - formData.prixAchat)}
                    </div>
                  </div>
                  <div className={styles.statCard}>
                    <div className={styles.statLabel}>Statut</div>
                    <div className={`${styles.statValue} ${mode === 'edit' ? styles.edit : styles.new}`}>
                      {mode === 'edit' ? 'MODIFICATION' : 'NOUVEAU'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Vérification finale */}
            <div className={styles.finalValidation} role="status">
              <FaCheckCircle />
              <span>Toutes les étapes sont validées. Vous pouvez sauvegarder le produit.</span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlayFull}>
      <div className={styles.modalContainerFull}>
        {/* Header du modal - Style InvoiceModal */}
        <div className={styles.modalHeaderFull}>
          <div className={styles.modalHeaderContentFull}>
            <div className={styles.headerTitleFull}>
              {mode === 'edit' ? <IoPencilOutline className={styles.headerIconFull} /> : <FaBox className={styles.headerIconFull} />}
              <div>
                <h1 className={styles.modalTitleFull}>
                  {mode === 'edit' ? 'Modifier le Produit' : 'Nouveau Produit'}
                </h1>
                <p className={styles.modalSubtitleFull}>
                  {mode === 'edit' 
                    ? 'Modifiez les informations du produit' 
                    : 'Créez un nouveau produit pour votre inventaire'}
                </p>
              </div>
            </div>
            
            <div className={styles.headerActionsFull}>
              {/* Badges d'état */}
              {hasUnsavedChanges && (
                <div className={styles.unsavedBadgeFull}>
                  <IoWarningOutline />
                  <span>Non sauvegardé</span>
                </div>
              )}
              {mode === 'edit' && (
                <div className={styles.editBadgeFull}>
                  <IoPencilOutline />
                  <span>Mode édition</span>
                </div>
              )}
              <div className={`${styles.stepBadgeFull} ${stepValidations[currentStep] ? styles.valid : styles.invalid}`}>
                {stepValidations[currentStep] ? '✓ Étape validée' : '✗ Étape non validée'}
              </div>
              <Button 
                variant="ghost"
                size="medium"
                icon="close"
                onClick={onClose}
                className={styles.closeBtnFull}
                aria-label="Fermer"
              />
            </div>
          </div>
        </div>

        {/* Indicateur d'étapes - Adapté au style plein écran */}
        <div className={styles.stepIndicatorFull}>
          <StepIndicator
            currentStep={currentStep}
            totalSteps={steps.length}
            steps={steps}
            onStepClick={goToStep}
            stepValidations={stepValidations}
          />
        </div>

        {/* Corps du modal avec scroll */}
        <div className={styles.modalBodyFull}>
          <form onSubmit={handleSubmit} className={styles.mainFormFull} noValidate>
            {renderStepContent()}
          </form>
        </div>

        {/* Footer du modal avec actions - Style InvoiceModal */}
        <div className={styles.modalFooterFull}>
          <div className={styles.footerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Étape:</span>
              <span className={styles.statValue}>{currentStep}/{steps.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Progression:</span>
              <span className={styles.statValue}>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Button
              variant="outline"
              size="large"
              icon="close"
              onClick={onClose}
              className={styles.cancelBtnFull}
            >
              Annuler
            </Button>
            <Button
              variant="outline"
              size="large"
              icon="refresh"
              onClick={handleReset}
              className={styles.resetBtnFull}
            >
              Réinitialiser
            </Button>
            {currentStep > 1 && (
              <Button
                variant="secondary"
                size="large"
                icon="back"
                onClick={prevStep}
                className={styles.prevBtnFull}
              >
                Précédent
              </Button>
            )}
            
            {currentStep < steps.length ? (
              <Button
                variant="primary"
                size="large"
                icon="suivant"
                iconPosition="right"
                onClick={nextStep}
                disabled={!stepValidations[currentStep]}
                className={styles.nextBtnFull}
              >
                Suivant
              </Button>
            ) : (
              <Button
                variant="success"
                size="large"
                icon="check"
                iconPosition="right"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`${styles.confirmBtnFull} ${isSubmitting ? styles.loading : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  mode === 'edit' ? 'Mettre à jour' : 'Créer le produit'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Barre de progression */}
        <div className={styles.modalProgressFull}>
          <div className={styles.progressBarFull}>
            <div 
              className={styles.progressFillFull}
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrmProduits;