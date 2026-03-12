import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Input from '../UI/Input/Input';
import InputTextarea from '../UI/Input/InputTextarea';
import Bx from '../UI/Boxicon';

const CategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
    const isEditMode = !!category;

    const [formData, setFormData] = useState({
        nom: category?.nom || '',
        description: category?.description || '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setFormData({
            nom: category?.nom || '',
            description: category?.description || '',
        });
        setErrors({});
    }, [category, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSave({
            ...formData,
            id: category?.id || Date.now(),
            produitsCount: category?.produitsCount || 0,
            dateCreation: category?.dateCreation || new Date().toISOString().split('T')[0],
        });
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-slate-900/80 z-[10000] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded shadow-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className="bg-slate-800 px-6 py-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="category" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">
                                {isEditMode ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                            </h2>
                            <p className="text-sm text-white/60 mt-0.5">
                                {isEditMode ? 'Modifiez les informations ci-dessous' : 'Ajoutez une catégorie à votre inventaire'}
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
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-5 flex flex-col gap-4 bg-slate-50">
                        <div className="bg-white border border-slate-200 rounded overflow-hidden">
                            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
                                <div className="w-7 h-7 bg-sky-100 rounded flex items-center justify-center text-sky-600">
                                    <Bx icon="info-circle" className="text-base" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Informations</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                <Input
                                    type="text"
                                    label="Nom de la catégorie"
                                    placeholder="Ex: Matériaux Construction"
                                    value={formData.nom}
                                    onChange={(e) => handleChange('nom', e.target.value)}
                                    error={errors.nom}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                                <InputTextarea
                                    label="Description (optionnel)"
                                    placeholder="Description de la catégorie..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={3}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="bg-white border-t border-slate-200 px-5 py-4 flex items-center justify-end gap-2 shrink-0">
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
                            {isEditMode ? 'Enregistrer les modifications' : 'Créer la catégorie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

CategoryModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    category: PropTypes.object,
};

export default CategoryModal;