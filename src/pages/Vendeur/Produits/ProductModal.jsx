import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ProductModal.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InputTextarea from '../../../components/Input/InputTextarea';
import {
    IoImageOutline,
    IoInformationCircleOutline
} from "react-icons/io5";
import {
    MdReceiptLong
} from "react-icons/md";

const ProductModal = ({ isOpen, onClose, onSave, product = null, categories = [] }) => {
    const isEditMode = !!product;

    const [formData, setFormData] = useState({
        nom: product?.nom || '',
        reference: product?.reference || '',
        categorie: product?.categorie || '',
        nouvelleCategorie: '',
        description: product?.description || '',
        stock: product?.stock || 0,
        seuilMin: product?.seuilMin || 10,
        prixAchat: product?.prixAchat || 0,
        prixVente: product?.prixVente || 0,
        unite: product?.unite || 'unité',
        emplacement: product?.emplacement || '',
        fournisseur: product?.fournisseur || '',
        peutEtreVenduEnDetail: product?.peutEtreVenduEnDetail || false,
        prixDetail: product?.prixDetail || 0,
        uniteDetail: product?.uniteDetail || 'kg',
        tva: product?.tva || 20,
        image: product?.image || ''
    });

    const [useNewCategory, setUseNewCategory] = useState(false);
    const [errors, setErrors] = useState({});

    // Générer référence automatique si création
    useEffect(() => {
        if (!isEditMode && !formData.reference) {
            const timestamp = Date.now().toString().slice(-6);
            const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
            setFormData(prev => ({
                ...prev,
                reference: `PROD-${timestamp}-${randomChars}`
            }));
        }
    }, [isEditMode, formData.reference]);


    const calculateMarge = useCallback(() => {
        if (formData.prixAchat > 0 && formData.prixVente > 0) {
            return Math.round(((formData.prixVente - formData.prixAchat) / formData.prixAchat) * 100);
        }
        return 0;
    }, [formData.prixAchat, formData.prixVente]);

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

        if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
        if (!formData.reference.trim()) newErrors.reference = 'La référence est requise';

        const selectedCategory = useNewCategory ? formData.nouvelleCategorie.trim() : formData.categorie;
        if (!selectedCategory) newErrors.categorie = 'La catégorie est requise';

        if (formData.stock < 0) newErrors.stock = 'Le stock ne peut pas être négatif';
        if (formData.seuilMin < 0) newErrors.seuilMin = 'Le seuil minimum ne peut pas être négatif';
        if (formData.prixAchat < 0) newErrors.prixAchat = 'Le prix d\'achat ne peut pas être négatif';
        if (formData.prixVente < 0) newErrors.prixVente = 'Le prix de vente ne peut pas être négatif';
        if (formData.prixVente < formData.prixAchat) {
            newErrors.prixVente = 'Le prix de vente doit être supérieur au prix d\'achat';
        }

        if (formData.peutEtreVenduEnDetail && formData.prixDetail <= 0) {
            newErrors.prixDetail = 'Le prix détail est requis si vente au détail activée';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const categoryToUse = useNewCategory ? formData.nouvelleCategorie.trim() : formData.categorie;

        const productData = {
            ...formData,
            categorie: categoryToUse,
            id: product?.id || Date.now(),
            dateAjout: product?.dateAjout || new Date().toISOString().split('T')[0],
            dateCreation: product?.dateCreation || new Date().toISOString().split('T')[0],
            derniereModification: new Date().toISOString()
        };

        onSave(productData);
    };

    if (!isOpen) return null;

    const marge = calculateMarge();

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <MdReceiptLong className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.modalTitle}>
                                {isEditMode ? 'Modifier le Produit' : 'Nouveau Produit'}
                            </h1>
                            <p className={styles.modalSubtitle}>
                                {isEditMode ? 'Modifiez les informations du produit' : 'Ajoutez un nouveau produit à votre inventaire'}
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
                        {/* Informations de base */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <IoInformationCircleOutline className={styles.sectionIcon} />
                                <h3 className={styles.sectionTitle}>Informations de base</h3>
                            </div>

                            <div className={styles.formRow}>
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
                            </div>

                            <div className={styles.formRow}>
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

                            <div className={styles.formRow}>
                                <div className={styles.categoryContainer}>
                                    <div className={styles.categoryToggle}>
                                        <Button
                                            type="button"
                                            variant={useNewCategory ? 'outline' : 'primary'}
                                            size="small"
                                            onClick={() => setUseNewCategory(false)}
                                        >
                                            Sélectionner
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={useNewCategory ? 'primary' : 'outline'}
                                            size="small"
                                            onClick={() => setUseNewCategory(true)}
                                        >
                                            Nouvelle catégorie
                                        </Button>
                                    </div>

                                    {useNewCategory ? (
                                        <Input
                                            type="text"
                                            label="Nouvelle catégorie"
                                            placeholder="Ex: Matériaux Construction"
                                            value={formData.nouvelleCategorie}
                                            onChange={(e) => handleChange('nouvelleCategorie', e.target.value)}
                                            error={errors.categorie}
                                            fullWidth
                                            required
                                        />
                                    ) : (
                                        <InputSelect
                                            label="Catégorie"
                                            value={formData.categorie}
                                            onChange={(value) => handleChange('categorie', value)}
                                            options={[
                                                { value: '', label: 'Sélectionner une catégorie' },
                                                ...categories.map(cat => ({
                                                    value: cat,
                                                    label: cat
                                                }))
                                            ]}
                                            placeholder="Choisir une catégorie..."
                                            error={errors.categorie}
                                            fullWidth
                                            required
                                        />
                                    )}
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <InputTextarea
                                    label="Description"
                                    placeholder="Description du produit..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={3}
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Stock et Prix */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <IoInformationCircleOutline className={styles.sectionIcon} />
                                <h3 className={styles.sectionTitle}>Stock et Prix</h3>
                            </div>

                            <div className={styles.formRowTwo}>
                                <Input
                                    type="number"
                                    label="Stock initial"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => handleChange('stock', Number.parseInt(e.target.value, 10) || 0)}
                                    error={errors.stock}
                                    min="0"
                                    fullWidth
                                />
                                <Input
                                    type="number"
                                    label="Seuil minimum"
                                    placeholder="10"
                                    value={formData.seuilMin}
                                    onChange={(e) => handleChange('seuilMin', Number.parseInt(e.target.value, 10) || 0)}
                                    error={errors.seuilMin}
                                    min="0"
                                    fullWidth
                                />
                            </div>

                            <div className={styles.formRowTwo}>
                                <Input
                                    type="number"
                                    label="Prix d'achat (MGA)"
                                    placeholder="0"
                                    value={formData.prixAchat}
                                    onChange={(e) => handleChange('prixAchat', Number.parseInt(e.target.value, 10) || 0)}
                                    error={errors.prixAchat}
                                    min="0"
                                    fullWidth
                                />
                                <Input
                                    type="number"
                                    label="Prix de vente"
                                    placeholder="0"
                                    value={formData.prixVente}
                                    onChange={(e) => handleChange('prixVente', Number.parseInt(e.target.value, 10) || 0)}
                                    error={errors.prixVente}
                                    min="0"
                                    fullWidth
                                    required
                                />
                            </div>

                            {marge > 0 && (
                                <div className={styles.margeInfo}>
                                    <span>Marge bénéficiaire:</span>
                                    <span className={styles.margeValue}>{marge}%</span>
                                </div>
                            )}

                            <div className={styles.formRowTwo}>
                                <Input
                                    type="text"
                                    label="Unité"
                                    placeholder="Ex: sac, pièce, kg"
                                    value={formData.unite}
                                    onChange={(e) => handleChange('unite', e.target.value)}
                                    fullWidth
                                />
                                <Input
                                    type="number"
                                    label="TVA (%)"
                                    placeholder="20"
                                    value={formData.tva}
                                    onChange={(e) => handleChange('tva', Number.parseInt(e.target.value, 10) || 0)}
                                    min="0"
                                    max="100"
                                    fullWidth
                                />
                            </div>
                        </div>

                        {/* Options supplémentaires */}
                        <div className={styles.formSection}>
                            <div className={styles.sectionHeader}>
                                <IoInformationCircleOutline className={styles.sectionIcon} />
                                <h3 className={styles.sectionTitle}>Options supplémentaires</h3>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id="peutEtreVenduEnDetail"
                                        checked={formData.peutEtreVenduEnDetail}
                                        onChange={(e) => handleChange('peutEtreVenduEnDetail', e.target.checked)}
                                        className={styles.checkbox}
                                    />
                                    <label htmlFor="peutEtreVenduEnDetail" className={styles.checkboxLabel}>
                                        Peut être vendu au détail
                                    </label>
                                </div>
                            </div>

                            {formData.peutEtreVenduEnDetail && (
                                <div className={styles.formRowTwo}>
                                    <Input
                                        type="number"
                                        label="Prix détail (MGA)"
                                        placeholder="0"
                                        value={formData.prixDetail}
                                        onChange={(e) => handleChange('prixDetail', Number.parseInt(e.target.value, 10) || 0)}
                                        error={errors.prixDetail}
                                        min="0"
                                        fullWidth
                                    />
                                    <Input
                                        type="text"
                                        label="Unité détail"
                                        placeholder="Ex: kg, pièce"
                                        value={formData.uniteDetail}
                                        onChange={(e) => handleChange('uniteDetail', e.target.value)}
                                        fullWidth
                                    />
                                </div>
                            )}

                            <div className={styles.formRowTwo}>
                                <Input
                                    type="text"
                                    label="Emplacement"
                                    placeholder="Ex: Entrepôt A, Zone 1"
                                    value={formData.emplacement}
                                    onChange={(e) => handleChange('emplacement', e.target.value)}
                                    fullWidth
                                />
                                <Input
                                    type="text"
                                    label="Fournisseur"
                                    placeholder="Nom du fournisseur"
                                    value={formData.fournisseur}
                                    onChange={(e) => handleChange('fournisseur', e.target.value)}
                                    fullWidth
                                />
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="text"
                                    label="Image (URL)"
                                    placeholder="https://..."
                                    value={formData.image}
                                    onChange={(e) => handleChange('image', e.target.value)}
                                    icon={<IoImageOutline />}
                                    fullWidth
                                />
                            </div>
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
                            {isEditMode ? 'Enregistrer les modifications' : 'Créer le produit'}
                        </Button>
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
    categories: PropTypes.arrayOf(PropTypes.string)
};

export default ProductModal;
