import React, { useState, useMemo } from 'react';
import styles from './Utilisateurs.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import Table from '../../../components/Table/Table';
import Button from '../../../components/Button/Button';
import Modal from '../../../components/Modal/Modal';
import Toast from '../../../components/Toast/Toast';
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoLockClosedOutline,
  IoLockOpenOutline,
  IoMailOutline,
  IoPersonOutline,
  IoCallOutline,
  IoKeyOutline,
  IoShieldCheckmarkOutline,
  IoStatsChartOutline,
  IoNotificationsOutline,
  IoLogOutOutline,
  IoDuplicateOutline,
  IoPrintOutline,
  IoShareSocialOutline,
  IoSettingsOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoChevronDownOutline,
  IoEllipsisVerticalOutline,
  IoArrowBackOutline,
  IoArrowForwardOutline
} from "react-icons/io5";
import { 
  FaUsers, 
  FaUserTie, 
  FaUserShield, 
  FaUserCheck,
  FaUserTimes,
  FaChartLine,
  FaIdCard,
  FaBusinessTime
} from "react-icons/fa";
import { TbUserStar, TbUserSearch, TbUserExclamation } from "react-icons/tb";
import { Chip, emphasize, styled } from '@mui/material';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputTextarea from '../../../components/Input/InputTextarea';
import { Link, useNavigate } from 'react-router-dom';

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

// Images d'avatar par défaut
const avatarColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

