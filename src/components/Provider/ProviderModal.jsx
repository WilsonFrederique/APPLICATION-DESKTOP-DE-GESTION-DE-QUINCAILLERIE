import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input/Input';
import InputTextarea from '../UI/Input/InputTextarea';
import Bx from '../UI/Boxicon';

const CustomerModal = ({ isOpen, onClose, onSave, fournisseur = null }) => {
    const isEditMode = !!fournisseur;

    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        whatsapp: '',
        facebook: '',
        email: '',
        adresse: '',
        note: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            nom: fournisseur?.nom || '',
            telephone: fournisseur?.telephone || '',
            whatsapp: fournisseur?.whatsapp || '',
            facebook: fournisseur?.facebook || '',
            email: fournisseur?.email || '',
            adresse: fournisseur?.adresse || '',
            note: fournisseur?.note || '',
        });
        setErrors({});
    }, [fournisseur, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const validateForm = () => {
        const e = {};
        if (!formData.nom.trim()) e.nom = 'Le nom est requis';
        if (!formData.telephone.trim()) e.telephone = 'Le téléphone est requis';
        else if (!/^\+?[0-9\s-]+$/.test(formData.telephone))
            e.telephone = 'Format de téléphone invalide';
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            e.email = "Format d'email invalide";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validateForm()) return;
        onSave({ ...formData, id: fournisseur?.id || Date.now() });
    };

    if (!isOpen) return null;

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
                            <Bx icon="building" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode ? 'Modifiez les informations ci-dessous' : 'Ajoutez un fournisseur à votre carnet'}
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

                        {/* ══ Informations principales ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations principales</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <Input
                                    type="text"
                                    label="Nom / Raison sociale"
                                    placeholder="Ex: SARL Import Export Pro"
                                    value={formData.nom}
                                    onChange={e => handleChange('nom', e.target.value)}
                                    error={errors.nom}
                                    icon={<Bx icon="building" className="text-lg" />}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                                <InputTextarea
                                    label="Adresse"
                                    placeholder="Adresse complète du fournisseur..."
                                    value={formData.adresse}
                                    onChange={e => handleChange('adresse', e.target.value)}
                                    rows={2}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* ══ Contacts ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-emerald-100 rounded flex items-center justify-center text-emerald-600">
                                    <Bx icon="phone" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Contacts</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="tel"
                                        label="Téléphone"
                                        placeholder="+261 34 00 123 45"
                                        value={formData.telephone}
                                        onChange={e => handleChange('telephone', e.target.value)}
                                        error={errors.telephone}
                                        icon={<Bx icon="phone" className="text-lg" />}
                                        fullWidth
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        label="WhatsApp"
                                        placeholder="+261 34 00 123 45"
                                        value={formData.whatsapp}
                                        onChange={e => handleChange('whatsapp', e.target.value)}
                                        icon={<Bx icon="logo-whatsapp" className="text-lg" />}
                                        fullWidth
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="email"
                                        label="Email"
                                        placeholder="contact@fournisseur.com"
                                        value={formData.email}
                                        onChange={e => handleChange('email', e.target.value)}
                                        error={errors.email}
                                        icon={<Bx icon="envelope" className="text-lg" />}
                                        fullWidth
                                    />
                                    <Input
                                        type="text"
                                        label="Facebook"
                                        placeholder="facebook.com/fournisseur"
                                        value={formData.facebook}
                                        onChange={e => handleChange('facebook', e.target.value)}
                                        icon={<Bx icon="logo-facebook" className="text-lg" />}
                                        fullWidth
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ══ Note ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-violet-100 rounded flex items-center justify-center text-violet-600">
                                    <Bx icon="note" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Note interne</h3>
                            </div>
                            <div className="p-5">
                                <InputTextarea
                                    placeholder="Délai de livraison habituel, conditions de paiement, remarques..."
                                    value={formData.note}
                                    onChange={e => handleChange('note', e.target.value)}
                                    rows={3}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                        <p className="text-xs text-slate-400">
                            {isEditMode ? `Modification de ${fournisseur.nom}` : 'Nouveau fournisseur'}
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
                                {isEditMode ? 'Enregistrer' : 'Créer le fournisseur'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

CustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    fournisseur: PropTypes.object,
};

export default CustomerModal;