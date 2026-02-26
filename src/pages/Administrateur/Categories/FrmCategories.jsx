import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './FrmCategories.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Import de vos composants personnalisés
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputSelect from '../../../components/Input/InputSelect';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import Button from '../../../components/Button/Button';

// Import des icônes
import { 
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoWarningOutline,
  IoAddOutline,
  IoTrashOutline,
  IoDuplicateOutline,
  IoCalculatorOutline,
  IoImageOutline,
  IoAttachOutline,
  IoCloudUploadOutline,
  IoEyeOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoHelpCircleOutline,
  IoArrowForwardOutline,
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
  IoReloadOutline,
  IoPencilOutline,
  IoEyeOffOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoCloudDoneOutline,
  IoColorPaletteOutline,
  IoFolderOutline,
  IoGridOutline,
  IoArrowUpOutline,
  IoStatsChartOutline,
  IoSearchOutline,
  IoCalendarOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaWarehouse,
  FaBarcode,
  FaClipboardList,
  FaWeightHanging,
  FaRegSave,
  FaTimes,
  FaUndo,
  FaHistory,
  FaTags,
  FaChartLine,
  FaProductHunt,
  FaStore,
  FaTools
} from "react-icons/fa";
import { 
  TbCategory, 
  TbCategoryPlus,
  TbCategoryMinus,
  TbCurrencyDollar,
  TbPercentage
} from "react-icons/tb";
import { 
  MdCategory, 
  MdOutlineInventory, 
  MdOutlineLocalOffer,
  MdOutlineViewCarousel,
  MdOutlineSettings,
  MdAttachMoney,
  MdOutlineDescription,
  MdOutlineLocalShipping,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdOutlineSecurity
} from "react-icons/md";
import { GiWeight, GiPayMoney } from "react-icons/gi";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
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
const mockCategories = [
  {
    id: 1,
    name: 'Matériaux Construction',
    code: 'MAT-CONST',
    description: 'Matériaux de construction générale pour tous types de travaux. Inclut ciment, briques, sable, gravier et produits dérivés.',
    parentId: null,
    status: 'active',
    color: 'primary',
    icon: 'FaBox',
    canBeSold: true,
    requiresSpecialHandling: false,
    hasWarranty: false,
    warrantyPeriod: 0,
    tags: ['construction', 'bâtiment', 'gros œuvre', 'matériaux'],
    profitMargin: 25,
    minStockAlert: 50,
    maxStockAlert: 500,
    createdAt: '2024-01-15',
    updatedAt: '2024-03-20',
    createdBy: 'Admin',
    lastModifiedBy: 'Manager'
  },
  {
    id: 2,
    name: 'Ferronnerie',
    code: 'FERRO',
    description: 'Produits métalliques pour construction et fabrication. Fer à béton, tôles, profilés et accessoires métalliques.',
    parentId: null,
    status: 'active',
    color: 'warning',
    icon: 'FaTools',
    canBeSold: true,
    requiresSpecialHandling: true,
    hasWarranty: true,
    warrantyPeriod: 12,
    tags: ['métal', 'construction', 'acier', 'ferronnerie'],
    profitMargin: 30,
    minStockAlert: 20,
    maxStockAlert: 200,
    createdAt: '2024-02-10',
    updatedAt: '2024-03-18',
    createdBy: 'Admin',
    lastModifiedBy: 'Admin'
  },
  {
    id: 3,
    name: 'Quincaillerie',
    code: 'QUINC',
    description: 'Petite quincaillerie et accessoires de fixation. Vis, clous, écrous, boulons et produits similaires.',
    parentId: null,
    status: 'active',
    color: 'accent',
    icon: 'MdOutlineLocalOffer',
    canBeSold: true,
    requiresSpecialHandling: false,
    hasWarranty: false,
    warrantyPeriod: 0,
    tags: ['quincaillerie', 'fixation', 'accessoires', 'petite quincaillerie'],
    profitMargin: 40,
    minStockAlert: 100,
    maxStockAlert: 1000,
    createdAt: '2024-01-05',
    updatedAt: '2024-03-15',
    createdBy: 'Manager',
    lastModifiedBy: 'Admin'
  }
];

