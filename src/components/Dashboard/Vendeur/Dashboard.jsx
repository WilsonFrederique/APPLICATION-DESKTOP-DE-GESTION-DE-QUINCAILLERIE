import React, { useState, useMemo } from 'react';
import styles from './Dashboard.module.css';
import Input from '../../Input/Input';
import Button from '../../Button/Button';
import { 
  IoSearchOutline,
  IoCheckmarkCircleOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoAddOutline,
  IoTimeOutline,
  IoBagHandleOutline,
  IoCashOutline,
  IoPeopleOutline
} from "react-icons/io5";
import { 
  FaBox,
  FaPercentage,
  FaExclamationTriangle
} from "react-icons/fa";

// Carte de statistique minimale
const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  color = 'blue'
}) => (
  <div className={`${styles.statCard} ${styles[color]}`}>
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statContent}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statTitle}>{title}</div>
      {trend !== undefined && (
        <div className={`${styles.trend} ${trend >= 0 ? styles.up : styles.down}`}>
          {trend >= 0 ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </div>
);

// Carte de vente minimale
const VenteCard = ({ vente }) => (
  <div className={styles.venteCard}>
    <div className={styles.venteIcon}>
      {vente.statut === 'paye' ? <IoCheckmarkCircleOutline /> : <IoTimeOutline />}
    </div>
    <div className={styles.venteInfo}>
      <div className={styles.venteNumero}>{vente.numero}</div>
      <div className={styles.venteClient}>{vente.client}</div>
    </div>
    <div className={styles.venteMontant}>{vente.montant}</div>
  </div>
);

// Carte de produit minimale
const ProduitCard = ({ produit }) => (
  <div className={styles.produitCard}>
    <div className={styles.produitIcon}>
      <FaExclamationTriangle />
    </div>
    <div className={styles.produitInfo}>
      <div className={styles.produitNom}>{produit.nom}</div>
      <div className={styles.produitRef}>{produit.reference}</div>
    </div>
    <div className={`${styles.stockBadge} ${produit.stock <= 10 ? styles.danger : styles.warning}`}>
      {produit.stock}
    </div>
  </div>
);

// Bouton d'action minimale
const ActionButton = ({ icon, label, color = 'blue' }) => (
  <button className={`${styles.actionBtn} ${styles[color]}`}>
    <div className={styles.actionIcon}>{icon}</div>
    <div className={styles.actionLabel}>{label}</div>
  </button>
);

const Dashboard = () => {
  // Données mock minimales
  const mockStats = useMemo(() => ({
    ventes: 24,
    chiffreAffaire: '1.25M',
    credits: '380K',
    conversion: '68.5%',
    panier: '52K',
    clients: 15,
    stock: 8
  }), []);

  const mockVentes = useMemo(() => [
    { id: 1, numero: 'FAC-2024-00158', client: 'SARL Batiment', montant: '1.25M', statut: 'paye' },
    { id: 2, numero: 'FAC-2024-00157', client: 'Mr. Rakoto', montant: '380K', statut: 'credit' },
    { id: 3, numero: 'FAC-2024-00156', client: 'Construction', montant: '2.45M', statut: 'paye' },
    { id: 1, numero: 'FAC-2024-00158', client: 'SARL Batiment', montant: '1.25M', statut: 'paye' },
    { id: 2, numero: 'FAC-2024-00157', client: 'Mr. Rakoto', montant: '380K', statut: 'credit' },
    { id: 3, numero: 'FAC-2024-00156', client: 'Construction', montant: '2.45M', statut: 'paye' },
    { id: 4, numero: 'FAC-2024-00155', client: 'Mme. Rasoa', montant: '125K', statut: 'paye' }
  ], []);

  const mockProduits = useMemo(() => [
    { id: 1, nom: 'Ciment 50kg', reference: 'CIM-50KG', stock: 15 },
    { id: 2, nom: 'Tôle 3m', reference: 'TOL-GALV-3M', stock: 8 },
    { id: 3, nom: 'Vis Bois', reference: 'VIS-BOIS-5x50', stock: 5 },
    { id: 4, nom: 'Peinture', reference: 'PEINT-10L', stock: 3 },
    { id: 5, nom: 'Peinture', reference: 'PEINT-10L', stock: 3 },
    { id: 1, nom: 'Ciment 50kg', reference: 'CIM-50KG', stock: 15 },
    { id: 2, nom: 'Tôle 3m', reference: 'TOL-GALV-3M', stock: 8 },
    { id: 3, nom: 'Vis Bois', reference: 'VIS-BOIS-5x50', stock: 5 },
    { id: 4, nom: 'Peinture', reference: 'PEINT-10L', stock: 3 },
    { id: 5, nom: 'Peinture', reference: 'PEINT-10L', stock: 3 }
  ], []);

  const [search, setSearch] = useState('');

  return (
    <div className={styles.dashboard}>
      {/* Header minimal */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Dashboard</h1>
          <p>Vue d'ensemble</p>
        </div>
        <div className={styles.headerRight}>
          <Input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
            icon={<IoSearchOutline />}
          />
          <Button 
            variant="primary"
            size="large"
            icon="cart"
            onClick={() => window.location.href = '/vendeur/vente/nouvelle'}
            className={styles.nouvelleBtn}
          >
            Nouvelle
          </Button>
        </div>
      </div>

      {/* KPI Grid compact */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Ventes"
          value={mockStats.ventes}
          icon={<IoCartOutline />}
          trend={12.4}
          color="blue"
        />
        <StatCard
          title="Chiffre d'Aff."
          value={mockStats.chiffreAffaire}
          icon={<IoBagHandleOutline />}
          trend={8.2}
          color="green"
        />
        <StatCard
          title="Crédits"
          value={mockStats.credits}
          icon={<IoTimeOutline />}
          trend={-3.1}
          color="orange"
        />
        <StatCard
          title="Conversion"
          value={mockStats.conversion}
          icon={<FaPercentage />}
          trend={2.5}
          color="purple"
        />
      </div>

      {/* Contenu principal */}
      <div className={styles.main}>
        {/* Colonne gauche */}
        <div className={styles.column}>
          {/* Ventes */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Ventes Récentes</h2>
              <span className={styles.count}>{mockVentes.length}</span>
            </div>
            <div className={styles.ventesList}>
              {mockVentes.map(vente => (
                <VenteCard key={vente.id} vente={vente} />
              ))}
            </div>
          </div>

          {/* Statistiques secondaires */}
          <div className={styles.miniStats}>
            <StatCard
              title="Panier Moyen"
              value={mockStats.panier}
              icon={<IoBagHandleOutline />}
              trend={5.3}
              color="blue"
            />
            <StatCard
              title="Clients"
              value={mockStats.clients}
              icon={<IoPeopleOutline />}
              trend={12.1}
              color="green"
            />
          </div>
        </div>

        {/* Colonne droite */}
        <div className={styles.column}>
          {/* Stock */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Stock Critique</h2>
              <span className={styles.count}>{mockProduits.length}</span>
            </div>
            <div className={styles.produitsList}>
              {mockProduits.map(produit => (
                <ProduitCard key={produit.id} produit={produit} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;