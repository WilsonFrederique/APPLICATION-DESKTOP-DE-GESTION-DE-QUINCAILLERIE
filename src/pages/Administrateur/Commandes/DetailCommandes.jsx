import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './DetailCommandes.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import Toast from '../../../components/Toast/Toast';
import { 
  IoMailOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoStatsChartOutline,
  IoAlertCircleOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoCopyOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoCreateOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaCreditCard,
  FaPercentage,
  FaUserTie,
  FaBarcode,
  FaStore,
  FaShippingFast,
  FaSync,
  FaFileInvoiceDollar,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaHome,
  FaBuilding,
  FaIdCard,
  FaQrcode,
  FaBoxes,
  FaCalculator,
  FaHistory,
  FaCalendarCheck,
  FaChevronRight,
  FaRegCopy
} from "react-icons/fa";
import { 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbPackage,
  TbReceiptTax,
  TbReceipt2,
  TbDiscount,
  TbCalendarTime,
  TbFileInvoice,
  TbFileX,
  TbDotsVertical
} from "react-icons/tb";
import { 
  GiCash, 
  GiReceiveMoney,
  GiBank,
  GiBanknote
} from "react-icons/gi";
import {
  CiDeliveryTruck,
  CiEdit
} from "react-icons/ci";
import { Chip, emphasize, styled } from '@mui/material';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import Table from '../../../components/Table/Table';

// Importer les constantes
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

