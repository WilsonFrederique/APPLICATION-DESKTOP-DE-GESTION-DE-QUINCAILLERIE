import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input/Input';
import InputSelect from '../UI/Input/InputSelect';
import InputTextarea from '../UI/Input/InputTextarea';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

/* ─── Statuts ─── */
const STATUT_CONFIG = {
    'en_attente': { label: 'En attente', icon: 'time', color: 'bg-amber-50 text-amber-600', border: 'border-amber-400' },
    'confirmee': { label: 'Confirmée', icon: 'check-circle', color: 'bg-sky-50 text-sky-600', border: 'border-sky-400' },
    'livree': { label: 'Livrée', icon: 'package', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-400' },
    'annulee': { label: 'Annulée', icon: 'x-circle', color: 'bg-red-50 text-red-600', border: 'border-red-400' },
};

const emptyLigne = () => ({ id: Date.now() + Math.random(), produit: '', quantite: 1, prixUnitaire: 0, unite: '' });

/* ─── Ligne produit ─── */
const LigneProduit = ({ ligne, index, onChange, onRemove, canRemove }) => {
    const total = ligne.quantite * ligne.prixUnitaire;

    return (
        <div className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Article {index + 1}</span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(ligne.id)}
                        className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-red-100 hover:text-red-500 transition-all"
                    >
                        <Bx icon="x" className="text-sm" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-[2fr_0.7fr_1fr_0.7fr] gap-2 items-end">
                {/* Désignation */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Désignation <span className="text-red-400">*</span></label>
                    <input
                        type="text"
                        value={ligne.produit}
                        onChange={e => onChange(ligne.id, 'produit', e.target.value)}
                        placeholder="Ex: Ciment 50kg"
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>

                {/* Quantité */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Qté</label>
                    <input
                        type="number"
                        value={ligne.quantite}
                        min={1}
                        onChange={e => onChange(ligne.id, 'quantite', Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>

                {/* Prix unitaire */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Prix unitaire (Ar)</label>
                    <input
                        type="number"
                        value={ligne.prixUnitaire}
                        min={0}
                        onChange={e => onChange(ligne.id, 'prixUnitaire', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded bg-white text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 transition-all"
                    />
                </div>

                {/* Total ligne */}
                <div className="text-right">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Total</label>
                    <span className="text-sm font-black text-slate-700">{formatAr(total)}</span>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════
   COMMANDE MODAL
══════════════════════════════════════════════ */
const CommandeModal = ({ isOpen, onClose, onSave, commande = null, fournisseurs = [] }) => {
    const isEditMode = !!commande;

    const [formData, setFormData] = useState({
        fournisseurId: '',
        dateCommande: new Date().toISOString().split('T')[0],
        dateLivraison: '',
        statut: 'en_attente',
        note: '',
    });
    const [lignes, setLignes] = useState([emptyLigne()]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (commande) {
            setFormData({
                fournisseurId: commande.fournisseurId?.toString() || '',
                dateCommande: commande.dateCommande || new Date().toISOString().split('T')[0],
                dateLivraison: commande.dateLivraison || '',
                statut: commande.statut || 'en_attente',
                note: commande.note || '',
            });
            setLignes(commande.lignes?.length > 0 ? commande.lignes : [emptyLigne()]);
        } else {
            setFormData({
                fournisseurId: '',
                dateCommande: new Date().toISOString().split('T')[0],
                dateLivraison: '',
                statut: 'en_attente',
                note: '',
            });
            setLignes([emptyLigne()]);
        }
        setErrors({});
    }, [commande, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const handleLigneChange = (id, field, value) => {
        setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };
    const handleAddLigne = () => setLignes(prev => [...prev, emptyLigne()]);
    const handleRemoveLigne = (id) => setLignes(prev => prev.filter(l => l.id !== id));

    const total = useMemo(() =>
        lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0),
        [lignes]);

    const validateForm = () => {
        const e = {};
        if (!formData.fournisseurId) e.fournisseurId = 'Sélectionnez un fournisseur';
        if (!formData.dateCommande) e.dateCommande = 'La date est requise';
        if (lignes.every(l => !l.produit.trim())) e.lignes = 'Ajoutez au moins un article';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validateForm()) return;
        const fournisseur = fournisseurs.find(f => f.id === parseInt(formData.fournisseurId));
        onSave({
            ...formData,
            fournisseurId: parseInt(formData.fournisseurId),
            fournisseurNom: fournisseur?.nom || '',
            lignes: lignes.filter(l => l.produit.trim()),
            total,
            id: commande?.id || Date.now(),
            reference: commande?.reference || `CMD-${Date.now().toString().slice(-6)}`,
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-900/80 z-[10000] flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl bg-white rounded shadow-2xl flex flex-col overflow-hidden my-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="bg-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="receipt" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? `Commande ${commande.reference}` : 'Nouvelle commande'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode ? 'Modifiez les informations de la commande' : 'Créez une commande fournisseur'}
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

                        {/* ══ Informations ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations de la commande</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">

                                {/* Fournisseur */}
                                <InputSelect
                                    label="Fournisseur"
                                    value={formData.fournisseurId}
                                    onChange={v => handleChange('fournisseurId', v)}
                                    options={[
                                        { value: '', label: 'Sélectionner un fournisseur' },
                                        ...fournisseurs.map(f => ({ value: f.id.toString(), label: f.nom }))
                                    ]}
                                    error={errors.fournisseurId}
                                    fullWidth
                                    required
                                />

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Date de commande"
                                        value={formData.dateCommande}
                                        onChange={e => handleChange('dateCommande', e.target.value)}
                                        error={errors.dateCommande}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        type="date"
                                        label="Date de livraison prévue"
                                        value={formData.dateLivraison}
                                        onChange={e => handleChange('dateLivraison', e.target.value)}
                                        fullWidth
                                    />
                                </div>

                                {/* Statut */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-slate-600">Statut</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(STATUT_CONFIG).map(([key, cfg]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleChange('statut', key)}
                                                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded border-2 text-xs font-bold transition-all ${formData.statut === key
                                                    ? `border-sky-500 bg-sky-50 text-sky-700`
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <Bx icon={cfg.icon} className={`text-xl ${formData.statut === key ? cfg.color.split(' ')[1] : 'text-slate-400'}`} />
                                                {cfg.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ══ Articles ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                                        <Bx icon="list-ul" className="text-base" />
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Articles commandés</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddLigne}
                                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded transition-all"
                                >
                                    <Bx icon="plus" className="text-sm" /> Ajouter un article
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-3">
                                {lignes.map((l, i) => (
                                    <LigneProduit
                                        key={l.id}
                                        ligne={l}
                                        index={i}
                                        onChange={handleLigneChange}
                                        onRemove={handleRemoveLigne}
                                        canRemove={lignes.length > 1}
                                    />
                                ))}
                                {errors.lignes && (
                                    <p className="text-sm text-red-500 flex items-center gap-1.5">
                                        <Bx icon="error" className="text-base" /> {errors.lignes}
                                    </p>
                                )}
                                {/* Total */}
                                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 mt-1">
                                    <span className="text-sm font-semibold text-slate-500">Total commande</span>
                                    <span className="text-xl font-black text-slate-800">{formatAr(total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ══ Note ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-violet-100 rounded flex items-center justify-center text-violet-600">
                                    <Bx icon="note" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Note</h3>
                            </div>
                            <div className="p-5">
                                <InputTextarea
                                    placeholder="Instructions de livraison, remarques particulières..."
                                    value={formData.note}
                                    onChange={e => handleChange('note', e.target.value)}
                                    rows={2}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">{lignes.filter(l => l.produit.trim()).length} article{lignes.filter(l => l.produit.trim()).length > 1 ? 's' : ''}</span>
                            <span className="text-sm font-bold text-slate-700">{formatAr(total)}</span>
                        </div>
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
                                {isEditMode ? 'Enregistrer' : 'Créer la commande'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

CommandeModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    commande: PropTypes.object,
    fournisseurs: PropTypes.arrayOf(PropTypes.object),
};

export default CommandeModal;