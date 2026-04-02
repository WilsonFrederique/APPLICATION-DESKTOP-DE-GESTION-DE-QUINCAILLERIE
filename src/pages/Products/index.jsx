import React, { useState, useMemo } from 'react';
import Input from '../../components/UI/Input/Input';
import ProductModal from '../../components/Product/ProductModal';
import CategoryModal from '../../components/Product/CategoryModal';
import CategoryCarousel from '../../components/Sales/CategoryCarousel';
import CategoryCard from '../../components/Product/CategoryCard';
import ProductCard from '../../components/Product/ProductCard';
import Bx from '../../components/UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const productImages = [
    '/gilet-securite-jaune-taille-l-ref-vtrgilp002.jpg.jpeg',
    '/0009_PLAFOND-PVC-200X7X4000MM-10PCS-PQTS-REF-J33-300x300.png',
    '/istockphoto-1200539331-1024x1024.jpg.jpeg',
    '/produits-quincaillerie-1.jpg.jpeg',
    '/grillage-avertisseur-vert-300mm-ref-8630v.jpg.jpeg',
    '/B-025-6x70-1-300x300.png',
    '/0018_PLAFOND-PVC-200X7X4000MM-10PCS-PQTS-REF-J2801-300x300.png',
    '/0017_PLAFOND-PVC-200X7X4000MM-10PCS-PQTS-REF-JX303-300x300.png',
];

const initialProducts = [
    { id: 1, nom: 'Ciment 50kg', reference: 'CIM-50KG', categorie: 'Matériaux Construction', description: 'Ciment Portland de haute qualité.', stock: 15, seuilMin: 20, prixAchat: 35000, prixVente: 50000, unite: 'sac', image: productImages[0], dateAjout: '2024-01-15' },
    { id: 2, nom: 'Tôle Galvanisée 3m', reference: 'TOL-GALV-3M', categorie: 'Ferronnerie', description: 'Tôle galvanisée 3m, 0.5mm.', stock: 8, seuilMin: 10, prixAchat: 250000, prixVente: 300000, unite: 'feuille', image: productImages[1], dateAjout: '2024-02-10' },
    { id: 3, nom: 'Vis à Bois 5x50', reference: 'VIS-BOIS-5x50', categorie: 'Quincaillerie', description: 'Vis à bois tête plate galvanisée.', stock: 1200, seuilMin: 500, prixAchat: 150, prixVente: 250, unite: 'pièce', image: productImages[2], dateAjout: '2024-01-20' },
    { id: 4, nom: 'Peinture Blanche 10L', reference: 'PEINT-BLANC-10L', categorie: 'Peinture', description: 'Peinture blanche mate intérieur.', stock: 5, seuilMin: 15, prixAchat: 80000, prixVente: 120000, unite: 'pot', image: productImages[3], dateAjout: '2024-03-01' },
    { id: 5, nom: 'Clou 10cm', reference: 'CLOU-10CM', categorie: 'Quincaillerie', description: 'Clou à béton 10cm.', stock: 2000, seuilMin: 500, prixAchat: 50, prixVente: 100, unite: 'kg', image: productImages[4], dateAjout: '2024-02-15' },
];

