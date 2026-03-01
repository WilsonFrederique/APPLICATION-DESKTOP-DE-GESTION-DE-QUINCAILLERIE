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
    FaWarehouse,
    FaArrowUp,
    FaArrowDown,
    FaExchangeAlt
} from "react-icons/fa";

const StockModal = ({ isOpen, onClose, onSave, products = [], stockItem = null }) => {
    const isEditMode = !!stockItem;

    const [formData, setFormData] = useState({
        produitId: stockItem?.id || '',
        typeMouvement: 'reception', // reception, sortie, ajustement
        quantite: 0,
        note: ''
    });

    const [errors, setErrors] = useState({});
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (stockItem) {
            setFormData({
                produitId: stockItem.id,
                typeMouvement: 'ajustement',
                quantite: 0,
                note: ''
            });
            setSelectedProduct(stockItem);
        } else {
            setFormData({
                produitId: '',
                typeMouvement: 'reception',
                quantite: 0,
                note: ''
            });
            setSelectedProduct(null);
        }
        setErrors({});
    }, [stockItem, isOpen]);

    useEffect(() => {
        if (formData.produitId) {
            const product = products.find(p => p.id === Number.parseInt(formData.produitId, 10));
            setSelectedProduct(product || null);
        } else {
            setSelectedProduct(null);
        }
    }, [formData.produitId, products]);

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

    const calculateNewStock = () => {
        if (!selectedProduct) return null;

        const currentStock = selectedProduct.stock || 0;
        const quantity = Number.parseInt(formData.quantite, 10) || 0;

        if (formData.typeMouvement === 'reception') {
            return currentStock + quantity;
        } else if (formData.typeMouvement === 'sortie') {
            return Math.max(0, currentStock - quantity);
        } else {
            // Ajustement - la quantité devient le nouveau stock
            return quantity;
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.produitId) {
            newErrors.produitId = 'Veuillez sélectionner un produit';
        }

        if (!formData.quantite || formData.quantite <= 0) {
            newErrors.quantite = 'La quantité doit être supérieure à 0';
        }

        if (selectedProduct && formData.typeMouvement === 'sortie') {
            const currentStock = selectedProduct.stock || 0;
            if (formData.quantite > currentStock) {
                newErrors.quantite = `Stock insuffisant. Stock actuel: ${currentStock} ${selectedProduct.unite}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newStock = calculateNewStock();
        const mouvementData = {
            produitId: Number.parseInt(formData.produitId, 10),
            produit: selectedProduct,
            typeMouvement: formData.typeMouvement,
            quantite: Number.parseInt(formData.quantite, 10),
            stockAvant: selectedProduct.stock || 0,
            stockApres: newStock,
            note: formData.note.trim(),
            date: new Date().toISOString().split('T')[0]
        };

        onSave(mouvementData);
    };

    if (!isOpen) return null;

    const newStock = calculateNewStock();
    const typeMouvementLabels = {
        'reception': 'Réception',
        'sortie': 'Sortie',
        'ajustement': 'Ajustement'
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerTitle}>
                        <FaWarehouse className={styles.headerIcon} />
                        <div>
                            <h1 className={styles.modalTitle}>
                                {isEditMode ? 'Ajuster le Stock' : 'Nouveau Mouvement de Stock'}
                            </h1>
                            <p className={styles.modalSubtitle}>
                                {isEditMode
                                    ? 'Ajustez le stock de ce produit'
                                    : 'Enregistrez une réception, une sortie ou un ajustement de stock'}
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
                                <h3 className={styles.sectionTitle}>Informations du mouvement</h3>
                            </div>

                            <div className={styles.formRow}>
                                <InputSelect
                                    label="Produit"
                                    value={formData.produitId}
                                    onChange={(value) => handleChange('produitId', value)}
                                    options={[
                                        { value: '', label: 'Sélectionner un produit' },
                                        ...products.map(prod => ({
                                            value: prod.id.toString(),
                                            label: `${prod.nom} (${prod.reference}) - Stock: ${prod.stock} ${prod.unite}`
                                        }))
                                    ]}
                                    placeholder="Choisir un produit..."
                                    error={errors.produitId}
                                    fullWidth
                                    required
                                    disabled={isEditMode}
                                />
                            </div>

                            {selectedProduct && (
                                <div className={styles.margeInfo}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span>Stock actuel:</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                                            {selectedProduct.stock} {selectedProduct.unite}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Seuil minimum:</span>
                                        <span>{selectedProduct.seuilMin} {selectedProduct.unite}</span>
                                    </div>
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <InputSelect
                                    label="Type de mouvement"
                                    value={formData.typeMouvement}
                                    onChange={(value) => handleChange('typeMouvement', value)}
                                    options={[
                                        { value: 'reception', label: 'Réception (Ajout)' },
                                        { value: 'sortie', label: 'Sortie (Retrait)' },
                                        { value: 'ajustement', label: 'Ajustement (Nouveau stock)' }
                                    ]}
                                    placeholder="Type de mouvement"
                                    fullWidth
                                    required
                                    icon={formData.typeMouvement === 'reception' ? <FaArrowUp /> :
                                        formData.typeMouvement === 'sortie' ? <FaArrowDown /> :
                                            <FaExchangeAlt />}
                                />
                            </div>

                            <div className={styles.formRow}>
                                <Input
                                    type="number"
                                    label={formData.typeMouvement === 'ajustement' ? 'Nouveau stock' : 'Quantité'}
                                    placeholder={formData.typeMouvement === 'ajustement' ? 'Stock final' : 'Quantité à ajouter/retirer'}
                                    value={formData.quantite}
                                    onChange={(e) => handleChange('quantite', e.target.value)}
                                    error={errors.quantite}
                                    min="1"
                                    fullWidth
                                    required
                                    autoFocus={!!selectedProduct}
                                />
                            </div>

                            {newStock !== null && selectedProduct && (
                                <div className={styles.margeInfo} style={{ background: '#f0f9ff', borderLeftColor: '#3b82f6' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>Stock après mouvement:</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#3b82f6' }}>
                                            {newStock} {selectedProduct.unite}
                                        </span>
                                    </div>
                                    {newStock <= selectedProduct.seuilMin && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#f59e0b' }}>
                                            ⚠️ Attention: Le stock sera en dessous du seuil minimum
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={styles.formRow}>
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
                                {isEditMode ? 'Enregistrer l\'ajustement' : `Enregistrer ${typeMouvementLabels[formData.typeMouvement]}`}
                            </Button>
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
    stockItem: PropTypes.object
};

export default StockModal;
