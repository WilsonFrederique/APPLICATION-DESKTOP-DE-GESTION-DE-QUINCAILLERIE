import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styles from './DetailUtilisateurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from '../../../components/Button/Button';
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareOutline,
  IoMailOutline,
  IoCallOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoBusinessOutline,
  IoShieldCheckmarkOutline,
  IoKeyOutline,
  IoStatsChartOutline,
  IoNotificationsOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoLogOutOutline,
  IoDuplicateOutline,
  IoSettingsOutline,
  IoLockClosedOutline,
  IoLockOpenOutline
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
  FaTachometerAlt,
  FaMoneyBillWave,
  FaCertificate
} from "react-icons/fa";
import { TbUserStar, TbUserExclamation, TbCertificate, TbCurrencyDollar } from "react-icons/tb";
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
const mockUser = {
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
  notes: 'Administrateur principal avec accès complet au système. Responsable de la maintenance et de la configuration.',
  poste: 'Administrateur système',
  salaire: 1500000,
  dateEmbauche: '2024-01-15',
  adresse: 'Lotissement ABC, Tanjombato',
  ville: 'Antananarivo',
  codePostal: '101',
  pays: 'Madagascar',
  langue: 'fr',
  fuseauHoraire: 'UTC+3',
  formatDate: 'DD/MM/YYYY',
  notificationsEmail: true,
  notificationsSMS: false,
  notificationsPush: true,
  signature: 'Jean Rakoto\nAdministrateur système\nQuincaillerie Malagasy',
  creerPar: 'System Admin',
  derniereModification: '2024-03-25T10:30:00',
  historiqueActions: [
    {
      id: 1,
      type: 'login',
      description: 'Connexion au système',
      date: '2024-03-20T14:30:00',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      type: 'update',
      description: 'Mise à jour du produit "Ciment 50kg"',
      date: '2024-03-19T11:20:00',
      ip: '192.168.1.100'
    },
    {
      id: 3,
      type: 'create',
      description: 'Création d\'une nouvelle vente',
      date: '2024-03-18T15:45:00',
      ip: '192.168.1.100'
    },
    {
      id: 4,
      type: 'login',
      description: 'Connexion au système',
      date: '2024-03-17T09:15:00',
      ip: '192.168.1.100'
    },
    {
      id: 5,
      type: 'export',
      description: 'Export des données clients',
      date: '2024-03-16T16:30:00',
      ip: '192.168.1.100'
    }
  ],
  statistiques: {
    ventesMois: 124,
    ventesTotal: 1568,
    valeurVentesMois: 12500000,
    clientsAjoutes: 24,
    produitsGeres: 156,
    connexionsMois: 45
  }
};

