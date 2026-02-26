import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './DetailClients.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputSelect from '../../../components/Input/InputSelect';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import Table from '../../../components/Table/Table';
import Toast from '../../../components/Toast/Toast';
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoRefreshOutline,
  IoCashOutline,
  IoReceiptOutline,
  IoPersonOutline,
  IoBarcodeOutline,
  IoCalculatorOutline,
  IoQrCodeOutline,
  IoSaveOutline,
  IoNotificationsOutline,
  IoWalletOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoTimeOutline
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
  FaWarehouse
} from "react-icons/fa";
import { 
  TbBuildingStore,
  TbCategory,
  TbCurrencyDollar,
  TbTrendingUp,
  TbListDetails
} from "react-icons/tb";
import { 
  MdOutlineStorefront,
  MdOutlineCategory,
  MdOutlineLocalShipping,
  MdOutlinePayment,
  MdOutlineDateRange,
  MdOutlineGroup,
  MdOutlineEdit,
  MdOutlineDelete,
  MdOutlineShoppingCart
} from "react-icons/md";

// Données mock pour le client
const mockClientData = {
  id: 1,
  nom: 'SARL Batiment Plus',
  type: 'Entreprise',
  contact: 'Mr. Rakoto Jean',
  telephone: '+261 34 00 123 45',
  email: 'contact@batimentplus.mg',
  adresse: 'Analakely, Antananarivo 101',
  categorie: 'Client Premium',
  credit_autorise: 5000000,
  credit_utilise: 1500000,
  credit_disponible: 3500000,
  total_achats: 8500000,
  dernier_achat: '2024-03-15',
  date_inscription: '2023-05-20',
  statut: 'actif',
  notes: 'Client fidèle depuis 2 ans. Paiements généralement à 30 jours. Contactez toujours Mr. Rakoto pour les commandes importantes.',
  historique_commandes: [
    { id: 1, date: '2024-03-15', reference: 'FAC-2024-00158', montant: 1250000, statut: 'payé' },
    { id: 2, date: '2024-02-28', reference: 'FAC-2024-00142', montant: 850000, statut: 'payé' },
    { id: 3, date: '2024-02-15', reference: 'FAC-2024-00135', montant: 2100000, statut: 'payé' },
    { id: 4, date: '2024-01-30', reference: 'FAC-2024-00121', montant: 950000, statut: 'payé' },
    { id: 5, date: '2024-01-15', reference: 'FAC-2024-00115', montant: 1450000, statut: 'payé' },
  ],
  frequence_achat: 'Mensuel',
  moyen_paiement_prefere: 'Virement bancaire',
  secteur_activite: 'Construction',
  site_web: 'www.batimentplus.mg',
  responsable_compte: 'Admin'
};

