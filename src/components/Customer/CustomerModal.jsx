import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../Input/Input';
import InputTextarea from '../Input/InputTextarea';
import Bx from '../UI/Boxicon';

const CustomerModal = ({ isOpen, onClose, onSave, client = null }) => {
    const isEditMode = !!client;

    const [formData, setFormData] = useState({
        nom: '',
        telephone: '',
        adresse: '',
        statut: 'actif',
    });
    const [errors, setErrors] = useState({});

    /* ── Reset à l'ouverture ── */
    useEffect(() => {
        setFormData({
            nom: client?.nom || '',
            telephone: client?.telephone || '',
            adresse: client?.adresse || '',
            statut: client?.statut || 'actif',
        });
        setErrors({});
    }, [client, isOpen]);

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
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validateForm()) return;
        onSave({
            ...formData,
            id: client?.id || Date.now(),
        });
    };

    if (!isOpen) return null;

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
                            <Bx icon="group" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? 'Modifier le client' : 'Nouveau client'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode
                                    ? 'Modifiez les informations du client'
                                    : 'Ajoutez un nouveau client à votre base de données'}
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

                        {/* ══ Section : Informations principales ══ */}
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations principales</h3>
                            </div>

                            <div className="p-5 flex flex-col gap-4">

                                {/* Nom */}
                                <Input
                                    type="text"
                                    label="Nom"
                                    placeholder="Ex: Mr. Rakoto Jean"
                                    value={formData.nom}
                                    onChange={(e) => handleChange('nom', e.target.value)}
                                    error={errors.nom}
                                    icon={<Bx icon="user" className="text-lg" />}
                                    fullWidth
                                    required
                                    autoFocus
                                />

                                {/* Téléphone */}
                                <Input
                                    type="tel"
                                    label="Téléphone"
                                    placeholder="+261 34 00 123 45"
                                    value={formData.telephone}
                                    onChange={(e) => handleChange('telephone', e.target.value)}
                                    error={errors.telephone}
                                    icon={<Bx icon="phone" className="text-lg" />}
                                    fullWidth
                                    required
                                />

                                {/* Adresse */}
                                <InputTextarea
                                    label="Adresse"
                                    placeholder="Adresse complète..."
                                    value={formData.adresse}
                                    onChange={(e) => handleChange('adresse', e.target.value)}
                                    rows={2}
                                    fullWidth
                                />
                            </div>
                        </div>

                    </div>

                    {/* ── Footer ── */}
                    <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
                        <p className="text-xs text-slate-400">
                            {isEditMode ? `Modification de ${client.nom}` : 'Nouveau client'}
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
                                {isEditMode ? 'Enregistrer les modifications' : 'Créer le client'}
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
    client: PropTypes.object,
};

export default CustomerModal;