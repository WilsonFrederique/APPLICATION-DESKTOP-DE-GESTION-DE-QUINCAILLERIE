import React, { useState, useMemo } from 'react';
import styles from './Dashboard.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Input from '../../Input/Input';
import InputSelect from '../../Input/InputSelect';
import Button from '../../Button/Button';
import Table from '../../Table/Table';
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoCalendarOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoSettingsOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoFilterOutline,
  IoShareSocialOutline,
  IoCartOutline,
  IoBarChartOutline,
  IoCloseCircleOutline,
  IoReceiptOutline,
  IoPrintOutline,
  IoStatsChartOutline,
  IoCalculatorOutline
} from "react-icons/io5";
import { 
  FaBox,
  FaUsers,
  FaChartLine,
  FaTruck,
  FaExclamationTriangle,
  FaPercentage,
  FaHistory,
  FaTags,
  FaExternalLinkAlt
} from "react-icons/fa";
import { 
  MdPointOfSale,
  MdDiscount,
  MdOutlineTrendingUp
} from "react-icons/md";
import { 
  GiTakeMyMoney,
  GiShoppingBag
} from "react-icons/gi";
import { 
  CiMoneyBill
} from "react-icons/ci";
import { 
  TbCurrencyDollar,
  TbArrowsSort
} from "react-icons/tb";
import ScrollToTop from '../../Helper/ScrollToTop';
import Footer from '../../Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';

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