const DetailCommandes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [commande, setCommande] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [validationNotes, setValidationNotes] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'Non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Formatage de la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Ajouter un toast
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Charger les données de la commande
  useEffect(() => {
    const loadCommandeData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let commandeData = null;
        const commandeId = parseInt(id);
        
        if (location.state?.commande) {
          commandeData = location.state.commande;
        } else if (commandeId) {
          commandeData = mockCommandes.find(c => c.id === commandeId);
          
          if (!commandeData) {
            const savedCommandes = JSON.parse(localStorage.getItem('commandes') || '[]');
            commandeData = savedCommandes.find(c => c.id === commandeId);
          }
        }
        
        if (commandeData) {
          const commandeComplete = {
            id: commandeData.id,
            numero: commandeData.numero || 'N/A',
            client: commandeData.client || 'N/A',
            clientId: commandeData.clientId || 1,
            email: commandeData.email || 'contact@client.mg',
            telephone: commandeData.telephone || '+261 XX XX XX XX',
            adresse: commandeData.adresseLivraison || 'Non spécifiée',
            ville: commandeData.ville || 'Antananarivo',
            codePostal: commandeData.codePostal || '101',
            pays: commandeData.pays || 'Madagascar',
            date: commandeData.date || new Date().toISOString().split('T')[0],
            dateLivraison: commandeData.dateLivraison || new Date().toISOString().split('T')[0],
            dateLivraisonReelle: commandeData.dateLivraisonReelle || null,
            statut: commandeData.statut || 'en_cours',
            typeCommande: commandeData.typeCommande || COMMANDE_TYPES.EN_COURS,
            priorite: commandeData.priorite || 'normale',
            vendeur: commandeData.vendeur || 'Admin',
            vendeurId: commandeData.vendeurId || 1,
            montant: commandeData.montant || 0,
            montantHT: commandeData.montantHT || commandeData.montant || 0,
            tva: commandeData.tva || 0,
            remise: commandeData.remise || 0,
            fraisLivraison: commandeData.fraisLivraison || 0,
            paiement: commandeData.paiement || 'en_attente',
            modePaiement: commandeData.modePaiement || 'à crédit',
            typeLivraison: commandeData.typeLivraison || 'livraison',
            transporteur: commandeData.transporteur || 'Non spécifié',
            numeroSuivi: commandeData.numeroSuivi || 'Non disponible',
            articles: commandeData.articles || (commandeData.produits ? commandeData.produits.reduce((sum, p) => sum + p.qty, 0) : 0),
            notes: commandeData.notes || '',
            notesLivraison: commandeData.notesLivraison || '',
            creerPar: commandeData.creerPar || 'System',
            dateCreation: commandeData.dateCreation || new Date().toISOString(),
            derniereModification: commandeData.derniereModification || new Date().toISOString(),
            produits: commandeData.produits || [],
            historique: commandeData.historique || [
              {
                id: 1,
                type: 'creation',
                description: 'Commande créée',
                date: commandeData.dateCreation || new Date().toISOString(),
                utilisateur: commandeData.creerPar || 'System'
              }
            ],
            factures: commandeData.factures || [
              {
                id: 1,
                numero: `FACT-${commandeData.numero?.replace('CMD-', '') || '2024-00000'}`,
                date: commandeData.date || new Date().toISOString().split('T')[0],
                montant: commandeData.montant || 0,
                statut: commandeData.paiement === 'payée' ? 'payée' : 'en_attente',
                lien: `/factures/${commandeData.id || 1}`
              }
            ],
            clientInfo: commandeData.clientInfo || {
              nom: commandeData.client || 'N/A',
              type: 'Entreprise',
              siret: '12345678901234',
              tva: 'FR12345678901',
              adresseFacturation: commandeData.adresseLivraison || 'Non spécifiée',
              adresseLivraison: commandeData.adresseLivraison || 'Non spécifiée',
              contact: commandeData.client || 'N/A',
              telephone: commandeData.telephone || '+261 XX XX XX XX',
              email: commandeData.email || 'contact@client.mg',
              solde: 0,
              credit: 1000000,
              derniereCommande: commandeData.date || new Date().toISOString().split('T')[0]
            }
          };
          
          setCommande(commandeComplete);
          
          const initialQuantities = {};
          commandeComplete.produits.forEach(produit => {
            initialQuantities[produit.id] = produit.qtyRecue || 0;
          });
          setQuantities(initialQuantities);
          
          addToast('Commande chargée avec succès', 'success');
        } else {
          addToast('Commande non trouvée', 'error');
          navigate('/commandesAdmin');
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        addToast('Erreur lors du chargement de la commande', 'error');
        navigate('/commandesAdmin');
      } finally {
        setIsLoading(false);
      }
    };

    loadCommandeData();
  }, [id, location.state, navigate]);

  // Gérer l'édition
  const handleEdit = () => {
    navigate(`/frmCommandesAdmin/${id}`, {
      state: { commande }
    });
  };

  // Gérer la suppression
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la commande "${commande?.numero}" ?`)) {
      addToast('Commande supprimée avec succès', 'success');
      navigate('/commandesAdmin');
    }
  };

  // Gérer l'annulation
  const handleCancel = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir annuler la commande "${commande?.numero}" ?`)) {
      setCommande(prev => ({
        ...prev,
        statut: 'annulée'
      }));
      addToast('Commande annulée avec succès', 'warning');
    }
  };

  // Gérer la validation
  const handleValidate = () => {
    setShowValidationModal(true);
  };

  const handleValidationSubmit = () => {
    const updatedProduits = commande.produits.map(produit => ({
      ...produit,
      qtyRecue: quantities[produit.id] || 0,
      qtyRestante: produit.qty - (quantities[produit.id] || 0)
    }));

    const totalRecu = updatedProduits.reduce((sum, p) => sum + (p.qtyRecue || 0), 0);
    const totalCommandé = updatedProduits.reduce((sum, p) => sum + p.qty, 0);
    
    let nouveauStatut = commande.statut;
    let nouveauTypeCommande = commande.typeCommande;
    
    if (totalRecu === 0) {
      nouveauStatut = 'en_cours';
      nouveauTypeCommande = COMMANDE_TYPES.EN_COURS;
    } else if (totalRecu > 0 && totalRecu < totalCommandé) {
      nouveauStatut = 'arrivee_partielle';
      nouveauTypeCommande = COMMANDE_TYPES.ARRIVEE_PARTIELLE;
    } else if (totalRecu === totalCommandé) {
      nouveauStatut = 'validee';
      nouveauTypeCommande = COMMANDE_TYPES.VALIDEE;
    }
    
    setCommande(prev => ({
      ...prev,
      produits: updatedProduits,
      statut: nouveauStatut,
      typeCommande: nouveauTypeCommande,
      derniereModification: new Date().toISOString()
    }));

    addToast('Quantités validées avec succès', 'success');
    setShowValidationModal(false);
  };

  // Gérer l'impression
  const handlePrint = () => {
    window.print();
    addToast('Prêt pour impression', 'info');
  };

  // Gérer l'export
  const handleExport = () => {
    if (!commande) return;
    
    const csvContent = [
      ['Numéro', 'Client', 'Date', 'Montant', 'Statut', 'Vendeur'],
      [commande.numero, commande.client, commande.date, commande.montant, commande.statut, commande.vendeur]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commande-${commande.numero}.csv`;
    a.click();
    addToast('Commande exportée avec succès', 'success');
  };

  // Gérer la duplication
  const handleDuplicate = () => {
    navigate('/frmCommandesAdmin', {
      state: { 
        duplicateData: commande,
        mode: 'duplicate'
      }
    });
  };

  // Calculer le total des produits
  const calculateTotals = () => {
    if (!commande || !commande.produits) return {};
    return {
      totalArticles: commande.produits.reduce((sum, p) => sum + p.qty, 0),
      totalRecu: commande.produits.reduce((sum, p) => sum + (p.qtyRecue || 0), 0),
      totalRestant: commande.produits.reduce((sum, p) => sum + (p.qtyRestante || p.qty), 0),
      progress: commande.produits.reduce((sum, p) => sum + (p.qtyRecue || 0), 0) / 
                commande.produits.reduce((sum, p) => sum + p.qty, 0) * 100 || 0
    };
  };

  // Obtenir la couleur du statut
  const getStatusColor = (statut) => {
    switch(statut) {
      case 'en_cours': return '#3b82f6';
      case 'validee': return '#10b981';
      case 'arrivee_partielle': return '#f59e0b';
      case 'livrée': return '#059669';
      case 'facturée': return '#06b6d4';
      case 'annulée': return '#ef4444';
      case 'en_attente': return '#f59e0b';
      case 'expédiée': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  // Obtenir l'icône du statut
  const getStatusIcon = (statut) => {
    switch(statut) {
      case 'en_cours': return <FaSync />;
      case 'validee': return <IoCheckmarkCircleOutline />;
      case 'arrivee_partielle': return <IoWarningOutline />;
      case 'livrée': return <FaTruck />;
      case 'facturée': return <FaFileInvoiceDollar />;
      case 'annulée': return <IoCloseCircleOutline />;
      case 'en_attente': return <IoTimeOutline />;
      case 'expédiée': return <TbTruckDelivery />;
      default: return <IoInformationCircleOutline />;
    }
  };

  // Tabs disponibles
  const tabs = [
    { id: 'info', label: 'Informations', icon: <IoReceiptOutline /> },
    { id: 'produits', label: 'Produits', icon: <FaBox /> },
    { id: 'suivi', label: 'Suivi', icon: <FaShippingFast /> },
    { id: 'client', label: 'Client', icon: <FaUser /> },
    { id: 'facturation', label: 'Facturation', icon: <FaFileInvoiceDollar /> }
  ];

  // Configuration des colonnes pour les produits
  const produitsColumns = [
    {
      label: 'Produit',
      accessor: 'nom',
      render: (row) => (
        <div className={styles.produitInfo}>
          <div className={styles.produitCode}>{row.code || row.id}</div>
          <div className={styles.produitNom}>{row.nom}</div>
          <div className={styles.produitCategorie}>{row.categorie || 'Non catégorisé'}</div>
        </div>
      )
    },
    {
      label: 'Quantité',
      accessor: 'qty',
      render: (row) => (
        <div className={styles.quantitesCell}>
          <div className={styles.qtyCommande}>{row.qty} {row.unite || 'unité'}</div>
          <div className={styles.qtyRecue}>
            Reçu: {row.qtyRecue || 0}
          </div>
          <div className={styles.qtyRestante}>
            Restant: {row.qtyRestante || row.qty}
          </div>
        </div>
      )
    },
    {
      label: 'Prix',
      accessor: 'prix',
      render: (row) => (
        <div className={styles.prixCell}>
          <div className={styles.prixUnitaire}>{formatCurrency(row.prix)}/{row.unite || 'unité'}</div>
          <div className={styles.prixTotal}>{formatCurrency(row.qty * row.prix)}</div>
        </div>
      )
    },
    {
      label: 'Actions',
      accessor: 'actions',
      align: 'center',
      render: () => (
        <div className={styles.produitActions}>
          <Button 
            variant="ghost"
            size="small"
            icon="eye"
            onClick={() => {}}
            title="Voir détails"
          />
        </div>
      )
    }
  ];

  // Animation simple pour le spinner
  const LoadingSpinner = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Chargement des détails de la commande...</p>
    </div>
  );

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    if (!commande) return null;
    
    const totals = calculateTotals();

    switch(activeTab) {
      case 'info':
        return (
          <div className={styles.tabContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoReceiptOutline /> Informations Commande
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Numéro:</span>
                    <span className={styles.infoValue}>
                      <FaBarcode /> {commande.numero}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date commande:</span>
                    <span className={styles.infoValue}>
                      <IoCalendarOutline /> {formatDateShort(commande.date)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Livraison prévue:</span>
                    <span className={styles.infoValue}>
                      <TbCalendarTime /> {formatDateShort(commande.dateLivraison)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Vendeur:</span>
                    <span className={styles.infoValue}>
                      <FaUserTie /> {commande.vendeur}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <FaShippingFast /> Livraison
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Type livraison:</span>
                    <span className={styles.infoValue}>
                      {commande.typeLivraison === 'livraison' ? <CiDeliveryTruck /> : <FaStore />}
                      {commande.typeLivraison === 'livraison' ? 'Livraison' : 'À emporter'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Transporteur:</span>
                    <span className={styles.infoValue}>
                      {commande.transporteur || 'Non spécifié'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>N° suivi:</span>
                    <span className={styles.infoValue}>
                      <FaQrcode /> {commande.numeroSuivi || 'Non disponible'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Frais livraison:</span>
                    <span className={styles.infoValue}>
                      {formatCurrency(commande.fraisLivraison || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <FaMoneyBillWave /> Paiement
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Statut paiement:</span>
                    <span className={`${styles.infoValue} ${styles[commande.paiement]}`}>
                      {commande.paiement === 'payée' ? <IoCheckmarkCircleOutline /> : 
                       commande.paiement === 'acompte' ? <IoInformationCircleOutline /> : 
                       commande.paiement === 'en_attente' ? <IoTimeOutline /> : 
                       <IoCloseCircleOutline />}
                      {commande.paiement}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Mode paiement:</span>
                    <span className={styles.infoValue}>
                      {commande.modePaiement === 'virement' ? <GiBank /> :
                       commande.modePaiement === 'carte' ? <FaCreditCard /> :
                       commande.modePaiement === 'cheque' ? <GiBanknote /> :
                       <GiCash />}
                      {commande.modePaiement || 'À crédit'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Montant total:</span>
                    <span className={`${styles.infoValue} ${styles.montant}`}>
                      {formatCurrency(commande.montant)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoStatsChartOutline /> Statistiques
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Articles:</span>
                    <span className={styles.infoValue}>
                      <FaBoxes /> {commande.articles} articles
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Produits:</span>
                    <span className={styles.infoValue}>
                      <TbPackage /> {commande.produits.length} produits
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Avancement:</span>
                    <span className={styles.infoValue}>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill}
                            style={{ width: `${totals.progress}%` }}
                          />
                        </div>
                        <span className={styles.progressText}>
                          {totals.progress.toFixed(1)}%
                        </span>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {commande.notes && (
              <div className={styles.notesSection}>
                <h3 className={styles.sectionTitle}>
                  <IoInformationCircleOutline /> Notes
                </h3>
                <div className={styles.notesContent}>
                  {commande.notes}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'produits':
        return (
          <div className={styles.tabContent}>
            <div className={styles.produitsHeader}>
              <h3 className={styles.sectionTitle}>
                <FaBox /> Produits de la Commande
              </h3>
              <div className={styles.produitsStats}>
                {[
                  { value: totals.totalArticles, label: 'Articles', icon: <FaBoxes />, color: 'primary' },
                  { value: totals.totalRecu, label: 'Reçus', icon: <IoCheckmarkCircleOutline />, color: 'success' },
                  { value: totals.totalRestant, label: 'En attente', icon: <IoTimeOutline />, color: 'warning' },
                  { value: `${totals.progress.toFixed(1)}%`, label: 'Complétion', icon: <FaPercentage />, color: 'info' }
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className={styles.statCardSmall}
                  >
                    <div className={`${styles.statIconSmall} ${styles[stat.color]}`}>
                      {stat.icon}
                    </div>
                    <div className={styles.statContentSmall}>
                      <div className={styles.statValueSmall}>{stat.value}</div>
                      <div className={styles.statLabelSmall}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.tableContainer}>
              <Table 
                columns={produitsColumns}
                data={commande.produits}
                className={styles.produitsTable}
                striped={true}
                hoverEffect={true}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
            
            <div className={styles.totalsSection}>
              <h4 className={styles.totalsTitle}>Totaux</h4>
              <div className={styles.totalsGrid}>
                {[
                  { label: 'Total HT:', value: formatCurrency(commande.montantHT) },
                  { label: 'TVA:', value: formatCurrency(commande.tva || 0) },
                  { label: 'Frais livraison:', value: formatCurrency(commande.fraisLivraison || 0) },
                  { label: 'Remise:', value: formatCurrency(commande.remise || 0) },
                  { label: 'Total TTC:', value: formatCurrency(commande.montant), isTotal: true }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className={styles.totalItem}
                  >
                    <span className={styles.totalLabel}>{item.label}</span>
                    <span className={`${styles.totalValue} ${item.isTotal ? styles.totalTTC : ''}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'suivi':
        return (
          <div className={styles.tabContent}>
            <div className={styles.suiviHeader}>
              <h3 className={styles.sectionTitle}>
                <FaShippingFast /> Suivi de la Commande
              </h3>
              <div className={styles.suiviStatus}>
                <span 
                  className={styles.statusBadge}
                  style={{ 
                    backgroundColor: `${getStatusColor(commande.statut)}20`,
                    color: getStatusColor(commande.statut),
                    border: `2px solid ${getStatusColor(commande.statut)}40`
                  }}
                >
                  {getStatusIcon(commande.statut)}
                  {commande.statut}
                </span>
                <div className={styles.suiviDates}>
                  <span className={styles.dateItem}>
                    <IoCalendarOutline /> Créée: {formatDateShort(commande.date)}
                  </span>
                  <span className={styles.dateItem}>
                    <TbCalendarTime /> Livraison: {formatDateShort(commande.dateLivraison)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={styles.timelineContainer}>
              <h4 className={styles.timelineTitle}>Historique des Événements</h4>
              <div className={styles.timeline}>
                {commande.historique.map((event, index) => (
                  <div 
                    key={event.id}
                    className={styles.timelineItem}
                  >
                    <div className={styles.timelineDot}>
                      <div className={styles.dotIcon}>
                        {event.type === 'creation' && <IoReceiptOutline />}
                        {event.type === 'validation' && <IoCheckmarkCircleOutline />}
                        {event.type === 'paiement' && <GiCash />}
                        {event.type === 'preparation' && <FaBox />}
                        {event.type === 'expedition' && <FaTruck />}
                      </div>
                      {index < commande.historique.length - 1 && (
                        <div className={styles.timelineConnector} />
                      )}
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <h5 className={styles.eventTitle}>{event.description}</h5>
                        <span className={styles.eventTime}>{formatDate(event.date)}</span>
                      </div>
                      <div className={styles.eventDetails}>
                        <span className={styles.eventUser}>
                          <FaUser /> {event.utilisateur}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.suiviActions}>
              <h4 className={styles.actionsTitle}>Actions de Suivi</h4>
              <div className={styles.actionButtons}>
                <Button 
                  variant="primary"
                  size="medium"
                  icon="check"
                  onClick={handleValidate}
                  className={styles.actionButton}
                  disabled={commande.statut === 'annulée' || commande.typeCommande === COMMANDE_TYPES.VALIDEE}
                >
                  Valider quantités
                </Button>
                <Button 
                  variant="outline"
                  size="medium"
                  icon="email"
                  onClick={() => {}}
                  className={styles.actionButton}
                >
                  Envoyer notification
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'client':
        return (
          <div className={styles.tabContent}>
            <div className={styles.clientHeader}>
              <h3 className={styles.sectionTitle}>
                <FaUser /> Informations Client
              </h3>
              <Button 
                variant="outline"
                size="medium"
                icon="external"
                onClick={() => navigate(`/clients/${commande.clientId}`)}
              >
                Voir profil complet
              </Button>
            </div>
            
            <div className={styles.clientGrid}>
              {[
                {
                  title: 'Informations générales',
                  icon: <IoPersonOutline />,
                  items: [
                    { label: 'Nom:', value: commande.clientInfo.nom, icon: <FaUser /> },
                    { label: 'Type:', value: commande.clientInfo.type, icon: commande.clientInfo.type === 'Entreprise' ? <FaBuilding /> : <FaUser /> },
                    { label: 'Contact:', value: commande.clientInfo.contact, icon: <FaUserTie /> },
                    { label: 'Téléphone:', value: commande.clientInfo.telephone, icon: <FaPhone /> },
                    { label: 'Email:', value: commande.clientInfo.email, icon: <IoMailOutline /> }
                  ]
                },
                {
                  title: 'Adresses',
                  icon: <FaMapMarkerAlt />,
                  items: [
                    { label: 'Facturation:', value: commande.clientInfo.adresseFacturation, icon: <FaHome /> },
                    { label: 'Livraison:', value: commande.clientInfo.adresseLivraison, icon: <FaTruck /> }
                  ]
                },
                {
                  title: 'Informations financières',
                  icon: <FaFileInvoiceDollar />,
                  items: [
                    { label: 'SIRET:', value: commande.clientInfo.siret, icon: <FaIdCard /> },
                    { label: 'N° TVA:', value: commande.clientInfo.tva, icon: <TbReceiptTax /> },
                    { label: 'Solde:', value: formatCurrency(commande.clientInfo.solde), icon: <GiCash /> },
                    { label: 'Crédit:', value: formatCurrency(commande.clientInfo.credit), icon: <GiReceiveMoney /> }
                  ]
                },
                {
                  title: 'Historique',
                  icon: <FaHistory />,
                  items: [
                    { label: 'Dernière commande:', value: formatDateShort(commande.clientInfo.derniereCommande), icon: <IoCalendarOutline /> }
                  ]
                }
              ].map((section, index) => (
                <div 
                  key={index}
                  className={styles.clientSection}
                >
                  <h4 className={styles.subSectionTitle}>
                    {section.icon} {section.title}
                  </h4>
                  <div className={styles.infoList}>
                    {section.items.map((item, idx) => (
                      <div key={idx} className={styles.infoItem}>
                        <span className={styles.infoLabel}>{item.label}</span>
                        <span className={styles.infoValue}>
                          {item.icon} {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.clientNotes}>
              <h4 className={styles.notesTitle}>
                <IoInformationCircleOutline /> Notes client
              </h4>
              <div className={styles.notesContent}>
                {commande.notes || 'Aucune note spécifique pour ce client.'}
              </div>
            </div>
          </div>
        );
        
      case 'facturation':
        return (
          <div className={styles.tabContent}>
            <div className={styles.facturationHeader}>
              <h3 className={styles.sectionTitle}>
                <FaFileInvoiceDollar /> Facturation
              </h3>
              <div className={styles.facturationStats}>
                <span className={styles.factureStat}>
                  <TbFileInvoice /> {commande.factures.length} facture(s)
                </span>
                <span className={styles.factureStat}>
                  {commande.paiement === 'payée' ? 
                    <IoCheckmarkCircleOutline /> : 
                    <IoTimeOutline />} 
                  {commande.paiement}
                </span>
              </div>
            </div>
            
            <div className={styles.facturesGrid}>
              {commande.factures.map((facture) => (
                <div 
                  key={facture.id}
                  className={styles.factureCard}
                >
                  <div className={styles.factureHeader}>
                    <div className={styles.factureInfo}>
                      <div className={styles.factureNumero}>
                        <TbFileInvoice />
                        <h4>{facture.numero}</h4>
                      </div>
                      <span className={`${styles.factureStatut} ${styles[facture.statut]}`}>
                        {facture.statut}
                      </span>
                    </div>
                    <div className={styles.factureMontant}>
                      {formatCurrency(facture.montant)}
                    </div>
                  </div>
                  <div className={styles.factureBody}>
                    <div className={styles.factureDetail}>
                      <span className={styles.detailLabel}>Date:</span>
                      <span className={styles.detailValue}>{formatDateShort(facture.date)}</span>
                    </div>
                    <div className={styles.factureDetail}>
                      <span className={styles.detailLabel}>Commande:</span>
                      <span className={styles.detailValue}>{commande.numero}</span>
                    </div>
                    <div className={styles.factureDetail}>
                      <span className={styles.detailLabel}>Client:</span>
                      <span className={styles.detailValue}>{commande.client}</span>
                    </div>
                  </div>
                  <div className={styles.factureActions}>
                    <Button 
                      variant="ghost"
                      size="small"
                      icon="eye"
                      onClick={() => {}}
                      className={styles.factureButton}
                    >
                      Voir
                    </Button>
                    <Button 
                      variant="ghost"
                      size="small"
                      icon="print"
                      onClick={() => {}}
                      className={styles.factureButton}
                    >
                      Imprimer
                    </Button>
                  </div>
                </div>
              ))}
              
              {commande.factures.length === 0 && (
                <div className={styles.noFactures}>
                  <TbFileX />
                  <p>Aucune facture associée</p>
                  <small>Créez une facture pour cette commande</small>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="add"
                    onClick={() => {}}
                    className={styles.createFactureButton}
                  >
                    Créer une facture
                  </Button>
                </div>
              )}
            </div>
            
            <div className={styles.facturationDetails}>
              <h4 className={styles.detailsTitle}>Détails financiers</h4>
              <div className={styles.detailsGrid}>
                {[
                  { label: 'Montant total', value: formatCurrency(commande.montant), icon: <GiCash /> },
                  { label: 'TVA', value: formatCurrency(commande.tva || 0), icon: <TbReceiptTax /> },
                  { label: 'Remise', value: commande.remise ? `${formatCurrency(commande.remise)} (${commande.remise}%)` : 'Aucune', icon: <TbDiscount /> },
                  { label: 'Frais livraison', value: formatCurrency(commande.fraisLivraison || 0), icon: <FaTruck /> }
                ].map((detail, index) => (
                  <div 
                    key={index}
                    className={styles.detailCard}
                  >
                    <div className={styles.detailIcon}>
                      {detail.icon}
                    </div>
                    <div className={styles.detailContent}>
                      <h5 className={styles.detailLabel}>{detail.label}</h5>
                      <div className={styles.detailValue}>{detail.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!commande) {
    return (
      <div className={styles.errorContainer}>
        <IoWarningOutline />
        <h3>Commande non trouvée</h3>
        <p>La commande demandée n'existe pas ou a été supprimée.</p>
        <Button
          variant="primary"
          icon="arrowBack"
          onClick={() => navigate('/commandesAdmin')}
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailWrapper}>
        {/* Header avec navigation */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <div className={styles.headerNavigation}>
              <Button
                variant="ghost"
                size="small"
                icon="back"
                onClick={() => navigate('/commandesAdmin')}
                className={styles.backButton}
              >
                Retour
              </Button>
              
              <button 
                className={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu mobile"
              >
                <TbDotsVertical />
              </button>
            </div>
            
            <nav className={styles.headerBreadcrumbs} aria-label="Fil d'Ariane">
              <Breadcrumbs aria-label="breadcrumb" separator={<FaChevronRight />}>
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
                  label="Détails Commande"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </nav>

            <div className={styles.commandeHeader}>
              <div className={styles.headerActions}>
                <div className={styles.quickActions}>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="print"
                    onClick={handlePrint}
                    className={styles.quickAction}
                  >
                    <span className={styles.quickActionText}>Imprimer</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="download"
                    onClick={handleExport}
                    className={styles.quickAction}
                  >
                    <span className={styles.quickActionText}>Exporter</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="copy"
                    onClick={handleDuplicate}
                    className={styles.quickAction}
                  >
                    <span className={styles.quickActionText}>Dupliquer</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    icon="trash"
                    onClick={() => setShowDeleteModal(true)}
                    className={styles.quickAction}
                  >
                    <span className={styles.quickActionText}>Supprimer</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.headerContent}>
              <div className={styles.commandeTitle}>
                <div className={styles.titleRow}>
                  <div className={styles.commandeIcon}>
                    <IoReceiptOutline />
                  </div>
                  <div className={styles.commandeInfo}>
                    <h1 className={styles.commandeNumero}>{commande.numero}</h1>
                    <div className={styles.commandeMeta}>
                      <span className={styles.commandeClient}>
                        <FaUser /> {commande.client}
                      </span>
                      <span className={styles.commandeDate}>
                        <IoCalendarOutline /> {formatDateShort(commande.date)}
                      </span>
                      <span 
                        className={styles.commandeStatut}
                        style={{ 
                          backgroundColor: `${getStatusColor(commande.statut)}20`,
                          color: getStatusColor(commande.statut)
                        }}
                      >
                        {getStatusIcon(commande.statut)}
                        {commande.statut}
                      </span>
                      <span 
                        className={styles.commandeType}
                        style={{ 
                          backgroundColor: `${getStatusColor(commande.typeCommande)}20`,
                          color: getStatusColor(commande.typeCommande)
                        }}
                      >
                        {commande.typeCommande === COMMANDE_TYPES.EN_COURS ? 'En cours' :
                         commande.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE ? 'Arrivée partielle' :
                         commande.typeCommande === COMMANDE_TYPES.VALIDEE ? 'Validée' : commande.typeCommande}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.commandeStats}>
                  {[
                    { value: commande.articles, label: 'Articles', icon: <FaBox /> },
                    { value: commande.produits.length, label: 'Produits', icon: <TbPackage /> },
                    { value: formatCurrency(commande.montant), label: 'Total', icon: <GiCash />, isAmount: true },
                    { value: `${totals.progress.toFixed(0)}%`, label: 'Complétion', icon: <FaPercentage /> }
                  ].map((stat, index) => (
                    <div 
                      key={index}
                      className={styles.statItem}
                    >
                      <div className={`${styles.statValue} ${stat.isAmount ? styles.montant : ''}`}>
                        {stat.value}
                      </div>
                      <div className={styles.statLabel}>
                        {stat.icon} {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>
        </header>

        {!isMobileMenuOpen ? (
          <div className={styles.mainActions}>
            <Button
              variant="primary"
              size="medium"
              icon="edit"
              onClick={handleEdit}
              className={styles.actionButton}
            >
              Modifier
            </Button>
            <Button
              variant="success"
              size="medium"
              icon="check"
              onClick={handleValidate}
              className={styles.actionButton}
              disabled={commande.statut === 'annulée' || commande.typeCommande === COMMANDE_TYPES.VALIDEE}
            >
              Valider quantités
            </Button>
            <Button
              variant="warning"
              size="medium"
              icon="close"
              onClick={handleCancel}
              className={styles.actionButton}
              disabled={commande.statut === 'annulée' || commande.typeCommande === COMMANDE_TYPES.VALIDEE}
            >
              Annuler
            </Button>
          </div>
        ) : (
          <div className={styles.mobileActions}>
            <Button
              variant="ghost"
              size="small"
              icon="edit"
              onClick={handleEdit}
              className={styles.mobileAction}
            >
              Modifier
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="check"
              onClick={handleValidate}
              className={styles.mobileAction}
            >
              Valider
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="cancel"
              onClick={handleCancel}
              className={styles.mobileAction}
            >
              Annuler
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon="trash"
              onClick={() => setShowDeleteModal(true)}
              className={styles.mobileAction}
            >
              Supprimer
            </Button>
          </div>
        )}
        
        {/* Onglets */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Contenu des onglets */}
        <main className={styles.mainContent}>
          {renderTabContent()}
        </main>
        
        {/* Informations supplémentaires */}
        <div className={styles.additionalInfo}>
          {[
            {
              title: 'Responsables',
              icon: <FaUserTie />,
              items: [
                { label: 'Vendeur:', value: commande.vendeur, icon: <FaUserTie /> },
                { label: 'Créée par:', value: commande.creerPar }
              ]
            },
            {
              title: 'Livraison',
              icon: <FaShippingFast />,
              items: [
                { label: 'Date prévue:', value: formatDateShort(commande.dateLivraison) },
                { label: 'Type:', value: commande.typeLivraison === 'livraison' ? 'Livraison' : 'À emporter' },
                ...(commande.transporteur ? [{ label: 'Transporteur:', value: commande.transporteur }] : [])
              ]
            },
            {
              title: 'Paiement',
              icon: <FaMoneyBillWave />,
              items: [
                { label: 'Statut:', value: commande.paiement, className: styles[commande.paiement] },
                { label: 'Mode:', value: commande.modePaiement },
                { label: 'Montant:', value: formatCurrency(commande.montant), className: styles.montant }
              ]
            }
          ].map((card, index) => (
            <div 
              key={index}
              className={styles.infoCard}
            >
              <h4 className={styles.infoTitle}>
                {card.icon} {card.title}
              </h4>
              <div className={styles.cardContent}>
                {card.items.map((item, idx) => (
                  <div key={idx} className={styles.cardItem}>
                    <span className={styles.cardLabel}>{item.label}</span>
                    <span className={`${styles.cardValue} ${item.className || ''}`}>
                      {item.icon} {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ScrollToTop />
        <Footer />
      </div>

      {/* Modale de suppression */}
      {showDeleteModal && (
        <Modal 
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
        >
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
              <IoAlertCircleOutline />
            </div>
            <h3 className={styles.modalTitle}>Confirmer la suppression</h3>
            <p className={styles.modalText}>
              Êtes-vous sûr de vouloir supprimer la commande <strong>{commande.numero}</strong> ?
              Cette action est irréversible et supprimera toutes les données associées.
            </p>
            <div className={styles.modalActions}>
              <Button 
                variant="outline"
                size="medium"
                onClick={() => setShowDeleteModal(false)}
                className={styles.modalButton}
              >
                Annuler
              </Button>
              <Button 
                variant="danger"
                size="medium"
                onClick={handleDelete}
                className={styles.modalButton}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modale de validation */}
      {showValidationModal && (
        <Modal 
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
          className={styles.validationModal}
        >
          <div className={styles.validationContent}>
            <div className={styles.validationHeader}>
              <h3>
                <IoCheckmarkCircleOutline /> Validation des Quantités
              </h3>
              <p className={styles.validationSubtitle}>
                Commande {commande.numero} - {commande.client}
              </p>
            </div>
            
            <div className={styles.validationBody}>
              <div className={styles.quantitesList}>
                <h4>Quantités reçues</h4>
                {commande.produits.map((produit) => (
                  <div 
                    key={produit.id}
                    className={styles.quantiteItem}
                  >
                    <div className={styles.produitInfoValidation}>
                      <div className={styles.produitNom}>{produit.nom}</div>
                      <div className={styles.produitDetails}>
                        <span>Commande: {produit.qty} {produit.unite || 'unité'}</span>
                        <span>Déjà reçu: {produit.qtyRecue || 0}</span>
                      </div>
                    </div>
                    <div className={styles.quantiteInputGroup}>
                      <input
                        type="number"
                        min="0"
                        max={produit.qty}
                        value={quantities[produit.id] || 0}
                        onChange={(e) => setQuantities(prev => ({
                          ...prev,
                          [produit.id]: parseInt(e.target.value) || 0
                        }))}
                        className={styles.quantiteInput}
                      />
                      <div className={styles.quantiteControls}>
                        <button
                          type="button"
                          onClick={() => setQuantities(prev => ({
                            ...prev,
                            [produit.id]: Math.min((prev[produit.id] || 0) + 1, produit.qty)
                          }))}
                          className={styles.quantiteBtn}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuantities(prev => ({
                            ...prev,
                            [produit.id]: Math.max((prev[produit.id] || 0) - 1, 0)
                          }))}
                          className={styles.quantiteBtn}
                        >
                          -
                        </button>
                      </div>
                      <span className={styles.quantiteUnite}>{produit.unite || 'unité'}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.validationNotes}>
                <label htmlFor="validationNotes">Notes (optionnel)</label>
                <InputTextarea
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder="Ajoutez des notes sur cette validation..."
                  rows={3}
                  fullWidth
                />
              </div>
              
              <div className={styles.validationSummary}>
                {[
                  { label: 'Total commandé:', value: `${totals.totalArticles} articles` },
                  { label: 'Total reçu:', value: `${Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0)} articles` },
                  { label: 'En attente:', value: `${totals.totalArticles - Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0)} articles` }
                ].map((item, index) => (
                  <div key={index} className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{item.label}</span>
                    <span className={styles.summaryValue}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.validationFooter}>
              <Button 
                variant="outline"
                size="medium"
                onClick={() => setShowValidationModal(false)}
                className={styles.validationButton}
              >
                Annuler
              </Button>
              <Button 
                variant="primary"
                size="medium"
                onClick={handleValidationSubmit}
                className={styles.validationButton}
              >
                Valider les quantités
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          position="top-right"
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}
    </div>
  );
};

export default DetailCommandes;