// Composant de carte utilisateur
const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  onView, 
  onToggleStatus,
  onResetPassword,
  delay = 0 
}) => {
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`${styles.userCard} ${user.isActive ? styles.active : styles.inactive}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.userCardHeader}>
        <div className={styles.userAvatar}>
          <div 
            className={styles.avatarCircle}
            style={{ 
              background: `linear-gradient(135deg, ${getAvatarColor(user.id)}, ${getAvatarColor(user.id + 1)})`
            }}
          >
            {getUserInitials(user.nom)}
          </div>
          <div className={styles.userStatus}>
            <span className={`${styles.statusBadge} ${user.isActive ? styles.active : styles.inactive}`}>
              {user.isActive ? 'ACTIF' : 'INACTIF'}
            </span>
          </div>
        </div>
        
        <div className={styles.userQuickActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => onView(user)}
            title="Voir profil"
            className={styles.iconButton}
          />
          {user.isActive ? (
            <Button 
              variant="warning"
              size="small"
              icon="active"
              onClick={() => onToggleStatus(user)}
              title="Désactiver"
              className={styles.iconButton}
            />
          ) : (
            <Button 
              variant="success"
              size="small"
              icon="inactive"
              onClick={() => onToggleStatus(user)}
              title="Activer"
              className={styles.iconButton}
            />
          )}
          <Button 
            variant="secondary"
            size="small"
            icon="password"
            onClick={() => onResetPassword(user)}
            title="Réinitialiser mot de passe"
            className={styles.iconButton}
          />
        </div>
      </div>
      
      <div className={styles.userCardBody}>
        <div className={styles.userInfo}>
          <h4 className={styles.userName}>{user.nom}</h4>
          <div className={styles.userMeta}>
            <span className={styles.userRole}>
              <FaUserTie /> {user.role}
            </span>
            <span className={styles.userId}>
              <FaIdCard /> ID: {user.identifiant}
            </span>
          </div>
          
          <div className={styles.userContact}>
            <div className={styles.contactItem}>
              <IoMailOutline />
              <span className={styles.contactText}>{user.email}</span>
            </div>
            <div className={styles.contactItem}>
              <IoCallOutline />
              <span className={styles.contactText}>{user.telephone}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.userStats}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <IoCalendarOutline />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Créé le</span>
              <span className={styles.statValue}>{formatDate(user.dateCreation)}</span>
            </div>
          </div>
          
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <IoTimeOutline />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Dernière connexion</span>
              <span className={styles.statValue}>
                {user.derniereConnexion ? formatDate(user.derniereConnexion) : 'Jamais'}
              </span>
            </div>
          </div>
          
          {user.role === 'Vendeur' && (
            <div className={styles.statItem}>
              <div className={styles.statIcon}>
                <IoStatsChartOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Ventes ce mois</span>
                <span className={`${styles.statValue} ${styles.highlight}`}>
                  {user.ventesMois || 0}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.userCardFooter}>
        <div className={styles.userPermissions}>
          <div className={styles.permissionsList}>
            {user.permissions?.slice(0, 3).map((perm, index) => (
              <span key={index} className={styles.permissionTag}>
                {perm}
              </span>
            ))}
            {user.permissions && user.permissions.length > 3 && (
              <span className={styles.morePermissions}>
                +{user.permissions.length - 3}
              </span>
            )}
          </div>
        </div>
        
        <div className={styles.userActions}>
          <Button 
            variant="outline"
            size="small"
            icon="edit"
            onClick={() => onEdit(user)}
            className={styles.actionButton}
          >
            Modifier
          </Button>
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => onDelete(user)}
            className={styles.actionButton}
          />
        </div>
      </div>
    </div>
  );
};

// Composant principal
const Utilisateurs = () => {
  const navigate = useNavigate();
  
  // Données mock pour la démonstration
  const mockUsers = useMemo(() => [
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
      notes: 'Administrateur principal'
    },
    {
      id: 2,
      nom: 'Marie Rasoa',
      email: 'mrasoa@quincaillerie.mg',
      telephone: '+261 33 98 765 43',
      role: 'Vendeur Senior',
      identifiant: 'mrasoa',
      isActive: true,
      dateCreation: '2024-02-10',
      derniereConnexion: '2024-03-20T09:15:00',
      ventesMois: 124,
      permissions: [
        'Accès dashboard',
        'Gestion ventes',
        'Gestion clients',
        'Vue statistiques',
        'Modification prix',
        'Annulation ventes'
      ],
      notes: 'Meilleure vendeuse du mois',
      historiqueActions: [
        {
          type: 'sale',
          description: 'Vente complétée - FAC-2024-00158',
          date: '2024-03-20T09:10:00'
        },
        {
          type: 'login',
          description: 'Connexion au système',
          date: '2024-03-20T08:45:00'
        }
      ]
    },
    {
      id: 3,
      nom: 'Robert Andria',
      email: 'randria@quincaillerie.mg',
      telephone: '+261 34 56 789 01',
      role: 'Vendeur',
      identifiant: 'randria',
      isActive: true,
      dateCreation: '2024-02-25',
      derniereConnexion: '2024-03-19T16:20:00',
      ventesMois: 87,
      permissions: [
        'Accès dashboard',
        'Gestion ventes',
        'Gestion clients',
        'Vue statistiques'
      ],
      notes: 'Nouveau vendeur - en formation',
      historiqueActions: [
        {
          type: 'sale',
          description: 'Vente crédit - CLT-2024-0045',
          date: '2024-03-19T16:15:00'
        }
      ]
    },
    {
      id: 4,
      nom: 'Sarah Niry',
      email: 'sniry@quincaillerie.mg',
      telephone: '+261 32 23 456 78',
      role: 'Gestionnaire Stock',
      identifiant: 'sniry',
      isActive: true,
      dateCreation: '2024-01-20',
      derniereConnexion: '2024-03-18T11:45:00',
      permissions: [
        'Accès dashboard',
        'Gestion stocks',
        'Gestion produits',
        'Gestion fournisseurs',
        'Export données'
      ],
      notes: 'Responsable inventaire',
      historiqueActions: [
        {
          type: 'update',
          description: 'Mise à jour stock - Ciment 50kg',
          date: '2024-03-18T11:30:00'
        }
      ]
    },
    {
      id: 5,
      nom: 'David Rabe',
      email: 'drabe@quincaillerie.mg',
      telephone: '+261 33 34 567 89',
      role: 'Comptable',
      identifiant: 'drabe',
      isActive: false,
      dateCreation: '2024-01-30',
      derniereConnexion: '2024-02-28T15:20:00',
      permissions: [
        'Accès dashboard',
        'Gestion rapports',
        'Export données',
        'Vue statistiques'
      ],
      notes: 'Comptable - congé maladie'
    },
    {
      id: 6,
      nom: 'Lucie Rajoelina',
      email: 'lrajoelina@quincaillerie.mg',
      telephone: '+261 34 45 678 90',
      role: 'Vendeur',
      identifiant: 'lrajoelina',
      isActive: true,
      dateCreation: '2024-03-05',
      derniereConnexion: '2024-03-20T10:05:00',
      ventesMois: 45,
      permissions: [
        'Accès dashboard',
        'Gestion ventes',
        'Gestion clients'
      ],
      notes: 'Stagiaire vendeuse'
    },
    {
      id: 7,
      nom: 'Marc Ravalomanana',
      email: 'mravalo@quincaillerie.mg',
      telephone: '+261 32 67 890 12',
      role: 'Superviseur',
      identifiant: 'mravalo',
      isActive: true,
      dateCreation: '2024-01-10',
      derniereConnexion: '2024-03-20T08:30:00',
      permissions: [
        'Accès dashboard',
        'Gestion ventes',
        'Gestion clients',
        'Gestion stocks',
        'Vue statistiques',
        'Export données',
        'Gestion rapports'
      ],
      notes: 'Superviseur des opérations'
    },
    {
      id: 8,
      nom: 'Sophie Rajaonarivelo',
      email: 'srajaona@quincaillerie.mg',
      role: 'Support Technique',
      identifiant: 'srajaona',
      isActive: true,
      dateCreation: '2024-02-15',
      derniereConnexion: '2024-03-19T14:15:00',
      permissions: [
        'Accès dashboard',
        'Paramètres système',
        'Export données'
      ],
      notes: 'Support IT - accès limité'
    }
  ], []);

  const mockRoles = useMemo(() => [
    { id: 'admin', nom: 'Administrateur' },
    { id: 'superviseur', nom: 'Superviseur' },
    { id: 'vendeur_senior', nom: 'Vendeur Senior' },
    { id: 'vendeur', nom: 'Vendeur' },
    { id: 'stock', nom: 'Gestionnaire Stock' },
    { id: 'comptable', nom: 'Comptable' },
    { id: 'support', nom: 'Support Technique' }
  ], []);

  // États pour les données
  const [users, setUsers] = useState(mockUsers);
  const [roles] = useState(mockRoles);

  // États pour l'interface
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  
  // États pour les toasts
  const [toasts, setToasts] = useState([]);

  // Fonction pour ajouter un toast
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  // Calcul des utilisateurs filtrés avec useMemo
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.identifiant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nom.localeCompare(b.nom);
        case 'recent':
          return new Date(b.dateCreation) - new Date(a.dateCreation);
        case 'active':
          return b.isActive - a.isActive;
        case 'role':
          return a.role.localeCompare(b.role);
        case 'lastLogin':
          if (!a.derniereConnexion && !b.derniereConnexion) return 0;
          if (!a.derniereConnexion) return 1;
          if (!b.derniereConnexion) return -1;
          return new Date(b.derniereConnexion) - new Date(a.derniereConnexion);
        default:
          return 0;
      }
    });

    return filtered;
  }, [users, searchTerm, selectedRole, statusFilter, sortBy]);

  // Calcul des statistiques
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const vendeursCount = users.filter(u => u.role.includes('Vendeur')).length;
    const adminsCount = users.filter(u => u.role === 'Administrateur').length;
    const todayLogin = users.filter(u => {
      if (!u.derniereConnexion) return false;
      const lastLogin = new Date(u.derniereConnexion);
      const today = new Date();
      return lastLogin.toDateString() === today.toDateString();
    }).length;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      vendeursCount,
      adminsCount,
      todayLogin
    };
  }, [users]);

  // Gestion des événements
  const handleEditClick = (user) => {
    navigate(`/frmUtilisateursAdmin/${user.id}`, {
      state: { userData: user }
    });
  };

  const handleViewUser = (user) => {
    navigate(`/detailUtilisateursAdmin/${user.id}`, {
      state: { userData: user }
    });
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${user.nom}" ?`)) {
      setUsers(users.filter(u => u.id !== user.id));
      addToast('Utilisateur supprimé avec succès', 'success');
    }
  };

  const handleToggleStatus = (user) => {
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
    const message = user.isActive 
      ? 'Utilisateur désactivé avec succès' 
      : 'Utilisateur activé avec succès';
    addToast(message, 'success');
  };

  const handleResetPassword = (user) => {
    const newPassword = Math.random().toString(36).slice(-8);
    if (window.confirm(`Réinitialiser le mot de passe de ${user.nom} ?\nNouveau mot de passe: ${newPassword}\n\nCopier ce mot de passe et le communiquer à l'utilisateur.`)) {
      addToast(`Mot de passe réinitialisé pour ${user.nom}`, 'success');
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Nom', 'Email', 'Rôle', 'Identifiant', 'Statut', 'Téléphone', 'Date création', 'Dernière connexion'],
      ...users.map(u => [
        u.nom,
        u.email,
        u.role,
        u.identifiant,
        u.isActive ? 'Actif' : 'Inactif',
        u.telephone || '',
        u.dateCreation,
        u.derniereConnexion || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs-quincaillerie.csv';
    a.click();
    addToast('Export terminé avec succès', 'success');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('all');
    setStatusFilter('all');
    setSortBy('name');
    addToast('Filtres réinitialisés', 'info');
  };

  const handleViewInactive = () => {
    setStatusFilter('inactive');
    addToast('Affichage des utilisateurs inactifs', 'info');
  };

  // Configuration des colonnes pour le tableau
  const tableColumns = [
    {
      label: 'Utilisateur',
      accessor: 'nom',
      render: (row) => (
        <div className={styles.tableUserInfo}>
          <div className={styles.tableUserAvatar}>
            <div 
              className={styles.avatarCircleTable}
              style={{ 
                background: `linear-gradient(135deg, ${getAvatarColor(row.id)}, ${getAvatarColor(row.id + 1)})`
              }}
            >
              {row.nom.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
          <div className={styles.tableUserDetails}>
            <div className={styles.tableUserName}>{row.nom}</div>
            <div className={styles.tableUserMeta}>
              <div className={styles.tableUserEmail}>
                <IoMailOutline size={12} /> {row.email}
              </div>
              <div className={styles.tableUserId}>
                <FaIdCard size={12} /> {row.identifiant}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Rôle',
      accessor: 'role',
      render: (row) => (
        <div className={styles.tableRole}>
          <span className={`${styles.roleBadge} ${row.role.toLowerCase().replace(/\s+/g, '-')}`}>
            {row.role}
          </span>
        </div>
      )
    },
    {
      label: 'Statut',
      accessor: 'isActive',
      align: 'center',
      render: (row) => (
        <div className={styles.tableStatus}>
          <span className={`${styles.statusBadgeTable} ${row.isActive ? styles.active : styles.inactive}`}>
            {row.isActive ? 'ACTIF' : 'INACTIF'}
          </span>
        </div>
      )
    },
    {
      label: 'Dernière connexion',
      accessor: 'derniereConnexion',
      render: (row) => (
        <div className={styles.tableLastLogin}>
          {row.derniereConnexion ? 
            new Date(row.derniereConnexion).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 
            <span className={styles.neverLoggedIn}>Jamais</span>
          }
        </div>
      )
    },
    {
      label: 'Actions',
      accessor: 'actions',
      align: 'center',
      render: (row) => (
        <div className={styles.tableActions}>
          <Button 
            variant="eyebg"
            size="small"
            icon="eye"
            onClick={() => handleViewUser(row)}
            title="Voir détails"
            className={styles.tableActionButton}
          />
          <Button 
            variant="warning"
            size="small"
            icon="edit"
            onClick={() => handleEditClick(row)}
            title="Modifier"
            className={styles.tableActionButton}
          />
          <Button 
            variant="secondary"
            size="small"
            icon="password"
            onClick={() => handleResetPassword(row)}
            title="Réinitialiser mot de passe"
            className={styles.tableActionButton}
          />
          <Button 
            variant={row.isActive ? "warning" : "success"}
            size="small"
            icon={row.isActive ? "active" : "inactive"}
            onClick={() => handleToggleStatus(row)}
            title={row.isActive ? 'Désactiver' : 'Activer'}
            className={styles.tableActionButton}
          />
          <Button 
            variant="danger"
            size="small"
            icon="trash"
            onClick={() => handleDeleteUser(row)}
            title="Supprimer"
            className={styles.tableActionButton}
          />
        </div>
      )
    }
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
                  Gestion des <span className={styles.highlight}>Utilisateurs</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Gérez les accès, permissions et rôles des utilisateurs de votre quincaillerie
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <FaUsers />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.totalUsers}</span>
                  <span className={styles.statLabel}>Utilisateurs</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.success}`}>
                  <FaUserCheck />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.activeUsers}</span>
                  <span className={styles.statLabel}>Actifs</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.warning}`}>
                  <TbUserExclamation />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats.inactiveUsers}</span>
                  <span className={styles.statLabel}>Inactifs</span>
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
                onClick={() => navigate('/dashboardAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Administration"
              />
              <StyledBreadcrumb
                label="Utilisateurs"
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className={styles.dashboardControls}>
          <div className={styles.searchSection}>
            <Input
              type="text"
              placeholder="Rechercher utilisateur, email, identifiant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              name="userSearch"
              icon={<IoSearchOutline />}
              className={styles}
              fullWidth
            />
          </div>
          
          <div className={styles.actionsSection}>
            <Link 
              to="/frmUtilisateursAdmin"
              className={styles.newUserLink}
            >
              <Button 
                variant="primary"
                size="medium"
                icon="add"
                className={styles.actionButton}
              >
                Nouvel Utilisateur
              </Button>
            </Link>
            <Button 
              variant="secondary"
              size="medium"
              icon="download"
              onClick={handleExport}
              className={styles.actionButton}
            >
              Exporter
            </Button>
            <Button 
              variant="secondary"
              size="medium"
              icon="print"
              onClick={() => window.print()}
              className={styles.actionButton}
            >
              Imprimer
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className={styles.quickFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Rôle:</label>
            <InputSelect
              value={selectedRole}
              onChange={setSelectedRole}
              options={[
                { value: 'all', label: 'Tous les rôles' },
                ...roles.map(role => ({ value: role.nom, label: role.nom }))
              ]}
              placeholder="Rôle"
              size="small"
              icon={<FaUserTie />}
              fullWidth
              className={styles}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Statut:</label>
            <InputSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'active', label: 'Actifs' },
                { value: 'inactive', label: 'Inactifs' }
              ]}
              placeholder="Statut"
              size="small"
              icon={<FaUserCheck />}
              fullWidth
              className={styles}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Trier par:</label>
            <InputSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'name', label: 'Nom (A-Z)' },
                { value: 'recent', label: 'Récents' },
                { value: 'active', label: 'Statut' },
                { value: 'role', label: 'Rôle' },
                { value: 'lastLogin', label: 'Dernière connexion' }
              ]}
              placeholder="Trier par"
              size="small"
              icon={<TbUserSearch />}
              fullWidth
              className={styles}
            />
          </div>
        </div>

        {/* Statistiques détaillées */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <FaChartLine className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Statistiques des Utilisateurs</h2>
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <FaUserTie />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.vendeursCount}</span>
                <span className={styles.statLabel}>Vendeurs</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <FaUserShield />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.adminsCount}</span>
                <span className={styles.statLabel}>Administrateurs</span>
              </div>
            </div>

            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <FaUserCheck />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{stats.activeUsers}</span>
                <span className={styles.statLabel}>Utilisateurs Actifs</span>
              </div>
            </div>
            
            <div className={styles.quickStatItem}>
              <div className={`${styles.statIcon} ${styles.detail}`}>
                <TbUserStar /> 
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>93%</span>
                <span className={styles.statLabel}>Performance</span>
              </div>
            </div>
          </div>
          
          <div className={styles.statsGrid2x2}>
            <div className={styles.gridRow}>
              <div className={styles.gridCol}>
                
              </div>
              
              <div className={styles.gridCol}>
                
              </div>
            </div>
            
            <div className={styles.gridRow}>
              <div className={styles.gridCol}>
                
              </div>
              
              <div className={styles.gridCol}>
                
              </div>
            </div>
          </div>
        </section>

        {/* Liste des utilisateurs */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <FaUsers className={styles.sectionIcon} />
              <div>
                <h2 className={styles.sectionTitle}>Utilisateurs du Système</h2>
                <p className={styles.sectionSubtitle}>
                  {filteredUsers.length} utilisateur(s) trouvé(s)
                </p>
              </div>
            </div>

            <div className={styles.sectionActions}>
              <div className={styles.viewToggle}>
                <Button 
                  variant={viewMode === 'grid' ? 'primary' : 'outline'}
                  size="small"
                  icon="grid"
                  onClick={() => setViewMode('grid')}
                  className={styles.viewButton}
                  title="Vue grille"
                />
                <Button 
                  variant={viewMode === 'list' ? 'primary' : 'outline'}
                  size="small"
                  icon="list"
                  onClick={() => setViewMode('list')}
                  className={styles.viewButton}
                  title="Vue liste"
                />
              </div>
              
              <Button 
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={handleResetFilters}
                className={styles.resetButton}
              >
                Réinitialiser
              </Button>
              <Button 
                variant="outline"
                size="medium"
                icon="warning"
                onClick={handleViewInactive}
                className={styles.alertButton}
              >
                Voir inactifs
              </Button>
            </div>
          </div>
          
          {/* Vue grille ou tableau */}
          {viewMode === 'grid' ? (
            <div className={styles.usersGrid}>
              {filteredUsers.map((user, index) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteUser}
                  onView={handleViewUser}
                  onToggleStatus={handleToggleStatus}
                  onResetPassword={handleResetPassword}
                  delay={index * 100}
                />
              ))}
              
              {filteredUsers.length === 0 && (
                <div className={styles.noResults}>
                  <FaUsers className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun utilisateur trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun utilisateur ne correspond à vos critères de recherche.
                  </p>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersButton}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table 
                columns={tableColumns}
                data={filteredUsers}
                className={styles.usersTable}
                striped={true}
                hoverEffect={true}
                compact={false}
              />
              
              {filteredUsers.length === 0 && (
                <div className={styles.noResults}>
                  <FaUsers className={styles.noResultsIcon} />
                  <h3 className={styles.noResultsTitle}>Aucun utilisateur trouvé</h3>
                  <p className={styles.noResultsText}>
                    Aucun utilisateur ne correspond à vos critères de recherche.
                  </p>
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersButton}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className={styles.pagination}>
              <Button 
                variant="outline"
                size="small"
                icon="precedant"
                disabled={true}
                className={styles.paginationButton}
              />
              <span className={styles.paginationInfo}>
                Utilisateurs 1-{filteredUsers.length} sur {filteredUsers.length}
              </span>
              <Button 
                variant="outline"
                size="small"
                icon="suivant"
                className={styles.paginationButton}
              />
            </div>
          )}
        </section>

        {/* Actions rapides */}
        <div className={styles.quickActionsBar}>
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.warning}`}>
              <FaUserTimes />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>{stats.inactiveUsers} utilisateurs inactifs</h4>
              <p className={styles.quickActionText}>Vérifier les comptes inactifs depuis plus de 30 jours</p>
            </div>
            <Button 
              variant="warning"
              size="medium"
              icon="eye"
              onClick={handleViewInactive}
              className={styles.quickActionButton}
            >
              Vérifier
            </Button>
          </div>
          
          <div className={styles.quickActionItem}>
            <div className={`${styles.quickActionIcon} ${styles.accent}`}>
              <IoShieldCheckmarkOutline />
            </div>
            <div className={styles.quickActionContent}>
              <h4 className={styles.quickActionTitle}>Audit de sécurité</h4>
              <p className={styles.quickActionText}>Vérifier les permissions et accès des utilisateurs</p>
            </div>
            <Link 
              to="/frmUtilisateursAdmin"
              className={styles.quickActionLink}
            >
              <Button 
                variant="secondary"
                size="medium"
                icon="settings"
                className={styles.quickActionButton}
              >
                Auditer
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>

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

export default Utilisateurs;