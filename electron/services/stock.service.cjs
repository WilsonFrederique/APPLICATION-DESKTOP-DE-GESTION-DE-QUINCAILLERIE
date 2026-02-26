const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../data/stocks.json');

// Créer le dossier data s'il n'existe pas
if (!fs.existsSync(path.dirname(dataPath))) {
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
}

// Charger les données depuis le fichier
function loadData() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
  }
  return [];
}

// Sauvegarder les données dans le fichier
function saveData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  }
}

function getAll() {
  return loadData();
}

function add(product) {
  const stocks = loadData();
  const newProduct = {
    ...product,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    qty: parseInt(product.qty) || 0
  };
  stocks.push(newProduct);
  saveData(stocks);
  return { success: true, id: newProduct.id };
}

// Ajouter d'autres fonctions utiles
function update(id, updates) {
  const stocks = loadData();
  const index = stocks.findIndex(s => s.id === id);
  if (index !== -1) {
    stocks[index] = { ...stocks[index], ...updates };
    saveData(stocks);
    return { success: true };
  }
  return { success: false, error: 'Produit non trouvé' };
}

function remove(id) {
  const stocks = loadData();
  const filtered = stocks.filter(s => s.id !== id);
  if (filtered.length !== stocks.length) {
    saveData(filtered);
    return { success: true };
  }
  return { success: false, error: 'Produit non trouvé' };
}

module.exports = { getAll, add, update, remove };