const DetailClients = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedClient, setEditedClient] = useState({});
  const [activeTab, setActiveTab] = useState('info');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  // Options pour les sélecteurs
  const [clientTypes] = useState([
    { value: 'Particulier', label: 'Particulier' },
    { value: 'Entreprise', label: 'Entreprise' }
  ]);

  const [categories] = useState([
    { value: 'Client Standard', label: 'Client Standard' },
    { value: 'Client Silver', label: 'Client Silver' },
    { value: 'Client Gold', label: 'Client Gold' },
    { value: 'Client Premium', label: 'Client Premium' }
  ]);

  const [statusOptions] = useState([
    { value: 'actif', label: 'Actif' },
    { value: 'inactif', label: 'Inactif' },
    { value: 'suspendu', label: 'Suspendu' }
  ]);

  const [secteurs] = useState([
    { value: 'Construction', label: 'Construction' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Services', label: 'Services' },
    { value: 'Industrie', label: 'Industrie' },
    { value: 'Transport', label: 'Transport' }
  ]);

  // Fonction pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour afficher un toast
  const showToastMessage = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Charger les données du client
  useEffect(() => {
    const loadClient = () => {
      setLoading(true);
      setTimeout(() => {
        setClient(mockClientData);
        setEditedClient(mockClientData);
        setLoading(false);
      }, 500);
    };

    loadClient();
  }, [id]);

  // Gestion de l'édition
  const handleEdit = () => {
    if (editMode) {
      setClient(editedClient);
      showToastMessage('Modifications enregistrées avec succès !', 'success');
    }
    setEditMode(!editMode);
  };

  const handleCancelEdit = () => {
    setEditedClient(client);
    setEditMode(false);
  };

  const handleFieldChange = (field, value) => {
    setEditedClient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gestion des actions
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${client.nom}" ?`)) {
      showToastMessage('Client supprimé avec succès', 'success');
      setTimeout(() => navigate('/clients'), 1500);
    }
  };

  const handleNewOrder = () => {
    navigate('/ventes/nouvelle', { state: { clientId: client.id } });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    showToastMessage('Fiche client exportée', 'info');
  };

  // Si le chargement est en cours
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement des détails du client...</p>
      </div>
    );
  }

  // Si le client n'est pas trouvé
  if (!client) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <IoCloseCircleOutline />
        </div>
        <h2 className={styles.errorTitle}>Client non trouvé</h2>
        <p className={styles.errorText}>
          Le client que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Button 
          variant="primary"
          icon="back"
          onClick={() => navigate('/clients')}
          className={styles.errorButton}
        >
          Retour à la liste des clients
        </Button>
      </div>
    );
  }

  // Calculer le pourcentage de crédit utilisé
  const creditPercent = client.credit_autorise > 0 
    ? (client.credit_utilise / client.credit_autorise) * 100 
    : 0;

  // Colonnes pour l'historique des commandes
  const commandesColumns = [
    {
      key: 'date',
      label: 'Date',
      accessor: 'date',
      render: (row) => formatDate(row.date)
    },
    {
      key: 'reference',
      label: 'Référence',
      accessor: 'reference'
    },
    {
      key: 'montant',
      label: 'Montant',
      accessor: 'montant',
      render: (row) => formatCurrency(row.montant)
    },
    {
      key: 'statut',
      label: 'Statut',
      accessor: 'statut',
      render: (row) => (
        <span className={`${styles.statusBadge} ${styles[row.statut]}`}>
          {row.statut === 'payé' ? <IoCheckmarkCircleOutline /> : <IoTimeOutline />}
          {row.statut}
        </span>
      )
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Button 
            variant="outline"
            size="small"
            icon="back"
            onClick={() => navigate('/clients')}
            className={styles.backButton}
          >
            Retour
          </Button>
          
          <div className={styles.headerActions}>
            <Button 
              variant="outline"
              size="small"
              icon="print"
              onClick={handlePrint}
              className={styles.headerActionBtn}
            >
              Imprimer
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="download"
              onClick={handleExport}
              className={styles.headerActionBtn}
            >
              Exporter
            </Button>
            <Button 
              variant="outline"
              size="small"
              icon="share"
              onClick={() => showToastMessage('Lien de partage copié', 'info')}
              className={styles.headerActionBtn}
            >
              Partager
            </Button>
          </div>
        </div>

        <div className={styles.headerMain}>
          <div className={styles.clientInfo}>
            <div className={styles.clientAvatar}>
              {client.type === 'Entreprise' ? <FaBuilding /> : <FaUserTie />}
            </div>
            <div className={styles.clientDetails}>
              <h1 className={styles.clientName}>{client.nom}</h1>
              <div className={styles.clientMeta}>
                <span className={`${styles.clientStatus} ${styles[client.statut]}`}>
                  {client.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
                <span className={styles.clientCategory}>
                  <FaTags /> {client.categorie}
                </span>
                <span className={styles.clientType}>
                  {client.type}
                </span>
              </div>
              <p className={styles.clientContact}>
                <IoCallOutline /> {client.telephone} • {client.contact}
              </p>
            </div>
          </div>

          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Total achats</div>
              <div className={styles.statValue}>{formatCurrency(client.total_achats)}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Crédit utilisé</div>
              <div className={styles.statValue}>{formatCurrency(client.credit_utilise)}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Dernier achat</div>
              <div className={styles.statValue}>{formatDate(client.dernier_achat)}</div>
            </div>
          </div>
        </div>

        <div className={styles.headerActionsMain}>
          <Button 
            variant="primary"
            size="medium"
            icon={editMode ? "save" : "edit"}
            onClick={handleEdit}
            className={styles.editButton}
          >
            {editMode ? 'Sauvegarder' : 'Modifier'}
          </Button>
          {editMode && (
            <Button 
              variant="outline"
              size="medium"
              icon="close"
              onClick={handleCancelEdit}
              className={styles.cancelButton}
            >
              Annuler
            </Button>
          )}
          <Button 
            variant="cartbg"
            size="medium"
            icon="cart"
            onClick={handleNewOrder}
            className={styles.orderButton}
          >
            Nouvelle Commande
          </Button>
          <Button 
            variant="danger"
            size="medium"
            icon="trash"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className={styles.tabNavigation}>
        <Button
          variant={activeTab === 'info' ? 'primary' : 'outline'}
          size="small"
          icon="person"
          onClick={() => setActiveTab('info')}
          className={`${styles.tabBtn} ${activeTab === 'info' ? styles.active : ''}`}
        >
          Informations
        </Button>
        <Button
          variant={activeTab === 'credit' ? 'primary' : 'outline'}
          size="small"
          icon="wallet"
          onClick={() => setActiveTab('credit')}
          className={`${styles.tabBtn} ${activeTab === 'credit' ? styles.active : ''}`}
        >
          Crédit
        </Button>
        <Button
          variant={activeTab === 'orders' ? 'primary' : 'outline'}
          size="small"
          icon="receipt"
          onClick={() => setActiveTab('orders')}
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.active : ''}`}
        >
          Commandes
        </Button>
        <Button
          variant={activeTab === 'activity' ? 'primary' : 'outline'}
          size="small"
          icon="chart"
          onClick={() => setActiveTab('activity')}
          className={`${styles.tabBtn} ${activeTab === 'activity' ? styles.active : ''}`}
        >
          Activité
        </Button>
      </div>

      {/* Main content */}
      <div className={styles.mainContent}>
        {activeTab === 'info' && (
          <div className={styles.infoSection}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <IoInformationCircleOutline /> Informations de base
                </h3>
                <div className={styles.formGrid}>
                  <Input
                    label="Nom / Raison sociale"
                    value={editMode ? editedClient.nom : client.nom}
                    onChange={(e) => handleFieldChange('nom', e.target.value)}
                    placeholder="Nom du client"
                    icon={<FaUserTie />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <InputSelect
                    label="Type de client"
                    value={editMode ? editedClient.type : client.type}
                    onChange={(value) => handleFieldChange('type', value)}
                    options={clientTypes}
                    placeholder="Type de client"
                    icon={client.type === 'Entreprise' ? <FaBuilding /> : <IoPersonOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Personne de contact"
                    value={editMode ? editedClient.contact : client.contact}
                    onChange={(e) => handleFieldChange('contact', e.target.value)}
                    placeholder="Nom du contact"
                    icon={<FaUserTie />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Téléphone"
                    value={editMode ? editedClient.telephone : client.telephone}
                    onChange={(e) => handleFieldChange('telephone', e.target.value)}
                    placeholder="Numéro de téléphone"
                    icon={<IoCallOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    value={editMode ? editedClient.email : client.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="Adresse email"
                    icon={<IoMailOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Adresse"
                    value={editMode ? editedClient.adresse : client.adresse}
                    onChange={(e) => handleFieldChange('adresse', e.target.value)}
                    placeholder="Adresse complète"
                    icon={<IoLocationOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>
                  <FaTags /> Classification
                </h3>
                <div className={styles.formGrid}>
                  <InputSelect
                    label="Catégorie"
                    value={editMode ? editedClient.categorie : client.categorie}
                    onChange={(value) => handleFieldChange('categorie', value)}
                    options={categories}
                    placeholder="Catégorie du client"
                    icon={<FaTags />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <InputSelect
                    label="Statut"
                    value={editMode ? editedClient.statut : client.statut}
                    onChange={(value) => handleFieldChange('statut', value)}
                    options={statusOptions}
                    placeholder="Statut du client"
                    icon={client.statut === 'actif' ? <IoCheckmarkCircleOutline /> : <IoCloseCircleOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <InputSelect
                    label="Secteur d'activité"
                    value={editMode ? editedClient.secteur_activite : client.secteur_activite}
                    onChange={(value) => handleFieldChange('secteur_activite', value)}
                    options={secteurs}
                    placeholder="Secteur d'activité"
                    icon={<FaBuilding />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Site web"
                    value={editMode ? editedClient.site_web : client.site_web}
                    onChange={(e) => handleFieldChange('site_web', e.target.value)}
                    placeholder="Site web"
                    icon={<IoInformationCircleOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Moyen de paiement préféré"
                    value={editMode ? editedClient.moyen_paiement_prefere : client.moyen_paiement_prefere}
                    onChange={(e) => handleFieldChange('moyen_paiement_prefere', e.target.value)}
                    placeholder="Moyen de paiement"
                    icon={<IoWalletOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                  
                  <Input
                    label="Fréquence d'achat"
                    value={editMode ? editedClient.frequence_achat : client.frequence_achat}
                    onChange={(e) => handleFieldChange('frequence_achat', e.target.value)}
                    placeholder="Fréquence d'achat"
                    icon={<IoCalendarOutline />}
                    disabled={!editMode}
                    fullWidth
                  />
                </div>
              </div>
            </div>

            <div className={styles.notesSection}>
              <h3 className={styles.cardTitle}>
                <IoInformationCircleOutline /> Notes
              </h3>
              <InputTextarea
                label="Notes internes"
                value={editMode ? editedClient.notes : client.notes}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                placeholder="Notes sur le client..."
                rows={4}
                disabled={!editMode}
                fullWidth
                showCharCount
                maxLength={500}
              />
            </div>
          </div>
        )}

        {activeTab === 'credit' && (
          <div className={styles.creditSection}>
            <div className={styles.creditCard}>
              <h3 className={styles.cardTitle}>
                <IoWalletOutline /> Limite de crédit
              </h3>
              <div className={styles.creditStats}>
                <div className={styles.creditStat}>
                  <div className={styles.creditLabel}>Crédit autorisé</div>
                  <div className={styles.creditValue}>{formatCurrency(client.credit_autorise)}</div>
                </div>
                <div className={styles.creditStat}>
                  <div className={styles.creditLabel}>Crédit utilisé</div>
                  <div className={styles.creditValue}>{formatCurrency(client.credit_utilise)}</div>
                </div>
                <div className={styles.creditStat}>
                  <div className={styles.creditLabel}>Crédit disponible</div>
                  <div className={`${styles.creditValue} ${styles.available}`}>
                    {formatCurrency(client.credit_disponible)}
                  </div>
                </div>
              </div>
              
              <div className={styles.creditProgress}>
                <div className={styles.progressLabels}>
                  <span>Utilisation du crédit</span>
                  <span>{creditPercent.toFixed(1)}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={`${styles.progressFill} ${creditPercent > 80 ? styles.danger : creditPercent > 50 ? styles.warning : styles.safe}`}
                    style={{ width: `${Math.min(100, creditPercent)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className={styles.creditHistory}>
              <h3 className={styles.cardTitle}>
                <IoReceiptOutline /> Dernières transactions
              </h3>
              <Table
                columns={[
                  { key: 'date', label: 'Date', accessor: 'date' },
                  { key: 'type', label: 'Type', accessor: 'type' },
                  { key: 'montant', label: 'Montant', accessor: 'montant', render: (row) => formatCurrency(row.montant) },
                  { key: 'solde', label: 'Solde crédit', accessor: 'solde', render: (row) => formatCurrency(row.solde) },
                  { key: 'reference', label: 'Référence', accessor: 'reference' }
                ]}
                data={[
                  { id: 1, date: '2024-03-15', type: 'Paiement facture', montant: -1250000, solde: 3500000, reference: 'FAC-2024-00158' },
                  { id: 2, date: '2024-03-01', type: 'Ajustement crédit', montant: 1000000, solde: 4750000, reference: 'AJT-2024-003' },
                  { id: 3, date: '2024-02-28', type: 'Paiement facture', montant: -850000, solde: 3750000, reference: 'FAC-2024-00142' },
                  { id: 4, date: '2024-02-15', type: 'Paiement facture', montant: -2100000, solde: 4600000, reference: 'FAC-2024-00135' },
                  { id: 5, date: '2024-02-01', type: 'Ajustement crédit', montant: 2000000, solde: 6700000, reference: 'AJT-2024-002' }
                ]}
                pagination={true}
                itemsPerPage={5}
              />
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersSection}>
            <div className={styles.ordersHeader}>
              <h3 className={styles.cardTitle}>
                <IoReceiptOutline /> Historique des commandes
              </h3>
              <div className={styles.ordersStats}>
                <div className={styles.orderStat}>
                  <span className={styles.orderStatLabel}>Total commandes :</span>
                  <span className={styles.orderStatValue}>{formatCurrency(client.total_achats)}</span>
                </div>
                <div className={styles.orderStat}>
                  <span className={styles.orderStatLabel}>Dernière commande :</span>
                  <span className={styles.orderStatValue}>{formatDate(client.dernier_achat)}</span>
                </div>
              </div>
            </div>

            <div className={styles.ordersTable}>
              <Table
                columns={commandesColumns}
                data={client.historique_commandes}
                pagination={true}
                itemsPerPage={5}
                hoverEffect={true}
                striped={true}
              />
            </div>

            <div className={styles.ordersSummary}>
              <div className={styles.summaryCard}>
                <h4>Statistiques commandes</h4>
                <div className={styles.summaryStats}>
                  <div className={styles.summaryStat}>
                    <div className={styles.summaryLabel}>Moyenne par commande</div>
                    <div className={styles.summaryValue}>
                      {formatCurrency(client.total_achats / client.historique_commandes.length)}
                    </div>
                  </div>
                  <div className={styles.summaryStat}>
                    <div className={styles.summaryLabel}>Fréquence</div>
                    <div className={styles.summaryValue}>{client.frequence_achat}</div>
                  </div>
                  <div className={styles.summaryStat}>
                    <div className={styles.summaryLabel}>Commandes ce mois</div>
                    <div className={styles.summaryValue}>1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className={styles.activitySection}>
            <div className={styles.activityGrid}>
              <div className={styles.activityCard}>
                <h3 className={styles.cardTitle}>
                  <IoCalendarOutline /> Dernières activités
                </h3>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <IoReceiptOutline />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Nouvelle commande</div>
                      <div className={styles.activityDetails}>
                        <span className={styles.activityDate}>15 Mars 2024</span>
                        <span className={styles.activityAmount}>{formatCurrency(1250000)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <IoCashOutline />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Paiement reçu</div>
                      <div className={styles.activityDetails}>
                        <span className={styles.activityDate}>14 Mars 2024</span>
                        <span className={styles.activityAmount}>{formatCurrency(1250000)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <IoCallOutline />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Appel téléphonique</div>
                      <div className={styles.activityDetails}>
                        <span className={styles.activityDate}>10 Mars 2024</span>
                        <span className={styles.activityDuration}>15 minutes</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      <IoMailOutline />
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityTitle}>Email envoyé</div>
                      <div className={styles.activityDetails}>
                        <span className={styles.activityDate}>8 Mars 2024</span>
                        <span className={styles.activitySubject}>Devis #DEV-2024-045</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.activityCard}>
                <h3 className={styles.cardTitle}>
                  <IoStatsChartOutline /> Performance
                </h3>
                <div className={styles.performanceStats}>
                  <div className={styles.performanceItem}>
                    <div className={styles.performanceIcon}>
                      <TbCurrencyDollar />
                    </div>
                    <div className={styles.performanceContent}>
                      <div className={styles.performanceValue}>{formatCurrency(client.total_achats)}</div>
                      <div className={styles.performanceLabel}>Chiffre d'affaires total</div>
                    </div>
                  </div>
                  <div className={styles.performanceItem}>
                    <div className={styles.performanceIcon}>
                      <IoCalendarOutline />
                    </div>
                    <div className={styles.performanceContent}>
                      <div className={styles.performanceValue}>2 ans</div>
                      <div className={styles.performanceLabel}>Client depuis</div>
                    </div>
                  </div>
                  <div className={styles.performanceItem}>
                    <div className={styles.performanceIcon}>
                      <IoReceiptOutline />
                    </div>
                    <div className={styles.performanceContent}>
                      <div className={styles.performanceValue}>{client.historique_commandes.length}</div>
                      <div className={styles.performanceLabel}>Commandes totales</div>
                    </div>
                  </div>
                  <div className={styles.performanceItem}>
                    <div className={styles.performanceIcon}>
                      <IoCheckmarkCircleOutline />
                    </div>
                    <div className={styles.performanceContent}>
                      <div className={styles.performanceValue}>100%</div>
                      <div className={styles.performanceLabel}>Taux de paiement</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick actions sidebar (mobile seulement) */}
      <div className={styles.mobileActions}>
        <Button
          variant="cartbg"
          size="small"
          icon="cart"
          onClick={handleNewOrder}
          className={styles.mobileActionBtn}
          fullWidth
        >
          Nouvelle Commande
        </Button>
        <Button
          variant="outline"
          size="small"
          icon="call"
          onClick={() => window.location.href = `tel:${client.telephone}`}
          className={styles.mobileActionBtn}
          fullWidth
        >
          Appeler
        </Button>
        <Button
          variant="outline"
          size="small"
          icon="mail"
          onClick={() => window.location.href = `mailto:${client.email}`}
          className={styles.mobileActionBtn}
          fullWidth
        >
          Email
        </Button>
      </div>

      {/* Toast notifications */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          duration={3000}
          position="top-right"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default DetailClients;