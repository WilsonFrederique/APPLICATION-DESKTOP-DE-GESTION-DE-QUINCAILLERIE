import React, { useState, useMemo } from 'react';
import styles from './Clients.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import ClientModal from './ClientModal';
import {
  IoSearchOutline,
  IoCallOutline,
  IoLocationOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoPersonOutline,
  IoCreateOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { MdOutlineGroup } from 'react-icons/md';

const initialClients = [
  { id: 1, nom: 'SARL Batiment Plus',          telephone: '+261 34 00 123 45', adresse: 'Analakely, Antananarivo 101', statut: 'actif' },
  { id: 2, nom: 'Entreprise Construction Pro',  telephone: '+261 32 00 987 65', adresse: 'Ivandry, Antananarivo',        statut: 'actif' },
  { id: 3, nom: 'Mr. Randria Jean-Pierre',      telephone: '+261 33 00 456 78', adresse: 'Ambohibao, Antananarivo',      statut: 'actif' },
  { id: 4, nom: 'Groupe Immobilier Pro',         telephone: '+261 34 11 223 34', adresse: 'Ankorondrano, Antananarivo',   statut: 'actif' },
  { id: 5, nom: 'SARL Materiaux Pro',           telephone: '+261 32 11 334 45', adresse: 'Andraharo, Antananarivo',      statut: 'inactif' },
  { id: 6, nom: 'Mr. Andriamora',               telephone: '+261 33 12 445 56', adresse: 'Anosy, Antananarivo',          statut: 'actif' },
];

const AVATAR_COLORS = ['#3b82f6', '#6366f1', '#0891b2', '#059669', '#d97706', '#7c3aed'];
const getInitials    = (nom) => {
  const parts = nom.trim().split(' ');
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── Row ─── */
const ClientRow = ({ client, onEdit, onDelete }) => (
  <tr className={styles.row}>
    <td className={styles.tdAvatar}>
      <div className={styles.avatar} style={{ background: getAvatarColor(client.id) }}>
        {getInitials(client.nom)}
      </div>
    </td>

    <td className={styles.tdNom}>
      <span className={styles.clientNom}>{client.nom}</span>
    </td>

    <td className={styles.tdPhone}>
      <div className={styles.cellIcon}>
        <IoCallOutline />
        <span>{client.telephone}</span>
      </div>
    </td>

    <td className={styles.tdAddr}>
      <div className={styles.cellIcon}>
        <IoLocationOutline />
        <span className={styles.truncate}>{client.adresse}</span>
      </div>
    </td>

    <td className={styles.tdStatus}>
      <span className={`${styles.badge} ${client.statut === 'actif' ? styles.badgeActif : styles.badgeInactif}`}>
        {client.statut === 'actif' ? <IoCheckmarkCircleOutline /> : <IoAlertCircleOutline />}
        {client.statut}
      </span>
    </td>

    <td className={styles.tdActions}>
      <div className={styles.actionsGroup}>
        <button className={styles.btnAction} onClick={() => onEdit(client)} title="Modifier">
          <IoCreateOutline />
        </button>
        <button className={`${styles.btnAction} ${styles.btnActionDanger}`} onClick={() => onDelete(client)} title="Supprimer">
          <IoTrashOutline />
        </button>
      </div>
    </td>
  </tr>
);

/* ─── Page ─── */
const Clients = () => {
  const [clients,        setClients]        = useState(initialClients);
  const [searchTerm,     setSearchTerm]     = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy,         setSortBy]         = useState('nom');
  const [showModal,      setShowModal]      = useState(false);
  const [editingClient,  setEditingClient]  = useState(null);

  const filteredClients = useMemo(() => {
    let list = [...clients];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(c =>
        c.nom.toLowerCase().includes(q) ||
        c.telephone.includes(q) ||
        c.adresse.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== 'all') list = list.filter(c => c.statut === selectedStatus);
    list.sort((a, b) => {
      if (sortBy === 'nom')    return a.nom.localeCompare(b.nom);
      if (sortBy === 'statut') return a.statut.localeCompare(b.statut);
      return 0;
    });
    return list;
  }, [clients, searchTerm, selectedStatus, sortBy]);

  const stats = useMemo(() => ({
    total:    clients.length,
    actifs:   clients.filter(c => c.statut === 'actif').length,
    inactifs: clients.filter(c => c.statut === 'inactif').length,
  }), [clients]);

  const handleSave = (data) => {
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === data.id ? data : c));
    } else {
      setClients(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingClient(null);
  };

  const handleEdit   = (client) => { setEditingClient(client); setShowModal(true); };
  const handleDelete = (client) => {
    if (window.confirm(`Supprimer le client "${client.nom}" ?`))
      setClients(prev => prev.filter(c => c.id !== client.id));
  };
  const handleReset = () => { setSearchTerm(''); setSelectedStatus('all'); setSortBy('nom'); };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Clients</h1>
          <p className={styles.pageSubtitle}>Gestion de la base clients</p>
        </div>
        <Button
          variant="primary"
          size="medium"
          icon="plus"
          onClick={() => { setEditingClient(null); setShowModal(true); }}
        >
          Nouveau client
        </Button>
      </div>

      {/* ── Stats bar ── */}
      <div className={styles.statsBar}>
        <div className={styles.statPill}>
          <MdOutlineGroup />
          <span><strong>{stats.total}</strong> total</span>
        </div>
        <div className={`${styles.statPill} ${styles.statPillGreen}`}>
          <IoCheckmarkCircleOutline />
          <span><strong>{stats.actifs}</strong> actifs</span>
        </div>
        <div className={`${styles.statPill} ${styles.statPillGray}`}>
          <IoAlertCircleOutline />
          <span><strong>{stats.inactifs}</strong> inactifs</span>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Input
            type="text"
            placeholder="Rechercher par nom, téléphone, adresse…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            name="clientSearch"
            icon={<IoSearchOutline />}
            fullWidth
          />
        </div>

        <InputSelect
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: 'all',     label: 'Tous statuts' },
            { value: 'actif',   label: 'Actifs' },
            { value: 'inactif', label: 'Inactifs' },
          ]}
          placeholder="Statut"
        />

        <InputSelect
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'nom',    label: 'Trier par nom' },
            { value: 'statut', label: 'Trier par statut' },
          ]}
          placeholder="Tri"
        />

        <Button
          variant="outline"
          size="medium"
          icon="refresh"
          onClick={handleReset}
          title="Réinitialiser les filtres"
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        {filteredClients.length > 0 ? (
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.thAvatar}></th>
                  <th>Nom</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Statut</th>
                  <th className={styles.thActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <ClientRow
                    key={client.id}
                    client={client}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.empty}>
            <IoPersonOutline className={styles.emptyIcon} />
            <p>Aucun client trouvé</p>
            <Button variant="outline" size="medium" icon="refresh" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        )}
      </div>

      {filteredClients.length > 0 && (
        <div className={styles.tableFooter}>
          {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} affiché{filteredClients.length > 1 ? 's' : ''}
        </div>
      )}

      {showModal && (
        <ClientModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingClient(null); }}
          onSave={handleSave}
          client={editingClient}
        />
      )}
    </div>
  );
};

export default Clients;