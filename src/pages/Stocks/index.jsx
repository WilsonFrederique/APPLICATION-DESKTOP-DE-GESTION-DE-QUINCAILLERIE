import React, { useMemo, useState } from 'react';
import Input from '../../components/UI/Input/Input';
import InputSelect from '../../components/UI/Input/InputSelect';
import CategoryCarousel from '../../components/Sales/CategoryCarousel';
import StockModal from '../../components/Stock/StockModal';
import Bx from '../../components/UI/Boxicon';
import { formatAr } from '../../utils/function/format';

/* ─── Données mock ─── */
const initialStocks = [
    { id: 1, nom: 'Ciment 50kg', reference: 'CIM-50KG', categorie: 'Matériaux Construction', stock: 15, seuilMin: 20, unite: 'sac', prixAchat: 35000, prixVente: 50000 },
    { id: 2, nom: 'Tôle Galvanisée 3m', reference: 'TOL-GALV-3M', categorie: 'Ferronnerie', stock: 8, seuilMin: 10, unite: 'feuille', prixAchat: 250000, prixVente: 300000 },
    { id: 3, nom: 'Vis à Bois 5x50', reference: 'VIS-BOIS-5x50', categorie: 'Quincaillerie', stock: 1200, seuilMin: 500, unite: 'pièce', prixAchat: 150, prixVente: 250 },
    { id: 4, nom: 'Peinture Blanche 10L', reference: 'PEINT-BLANC-10L', categorie: 'Peinture', stock: 5, seuilMin: 15, unite: 'pot', prixAchat: 80000, prixVente: 120000 },
];

const mockProducts = initialStocks.map(({ id, nom, reference, categorie, stock, seuilMin, unite, prixAchat }) =>
    ({ id, nom, reference, categorie, stock, seuilMin, unite, prixAchat })
);

