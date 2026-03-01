import React, { useState, useMemo, useCallback } from 'react';
import styles from './Produits.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import ProductModal from './ProductModal';
import CategoryModal from './CategoryModal';
import {
  IoSearchOutline,
  IoAddOutline,
  IoWarningOutline,
  IoPencilOutline,
  IoTrashOutline
} from "react-icons/io5";
import {
  FaBox,
  FaTags,
  FaWarehouse
} from "react-icons/fa";
import {
  TbCategory,
  TbCurrencyDollar,
  TbArrowsSort
} from "react-icons/tb";

// Images d'exemple pour les produits
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
];

// Données mock
const initialProducts = [
  {
    id: 1,
    nom: 'Ciment 50kg',
    reference: 'CIM-50KG',
    categorie: 'Matériaux Construction',
    description: 'Ciment Portland de haute qualité pour construction générale.',
    stock: 15,
    seuilMin: 20,
    prixAchat: 35000,
    prixVente: 50000,
    prixDetail: 1000,
    unite: 'sac',
    uniteDetail: 'kg',
    peutEtreVenduEnDetail: true,
    emplacement: 'Entrepôt A',
    fournisseur: 'Lafarge',
    tva: 20,
    image: productImages[0],
    dateAjout: '2024-01-15'
  },
  {
    id: 2,
    nom: 'Tôle Galvanisée 3m',
    reference: 'TOL-GALV-3M',
    categorie: 'Ferronnerie',
    description: 'Tôle galvanisée de 3m, épaisseur 0.5mm.',
    stock: 8,
    seuilMin: 10,
    prixAchat: 250000,
    prixVente: 300000,
    unite: 'feuille',
    peutEtreVenduEnDetail: false,
    emplacement: 'Entrepôt B',
    fournisseur: 'MetalPro',
    tva: 20,
    image: productImages[1],
    dateAjout: '2024-02-10'
  },
  {
    id: 3,
    nom: 'Vis à Bois 5x50',
    reference: 'VIS-BOIS-5x50',
    categorie: 'Quincaillerie',
    description: 'Vis à bois tête plate, acier galvanisé.',
    stock: 1200,
    seuilMin: 500,
    prixAchat: 150,
    prixVente: 250,
    prixDetail: 10,
    unite: 'pièce',
    uniteDetail: 'pièce',
    peutEtreVenduEnDetail: true,
    emplacement: 'Rayon 2',
    fournisseur: 'Bricolux',
    tva: 20,
    image: productImages[2],
    dateAjout: '2024-01-20'
  },
  {
    id: 4,
    nom: 'Peinture Blanche 10L',
    reference: 'PEINT-BLANC-10L',
    categorie: 'Peinture',
    description: 'Peinture blanche mate pour intérieur.',
    stock: 5,
    seuilMin: 15,
    prixAchat: 80000,
    prixVente: 120000,
    prixDetail: 12000,
    unite: 'pot',
    uniteDetail: 'L',
    peutEtreVenduEnDetail: true,
    emplacement: 'Rayon 4',
    fournisseur: 'Dulux',
    tva: 20,
    image: productImages[3],
    dateAjout: '2024-03-01'
  },
  {
    id: 5,
    nom: 'Clou 10cm',
    reference: 'CLOU-10CM',
    categorie: 'Quincaillerie',
    description: 'Clou à béton 10cm.',
    stock: 2000,
    seuilMin: 500,
    prixAchat: 50,
    prixVente: 100,
    prixDetail: 5,
    unite: 'kg',
    uniteDetail: 'pièce',
    peutEtreVenduEnDetail: true,
    emplacement: 'Rayon 3',
    fournisseur: 'MetalPro',
    tva: 20,
    image: productImages[4],
    dateAjout: '2024-02-15'
  }
];

