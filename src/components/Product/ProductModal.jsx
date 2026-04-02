import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input/Input';
import InputSelect from '../UI/Input/InputSelect';
import InputTextarea from '../UI/Input/InputTextarea';
import Bx from '../UI/Boxicon';

/* ─── Types suggérés ─── */
const COMMON_TYPES = [
    'carton', 'sac', 'kg', 'g', 'pièce', 'boîte', 'litre', 'mL',
    'mètre', 'rouleau', 'palette', 'lot', 'unité', 'feuille',
    'pot', 'bidon', 'tube', 'paquet', 'botte', 'planche',
];

/* ─── Champ type avec suggestion dropdown ─── */
const TypeInput = ({ value, onChange, allTypes, placeholder = 'Ex: carton, kg…' }) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState(value);
    const ref = useRef(null);

    useEffect(() => { setInput(value); }, [value]);

    /* Ferme le dropdown si clic dehors */
    useEffect(() => {
        const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const suggestions = [...new Set([...allTypes, ...COMMON_TYPES])]
        .filter(s => s.toLowerCase().includes(input.toLowerCase()) && s.toLowerCase() !== input.toLowerCase());

    return (
        <div ref={ref} className="relative w-full">
            <input
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); onChange(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
            />
            {open && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded shadow-xl z-[9999] max-h-44 overflow-y-auto [scrollbar-width:thin]">
                    {suggestions.map(s => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); onChange(s); setInput(s); setOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors flex items-center gap-2"
                        >
                            <Bx icon="tag" className="text-slate-300 text-xs" />
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── Champ numérique compact ─── */
const NumInput = ({ value, onChange, placeholder = '0', min = 0, prefix }) => (
    <div className="relative w-full">
        {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none select-none">
                {prefix}
            </span>
        )}
        <input
            type="number"
            value={value}
            min={min}
            onChange={(e) => onChange(Number.parseInt(e.target.value, 10) || 0)}
            placeholder={placeholder}
            className={`w-full py-2.5 text-sm border border-slate-200 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all ${prefix ? 'pl-8 pr-3' : 'px-3'}`}
        />
    </div>
);

/* ─── Ligne variant ─── */
const VariantRow = ({ variant, index, allTypes, onChange, onRemove, canRemove, errors = {} }) => {
    const marge = variant.prixAchat > 0 && variant.prixVente > 0
        ? Math.round(((variant.prixVente - variant.prixAchat) / variant.prixAchat) * 100)
        : null;

    const margeColor = marge === null ? '' : marge < 0 ? 'text-red-500' : marge < 20 ? 'text-amber-500' : 'text-emerald-600';

    return (
        <div className={`relative bg-slate-50 border rounded p-4 transition-all ${errors.type || errors.prixVente ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-sky-200 hover:bg-sky-50/20'}`}>

            {/* Numéro + supprimer */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type {index + 1}</span>
                <div className="flex items-center gap-2">
                    {marge !== null && (
                        <span className={`text-xs font-bold ${margeColor} bg-white border border-current/20 px-2 py-0.5 rounded-full`}>
                            {marge >= 0 ? '+' : ''}{marge}% marge
                        </span>
                    )}
                    {canRemove && (
                        <button
                            type="button"
                            onClick={() => onRemove(variant.id)}
                            className="w-7 h-7 flex items-center justify-center rounded text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all"
                            title="Supprimer ce type"
                        >
                            <Bx icon="x" className="text-base" />
                        </button>
                    )}
                </div>
            </div>

            {/* Grille des champs */}
            <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] gap-2 items-start">

                {/* Type */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Type / Unité <span className="text-red-400">*</span></label>
                    <TypeInput
                        value={variant.type}
                        onChange={(v) => onChange(variant.id, 'type', v)}
                        allTypes={allTypes}
                    />
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                {/* Prix achat */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Prix achat</label>
                    <NumInput
                        value={variant.prixAchat}
                        onChange={(v) => onChange(variant.id, 'prixAchat', v)}
                        placeholder="0"
                    />
                </div>

                {/* Prix vente */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Prix vente <span className="text-red-400">*</span></label>
                    <NumInput
                        value={variant.prixVente}
                        onChange={(v) => onChange(variant.id, 'prixVente', v)}
                        placeholder="0"
                    />
                    {errors.prixVente && <p className="text-red-500 text-xs mt-1">{errors.prixVente}</p>}
                </div>

                {/* Seuil min */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Seuil min</label>
                    <NumInput
                        value={variant.seuilMin}
                        onChange={(v) => onChange(variant.id, 'seuilMin', v)}
                        placeholder="10"
                    />
                </div>

                {/* Stock */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Stock</label>
                    <NumInput
                        value={variant.stock}
                        onChange={(v) => onChange(variant.id, 'stock', v)}
                        placeholder="0"
                    />
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════
   IMAGE UPLOAD
══════════════════════════════════════════════ */
const ImageUpload = ({ value, onChange }) => {
    const fileRef = useRef(null);
    const [drag, setDrag] = useState(false);

    const readFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDrag(false);
        readFile(e.dataTransfer.files[0]);
    };

    const clear = () => {
        onChange('');
        if (fileRef.current) fileRef.current.value = '';
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">Image du produit</label>

            {value ? (
                /* ── Preview ── */
                <div className="relative h-44 bg-slate-100 rounded overflow-hidden border border-slate-200">
                    <img src={value} alt="Aperçu" className="h-full w-full object-contain" />
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/35 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded text-xs font-bold text-slate-700 shadow-md hover:bg-sky-50 hover:text-sky-700 transition-all"
                        >
                            <Bx icon="refresh" className="text-sm" /> Changer
                        </button>
                        <button
                            type="button"
                            onClick={clear}
                            className="flex items-center gap-1.5 px-3 py-2 bg-white rounded text-xs font-bold text-red-500 shadow-md hover:bg-red-50 transition-all"
                        >
                            <Bx icon="trash" className="text-sm" /> Supprimer
                        </button>
                    </div>
                </div>
            ) : (
                /* ── Zone drop / clic ── */
                <button
                    type='button'
                    onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`h-36 rounded border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all
            ${drag ? 'border-sky-400 bg-sky-50' : 'border-slate-300 hover:border-sky-400 hover:bg-sky-50/40'}`}
                >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${drag ? 'bg-sky-100 text-sky-500 scale-110' : 'bg-slate-100 text-slate-400'}`}>
                        <Bx icon="cloud-upload" className="text-2xl" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-600">
                            {drag ? 'Relâchez pour importer' : 'Glissez une image ici'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                            ou <span className="text-sky-600 font-semibold underline">parcourez vos fichiers</span>
                        </p>
                        <p className="text-[11px] text-slate-300 mt-1">JPG, PNG, WEBP</p>
                    </div>
                </button>
            )}

            {/* Input file caché */}
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => readFile(e.target.files[0])}
            />
        </div>
    );
};

/* ══════════════════════════════════════════════
   PRODUCT MODAL
══════════════════════════════════════════════ */
const ProductModal = ({ isOpen, onClose, onSave, product = null, categories = [] }) => {
    const isEditMode = !!product;

    /* ── État de base ── */
    const [formData, setFormData] = useState({
        nom: product?.nom || '',
        reference: product?.reference || '',
        categorie: product?.categorie || '',
        nouvelleCategorie: '',
        description: product?.description || '',
        fournisseur: product?.fournisseur || '',
        image: product?.image || '',
        peutEtreVenduEnDetail: product?.peutEtreVenduEnDetail || false,
    });

    /* ── Variants (types & prix) ── */
    const buildInitialVariants = () => {
        if (product?.variants?.length > 0) return product.variants;
        return [{
            id: Date.now(),
            type: product?.unite || '',
            prixAchat: product?.prixAchat || 0,
            prixVente: product?.prixVente || 0,
            seuilMin: product?.seuilMin || 10,
            stock: product?.stock || 0,
        }];
    };

    const [variants, setVariants] = useState(buildInitialVariants);
    const [useNewCategory, setUseNewCategory] = useState(false);
    const [errors, setErrors] = useState({});
    const [variantErrors, setVariantErrors] = useState({});

    /* ── Référence auto ── */
    useEffect(() => {
        if (!isEditMode && !formData.reference) {
            const ts = Date.now().toString().slice(-6);
            const rnd = Math.random().toString(36).substring(2, 5).toUpperCase();
            setFormData(prev => ({ ...prev, reference: `PROD-${ts}-${rnd}` }));
        }
    }, [isEditMode]);

    /* ── Tous les types déjà utilisés (suggestions) ── */
    const allTypes = [...new Set(variants.map(v => v.type).filter(Boolean))];

    /* ── Handlers base ── */
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    /* ── Handlers variants ── */
    const handleVariantChange = (id, field, value) => {
        setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
        if (variantErrors[id]?.[field]) {
            setVariantErrors(prev => {
                const e = { ...prev };
                if (e[id]) { delete e[id][field]; }
                return e;
            });
        }
    };

    const handleAddVariant = () => {
        setVariants(prev => [...prev, { id: Date.now() + Math.random(), type: '', prixAchat: 0, prixVente: 0, seuilMin: 10, stock: 0 }]);
    };

    const handleRemoveVariant = (id) => {
        setVariants(prev => prev.filter(v => v.id !== id));
        setVariantErrors(prev => { const e = { ...prev }; delete e[id]; return e; });
    };

    /* ── Validation ── */
    const validateForm = () => {
        const newErrors = {};
        const newVarErrors = {};
        let valid = true;

        if (!formData.nom.trim()) { newErrors.nom = 'Le nom est requis'; valid = false; }
        if (!formData.reference.trim()) { newErrors.reference = 'La référence est requise'; valid = false; }

        const cat = useNewCategory ? formData.nouvelleCategorie.trim() : formData.categorie;
        if (!cat) { newErrors.categorie = 'La catégorie est requise'; valid = false; }

        if (variants.length === 0) {
            newErrors.variants = 'Ajoutez au moins un type de tarification';
            valid = false;
        }

        variants.forEach(v => {
            const ve = {};
            if (!v.type.trim()) { ve.type = 'Requis'; valid = false; }
            if (v.prixVente <= 0) { ve.prixVente = 'Doit être > 0'; valid = false; }
            if (v.prixVente > 0 && v.prixAchat > v.prixVente) { ve.prixVente = 'Inférieur au prix achat'; valid = false; }
            if (Object.keys(ve).length) newVarErrors[v.id] = ve;
        });

        setErrors(newErrors);
        setVariantErrors(newVarErrors);
        return valid;
    };

    /* ── Soumission ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const categoryToUse = useNewCategory ? formData.nouvelleCategorie.trim() : formData.categorie;
        const firstVariant = variants[0] || {};

        const productData = {
            ...formData,
            categorie: categoryToUse,
            /* Compat backward: champs issus du 1er variant */
            unite: firstVariant.type || 'unité',
            prixAchat: firstVariant.prixAchat || 0,
            prixVente: firstVariant.prixVente || 0,
            seuilMin: firstVariant.seuilMin || 0,
            stock: firstVariant.stock || 0,
            /* Ensemble des variants */
            variants,
            id: product?.id || Date.now(),
            dateAjout: product?.dateAjout || new Date().toISOString().split('T')[0],
            derniereModification: new Date().toISOString(),
        };

        onSave(productData);
    };

    if (!isOpen) return null;

    /* ─── Render ─── */
    return (
        <div className="fixed inset-0 bg-slate-900/80 z-[10000] flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white rounded shadow-2xl flex flex-col overflow-hidden my-auto">

                {/* ── Header ── */}
                <div className="bg-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="package" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? 'Modifier le produit' : 'Nouveau produit'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode ? 'Modifiez les informations ci-dessous' : 'Ajoutez un produit à votre inventaire'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-white border border-white/10 transition-all"
                    >
                        <Bx icon="x" className="text-lg" />
                    </button>
                </div>

                {/* ── Body ── */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto bg-slate-50 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
                    <div className="flex flex-col gap-4 p-5">

                        {/* ══ Section 1 : Informations de base ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations de base</h3>
                            </div>

                            <div className="p-5 flex flex-col gap-4">

                                {/* Nom + Référence */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="text"
                                        label="Nom du produit"
                                        placeholder="Ex: Ciment 50kg"
                                        value={formData.nom}
                                        onChange={(e) => handleChange('nom', e.target.value)}
                                        error={errors.nom}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        type="text"
                                        label="Référence"
                                        placeholder="Ex: CIM-50KG"
                                        value={formData.reference}
                                        onChange={(e) => handleChange('reference', e.target.value)}
                                        error={errors.reference}
                                        fullWidth
                                        required
                                    />
                                </div>

                                {/* Catégorie */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-slate-600">Catégorie</span>
                                        <div className="flex rounded overflow-hidden border border-slate-200">
                                            <button
                                                type="button"
                                                onClick={() => setUseNewCategory(false)}
                                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${!useNewCategory ? 'bg-sky-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                Existante
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setUseNewCategory(true)}
                                                className={`px-3 py-1.5 text-xs font-semibold transition-all ${useNewCategory ? 'bg-sky-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                            >
                                                + Nouvelle
                                            </button>
                                        </div>
                                    </div>
                                    {useNewCategory ? (
                                        <Input
                                            type="text"
                                            placeholder="Ex: Matériaux Construction"
                                            value={formData.nouvelleCategorie}
                                            onChange={(e) => handleChange('nouvelleCategorie', e.target.value)}
                                            error={errors.categorie}
                                            fullWidth
                                        />
                                    ) : (
                                        <InputSelect
                                            value={formData.categorie}
                                            onChange={(value) => handleChange('categorie', value)}
                                            options={[
                                                { value: '', label: 'Sélectionner une catégorie' },
                                                ...categories.map(cat => ({ value: cat, label: cat }))
                                            ]}
                                            error={errors.categorie}
                                            fullWidth
                                        />
                                    )}
                                </div>

                                {/* Description */}
                                <InputTextarea
                                    label="Description"
                                    placeholder="Description du produit..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={2}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* ══ Section 2 : Types & Tarification ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                                        <Bx icon="dollar-circle" className="text-base" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Types & Tarification</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Définissez un ou plusieurs conditionnements avec leurs prix</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddVariant}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-all"
                                >
                                    <Bx icon="plus" className="text-sm" /> Ajouter un type
                                </button>
                            </div>

                            <div className="p-5 flex flex-col gap-3">
                                {/* Légende */}
                                <div className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr_0.8fr] gap-2 px-4">
                                    {['Type / Unité', 'Prix achat (Ar)', 'Prix vente (Ar)', 'Seuil min', 'Stock init.'].map(h => (
                                        <span key={h} className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{h}</span>
                                    ))}
                                </div>

                                {/* Lignes variants */}
                                {variants.map((v, i) => (
                                    <VariantRow
                                        key={v.id}
                                        variant={v}
                                        index={i}
                                        allTypes={allTypes}
                                        onChange={handleVariantChange}
                                        onRemove={handleRemoveVariant}
                                        canRemove={variants.length > 1}
                                        errors={variantErrors[v.id] || {}}
                                    />
                                ))}

                                {errors.variants && (
                                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                                        <Bx icon="error" className="text-base" /> {errors.variants}
                                    </p>
                                )}

                                {/* Exemple visuel */}
                                <div className="mt-1 p-3 bg-sky-50 border border-sky-200 border-dashed rounded flex items-start gap-2.5">
                                    <Bx icon="bulb" className="text-sky-400 text-lg shrink-0 mt-0.5" />
                                    <p className="text-xs text-sky-700 leading-relaxed">
                                        <strong>Exemple :</strong> Pour des biscuits achetés en carton, créez un type <em>"carton"</em> avec son prix d'achat et de vente. Si vous les revendez aussi à la pièce, ajoutez un second type <em>"pièce"</em> avec ses propres prix et seuil.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ══ Section 3 : Options ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-violet-100 rounded flex items-center justify-center text-violet-600">
                                    <Bx icon="cog" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Options supplémentaires</h3>
                            </div>

                            <div className="p-5 flex flex-col gap-4">

                                {/* Vente au détail toggle */}
                                <label className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:border-sky-200 hover:bg-sky-50/50 transition-all select-none">
                                    <div className="relative shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={formData.peutEtreVenduEnDetail}
                                            onChange={(e) => handleChange('peutEtreVenduEnDetail', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-5.5 rounded-full border-2 transition-all ${formData.peutEtreVenduEnDetail ? 'bg-sky-500 border-sky-500' : 'bg-slate-200 border-slate-200'}`}>
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all mt-[1px] ${formData.peutEtreVenduEnDetail ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">Peut être vendu au détail</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Activez si ce produit se vend à l'unité ou à la pièce</p>
                                    </div>
                                </label>

                                {/* Fournisseur */}
                                <Input
                                    type="text"
                                    label="Fournisseur"
                                    placeholder="Nom du fournisseur"
                                    value={formData.fournisseur}
                                    onChange={(e) => handleChange('fournisseur', e.target.value)}
                                    icon={<Bx icon="building" className="text-lg" />}
                                    fullWidth
                                />

                                {/* Image Upload */}
                                <ImageUpload
                                    value={formData.image}
                                    onChange={(v) => handleChange('image', v)}
                                />
                            </div>
                        </div>

                    </div>

                    {/* ── Footer ── */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                        <p className="text-xs text-slate-400">
                            {variants.length} type{variants.length > 1 ? 's' : ''} de tarification configuré{variants.length > 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 bg-white rounded hover:bg-slate-50 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded transition-all shadow-sm shadow-sky-200 active:scale-[0.98]"
                            >
                                <Bx icon={isEditMode ? 'save' : 'plus-circle'} className="text-base" />
                                {isEditMode ? 'Enregistrer les modifications' : 'Créer le produit'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

ProductModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    product: PropTypes.object,
    categories: PropTypes.arrayOf(PropTypes.string),
};

export default ProductModal;