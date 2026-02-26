import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Validation.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { Chip, emphasize, styled } from '@mui/material';
import Button from '../../../components/Button/Button';
import InputTextarea from '../../../components/Input/InputTextarea';
import Toast from '../../../components/Toast/Toast';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { 
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoCheckmarkOutline,
  IoCloseOutline,
  IoCalendarOutline,
  IoPersonCircleOutline,
  IoReceiptOutline,
  IoInformationCircleOutline,
  IoDocumentTextOutline
} from "react-icons/io5";
import { 
  FaUserTie,
  FaFileInvoiceDollar,
  FaBox,
  FaSync
} from "react-icons/fa";
import { 
  TbReceipt2,
  TbPackage,
  TbCircleCheck,
  TbTruckDelivery
} from "react-icons/tb";
import { 
  MdAttachMoney
} from "react-icons/md";
import { COMMANDE_TYPES } from '../../../constants/commandeTypes';

// Définir StyledBreadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const ValidationComande = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Récupérer les données initiales depuis location.state
  const initialData = location.state?.commande;
  const initialValidationType = location.state?.typeValidation || COMMANDE_TYPES.ARRIVEE_PARTIELLE;
  
  // Calculer les quantités initiales avec useMemo pour éviter les recalculs inutiles
  const initialQuantities = useMemo(() => {
    if (!initialData) return {};
    
    const quantities = {};
    initialData.produits.forEach(produit => {
      quantities[produit.id] = initialValidationType === COMMANDE_TYPES.ARRIVEE_PARTIELLE 
        ? (produit.qtyRecue || 0)
        : produit.qty;
    });
    return quantities;
  }, [initialData, initialValidationType]);
  
  // États pour la validation
  const [commande] = useState(initialData);
  const [quantities, setQuantities] = useState(initialQuantities);
  const [notes, setNotes] = useState('');
  const [toasts, setToasts] = useState([]);
  const [typeValidation] = useState(initialValidationType);
  
  // Rediriger si pas de données initiales
  useEffect(() => {
    if (!commande) {
      navigate('/commandesAdmin');
    }
  }, [commande, navigate]);

  // Fonction pour ajouter un toast
  const addToast = (message, type = "info") => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== toastId));
    }, 5000);
  };

  // Gestion des changements de quantité
  const handleQuantityChange = (produitId, value) => {
    if (!commande) return;
    
    const produit = commande.produits.find(p => p.id === produitId);
    if (!produit) return;
    
    const qtyMax = produit.qty;
    const newValue = Math.min(Math.max(0, parseInt(value) || 0), qtyMax);
    
    setQuantities(prev => ({
      ...prev,
      [produitId]: newValue
    }));
  };

  // Soumettre la validation
  const handleSubmit = () => {
    if (!commande) return;
    
    const updatedProduits = commande.produits.map(produit => ({
      ...produit,
      qtyRecue: quantities[produit.id] || 0
    }));

    const allValidated = updatedProduits.every(p => p.qtyRecue >= p.qty);
    const newTypeCommande = allValidated 
      ? COMMANDE_TYPES.VALIDEE 
      : COMMANDE_TYPES.ARRIVEE_PARTIELLE;

    console.log('Commande mise à jour:', {
      ...commande,
      produits: updatedProduits,
      typeCommande: newTypeCommande,
      statut: newTypeCommande
    });
    
    addToast(
      newTypeCommande === COMMANDE_TYPES.VALIDEE 
        ? 'Commande validée avec succès !' 
        : 'Quantités mises à jour avec succès !',
      'success'
    );

    // Rediriger vers la liste des commandes après 2 secondes
    setTimeout(() => {
      navigate('/commandesAdmin');
    }, 2000);
  };

  // Calcul des totaux
  const calculateTotals = () => {
    if (!commande) return { totalQty: 0, totalRecue: 0, totalPending: 0 };
    
    const totalQty = commande.produits.reduce((sum, p) => sum + p.qty, 0);
    const totalRecue = Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0);
    const totalPending = totalQty - totalRecue;
    
    return { totalQty, totalRecue, totalPending };
  };

  const { totalQty, totalRecue, totalPending } = calculateTotals();

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formater le montant
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Obtenir le titre selon le type de validation
  const getTitle = () => {
    switch(typeValidation) {
      case COMMANDE_TYPES.ARRIVEE_PARTIELLE:
        return "Validation Arrivée Partielle";
      case COMMANDE_TYPES.VALIDEE:
        return "Validation Complète";
      default:
        return "Validation des Quantités Reçues";
    }
  };

  // Obtenir la description selon le type de validation
  const getDescription = () => {
    if (!commande) return "";
    
    switch(typeValidation) {
      case COMMANDE_TYPES.ARRIVEE_PARTIELLE:
        return `Saisissez les quantités reçues pour la commande ${commande.numero}`;
      case COMMANDE_TYPES.VALIDEE:
        return `Validez la réception complète de la commande ${commande.numero}`;
      default:
        return `Validez les quantités reçues pour ${commande.numero}`;
    }
  };

  // Obtenir la couleur du type de validation
  const getValidationColor = () => {
    switch(typeValidation) {
      case COMMANDE_TYPES.ARRIVEE_PARTIELLE:
        return '#f59e0b';
      case COMMANDE_TYPES.VALIDEE:
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  if (!commande) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Chargement de la commande...</p>
      </div>
    );
  }

  return (
    <div className={styles.validationContainer}>
      <div className={styles.validationContent}>
        {/* Header */}
        <div className={styles.validationHeader}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.pageTitle}>
                  {getTitle()}
                </h1>
                <p className={styles.pageSubtitle}>
                  {getDescription()}
                </p>
              </div>
            </div>
            
            {/* Actions rapides */}
            <div className={styles.headerActions}>
              <Button 
                variant="outline"
                size="medium"
                icon="arrow-back"
                onClick={() => navigate('/commandesAdmin')}
                className={styles.headerButton}
              >
                Retour
              </Button>
              <Button 
                variant="primary"
                size="medium"
                icon="check"
                onClick={handleSubmit}
                className={styles.headerButton}
                disabled={Object.values(quantities).every(qty => qty === 0)}
              >
                Valider
              </Button>
            </div>
          </div>
          
          <div className={styles.headerBreadcrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="span"
                label="Accueil"
                icon={<HomeIcon fontSize="small" />}
                onClick={() => navigate('/dashboardAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Commandes"
                onClick={() => navigate('/commandesAdmin')}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Validation"
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Informations de la commande */}
        <div className={styles.commandeInfoSection}>
          <div className={styles.commandeInfoCard}>
            <div className={styles.commandeInfoHeader}>
              <div className={styles.commandeInfoTitle}>
                <IoReceiptOutline className={styles.commandeInfoIcon} />
                <div>
                  <h3 className={styles.commandeNumero}>{commande.numero}</h3>
                  <p className={styles.commandeClient}>{commande.client}</p>
                </div>
              </div>
              <div 
                className={styles.commandeTypeBadge}
                style={{ backgroundColor: `${getValidationColor()}20`, color: getValidationColor() }}
              >
                {typeValidation === COMMANDE_TYPES.ARRIVEE_PARTIELLE ? 'Arrivée Partielle' : 'Validation Complète'}
              </div>
            </div>
            
            <div className={styles.commandeInfoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <IoPersonCircleOutline />
                  <span>Client</span>
                </div>
                <div className={styles.infoValue}>{commande.client}</div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <FaUserTie />
                  <span>Vendeur</span>
                </div>
                <div className={styles.infoValue}>{commande.vendeur}</div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <IoCalendarOutline />
                  <span>Date commande</span>
                </div>
                <div className={styles.infoValue}>{formatDate(commande.date)}</div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <TbTruckDelivery />
                  <span>Livraison prévue</span>
                </div>
                <div className={styles.infoValue}>{formatDate(commande.dateLivraison)}</div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <MdAttachMoney />
                  <span>Montant total</span>
                </div>
                <div className={styles.infoValue}>{formatMontant(commande.montant)}</div>
              </div>
              
              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>
                  <FaBox />
                  <span>Articles</span>
                </div>
                <div className={styles.infoValue}>{commande.articles}</div>
              </div>
            </div>
            
            {commande.notes && (
              <div className={styles.commandeNotes}>
                <IoInformationCircleOutline />
                <span>{commande.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section de validation des quantités */}
        <div className={styles.validationSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <IoCheckmarkCircleOutline />
              Validation des Produits
            </h2>
            <p className={styles.sectionSubtitle}>
              Saisissez les quantités reçues pour chaque produit
            </p>
          </div>
          
          <div className={styles.productsTableContainer}>
            <div className={styles.productsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.headerCell}>Produit</div>
                <div className={styles.headerCell}>Quantité commandée</div>
                <div className={styles.headerCell}>Quantité reçue</div>
                <div className={styles.headerCell}>À recevoir</div>
              </div>
              
              {commande.produits.map((produit) => (
                <div key={produit.id} className={styles.productRow}>
                  <div className={styles.productCell}>
                    <span className={styles.productName}>{produit.nom}</span>
                    <span className={styles.productPrice}>
                      {new Intl.NumberFormat('fr-MG').format(produit.prix)} Ar
                    </span>
                  </div>
                  
                  <div className={styles.productCell}>
                    <span className={styles.productQty}>{produit.qty}</span>
                  </div>
                  
                  <div className={styles.productCell}>
                    <div className={styles.quantityInputGroup}>
                      <div className={styles.quantityControls}>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(produit.id, (quantities[produit.id] || 0) - 1)}
                          disabled={(quantities[produit.id] || 0) <= 0}
                          className={styles.quantityBtn}
                        >
                          -
                        </button>
                      </div>
                      <input
                        type="number"
                        min="0"
                        max={produit.qty}
                        value={quantities[produit.id] || 0}
                        onChange={(e) => handleQuantityChange(produit.id, e.target.value)}
                        className={styles.quantityInput}
                      />
                      <div className={styles.quantityControls}>
                        <button
                          type="button"
                          onClick={() => handleQuantityChange(produit.id, (quantities[produit.id] || 0) + 1)}
                          disabled={(quantities[produit.id] || 0) >= produit.qty}
                          className={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.productCell}>
                    <span className={styles.remainingQty}>
                      {produit.qty - (quantities[produit.id] || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notes de validation */}
          <div className={styles.validationNotesSection}>
            <label htmlFor="validationNotes" className={styles.notesLabel}>
              <IoDocumentTextOutline />
              Notes de validation (optionnel)
            </label>
            <InputTextarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des notes sur cette validation (problèmes, observations, etc.)..."
              rows={3}
              fullWidth
              className={styles.notesTextarea}
            />
          </div>
        </div>

        {/* Récapitulatif */}
        <div className={styles.summarySection}>
          <div className={styles.summaryCard}>
            <h3 className={styles.summaryTitle}>Récapitulatif</h3>
            
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <TbPackage />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total commandé</span>
                  <span className={styles.summaryValue}>{totalQty} articles</span>
                </div>
              </div>
              
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <IoCheckmarkCircleOutline />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Total reçu</span>
                  <span className={styles.summaryValue}>{totalRecue} articles</span>
                </div>
              </div>
              
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <IoAlertCircleOutline />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>En attente</span>
                  <span className={styles.summaryValue}>{totalPending} articles</span>
                </div>
              </div>
              
              <div className={styles.summaryItem}>
                <div className={styles.summaryIcon}>
                  <FaSync />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>Pourcentage reçu</span>
                  <span className={styles.summaryValue}>
                    {totalQty > 0 ? ((totalRecue / totalQty) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Barre de progression */}
            <div className={styles.progressSection}>
              <div className={styles.progressInfo}>
                <span>Progression de la validation</span>
                <span>{totalQty > 0 ? ((totalRecue / totalQty) * 100).toFixed(1) : 0}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${totalQty > 0 ? (totalRecue / totalQty) * 100 : 0}%`,
                    backgroundColor: getValidationColor()
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions finales */}
        <div className={styles.finalActions}>
          <Button 
            variant="outline"
            size="large"
            icon="close"
            onClick={() => navigate('/commandesAdmin')}
            className={styles.actionButton}
          >
            Annuler
          </Button>
          
          <Button 
            variant="primary"
            size="large"
            icon="check"
            onClick={handleSubmit}
            className={styles.actionButton}
            disabled={Object.values(quantities).every(qty => qty === 0)}
          >
            {typeValidation === COMMANDE_TYPES.VALIDEE ? 
              'Valider complètement' : 
              'Valider les quantités'}
          </Button>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>

      {/* Toasts */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          position="top-right"
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
        />
      ))}
    </div>
  );
};

export default ValidationComande;