// Composant carte catégorie
const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryIcon}>
        <TbCategory />
      </div>
      <div className={styles.categoryContent}>
        <div className={styles.categoryHeader}>
          <h3 className={styles.categoryName}>{category.nom}</h3>
          <div className={styles.categoryBadge}>
            {category.produitsCount} produit{category.produitsCount > 1 ? 's' : ''}
          </div>
        </div>
        {category.description && (
          <p className={styles.categoryDescription}>{category.description}</p>
        )}
        <div className={styles.categoryMeta}>
          <span className={styles.categoryDate}>
            Créée le {new Date(category.dateCreation).toLocaleDateString('fr-FR')}
          </span>
        </div>
        <div className={styles.categoryActions}>
          <Button
            variant="ghost"
            icon="edit"
            onClick={() => onEdit(category)}
            className={styles.actionBtn}
          >
            Modifier
          </Button>
          <Button
            variant="ghost"
            icon="trash"
            onClick={() => onDelete(category)}
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant carte produit
const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { label: 'Rupture', class: 'out' };
    if (product.stock <= product.seuilMin) return { label: 'Critique', class: 'critical' };
    if (product.stock <= product.seuilMin * 1.5) return { label: 'Faible', class: 'warning' };
    return { label: 'Bon', class: 'good' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || productImages[0]} alt={product.nom} />
        <div className={`${styles.stockBadge} ${styles[stockStatus.class]}`}>
          {stockStatus.label}
        </div>
        {product.stock <= product.seuilMin && (
          <div className={styles.stockWarning}>
            <IoWarningOutline />
          </div>
        )}
      </div>

      <div className={styles.productContent}>
        <div className={styles.productHeader}>
          <h4 className={styles.productName}>{product.nom}</h4>
          <span className={styles.productRef}>{product.reference}</span>
        </div>

        <div className={styles.productCategory}>
          <FaTags />
          <span>{product.categorie}</span>
        </div>

        <div className={styles.productDetails}>
          <div className={styles.detailItem}>
            <FaWarehouse />
            <span>Stock: <strong>{product.stock}</strong> {product.unite}</span>
          </div>
          <div className={styles.detailItem}>
            <TbCurrencyDollar />
            <span>Prix: <strong>{formatCurrency(product.prixVente)}</strong></span>
          </div>
        </div>

        <div className={styles.productActions}>
          <Button
            variant="ghost"
            icon="eye"
            onClick={() => onView(product)}
            className={styles.actionBtn}
          >
            Voir détails
          </Button>
          <Button
            variant="ghost"
            icon="edit"
            onClick={() => onEdit(product)}
            className={styles.actionBtn}
          >
            Modifier
          </Button>
          <Button
            variant="ghost"
            icon="trash"
            onClick={() => onDelete(product)}
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
};