const parentCategories = [
  { id: null, name: 'Aucune (catégorie racine)' },
  { id: 1, name: 'Matériaux Construction' },
  { id: 2, name: 'Ferronnerie' },
  { id: 3, name: 'Quincaillerie' },
  { id: 4, name: 'Peinture' },
  { id: 5, name: 'Plomberie' }
];

const iconOptions = [
  { value: 'FaBox', label: 'Boîte', icon: <FaBox /> },
  { value: 'FaTools', label: 'Outils', icon: <FaTools /> },
  { value: 'MdOutlineLocalOffer', label: 'Promotion', icon: <MdOutlineLocalOffer /> },
  { value: 'FaWeightHanging', label: 'Poids', icon: <FaWeightHanging /> },
  { value: 'FaChartLine', label: 'Statistiques', icon: <FaChartLine /> },
  { value: 'FaStore', label: 'Magasin', icon: <FaStore /> },
  { value: 'FaProductHunt', label: 'Produit', icon: <FaProductHunt /> },
  { value: 'IoColorPaletteOutline', label: 'Couleur', icon: <IoColorPaletteOutline /> },
  { value: 'IoGridOutline', label: 'Grille', icon: <IoGridOutline /> },
  { value: 'IoStatsChartOutline', label: 'Graphique', icon: <IoStatsChartOutline /> }
];

