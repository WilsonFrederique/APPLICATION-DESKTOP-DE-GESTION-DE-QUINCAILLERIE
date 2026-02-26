import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Paniers.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputSelect from '../../../components/Input/InputSelect';
import InvoiceModal from '../NouvelleVentes/InvoiceModal';
import Toast from '../../../components/Toast/Toast'; // Importer le composant Toast
import { 
  IoCartOutline,
  IoTrashOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoCloseOutline,
  IoSearchOutline,
  IoPrintOutline,
  IoReceiptOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoWalletOutline,
  IoLocationOutline,
  IoCallOutline,
  IoArrowBackOutline,
  IoRefreshOutline,
  IoDocumentTextOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaPercentage,
  FaWarehouse,
  FaBarcode,
  FaUser
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCategory, 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbDiscount
} from "react-icons/tb";
import { MdPayment, MdPointOfSale } from "react-icons/md";

const Paniers = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('en_cours');
  const [showInvoice, setShowInvoice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // États pour les toasts
  const [toasts, setToasts] = useState([]);

  // Options pour le filtre de statut
  const statusOptions = [
    { value: 'en_cours', label: 'En cours' },
    { value: 'termine', label: 'Terminés' },
    { value: 'annule', label: 'Annulés' },
    { value: 'all', label: 'Tous les paniers' }
  ];

  // Fonction pour ajouter un toast
  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-suppression après la durée
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  // Fonction pour supprimer un toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Fonction de chargement des paniers (encapsulée dans useCallback)
  const loadCarts = useCallback(() => {
    setIsLoading(true);
    try {
      const savedCarts = JSON.parse(localStorage.getItem('vendeurCarts') || '[]');
      setCarts(savedCarts);
    } catch (error) {
      console.error('Erreur lors du chargement des paniers:', error);
      addToast('Erreur lors du chargement des paniers', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  // Charger les paniers depuis localStorage au montage du composant
  useEffect(() => {
    loadCarts();
  }, [loadCarts]);

  // Effet pour sélectionner un panier basé sur l'ID dans l'URL
  useEffect(() => {
    if (!id || carts.length === 0 || isLoading) {
      return;
    }

    const cartId = parseInt(id);
    const cart = carts.find(c => c.id === cartId);
    
    if (cart && (!selectedCart || selectedCart.id !== cartId)) {
      setSelectedCart(cart);
    }
  }, [id, carts, selectedCart, isLoading]);

  // Fonction utilitaire pour déclencher la mise à jour du compteur dans la Navbar
  const triggerCartUpdate = useCallback(() => {
    try {
      // Déclencher l'événement personnalisé pour la Navbar
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Également déclencher un événement storage pour les autres onglets
      localStorage.setItem('vendeurCarts_temp', Date.now().toString());
      setTimeout(() => {
        localStorage.removeItem('vendeurCarts_temp');
      }, 100);
    } catch (error) {
      console.error('Erreur lors du déclenchement de la mise à jour:', error);
    }
  }, []);

  // Fonction utilitaire pour sauvegarder les paniers
  const saveCarts = useCallback((updatedCarts) => {
    try {
      localStorage.setItem('vendeurCarts', JSON.stringify(updatedCarts));
      setCarts(updatedCarts);
      
      // Déclencher la mise à jour du compteur dans la Navbar
      triggerCartUpdate();
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paniers:', error);
      addToast('Erreur lors de la sauvegarde', 'error');
    }
  }, [triggerCartUpdate, addToast]);

  // Filtrer les paniers
  const filteredCarts = carts.filter(cart => {
    const matchesSearch = searchTerm === '' || 
      (cart.items && cart.items.some(item => 
        item.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      )) || 
      (cart.client?.nom?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || cart.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    totalCarts: carts.length,
    activeCarts: carts.filter(c => c.status === 'en_cours').length,
    completedCarts: carts.filter(c => c.status === 'termine').length,
    cancelledCarts: carts.filter(c => c.status === 'annule').length,
    totalRevenue: carts
      .filter(c => c.status === 'termine')
      .reduce((sum, cart) => sum + (cart.total || 0), 0)
  };

  // Récupérer tous les produits des paniers en cours
  const getAllProducts = useCallback(() => {
    const allProducts = [];
    carts.forEach(cart => {
      if (cart.status === 'en_cours' && cart.items) {
        cart.items.forEach(item => {
          allProducts.push({
            ...item,
            price: item.prixVente || 0,
            quantity: item.quantite || 1,
            cartId: cart.id
          });
        });
      }
    });
    return allProducts;
  }, [carts]);

  // Formater la devise
  const formatCurrency = useCallback((amount) => {
    if (amount === undefined || amount === null) return '0 Ar';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('MGA', 'Ar');
  }, []);

  // Formater la date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  // Mettre à jour la quantité d'un article
  const updateItemQuantity = useCallback((cartId, itemId, newQuantity) => {
    const updatedCarts = carts.map(cart => {
      if (cart.id === cartId) {
        const updatedItems = cart.items.map(item => {
          if (item.id === itemId) {
            if (newQuantity > item.stock) {
              addToast(`Stock insuffisant! Maximum ${item.stock} disponibles.`, 'warning');
              return item;
            }
            return { ...item, quantite: Math.max(1, newQuantity) };
          }
          return item;
        });
        
        const newTotal = updatedItems.reduce((sum, item) => 
          sum + ((item.prixVente || 0) * (item.quantite || 1)), 0
        );
        
        return { ...cart, items: updatedItems, total: newTotal };
      }
      return cart;
    });
    
    saveCarts(updatedCarts);
    
    if (selectedCart?.id === cartId) {
      setSelectedCart(updatedCarts.find(c => c.id === cartId));
    }
  }, [carts, selectedCart, saveCarts, addToast]);

  // Supprimer un article du panier
  const removeItem = useCallback((cartId, itemId) => {
    const updatedCarts = carts.map(cart => {
      if (cart.id === cartId) {
        const updatedItems = cart.items.filter(item => item.id !== itemId);
        const newTotal = updatedItems.reduce((sum, item) => 
          sum + ((item.prixVente || 0) * (item.quantite || 1)), 0
        );
        
        return { ...cart, items: updatedItems, total: newTotal };
      }
      return cart;
    });
    
    saveCarts(updatedCarts);
    
    if (selectedCart?.id === cartId) {
      const updatedCart = updatedCarts.find(c => c.id === cartId);
      if (updatedCart.items.length === 0) {
        setSelectedCart(null);
        navigate('/paniersVendeurs');
      } else {
        setSelectedCart(updatedCart);
      }
    }
    
    addToast('Article retiré du panier', 'success');
  }, [carts, selectedCart, saveCarts, navigate, addToast]);

  // Supprimer un panier
  const deleteCart = useCallback((cartId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce panier ?')) {
      const updatedCarts = carts.filter(cart => cart.id !== cartId);
      saveCarts(updatedCarts);
      
      if (selectedCart?.id === cartId) {
        setSelectedCart(null);
        navigate('/paniersVendeurs');
      }
      
      addToast('Panier supprimé avec succès', 'success');
    }
  }, [carts, selectedCart, saveCarts, navigate, addToast]);

  // Créer un nouveau panier
  const createNewCart = useCallback(() => {
    const newCart = {
      id: Date.now(),
      date: new Date().toISOString(),
      client: null,
      items: [],
      total: 0,
      status: 'en_cours'
    };
    
    const updatedCarts = [...carts, newCart];
    saveCarts(updatedCarts);
    setSelectedCart(newCart);
    navigate(`/paniersVendeurs/${newCart.id}`);
    
    addToast('Nouveau panier créé', 'success');
  }, [carts, saveCarts, navigate, addToast]);

  // Retour à la liste
  const goBackToList = useCallback(() => {
    setSelectedCart(null);
    navigate('/paniersVendeurs');
  }, [navigate]);

  // Gestion de la vente complétée
  const handleCompleteSale = useCallback((invoiceData) => {
    console.log('Vente groupée complétée:', invoiceData);
    
    // Supprimer tous les paniers en cours
    const updatedCarts = carts.filter(cart => cart.status !== 'en_cours');
    
    // Mettre à jour l'état et le localStorage
    saveCarts(updatedCarts);
    
    // Réinitialiser le panier sélectionné
    setSelectedCart(null);
    
    // Afficher notification avec Toast
    const totalItems = invoiceData.items?.length || 0;
    const totalAmount = formatCurrency(invoiceData.grandTotal || 0);
    const successMessage = `Vente groupée enregistrée avec succès ! (Facture: ${invoiceData.numero || 'N/A'} - ${totalItems} articles - ${totalAmount})`;
    
    addToast(successMessage, 'success', 5000);
    
    // Fermer le modal
    setShowInvoice(false);
    
    // Rediriger vers NouvelleVentes dans la partie Historique
    navigate('/nouvelleVentesVendeur?view=history');
  }, [carts, saveCarts, formatCurrency, navigate, addToast]);

  // Calculer le total de tous les produits
  const totalAllProducts = useCallback(() => {
    return carts
      .filter(cart => cart.status === 'en_cours')
      .reduce((sum, cart) => sum + (cart.total || 0), 0);
  }, [carts]);

  // Compter tous les articles
  const countAllItems = useCallback(() => {
    return carts
      .filter(cart => cart.status === 'en_cours')
      .reduce((count, cart) => {
        return count + (cart.items ? cart.items.reduce((itemCount, item) => itemCount + (item.quantite || 1), 0) : 0);
      }, 0);
  }, [carts]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Chargement des paniers...</p>
      </div>
    );
  }

  return (
    <div className={styles.paniersContainer}>
      {/* Container pour les toasts */}
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position="top-right"
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* En-tête */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.pageIcon}>
            <IoCartOutline />
          </div>
          <div className={styles.pageTitle}>
            <h1>Paniers Vendeurs</h1>
            <p className={styles.pageSubtitle}>
              <span>{stats.activeCarts} panier(s) actif(s)</span>
              <span className={styles.subtitleDot}>•</span>
              <span>{stats.completedCarts} terminé(s)</span>
              <span className={styles.subtitleDot}>•</span>
              <span>{stats.cancelledCarts} annulé(s)</span>
              <span className={styles.subtitleDot}>•</span>
              <span>{formatCurrency(stats.totalRevenue)} CA</span>
            </p>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          {/* Résumé global des paniers actifs */}
          {stats.activeCarts > 0 && (
            <div className={styles.globalSummary}>
              <span className={styles.globalItems}>{countAllItems()} article(s)</span>
              <span className={styles.globalTotal}>{formatCurrency(totalAllProducts())}</span>
            </div>
          )}

          <Button 
            variant="outline"
            size="medium"
            icon="cart"
            onClick={() => setShowInvoice(true)}
            disabled={stats.activeCarts === 0}
          >
            Paiement groupé
          </Button>

          <Button 
            variant="primary"
            size="medium"
            icon="add"
            onClick={createNewCart}
          >
            Nouveau panier
          </Button>
        </div>
      </div>

      {/* Contenu principal - reste identique */}
      <div className={styles.mainContent}>
        {/* Liste des paniers */}
        <div className={`${styles.cartsList} ${selectedCart ? styles.withDetail : ''}`}>
          <div className={styles.cartsListHeader}>
            <div className={styles.searchSection}>
              <Input
                type="text"
                placeholder="Rechercher un produit, client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="cartSearch"
                icon={<IoSearchOutline />}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button 
                  className={styles.clearSearch}
                  onClick={() => setSearchTerm('')}
                >
                  <IoCloseOutline />
                </button>
              )}
            </div>
            
            <div className={styles.filterSection}>
              <InputSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                placeholder="Filtrer par statut"
                size="small"
                variant="outline"
                className={styles.filterSelect}
              />
            </div>
          </div>

          <div className={styles.cartsGrid}>
            {filteredCarts.length > 0 ? (
              filteredCarts.map(cart => (
                <div 
                  key={cart.id}
                  className={`${styles.cartCard} ${styles[cart.status]} ${selectedCart?.id === cart.id ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedCart(cart);
                    navigate(`/paniersVendeurs/${cart.id}`);
                  }}
                >
                  <div className={styles.cartCardHeader}>
                    <div className={styles.cartCardStatus}>
                      <span className={`${styles.statusBadge} ${styles[cart.status]}`}>
                        {cart.status === 'en_cours' && <IoTimeOutline />}
                        {cart.status === 'termine' && <IoCheckmarkCircleOutline />}
                        {cart.status === 'annule' && <IoCloseOutline />}
                        <span>
                          {cart.status === 'en_cours' && 'En cours'}
                          {cart.status === 'termine' && 'Terminé'}
                          {cart.status === 'annule' && 'Annulé'}
                        </span>
                      </span>
                    </div>
                    <div className={styles.cartCardDate}>
                      <IoCalendarOutline />
                      <span>{formatDate(cart.date)}</span>
                    </div>
                  </div>

                  <div className={styles.cartCardBody}>
                    <div className={styles.cartCardClient}>
                      {cart.client ? (
                        <>
                          <FaUser className={styles.clientIcon} />
                          <div className={styles.clientInfo}>
                            <span className={styles.clientName}>{cart.client.nom}</span>
                            <span className={styles.clientContact}>{cart.client.telephone || 'Tél non spécifié'}</span>
                          </div>
                        </>
                      ) : (
                        <span className={styles.noClient}>Aucun client assigné</span>
                      )}
                    </div>

                    <div className={styles.cartCardStats}>
                      <div className={styles.cartCardItems}>
                        <FaBox />
                        <span>{cart.items ? cart.items.reduce((total, item) => total + (item.quantite || 1), 0) : 0} article(s)</span>
                      </div>
                      <div className={styles.cartCardTotal}>
                        <TbCurrencyDollar />
                        <span>{formatCurrency(cart.total || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {cart.items && cart.items.length > 0 && (
                    <div className={styles.cartCardPreview}>
                      {cart.items.slice(0, 3).map((item, index) => (
                        <div key={index} className={styles.previewItem}>
                          <span className={styles.previewItemName}>{item.nom}</span>
                          <span className={styles.previewItemQty}>x{item.quantite || 1}</span>
                        </div>
                      ))}
                      {cart.items.length > 3 && (
                        <span className={styles.previewMore}>
                          +{cart.items.length - 3} autre(s)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noCarts}>
                <IoCartOutline className={styles.noCartsIcon} />
                <h3>Aucun panier trouvé</h3>
                <p>
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Aucun panier ne correspond à vos critères de recherche.' 
                    : 'Créez un nouveau panier pour commencer'}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <Button 
                    variant="outline"
                    size="medium"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    variant="primary"
                    size="medium"
                    icon="add"
                    onClick={createNewCart}
                  >
                    Nouveau panier
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Détail du panier sélectionné - reste identique */}
        {selectedCart && selectedCart.status === 'en_cours' && (
          <div className={styles.cartDetail}>
            <div className={styles.cartDetailHeader}>
              <Button 
                variant="outline" 
                icon="suivant" 
                onClick={goBackToList}
                title="Retour à la liste"
                className={styles.backToListBtn}
              >
              </Button>
              <h2>Détail du panier</h2>
              <div className={styles.cartDetailActions}>
                <Button 
                  variant="danger"
                  size="small"
                  icon="trash"
                  onClick={() => deleteCart(selectedCart.id)}
                  className={styles.actionBtn}
                >
                  Supprimer
                </Button>
              </div>
            </div>

            <div className={styles.cartDetailContent}>
              {/* Section client si existant */}
              {selectedCart.client && (
                <div className={styles.clientSection}>
                  <h3>Client</h3>
                  <div className={styles.clientDetails}>
                    <div className={styles.clientDetailItem}>
                      <IoPersonOutline />
                      <span>{selectedCart.client.nom}</span>
                    </div>
                    <div className={styles.clientDetailItem}>
                      <IoCallOutline />
                      <span>{selectedCart.client.telephone || 'Non spécifié'}</span>
                    </div>
                    <div className={styles.clientDetailItem}>
                      <IoLocationOutline />
                      <span>{selectedCart.client.adresse || 'Non spécifiée'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des articles */}
              <div className={styles.itemsSection}>
                <h3>Articles ({selectedCart.items ? selectedCart.items.reduce((total, item) => total + (item.quantite || 1), 0) : 0})</h3>
                
                {selectedCart.items && selectedCart.items.length > 0 ? (
                  <div className={styles.itemsList}>
                    {selectedCart.items.map((item) => (
                      <div key={item.id} className={styles.cartItem}>
                        <div className={styles.cartItemImage}>
                          <img src={item.image || 'https://via.placeholder.com/60'} alt={item.nom} />
                          <div className={styles.cartItemQuantity}>
                            {item.quantite || 1}
                          </div>
                        </div>
                        
                        <div className={styles.cartItemContent}>
                          <div className={styles.cartItemHeader}>
                            <div className={styles.cartItemInfo}>
                              <h4 className={styles.cartItemTitle}>{item.nom}</h4>
                              <div className={styles.cartItemMeta}>
                                <span className={styles.cartItemRef}>
                                  <FaBarcode /> {item.reference || 'N/A'}
                                </span>
                                <span className={styles.cartItemUnit}>
                                  {item.unit || item.unite || 'pc'}
                                </span>
                              </div>
                            </div>
                            
                            <button 
                              className={styles.removeItemBtn}
                              onClick={() => removeItem(selectedCart.id, item.id)}
                              title="Supprimer"
                            >
                              <IoTrashOutline />
                            </button>
                          </div>
                          
                          <div className={styles.cartItemDetails}>
                            <div className={styles.quantityControls}>
                              <div className={styles.quantityButtons}>
                                <button 
                                  className={styles.quantityBtn}
                                  onClick={() => updateItemQuantity(selectedCart.id, item.id, (item.quantite || 1) - 1)}
                                  disabled={(item.quantite || 1) <= 1}
                                >
                                  <IoRemoveOutline />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={item.stock || 999}
                                  value={item.quantite || 1}
                                  onChange={(e) => updateItemQuantity(
                                    selectedCart.id, 
                                    item.id, 
                                    parseInt(e.target.value) || 1
                                  )}
                                  className={styles.quantityInput}
                                />
                                <button 
                                  className={styles.quantityBtn}
                                  onClick={() => updateItemQuantity(selectedCart.id, item.id, (item.quantite || 1) + 1)}
                                  disabled={(item.quantite || 1) >= (item.stock || 999)}
                                >
                                  <IoAddOutline />
                                </button>
                              </div>
                              <span className={styles.stockInfo}>
                                Stock: {item.stock || 0} {item.unit || item.unite || 'pc'}
                              </span>
                            </div>
                            
                            <div className={styles.priceInfo}>
                              <div className={styles.unitPrice}>
                                {formatCurrency(item.prixVente || 0)}/{item.unit || item.unite || 'pc'}
                              </div>
                              <div className={styles.totalPrice}>
                                {formatCurrency((item.prixVente || 0) * (item.quantite || 1))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyItems}>
                    <FaBox className={styles.emptyItemsIcon} />
                    <p>Panier vide</p>
                  </div>
                )}
              </div>

              {/* Résumé et total */}
              <div className={styles.cartSummary}>
                <div className={styles.summaryRow}>
                  <span>Sous-total:</span>
                  <span>{formatCurrency(selectedCart.total || 0)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>TVA (20%):</span>
                  <span>{formatCurrency((selectedCart.total || 0) * 0.2)}</span>
                </div>
                <div className={styles.summaryRowTotal}>
                  <span>Total TTC:</span>
                  <span>{formatCurrency((selectedCart.total || 0) * 1.2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message si panier sélectionné mais terminé/annulé */}
        {selectedCart && selectedCart.status !== 'en_cours' && (
          <div className={styles.cartDetail}>
            <div className={styles.cartDetailHeader}>
              <Button 
                variant="outline" 
                icon="arrowBack" 
                onClick={goBackToList}
                title="Retour à la liste"
                className={styles.backToListBtn}
              >
              </Button>
              <h2>Détail du panier</h2>
            </div>
            <div className={styles.cartDetailContent}>
              <div className={styles.cartStatusMessage}>
                <div className={`${styles.statusIcon} ${styles[selectedCart.status]}`}>
                  {selectedCart.status === 'termine' && <IoCheckmarkCircleOutline />}
                  {selectedCart.status === 'annule' && <IoCloseOutline />}
                </div>
                <h3>
                  {selectedCart.status === 'termine' ? 'Panier terminé' : 'Panier annulé'}
                </h3>
                <p>Ce panier n'est plus modifiable.</p>
                <p className={styles.cartDate}>Date: {formatDate(selectedCart.date)}</p>
                
                {/* Résumé du panier */}
                <div className={styles.cartSummary}>
                  <div className={styles.summaryRow}>
                    <span>Total:</span>
                    <span>{formatCurrency(selectedCart.total || 0)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Articles:</span>
                    <span>{selectedCart.items ? selectedCart.items.reduce((total, item) => total + (item.quantite || 1), 0) : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de validation plein écran */}
      {showInvoice && (
        <InvoiceModal
          cart={getAllProducts()}
          onClose={() => setShowInvoice(false)}
          onCompleteSale={handleCompleteSale}
        />
      )}
    </div>
  );
};

export default Paniers;