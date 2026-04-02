import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input/Input';
import InputSelect from '../UI/Input/InputSelect';
import InputTextarea from '../UI/Input/InputTextarea';
import Bx from '../UI/Boxicon';

const StockModal = ({ isOpen, onClose, onSave, products = [], stockItem = null }) => {
    const isEditMode = !!stockItem;

    const [formData, setFormData] = useState({
        produitId: stockItem?.id || '',
        typeMouvement: isEditMode ? 'ajustement' : 'reception',
        quantite: 0,
        note: '',
    });
    const [errors, setErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(stockItem || null);

    /* ── Reset à l'ouverture ── */
    useEffect(() => {
        if (stockItem) {
            setFormData({ produitId: stockItem.id, typeMouvement: 'ajustement', quantite: 0, note: '' });
            setSelectedProduct(stockItem);
        } else {
            setFormData({ produitId: '', typeMouvement: 'reception', quantite: 0, note: '' });
            setSelectedProduct(null);
        }
        setErrors({});
    }, [stockItem, isOpen]);

    /* ── Sync produit sélectionné ── */
    useEffect(() => {
        if (formData.produitId) {
            const p = products.find(p => p.id === Number.parseInt(formData.produitId, 10));
            setSelectedProduct(p || null);
        } else {
            setSelectedProduct(null);
        }
    }, [formData.produitId, products]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const calculateNewStock = () => {
        if (!selectedProduct) return null;
        const cur = selectedProduct.stock || 0;
        const qty = Number.parseInt(formData.quantite, 10) || 0;
        if (formData.typeMouvement === 'reception') return cur + qty;
        if (formData.typeMouvement === 'sortie') return Math.max(0, cur - qty);
        return qty; // ajustement
    };

    const validateForm = () => {
        const e = {};
        if (!formData.produitId) e.produitId = 'Veuillez sélectionner un produit';
        if (!formData.quantite || formData.quantite <= 0) e.quantite = 'La quantité doit être supérieure à 0';
        if (selectedProduct && formData.typeMouvement === 'sortie') {
            const cur = selectedProduct.stock || 0;
            if (Number(formData.quantite) > cur)
                e.quantite = `Stock insuffisant. Stock actuel : ${cur} ${selectedProduct.unite}`;
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validateForm()) return;
        const newStock = calculateNewStock();
        onSave({
            produitId: Number.parseInt(formData.produitId, 10),
            produit: selectedProduct,
            typeMouvement: formData.typeMouvement,
            quantite: Number.parseInt(formData.quantite, 10),
            stockAvant: selectedProduct.stock || 0,
            stockApres: newStock,
            note: formData.note.trim(),
            date: new Date().toISOString().split('T')[0],
        });
    };

    if (!isOpen) return null;

    const newStock = calculateNewStock();

    const TYPE_CONFIG = {
        reception: { icon: 'up-arrow-circle', color: 'text-emerald-500', label: 'Réception' },
        sortie: { icon: 'down-arrow-circle', color: 'text-red-500', label: 'Sortie' },
        ajustement: { icon: 'transfer-alt', color: 'text-sky-500', label: 'Ajustement' },
    };

    /* ─── Render ─── */
    return (
        <div
            className="fixed inset-0 bg-slate-900/80 z-[10000] flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-white rounded shadow-2xl flex flex-col overflow-hidden my-auto"
                onClick={e => e.stopPropagation()}
            >

                {/* ── Header ── */}
                <div className="bg-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="cabinet" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? 'Ajuster le stock' : 'Nouveau mouvement de stock'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode
                                    ? 'Ajustez le stock de ce produit'
                                    : 'Enregistrez une réception, une sortie ou un ajustement'}
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
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto bg-slate-50 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]"
                >
                    <div className="flex flex-col gap-4 p-5">

                        {/* ══ Section : Informations du mouvement ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations du mouvement</h3>
                            </div>

                            <div className="p-5 flex flex-col gap-4">

                                {/* Produit */}
                                <InputSelect
                                    label="Produit"
                                    value={formData.produitId}
                                    onChange={(v) => handleChange('produitId', v)}
                                    options={[
                                        { value: '', label: 'Sélectionner un produit' },
                                        ...products.map(p => ({
                                            value: p.id.toString(),
                                            label: `${p.nom} (${p.reference}) — Stock : ${p.stock} ${p.unite}`,
                                        }))
                                    ]}
                                    placeholder="Choisir un produit..."
                                    error={errors.produitId}
                                    fullWidth
                                    required
                                    disabled={isEditMode}
                                />

                                {/* Info produit sélectionné */}
                                {selectedProduct && (
                                    <div className="p-4 bg-sky-50 border border-sky-200 rounded flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">Stock actuel</span>
                                            <span className="text-base font-bold text-slate-800">
                                                {selectedProduct.stock} <span className="text-slate-400 font-medium text-sm">{selectedProduct.unite}</span>
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-500">Seuil minimum</span>
                                            <span className="text-sm text-slate-600">
                                                {selectedProduct.seuilMin} <span className="text-slate-400">{selectedProduct.unite}</span>
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Type de mouvement */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Type de mouvement</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleChange('typeMouvement', key)}
                                                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded border-2 text-xs font-bold transition-all ${formData.typeMouvement === key
                                                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <Bx icon={cfg.icon} className={`text-2xl ${formData.typeMouvement === key ? cfg.color : 'text-slate-400'}`} />
                                                {cfg.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantité */}
                                <Input
                                    type="number"
                                    label={formData.typeMouvement === 'ajustement' ? 'Nouveau stock' : 'Quantité'}
                                    placeholder={formData.typeMouvement === 'ajustement' ? 'Stock final après ajustement' : 'Quantité à ajouter / retirer'}
                                    value={formData.quantite}
                                    onChange={(e) => handleChange('quantite', e.target.value)}
                                    error={errors.quantite}
                                    min="1"
                                    fullWidth
                                    required
                                    autoFocus={!!selectedProduct}
                                />

                                {/* Résultat prévisualisation */}
                                {newStock !== null && selectedProduct && (
                                    <div className={`p-4 rounded border-l-4 flex flex-col gap-2 ${newStock <= selectedProduct.seuilMin
                                        ? 'bg-amber-50 border-l-amber-400 border border-amber-200'
                                        : 'bg-emerald-50 border-l-emerald-400 border border-emerald-200'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-600">Stock après mouvement</span>
                                            <span className={`text-xl font-black ${newStock <= selectedProduct.seuilMin ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {newStock} <span className="text-sm font-semibold">{selectedProduct.unite}</span>
                                            </span>
                                        </div>
                                        {newStock <= selectedProduct.seuilMin && (
                                            <div className="flex items-center gap-2 text-amber-700 text-sm">
                                                <Bx icon="error" className="text-base text-amber-500 shrink-0" />
                                                Attention : le stock sera en dessous du seuil minimum
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Note */}
                                <InputTextarea
                                    label="Note (optionnel)"
                                    placeholder="Ajoutez une note ou un commentaire sur ce mouvement..."
                                    value={formData.note}
                                    onChange={(e) => handleChange('note', e.target.value)}
                                    rows={3}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                        <p className="text-xs text-slate-400">
                            {TYPE_CONFIG[formData.typeMouvement].label}
                            {selectedProduct && ` · ${selectedProduct.nom}`}
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
                                <Bx icon="save" className="text-base" />
                                {isEditMode ? "Enregistrer l'ajustement" : `Enregistrer la ${TYPE_CONFIG[formData.typeMouvement].label.toLowerCase()}`}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

StockModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    products: PropTypes.arrayOf(PropTypes.object),
    stockItem: PropTypes.object,
};

export default StockModal;