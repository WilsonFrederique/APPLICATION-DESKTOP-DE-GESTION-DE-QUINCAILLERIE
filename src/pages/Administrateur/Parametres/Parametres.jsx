import React, { useState } from 'react';
import styles from './Parametres.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTextarea from '../../../components/Input/InputTextarea';
import Button from '../../../components/Button/Button';
import { 
  IoSettingsOutline,
  IoSaveOutline,
  IoRefreshOutline,
  IoCloseOutline,
  IoCheckmarkOutline,
  IoWarningOutline,
  IoLockClosedOutline,
  IoBusinessOutline,
  IoReceiptOutline,
  IoNotificationsOutline,
  IoColorPaletteOutline,
  IoCloudUploadOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoShieldOutline,
  IoStatsChartOutline,
  IoLanguageOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoCardOutline,
  IoKeyOutline,
  IoMailOutline,
  IoPhonePortraitOutline,
  IoGlobeOutline,
  IoFolderOpenOutline,
  IoServerOutline,
  IoHardwareChipOutline,
  IoShieldCheckmarkOutline,
  IoArchiveOutline,
  IoTrashOutline,
  IoInformationCircleOutline,
  IoChevronForwardOutline
} from "react-icons/io5";
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

// Composant de section de paramètres
const SettingsSection = ({ title, icon, children, isOpen = true, onToggle, sectionId }) => {
  return (
    <div className={styles.settingsSection}>
      <div 
        className={styles.sectionHeader}
        onClick={() => onToggle && onToggle(sectionId)}
      >
        <div className={styles.sectionHeaderContent}>
          <div className={styles.sectionIcon}>
            {icon}
          </div>
          <div className={styles.sectionTitleWrapper}>
            <h3 className={styles.sectionTitle}>{title}</h3>
            {onToggle && (
              <IoChevronForwardOutline className={`${styles.sectionToggle} ${isOpen ? styles.open : ''}`} />
            )}
          </div>
        </div>
      </div>
      
      <div className={`${styles.sectionContent} ${isOpen ? styles.open : ''}`}>
        {children}
      </div>
    </div>
  );
};

// Composant de paramètre individuel
const SettingItem = ({ 
  label, 
  description, 
  children,
  type = 'standard',
  warning = false,
  required = false
}) => {
  return (
    <div className={`${styles.settingItem} ${styles[type]}`}>
      <div className={styles.settingInfo}>
        <div className={styles.settingLabel}>
          <span className={styles.labelText}>{label}</span>
          {required && <span className={styles.requiredBadge}>*</span>}
          {warning && (
            <span className={styles.warningBadge}>
              <IoWarningOutline />
            </span>
          )}
        </div>
        {description && (
          <p className={styles.settingDescription}>{description}</p>
        )}
      </div>
      <div className={styles.settingControl}>
        {children}
      </div>
    </div>
  );
};

// Composant de badge de statut
const StatusBadge = ({ status = 'active', label }) => {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {label || (status === 'active' ? 'Actif' : 'Inactif')}
    </span>
  );
};

