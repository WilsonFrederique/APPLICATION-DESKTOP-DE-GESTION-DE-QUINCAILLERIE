import React, { useState, useMemo, useCallback } from 'react';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import InvoiceModal from '../../components/Sales/InvoiceModal';
import CategoryCarousel from '../../components/Sales/CategoryCarousel';
import SalesHistoryItem from '../../components/Sales/SalesHistoryItem';
import CartItem from '../../components/Sales/CartItem';
import ProductCard from '../../components/Sales/ProductCard';
import Bx from '../../components/UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const productImages = [
    '/0000s_0000_ZX12-300x300.png',
    '/1-copy-300x300.png',
    '/0028__0009_NILANGE-AZUL.png',
    '/2121A-208-300x300.png',
    '/B-021-8x40-1-300x300.png',
    '/F-116-M8_M10_M12-1-300x300.png',
    '/F-214_60-70-80-100-300x300.png',
    '/ORIENT-Vert-20-300x300.jpg.jpeg',
];

const mockProducts = [
    { id: 1, nom: 'Ciment 50kg', reference: 'CIM-50KG', categorie: 'Matériaux Construction', stock: 15, seuilMin: 20, prixAchat: 35000, prixVente: 50000, prixDetail: 1000, unite: 'sac', uniteDetail: 'kg', peutEtreVenduEnDetail: true, image: productImages[0], fournisseur: 'Lafarge', tva: 20 },
    { id: 2, nom: 'Tôle Galvanisée 3m', reference: 'TOL-GALV-3M', categorie: 'Ferronnerie', stock: 8, seuilMin: 10, prixAchat: 250000, prixVente: 300000, unite: 'feuille', peutEtreVenduEnDetail: false, image: productImages[1], fournisseur: 'MetalPro', tva: 20 },
    { id: 3, nom: 'Vis à Bois 5x50', reference: 'VIS-BOIS-5x50', categorie: 'Quincaillerie', stock: 1200, seuilMin: 500, prixAchat: 150, prixVente: 250, prixDetail: 10, unite: 'pièce', uniteDetail: 'pièce', peutEtreVenduEnDetail: true, image: productImages[2], fournisseur: 'Bricolux', tva: 20 },
    { id: 4, nom: 'Peinture Blanche 10L', reference: 'PEINT-BLANC-10L', categorie: 'Peinture', stock: 5, seuilMin: 15, prixAchat: 80000, prixVente: 120000, prixDetail: 12000, unite: 'pot', uniteDetail: 'L', peutEtreVenduEnDetail: true, image: productImages[3], fournisseur: 'Dulux', tva: 20 },
    { id: 5, nom: 'Clou 10cm', reference: 'CLOU-10CM', categorie: 'Quincaillerie', stock: 2000, seuilMin: 500, prixAchat: 50, prixVente: 100, prixDetail: 5, unite: 'kg', uniteDetail: 'pièce', peutEtreVenduEnDetail: true, image: productImages[4], fournisseur: 'MetalPro', tva: 20 },
    { id: 6, nom: 'Sable Fin 25kg', reference: 'SABLE-FIN-25KG', categorie: 'Matériaux Construction', stock: 30, seuilMin: 20, prixAchat: 8000, prixVente: 12000, prixDetail: 500, unite: 'sac', uniteDetail: 'kg', peutEtreVenduEnDetail: true, image: productImages[5], fournisseur: 'Carrière Pro', tva: 20 },
    { id: 7, nom: 'Marteau Professionnel', reference: 'MART-PRO', categorie: 'Outillage', stock: 12, seuilMin: 10, prixAchat: 45000, prixVente: 65000, unite: 'pièce', peutEtreVenduEnDetail: false, image: productImages[6], fournisseur: 'ToolsPro', tva: 20 },
    { id: 8, nom: 'Gravier 20mm 50kg', reference: 'GRAVIER-20MM-50KG', categorie: 'Matériaux Construction', stock: 18, seuilMin: 25, prixAchat: 12000, prixVente: 18000, prixDetail: 400, unite: 'sac', uniteDetail: 'kg', peutEtreVenduEnDetail: true, image: productImages[7], fournisseur: 'Carrière Pro', tva: 20 },
];

