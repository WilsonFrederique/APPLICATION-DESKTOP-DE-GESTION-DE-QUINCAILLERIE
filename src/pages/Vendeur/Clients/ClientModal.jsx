import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../Produits/ProductModal.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import {
    IoInformationCircleOutline
} from "react-icons/io5";
import {
    FaUserTie,
    FaBuilding
} from "react-icons/fa";
import {
    MdOutlineGroup
} from "react-icons/md";

const ClientModal = ({ isOpen, onClose, onSave, client = null }) => {
    const isEditMode = !!client;

    const [formData, setFormData] = useState({
        nom: '',
        type: 'Particulier', // Particulier, Entreprise
        contact: '',
        telephone: '',
        email: '',
        adresse: '',
        categorie: 'Client Standard', // Client Standard, Client Silver, Client Gold, Client Premium
        credit_autorise: 0,
        statut: 'actif' // actif, inactif
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            setFormData({
                nom: client.nom || '',
                type: client.type || 'Particulier',
                contact: client.contact || '',
                telephone: client.telephone || '',
                email: client.email || '',
                adresse: client.adresse || '',
                categorie: client.categorie || 'Client Standard',
                credit_autorise: client.credit_autorise || 0,
                statut: client.statut || 'actif'
            });
        } else {
            setFormData({
                nom: '',
                type: 'Particulier',
                contact: '',
                telephone: '',
                email: '',
                adresse: '',
                categorie: 'Client Standard',
                credit_autorise: 0,
                statut: 'actif'
            });
        }
        setErrors({});
    }, [client, isOpen]);

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

        if (!formData.contact.trim()) {
            newErrors.contact = 'Le contact est requis';
        }

        if (!formData.telephone.trim()) {
            newErrors.telephone = 'Le téléphone est requis';
        } else if (!/^\+?[0-9\s-]+$/.test(formData.telephone)) {
            newErrors.telephone = 'Format de téléphone invalide';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (formData.credit_autorise < 0) {
            newErrors.credit_autorise = 'Le crédit autorisé ne peut pas être négatif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const clientData = {
            ...formData,
            id: client?.id || Date.now(),
            credit_utilise: client?.credit_utilise || 0,
            total_achats: client?.total_achats || 0,
            dernier_achat: client?.dernier_achat || null
        };

        onSave(clientData);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <MdOutlineGroup className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.modalTitle}>
                                {isEditMode ? 'Modifier le Client' : 'Nouveau Client'}
                            </h1>
                            <p className={styles.modalSubtitle}>
                                {isEditMode
                                    ? 'Modifiez les informations du client'
                                    : 'Ajoutez un nouveau client à votre base de données'}
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
                                <h3 className={styles.sectionTitle}>Informations principales</h3>
                            </div>

                            <div className={styles.formRow}>
                                <InputSelect
                                    label="Type de client"
                                    value={formData.type}
                                    onChange={(value) => handleChange('type', value)}
                                    options={[
                                        { value: 'Particulier', label: 'Particulier' },
                                        { value: 'Entreprise', label: 'Entreprise' }
                                    ]}
                                    placeholder="Type de client"
                                    fullWidth
                                    required
                                    icon={formData.type === 'Entreprise' ? <FaBuilding /> : <FaUserTie />}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="text"
                                    label="Nom"
                                    placeholder={formData.type === 'Entreprise' ? 'Ex: SARL Batiment Plus' : 'Ex: Mr. Rakoto Jean'}
                                    value={formData.nom}
                                    onChange={(e) => handleChange('nom', e.target.value)}
                                    error={errors.nom}
                                    fullWidth
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="text"
                                    label="Contact"
                                    placeholder="Nom de la personne de contact"
                                    value={formData.contact}
                                    onChange={(e) => handleChange('contact', e.target.value)}
                                    error={errors.contact}
                                    fullWidth
                                    required
                                />
                            </div>

                            <div className={styles.formRowTwo}>
                                <Input
                                    type="tel"
                                    label="Téléphone"
                                    placeholder="+261 34 00 123 45"
                                    value={formData.telephone}
                                    onChange={(e) => handleChange('telephone', e.target.value)}
                                    error={errors.telephone}
                                    fullWidth
                                    required
                                />
                                <Input
                                    type="email"
                                    label="Email (optionnel)"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    error={errors.email}
                                    fullWidth
                                />
                            </div>

                            <div className={styles.formRow}>
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

                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <IoInformationCircleOutline className={styles.sectionIcon} />
                                <h3 className={styles.sectionTitle}>Classification et crédit</h3>
                            </div>

                            <div className={styles.formRowTwo}>
                                <InputSelect
                                    label="Catégorie"
                                    value={formData.categorie}
                                    onChange={(value) => handleChange('categorie', value)}
                                    options={[
                                        { value: 'Client Standard', label: 'Client Standard' },
                                        { value: 'Client Silver', label: 'Client Silver' },
                                        { value: 'Client Gold', label: 'Client Gold' },
                                        { value: 'Client Premium', label: 'Client Premium' }
                                    ]}
                                    placeholder="Catégorie"
                                    fullWidth
                                    required
                                />
                                <InputSelect
                                    label="Statut"
                                    value={formData.statut}
                                    onChange={(value) => handleChange('statut', value)}
                                    options={[
                                        { value: 'actif', label: 'Actif' },
                                        { value: 'inactif', label: 'Inactif' }
                                    ]}
                                    placeholder="Statut"
                                    fullWidth
                                    required
                                />
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="number"
                                    label="Crédit autorisé (MGA)"
                                    placeholder="0"
                                    value={formData.credit_autorise}
                                    onChange={(e) => handleChange('credit_autorise', Number.parseInt(e.target.value, 10) || 0)}
                                    error={errors.credit_autorise}
                                    min="0"
                                    fullWidth
                                />
                            </div>

                            {formData.credit_autorise > 0 && (
                                <div className={styles.margeInfo}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Crédit disponible:</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#059669' }}>
                                            {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'MGA',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(formData.credit_autorise)}
                                        </span>
                                    </div>
                                </div>
                            )}
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
                            {isEditMode ? 'Enregistrer les modifications' : 'Créer le client'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ClientModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    client: PropTypes.object
};

export default ClientModal;