const Parametres = () => {
  // États pour les sections ouvertes
  const [openSections, setOpenSections] = useState({
    general: true,
    entreprise: true,
    vente: true,
    stock: true,
    securite: false,
    notifications: false,
    backup: false,
    avance: false
  });

  // États pour les paramètres
  const [settings, setSettings] = useState({
    // Général
    nomEntreprise: 'Quincaillerie Pro',
    adresse: 'Lot IVC 67 Antananarivo',
    telephone: '+261 34 00 000 00',
    email: 'contact@quincaillerie.mg',
    devise: 'MGA',
    langue: 'fr',
    fuseauHoraire: 'Indian/Antananarivo',
    
    // Vente
    tva: 20,
    remiseMax: 15,
    factureAuto: true,
    reçuAuto: true,
    limiteCredit: 1000000,
    venteDetail: true,
    
    // Stock
    seuilAlerte: 10,
    seuilCritique: 5,
    rotationAuto: true,
    categorieDefaut: 'Matériaux Construction',
    
    // Sécurité
    sessionTimeout: 30,
    tentativesConnexion: 3,
    forceMdp: true,
    backupAuto: true,
    
    // Notifications
    notifStock: true,
    notifVente: true,
    notifCredit: true,
    emailNotif: true,
    
    // Sauvegarde
    backupFrequence: 'journalier',
    retentionBackup: 30,
    cloudBackup: false,
    
    // Avancé
    maintenance: false,
    debug: false,
    logsDetailles: false
  });

  // États pour les onglets
  const [activeTab, setActiveTab] = useState('general');

  // Gestion des sections ouvertes
  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Gestion des changements de paramètres
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Sauvegarde des paramètres
  const handleSave = () => {
    console.log('Paramètres sauvegardés:', settings);
    // Ici, vous enverriez les données à votre API
    alert('Paramètres sauvegardés avec succès!');
  };

  // Réinitialisation des paramètres
  const handleReset = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres?')) {
      // Réinitialiser aux valeurs par défaut
      setSettings({
        nomEntreprise: 'Quincaillerie Pro',
        adresse: 'Lot IVC 67 Antananarivo',
        telephone: '+261 34 00 000 00',
        email: 'contact@quincaillerie.mg',
        devise: 'MGA',
        langue: 'fr',
        fuseauHoraire: 'Indian/Antananarivo',
        tva: 20,
        remiseMax: 15,
        factureAuto: true,
        reçuAuto: true,
        limiteCredit: 1000000,
        venteDetail: true,
        seuilAlerte: 10,
        seuilCritique: 5,
        rotationAuto: true,
        categorieDefaut: 'Matériaux Construction',
        sessionTimeout: 30,
        tentativesConnexion: 3,
        forceMdp: true,
        backupAuto: true,
        notifStock: true,
        notifVente: true,
        notifCredit: true,
        emailNotif: true,
        backupFrequence: 'journalier',
        retentionBackup: 30,
        cloudBackup: false,
        maintenance: false,
        debug: false,
        logsDetailles: false
      });
    }
  };

  // Export des paramètres
  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `parametres-quincaillerie-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import des paramètres
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          alert('Paramètres importés avec succès!');
        } catch {
          alert('Erreur lors de l\'import: fichier JSON invalide');
        }
      };
      reader.readAsText(file);
    }
  };

  // Données pour les onglets
  const tabs = [
    { id: 'general', label: 'Général', icon: <IoSettingsOutline /> },
    { id: 'entreprise', label: 'Entreprise', icon: <IoBusinessOutline /> },
    { id: 'vente', label: 'Vente', icon: <IoReceiptOutline /> },
    { id: 'stock', label: 'Stock', icon: <IoArchiveOutline /> },
    { id: 'securite', label: 'Sécurité', icon: <IoShieldOutline /> },
    { id: 'notifications', label: 'Notifications', icon: <IoNotificationsOutline /> },
    { id: 'backup', label: 'Sauvegarde', icon: <IoCloudUploadOutline /> },
    { id: 'avance', label: 'Avancé', icon: <IoHardwareChipOutline /> }
  ];

  // Données pour les options de sélection
  const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'mg', label: 'Malagasy' },
    { value: 'en', label: 'English' }
  ];

  const currencies = [
    { value: 'MGA', label: 'Ariary (MGA)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'USD', label: 'Dollar ($)' }
  ];

  const timezones = [
    { value: 'Indian/Antananarivo', label: 'Antananarivo (GMT+3)' },
    { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
    { value: 'UTC', label: 'UTC (GMT+0)' }
  ];

  const backupFrequencies = [
    { value: 'journalier', label: 'Journalier' },
    { value: 'hebdomadaire', label: 'Hebdomadaire' },
    { value: 'mensuel', label: 'Mensuel' }
  ];

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <div className={`${styles.header} ${styles.administrationHeader}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.dashboardTitle}>
                  Configuration <span className={styles.highlight}>Système</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Gérez tous les paramètres de votre quincaillerie
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <IoSettingsOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>8</span>
                  <span className={styles.statLabel}>Catégories</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.success}`}>
                  <IoShieldCheckmarkOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>24/7</span>
                  <span className={styles.statLabel}>Sécurité</span>
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
                label="Paramètres"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className={styles.tabsNavigation}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenu principal */}
        <div className={styles.settingsContainer}>
          {/* Barre d'actions */}
          <div className={styles.settingsActions}>
            <div className={styles.actionsLeft}>
              <Button 
                variant="primary"
                size="medium"
                icon="save"
                onClick={handleSave}
                className={styles.actionButton}
              >
                Sauvegarder
              </Button>
              <Button 
                variant="secondary"
                size="medium"
                icon="refresh"
                onClick={handleReset}
                className={styles.actionButton}
              >
                Réinitialiser
              </Button>
            </div>
            
            <div className={styles.actionsRight}>
              <div className={styles.importExport}>
                <Button 
                  variant="outline"
                  size="medium"
                  icon="upload"
                  className={styles.actionButton}
                  onClick={() => document.getElementById('import-file')?.click()}
                >
                  Importer
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className={styles.fileInput}
                  style={{ display: 'none' }}
                />
                <Button 
                  variant="outline"
                  size="medium"
                  icon="download"
                  onClick={handleExport}
                  className={styles.actionButton}
                >
                  Exporter
                </Button>
              </div>
            </div>
          </div>

          {/* Onglet Général */}
          {activeTab === 'general' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Paramètres Généraux"
                icon={<IoSettingsOutline />}
                isOpen={openSections.general}
                onToggle={toggleSection}
                sectionId="general"
              >
                <SettingItem 
                  label="Nom de l'entreprise"
                  description="Nom officiel de votre quincaillerie"
                  required={true}
                >
                  <Input
                    type="text"
                    value={settings.nomEntreprise}
                    onChange={(e) => handleSettingChange('nomEntreprise', e.target.value)}
                    placeholder="Ex: Quincaillerie Pro"
                    name="nomEntreprise"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Devise par défaut"
                  description="Devise utilisée pour toutes les transactions"
                  required={true}
                >
                  <InputSelect
                    value={settings.devise}
                    onChange={(value) => handleSettingChange('devise', value)}
                    options={currencies}
                    placeholder="Sélectionner une devise"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Langue"
                  description="Langue de l'interface utilisateur"
                >
                  <div className={styles.languageSelector}>
                    {languages.map(lang => (
                      <Button
                        key={lang.value}
                        variant={settings.langue === lang.value ? "primary" : "outline"}
                        size="small"
                        onClick={() => handleSettingChange('langue', lang.value)}
                        className={styles.langBtn}
                      >
                        {lang.label}
                      </Button>
                    ))}
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Fuseau horaire"
                  description="Fuseau horaire pour les dates et heures"
                >
                  <InputSelect
                    value={settings.fuseauHoraire}
                    onChange={(value) => handleSettingChange('fuseauHoraire', value)}
                    options={timezones}
                    placeholder="Sélectionner un fuseau horaire"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Format des dates"
                  description="Format d'affichage des dates"
                >
                  <div className={styles.radioGroup}>
                    <InputCheckbox
                      label="JJ/MM/AAAA"
                      checked={true}
                      onChange={() => {}}
                      color="blue"
                    />
                    <InputCheckbox
                      label="MM/JJ/AAAA"
                      checked={false}
                      onChange={() => {}}
                      color="blue"
                    />
                  </div>
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Préférences d'Affichage"
                icon={<IoColorPaletteOutline />}
                isOpen={openSections.general}
                sectionId="general"
              >
                <SettingItem 
                  label="Mode sombre"
                  description="Activer le mode sombre de l'interface"
                >
                  <InputCheckbox
                    checked={true}
                    onChange={() => {}}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Animation"
                  description="Activer les animations de l'interface"
                >
                  <InputCheckbox
                    checked={true}
                    onChange={() => {}}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Densité d'affichage"
                  description="Espacement entre les éléments"
                >
                  <div className={styles.radioGroup}>
                    <InputCheckbox
                      label="Compact"
                      checked={true}
                      onChange={() => {}}
                      color="blue"
                    />
                    <InputCheckbox
                      label="Confortable"
                      checked={false}
                      onChange={() => {}}
                      color="blue"
                    />
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Entreprise */}
          {activeTab === 'entreprise' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Informations Entreprise"
                icon={<IoBusinessOutline />}
                isOpen={openSections.entreprise}
                onToggle={toggleSection}
                sectionId="entreprise"
              >
                <SettingItem 
                  label="Adresse"
                  description="Adresse complète de l'entreprise"
                >
                  <InputTextarea
                    value={settings.adresse}
                    onChange={(e) => handleSettingChange('adresse', e.target.value)}
                    placeholder="Adresse complète..."
                    rows={3}
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Téléphone"
                  description="Numéro de téléphone principal"
                >
                  <Input
                    type="tel"
                    value={settings.telephone}
                    onChange={(e) => handleSettingChange('telephone', e.target.value)}
                    placeholder="+261 34 00 000 00"
                    name="telephone"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Email"
                  description="Adresse email de contact"
                >
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                    placeholder="contact@entreprise.mg"
                    name="email"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="NIF"
                  description="Numéro d'Identification Fiscale"
                >
                  <Input
                    type="text"
                    placeholder="0000000000"
                    name="nif"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Stat"
                  description="Numéro statistique"
                >
                  <Input
                    type="text"
                    placeholder="000000"
                    name="stat"
                    fullWidth
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="RCS et Réglementation"
                icon={<IoShieldOutline />}
                isOpen={openSections.entreprise}
                sectionId="entreprise"
              >
                <SettingItem 
                  label="Numéro RCS"
                  description="Registre du Commerce et des Sociétés"
                >
                  <Input
                    type="text"
                    placeholder="RCS TANA 2024 00000"
                    name="rcs"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Capital social"
                  description="Capital social de l'entreprise"
                >
                  <div className={styles.currencyInput}>
                    <Input
                      type="number"
                      placeholder="10000000"
                      name="capital"
                      fullWidth
                    />
                    <span className={styles.currencyLabel}>MGA</span>
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Vente */}
          {activeTab === 'vente' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Paramètres de Vente"
                icon={<IoReceiptOutline />}
                isOpen={openSections.vente}
                onToggle={toggleSection}
                sectionId="vente"
              >
                <SettingItem 
                  label="TVA"
                  description="Taux de TVA appliqué (%)"
                  required={true}
                >
                  <div className={styles.percentageInput}>
                    <Input
                      type="number"
                      value={settings.tva}
                      onChange={(e) => handleSettingChange('tva', parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      name="tva"
                      fullWidth
                    />
                    <span className={styles.percentageLabel}>%</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Remise maximale"
                  description="Remise maximum autorisée (%)"
                  warning={true}
                >
                  <div className={styles.percentageInput}>
                    <Input
                      type="number"
                      value={settings.remiseMax}
                      onChange={(e) => handleSettingChange('remiseMax', parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      name="remiseMax"
                      fullWidth
                    />
                    <span className={styles.percentageLabel}>%</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Limite de crédit"
                  description="Limite de crédit par client"
                >
                  <div className={styles.currencyInput}>
                    <Input
                      type="number"
                      value={settings.limiteCredit}
                      onChange={(e) => handleSettingChange('limiteCredit', parseInt(e.target.value))}
                      min="0"
                      name="limiteCredit"
                      fullWidth
                    />
                    <span className={styles.currencyLabel}>MGA</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Facturation automatique"
                  description="Générer automatiquement les factures"
                >
                  <InputCheckbox
                    checked={settings.factureAuto}
                    onChange={(e) => handleSettingChange('factureAuto', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Reçu automatique"
                  description="Générer automatiquement les reçus"
                >
                  <InputCheckbox
                    checked={settings.reçuAuto}
                    onChange={(e) => handleSettingChange('reçuAuto', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Vente au détail"
                  description="Autoriser la vente au détail (kg, m, etc.)"
                >
                  <InputCheckbox
                    checked={settings.venteDetail}
                    onChange={(e) => handleSettingChange('venteDetail', e.target.checked)}
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Configuration Facture"
                icon={<IoPrintOutline />}
                isOpen={openSections.vente}
                sectionId="vente"
              >
                <SettingItem 
                  label="En-tête facture"
                  description="Texte en haut de la facture"
                >
                  <InputTextarea
                    rows={2}
                    placeholder="Votre en-tête personnalisé..."
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Pied de page"
                  description="Texte en bas de la facture"
                >
                  <InputTextarea
                    rows={2}
                    placeholder="Votre pied de page personnalisé..."
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Conditions générales"
                  description="Conditions imprimées sur la facture"
                >
                  <InputTextarea
                    rows={3}
                    placeholder="Conditions de vente..."
                    fullWidth
                  />
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Stock */}
          {activeTab === 'stock' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Gestion de Stock"
                icon={<IoArchiveOutline />}
                isOpen={openSections.stock}
                onToggle={toggleSection}
                sectionId="stock"
              >
                <SettingItem 
                  label="Seuil d'alerte"
                  description="Niveau de stock déclenchant une alerte (%)"
                  required={true}
                >
                  <div className={styles.percentageInput}>
                    <Input
                      type="number"
                      value={settings.seuilAlerte}
                      onChange={(e) => handleSettingChange('seuilAlerte', parseInt(e.target.value))}
                      min="1"
                      max="100"
                      name="seuilAlerte"
                      fullWidth
                    />
                    <span className={styles.percentageLabel}>%</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Seuil critique"
                  description="Niveau de stock déclenchant une alerte urgente (%)"
                  warning={true}
                >
                  <div className={styles.percentageInput}>
                    <Input
                      type="number"
                      value={settings.seuilCritique}
                      onChange={(e) => handleSettingChange('seuilCritique', parseInt(e.target.value))}
                      min="1"
                      max="100"
                      name="seuilCritique"
                      fullWidth
                    />
                    <span className={styles.percentageLabel}>%</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Rotation auto"
                  description="Calcul automatique de la rotation des stocks"
                >
                  <InputCheckbox
                    checked={settings.rotationAuto}
                    onChange={(e) => handleSettingChange('rotationAuto', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Catégorie par défaut"
                  description="Catégorie attribuée aux nouveaux produits"
                >
                  <InputSelect
                    value={settings.categorieDefaut}
                    onChange={(value) => handleSettingChange('categorieDefaut', value)}
                    options={[
                      { value: 'Matériaux Construction', label: 'Matériaux Construction' },
                      { value: 'Ferronnerie', label: 'Ferronnerie' },
                      { value: 'Quincaillerie', label: 'Quincaillerie' },
                      { value: 'Peinture', label: 'Peinture' },
                      { value: 'Plomberie', label: 'Plomberie' },
                      { value: 'Électricité', label: 'Électricité' },
                      { value: 'Outillage', label: 'Outillage' }
                    ]}
                    placeholder="Sélectionner une catégorie"
                    fullWidth
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Configuration Produits"
                icon={<IoFolderOpenOutline />}
                isOpen={openSections.stock}
                sectionId="stock"
              >
                <SettingItem 
                  label="Code produit auto"
                  description="Génération automatique des codes produit"
                >
                  <InputCheckbox
                    checked={true}
                    onChange={() => {}}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Préfixe produit"
                  description="Préfixe pour les codes produit"
                >
                  <Input
                    type="text"
                    placeholder="PROD-"
                    name="prefixeProduit"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Unités de mesure"
                  description="Unités disponibles pour les produits"
                >
                  <div className={styles.chipContainer}>
                    <span className={styles.chip}>kg</span>
                    <span className={styles.chip}>g</span>
                    <span className={styles.chip}>L</span>
                    <span className={styles.chip}>mL</span>
                    <span className={styles.chip}>m</span>
                    <span className={styles.chip}>cm</span>
                    <span className={styles.chip}>unité</span>
                    <span className={styles.chip}>paquet</span>
                    <span className={styles.chip}>carton</span>
                    <Button 
                      variant="outline"
                      size="small"
                      icon="add"
                      className={styles.addChip}
                    />
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === 'securite' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Sécurité Système"
                icon={<IoShieldOutline />}
                isOpen={openSections.securite}
                onToggle={toggleSection}
                sectionId="securite"
              >
                <SettingItem 
                  label="Timeout session (minutes)"
                  description="Durée avant déconnexion automatique"
                >
                  <div className={styles.numberInput}>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      min="1"
                      max="240"
                      name="sessionTimeout"
                      fullWidth
                    />
                    <span className={styles.unitLabel}>min</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Tentatives connexion"
                  description="Nombre de tentatives avant blocage"
                  warning={true}
                >
                  <div className={styles.numberInput}>
                    <Input
                      type="number"
                      value={settings.tentativesConnexion}
                      onChange={(e) => handleSettingChange('tentativesConnexion', parseInt(e.target.value))}
                      min="1"
                      max="10"
                      name="tentativesConnexion"
                      fullWidth
                    />
                    <span className={styles.unitLabel}>tentatives</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Force mot de passe"
                  description="Exiger un mot de passe complexe"
                >
                  <InputCheckbox
                    checked={settings.forceMdp}
                    onChange={(e) => handleSettingChange('forceMdp', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Chiffrement données"
                  description="Chiffrer les données sensibles"
                >
                  <InputCheckbox
                    checked={true}
                    onChange={() => {}}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Journal d'activité"
                  description="Enregistrer toutes les actions utilisateur"
                >
                  <InputCheckbox
                    checked={true}
                    onChange={() => {}}
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Permissions Utilisateurs"
                icon={<IoPeopleOutline />}
                isOpen={openSections.securite}
                sectionId="securite"
              >
                <SettingItem 
                  label="Rôles prédéfinis"
                  description=""
                  type="compact"
                >
                  <div className={styles.rolesList}>
                    <div className={styles.roleItem}>
                      <div className={styles.roleInfo}>
                        <span className={styles.roleName}>Administrateur</span>
                        <span className={styles.roleDesc}>Accès complet</span>
                      </div>
                      <StatusBadge status="active" />
                    </div>
                    <div className={styles.roleItem}>
                      <div className={styles.roleInfo}>
                        <span className={styles.roleName}>Gestionnaire</span>
                        <span className={styles.roleDesc}>Gestion stock & vente</span>
                      </div>
                      <StatusBadge status="active" />
                    </div>
                    <div className={styles.roleItem}>
                      <div className={styles.roleInfo}>
                        <span className={styles.roleName}>Vendeur</span>
                        <span className={styles.roleDesc}>Vente uniquement</span>
                      </div>
                      <StatusBadge status="active" />
                    </div>
                    <div className={styles.roleItem}>
                      <div className={styles.roleInfo}>
                        <span className={styles.roleName}>Consultant</span>
                        <span className={styles.roleDesc}>Lecture seule</span>
                      </div>
                      <StatusBadge status="inactive" />
                    </div>
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifications' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Système de Notifications"
                icon={<IoNotificationsOutline />}
                isOpen={openSections.notifications}
                onToggle={toggleSection}
                sectionId="notifications"
              >
                <SettingItem 
                  label="Alertes stock"
                  description="Recevoir des alertes pour stock faible"
                >
                  <InputCheckbox
                    checked={settings.notifStock}
                    onChange={(e) => handleSettingChange('notifStock', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Notifications vente"
                  description="Recevoir des notifications pour chaque vente"
                >
                  <InputCheckbox
                    checked={settings.notifVente}
                    onChange={(e) => handleSettingChange('notifVente', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Alertes crédit"
                  description="Alertes pour clients en retard de paiement"
                >
                  <InputCheckbox
                    checked={settings.notifCredit}
                    onChange={(e) => handleSettingChange('notifCredit', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Notifications email"
                  description="Envoyer les notifications par email"
                >
                  <InputCheckbox
                    checked={settings.emailNotif}
                    onChange={(e) => handleSettingChange('emailNotif', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Notifications SMS"
                  description="Envoyer les alertes par SMS"
                >
                  <InputCheckbox
                    checked={false}
                    onChange={() => {}}
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Configuration Email"
                icon={<IoMailOutline />}
                isOpen={openSections.notifications}
                sectionId="notifications"
              >
                <SettingItem 
                  label="Serveur SMTP"
                  description="Adresse du serveur mail"
                >
                  <Input
                    type="text"
                    placeholder="smtp.gmail.com"
                    name="smtpServer"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Port SMTP"
                  description="Port du serveur mail"
                >
                  <Input
                    type="number"
                    placeholder="587"
                    name="smtpPort"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Email expéditeur"
                  description="Email utilisé pour envoyer les notifications"
                >
                  <Input
                    type="email"
                    placeholder="notifications@quincaillerie.mg"
                    name="emailExpediteur"
                    fullWidth
                  />
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Sauvegarde */}
          {activeTab === 'backup' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Sauvegarde Automatique"
                icon={<IoCloudUploadOutline />}
                isOpen={openSections.backup}
                onToggle={toggleSection}
                sectionId="backup"
              >
                <SettingItem 
                  label="Sauvegarde automatique"
                  description="Effectuer des sauvegardes automatiques"
                >
                  <InputCheckbox
                    checked={settings.backupAuto}
                    onChange={(e) => handleSettingChange('backupAuto', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Fréquence"
                  description="Fréquence des sauvegardes automatiques"
                >
                  <InputSelect
                    value={settings.backupFrequence}
                    onChange={(value) => handleSettingChange('backupFrequence', value)}
                    options={backupFrequencies}
                    placeholder="Sélectionner une fréquence"
                    fullWidth
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Rétention"
                  description="Nombre de jours de conservation"
                >
                  <div className={styles.numberInput}>
                    <Input
                      type="number"
                      value={settings.retentionBackup}
                      onChange={(e) => handleSettingChange('retentionBackup', parseInt(e.target.value))}
                      min="1"
                      max="365"
                      name="retentionBackup"
                      fullWidth
                    />
                    <span className={styles.unitLabel}>jours</span>
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Sauvegarde cloud"
                  description="Sauvegarder dans le cloud"
                >
                  <InputCheckbox
                    checked={settings.cloudBackup}
                    onChange={(e) => handleSettingChange('cloudBackup', e.target.checked)}
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Actions de Sauvegarde"
                icon={<IoServerOutline />}
                isOpen={openSections.backup}
                sectionId="backup"
              >
                <div className={styles.backupActions}>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="upload"
                    className={styles.backupBtn}
                  >
                    Sauvegarde maintenant
                  </Button>
                  <Button 
                    variant="secondary"
                    size="medium"
                    icon="download"
                    className={styles.backupBtn}
                  >
                    Restaurer
                  </Button>
                  <Button 
                    variant="warning"
                    size="medium"
                    icon="trash"
                    className={styles.backupBtn}
                  >
                    Vider les logs
                  </Button>
                </div>
                
                <div className={styles.backupStatus}>
                  <h4 className={styles.statusTitle}>Dernières sauvegardes</h4>
                  <div className={styles.statusList}>
                    <div className={styles.statusItem}>
                      <div className={styles.statusInfo}>
                        <span className={styles.statusTime}>Aujourd'hui, 02:00</span>
                        <span className={styles.statusSize}>245 MB</span>
                      </div>
                      <StatusBadge status="active" label="Réussi" />
                    </div>
                    <div className={styles.statusItem}>
                      <div className={styles.statusInfo}>
                        <span className={styles.statusTime}>Hier, 02:00</span>
                        <span className={styles.statusSize}>240 MB</span>
                      </div>
                      <StatusBadge status="active" label="Réussi" />
                    </div>
                    <div className={styles.statusItem}>
                      <div className={styles.statusInfo}>
                        <span className={styles.statusTime}>25/03/2024, 02:00</span>
                        <span className={styles.statusSize}>238 MB</span>
                      </div>
                      <StatusBadge status="active" label="Réussi" />
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* Onglet Avancé */}
          {activeTab === 'avance' && (
            <div className={styles.tabContent}>
              <SettingsSection
                title="Paramètres Avancés"
                icon={<IoHardwareChipOutline />}
                isOpen={openSections.avance}
                onToggle={toggleSection}
                sectionId="avance"
              >
                <SettingItem 
                  label="Mode maintenance"
                  description="Mettre le système en maintenance"
                  warning={true}
                >
                  <InputCheckbox
                    checked={settings.maintenance}
                    onChange={(e) => handleSettingChange('maintenance', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Mode debug"
                  description="Activer les logs de débogage"
                >
                  <InputCheckbox
                    checked={settings.debug}
                    onChange={(e) => handleSettingChange('debug', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Logs détaillés"
                  description="Enregistrer des logs détaillés"
                >
                  <InputCheckbox
                    checked={settings.logsDetailles}
                    onChange={(e) => handleSettingChange('logsDetailles', e.target.checked)}
                  />
                </SettingItem>
                
                <SettingItem 
                  label="Cache système"
                  description="Durée de vie du cache (minutes)"
                >
                  <div className={styles.numberInput}>
                    <Input
                      type="number"
                      defaultValue="60"
                      min="1"
                      max="1440"
                      name="cacheSystem"
                      fullWidth
                    />
                    <span className={styles.unitLabel}>min</span>
                  </div>
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="API & Intégrations"
                icon={<IoGlobeOutline />}
                isOpen={openSections.avance}
                sectionId="avance"
              >
                <SettingItem 
                  label="Clé API"
                  description="Clé d'API pour les intégrations"
                  type="compact"
                >
                  <div className={styles.apiKey}>
                    <code className={styles.keyValue}>sk_live_**********</code>
                    <Button 
                      variant="outline"
                      size="small"
                      icon="key"
                      className={styles.copyBtn}
                    />
                  </div>
                </SettingItem>
                
                <SettingItem 
                  label="Webhooks"
                  description="URLs de webhooks"
                >
                  <Input
                    type="text"
                    placeholder="https://api.votre-app.com/webhook"
                    name="webhooks"
                    fullWidth
                  />
                </SettingItem>
              </SettingsSection>
              
              <SettingsSection
                title="Informations Système"
                icon={<IoInformationCircleOutline />}
                isOpen={openSections.avance}
                sectionId="avance"
              >
                <div className={styles.systemInfo}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Version:</span>
                    <span className={styles.infoValue}>v2.1.0</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Dernière mise à jour:</span>
                    <span className={styles.infoValue}>15/03/2024</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Base de données:</span>
                    <span className={styles.infoValue}>PostgreSQL 14</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Serveur:</span>
                    <span className={styles.infoValue}>Ubuntu 22.04 LTS</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Mémoire:</span>
                    <span className={styles.infoValue}>2.4 GB / 4 GB</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Stockage:</span>
                    <span className={styles.infoValue}>145 MB / 1 GB</span>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}
        </div>

        {/* Barre d'actions en bas */}
        <div className={styles.bottomActions}>
          <div className={styles.actionGroup}>
            <Button 
              variant="secondary"
              size="medium"
              icon="refresh"
              className={styles.bottomBtn}
            >
              Tester les paramètres
            </Button>
            <Button 
              variant="outline"
              size="medium"
              icon="close"
              className={styles.bottomBtn}
            >
              Annuler les changements
            </Button>
          </div>
          <div className={styles.actionGroup}>
            <Button 
              variant="primary"
              size="medium"
              icon="save"
              onClick={handleSave}
              className={styles.saveBtn}
            >
              Sauvegarder
            </Button>
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Parametres;