const initialHistoriqueVentes = [
    { id: 1, numero: 'FAC-2024-00158', client: 'SARL Batiment Plus', montant: 1250000, date: '2024-03-15 14:30', statut: 'paye', livraison: 'livre', items: 12, vendeur: 'Admin', paiement: 'especes' },
    { id: 2, numero: 'FAC-2024-00157', client: 'Mr. Rakoto Jean', montant: 380000, date: '2024-03-14 11:20', statut: 'credit', livraison: 'non_livre', items: 3, vendeur: 'Admin', paiement: 'credit' },
    { id: 3, numero: 'FAC-2024-00156', client: 'Entreprise Construction Pro', montant: 2450000, date: '2024-03-14 09:45', statut: 'paye', livraison: 'livre', items: 25, vendeur: 'Vendeur1', paiement: 'virement' },
    { id: 4, numero: 'FAC-2024-00155', client: 'Entreprise Construction Pro', montant: 845000, date: '2024-03-13 16:15', statut: 'paye', livraison: 'livre', items: 8, vendeur: 'Vendeur2', paiement: 'mvola' },
    { id: 5, numero: 'FAC-2024-00154', client: 'Mr. Andriana', montant: 152000, date: '2024-03-12 10:30', statut: 'credit', livraison: 'non_livre', items: 2, vendeur: 'Admin', paiement: 'credit' },
];

