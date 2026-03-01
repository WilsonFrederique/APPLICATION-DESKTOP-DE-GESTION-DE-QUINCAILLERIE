import React, { useMemo, useState, useCallback } from 'react';
import styles from './Stocks.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import StockModal from './StockModal';
import {
    IoSearchOutline,
    IoWarningOutline,
    IoAddOutline
} from "react-icons/io5";
import {
    FaBoxOpen,
    FaWarehouse,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";
import {
    TbCategory,
    TbArrowsSort,
    TbCurrencyDollar
} from "react-icons/tb";

// Données mock de stock
const initialStocks = [
    {
        id: 1,
        nom: 'Ciment 50kg',
        reference: 'CIM-50KG',
        categorie: 'Matériaux Construction',
        stock: 15,
        seuilMin: 20,
        unite: 'sac',
        emplacement: 'Entrepôt A',
        prixAchat: 35000,
        prixVente: 50000,
        dernierMouvement: 'Réception',
        dateDernierMouvement: '2024-02-10'
    },
    {
        id: 2,
        nom: 'Tôle Galvanisée 3m',
        reference: 'TOL-GALV-3M',
        categorie: 'Ferronnerie',
        stock: 8,
        seuilMin: 10,
        unite: 'feuille',
        emplacement: 'Entrepôt B',
        prixAchat: 250000,
        prixVente: 300000,
        dernierMouvement: 'Sortie',
        dateDernierMouvement: '2024-02-12'
    },
    {
        id: 3,
        nom: 'Vis à Bois 5x50',
        reference: 'VIS-BOIS-5x50',
        categorie: 'Quincaillerie',
        stock: 1200,
        seuilMin: 500,
        unite: 'pièce',
        emplacement: 'Rayon 2',
        prixAchat: 150,
        prixVente: 250,
        dernierMouvement: 'Réception',
        dateDernierMouvement: '2024-02-05'
    },
    {
        id: 4,
        nom: 'Peinture Blanche 10L',
        reference: 'PEINT-BLANC-10L',
        categorie: 'Peinture',
        stock: 5,
        seuilMin: 15,
        unite: 'pot',
        emplacement: 'Rayon 4',
        prixAchat: 80000,
        prixVente: 120000,
        dernierMouvement: 'Sortie',
        dateDernierMouvement: '2024-03-01'
    }
];

// Données mock des produits (normalement récupérées depuis Produits.jsx ou une API)
const mockProducts = [
    {
        id: 1,
        nom: 'Ciment 50kg',
        reference: 'CIM-50KG',
        categorie: 'Matériaux Construction',
        stock: 15,
        seuilMin: 20,
        unite: 'sac',
        emplacement: 'Entrepôt A',
        prixAchat: 35000
    },
    {
        id: 2,
        nom: 'Tôle Galvanisée 3m',
        reference: 'TOL-GALV-3M',
        categorie: 'Ferronnerie',
        stock: 8,
        seuilMin: 10,
        unite: 'feuille',
        emplacement: 'Entrepôt B',
        prixAchat: 250000
    },
    {
        id: 3,
        nom: 'Vis à Bois 5x50',
        reference: 'VIS-BOIS-5x50',
        categorie: 'Quincaillerie',
        stock: 1200,
        seuilMin: 500,
        unite: 'pièce',
        emplacement: 'Rayon 2',
        prixAchat: 150
    },
    {
        id: 4,
        nom: 'Peinture Blanche 10L',
        reference: 'PEINT-BLANC-10L',
        categorie: 'Peinture',
        stock: 5,
        seuilMin: 15,
        unite: 'pot',
        emplacement: 'Rayon 4',
        prixAchat: 80000
    }
];

const Stocks = () => {
    const [stocks, setStocks] = useState(initialStocks);
    const [products] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all'); // all, critical, low, ok, out
    const [sortBy, setSortBy] = useState('nom'); // nom, stock, valeur
    const [showStockModal, setShowStockModal] = useState(false);
    const [editingStockItem, setEditingStockItem] = useState(null);

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }, []);

    const categories = useMemo(() => {
        const unique = [...new Set(stocks.map(s => s.categorie))];
        return unique.sort((a, b) => a.localeCompare(b));
    }, [stocks]);

    const enhancedStocks = useMemo(() => {
        return stocks.map(item => {
            let status = 'ok';
            let statusLabel = 'Stock correct';

            if (item.stock === 0) {
                status = 'out';
                statusLabel = 'Rupture';
            } else if (item.stock <= item.seuilMin * 0.5) {
                status = 'critical';
                statusLabel = 'Critique';
            } else if (item.stock <= item.seuilMin) {
                status = 'low';
                statusLabel = 'Faible';
            }

            const valeurStock = item.stock * item.prixAchat;

            return {
                ...item,
                status,
                statusLabel,
                valeurStock
            };
        });
    }, [stocks]);

    const filteredStocks = useMemo(() => {
        let filtered = [...enhancedStocks];

        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.nom.toLowerCase().includes(q) ||
                item.reference.toLowerCase().includes(q) ||
                item.categorie.toLowerCase().includes(q) ||
                item.emplacement.toLowerCase().includes(q)
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.categorie === selectedCategory);
        }

        if (stockFilter !== 'all') {
            filtered = filtered.filter(item => item.status === stockFilter);
        }

        filtered.sort((a, b) => {
            if (sortBy === 'nom') {
                return a.nom.localeCompare(b.nom);
            }
            if (sortBy === 'stock') {
                return b.stock - a.stock;
            }
            if (sortBy === 'valeur') {
                return b.valeurStock - a.valeurStock;
            }
            return 0;
        });

        return filtered;
    }, [enhancedStocks, searchTerm, selectedCategory, stockFilter, sortBy]);

    const stats = useMemo(() => {
        const totalArticles = stocks.length;
        const totalQuantite = stocks.reduce((sum, s) => sum + s.stock, 0);
        const totalValeur = stocks.reduce((sum, s) => sum + (s.stock * s.prixAchat), 0);
        const critique = enhancedStocks.filter(s => s.status === 'critical').length;
        const faible = enhancedStocks.filter(s => s.status === 'low').length;
        const rupture = enhancedStocks.filter(s => s.status === 'out').length;

        return {
            totalArticles,
            totalQuantite,
            totalValeur,
            critique,
            faible,
            rupture
        };
    }, [stocks, enhancedStocks]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setStockFilter('all');
        setSortBy('nom');
    };

    const handleAddStock = () => {
        setEditingStockItem(null);
        setShowStockModal(true);
    };

    const handleAdjustStock = (stockItem) => {
        setEditingStockItem(stockItem);
        setShowStockModal(true);
    };

    const handleSaveStockMovement = (mouvementData) => {
        // Mettre à jour le stock du produit
        const updatedStocks = stocks.map(stock => {
            if (stock.id === mouvementData.produitId) {
                let mouvementLabel = 'Ajustement';
                if (mouvementData.typeMouvement === 'reception') {
                    mouvementLabel = 'Réception';
                } else if (mouvementData.typeMouvement === 'sortie') {
                    mouvementLabel = 'Sortie';
                }

                return {
                    ...stock,
                    stock: mouvementData.stockApres,
                    dernierMouvement: mouvementLabel,
                    dateDernierMouvement: mouvementData.date
                };
            }
            return stock;
        });

        setStocks(updatedStocks);
        setShowStockModal(false);
        setEditingStockItem(null);
    };

    return (
        <div className={styles.dashboardModern}>
            <div className={styles.splitScreenContainer}>
                {/* Colonne gauche - Liste des stocks */}
                <div className={styles.stocksListColumn}>
                    <div className={styles.stocksListHeader}>
                        <div className={styles.navigationTabsInline}>
                            <h2 className={styles.pageTitle}>Gestion de Stock</h2>
                            <p className={styles.pageSubtitle}>
                                Visualisez rapidement les niveaux de stock, les ruptures et les articles critiques.
                            </p>
                        </div>

                        {/* Filtres */}
                        <div className={styles.filtersRow}>
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, référence, catégorie, emplacement..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                name="stockSearch"
                                className={styles.searchInput}
                                icon={<IoSearchOutline />}
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
                                value={stockFilter}
                                onChange={setStockFilter}
                                options={[
                                    { value: 'all', label: 'Tous les statuts' },
                                    { value: 'critical', label: 'Critique' },
                                    { value: 'low', label: 'Faible' },
                                    { value: 'ok', label: 'Correct' },
                                    { value: 'out', label: 'Rupture' }
                                ]}
                                placeholder="État du stock"
                                variant="outline"
                                icon={<FaBoxOpen />}
                                fullWidth
                            />

                            <InputSelect
                                value={sortBy}
                                onChange={setSortBy}
                                options={[
                                    { value: 'nom', label: 'Nom' },
                                    { value: 'stock', label: 'Quantité' },
                                    { value: 'valeur', label: 'Valeur' }
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
                                onClick={handleAddStock}
                                className={styles.addBtn}
                            >
                                Nouveau stock
                            </Button>
                        </div>
                    </div>

                    {/* Liste des stocks */}
                    <div className={styles.stocksListContainer}>
                        <div className={styles.stocksListScroll}>
                            {filteredStocks.length > 0 ? (
                                <div className={styles.stocksTable}>
                                    <div className={styles.tableHeader}>
                                        <div className={styles.colProduit}>Produit</div>
                                        <div className={styles.colCategorie}>Catégorie</div>
                                        <div className={styles.colStock}>Stock</div>
                                        <div className={styles.colValeur}>Valeur</div>
                                        <div className={styles.colStatus}>Statut</div>
                                        <div className={styles.colMouvement}>Dernier mouvement</div>
                                        <div className={styles.colActions}>Actions</div>
                                    </div>

                                    {filteredStocks.map(item => (
                                        <div
                                            key={item.id}
                                            className={`${styles.tableRow} ${styles[item.status]}`}
                                        >
                                            <div className={styles.colProduit}>
                                                <div className={styles.productName}>{item.nom}</div>
                                                <div className={styles.productRef}>{item.reference}</div>
                                            </div>
                                            <div className={styles.colCategorie}>
                                                <span className={styles.categoryBadge}>{item.categorie}</span>
                                            </div>
                                            <div className={styles.colStock}>
                                                <span className={styles.stockValue}>{item.stock} {item.unite}</span>
                                                <span className={styles.stockSeuil}>Seuil: {item.seuilMin}</span>
                                            </div>
                                            <div className={styles.colValeur}>
                                                <span className={styles.valeurValue}>
                                                    {formatCurrency(item.valeurStock)}
                                                </span>
                                            </div>
                                            <div className={styles.colStatus}>
                                                <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                                                    {item.statusLabel}
                                                </span>
                                            </div>
                                            <div className={styles.colMouvement}>
                                                <span className={styles.mouvementType}>{item.dernierMouvement}</span>
                                                <span className={styles.mouvementDate}>{item.dateDernierMouvement}</span>
                                            </div>
                                            <div className={styles.colActions}>
                                                <Button
                                                    variant="ghost"
                                                    size="small"
                                                    icon="edit"
                                                    onClick={() => handleAdjustStock(item)}
                                                    className={styles.actionBtn}
                                                >
                                                    Ajuster
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noStocks}>
                                    <FaBoxOpen className={styles.noStocksIcon} />
                                    <h3>Aucun article trouvé</h3>
                                    <p>Aucun stock ne correspond à vos critères de recherche.</p>
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
                                <FaBoxOpen />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.totalArticles}</span>
                                <span className={styles.statLabel}>Articles suivis</span>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.info}`}>
                                <FaWarehouse />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{stats.totalQuantite}</span>
                                <span className={styles.statLabel}>Quantité totale</span>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.success}`}>
                                <TbCurrencyDollar />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>{formatCurrency(stats.totalValeur)}</span>
                                <span className={styles.statLabel}>Valeur du stock</span>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={`${styles.statIcon} ${styles.warning}`}>
                                <IoWarningOutline />
                            </div>
                            <div className={styles.statContent}>
                                <span className={styles.statValue}>
                                    {stats.critique + stats.faible + stats.rupture}
                                </span>
                                <span className={styles.statLabel}>Alertes stock</span>
                            </div>
                        </div>
                    </div>

                    {(stats.critique > 0 || stats.faible > 0 || stats.rupture > 0) && (
                        <div className={styles.alertBox}>
                            <IoWarningOutline />
                            <div>
                                <strong>Articles nécessitant une attention rapide</strong>
                                <p>
                                    {stats.rupture > 0 && (
                                        <span>{stats.rupture} en rupture. </span>
                                    )}
                                    {stats.critique > 0 && (
                                        <span>{stats.critique} en stock critique. </span>
                                    )}
                                    {stats.faible > 0 && (
                                        <span>{stats.faible} en stock faible.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={styles.trendsCard}>
                        <div className={styles.trendsHeader}>
                            <h3>Tendance rapide</h3>
                        </div>
                        <div className={styles.trendsContent}>
                            <div className={styles.trendItem}>
                                <div className={styles.trendIcon}>
                                    <FaArrowUp />
                                </div>
                                <div>
                                    <p className={styles.trendLabel}>Entrées récentes</p>
                                    <p className={styles.trendValue}>+ 3 mouvements</p>
                                </div>
                            </div>
                            <div className={styles.trendItem}>
                                <div className={styles.trendIcon}>
                                    <FaArrowDown />
                                </div>
                                <div>
                                    <p className={styles.trendLabel}>Sorties récentes</p>
                                    <p className={styles.trendValue}>- 5 mouvements</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal d'ajout/ajustement de stock */}
            {showStockModal && (
                <StockModal
                    isOpen={showStockModal}
                    onClose={() => {
                        setShowStockModal(false);
                        setEditingStockItem(null);
                    }}
                    onSave={handleSaveStockMovement}
                    products={products}
                    stockItem={editingStockItem}
                />
            )}
        </div>
    );
};

export default Stocks;