const Produits = () => {
  const [products, setProducts] = useState(initialProducts);
  const [viewMode, setViewMode] = useState('products'); // 'products', 'categories'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('nom');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // États pour les catégories
  const [categoriesList, setCategoriesList] = useState([
    { id: 1, nom: 'Matériaux Construction', description: 'Ciment, sable, gravier, etc.', produitsCount: 2, dateCreation: '2024-01-15' },
    { id: 2, nom: 'Ferronnerie', description: 'Tôles, barres, profilés métalliques', produitsCount: 1, dateCreation: '2024-01-20' },
    { id: 3, nom: 'Quincaillerie', description: 'Vis, clous, boulons, écrous', produitsCount: 2, dateCreation: '2024-01-10' },
    { id: 4, nom: 'Peinture', description: 'Peintures, vernis, enduits', produitsCount: 1, dateCreation: '2024-02-01' }
  ]);
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Extraire les catégories uniques des produits et synchroniser avec categoriesList
  const categories = useMemo(() => {
    const uniqueCats = [...new Set(products.map(p => p.categorie))];
    // Mettre à jour le nombre de produits par catégorie
    const updatedCategories = categoriesList.map(cat => ({
      ...cat,
      produitsCount: products.filter(p => p.categorie === cat.nom).length
    }));
    // Ajouter les catégories qui existent dans les produits mais pas dans la liste
    uniqueCats.forEach(catName => {
      if (!updatedCategories.find(c => c.nom === catName)) {
        updatedCategories.push({
          id: Date.now() + Math.random(),
          nom: catName,
          description: '',
          produitsCount: products.filter(p => p.categorie === catName).length,
          dateCreation: new Date().toISOString().split('T')[0]
        });
      }
    });
    return updatedCategories.sort((a, b) => a.nom.localeCompare(b.nom));
  }, [products, categoriesList]);

  // Filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categorie.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categorie === selectedCategory);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy === 'nom' ? 'nom' : sortBy === 'stock' ? 'stock' : 'prixVente'];
      let bValue = b[sortBy === 'nom' ? 'nom' : sortBy === 'stock' ? 'stock' : 'prixVente'];

      if (sortBy === 'nom') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }

      return bValue - aValue;
    });

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Statistiques
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const criticalStock = products.filter(p => p.stock <= p.seuilMin).length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.prixAchat), 0);
    const categoriesCount = categories.length;
    const totalProductsInCategories = categories.reduce((sum, cat) => sum + cat.produitsCount, 0);

    return { totalProducts, criticalStock, totalValue, categoriesCount, totalProductsInCategories };
  }, [products, categories]);

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === productData.id ? productData : p));
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        image: productData.image || productImages[Math.floor(Math.random() * productImages.length)]
      };
      setProducts([...products, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (product) => {
    if (globalThis.confirm && globalThis.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      setProducts(products.filter(p => p.id !== product.id));
    }
  };

  const handleViewProduct = (product) => {
    // Navigation vers la page de détail si nécessaire
    console.log('Voir produit:', product);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('nom');
  };

  // Gestion des catégories
  const filteredCategories = useMemo(() => {
    if (!categorySearchTerm) return categories;
    return categories.filter(cat =>
      cat.nom.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(categorySearchTerm.toLowerCase()))
    );
  }, [categories, categorySearchTerm]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      // Mettre à jour
      const updatedCategories = categoriesList.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, nom: categoryData.nom.trim(), description: categoryData.description.trim() || '' }
          : cat
      );
      setCategoriesList(updatedCategories);

      // Mettre à jour les produits qui utilisent cette catégorie
      setProducts(products.map(p =>
        p.categorie === editingCategory.nom
          ? { ...p, categorie: categoryData.nom.trim() }
          : p
      ));
    } else {
      // Vérifier si la catégorie existe déjà
      if (categoriesList.some(cat => cat.nom.toLowerCase() === categoryData.nom.trim().toLowerCase())) {
        alert('Cette catégorie existe déjà');
        return;
      }

      const newCategory = {
        id: categoryData.id || Date.now(),
        nom: categoryData.nom.trim(),
        description: categoryData.description.trim() || '',
        produitsCount: 0,
        dateCreation: categoryData.dateCreation || new Date().toISOString().split('T')[0]
      };
      setCategoriesList([...categoriesList, newCategory]);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = (category) => {
    if (category.produitsCount > 0) {
      alert(`Impossible de supprimer cette catégorie car elle contient ${category.produitsCount} produit(s).`);
      return;
    }

    if (globalThis.confirm && globalThis.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.nom}" ?`)) {
      setCategoriesList(categoriesList.filter(cat => cat.id !== category.id));
    }
  };

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.splitScreenContainer}>
        {/* Colonne gauche - Liste des produits */}
        <div className={styles.productsListColumn}>
          <div className={styles.productsListHeader}>
            {/* Navigation tabs */}
            <div className={styles.navigationTabsInline}>
              <Button
                variant={viewMode === 'products' ? 'primary' : 'ghost'}
                size="medium"
                icon="box"
                onClick={() => setViewMode('products')}
                className={`${styles.tabBtnInline} ${viewMode === 'products' ? styles.active : ''}`}
              >
                Produits
              </Button>
              <Button
                variant={viewMode === 'categories' ? 'primary' : 'ghost'}
                size="medium"
                icon="category"
                onClick={() => setViewMode('categories')}
                className={`${styles.tabBtnInline} ${viewMode === 'categories' ? styles.active : ''}`}
              >
                Catégories
              </Button>
            </div>

            {/* Filtres */}
            {viewMode === 'products' && (
              <div className={styles.venteFilters}>
                <Input
                  type="text"
                  placeholder="Rechercher produit, référence, catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  name="productSearch"
                  className={styles.searchInput}
                  icon={<IoSearchOutline />}
                />
                <InputSelect
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={[
                    { value: 'all', label: 'Toutes catégories' },
                    ...categories.map(cat => ({
                      value: cat.nom,
                      label: cat.nom
                    }))
                  ]}
                  placeholder="Catégorie"
                  variant="outline"
                  icon={<TbCategory />}
                  fullWidth
                />
                <InputSelect
                  value={sortBy}
                  onChange={setSortBy}
                  options={[
                    { value: 'nom', label: 'Nom' },
                    { value: 'prixVente', label: 'Prix' },
                    { value: 'stock', label: 'Stock' }
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
                  onClick={handleAddProduct}
                  className={styles.addBtn}
                >
                  Ajouter
                </Button>
              </div>
            )}

            {viewMode === 'categories' && (
              <div className={styles.venteFilters}>
                <Input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className={styles.searchInput}
                  icon={<IoSearchOutline />}
                />
                <Button
                  variant="primary"
                  size="medium"
                  icon="plus"
                  onClick={handleAddCategory}
                  className={styles.addBtn}
                >
                  Nouvelle catégorie
                </Button>
              </div>
            )}
          </div>

          {/* Contenu */}
          <div className={styles.productsListContainer}>
            <div className={styles.productsListScroll}>
              {viewMode === 'products' && (
                <>
                  {filteredProducts.length > 0 ? (
                    <div className={styles.productsGrid}>
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onView={handleViewProduct}
                          onEdit={handleEditProduct}
                          onDelete={handleDeleteProduct}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noProducts}>
                      <FaBox className={styles.noProductsIcon} />
                      <h3>Aucun produit trouvé</h3>
                      <p>Aucun produit ne correspond à vos critères de recherche.</p>
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
                </>
              )}

              {viewMode === 'categories' && (
                <>
                  {filteredCategories.length > 0 ? (
                    <div className={styles.categoriesGrid}>
                      {filteredCategories.map((category) => (
                        <CategoryCard
                          key={category.id}
                          category={category}
                          onEdit={handleEditCategory}
                          onDelete={handleDeleteCategory}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.noProducts}>
                      <TbCategory className={styles.noProductsIcon} />
                      <h3>Aucune catégorie trouvée</h3>
                      <p>Aucune catégorie ne correspond à votre recherche.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Colonne droite - Statistiques */}
        <div className={styles.statsColumn}>
          <div className={styles.statsHeader}>
            <h2>Statistiques</h2>
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <FaBox />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.totalProducts}</span>
                <span className={styles.statLabel}>Produits total</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <IoWarningOutline />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.criticalStock}</span>
                <span className={styles.statLabel}>Stock critique</span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <TbCategory />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{stats.categoriesCount}</span>
                <span className={styles.statLabel}>Catégories</span>
              </div>
            </div>

            {viewMode === 'categories' && (
              <div className={styles.statCard}>
                <div className={`${styles.statIcon} ${styles.info}`}>
                  <FaBox />
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{stats.totalProductsInCategories}</span>
                  <span className={styles.statLabel}>Produits classés</span>
                </div>
              </div>
            )}

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.info}`}>
                <TbCurrencyDollar />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statValue}>{formatCurrency(stats.totalValue)}</span>
                <span className={styles.statLabel}>Valeur stock</span>
              </div>
            </div>
          </div>

          {stats.criticalStock > 0 && (
            <div className={styles.alertBox}>
              <IoWarningOutline />
              <div>
                <strong>{stats.criticalStock} produit(s) en stock critique</strong>
                <p>Nécessite un réapprovisionnement urgent</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'ajout/modification produit */}
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          product={editingProduct}
          categories={categories.map(c => c.nom)}
        />
      )}

      {/* Modal d'ajout/modification catégorie */}
      {showCategoryModal && (
        <CategoryModal
          isOpen={showCategoryModal}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={(categoryData) => {
            handleSaveCategory(categoryData);
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
        />
      )}
    </div>
  );
};

export default Produits;
