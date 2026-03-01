import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ProductModal.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import {
    IoInformationCircleOutline
} from "react-icons/io5";
import {
    MdReceiptLong
} from "react-icons/md";
import {
    TbCategory
} from "react-icons/tb";

const CategoryModal = ({ isOpen, onClose, onSave, category = null }) => {
    const isEditMode = !!category;

    const [formData, setFormData] = useState({
        nom: category?.nom || '',
        description: category?.description || ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                nom: category.nom || '',
                description: category.description || ''
            });
        } else {
            setFormData({
                nom: '',
                description: ''
            });
        }
        setErrors({});
    }, [category, isOpen]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nom.trim()) {
            newErrors.nom = 'Le nom est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const categoryData = {
            ...formData,
            id: category?.id || Date.now(),
            produitsCount: category?.produitsCount || 0,
            dateCreation: category?.dateCreation || new Date().toISOString().split('T')[0]
        };

        onSave(categoryData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <TbCategory className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.modalTitle}>
                                {isEditMode ? 'Modifier la Catégorie' : 'Nouvelle Catégorie'}
                            </h1>
                            <p className={styles.modalSubtitle}>
                                {isEditMode ? 'Modifiez les informations de la catégorie' : 'Ajoutez une nouvelle catégorie à votre inventaire'}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="medium"
                        icon="close"
                        onClick={onClose}
                        className={styles.closeBtn}
                        aria-label="Fermer"
                    />
                </div>

                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div className={styles.formGrid}>
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <IoInformationCircleOutline className={styles.sectionIcon} />
                                <h3 className={styles.sectionTitle}>Informations de la catégorie</h3>
                            </div>

                            <div className={styles.formRow}>
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
                            </div>

                            <div className={styles.formRow}>
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
                        
                        <div className={styles.modalFooter}>
                            <Button
                                type="button"
                                variant="outline"
                                size="large"
                                onClick={onClose}
                                className={styles.cancelBtn}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="large"
                                className={styles.submitBtn}
                            >
                                {isEditMode ? 'Enregistrer les modifications' : 'Créer la catégorie'}
                            </Button>
                        </div>
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
    category: PropTypes.object
};

export default CategoryModal;
