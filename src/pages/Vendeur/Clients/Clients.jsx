import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Clients.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import ClientModal from './ClientModal';
import {
  IoSearchOutline,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline
} from "react-icons/io5";
import {
  FaUserTie,
  FaBuilding,
  FaTags
} from "react-icons/fa";
import {
  TbCategory,
  TbArrowsSort,
  TbCurrencyDollar
} from "react-icons/tb";
import {
  MdOutlineGroup
} from "react-icons/md";

// Données mock pour les clients
const initialClients = [
  {
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
    total_achats: 8500000,
    dernier_achat: '2024-03-15',
    statut: 'actif'
  },
  {
    id: 2,
    nom: 'Entreprise Construction Pro',
    type: 'Entreprise',
    contact: 'Mr. Rabe Andriana',
    telephone: '+261 32 00 987 65',
    email: 'info@constructionpro.mg',
    adresse: 'Ivandry, Antananarivo',
    categorie: 'Client Gold',
    credit_autorise: 3000000,
    credit_utilise: 0,
    total_achats: 4200000,
    dernier_achat: '2024-03-14',
    statut: 'actif'
  },
  {
    id: 3,
    nom: 'Mr. Randria Jean-Pierre',
    type: 'Particulier',
    contact: 'Mr. Randria Jean-Pierre',
    telephone: '+261 33 00 456 78',
    email: 'randria.jp@gmail.com',
    adresse: 'Ambohibao, Antananarivo',
    categorie: 'Client Standard',
    credit_autorise: 1000000,
    credit_utilise: 250000,
    total_achats: 1800000,
    dernier_achat: '2024-03-10',
    statut: 'actif'
  },
  {
    id: 4,
    nom: 'Groupe Immobilier Pro',
    type: 'Entreprise',
    contact: 'Mme. Rasoa',
    telephone: '+261 34 11 223 34',
    email: 'direction@groupepro.mg',
    adresse: 'Ankorondrano, Antananarivo',
    categorie: 'Client Premium',
    credit_autorise: 10000000,
    credit_utilise: 3200000,
    total_achats: 12500000,
    dernier_achat: '2024-03-12',
    statut: 'actif'
  },
  {
    id: 5,
    nom: 'SARL Materiaux Pro',
    type: 'Entreprise',
    contact: 'Mr. Rajaona',
    telephone: '+261 32 11 334 45',
    email: 'rajaona@materiauxpro.mg',
    adresse: 'Andraharo, Antananarivo',
    categorie: 'Client Silver',
    credit_autorise: 2000000,
    credit_utilise: 800000,
    total_achats: 3100000,
    dernier_achat: '2024-03-08',
    statut: 'inactif'
  },
  {
    id: 6,
    nom: 'Mr. Andriamora',
    type: 'Particulier',
    contact: 'Mr. Andriamora',
    telephone: '+261 33 12 445 56',
    email: 'andriamora@yahoo.fr',
    adresse: 'Anosy, Antananarivo',
    categorie: 'Client Standard',
    credit_autorise: 500000,
    credit_utilise: 0,
    total_achats: 750000,
    dernier_achat: '2024-02-28',
    statut: 'actif'
  }
];