/* ─── Badge statut ─── */
const STATUS_CONFIG = {
    out: { label: 'Rupture', pill: 'bg-slate-100 text-slate-600', bar: 'bg-slate-400', border: 'border-l-slate-400' },
    critical: { label: 'Critique', pill: 'bg-red-100 text-red-700', bar: 'bg-red-500', border: 'border-l-red-500' },
    low: { label: 'Faible', pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', border: 'border-l-amber-400' },
    ok: { label: 'Correct', pill: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', border: 'border-l-emerald-500' },
};

const getStatus = (stock, seuilMin) => {
    if (stock === 0) return 'out';
    if (stock <= seuilMin * 0.5) return 'critical';
    if (stock <= seuilMin) return 'low';
    return 'ok';
};

/* ──────────────────────────────────────────── */
const Stocks = () => {
    const [stocks, setStocks] = useState(initialStocks);
    const [products] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [showStockModal, setShowStockModal] = useState(false);
    const [editingStockItem, setEditingStockItem] = useState(null);

    /* ── Catégories ── */
    const categories = useMemo(() =>
        [...new Set(stocks.map(s => s.categorie))].sort((a, b) => a.localeCompare(b)),
        [stocks]);

    const productCounts = useMemo(() => {
        const counts = { total: stocks.length };
        categories.forEach(cat => { counts[cat] = stocks.filter(s => s.categorie === cat).length; });
        return counts;
    }, [stocks, categories]);

    /* ── Stocks enrichis ── */
    const enhancedStocks = useMemo(() =>
        stocks.map(item => ({
            ...item,
            status: getStatus(item.stock, item.seuilMin),
            valeurStock: item.stock * item.prixAchat,
        })),
        [stocks]);

    /* ── Filtrés ── */
    const filteredStocks = useMemo(() => {
        let list = [...enhancedStocks];
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            list = list.filter(i =>
                i.nom.toLowerCase().includes(q) ||
                i.reference.toLowerCase().includes(q) ||
                i.categorie.toLowerCase().includes(q)
            );
        }
        if (selectedCategory !== 'all') list = list.filter(i => i.categorie === selectedCategory);
        if (stockFilter !== 'all') list = list.filter(i => i.status === stockFilter);
        return list.sort((a, b) => a.nom.localeCompare(b.nom));
    }, [enhancedStocks, searchTerm, selectedCategory, stockFilter]);

    /* ── Stats ── */
    const stats = useMemo(() => ({
        totalArticles: stocks.length,
        totalQuantite: stocks.reduce((s, i) => s + i.stock, 0),
        totalValeur: stocks.reduce((s, i) => s + i.stock * i.prixAchat, 0),
        critique: enhancedStocks.filter(i => i.status === 'critical').length,
        faible: enhancedStocks.filter(i => i.status === 'low').length,
        rupture: enhancedStocks.filter(i => i.status === 'out').length,
    }), [stocks, enhancedStocks]);

    const handleSaveStockMovement = (data) => {
        setStocks(prev => prev.map(s => s.id === data.produitId ? {
            ...s,
            stock: data.stockApres,
        } : s));
        setShowStockModal(false);
        setEditingStockItem(null);
    };

    const alertCount = stats.critique + stats.faible + stats.rupture;

    /* ────── JSX ────── */
    return (
        <div className="flex flex-col overflow-hidden bg-transparent h-full">
            <div className="grid grid-cols-[1fr_360px] gap-3 h-full p-3 overflow-hidden">

                {/* ══ Colonne gauche ══ */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col gap-3 px-4 pt-3 border-b border-slate-100 shrink-0">

                        <div>
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">Gestion de Stock</h2>
                        </div>

                        {/* Recherche + filtre statut + boutons */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Rechercher par nom, référence..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    name="stockSearch"
                                    icon={<Bx icon="search" className="text-lg" />}
                                />
                            </div>
                            <div className="w-44 shrink-0">
                                <InputSelect
                                    value={stockFilter}
                                    onChange={setStockFilter}
                                    options={[
                                        { value: 'all', label: 'Tous les statuts' },
                                        { value: 'critical', label: 'Critique' },
                                        { value: 'low', label: 'Faible' },
                                        { value: 'ok', label: 'Correct' },
                                        { value: 'out', label: 'Rupture' },
                                    ]}
                                    variant="outline"
                                    icon={<Bx icon="filter" className="text-lg" />}
                                    fullWidth
                                />
                            </div>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setStockFilter('all'); }}
                                className="w-11 h-11 shrink-0 flex items-center justify-center border border-slate-200 bg-white text-slate-500 rounded hover:bg-slate-50 hover:border-red-400 hover:text-red-500 transition-all"
                                title="Réinitialiser"
                            >
                                <Bx icon="reset" className="text-lg" />
                            </button>
                            <button
                                onClick={() => { setEditingStockItem(null); setShowStockModal(true); }}
                                className="flex items-center gap-2 px-4 h-11 shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded transition-all whitespace-nowrap"
                            >
                                <Bx icon="plus" className="text-lg" /> Nouveau stock
                            </button>
                        </div>

                        {/* Category Carousel */}
                        <CategoryCarousel
                            categories={categories}
                            selected={selectedCategory}
                            onChange={setSelectedCategory}
                            productCounts={productCounts}
                        />
                    </div>

                    {/* Tableau */}
                    <div className="flex-1 overflow-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] p-2">
                        {filteredStocks.length > 0 ? (
                            <table className="w-full border-collapse min-w-[560px] border border-slate-100">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        {['Produit', 'Stock', 'Valeur', 'Statut', 'Action'].map(h => (
                                            <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStocks.map(item => {
                                        const cfg = STATUS_CONFIG[item.status];
                                        return (
                                            <tr
                                                key={item.id}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                                            >
                                                {/* Produit */}
                                                <td className={`px-4 py-3.5 border-l-4 ${cfg.border}`}>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-base font-bold text-slate-800 leading-tight">{item.nom}</span>
                                                        <span className="text-sm text-slate-400 font-medium">{item.reference}</span>
                                                    </div>
                                                </td>

                                                {/* Stock */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xl font-black text-slate-800 leading-none">
                                                            {item.stock.toLocaleString('fr-FR')}
                                                            <span className="text-sm font-semibold text-slate-400 ml-1">{item.unite}</span>
                                                        </span>
                                                        <span className="text-xs text-slate-400">Seuil : {item.seuilMin}</span>
                                                        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full transition-all ${cfg.bar}`}
                                                                style={{ width: `${Math.min(100, Math.round((item.stock / (item.seuilMin * 2)) * 100))}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Valeur */}
                                                <td className="px-4 py-3.5">
                                                    <span className="text-base font-bold text-slate-700 whitespace-nowrap">{formatAr(item.valeurStock)}</span>
                                                </td>

                                                {/* Statut */}
                                                <td className="px-4 py-3.5">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${cfg.pill}`}>
                                                        {cfg.label}
                                                    </span>
                                                </td>

                                                {/* Action */}
                                                <td className="px-4 py-3.5">
                                                    <button
                                                        onClick={() => { setEditingStockItem(item); setShowStockModal(true); }}
                                                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all whitespace-nowrap"
                                                    >
                                                        <Bx icon="edit" className="text-base" /> Ajuster
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-500">
                                <Bx icon="box" className="text-6xl text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-1">Aucun article trouvé</h3>
                                <p className="text-base text-slate-400 mb-5">Aucun stock ne correspond à vos critères.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setSelectedCategory('all'); setStockFilter('all'); }}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded hover:bg-slate-50 transition-all"
                                >
                                    <Bx icon="reset" className="text-base" /> Réinitialiser les filtres
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══ Colonne droite — Stats ══ */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800">Vue d'ensemble</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">

                        {[
                            { icon: 'box', color: 'bg-sky-50 text-sky-500', value: stats.totalArticles, label: 'Articles suivis' },
                            { icon: 'buildings', color: 'bg-indigo-50 text-indigo-500', value: stats.totalQuantite.toLocaleString('fr-FR'), label: 'Quantité totale' },
                            { icon: 'dollar-circle', color: 'bg-emerald-50 text-emerald-600', value: formatAr(stats.totalValeur), label: 'Valeur du stock' },
                            { icon: 'error-circle', color: 'bg-amber-50 text-amber-500', value: alertCount, label: 'Alertes stock' },
                        ].map(({ icon, color, value, label }) => (
                            <div key={label} className="bg-white border border-slate-200 rounded p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
                                <div className={`w-14 h-14 rounded flex items-center justify-center shrink-0 ${color}`}>
                                    <Bx icon={icon} className="text-3xl" />
                                </div>
                                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span className="text-2xl font-bold text-slate-800 leading-none truncate">{value}</span>
                                    <span className="text-base text-slate-500 font-medium">{label}</span>
                                </div>
                            </div>
                        ))}

                        {alertCount > 0 && (
                            <div className="p-4 bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-300 border-l-4 border-l-amber-500 rounded flex gap-3 items-start">
                                <Bx icon="error" className="text-3xl text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-base text-amber-800 mb-1 font-bold">Articles à réapprovisionner</strong>
                                    <p className="text-sm text-amber-700 m-0 leading-relaxed">
                                        {stats.rupture > 0 && <span className="block">{stats.rupture} en rupture totale.</span>}
                                        {stats.critique > 0 && <span className="block">{stats.critique} en stock critique.</span>}
                                        {stats.faible > 0 && <span className="block">{stats.faible} en stock faible.</span>}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded p-4">
                            <h3 className="text-base font-bold text-slate-700 mb-3">Tendance rapide</h3>
                            <div className="flex flex-col gap-3">
                                {[
                                    { icon: 'up-arrow-circle', color: 'bg-emerald-50 text-emerald-600', label: 'Entrées récentes', value: '+ 3 mouvements' },
                                    { icon: 'down-arrow-circle', color: 'bg-red-50 text-red-500', label: 'Sorties récentes', value: '− 5 mouvements' },
                                ].map(({ icon, color, label, value }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                                            <Bx icon={icon} className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400 leading-none mb-0.5">{label}</p>
                                            <p className="text-base font-bold text-slate-700 leading-none">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {showStockModal && (
                <StockModal
                    isOpen={showStockModal}
                    onClose={() => { setShowStockModal(false); setEditingStockItem(null); }}
                    onSave={handleSaveStockMovement}
                    products={products}
                    stockItem={editingStockItem}
                />
            )}
        </div>
    );
};

export default Stocks;