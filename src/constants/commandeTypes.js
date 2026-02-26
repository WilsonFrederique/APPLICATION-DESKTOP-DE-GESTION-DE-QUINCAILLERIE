// commandesTypes.js
export const COMMANDE_TYPES = {
  EN_COURS: 'en_cours',
  ARRIVEE_PARTIELLE: 'arrivee_partielle',
  VALIDEE: 'validee'
};

// Options pour les filtres
export const statutOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'arrivee_partielle', label: 'Arrivée partielle' },
  { value: 'validee', label: 'Validée' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmée', label: 'Confirmée' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'livrée', label: 'Livrée' },
  { value: 'facturée', label: 'Facturée' },
  { value: 'annulée', label: 'Annulée' },
  { value: 'retard', label: 'Retard' }
];

export const paiementOptions = [
  { value: 'all', label: 'Tous les paiements' },
  { value: 'payée', label: 'Payée' },
  { value: 'acompte', label: 'Acompte' },
  { value: 'à crédit', label: 'À crédit' },
  { value: 'en_attente', label: 'En attente' },
  { value: 'remboursée', label: 'Remboursée' }
];

export const prioriteOptions = [
  { value: 'all', label: 'Toutes priorités' },
  { value: 'haute', label: 'Haute' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'basse', label: 'Basse' }
];