const DetailUtilisateurs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

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

  // Charger les données de l'utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let userData = null;
        
        if (location.state?.userData) {
          userData = location.state.userData;
        } else if (id) {
          const userId = parseInt(id);
          // Pour la démonstration, utiliser le mock user
          userData = userId === 1 ? mockUser : null;
        }
        
        if (userData) {
          setUser(userData);
        } else {
          console.error('Utilisateur non trouvé');
          alert('Utilisateur non trouvé');
          navigate('/utilisateursAdmin');
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        alert('Erreur lors du chargement de l\'utilisateur');
        navigate('/utilisateursAdmin');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [id, location.state, navigate]);

  // Gérer l'édition
  const handleEdit = () => {
    navigate(`/frmUtilisateursAdmin/${id}`, {
      state: { userData: user }
    });
  };

  // Gérer la suppression
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user?.nom}" ?`)) {
      alert('Utilisateur supprimé (simulation)');
      navigate('/utilisateursAdmin');
    }
  };

  // Gérer le changement de statut
  const handleToggleStatus = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir ${user?.isActive ? 'désactiver' : 'activer'} l'utilisateur "${user?.nom}" ?`)) {
      setUser(prev => ({
        ...prev,
        isActive: !prev.isActive
      }));
      alert(`Utilisateur ${user?.isActive ? 'désactivé' : 'activé'} avec succès`);
    }
  };

  // Réinitialiser le mot de passe
  const handleResetPassword = () => {
    const newPassword = Math.random().toString(36).slice(-8);
    if (window.confirm(`Réinitialiser le mot de passe de ${user?.nom} ?\nNouveau mot de passe: ${newPassword}\n\nCopier ce mot de passe et le communiquer à l'utilisateur.`)) {
      alert(`Mot de passe réinitialisé pour ${user?.nom}`);
    }
  };

  // Tabs disponibles
  const tabs = [
    { id: 'info', label: 'Informations', icon: <IoPersonOutline /> },
    { id: 'permissions', label: 'Permissions', icon: <IoShieldCheckmarkOutline /> },
    { id: 'activity', label: 'Activité', icon: <IoStatsChartOutline /> },
    { id: 'stats', label: 'Statistiques', icon: <FaChartLine /> }
  ];

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    if (!user) return null;

    switch(activeTab) {
      case 'info':
        return (
          <div className={styles.tabContent}>
            <div className={styles.infoGrid}>
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoPersonOutline /> Informations Personnelles
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Nom complet:</span>
                    <span className={styles.infoValue}>{user.nom}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>
                      <a href={`mailto:${user.email}`} className={styles.emailLink}>
                        <IoMailOutline /> {user.email}
                      </a>
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Téléphone:</span>
                    <span className={styles.infoValue}>
                      <a href={`tel:${user.telephone}`} className={styles.phoneLink}>
                        <IoCallOutline /> {user.telephone}
                      </a>
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Identifiant:</span>
                    <span className={styles.infoValue}>
                      <FaIdCard /> {user.identifiant}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Rôle:</span>
                    <span className={styles.infoValue}>
                      <FaUserTie /> {user.role}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Poste:</span>
                    <span className={styles.infoValue}>
                      <IoBusinessOutline /> {user.poste}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Salaire:</span>
                    <span className={styles.infoValue}>
                      <TbCurrencyDollar /> {formatCurrency(user.salaire || 0)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoLocationOutline /> Adresse
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Adresse:</span>
                    <span className={styles.infoValue}>{user.adresse || 'Non renseignée'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ville:</span>
                    <span className={styles.infoValue}>{user.ville || 'Non renseignée'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Code postal:</span>
                    <span className={styles.infoValue}>{user.codePostal || 'Non renseigné'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Pays:</span>
                    <span className={styles.infoValue}>{user.pays || 'Non renseigné'}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoShieldCheckmarkOutline /> Sécurité & Statut
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Statut du compte:</span>
                    <span className={`${styles.infoValue} ${user.isActive ? styles.active : styles.inactive}`}>
                      {user.isActive ? (
                        <>
                          <IoCheckmarkCircleOutline /> Actif
                        </>
                      ) : (
                        <>
                          <IoCloseCircleOutline /> Inactif
                        </>
                      )}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date de création:</span>
                    <span className={styles.infoValue}>
                      <IoCalendarOutline /> {formatDateShort(user.dateCreation)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date d'embauche:</span>
                    <span className={styles.infoValue}>
                      <IoCalendarOutline /> {formatDateShort(user.dateEmbauche)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Dernière connexion:</span>
                    <span className={styles.infoValue}>
                      <IoTimeOutline /> {user.derniereConnexion ? formatDate(user.derniereConnexion) : 'Jamais'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Dernière modification:</span>
                    <span className={styles.infoValue}>
                      <IoTimeOutline /> {formatDate(user.derniereModification)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Créé par:</span>
                    <span className={styles.infoValue}>{user.creerPar || 'System'}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.infoSection}>
                <h3 className={styles.sectionTitle}>
                  <IoSettingsOutline /> Préférences
                </h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Langue:</span>
                    <span className={styles.infoValue}>
                      {user.langue === 'fr' ? 'Français' : 
                       user.langue === 'mg' ? 'Malagasy' : 'English'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Fuseau horaire:</span>
                    <span className={styles.infoValue}>{user.fuseauHoraire}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Format de date:</span>
                    <span className={styles.infoValue}>{user.formatDate}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Notifications:</span>
                    <span className={styles.infoValue}>
                      {[
                        user.notificationsEmail && 'Email',
                        user.notificationsSMS && 'SMS',
                        user.notificationsPush && 'Push'
                      ].filter(Boolean).join(', ') || 'Aucune'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {user.notes && (
              <div className={styles.notesSection}>
                <h3 className={styles.sectionTitle}>
                  <IoInformationCircleOutline /> Notes
                </h3>
                <div className={styles.notesContent}>
                  {user.notes}
                </div>
              </div>
            )}
            
            {user.signature && (
              <div className={styles.signatureSection}>
                <h3 className={styles.sectionTitle}>
                  <IoPencilOutline /> Signature
                </h3>
                <div className={styles.signatureContent}>
                  <pre>{user.signature}</pre>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'permissions':
        return (
          <div className={styles.tabContent}>
            <div className={styles.permissionsHeader}>
              <h3 className={styles.sectionTitle}>
                <IoShieldCheckmarkOutline /> Permissions Accordées
              </h3>
              <div className={styles.permissionsCount}>
                {user.permissions?.length || 0} permission{user.permissions?.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            {user.permissions && user.permissions.length > 0 ? (
              <div className={styles.permissionsGrid}>
                {user.permissions.map((permission, index) => (
                  <div key={index} className={styles.permissionCard}>
                    <div className={styles.permissionIcon}>
                      <IoShieldCheckmarkOutline />
                    </div>
                    <div className={styles.permissionContent}>
                      <h4 className={styles.permissionTitle}>{permission}</h4>
                      <p className={styles.permissionDescription}>
                        Accès complet à cette fonctionnalité
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noPermissions}>
                <IoWarningOutline />
                <p>Aucune permission attribuée à cet utilisateur</p>
                <small>L'utilisateur ne pourra pas accéder aux fonctionnalités du système</small>
              </div>
            )}
            
            <div className={styles.permissionsNote}>
              <IoInformationCircleOutline />
              <span>
                Les permissions définissent les actions que l'utilisateur peut effectuer dans le système.
                Pour modifier les permissions, cliquez sur "Modifier".
              </span>
            </div>
          </div>
        );
        
      case 'activity':
        return (
          <div className={styles.tabContent}>
            <div className={styles.activityHeader}>
              <h3 className={styles.sectionTitle}>
                <IoStatsChartOutline /> Historique des Activités
              </h3>
              <div className={styles.activityStats}>
                <div className={styles.activityStat}>
                  <span className={styles.statLabel}>Dernière connexion:</span>
                  <span className={styles.statValue}>
                    {user.derniereConnexion ? formatDate(user.derniereConnexion) : 'Jamais'}
                  </span>
                </div>
                <div className={styles.activityStat}>
                  <span className={styles.statLabel}>Total connexions (mois):</span>
                  <span className={styles.statValue}>
                    {user.statistiques?.connexionsMois || 0}
                  </span>
                </div>
              </div>
            </div>
            
            {user.historiqueActions && user.historiqueActions.length > 0 ? (
              <div className={styles.activityList}>
                {user.historiqueActions.map((action) => (
                  <div key={action.id} className={styles.activityItem}>
                    <div className={styles.activityIcon}>
                      {action.type === 'login' && <IoLogOutOutline />}
                      {action.type === 'logout' && <IoLogOutOutline />}
                      {action.type === 'create' && <IoAddOutline />}
                      {action.type === 'update' && <IoPencilOutline />}
                      {action.type === 'delete' && <IoTrashOutline />}
                      {action.type === 'export' && <IoDownloadOutline />}
                      {action.type === 'import' && <IoCloudUploadOutline />}
                    </div>
                    <div className={styles.activityContent}>
                      <div className={styles.activityHeaderRow}>
                        <h4 className={styles.activityTitle}>{action.description}</h4>
                        <span className={styles.activityTime}>{formatDate(action.date)}</span>
                      </div>
                      <div className={styles.activityDetails}>
                        <span className={styles.activityType}>{action.type}</span>
                        {action.ip && (
                          <span className={styles.activityIP}>
                            <IoGlobeOutline /> {action.ip}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noActivity}>
                <IoTimeOutline />
                <p>Aucune activité récente</p>
                <small>L'utilisateur n'a pas encore effectué d'actions dans le système</small>
              </div>
            )}
            
            <div className={styles.activityNote}>
              <IoInformationCircleOutline />
              <span>
                L'historique des activités est conservé pendant 90 jours.
                Pour un historique complet, consultez les logs d'audit.
              </span>
            </div>
          </div>
        );
        
      case 'stats':
        return (
          <div className={styles.tabContent}>
            <div className={styles.statsHeader}>
              <h3 className={styles.sectionTitle}>
                <FaChartLine /> Statistiques de Performance
              </h3>
              <div className={styles.statsPeriod}>
                <span className={styles.periodLabel}>Période:</span>
                <span className={styles.periodValue}>30 derniers jours</span>
              </div>
            </div>
            
            {user.statistiques ? (
              <>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FaMoneyBillWave />
                    </div>
                    <div className={styles.statContent}>
                      <h4 className={styles.statTitle}>Ventes ce mois</h4>
                      <div className={styles.statValueLarge}>{user.statistiques.ventesMois}</div>
                      <div className={styles.statSubtitle}>
                        {formatCurrency(user.statistiques.valeurVentesMois)}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FaUsers />
                    </div>
                    <div className={styles.statContent}>
                      <h4 className={styles.statTitle}>Clients ajoutés</h4>
                      <div className={styles.statValueLarge}>{user.statistiques.clientsAjoutes}</div>
                      <div className={styles.statSubtitle}>Ce mois</div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <FaTachometerAlt />
                    </div>
                    <div className={styles.statContent}>
                      <h4 className={styles.statTitle}>Produits gérés</h4>
                      <div className={styles.statValueLarge}>{user.statistiques.produitsGeres}</div>
                      <div className={styles.statSubtitle}>Au total</div>
                    </div>
                  </div>
                  
                  <div className={styles.statCard}>
                    <div className={styles.statIcon}>
                      <IoStatsChartOutline />
                    </div>
                    <div className={styles.statContent}>
                      <h4 className={styles.statTitle}>Connexions</h4>
                      <div className={styles.statValueLarge}>{user.statistiques.connexionsMois}</div>
                      <div className={styles.statSubtitle}>Ce mois</div>
                    </div>
                  </div>
                </div>
                
                <div className={styles.statsSummary}>
                  <h4 className={styles.summaryTitle}>Résumé des Performances</h4>
                  <div className={styles.summaryContent}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Total ventes:</span>
                      <span className={styles.summaryValue}>{user.statistiques.ventesTotal}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Valeur moyenne/vente:</span>
                      <span className={styles.summaryValue}>
                        {formatCurrency(user.statistiques.valeurVentesMois / (user.statistiques.ventesMois || 1))}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Performance:</span>
                      <span className={`${styles.summaryValue} ${styles.highPerformance}`}>
                        Excellente
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={styles.noStats}>
                <IoStatsChartOutline />
                <p>Aucune statistique disponible</p>
                <small>Les statistiques seront disponibles après les premières actions de l'utilisateur</small>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement des détails de l'utilisateur...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <IoWarningOutline />
        <h3>Utilisateur non trouvé</h3>
        <p>L'utilisateur demandé n'existe pas ou a été supprimé.</p>
        <Button
          variant="primary"
          icon="arrowBack"
          onClick={() => navigate('/utilisateursAdmin')}
        >
          Retour à la liste
        </Button>
      </div>
    );
  }

  // Calculer l'avatar couleur
  const getAvatarColor = (name) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailWrapper}>
        {/* Header avec navigation */}
        <header className={styles.detailHeader}>
          <div className={styles.headerTop}>
            <Button
              variant="outline"
              size="small"
              icon="back"
              onClick={() => navigate('/utilisateursAdmin')}
              className={styles.backButton}
            >
              Retour
            </Button>
            
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
                  label="Détails Utilisateur"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </nav>
          </div>
          
          <div className={styles.headerContent}>
            <div className={styles.userHeader}>
              <div className={styles.userAvatarLarge}>
                <div 
                  className={styles.avatarCircle}
                  style={{ 
                    background: `linear-gradient(135deg, ${getAvatarColor(user.nom)}, ${getAvatarColor(user.nom + '2')})`
                  }}
                >
                  {getUserInitials(user.nom)}
                </div>
                <div className={styles.userInfo}>
                  <h1 className={styles.userName}>{user.nom}</h1>
                  <div className={styles.userMeta}>
                    <span className={`${styles.userStatus} ${user.isActive ? styles.active : styles.inactive}`}>
                      {user.isActive ? 'ACTIF' : 'INACTIF'}
                    </span>
                    <span className={styles.userRole}>
                      <FaUserTie /> {user.role}
                    </span>
                    <span className={styles.userId}>
                      <FaIdCard /> ID: {user.id}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.headerActions}>
                <div className={styles.actionGroup}>
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
                    variant="secondary"
                    size="medium"
                    icon="key"
                    onClick={handleResetPassword}
                    className={styles.actionButton}
                  >
                    Réinitialiser MDP
                  </Button>
                  <Button
                    variant={user.isActive ? "warning" : "success"}
                    size="medium"
                    icon={user.isActive ? "lockClosed" : "lockOpen"}
                    onClick={handleToggleStatus}
                    className={styles.actionButton}
                  >
                    {user.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                  <Button
                    variant="danger"
                    size="medium"
                    icon="trash"
                    onClick={handleDelete}
                    className={styles.actionButton}
                  >
                    Supprimer
                  </Button>
                </div>
                
                <div className={styles.quickActions}>
                  <Button
                    variant="outline"
                    size="small"
                    icon="print"
                    onClick={() => window.print()}
                    className={styles.quickAction}
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
                </div>
              </div>
            </div>
          </div>
        </header>
        
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
          <div className={styles.infoCard}>
            <h4 className={styles.infoTitle}>
              <IoInformationCircleOutline /> Informations de contact
            </h4>
            <div className={styles.contactInfo}>
              <a href={`mailto:${user.email}`} className={styles.contactLink}>
                <IoMailOutline /> {user.email}
              </a>
              <a href={`tel:${user.telephone}`} className={styles.contactLink}>
                <IoCallOutline /> {user.telephone || 'Non renseigné'}
              </a>
            </div>
          </div>
          
          <div className={styles.infoCard}>
            <h4 className={styles.infoTitle}>
              <IoCalendarOutline /> Dates importantes
            </h4>
            <div className={styles.datesInfo}>
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Création:</span>
                <span className={styles.dateValue}>{formatDateShort(user.dateCreation)}</span>
              </div>
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Embauche:</span>
                <span className={styles.dateValue}>{formatDateShort(user.dateEmbauche)}</span>
              </div>
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Dernière connexion:</span>
                <span className={styles.dateValue}>
                  {user.derniereConnexion ? formatDateShort(user.derniereConnexion) : 'Jamais'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <ScrollToTop />
        <Footer />
      </div>
    </div>
  );
};

export default DetailUtilisateurs;