const Sales = () => {
    const [products] = useState(mockProducts);
    const [historiqueVentes, setHistoriqueVentes] = useState(initialHistoriqueVentes);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('sale');
    const [cart, setCart] = useState([]);
    const [showInvoice, setShowInvoice] = useState(false);

    const handleViewChange = (v) => {
        setViewMode(v);
        const url = new URL(globalThis.location.href);
        v === 'history' ? url.searchParams.set('view', 'history') : url.searchParams.delete('view');
        globalThis.history.replaceState({}, '', url);
    };

    const categories = useMemo(() => [...new Set(products.map(p => p.categorie))], [products]);

    /* Comptage par catégorie */
    const productCounts = useMemo(() => {
        const counts = { total: products.length };
        categories.forEach(cat => { counts[cat] = products.filter(p => p.categorie === cat).length; });
        return counts;
    }, [products, categories]);

    const filteredProducts = useMemo(() => {
        let f = [...products];
        if (searchTerm) f = f.filter(p => [p.nom, p.reference, p.categorie].some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
        if (selectedCategory !== 'all') f = f.filter(p => p.categorie === selectedCategory);
        return f;
    }, [products, searchTerm, selectedCategory]);

    const cartStats = useMemo(() => ({
        subtotal: cart.reduce((s, i) => s + i.price * i.quantity, 0),
        totalItems: cart.reduce((s, i) => s + i.quantity, 0),
        totalProducts: cart.length,
    }), [cart]);

    const salesStats = useMemo(() => {
        const today = new Date().toLocaleDateString('fr-FR');
        const todaySales = historiqueVentes.filter(v => new Date(v.date).toLocaleDateString('fr-FR') === today);
        const creditSales = historiqueVentes.filter(v => v.statut === 'credit');
        return {
            todaySales: todaySales.length,
            totalToday: todaySales.reduce((s, v) => s + v.montant, 0),
            creditSales: creditSales.length,
            totalCredit: creditSales.reduce((s, v) => s + v.montant, 0),
        };
    }, [historiqueVentes]);

    const handleAddToCart = (product) => {
        const existing = cart.find(i => i.id === product.id && i.unit === product.unit);
        if (existing) {
            const nq = existing.quantity + product.quantity;
            if (nq > product.stock) { alert(`Stock insuffisant ! Reste : ${product.stock - existing.quantity} ${product.unit}`); return; }
            setCart(cart.map(i => i.id === product.id && i.unit === product.unit ? { ...i, quantity: nq } : i));
        } else {
            if (product.quantity > product.stock) { alert('Stock insuffisant !'); return; }
            setCart([...cart, product]);
        }
    };

    const handleUpdateQuantity = (id, qty) => {
        const p = cart.find(i => i.id === id);
        if (qty > p.stock) { alert(`Maximum ${p.stock} ${p.unit}`); return; }
        setCart(cart.map(i => i.id === id ? { ...i, quantity: qty } : i));
    };

    const handleCompleteSale = useCallback((invoiceData) => {
        setHistoriqueVentes(prev => [{
            id: Date.now(), numero: invoiceData.numero, client: invoiceData.client.nom,
            montant: invoiceData.grandTotal, date: new Date().toLocaleString('fr-FR'),
            statut: invoiceData.paymentMethod === 'credit' ? 'credit' : 'paye',
            livraison: 'non_livre', items: invoiceData.items.length, vendeur: 'Admin', paiement: invoiceData.paymentMethod,
        }, ...prev]);
        setCart([]);
        setShowInvoice(false);
        handleViewChange('sale');
    }, []);

    const handleUpdatePrice = useCallback((id, unit, newPrice) => {
        setCart(prev => prev.map(i =>
            i.id === id && i.unit === unit ? { ...i, price: newPrice } : i
        ));
    }, []);

    const tabs = [
        { key: 'sale', label: 'Point de Vente', icon: 'desktop' },
        { key: 'history', label: 'Historique', icon: 'file-blank' },
        { key: 'stats', label: 'Statistiques', icon: 'bar-chart-alt-2' },
    ];

    const statCards = [
        { icon: 'dollar', value: formatAr(salesStats.totalToday), label: "CA aujourd'hui", color: 'text-sky-600 bg-sky-50' },
        { icon: 'check-circle', value: salesStats.todaySales, label: 'Ventes du jour', color: 'text-emerald-600 bg-emerald-50' },
        { icon: 'wallet', value: salesStats.creditSales, label: 'Ventes à crédit', color: 'text-amber-600 bg-amber-50' },
        { icon: 'error-circle', value: formatAr(salesStats.totalCredit), label: 'Total crédit en cours', color: 'text-red-600 bg-red-50' },
    ];

    return (
        <div className="flex flex-col overflow-hidden bg-slate-50 h-full">
            <div className="grid grid-cols-[1fr_400px] gap-3 h-full p-3 overflow-hidden">
                {/* ── Left Column ── */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="px-4 pt-3 pb-0 border-b border-slate-100 bg-white shrink-0">
                        {/* Tabs */}
                        <div className="flex gap-1.5 mb-3">
                            {tabs.map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => handleViewChange(key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded transition-all duration-150 cursor-pointer ${viewMode === key
                                        ? 'bg-sky-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                                        }`}
                                >
                                    <Bx icon={icon} className="text-base" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Filters row — sale */}
                        {viewMode === 'sale' && (
                            <>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Rechercher produit, référence..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            name="productSearch"
                                            icon={<Bx icon="search" className="text-lg" />}
                                        />
                                    </div>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                        className="w-11 h-11 flex items-center justify-center border border-slate-200 bg-white text-slate-400 rounded hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all shrink-0 cursor-pointer"
                                        title="Réinitialiser les filtres"
                                    >
                                        <Bx icon="reset" className="text-lg" />
                                    </button>
                                </div>

                                {/* Category Carousel */}
                                <CategoryCarousel
                                    categories={categories}
                                    selected={selectedCategory}
                                    onChange={setSelectedCategory}
                                    productCounts={productCounts}
                                />
                            </>
                        )}

                        {/* Filters row — history */}
                        {viewMode === 'history' && (
                            <div className="flex items-center gap-2 pb-3">
                                <div className="flex-1">
                                    <Input type="text" placeholder="Filtrer par client, numéro..." name="historyFilter" icon={<Bx icon="filter" className="text-lg" />} />
                                </div>
                                <div className="w-48 shrink-0">
                                    <Input type="date" name="historyDate" icon={<Bx icon="calendar" className="text-lg" />} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto">

                        {viewMode === 'sale' && (
                            filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4">
                                    {filteredProducts.map(p => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-16 text-slate-400">
                                    <Bx icon="box" className="text-6xl opacity-10 mb-4 text-sky-500" />
                                    <p className="text-lg font-bold text-slate-500 mb-1">Aucun produit trouvé</p>
                                    <button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} className="mt-3 text-sm text-sky-600 hover:underline cursor-pointer">
                                        Réinitialiser les filtres
                                    </button>
                                </div>
                            )
                        )}

                        {viewMode === 'history' && (
                            <div className="flex flex-col gap-3 p-3">
                                {historiqueVentes.map(s => <SalesHistoryItem key={s.id} sale={s} />)}
                            </div>
                        )}

                        {viewMode === 'stats' && (
                            <div className="p-4">
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    {statCards.map(({ icon, value, label, color }) => (
                                        <div key={label} className="bg-white rounded border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md hover:shadow-slate-100 hover:-translate-y-0.5 transition-all duration-200">
                                            <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${color}`}>
                                                <Bx icon={icon} className="text-2xl" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-800 leading-tight">{value}</p>
                                                <p className="text-sm text-slate-400 mt-0.5">{label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-3 border-t border-slate-100">
                                    <Button variant="outline" size="medium" icon="download">Exporter les statistiques</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Right Column — Cart ── */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">

                    {/* Cart header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-white shrink-0">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
                                <Bx icon="cart-alt" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 leading-tight">Panier</h2>
                                <p className="text-sm text-slate-400">
                                    {cartStats.totalProducts} produit{cartStats.totalProducts === 1 ? '' : 's'} · {cartStats.totalItems} unité{cartStats.totalItems === 1 ? '' : 's'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded px-4 py-3">
                            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Total</span>
                            <span className="text-2xl font-bold text-emerald-600">{formatAr(cartStats.subtotal)}</span>
                        </div>
                    </div>

                    {/* Cart items */}
                    <div className="flex-1 overflow-y-auto px-3 py-3">
                        {cart.length > 0 ? (
                            <div className="flex flex-col gap-2.5">
                                {cart.map((item, idx) => (
                                    <CartItem
                                        key={`${item.id}-${item.unit}-${idx}`}
                                        item={item}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onUpdatePrice={handleUpdatePrice}          // ← ajouter
                                        onRemove={(id) => setCart(cart.filter(i => i.id !== id))}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded flex items-center justify-center mb-3 text-slate-200">
                                    <Bx icon="cart" className="text-4xl" />
                                </div>
                                <p className="text-base font-bold text-slate-400">Panier vide</p>
                                <p className="text-sm text-slate-300 mt-1 max-w-[180px] leading-relaxed">
                                    Ajoutez des produits depuis la liste
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Cart actions */}
                    <div className="px-3 py-3 border-t border-slate-100 bg-white shrink-0 flex gap-2">
                        <button
                            onClick={() => cart.length > 0 && globalThis.confirm('Vider tout le panier ?') && setCart([])}
                            disabled={cart.length === 0}
                            className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-semibold text-slate-500 border border-slate-200 bg-white rounded hover:bg-red-50 hover:text-red-500 hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer"
                        >
                            <Bx icon="trash" className="text-base" />
                            Vider
                        </button>
                        <button
                            onClick={() => setShowInvoice(true)}
                            disabled={cart.length === 0}
                            className="flex-2 flex items-center justify-center gap-2 h-11 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm shadow-emerald-200 active:scale-[0.98] cursor-pointer"
                        >
                            <Bx icon="check" className="text-base" />
                            Procéder au paiement
                        </button>
                    </div>
                </div>
            </div>

            {showInvoice && (
                <InvoiceModal cart={cart} onClose={() => setShowInvoice(false)} onCompleteSale={handleCompleteSale} />
            )}
        </div>
    );
};

export default Sales;