// Mock data pour les commandes - EXACTEMENT 7 commandes
export const mockCommandes = [
  // 4 Commandes EN COURS
  {
    id: 1,
    numero: "CMD-2024-00158",
    client: "SARL Batiment Plus",
    date: "2024-03-20",
    dateLivraison: "2024-03-25",
    statut: "en_cours",
    montant: 1250000,
    paiement: "payée",
    typeLivraison: "livraison",
    articles: 12,
    priorite: "haute",
    vendeur: "Marie Rasoa",
    notes: "Client fidèle, livraison urgente",
    produits: [
      { id: 1, nom: "Ciment 50kg", qty: 100, prix: 25000, qtyRecue: 0 },
      { id: 2, nom: "Tôle galvanisée", qty: 50, prix: 15000, qtyRecue: 0 },
      { id: 3, nom: "Tuyaux PVC 3m", qty: 200, prix: 8000, qtyRecue: 0 }
    ],
    typeCommande: 'en_cours',
    adresseLivraison: "Lotissement ABC, Tanjombato",
    telephone: "+261 32 12 345 67",
    email: "contact@batimentplus.mg",
    conditionPaiement: "30 jours",
    remise: 0,
    fraisLivraison: 25000
  },
  {
    id: 5,
    numero: "CMD-2024-00154",
    client: "Particulier - M. Rabe",
    date: "2024-03-16",
    dateLivraison: "2024-03-18",
    statut: "en_cours",
    montant: 180000,
    paiement: "en_attente",
    typeLivraison: "livraison",
    articles: 3,
    priorite: "moyenne",
    vendeur: "Marie Rasoa",
    notes: "Paiement en attente",
    produits: [
      { id: 1, nom: "Outillage", qty: 1, prix: 150000, qtyRecue: 0 },
      { id: 2, nom: "Gants travail", qty: 2, prix: 15000, qtyRecue: 0 }
    ],
    typeCommande: 'en_cours',
    adresseLivraison: "123 Avenue de l'Indépendance",
    telephone: "+261 34 56 78 90",
    email: "rabe@email.com",
    conditionPaiement: "Comptant",
    remise: 10000,
    fraisLivraison: 15000
  },
  {
    id: 7,
    numero: "CMD-2024-00152",
    client: "Société Immobilière",
    date: "2024-03-14",
    dateLivraison: "2024-03-28",
    statut: "en_cours",
    montant: 2850000,
    paiement: "acompte",
    typeLivraison: "livraison",
    articles: 32,
    priorite: "haute",
    vendeur: "Jean Rakoto",
    notes: "Grand chantier, acompte 30%",
    produits: [
      { id: 1, nom: "Portes métalliques", qty: 20, prix: 80000, qtyRecue: 0 },
      { id: 2, nom: "Fenêtres PVC", qty: 40, prix: 45000, qtyRecue: 0 }
    ],
    typeCommande: 'en_cours',
    adresseLivraison: "Complexe Immobilier, Ivandry",
    telephone: "+261 20 22 333 44",
    email: "contact@immobilier.mg",
    conditionPaiement: "30 jours",
    remise: 50000,
    fraisLivraison: 50000
  },
  {
    id: 8,
    numero: "CMD-2024-00151",
    client: "Boulangerie Mamy",
    date: "2024-03-13",
    dateLivraison: "2024-03-15",
    statut: "en_cours",
    montant: 380000,
    paiement: "en_attente",
    typeLivraison: "à emporter",
    articles: 7,
    priorite: "moyenne",
    vendeur: "Lucie Rajoelina",
    notes: "Livraison retardée - stock manquant",
    produits: [
      { id: 1, nom: "Plan de travail", qty: 1, prix: 250000, qtyRecue: 0 },
      { id: 2, nom: "Étagères métal", qty: 6, prix: 21666, qtyRecue: 0 }
    ],
    typeCommande: 'en_cours',
    adresseLivraison: "N/A (À emporter)",
    telephone: "+261 33 12 34 56",
    email: "mamy@boulangerie.mg",
    conditionPaiement: "Comptant",
    remise: 0,
    fraisLivraison: 0
  },
  
  // 2 Commandes ARRIVÉE PARTIELLE
  {
    id: 2,
    numero: "CMD-2024-00157",
    client: "Entreprise Rakoto",
    date: "2024-03-19",
    dateLivraison: "2024-03-22",
    statut: "arrivee_partielle",
    montant: 850000,
    paiement: "acompte",
    typeLivraison: "à emporter",
    articles: 8,
    priorite: "moyenne",
    vendeur: "Robert Andria",
    notes: "Acompte de 50% reçu",
    produits: [
      { id: 1, nom: "Peinture blanche", qty: 20, prix: 18000, qtyRecue: 10 },
      { id: 2, nom: "Pinceaux", qty: 50, prix: 3000, qtyRecue: 50 }
    ],
    typeCommande: 'arrivee_partielle',
    adresseLivraison: "N/A (À emporter)",
    telephone: "+261 32 11 22 33",
    email: "rakoto@entreprise.mg",
    conditionPaiement: "30 jours",
    remise: 25000,
    fraisLivraison: 0
  },
  {
    id: 6,
    numero: "CMD-2024-00153",
    client: "Restaurant Chez Lala",
    date: "2024-03-15",
    dateLivraison: "2024-03-17",
    statut: "arrivee_partielle",
    montant: 920000,
    paiement: "payée",
    typeLivraison: "livraison",
    articles: 15,
    priorite: "haute",
    vendeur: "Robert Andria",
    notes: "Facture émise",
    produits: [
      { id: 1, nom: "Évier inox", qty: 2, prix: 250000, qtyRecue: 1 },
      { id: 2, nom: "Robinets", qty: 10, prix: 35000, qtyRecue: 10 }
    ],
    typeCommande: 'arrivee_partielle',
    adresseLivraison: "Rue du Commerce, Analakely",
    telephone: "+261 34 88 99 00",
    email: "lala@restaurant.mg",
    conditionPaiement: "Comptant",
    remise: 30000,
    fraisLivraison: 20000
  },
  
  // 1 Commande VALIDÉE
  {
    id: 3,
    numero: "CMD-2024-00156",
    client: "Hotel Crystal",
    date: "2024-03-18",
    dateLivraison: "2024-03-30",
    statut: "validee",
    montant: 3200000,
    paiement: "payée",
    typeLivraison: "livraison",
    articles: 25,
    priorite: "basse",
    vendeur: "Jean Rakoto",
    notes: "Commande spéciale, délai 2 semaines",
    produits: [
      { id: 1, nom: "Carreaux céramique", qty: 500, prix: 3500, qtyRecue: 500 },
      { id: 2, nom: "Ciment colle", qty: 100, prix: 12000, qtyRecue: 100 }
    ],
    typeCommande: 'validee',
    adresseLivraison: "Zone Touristique, Nosy Be",
    telephone: "+261 20 86 410 00",
    email: "reservation@hotel-crystal.mg",
    conditionPaiement: "60 jours",
    remise: 100000,
    fraisLivraison: 75000
  }
];

// Note: On a supprimé la commande ID 4 pour avoir exactement 7 commandes
// Total: 4 en cours + 2 arrivée partielle + 1 validée = 7 commandes