// Composant de carte de statistique
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  suffix = '',
  prefix = '',
  description = '',
  delay = 0
}) => (
  <div 
    className={`${styles.statCard} ${styles[color]}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={styles.statContentWrapper}>
      <div className={styles.statHeader}>
        <div className={styles.statIconWrapper}>
          {icon}
        </div>
        <div className={styles.statTrendIndicator}>
          {trend !== undefined && (
            <span className={`${styles.trend} ${trend >= 0 ? styles.positive : styles.negative}`}>
              {trend >= 0 ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>
          {prefix}{value}{suffix}
        </div>
        <div className={styles.statTitle}>{title}</div>
        {description && <div className={styles.statDescription}>{description}</div>}
      </div>
    </div>
  </div>
);

// Composant de vente récente
const VenteRecentCard = ({ vente, delay }) => (
  <div 
    className={styles.venteRecentCard}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={styles.venteRecentHeader}>
      <div className={styles.venteRecentInfo}>
        <h4 className={styles.venteRecentNumero}>{vente.numero}</h4>
        <span className={styles.venteRecentClient}>{vente.client}</span>
      </div>
      <span className={`${styles.venteRecentStatus} ${styles[vente.statut]}`}>
        {vente.statut === 'paye' && <IoCheckmarkCircleOutline />}
        {vente.statut === 'credit' && <IoTimeOutline />}
        {vente.statut === 'annule' && <IoCloseCircleOutline />}
        {vente.statut === 'non_livre' && <FaTruck />}
        {vente.statut}
      </span>
    </div>
    <div className={styles.venteRecentDetails}>
      <div className={styles.venteRecentMontant}>
        <span className={styles.montantLabel}>Montant:</span>
        <span className={styles.montantValue}>{vente.montant}</span>
      </div>
      <div className={styles.venteRecentItems}>
        <span className={styles.itemsLabel}>Articles:</span>
        <span className={styles.itemsValue}>{vente.items}</span>
      </div>
    </div>
    <div className={styles.venteRecentFooter}>
      <div className={styles.venteRecentDate}>
        <IoCalendarOutline />
        {vente.date}
      </div>
      <div className={styles.venteRecentActions}>
        <Button 
          variant="eyebg"
          size="small"
          icon="eye"
          className={styles.iconBtnSmall}
          title="Voir facture"
        />
        <Button 
          variant="outline"
          size="small"
          icon="print"
          className={styles.iconBtnSmall}
          title="Imprimer"
        />
      </div>
    </div>
  </div>
);

// Composant de produit en stock critique
const ProduitCritiqueCard = ({ produit, delay }) => (
  <div 
    className={styles.produitCritiqueCard}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={styles.produitCritiqueHeader}>
      <div className={styles.produitCritiqueInfo}>
        <h4 className={styles.produitCritiqueNom}>{produit.nom}</h4>
        <span className={styles.produitCritiqueRef}>Ref: {produit.reference}</span>
      </div>
      <span className={`${styles.stockLevel} ${produit.niveau <= 10 ? styles.danger : styles.warning}`}>
        {produit.stock} unités
      </span>
    </div>
    <div className={styles.produitCritiqueProgress}>
      <div className={styles.progressBarContainer}>
        <div 
          className={`${styles.progressBar} ${produit.niveau <= 10 ? styles.danger : styles.warning}`}
          style={{ width: `${produit.niveau}%` }}
        ></div>
      </div>
      <span className={styles.progressText}>{produit.niveau}% du stock</span>
    </div>
    <div className={styles.produitCritiqueCategory}>
      <FaTags />
      {produit.categorie}
    </div>
  </div>
);

// Composant de top produit
const TopProduitCard = ({ produit, rank, delay }) => (
  <div 
    className={styles.topProduitCard}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={styles.topProduitRank}>
      <span className={styles.rankNumber}>{rank}</span>
    </div>
    <div className={styles.topProduitContent}>
      <div className={styles.topProduitInfo}>
        <h4 className={styles.topProduitNom}>{produit.nom}</h4>
        <span className={styles.topProduitCategory}>{produit.categorie}</span>
      </div>
      <div className={styles.topProduitStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Ventes: <span className={styles.statValue}>{produit.ventes}</span></span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Revenu: <span className={styles.statValue}>{produit.revenu}</span></span>
        </div>
      </div>
    </div>
    <div className={styles.topProduitTrend}>
      <span className={`${styles.trendBadge} ${produit.tendance >= 0 ? styles.positive : styles.negative}`}>
        {produit.tendance >= 0 ? '+' : ''}{produit.tendance}%
      </span>
    </div>
  </div>
);

// Composant d'action rapide
const QuickActionButton = ({ icon, label, color = 'primary', onClick }) => (
  <Button
    variant="outline"
    size="medium"
    icon={icon}
    onClick={onClick}
    className={`${styles.quickActionButton} ${styles[color]}`}
    fullWidth
  >
    {label}
  </Button>
);

const Dashboard = () => {
  // Données mock pour la quincaillerie - VENDEUR
  const mockStats = useMemo(() => ({
    ventesAujourdhui: 24,
    chiffreAffaireJour: 1250000,
    montantCredit: 380000,
    ventesEnAttente: 5,
    produitsFaibleStock: 8,
    clientsActifs: 15,
    tauxConversion: 68.5,
    panierMoyen: 52000,
    reussiteVente: 85.2,
    objectifAtteint: 72
  }), []);

  const mockVentesRecentes = useMemo(() => [
    {
      id: 1,
      numero: 'FAC-2024-00158',
      client: 'SARL Batiment Plus',
      montant: '1.25M Ar',
      date: 'Aujourd\'hui, 15:30',
      statut: 'paye',
      items: 12
    },
    {
      id: 2,
      numero: 'FAC-2024-00157',
      client: 'Mr. Rakoto Jean',
      montant: '380K Ar',
      date: 'Aujourd\'hui, 14:45',
      statut: 'credit',
      items: 3
    },
    {
      id: 3,
      numero: 'FAC-2024-00156',
      client: 'Entreprise Construction Pro',
      montant: '2.45M Ar',
      date: 'Aujourd\'hui, 11:20',
      statut: 'paye',
      items: 25
    },
    {
      id: 4,
      numero: 'FAC-2024-00155',
      client: 'Mme. Rasoa Niry',
      montant: '125K Ar',
      date: 'Hier, 16:15',
      statut: 'paye',
      items: 5
    },
    {
      id: 5,
      numero: 'FAC-2024-00154',
      client: 'SARL Materiaux Express',
      montant: '890K Ar',
      date: 'Hier, 09:30',
      statut: 'annule',
      items: 8
    }
  ], []);

  const mockProduitsCritiques = useMemo(() => [
    {
      id: 1,
      nom: 'Ciment 50kg',
      reference: 'CIM-50KG',
      stock: 15,
      niveau: 10,
      categorie: 'Matériaux Construction',
      seuil: 20
    },
    {
      id: 2,
      nom: 'Tôle Galvanisée 3m',
      reference: 'TOL-GALV-3M',
      stock: 8,
      niveau: 8,
      categorie: 'Ferronnerie',
      seuil: 25
    },
    {
      id: 3,
      nom: 'Vis à Bois 5x50',
      reference: 'VIS-BOIS-5x50',
      stock: 1200,
      niveau: 15,
      categorie: 'Quincaillerie',
      seuil: 5000
    },
    {
      id: 4,
      nom: 'Peinture Blanche 10L',
      reference: 'PEINT-BLANC-10L',
      stock: 5,
      niveau: 12,
      categorie: 'Peinture',
      seuil: 15
    }
  ], []);

  const mockTopProduits = useMemo(() => [
    {
      id: 1,
      nom: 'Ciment 50kg',
      categorie: 'Matériaux',
      ventes: 1250,
      revenu: '47.5M Ar',
      tendance: 12
    },
    {
      id: 2,
      nom: 'Tôle Galvanisée 3m',
      categorie: 'Ferronnerie',
      ventes: 845,
      revenu: '25.4M Ar',
      tendance: 8
    },
    {
      id: 3,
      nom: 'Vis à Bois 5x50',
      categorie: 'Quincaillerie',
      ventes: 12500,
      revenu: '1.9M Ar',
      tendance: 15
    },
    {
      id: 4,
      nom: 'Peinture Blanche 10L',
      categorie: 'Peinture',
      ventes: 320,
      revenu: '9.6M Ar',
      tendance: 5
    },
    {
      id: 5,
      nom: 'Tuyau PVC 50mm',
      categorie: 'Plomberie',
      ventes: 580,
      revenu: '2.9M Ar',
      tendance: 10
    }
  ], []);

  const mockFacturesEnAttente = useMemo(() => [
    {
      id: 1,
      numero: 'FAC-2024-00152',
      client: 'Mr. Andriamalala',
      montant: '240K Ar',
      jours: 5,
      type: 'credit'
    },
    {
      id: 2,
      numero: 'FAC-2024-00149',
      client: 'SARL Construction Rapide',
      montant: '1.8M Ar',
      jours: 3,
      type: 'livraison'
    },
    {
      id: 3,
      numero: 'FAC-2024-00147',
      client: 'Mme. Ravao',
      montant: '75K Ar',
      jours: 7,
      type: 'credit'
    }
  ], []);

  // Initialisation des états
  const [stats] = useState(mockStats);
  const [ventesRecentes] = useState(mockVentesRecentes);
  const [produitsCritiques] = useState(mockProduitsCritiques);
  const [topProduits] = useState(mockTopProduits);
  const [facturesEnAttente] = useState(mockFacturesEnAttente);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fonctions de formatage
  const formatMontant = (montant) => {
    if (typeof montant === 'number') {
      if (montant >= 1000000) {
        return `${(montant / 1000000).toFixed(1)}M Ar`;
      }
      if (montant >= 1000) {
        return `${(montant / 1000).toFixed(0)}K Ar`;
      }
      return `${montant} Ar`;
    }
    return montant;
  };

  // Actions rapides
  const handleNouvelleVente = () => {
    // Navigation vers le module vente
    window.location.href = '/vendeur/vente/nouvelle';
  };

  const handleGestionStock = () => {
    // Navigation vers le module stock
    window.location.href = '/vendeur/stock';
  };

  const handleHistoriqueFactures = () => {
    // Navigation vers l'historique
    window.location.href = '/vendeur/factures';
  };

  const handleAlertesStock = () => {
    // Navigation vers les alertes
    window.location.href = '/vendeur/alertes';
  };

  // Filtrage des ventes
  const ventesFiltrees = ventesRecentes.filter(vente => {
    if (activeFilter === 'today') {
      return vente.date.includes('Aujourd\'hui');
    } else if (activeFilter === 'yesterday') {
      return vente.date.includes('Hier');
    }
    return true;
  });

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <div className={`${styles.header} ${styles.vendeurHeader}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.dashboardTitle}>
                  Tableau de Bord <span className={styles.highlight}>Vendeur</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Interface de gestion des ventes et suivi commercial
                </p>
              </div>
            </div>
            
            {/* Indicateur de performance */}
            <div className={styles.performanceIndicator}>
              <div className={styles.performanceBadge}>
                <IoStatsChartOutline />
                <span>Performance: {stats.reussiteVente}%</span>
              </div>
              <div className={styles.objectifBadge}>
                <IoBarChartOutline />
                <span>Objectif: {stats.objectifAtteint}%</span>
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
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Vendeur"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
              <StyledBreadcrumb
                label="Tableau de Bord"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Barre de recherche et actions rapides */}
        <div className={styles.dashboardControls}>
          <div className={styles.searchSection}>
            <Input
              type="text"
              placeholder="Rechercher produit, client, facture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              name="dashboardSearch"
              icon={<IoSearchOutline />}
              className={styles}
            />
          </div>
          <div className={styles.actionsSection}>
            <Button 
              variant="primary"
              size="medium"
              icon="cart"
              onClick={handleNouvelleVente}
              className={styles.actionBtn}
            >
              Nouvelle Vente
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button 
              variant="success"
              size="medium"
              icon="receipt"
              className={styles.actionBtn}
            >
              Générer Facture
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button 
              variant="secondary"
              size="medium"
              icon="print"
              className={styles.actionBtn}
            >
              Imprimer
            </Button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className={styles.quickFilters}>
          <Button 
            variant={activeFilter === 'today' ? "primary" : "outline"}
            size="small"
            onClick={() => setActiveFilter('today')}
            className={styles.filterBtn}
          >
            Aujourd'hui
          </Button>
          <Button 
            variant={activeFilter === 'yesterday' ? "primary" : "outline"}
            size="small"
            onClick={() => setActiveFilter('yesterday')}
            className={styles.filterBtn}
          >
            Hier
          </Button>
          <Button 
            variant={activeFilter === 'week' ? "primary" : "outline"}
            size="small"
            onClick={() => setActiveFilter('week')}
            className={styles.filterBtn}
          >
            Cette semaine
          </Button>
          <Button 
            variant={activeFilter === 'month' ? "primary" : "outline"}
            size="small"
            onClick={() => setActiveFilter('month')}
            className={styles.filterBtn}
          >
            Ce mois
          </Button>
        </div>

        {/* Section KPI Principaux pour Vendeur */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <MdPointOfSale className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Indicateurs de Vente</h2>
            </div>
            <div className={styles.sectionActions}>
              <Button 
                variant="outline"
                size="small"
                icon="share"
                className={styles.sectionActionBtn}
              >
                Exporter
              </Button>
            </div>
          </div>
          
          {/* Grille 2x2 fixe */}
          <div className={styles.statsGrid2x2}>
            <div className={styles.gridRow}>
              <div className={styles.gridCol}>
                <StatCard
                  title="Ventes Aujourd'hui"
                  value={stats.ventesAujourdhui}
                  suffix=" ventes"
                  icon={<IoCartOutline />}
                  color="primary"
                  trend={12.4}
                  description="Transactions du jour"
                  delay={100}
                />
              </div>
              <div className={styles.gridCol}>
                <StatCard
                  title="Chiffre d'Affaires"
                  value={formatMontant(stats.chiffreAffaireJour)}
                  icon={<CiMoneyBill />}
                  color="success"
                  trend={8.2}
                  description="Total du jour"
                  delay={200}
                />
              </div>
            </div>
            <div className={styles.gridRow}>
              <div className={styles.gridCol}>
                <StatCard
                  title="Crédits Clients"
                  value={formatMontant(stats.montantCredit)}
                  icon={<GiTakeMyMoney />}
                  color="warning"
                  trend={-3.1}
                  description="En attente de paiement"
                  delay={300}
                />
              </div>
              <div className={styles.gridCol}>
                <StatCard
                  title="Taux de Conversion"
                  value={stats.tauxConversion}
                  suffix="%"
                  icon={<FaPercentage />}
                  color="accent"
                  trend={2.5}
                  description="Efficacité commerciale"
                  delay={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal avec grille responsive */}
        <div className={styles.mainContentGrid}>
          {/* Section Ventes Récents */}
          <div className={`${styles.contentColumn} ${styles.mainColumn}`}>
            {/* Ventes Récentes */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <IoReceiptOutline className={styles.cardIcon} />
                  <div>
                    <h3 className={styles.cardTitle}>Ventes Récentes</h3>
                    <p className={styles.cardSubtitle}>{ventesFiltrees.length} transactions</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="small"
                  icon="eye"
                  onClick={handleHistoriqueFactures}
                  className={styles.viewAllBtn}
                >
                  Voir historique
                </Button>
              </div>
              
              <div className={styles.ventesContainer}>
                {ventesFiltrees.length > 0 ? (
                  ventesFiltrees.map((vente, index) => (
                    <VenteRecentCard 
                      key={vente.id} 
                      vente={vente} 
                      delay={index * 100}
                    />
                  ))
                ) : (
                  <div className={styles.noResults}>
                    <IoReceiptOutline className={styles.noResultsIcon} />
                    <p>Aucune vente trouvée</p>
                  </div>
                )}
              </div>
            </div>

            {/* Factures en Attente */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <IoTimeOutline className={styles.cardIcon} />
                  <div>
                    <h3 className={styles.cardTitle}>Suivi en Attente</h3>
                    <p className={styles.cardSubtitle}>{facturesEnAttente.length} factures à suivre</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="small"
                  icon="eye"
                  className={styles.viewAllBtn}
                >
                  Voir tout
                </Button>
              </div>
              
              <div className={styles.facturesAttenteContainer}>
                {facturesEnAttente.map((facture) => (
                  <div key={facture.id} className={styles.factureAttenteCard}>
                    <div className={styles.factureAttenteInfo}>
                      <div className={styles.factureAttenteHeader}>
                        <h4 className={styles.factureNumero}>{facture.numero}</h4>
                        <span className={`${styles.factureType} ${styles[facture.type]}`}>
                          {facture.type === 'credit' ? 'Crédit' : 'Livraison'}
                        </span>
                      </div>
                      <div className={styles.factureAttenteClient}>
                        <span className={styles.clientName}>{facture.client}</span>
                        <span className={styles.clientMontant}>{facture.montant}</span>
                      </div>
                    </div>
                    <div className={styles.factureAttenteDetails}>
                      <div className={styles.factureDelai}>
                        <IoTimeOutline />
                        <span>{facture.jours} jours</span>
                      </div>
                      <div className={styles.factureActions}>
                        <Button 
                          variant="warning"
                          size="small"
                          icon="alert"
                          title="Relancer"
                          className={styles.smallActionBtn}
                        />
                        <Button 
                          variant="success"
                          size="small"
                          icon="check"
                          title="Marquer payé"
                          className={styles.smallActionBtn}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Colonne Latérale */}
          <div className={`${styles.contentColumn} ${styles.sidebarColumn}`}>
            {/* Stock Critique */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <FaExclamationTriangle className={styles.cardIcon} />
                  <div>
                    <h3 className={styles.cardTitle}>Stock Critique</h3>
                    <p className={styles.cardSubtitle}>{produitsCritiques.length} produits à réapprovisionner</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="small"
                  icon="alert"
                  onClick={handleAlertesStock}
                  className={styles.viewAllBtn}
                >
                  Alertes
                </Button>
              </div>
              
              <div className={styles.stockCritiqueContainer}>
                {produitsCritiques.map((produit, index) => (
                  <ProduitCritiqueCard 
                    key={produit.id} 
                    produit={produit} 
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>

            {/* Actions Rapides */}
            <div className={styles.contentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleSection}>
                  <IoSettingsOutline className={styles.cardIcon} />
                  <div>
                    <h3 className={styles.cardTitle}>Actions Rapides</h3>
                    <p className={styles.cardSubtitle}>Accès direct aux modules</p>
                  </div>
                </div>
              </div>
              
              <div className={styles.quickActionsGrid}>
                <QuickActionButton
                  icon="cart"
                  label="Nouvelle Vente"
                  color="primary"
                  onClick={handleNouvelleVente}
                />
                <QuickActionButton
                  icon="box"
                  label="Gestion Stock"
                  color="success"
                  onClick={handleGestionStock}
                />
                <QuickActionButton
                  icon="receipt"
                  label="Facturation"
                  color="accent"
                  onClick={handleHistoriqueFactures}
                />
                <QuickActionButton
                  icon="calculator"
                  label="Calculatrice"
                  color="warning"
                  onClick={() => {}}
                />
                <QuickActionButton
                  icon="tags"
                  label="Promotions"
                  color="info"
                  onClick={() => {}}
                />
                <QuickActionButton
                  icon="history"
                  label="Historique"
                  color="secondary"
                  onClick={handleHistoriqueFactures}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Top Produits */}
        <div className={`${styles.contentCard} ${styles.fullWidthCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleSection}>
              <IoBarChartOutline className={styles.cardIcon} />
              <div>
                <h3 className={styles.cardTitle}>Top Produits</h3>
                <p className={styles.cardSubtitle}>Les mieux vendus ce mois-ci</p>
              </div>
            </div>
            <div className={styles.categoryFilters}>
              <Button 
                variant={selectedCategory === 'all' ? "primary" : "outline"}
                size="small"
                onClick={() => setSelectedCategory('all')}
                className={styles.categoryBtn}
              >
                Tous
              </Button>
              <Button 
                variant={selectedCategory === 'materiaux' ? "primary" : "outline"}
                size="small"
                onClick={() => setSelectedCategory('materiaux')}
                className={styles.categoryBtn}
              >
                Matériaux
              </Button>
              <Button 
                variant={selectedCategory === 'quincaillerie' ? "primary" : "outline"}
                size="small"
                onClick={() => setSelectedCategory('quincaillerie')}
                className={styles.categoryBtn}
              >
                Quincaillerie
              </Button>
              <Button 
                variant={selectedCategory === 'peinture' ? "primary" : "outline"}
                size="small"
                onClick={() => setSelectedCategory('peinture')}
                className={styles.categoryBtn}
              >
                Peinture
              </Button>
            </div>
          </div>
          
          <div className={styles.topProduitsGrid}>
            {topProduits.map((produit, index) => (
              <TopProduitCard 
                key={produit.id} 
                produit={produit} 
                rank={index + 1}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        {/* Section Statistiques Vendeur */}
        <section className={styles.dashboardSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <FaChartLine className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Statistiques Commerciales</h2>
            </div>
          </div>
          
          <div className={styles.statsGridSecondary}>
            <StatCard
              title="Panier Moyen"
              value={formatMontant(stats.panierMoyen)}
              icon={<GiShoppingBag />}
              color="primary"
              trend={5.3}
              description="Valeur moyenne par vente"
              delay={100}
            />
            <StatCard
              title="Clients Actifs"
              value={stats.clientsActifs}
              icon={<FaUsers />}
              color="success"
              trend={12.1}
              description="Ce mois-ci"
              delay={200}
            />
            <StatCard
              title="Ventes en Attente"
              value={stats.ventesEnAttente}
              icon={<IoTimeOutline />}
              color="warning"
              trend={-2.5}
              description="À finaliser"
              delay={300}
            />
            <StatCard
              title="Réussite Vente"
              value={stats.reussiteVente}
              suffix="%"
              icon={<IoCheckmarkCircleOutline />}
              color="gradient"
              trend={1.5}
              description="Taux de succès"
              delay={400}
            />
          </div>
        </section>

        {/* Footer */}
        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;