const colorOptions = [
  { value: 'primary', label: 'Bleu', color: '#3b82f6' },
  { value: 'success', label: 'Vert', color: '#10b981' },
  { value: 'warning', label: 'Orange', color: '#f59e0b' },
  { value: 'danger', label: 'Rouge', color: '#ef4444' },
  { value: 'accent', label: 'Violet', color: '#8b5cf6' },
  { value: 'info', label: 'Cyan', color: '#06b6d4' },
  { value: 'gray', label: 'Gris', color: '#6b7280' },
  { value: 'yellow', label: 'Jaune', color: '#eab308' },
  { value: 'pink', label: 'Rose', color: '#ec4899' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' }
];

// Définir les valeurs initiales du formulaire dans une constante
const initialFormData = {
  name: '',
  code: '',
  description: '',
  parentId: '',
  status: 'active',
  color: 'primary',
  icon: 'FaBox',
  canBeSold: true,
  requiresSpecialHandling: false,
  hasWarranty: false,
  warrantyPeriod: 0,
  tags: [],
  profitMargin: 25,
  minStockAlert: 50,
  maxStockAlert: 500,
  createdAt: new Date().toISOString().split('T')[0],
  createdBy: 'Admin',
  updatedAt: new Date().toISOString(),
  lastModifiedBy: 'Admin'
};

const FrmCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États pour le formulaire
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState('');

  // Gestion des changements non sauvegardés
  const handleBeforeUnload = useCallback((e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter?';
    }
  }, [hasUnsavedChanges]);

  // Charger les données de la catégorie
  useEffect(() => {
    const loadCategoryData = () => {
      if (location.state?.categoryData) {
        const category = location.state.categoryData;
        const formattedCategory = {
          ...initialFormData,
          ...category,
          parentId: category.parentId === null || category.parentId === undefined ? '' : String(category.parentId),
          updatedAt: new Date().toISOString(),
          lastModifiedBy: 'Admin'
        };
        
        setFormData(formattedCategory);
        setIsEditing(true);
      } else if (id) {
        const categoryId = parseInt(id);
        const category = mockCategories.find(c => c.id === categoryId);
        
        if (category) {
          const formattedCategory = {
            ...initialFormData,
            ...category,
            parentId: category.parentId === null || category.parentId === undefined ? '' : String(category.parentId),
            updatedAt: new Date().toISOString(),
            lastModifiedBy: 'Admin'
          };
          
          setFormData(formattedCategory);
          setIsEditing(true);
        } else {
          console.warn(`Catégorie avec ID ${id} non trouvée`);
        }
      }
      setHasUnsavedChanges(false);
    };

    loadCategoryData();
  }, [id, location.state]);

  // Gestionnaire d'événement beforeunload
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Le nom de la catégorie est requis';
    } else if (formData.name.length < 3) {
      errors.name = 'Le nom doit contenir au moins 3 caractères';
    }
    
    if (formData.code && formData.code.length < 2) {
      errors.code = 'Le code doit contenir au moins 2 caractères';
    }
    
    if (formData.profitMargin < 0 || formData.profitMargin > 100) {
      errors.profitMargin = 'La marge bénéficiaire doit être comprise entre 0 et 100%';
    }
    
    if (formData.minStockAlert < 0) {
      errors.minStockAlert = 'Le seuil minimum ne peut pas être négatif';
    }
    
    if (formData.maxStockAlert < formData.minStockAlert) {
      errors.maxStockAlert = 'Le seuil maximum doit être supérieur au seuil minimum';
    }
    
    if (formData.hasWarranty && formData.warrantyPeriod < 0) {
      errors.warrantyPeriod = 'La durée de garantie ne peut pas être négative';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : 
                    type === 'number' ? (value === '' ? '' : parseFloat(value)) : 
                    value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      setHasUnsavedChanges(true);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
    setHasUnsavedChanges(true);
  };

  const handleIconSelect = (icon) => {
    setFormData(prev => ({ ...prev, icon }));
    setHasUnsavedChanges(true);
  };

  // Générer un code automatique
  const generateCode = () => {
    const nameParts = formData.name.split(' ');
    let code = '';
    
    if (nameParts.length === 1) {
      code = nameParts[0].substring(0, 5).toUpperCase();
    } else {
      code = nameParts.map(part => part[0]).join('').toUpperCase();
    }
    
    code = code.substring(0, 6);
    setFormData(prev => ({ ...prev, code }));
    setHasUnsavedChanges(true);
    setValidationErrors(prev => ({ ...prev, code: '' }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Veuillez corriger les erreurs avant de soumettre le formulaire.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Catégorie sauvegardée:', formData);
      setHasUnsavedChanges(false);
      
      alert(isEditing ? 'Catégorie modifiée avec succès!' : 'Catégorie créée avec succès!');
      navigate('/categoriesAdmin');
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le formulaire? Toutes les modifications seront perdues.')) {
      setFormData(initialFormData);
      setNewTag('');
      setHasUnsavedChanges(false);
      setValidationErrors({});
      setIsEditing(false);
    }
  };

  // Récupérer l'icône sélectionnée
  const getSelectedIcon = () => {
    const selected = iconOptions.find(icon => icon.value === formData.icon);
    return selected ? selected.icon : <FaBox />;
  };

  // Récupérer la couleur sélectionnée
  const getSelectedColor = () => {
    const selected = colorOptions.find(color => color.value === formData.color);
    return selected ? selected.color : '#3b82f6';
  };

  // Options pour le select de statut
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Brouillon' }
  ];

  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            <Button 
              variant="outline"
              size="medium"
              icon="back"
              onClick={() => navigate('/categoriesAdmin')}
              className={styles.backBtn}
            >
              Retour aux catégories
            </Button>
            
            <div className={styles.headerText}>
              <h1 className={styles.formTitle}>
                {isEditing ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}
                <span className={styles.formSubtitle}>
                  {isEditing ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie pour organiser vos produits'}
                </span>
              </h1>
              
              <div className={styles.headerBadges}>
                {hasUnsavedChanges && (
                  <span className={styles.unsavedBadge}>
                    <IoWarningOutline /> Modifications non sauvegardées
                  </span>
                )}
                {isEditing && (
                  <span className={styles.editBadge}>
                    <IoPencilOutline /> Mode édition
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
                  label="Catégories"
                  onClick={() => navigate('/categoriesAdmin')}
                  style={{ cursor: 'pointer' }}
                />
                <StyledBreadcrumb
                  label={isEditing ? 'Modifier Catégorie' : 'Nouvelle Catégorie'}
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>

        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className={styles.mainForm}>
          <div className={styles.formGrid}>
            {/* Colonne gauche */}
            <div className={styles.formColumn}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <TbCategory /> Informations de Base
                </h3>
                
                <Input
                  label="Nom de la Catégorie *"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  error={validationErrors.name}
                  placeholder="Ex: Matériaux Construction"
                  required
                  maxLength="100"
                  fullWidth
                  helperText={`${formData.name?.length || 0}/100 caractères`}
                  icon={<TbCategory />}
                />
                
                <div className={styles.formGroup}>
                  <Input
                    label="Code Référence"
                    name="code"
                    value={formData.code || ''}
                    onChange={handleChange}
                    error={validationErrors.code}
                    placeholder="Ex: MAT-CONST"
                    maxLength="10"
                    fullWidth
                    helperText="Code unique pour identifier la catégorie"
                    icon={<FaBarcode />}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Button 
                      variant="outline"
                      size="small"
                      onClick={generateCode}
                      fullWidth
                    >
                      Générer le Code
                    </Button>
                  </div>
                </div>
                
                <InputSelect
                  label="Catégorie Parent"
                  value={formData.parentId || ''}
                  onChange={(value) => handleSelectChange('parentId', value)}
                  options={parentCategories
                    .filter(parent => !isEditing || parent.id !== formData.id)
                    .map(parent => ({
                      value: parent.id === null ? '' : String(parent.id),
                      label: parent.name
                    }))
                  }
                  placeholder="Aucune (catégorie racine)"
                  fullWidth
                  icon={<TbCategoryPlus />}
                />
                
                <InputTextarea
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  placeholder="Décrivez cette catégorie, ses produits, ses caractéristiques..."
                  rows="4"
                  maxLength="500"
                  fullWidth
                  showCharCount
                  helperText="Description détaillée de la catégorie"
                  icon={<MdOutlineDescription />}
                />
              </div>
              
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <IoColorPaletteOutline /> Apparence
                </h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Couleur de la Catégorie</label>
                  <div className={styles.colorSelector}>
                    {colorOptions.map(color => (
                      <button
                        key={color.value}
                        type="button"
                        className={`${styles.colorOption} ${formData.color === color.value ? styles.selected : ''}`}
                        style={{ backgroundColor: color.color }}
                        onClick={() => handleColorSelect(color.value)}
                        title={color.label}
                      >
                        {formData.color === color.value && (
                          <IoCheckmarkCircleOutline className={styles.colorCheck} />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className={styles.selectedColorInfo}>
                    <div 
                      className={styles.colorPreview}
                      style={{ backgroundColor: getSelectedColor() }}
                    ></div>
                    <span className={styles.colorName}>
                      {colorOptions.find(c => c.value === formData.color)?.label || 'Bleu'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Icône de la Catégorie</label>
                  <div className={styles.iconSelector}>
                    {iconOptions.map(icon => (
                      <button
                        key={icon.value}
                        type="button"
                        className={`${styles.iconOption} ${formData.icon === icon.value ? styles.selected : ''}`}
                        onClick={() => handleIconSelect(icon.value)}
                        title={icon.label}
                      >
                        <div className={`${styles.iconPreview} ${styles[formData.color]}`}>
                          {icon.icon}
                        </div>
                        <span className={styles.iconLabel}>{icon.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className={styles.selectedIconInfo}>
                    <div className={`${styles.iconPreviewLarge} ${styles[formData.color]}`}>
                      {getSelectedIcon()}
                    </div>
                    <span className={styles.iconName}>
                      {iconOptions.find(i => i.value === formData.icon)?.label || 'Boîte'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Colonne droite */}
            <div className={styles.formColumn}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <FaTags /> Tags & Configuration
                </h3>
                
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tags</label>
                  <div className={styles.tagsInput}>
                    <Input
                      type="text"
                      value={newTag || ''}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Ajouter un tag..."
                      maxLength="20"
                      fullWidth
                      className={styles.tagInput}
                      hasExternalIcon={true}
                    />
                    <Button 
                      variant="outline"
                      size="small"
                      icon="plus"
                      onClick={handleAddTag}
                      className={styles.tagAddBtn}
                    >
                    </Button>
                  </div>
                  
                  <div className={styles.tagsList}>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className={styles.tagItem}>
                        {tag}
                        <button 
                          type="button"
                          className={styles.tagRemove}
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <IoCloseCircleOutline />
                        </button>
                      </span>
                    ))}
                    {formData.tags.length === 0 && (
                      <span className={styles.noTags}>Aucun tag ajouté</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <InputSelect
                    label="Statut de la Catégorie"
                    value={formData.status}
                    onChange={(value) => handleSelectChange('status', value)}
                    options={statusOptions}
                    placeholder="Sélectionner le statut"
                    fullWidth
                    icon={<IoCheckmarkCircleOutline />}
                  />
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <MdOutlineSettings /> Paramètres Avancés
                </h3>
                
                <Input
                  type="range"
                  label={`Marge bénéficiaire par défaut (${formData.profitMargin || 25}%)`}
                  name="profitMargin"
                  value={formData.profitMargin || 25}
                  onChange={handleChange}
                  error={validationErrors.profitMargin}
                  min="0"
                  max="100"
                  step="0.5"
                  fullWidth
                  helperText="Pourcentage de marge appliqué par défaut aux produits"
                />
                
                <div className={styles.stockAlertsContainer}>
                  <div className={styles.stockAlertsGrid}>
                    <Input
                      type="number"
                      label="Seuil Minimum"
                      name="minStockAlert"
                      value={formData.minStockAlert || 50}
                      onChange={handleChange}
                      error={validationErrors.minStockAlert}
                      min="0"
                      step="1"
                      fullWidth
                      helperText="Alerte quand stock inférieur à"
                      icon={<IoWarningOutline />}
                    />
                    
                    <Input
                      type="number"
                      label="Seuil Maximum"
                      name="maxStockAlert"
                      value={formData.maxStockAlert || 500}
                      onChange={handleChange}
                      error={validationErrors.maxStockAlert}
                      min={formData.minStockAlert || 0}
                      step="1"
                      fullWidth
                      helperText="Alerte quand stock supérieur à"
                      icon={<IoWarningOutline />}
                    />
                  </div>
                </div>
                
                <div className={styles.advancedOptions}>
                  <InputCheckbox
                    label="Produits vendables"
                    name="canBeSold"
                    checked={!!formData.canBeSold}
                    onChange={handleChange}
                    color="green"
                  />
                  
                  <InputCheckbox
                    label="Manipulation spéciale requise"
                    name="requiresSpecialHandling"
                    checked={!!formData.requiresSpecialHandling}
                    onChange={handleChange}
                    color="blue"
                  />
                  
                  <InputCheckbox
                    label="Inclure garantie par défaut"
                    name="hasWarranty"
                    checked={!!formData.hasWarranty}
                    onChange={handleChange}
                    color="purple"
                  />
                  
                  {formData.hasWarranty && (
                    <div className={styles.warrantyField}>
                      <Input
                        type="number"
                        label="Durée de garantie (mois)"
                        name="warrantyPeriod"
                        value={formData.warrantyPeriod || 0}
                        onChange={handleChange}
                        error={validationErrors.warrantyPeriod}
                        min="0"
                        max="120"
                        step="1"
                        fullWidth
                        helperText="Durée de la garantie en mois"
                        icon={<IoCalendarOutline />}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <FaHistory /> Métadonnées
                </h3>
                
                <div className={styles.metadata}>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Date création:</span>
                    <span className={styles.metadataValue}>{formData.createdAt || ''}</span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataLabel}>Créé par:</span>
                    <span className={styles.metadataValue}>{formData.createdBy || ''}</span>
                  </div>
                  {isEditing && (
                    <>
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Dernière modification:</span>
                        <span className={styles.metadataValue}>
                          {new Date(formData.updatedAt).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Modifié par:</span>
                        <span className={styles.metadataValue}>{formData.lastModifiedBy || ''}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Aperçu de la catégorie */}
          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <h3 className={styles.sectionTitle}>
                <IoEyeOutline /> Aperçu de la Catégorie
              </h3>
            </div>
            
            <div className={styles.categoryPreview}>
              <div className={styles.previewContent}>
                <div className={`${styles.previewIcon} ${styles[formData.color]}`}>
                  {getSelectedIcon()}
                </div>
                <div className={styles.previewInfo}>
                  <h4 className={styles.previewName}>{formData.name || 'Nom de la catégorie'}</h4>
                  <p className={styles.previewDescription}>
                    {formData.description || 'Description de la catégorie...'}
                  </p>
                  <div className={styles.previewMeta}>
                    <span className={styles.previewCode}>{formData.code || 'CODE'}</span>
                    <span className={`${styles.previewStatus} ${styles[formData.status]}`}>
                      {formData.status === 'active' ? 'ACTIVE' : 
                       formData.status === 'inactive' ? 'INACTIVE' : 'BROUILLON'}
                    </span>
                    {formData.parentId && (
                      <span className={styles.previewParent}>
                        Parent: {parentCategories.find(p => p.id?.toString() === formData.parentId)?.name || 'Inconnu'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.previewStats}>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatLabel}>Marge par défaut</div>
                  <div className={styles.previewStatValue}>{formData.profitMargin || 25}%</div>
                </div>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatLabel}>Seuil stock</div>
                  <div className={styles.previewStatValue}>
                    {formData.minStockAlert || 50}/{formData.maxStockAlert || 500}
                  </div>
                </div>
                <div className={styles.previewStat}>
                  <div className={styles.previewStatLabel}>Options</div>
                  <div className={styles.previewFeatures}>
                    {formData.canBeSold && <span className={styles.feature} title="Vendable">💰</span>}
                    {formData.requiresSpecialHandling && <span className={styles.feature} title="Manipulation spéciale">⚠️</span>}
                    {formData.hasWarranty && <span className={styles.feature} title={`Garantie ${formData.warrantyPeriod || 0} mois`}>🛡️</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions du formulaire */}
          <div className={styles.formActions}>
            <div className={styles.actionsLeft}>
              <Button
                variant="outline"
                size="medium"
                icon="back"
                onClick={() => navigate('/categoriesAdmin')}
              >
                Annuler
              </Button>
              
              <Button
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={handleReset}
              >
                Réinitialiser
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              <Button
                type="submit"
                variant="primary"
                size="medium"
                icon="save"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isEditing ? 'Mettre à jour' : 'Créer la catégorie'}
              </Button>
            </div>
          </div>
          
          {/* Indicateur d'état */}
          <div className={styles.formStatus}>
            <div className={styles.statusInfo}>
              <div className={styles.statusItem}>
                <IoCloudDoneOutline />
                <span>Sauvegarde automatique activée</span>
              </div>
              <div className={styles.statusItem}>
                {hasUnsavedChanges ? (
                  <>
                    <IoWarningOutline />
                    <span>Modifications non sauvegardées</span>
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircleOutline />
                    <span>Formulaire sauvegardé</span>
                  </>
                )}
              </div>
            </div>
            
            <div className={styles.validationStatus}>
              {Object.keys(validationErrors).length > 0 ? (
                <div className={styles.validationError}>
                  <IoWarningOutline />
                  <span>{Object.keys(validationErrors).length} erreur(s) à corriger</span>
                </div>
              ) : (
                <div className={styles.validationSuccess}>
                  <IoCheckmarkCircleOutline />
                  <span>Formulaire validé</span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Pied de page */}
        <div className={styles.formFooter}>
          <div className={styles.footerInfo}>
            <div className={styles.infoItem}>
              <MdOutlineSecurity />
              <span>Toutes les données sont sécurisées et chiffrées</span>
            </div>
            <div className={styles.infoItem}>
              <IoCloudDoneOutline />
              <span>Les modifications sont sauvegardées automatiquement</span>
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Button 
              variant="outline"
              size="small"
              icon="arrowUp"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Haut de page
            </Button>
          </div>
        </div>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default FrmCategories;