// Composant carte client
const ClientCard = ({ client, onView, onEdit, onDelete }) => {
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Aucun achat';
    return new Date(dateString).toLocaleDateString('fr-FR');
  }, []);

  const creditPercent = client.credit_autorise > 0
    ? Math.min((client.credit_utilise / client.credit_autorise) * 100, 100)
    : 0;

  return (
    <div className={styles.clientCard}>
      <div className={styles.clientHeader}>
        <div className={styles.clientType}>
          {client.type === 'Entreprise' ? <FaBuilding /> : <FaUserTie />}
          <span>{client.type}</span>
        </div>
        <div className={`${styles.statusBadge} ${styles[client.statut]}`}>
          {client.statut === 'actif' ? <IoCheckmarkCircleOutline /> : <IoAlertCircleOutline />}
          <span>{client.statut}</span>
        </div>
      </div>

      <div className={styles.clientContent}>
        <div className={styles.clientMainInfo}>
          <h4 className={styles.clientName}>{client.nom}</h4>
          <p className={styles.clientContact}>{client.contact}</p>
          <div className={styles.clientCategory}>
            <FaTags />
            <span>{client.categorie}</span>
          </div>
        </div>

        <div className={styles.clientDetails}>
          <div className={styles.detailItem}>
            <IoCallOutline />
            <span>{client.telephone}</span>
          </div>
          {client.email ? (
            <div className={styles.detailItem}>
              <IoMailOutline />
              <span className={styles.truncate}>{client.email}</span>
            </div>
          ) : null}
          {client.adresse ? (
            <div className={styles.detailItem}>
              <IoLocationOutline />
              <span className={styles.truncate}>{client.adresse}</span>
            </div>
          ) : null}
        </div>

        <div className={styles.clientStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Total achats</div>
            <div className={styles.statValue}>{formatCurrency(client.total_achats)}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Dernier achat</div>
            <div className={styles.statValue}>{formatDate(client.dernier_achat)}</div>
          </div>
        </div>

        {client.credit_autorise > 0 ? (
          <div className={styles.creditInfo}>
            <div className={styles.creditProgress}>
              <div className={styles.progressLabel}>
                <span>Crédit utilisé</span>
                <span>{formatCurrency(client.credit_utilise)} / {formatCurrency(client.credit_autorise)}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.clientActions}>
        <Button
          variant="ghost"
          icon="eye"
          onClick={() => onView(client)}
          className={styles.actionBtn}
        >
          Voir détails
        </Button>
        <Button
          variant="ghost"
          icon="edit"
          onClick={() => onEdit(client)}
          className={styles.actionBtn}
        >
          Modifier
        </Button>
        <Button
          variant="ghost"
          icon="trash"
          onClick={() => onDelete(client)}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
};

ClientCard.propTypes = {
  client: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('nom');
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(clients.map(c => c.categorie))];
    return unique.sort((a, b) => a.localeCompare(b));
  }, [clients]);

  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.nom.toLowerCase().includes(q) ||
        client.contact.toLowerCase().includes(q) ||
        client.telephone.includes(q) ||
        (client.email && client.email.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(client => client.categorie === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.statut === selectedStatus);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(client => client.type === selectedType);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'nom') {
        return a.nom.localeCompare(b.nom);
      }
      if (sortBy === 'total_achats') {
        return b.total_achats - a.total_achats;
      }
      if (sortBy === 'dernier_achat') {
        if (!a.dernier_achat && !b.dernier_achat) return 0;
        if (!a.dernier_achat) return 1;
        if (!b.dernier_achat) return -1;
        return new Date(b.dernier_achat) - new Date(a.dernier_achat);
      }
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, selectedCategory, selectedStatus, selectedType, sortBy]);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.statut === 'actif').length;
    const premiumClients = clients.filter(c => c.categorie.includes('Premium')).length;
    const totalCredit = clients.reduce((sum, c) => sum + c.credit_utilise, 0);
    const totalSales = clients.reduce((sum, c) => sum + c.total_achats, 0);

    return {
      totalClients,
      activeClients,
      premiumClients,
      totalCredit,
      totalSales
    };
  }, [clients]);

  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleSaveClient = (clientData) => {
    if (editingClient) {
      setClients(clients.map(c => c.id === clientData.id ? clientData : c));
    } else {
      const newClient = {
        ...clientData,
        id: Date.now(),
        credit_utilise: 0,
        total_achats: 0,
        dernier_achat: null
      };
      setClients([...clients, newClient]);
    }
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleDeleteClient = (client) => {
    if (globalThis.confirm && globalThis.confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
      setClients(clients.filter(c => c.id !== client.id));
    }
  };

  const handleViewClient = (client) => {
    console.log('Voir client:', client);
    // Navigation vers la page de détail si nécessaire
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedType('all');
    setSortBy('nom');
  };

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.splitScreenContainer}>
        {/* Colonne gauche - Liste des clients */}
        <div className={styles.clientsListColumn}>
          <div className={styles.clientsListHeader}>
            <div className={styles.navigationTabsInline}>
              <h2 className={styles.pageTitle}>Gestion des Clients</h2>
              <p className={styles.pageSubtitle}>
                Gérez vos clients, leurs informations et leur historique d'achats.
              </p>
            </div>

            {/* Filtres */}
            <div className={styles.venteFilters}>
              <Input
                type="text"
                placeholder="Rechercher par nom, contact, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="clientSearch"
                className={styles.searchInput}
                icon={<IoSearchOutline />}
              />
              <InputSelect
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: 'all', label: 'Tous types' },
                  { value: 'Particulier', label: 'Particulier' },
                  { value: 'Entreprise', label: 'Entreprise' }
                ]}
                placeholder="Type"
                variant="outline"
                icon={<FaUserTie />}
                fullWidth
              />
              <InputSelect
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: 'all', label: 'Toutes catégories' },
                  ...categories.map(cat => ({
                    value: cat,
                    label: cat
                  }))
                ]}
                placeholder="Catégorie"
                variant="outline"
                icon={<TbCategory />}
                fullWidth
              />
              <InputSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'all', label: 'Tous statuts' },
                  { value: 'actif', label: 'Actifs' },
                  { value: 'inactif', label: 'Inactifs' }
                ]}
                placeholder="Statut"
                variant="outline"
                icon={<IoCheckmarkCircleOutline />}
                fullWidth
              />
              <InputSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'nom', label: 'Nom' },
                  { value: 'total_achats', label: 'Total achats' },
                  { value: 'dernier_achat', label: 'Dernier achat' }
                ]}
                placeholder="Trier par"
                variant="outline"
                icon={<TbArrowsSort />}
                fullWidth
              />
              <Button
                variant="outline"
                size="medium"
                icon="refresh"
                onClick={handleResetFilters}
                className={styles.resetBtn}
              />
              <Button
                variant="primary"
                size="medium"
                icon="plus"
                onClick={handleAddClient}
                className={styles.addBtn}
              >
                Ajouter
              </Button>
            </div>
          </div>

          {/* Liste des clients */}
          <div className={styles.clientsListContainer}>
            <div className={styles.clientsListScroll}>
              {filteredClients.length > 0 ? (
                <div className={styles.clientsGrid}>
                  {filteredClients.map((client) => (
                    <ClientCard
                      key={client.id}
                      client={client}
                      onView={handleViewClient}
                      onEdit={handleEditClient}
                      onDelete={handleDeleteClient}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.noClients}>
                  <MdOutlineGroup className={styles.noClientsIcon} />
                  <h3>Aucun client trouvé</h3>
                  <p>Aucun client ne correspond à vos critères de recherche.</p>
                  <Button
                    variant="outline"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.resetFiltersBtn}
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - Statistiques */}
        <div className={styles.statsColumn}>
          <div className={styles.statsHeader}>
            <h2>Vue d'ensemble</h2>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <MdOutlineGroup />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.totalClients}</span>
                <span className={styles.statLabel}>Clients total</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <IoCheckmarkCircleOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.activeClients}</span>
                <span className={styles.statLabel}>Clients actifs</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <FaTags />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.premiumClients}</span>
                <span className={styles.statLabel}>Clients Premium</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.info}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(stats.totalSales)}</span>
                <span className={styles.statLabel}>CA total</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.danger}`}>
                <IoAlertCircleOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(stats.totalCredit)}</span>
                <span className={styles.statLabel}>Crédit utilisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'ajout/modification client */}
      {showClientModal && (
        <ClientModal
          isOpen={showClientModal}
          onClose={() => {
            setShowClientModal(false);
            setEditingClient(null);
          }}
          onSave={handleSaveClient}
          client={editingClient}
        />
      )}
    </div>
  );
};

export default Clients;
