import React, { useState } from 'react';
import styles from './DetailProduits.module.css';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputCheckbox from '../../../components/Input/InputCheckbox';
import InputSelect from '../../../components/Input/InputSelect';
import Button from '../../../components/Button/Button';
import { 
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCartOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoShareSocialOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoRefreshOutline,
  IoCashOutline,
  IoReceiptOutline,
  IoPersonOutline,
  IoBarcodeOutline,
  IoCalculatorOutline,
  IoQrCodeOutline,
  IoSaveOutline,
  IoNotificationsOutline,
  IoWalletOutline,
  IoAddOutline,
  IoRemoveOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaWarehouse,
  FaBarcode,
  FaChartLine,
  FaExternalLinkAlt,
  FaHistory,
  FaMoneyBillWave,
  FaCreditCard,
  FaPercentage,
  FaClipboardList,
  FaUserTie,
  FaTags,
  FaWeightHanging,
  FaStore,
  FaShoppingCart
} from "react-icons/fa";
import { 
  TbCurrencyDollar,
  TbPercentage,
  TbBuildingWarehouse,
  TbCategory,
  TbTruckDelivery,
  TbArrowsSort,
  TbListDetails
} from "react-icons/tb";
import { 
  MdAttachMoney,
  MdOutlineLocationOn,
  MdOutlineStorage,
  MdInventory,
  MdLocalShipping,
  MdPayment,
  MdCategory,
  MdPointOfSale,
  MdOutlineSell,
  MdOutlineTrendingUp,
  MdOutlineStorefront
} from "react-icons/md";
import { CiSettings, CiMoneyBill, CiCreditCard1, CiShoppingTag } from "react-icons/ci";
import { GiWeight, GiCash, GiShoppingCart } from "react-icons/gi";

// Définir les images par défaut
const productImages = [
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1567721913486-6585f069b332?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
];

const DetailProduitsModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onDelete, 
  onSale 
}) => {
  // États pour les onglets
  const [activeTab, setActiveTab] = useState('general');
  
  // États pour les champs éditables (pour démonstration)
  const [editMode, setEditMode] = useState(false);
  const [setEditedProduct] = useState(product);

  // Empêcher le scroll du body quand le modal est ouvert
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fonction pour formater la monnaie
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour calculer la marge
  const calculateMarge = () => {
    if (product && product.prixAchat > 0 && product.prixVente > 0) {
      return ((product.prixVente - product.prixAchat) / product.prixAchat * 100).toFixed(2);
    }
    return 0;
  };

  // Fonction pour calculer la valeur du stock
  const calculateStockValue = () => {
    if (product) {
      return product.stock * product.prixVente;
    }
    return 0;
  };

  // Fonction pour déterminer le statut du stock
  const getStockStatus = () => {
    if (!product) return 'good';
    
    if (product.stock <= product.seuilMin) return 'critical';
    if (product.stock <= product.seuilAlerte) return 'warning';
    return 'good';
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour formater la date et heure
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelEdit = () => {
    setEditedProduct(product);
    setEditMode(false);
  };

  // Gestion des actions
  const handleDelete = () => {
    if (product && window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      if (onDelete) {
        onDelete(product);
      }
      onClose();
    }
  };

  const handleSale = () => {
    if (product && onSale) {
      onSale(product);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (product) {
      const content = `
        Fiche Produit: ${product.nom}
        Référence: ${product.reference}
        Catégorie: ${product.categorie}
        Stock: ${product.stock} ${product.unite}
        Prix d'achat: ${formatCurrency(product.prixAchat)}
        Prix de vente: ${formatCurrency(product.prixVente)}
        Fournisseur: ${product.fournisseur}
        Emplacement: ${product.emplacement}
        Date création: ${formatDate(product.dateCreation)}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fiche-produit-${product.reference}.txt`;
      a.click();
    }
  };

  if (!isOpen || !product) return null;

  const stockStatus = getStockStatus();
  const marge = calculateMarge();
  const stockValue = calculateStockValue();
  const prixTTC = product.tvaApplicable 
    ? product.prixVente * (1 + product.tauxTVA / 100)
    : product.prixVente;

  return (
    <div className={styles.modalOverlayFull}>
      <div className={styles.modalContainerFull}>
        {/* Header du modal - Style InvoiceModal */}
        <div className={styles.modalHeaderFull}>
          <div className={styles.modalHeaderContentFull}>
            <div className={styles.headerTitleFull}>
              <FaBox className={styles.headerIconFull} />
              <div>
                <h1 className={styles.modalTitleFull}>
                  {product.nom}
                </h1>
                <p className={styles.modalSubtitleFull}>
                  Détails et informations du produit
                </p>
              </div>
            </div>
            
            <div className={styles.headerActionsFull}>
              {/* Badges d'état */}
              <div className={`${styles.productStatusBadge} ${styles[stockStatus]}`}>
                {stockStatus === 'critical' ? 'CRITIQUE' : 
                 stockStatus === 'warning' ? 'FAIBLE' : 'DISPONIBLE'}
              </div>
              <div className={styles.productRefBadge}>
                <FaBarcode />
                <span>{product.reference}</span>
              </div>
              <Button 
                variant="ghost"
                size="medium"
                icon="close"
                onClick={onClose}
                className={styles.closeBtnFull}
                aria-label="Fermer"
              />
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className={styles.tabNavigationFull}>
          <button 
            className={`${styles.tabButtonFull} ${activeTab === 'general' ? styles.active : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <FaBox />
            <span>Informations Générales</span>
          </button>
          <button 
            className={`${styles.tabButtonFull} ${activeTab === 'stock' ? styles.active : ''}`}
            onClick={() => setActiveTab('stock')}
          >
            <MdInventory />
            <span>Stock & Prix</span>
          </button>
          <button 
            className={`${styles.tabButtonFull} ${activeTab === 'advanced' ? styles.active : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            <CiSettings />
            <span>Options Avancées</span>
          </button>
          <button 
            className={`${styles.tabButtonFull} ${activeTab === 'history' ? styles.active : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory />
            <span>Historique</span>
          </button>
        </div>

        {/* Corps du modal avec scroll */}
        <div className={styles.modalBodyFull}>
          <div className={styles.mainContentFull}>
            {/* Section image et informations principales */}
            <div className={styles.productOverviewFull}>
              <div className={styles.productImageSectionFull}>
                <div className={styles.productImageWrapperFull}>
                  <img 
                    src={product.image || productImages[product.id % productImages.length]} 
                    alt={product.nom}
                    className={styles.productImageFull}
                  />
                  <div className={`${styles.stockIndicatorFull} ${styles[stockStatus]}`}>
                    <div className={styles.stockIndicatorTextFull}>
                      <span className={styles.stockNumberFull}>{product.stock}</span>
                      <span className={styles.stockUnitFull}>{product.unite}</span>
                    </div>
                    <div className={styles.stockStatusTextFull}>
                      {stockStatus === 'critical' ? 'CRITIQUE' : 
                       stockStatus === 'warning' ? 'FAIBLE' : 'DISPONIBLE'}
                    </div>
                  </div>
                </div>
                
                <div className={styles.quickStatsGridFull}>
                  <div className={styles.quickStatFull}>
                    <div className={styles.quickStatIconFull}>
                      <MdOutlineStorage />
                    </div>
                    <div className={styles.quickStatContentFull}>
                      <div className={styles.quickStatValueFull}>{product.stock} {product.unite}</div>
                      <div className={styles.quickStatLabelFull}>Stock actuel</div>
                    </div>
                  </div>
                  <div className={styles.quickStatFull}>
                    <div className={styles.quickStatIconFull}>
                      <TbCurrencyDollar />
                    </div>
                    <div className={styles.quickStatContentFull}>
                      <div className={styles.quickStatValueFull}>{formatCurrency(product.prixVente)}</div>
                      <div className={styles.quickStatLabelFull}>Prix de vente</div>
                    </div>
                  </div>
                  <div className={styles.quickStatFull}>
                    <div className={styles.quickStatIconFull}>
                      <FaWarehouse />
                    </div>
                    <div className={styles.quickStatContentFull}>
                      <div className={styles.quickStatValueFull}>{product.emplacement}</div>
                      <div className={styles.quickStatLabelFull}>Emplacement</div>
                    </div>
                  </div>
                  <div className={styles.quickStatFull}>
                    <div className={styles.quickStatIconFull}>
                      <FaTruck />
                    </div>
                    <div className={styles.quickStatContentFull}>
                      <div className={styles.quickStatValueFull}>{product.fournisseur}</div>
                      <div className={styles.quickStatLabelFull}>Fournisseur</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenu de l'onglet actif */}
              <div className={styles.tabContentFull}>
                {activeTab === 'general' && (
                  <div className={styles.tabPanelFull}>
                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <FaBox /> Informations de Base
                      </h3>
                      <div className={styles.formGridFull}>
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Nom du produit</label>
                          <div className={styles.infoValueFull}>{product.nom}</div>
                        </div>
                        
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Référence</label>
                          <div className={styles.infoValueFull}>
                            <FaBarcode /> {product.reference}
                          </div>
                        </div>
                        
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Catégorie</label>
                          <div className={styles.infoValueFull}>
                            <TbCategory /> {product.categorie}
                          </div>
                        </div>
                        
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Unité</label>
                          <div className={styles.infoValueFull}>
                            <GiWeight /> {product.unite}
                          </div>
                        </div>
                        
                        <div className={styles.formGroupFullFull}>
                          <label className={styles.formLabelFull}>Description</label>
                          <div className={styles.descriptionFull}>
                            {product.description || 'Aucune description disponible.'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'stock' && (
                  <div className={styles.tabPanelFull}>
                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <MdOutlineStorage /> Stock & Prix
                      </h3>
                      <div className={styles.formGridFull}>
                        <div className={styles.formRowFull}>
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Stock actuel</label>
                            <div className={`${styles.infoValueFull} ${styles[stockStatus]}`}>
                              {product.stock} {product.unite}
                            </div>
                          </div>
                          
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Seuil minimum</label>
                            <div className={styles.infoValueFull}>
                              {product.seuilMin} {product.unite}
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.formRowFull}>
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Seuil d'alerte</label>
                            <div className={styles.infoValueFull}>
                              {product.seuilAlerte} {product.unite}
                            </div>
                          </div>
                          
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Emplacement</label>
                            <div className={styles.infoValueFull}>
                              <MdOutlineLocationOn /> {product.emplacement}
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.formRowFull}>
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Prix d'achat (HT)</label>
                            <div className={styles.infoValueFull}>
                              {formatCurrency(product.prixAchat)}
                            </div>
                          </div>
                          
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Prix de vente (HT)</label>
                            <div className={styles.infoValueFull}>
                              {formatCurrency(product.prixVente)}
                            </div>
                          </div>
                        </div>
                        
                        {product.peutEtreVenduEnDetail && (
                          <div className={styles.formRowFull}>
                            <div className={styles.formGroupHalfFull}>
                              <label className={styles.formLabelFull}>Prix détail</label>
                              <div className={styles.infoValueFull}>
                                {formatCurrency(product.prixDetail)} / {product.uniteDetail}
                              </div>
                            </div>
                            
                            <div className={styles.formGroupHalfFull}>
                              <label className={styles.formLabelFull}>Conversion</label>
                              <div className={styles.infoValueFull}>
                                1 {product.unite} = {product.prixDetail > 0 ? (product.prixVente / product.prixDetail).toFixed(2) : '0'} {product.uniteDetail}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <TbCurrencyDollar /> Détails TVA
                      </h3>
                      <div className={styles.statsGridFull}>
                        <div className={styles.statCardFull}>
                          <div className={styles.statLabelFull}>Montant TVA unitaire</div>
                          <div className={styles.statValueFull}>
                            {formatCurrency(product.prixVente * (product.tauxTVA / 100))}
                          </div>
                        </div>
                        <div className={styles.statCardFull}>
                          <div className={styles.statLabelFull}>Prix TTC unitaire</div>
                          <div className={styles.statValueFull}>
                            {formatCurrency(prixTTC)}
                          </div>
                        </div>
                        <div className={styles.statCardFull}>
                          <div className={styles.statLabelFull}>Marge unitaire</div>
                          <div className={`${styles.statValueFull} ${parseFloat(marge) > 0 ? styles.positive : styles.negative}`}>
                            {marge}%
                          </div>
                        </div>
                        <div className={styles.statCardFull}>
                          <div className={styles.statLabelFull}>Valeur totale du stock</div>
                          <div className={styles.statValueFull}>
                            {formatCurrency(stockValue)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className={styles.tabPanelFull}>
                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <CiSettings /> Options Avancées
                      </h3>
                      <div className={styles.formGridFull}>
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Fournisseur</label>
                          <div className={styles.infoValueFull}>
                            <FaTruck /> {product.fournisseur}
                          </div>
                        </div>
                        
                        <div className={styles.formGroupFull}>
                          <label className={styles.formLabelFull}>Délai de livraison</label>
                          <div className={styles.infoValueFull}>
                            <TbTruckDelivery /> {product.delaiLivraison || 'Non spécifié'}
                          </div>
                        </div>
                        
                        <div className={styles.formRowFull}>
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>TVA applicable</label>
                            <div className={styles.infoValueFull}>
                              {product.tvaApplicable ? 'Oui' : 'Non'}
                            </div>
                          </div>
                          
                          {product.tvaApplicable && (
                            <div className={styles.formGroupHalfFull}>
                              <label className={styles.formLabelFull}>Taux de TVA</label>
                              <div className={styles.infoValueFull}>
                                {product.tauxTVA}%
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.formRowFull}>
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Produit péréquitable</label>
                            <div className={styles.infoValueFull}>
                              {product.estPerequitable ? 'Oui' : 'Non'}
                            </div>
                          </div>
                          
                          <div className={styles.formGroupHalfFull}>
                            <label className={styles.formLabelFull}>Produit fragile</label>
                            <div className={styles.infoValueFull}>
                              {product.estFragile ? 'Oui' : 'Non'}
                            </div>
                          </div>
                        </div>
                        
                        <div className={styles.formGroupFullFull}>
                          <label className={styles.formLabelFull}>Instructions spéciales</label>
                          <div className={styles.descriptionFull}>
                            {product.instructionsSpeciales || 'Aucune instruction spéciale'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <IoInformationCircleOutline /> Métadonnées
                      </h3>
                      <div className={styles.metadataGridFull}>
                        <div className={styles.metadataItemFull}>
                          <div className={styles.metadataLabelFull}>Date de création</div>
                          <div className={styles.metadataValueFull}>{formatDate(product.dateCreation)}</div>
                        </div>
                        <div className={styles.metadataItemFull}>
                          <div className={styles.metadataLabelFull}>Créé par</div>
                          <div className={styles.metadataValueFull}>{product.creerPar}</div>
                        </div>
                        <div className={styles.metadataItemFull}>
                          <div className={styles.metadataLabelFull}>Dernière modification</div>
                          <div className={styles.metadataValueFull}>{formatDateTime(product.derniereModification)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className={styles.tabPanelFull}>
                    <div className={styles.infoSectionFull}>
                      <h3 className={styles.sectionTitleFull}>
                        <FaHistory /> Historique Récent
                      </h3>
                      <div className={styles.historyListFull}>
                        <div className={styles.historyItemFull}>
                          <div className={styles.historyIconFull}>
                            <IoCalendarOutline />
                          </div>
                          <div className={styles.historyContentFull}>
                            <div className={styles.historyTitleFull}>Produit ajouté au catalogue</div>
                            <div className={styles.historyDetailsFull}>
                              <span className={styles.historyDateFull}>{formatDate(product.dateCreation)}</span>
                              <span className={styles.historySeparatorFull}>•</span>
                              <span className={styles.historyUserFull}>Par: {product.creerPar}</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.historyItemFull}>
                          <div className={styles.historyIconFull}>
                            <IoCartOutline />
                          </div>
                          <div className={styles.historyContentFull}>
                            <div className={styles.historyTitleFull}>Dernière vente enregistrée</div>
                            <div className={styles.historyDetailsFull}>
                              <span className={styles.historyDateFull}>15 Mars 2024</span>
                              <span className={styles.historySeparatorFull}>•</span>
                              <span className={styles.historyUserFull}>Quantité: 5 {product.unite}</span>
                              <span className={styles.historySeparatorFull}>•</span>
                              <span className={styles.historyUserFull}>Montant: {formatCurrency(5 * product.prixVente)}</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.historyItemFull}>
                          <div className={styles.historyIconFull}>
                            <IoPencilOutline />
                          </div>
                          <div className={styles.historyContentFull}>
                            <div className={styles.historyTitleFull}>Dernière modification</div>
                            <div className={styles.historyDetailsFull}>
                              <span className={styles.historyDateFull}>{formatDateTime(product.derniereModification)}</span>
                              <span className={styles.historySeparatorFull}>•</span>
                              <span className={styles.historyUserFull}>Par: {product.creerPar}</span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.historyItemFull}>
                          <div className={styles.historyIconFull}>
                            <IoStatsChartOutline />
                          </div>
                          <div className={styles.historyContentFull}>
                            <div className={styles.historyTitleFull}>Statistiques du mois</div>
                            <div className={styles.historyDetailsFull}>
                              <span className={styles.historyStatFull}>
                                Ventes: {product.ventesMois || 0} unités
                              </span>
                              <span className={styles.historySeparatorFull}>•</span>
                              <span className={styles.historyStatFull}>
                                Revenu: {formatCurrency(product.revenuMois || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Barre latérale avec informations rapides */}
            <aside className={styles.sidebarFull}>
              <div className={styles.sidebarCardFull}>
                <h3 className={styles.sidebarTitleFull}>
                  <IoWarningOutline /> Aperçu du Stock
                </h3>
                <div className={styles.stockOverviewFull}>
                  <div className={styles.stockLevelFull}>
                    <div className={styles.stockLevelLabelFull}>Niveau actuel</div>
                    <div className={`${styles.stockLevelValueFull} ${styles[stockStatus]}`}>
                      {product.stock} {product.unite}
                    </div>
                  </div>
                  <div className={styles.stockBarContainerFull}>
                    <div 
                      className={`${styles.stockBarFull} ${styles[stockStatus]}`}
                      style={{ 
                        width: `${Math.min(100, (product.stock / product.seuilAlerte) * 100)}%` 
                      }}
                    ></div>
                    <div className={styles.stockMarkersFull}>
                      <div className={styles.stockMarkerFull} style={{ left: '0%' }}>
                        <span className={styles.markerLabelFull}>0</span>
                      </div>
                      <div 
                        className={styles.stockMarkerFull} 
                        style={{ left: `${(product.seuilMin / product.seuilAlerte) * 100}%` }}
                      >
                        <span className={styles.markerLabelFull}>Min</span>
                      </div>
                      <div className={styles.stockMarkerFull} style={{ left: '100%' }}>
                        <span className={styles.markerLabelFull}>Max</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.stockDetailsFull}>
                    <div className={styles.stockDetailFull}>
                      <span className={styles.detailLabelFull}>Seuil minimum:</span>
                      <span className={styles.detailValueFull}>{product.seuilMin} {product.unite}</span>
                    </div>
                    <div className={styles.stockDetailFull}>
                      <span className={styles.detailLabelFull}>Seuil alerte:</span>
                      <span className={styles.detailValueFull}>{product.seuilAlerte} {product.unite}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarCardFull}>
                <h3 className={styles.sidebarTitleFull}>
                  <FaChartLine /> Performances
                </h3>
                <div className={styles.performanceStatsFull}>
                  <div className={styles.performanceItemFull}>
                    <div className={styles.performanceIconFull}>
                      <IoCartOutline />
                    </div>
                    <div className={styles.performanceContentFull}>
                      <div className={styles.performanceValueFull}>{product.ventesMois || 0}</div>
                      <div className={styles.performanceLabelFull}>Ventes ce mois</div>
                    </div>
                  </div>
                  <div className={styles.performanceItemFull}>
                    <div className={styles.performanceIconFull}>
                      <TbCurrencyDollar />
                    </div>
                    <div className={styles.performanceContentFull}>
                      <div className={styles.performanceValueFull}>
                        {formatCurrency(product.revenuMois || 0)}
                      </div>
                      <div className={styles.performanceLabelFull}>Revenu mensuel</div>
                    </div>
                  </div>
                  <div className={styles.performanceItemFull}>
                    <div className={styles.performanceIconFull}>
                      <TbPercentage />
                    </div>
                    <div className={styles.performanceContentFull}>
                      <div className={`${styles.performanceValueFull} ${parseFloat(marge) > 0 ? styles.positive : styles.negative}`}>
                        {marge}%
                      </div>
                      <div className={styles.performanceLabelFull}>Marge moyenne</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.sidebarCardFull}>
                <h3 className={styles.sidebarTitleFull}>
                  <FaExternalLinkAlt /> Actions Rapides
                </h3>
                <div className={styles.quickActionsFull}>
                  <button 
                    className={styles.quickActionBtnFull}
                    onClick={() => {
                      const quantity = prompt(`Quantité à ajouter pour ${product.nom}:`, '0');
                      if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
                        alert(`${quantity} ${product.unite} ajouté(s) au stock`);
                      }
                    }}
                  >
                    <IoAddOutline />
                    <span>Ajouter au stock</span>
                  </button>
                  <button 
                    className={styles.quickActionBtnFull}
                    onClick={() => {
                      alert(`Commande passée pour ${product.nom}`);
                    }}
                  >
                    <FaTruck />
                    <span>Commander</span>
                  </button>
                  <button 
                    className={styles.quickActionBtnFull}
                    onClick={() => {
                      const price = prompt(`Nouveau prix de vente pour ${product.nom}:`, product.prixVente);
                      if (price && !isNaN(price) && parseFloat(price) > 0) {
                        alert(`Prix mis à jour: ${formatCurrency(parseFloat(price))}`);
                      }
                    }}
                  >
                    <TbCurrencyDollar />
                    <span>Modifier prix</span>
                  </button>
                  <button 
                    className={styles.quickActionBtnFull}
                    onClick={() => {
                      const emplacement = prompt(`Nouvel emplacement pour ${product.nom}:`, product.emplacement);
                      if (emplacement) {
                        alert(`Emplacement mis à jour: ${emplacement}`);
                      }
                    }}
                  >
                    <MdOutlineLocationOn />
                    <span>Changer emplacement</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Footer du modal avec actions */}
        <div className={styles.modalFooterFull}>
          <div className={styles.footerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Stock:</span>
              <span className={`${styles.statValue} ${styles[stockStatus]}`}>
                {product.stock} {product.unite}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Marge:</span>
              <span className={`${styles.statValue} ${parseFloat(marge) > 0 ? styles.positive : styles.negative}`}>
                {marge}%
              </span>
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <Button
              variant="outline"
              size="large"
              icon="close"
              onClick={onClose}
              className={styles.cancelBtnFull}
            >
              Fermer
            </Button>
            <Button
              variant="secondary"
              size="large"
              icon="print"
              onClick={handlePrint}
              className={styles.printBtnFull}
            >
              Imprimer
            </Button>
            <Button
              variant="secondary"
              size="large"
              icon="download"
              onClick={handleExport}
              className={styles.exportBtnFull}
            >
              Exporter
            </Button>
            <Button
              variant="primary"
              size="large"
              icon="cart"
              onClick={handleSale}
              className={styles.saleBtnFull}
            >
              Vendre
            </Button>
            {editMode && (
              <Button
                variant="outline"
                size="large"
                icon="close"
                onClick={handleCancelEdit}
                className={styles.cancelEditBtnFull}
              >
                Annuler
              </Button>
            )}
            <Button
              variant="danger"
              size="large"
              icon="trash"
              onClick={handleDelete}
              className={styles.deleteBtnFull}
            >
              Supprimer
            </Button>
          </div>
        </div>

        {/* Barre de progression */}
        <div className={styles.modalProgressFull}>
          <div className={styles.progressBarFull}>
            <div 
              className={styles.progressFillFull}
              style={{ width: `${(product.stock / product.stockInitial) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduitsModal;