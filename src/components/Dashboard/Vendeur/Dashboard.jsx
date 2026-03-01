import React, { useState, useMemo } from 'react';
import styles from './Dashboard.module.css';
import Input from '../../Input/Input';
import Button from '../../Button/Button';
import {
  IoSearchOutline,
  IoCheckmarkCircleOutline,
  IoCartOutline,
  IoTimeOutline,
  IoBagHandleOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoTrendingUpOutline,
  IoStorefrontOutline,
} from 'react-icons/io5';
import { FaBox, FaPercentage, FaExclamationTriangle } from 'react-icons/fa';

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

const KpiCard = ({ title, value, subtitle, icon, trend, accent }) => (
  <div className={`${styles.kpiCard} ${styles[`kpi_${accent}`]}`}>
    <div className={styles.kpiStripe} />
    <div className={styles.kpiHead}>
      <div className={styles.kpiIcon}>{icon}</div>
      {trend !== undefined && (
        <span className={`${styles.pill} ${trend >= 0 ? styles.pillGreen : styles.pillRed}`}>
          {trend >= 0 ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className={styles.kpiValue}>{value}</p>
    <p className={styles.kpiTitle}>{title}</p>
    {subtitle && <p className={styles.kpiSub}>{subtitle}</p>}
  </div>
);

const SectionCard = ({ title, icon, count, countAlert, children, footer }) => (
  <div className={styles.section}>
    <div className={styles.sectionHead}>
      <div className={styles.sectionTitle}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h2>{title}</h2>
      </div>
      {count !== undefined && (
        <span className={`${styles.countBadge} ${countAlert ? styles.countBadgeAlert : ''}`}>
          {count}
        </span>
      )}
    </div>
    <div className={styles.sectionBody}>{children}</div>
    {footer && <div className={styles.sectionFoot}>{footer}</div>}
  </div>
);

const VenteRow = ({ vente, index }) => {
  const isPaye = vente.statut === 'paye';
  return (
    <div className={styles.listRow} style={{ animationDelay: `${index * 40}ms` }}>
      <div className={`${styles.rowDot} ${isPaye ? styles.dotGreen : styles.dotOrange}`}>
        {isPaye ? <IoCheckmarkCircleOutline /> : <IoTimeOutline />}
      </div>
      <div className={styles.rowBody}>
        <span className={styles.rowPrimary}>{vente.numero}</span>
        <span className={styles.rowSecondary}>{vente.client}</span>
      </div>
      <div className={styles.rowEnd}>
        <span className={styles.montant}>{vente.montant}</span>
        <span className={`${styles.statusTag} ${isPaye ? styles.tagGreen : styles.tagOrange}`}>
          {isPaye ? 'Payé' : 'Crédit'}
        </span>
      </div>
    </div>
  );
};

const ProduitRow = ({ produit, index }) => {
  const isDanger = produit.stock <= 5;
  return (
    <div className={styles.listRow} style={{ animationDelay: `${index * 40}ms` }}>
      <div className={`${styles.rowDot} ${isDanger ? styles.dotRed : styles.dotOrange}`}>
        <FaExclamationTriangle />
      </div>
      <div className={styles.rowBody}>
        <span className={styles.rowPrimary}>{produit.nom}</span>
        <span className={`${styles.rowRef}`}>{produit.reference}</span>
      </div>
      <div className={styles.rowEnd}>
        <span className={`${styles.stockChip} ${isDanger ? styles.chipRed : styles.chipOrange}`}>
          {produit.stock} unités
        </span>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value, icon, accent }) => (
  <div className={styles.miniStat}>
    <div className={`${styles.miniIcon} ${styles[`mini_${accent}`]}`}>{icon}</div>
    <div className={styles.miniBody}>
      <span className={styles.miniValue}>{value}</span>
      <span className={styles.miniLabel}>{label}</span>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */

const Dashboard = () => {
  const [search, setSearch] = useState('');

  const today = useMemo(() => new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }), []);

  const mockVentes = [
    { id: 1, numero: 'FAC-2024-00158', client: 'SARL Batiment Plus',      montant: '1 250 000 MGA', statut: 'paye' },
    { id: 2, numero: 'FAC-2024-00157', client: 'Mr. Rakoto Jean',         montant: '380 000 MGA',   statut: 'credit' },
    { id: 3, numero: 'FAC-2024-00156', client: 'Entreprise Construction', montant: '2 450 000 MGA', statut: 'paye' },
    { id: 4, numero: 'FAC-2024-00155', client: 'Mme. Rasoa Andriana',     montant: '125 000 MGA',   statut: 'paye' },
    { id: 5, numero: 'FAC-2024-00154', client: 'Groupe Immobilier Pro',   montant: '870 000 MGA',   statut: 'credit' },
  ];

  const mockProduits = [
    { id: 1, nom: 'Ciment Portland 50kg', reference: 'CIM-50KG',       stock: 15 },
    { id: 2, nom: 'Tôle galvanisée 3m',   reference: 'TOL-GALV-3M',    stock: 8 },
    { id: 3, nom: 'Vis à bois 5×50mm',    reference: 'VIS-BOIS-5x50',  stock: 5 },
    { id: 4, nom: 'Peinture ext. 10L',    reference: 'PEINT-EXT-10L',  stock: 3 },
    { id: 5, nom: 'Sable fin (sac 25kg)', reference: 'SAB-FIN-25KG',   stock: 12 },
  ];

  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <IoStorefrontOutline className={styles.storeIcon} />
          <div>
            <h1 className={styles.pageTitle}>Accueil</h1>
            <p className={styles.pageDate}>{today}</p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <Input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            name="dashSearch"
            icon={<IoSearchOutline />}
          />
          <Button variant="primary" size="medium" icon="plus" className={styles.btnNoWrap}>
            Nouvelle vente
          </Button>
        </div>
      </div>

      {/* ── KPI Grid ───────────────────────── */}
      <div className={styles.kpiGrid}>
        <KpiCard title="Ventes du jour"     value="24"      icon={<IoCartOutline />}       trend={12.4} accent="blue"   />
        <KpiCard title="Chiffre d'affaires" value="1.25M"   icon={<IoCashOutline />}        trend={8.2}  accent="green"  />
        <KpiCard title="Crédits en cours"   value="380K"    icon={<IoTimeOutline />}        trend={-3.1} accent="orange" />
        <KpiCard title="Taux de conversion" value="68.5%"   icon={<IoTrendingUpOutline />}  trend={2.5}  accent="indigo" />
      </div>

      {/* ── Content ────────────────────────── */}
      <div className={styles.content}>

        {/* Left — Ventes */}
        <SectionCard
          title="Ventes récentes"
          icon={<IoCartOutline />}
          count={mockVentes.length}
          footer={
            <button className={styles.footerLink}>Voir toutes les ventes →</button>
          }
        >
          {mockVentes.map((v, i) => <VenteRow key={v.id} vente={v} index={i} />)}
        </SectionCard>

        {/* Right column */}
        <div className={styles.rightCol}>

          {/* Stock critique */}
          <SectionCard
            title="Stock critique"
            icon={<FaBox />}
            count={mockProduits.length}
            countAlert
            footer={
              <button className={styles.footerLink}>Gérer le stock →</button>
            }
          >
            {mockProduits.map((p, i) => <ProduitRow key={p.id} produit={p} index={i} />)}
          </SectionCard>

          {/* Mini stats */}
          <div className={styles.miniGrid}>
            <MiniStat label="Clients actifs" value="15"    icon={<IoPeopleOutline />}    accent="blue"   />
            <MiniStat label="Panier moyen"   value="52K"   icon={<IoBagHandleOutline />} accent="green"  />
            <MiniStat label="Alertes stock"  value="8"     icon={<FaBox />}              accent="orange" />
            <MiniStat label="Satisfaction"   value="94%"   icon={<FaPercentage />}       accent="indigo" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;