const Products = () => {
    const [products, setProducts] = useState(initialProducts);
    const [viewMode, setViewMode] = useState('products');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoriesList, setCategoriesList] = useState([
        { id: 1, nom: 'Matériaux Construction', description: 'Ciment, sable, gravier, etc.', produitsCount: 2, dateCreation: '2024-01-15' },
        { id: 2, nom: 'Ferronnerie', description: 'Tôles, barres, profilés métalliques', produitsCount: 1, dateCreation: '2024-01-20' },
        { id: 3, nom: 'Quincaillerie', description: 'Vis, clous, boulons, écrous', produitsCount: 2, dateCreation: '2024-01-10' },
        { id: 4, nom: 'Peinture', description: 'Peintures, vernis, enduits', produitsCount: 1, dateCreation: '2024-02-01' },
    ]);

    /* ── Catégories ── */
    const categories = useMemo(() => {
        const uniqueCats = [...new Set(products.map(p => p.categorie))];
        const updated = categoriesList.map(cat => ({
            ...cat,
            produitsCount: products.filter(p => p.categorie === cat.nom).length,
        }));
        uniqueCats.forEach(name => {
            if (!updated.find(c => c.nom === name)) {
                updated.push({ id: Date.now() + Math.random(), nom: name, description: '', produitsCount: products.filter(p => p.categorie === name).length, dateCreation: new Date().toISOString().split('T')[0] });
            }
        });
        return updated.sort((a, b) => a.nom.localeCompare(b.nom));
    }, [products, categoriesList]);

    /* ── Comptage par catégorie (strings) pour le carousel ── */
    const categoryNames = useMemo(() => categories.map(c => c.nom), [categories]);

    const productCounts = useMemo(() => {
        const counts = { total: products.length };
        categories.forEach(cat => { counts[cat.nom] = products.filter(p => p.categorie === cat.nom).length; });
        return counts;
    }, [products, categories]);

    /* ── Products filtrés ── */
    const filteredProducts = useMemo(() => {
        let list = [...products];
        if (searchTerm) list = list.filter(p => p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || p.reference.toLowerCase().includes(searchTerm.toLowerCase()) || p.categorie.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedCategory !== 'all') list = list.filter(p => p.categorie === selectedCategory);
        return list.sort((a, b) => a.nom.toLowerCase().localeCompare(b.nom.toLowerCase()));
    }, [products, searchTerm, selectedCategory]);

    /* ── Catégories filtrées ── */
    const filteredCategories = useMemo(() => {
        if (!categorySearchTerm) return categories;
        return categories.filter(c => c.nom.toLowerCase().includes(categorySearchTerm.toLowerCase()) || (c.description && c.description.toLowerCase().includes(categorySearchTerm.toLowerCase())));
    }, [categories, categorySearchTerm]);

    /* ── Stats ── */
    const stats = useMemo(() => ({
        totalProducts: products.length,
        criticalStock: products.filter(p => p.stock <= p.seuilMin).length,
        totalValue: products.reduce((s, p) => s + p.stock * p.prixAchat, 0),
        categoriesCount: categories.length,
        totalClassified: categories.reduce((s, c) => s + c.produitsCount, 0),
    }), [products, categories]);

    /* ── Handlers produits ── */
    const handleSaveProduct = (data) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === data.id ? data : p));
        } else {
            setProducts([...products, { ...data, id: Date.now(), image: data.image || productImages[Math.floor(Math.random() * productImages.length)] }]);
        }
        setShowProductModal(false);
        setEditingProduct(null);
    };

    const handleDeleteProduct = (product) => {
        if (globalThis.confirm?.(`Supprimer "${product.nom}" ?`)) setProducts(products.filter(p => p.id !== product.id));
    };

    /* ── Handlers catégories ── */
    const handleSaveCategory = (data) => {
        if (editingCategory) {
            setCategoriesList(categoriesList.map(c => c.id === editingCategory.id ? { ...c, nom: data.nom.trim(), description: data.description?.trim() || '' } : c));
            setProducts(products.map(p => p.categorie === editingCategory.nom ? { ...p, categorie: data.nom.trim() } : p));
        } else {
            if (categoriesList.some(c => c.nom.toLowerCase() === data.nom.trim().toLowerCase())) { alert('Cette catégorie existe déjà'); return; }
            setCategoriesList([...categoriesList, { id: data.id || Date.now(), nom: data.nom.trim(), description: data.description?.trim() || '', produitsCount: 0, dateCreation: data.dateCreation || new Date().toISOString().split('T')[0] }]);
        }
    };

    const handleDeleteCategory = (category) => {
        if (category.produitsCount > 0) { alert(`Impossible : cette catégorie contient ${category.produitsCount} produit(s).`); return; }
        if (globalThis.confirm?.(`Supprimer la catégorie "${category.nom}" ?`)) setCategoriesList(categoriesList.filter(c => c.id !== category.id));
    };

    /* ────────────────── JSX ────────────────── */
    return (
        <div className="flex flex-col overflow-hidden bg-transparent text-slate-800 h-full">
            <div className="grid grid-cols-[1fr_380px] gap-3 h-full p-3 overflow-hidden">

                {/* ── Colonne gauche ── */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col gap-2 px-4 pt-3 border-b border-slate-100">

                        {/* Tabs */}
                        <div className="flex gap-2 pb-1 border-slate-200">
                            {[
                                { key: 'products', label: 'Produits', icon: 'package' },
                                { key: 'categories', label: 'Catégories', icon: 'category' },
                            ].map(({ key, label, icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setViewMode(key)}
                                    className={`flex items-center gap-2 px-5 py-2 text-base font-semibold rounded transition-all ${viewMode === key
                                        ? 'bg-sky-600 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                        }`}
                                >
                                    <Bx icon={icon} className="text-base" /> {label}
                                </button>
                            ))}
                        </div>

                        {/* Filtres produits */}
                        {viewMode === 'products' && (
                            <div className="flex flex-col gap-3">
                                {/* Barre de recherche + bouton */}
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <Input
                                            type="text"
                                            placeholder="Rechercher produit, référence, catégorie..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            icon={<Bx icon="search" className="text-lg" />}
                                        />
                                    </div>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="w-11 h-11 shrink-0 flex items-center justify-center border border-slate-200 bg-white text-slate-500 rounded hover:bg-slate-50 hover:border-red-400 hover:text-red-500 transition-all"
                                        title="Réinitialiser la recherche"
                                    >
                                        <Bx icon="reset" className="text-lg" />
                                    </button>
                                    <button
                                        onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                                        className="flex items-center gap-2 px-4 h-11 shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded transition-all whitespace-nowrap"
                                    >
                                        <Bx icon="plus" className="text-lg" /> Ajouter
                                    </button>
                                </div>
                                {/* Carousel catégories */}
                                <CategoryCarousel
                                    categories={categoryNames}
                                    selected={selectedCategory}
                                    onChange={setSelectedCategory}
                                    productCounts={productCounts}
                                />
                            </div>
                        )}

                        {/* Filtres catégories */}
                        {viewMode === 'categories' && (
                            <div className="flex items-center gap-2 pb-3">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher une catégorie..."
                                        value={categorySearchTerm}
                                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                                        icon={<Bx icon="search" className="text-lg" />}
                                    />
                                </div>
                                <button
                                    onClick={() => { setEditingCategory(null); setShowCategoryModal(true); }}
                                    className="flex items-center gap-2 px-4 h-11 shrink-0 bg-sky-600 hover:bg-sky-700 text-white text-base font-semibold rounded transition-all whitespace-nowrap"
                                >
                                    <Bx icon="plus" className="text-lg" /> Nouvelle catégorie
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Contenu scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">

                        {/* Vue produits */}
                        {viewMode === 'products' && (
                            filteredProducts.length > 0 ? (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                                    {filteredProducts.map(p => (
                                        <ProductCard
                                            key={p.id}
                                            product={p}
                                            onView={(prod) => console.log('Voir:', prod)}
                                            onEdit={(prod) => { setEditingProduct(prod); setShowProductModal(true); }}
                                            onDelete={handleDeleteProduct}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                                    <Bx icon="package" className="text-6xl text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700 mb-1">Aucun produit trouvé</h3>
                                    <p className="text-base text-slate-400 mb-5">Aucun produit ne correspond à vos critères.</p>
                                    <button
                                        onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                                        className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-base font-semibold rounded hover:bg-slate-50 transition-all"
                                    >
                                        <Bx icon="reset" className="text-lg" /> Réinitialiser les filtres
                                    </button>
                                </div>
                            )
                        )}

                        {/* Vue catégories */}
                        {viewMode === 'categories' && (
                            filteredCategories.length > 0 ? (
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
                                    {filteredCategories.map(c => (
                                        <CategoryCard
                                            key={c.id}
                                            category={c}
                                            onEdit={(cat) => { setEditingCategory(cat); setShowCategoryModal(true); }}
                                            onDelete={handleDeleteCategory}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
                                    <Bx icon="category" className="text-6xl text-slate-300 mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700 mb-1">Aucune catégorie trouvée</h3>
                                    <p className="text-base text-slate-400">Aucune catégorie ne correspond à votre recherche.</p>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* ── Colonne droite — Statistiques ── */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800 m-0">Statistiques</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">

                        {/* Stat cards */}
                        {[
                            { icon: 'package', color: 'bg-sky-50 text-sky-500', value: stats.totalProducts, label: 'Produits total' },
                            { icon: 'error-circle', color: 'bg-amber-50 text-amber-500', value: stats.criticalStock, label: 'Stock critique' },
                            { icon: 'category', color: 'bg-emerald-50 text-emerald-500', value: stats.categoriesCount, label: 'Catégories' },
                            ...(viewMode === 'categories' ? [{ icon: 'list-ul', color: 'bg-violet-50 text-violet-500', value: stats.totalClassified, label: 'Produits classés' }] : []),
                        ].map(({ icon, color, value, label }) => (
                            <div key={label} className="bg-white border border-slate-200 rounded p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
                                <div className={`w-14 h-14 rounded flex items-center justify-center shrink-0 ${color}`}>
                                    <Bx icon={icon} className="text-3xl" />
                                </div>
                                <div className="flex flex-col gap-0.5 flex-1">
                                    <span className="text-3xl font-bold text-slate-800 leading-none">{value}</span>
                                    <span className="text-base text-slate-500 font-medium">{label}</span>
                                </div>
                            </div>
                        ))}

                        {/* Valeur stock */}
                        <div className="bg-white border border-slate-200 rounded p-4 flex items-center gap-4 hover:border-slate-300 hover:shadow-sm transition-all">
                            <div className="w-14 h-14 rounded flex items-center justify-center shrink-0 bg-violet-50 text-violet-500">
                                <Bx icon="dollar-circle" className="text-3xl" />
                            </div>
                            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                <span className="text-xl font-bold text-slate-800 leading-none truncate">{formatAr(stats.totalValue)}</span>
                                <span className="text-base text-slate-500 font-medium">Valeur stock</span>
                            </div>
                        </div>

                        {/* Alerte stock critique */}
                        {stats.criticalStock > 0 && (
                            <div className="mx-0 mt-1 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 border-l-4 border-l-amber-500 rounded flex gap-3 items-start">
                                <Bx icon="error" className="text-3xl text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-base text-amber-800 mb-1 font-bold">
                                        {stats.criticalStock} produit{stats.criticalStock > 1 ? 's' : ''} en stock critique
                                    </strong>
                                    <p className="text-sm text-amber-700 m-0">Nécessite un réapprovisionnement urgent</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Modals ── */}
            {showProductModal && (
                <ProductModal
                    isOpen={showProductModal}
                    onClose={() => { setShowProductModal(false); setEditingProduct(null); }}
                    onSave={handleSaveProduct}
                    product={editingProduct}
                    categories={categories.map(c => c.nom)}
                />
            )}

            {showCategoryModal && (
                <CategoryModal
                    isOpen={showCategoryModal}
                    onClose={() => { setShowCategoryModal(false); setEditingCategory(null); }}
                    onSave={(data) => { handleSaveCategory(data); setShowCategoryModal(false); setEditingCategory(null); }}
                    category={editingCategory}
                />
            )}
        </div>
    );
};

export default Products;