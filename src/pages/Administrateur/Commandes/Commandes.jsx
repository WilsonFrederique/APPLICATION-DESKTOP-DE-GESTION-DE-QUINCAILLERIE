    import React, { useState, useMemo } from 'react';
    import styles from './Commandes.module.css';
    import Breadcrumbs from "@mui/material/Breadcrumbs";
    import HomeIcon from "@mui/icons-material/Home";
    import Input from '../../../components/Input/Input';
    import InputSelect from '../../../components/Input/InputSelect';
    import Table from '../../../components/Table/Table';
    import Button from '../../../components/Button/Button';
    import Modal from '../../../components/Modal/Modal';
    import Toast from '../../../components/Toast/Toast';
    import { 
    IoSearchOutline,
    IoAddOutline,
    IoCheckmarkCircleOutline,
    IoAlertCircleOutline,
    IoCalendarOutline,
    IoTimeOutline,
    IoPrintOutline,
    IoInformationCircleOutline,
    IoCheckmarkOutline,
    IoCloseOutline,
    IoReceiptOutline,
    IoCartOutline,
    IoCashOutline,
    IoStorefrontOutline,
    IoCalendarNumberOutline,
    IoPersonCircleOutline
    } from "react-icons/io5";
    import { 
    FaBox, 
    FaTruck, 
    FaUserTie,
    FaStore,
    FaShoppingCart,
    FaShippingFast,
    FaSync,
    FaFileInvoiceDollar,
    FaFileExport
    } from "react-icons/fa";
    import { 
    TbTruckDelivery,
    TbArrowsSort,
    TbPackage,
    TbReceipt2,
    TbCircleCheck,
    TbCircleX
    } from "react-icons/tb";
    import { 
    MdAttachMoney,
    MdOutlineShoppingCart,
    MdOutlineInventory2
    } from "react-icons/md";
    import { GiReceiveMoney } from "react-icons/gi";
    import { CiDeliveryTruck } from "react-icons/ci";
    import { Chip, emphasize, styled } from '@mui/material';
    import ScrollToTop from '../../../components/Helper/ScrollToTop';
    import Footer from '../../../components/Footer/Footer';
    import InputTextarea from '../../../components/Input/InputTextarea';
    import { Link, useNavigate } from 'react-router-dom';

    // Importer les constantes depuis le fichier séparé
    import { 
    COMMANDE_TYPES, 
    mockCommandes, 
    statutOptions, 
    paiementOptions, 
    prioriteOptions 
    } from '../../../constants/commandeTypes';

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

    // Composant de carte commande
    const CommandeCard = ({ commande, onDelete, onPrint, onSuivi, delay = 0 }) => {
    const navigate = useNavigate();
    
    const getStatutColor = (statut) => {
        switch(statut) {
        case 'validee': return '#10b981';
        case 'en_cours': return '#3b82f6';
        case 'arrivee_partielle': return '#f59e0b';
        case 'en_attente': return '#f59e0b';
        case 'confirmée': return '#10b981';
        case 'livrée': return '#8b5cf6';
        case 'facturée': return '#06b6d4';
        case 'annulée': return '#ef4444';
        case 'retard': return '#f97316';
        case 'en_preparation': return '#6366f1';
        default: return '#64748b';
        }
    };

    const getStatutIcon = (statut) => {
        switch(statut) {
        case 'validee': return <TbCircleCheck />;
        case 'en_cours': return <FaSync />;
        case 'arrivee_partielle': return <IoAlertCircleOutline />;
        case 'en_attente': return <IoTimeOutline />;
        case 'confirmée': return <TbCircleCheck />;
        case 'livrée': return <FaShippingFast />;
        case 'facturée': return <FaFileInvoiceDollar />;
        case 'annulée': return <TbCircleX />;
        case 'retard': return <IoAlertCircleOutline />;
        case 'en_preparation': return <MdOutlineInventory2 />;
        default: return <IoInformationCircleOutline />;
        }
    };

    const getPaiementColor = (paiement) => {
        switch(paiement) {
        case 'payée': return '#10b981';
        case 'acompte': return '#3b82f6';
        case 'à crédit': return '#f59e0b';
        case 'en_attente': return '#ef4444';
        case 'remboursée': return '#8b5cf6';
        default: return '#64748b';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
        });
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0
        }).format(montant);
    };

    const calculateProgress = () => {
        const totalQty = commande.produits.reduce((sum, p) => sum + p.qty, 0);
        const totalRecue = commande.produits.reduce((sum, p) => sum + (p.qtyRecue || 0), 0);
        return totalQty > 0 ? (totalRecue / totalQty) * 100 : 0;
    };

    const progress = calculateProgress();

    // Fonction pour rediriger vers la validation
    const handleValidateRedirect = () => {
        navigate(`/validationComande/${commande.id}`, {
        state: {
            commande,
            typeValidation: commande.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE 
            ? COMMANDE_TYPES.ARRIVEE_PARTIELLE 
            : COMMANDE_TYPES.VALIDEE
        }
        });
    };

    // Fonction pour rediriger vers les détails
    const handleViewRedirect = () => {
        navigate(`/detailCommandesAdmin/${commande.id}`, {
        state: { commande }
        });
    };

    return (
        <div 
        className={styles.commandeCard}
        style={{ 
            animationDelay: `${delay}ms`,
            borderLeft: `4px solid ${getStatutColor(commande.statut)}`
        }}
        >
        <div className={styles.commandeCardHeader}>
            <div className={styles.commandeInfo}>
            <div className={styles.commandeNumero}>
                <TbReceipt2 />
                <h4>{commande.numero}</h4>
            </div>
            <div className={styles.commandeStatut}>
                <span 
                className={styles.statutBadge}
                style={{ backgroundColor: `${getStatutColor(commande.statut)}20`, color: getStatutColor(commande.statut) }}
                >
                {getStatutIcon(commande.statut)}
                {commande.statut.charAt(0).toUpperCase() + commande.statut.slice(1).replace('_', ' ')}
                </span>
                {commande.priorite === 'haute' && (
                <span className={styles.prioriteBadge}>
                    <IoAlertCircleOutline />
                    Priorité haute
                </span>
                )}
            </div>
            </div>
            
            <div className={styles.commandeActions}>
            <Button 
                variant="eyebg"
                size="small"
                icon="eye"
                onClick={handleViewRedirect}
                title="Voir détails"
                className={styles.iconButton}
            />
            <Button 
                variant="secondary"
                size="small"
                icon="truck"
                onClick={() => onSuivi(commande)}
                title="Suivi"
                className={styles.iconButton}
            />
            <Button 
                variant="warning"
                size="small"
                icon="edit"
                onClick={() => navigate(`/frmCommandesAdmin/${commande.id}`)}
                title="Modifier"
                className={styles.iconButton}
            />
            <Button 
                variant="danger"
                size="small"
                icon="trash"
                onClick={() => onDelete(commande)}
                title="Supprimer"
                className={styles.iconButton}
            />
            </div>
        </div>
        
        <div className={styles.commandeCardBody}>
            <div className={styles.commandeClient}>
                <div className={styles.clientInfo}>
                    <div>
                    <h5 className={styles.clientName}>{commande.client}</h5>
                    <div className={styles.clientMeta}>
                        <span className={styles.vendeur}>
                        <FaUserTie /> {commande.vendeur}
                        </span>
                        <span className={styles.date}>
                        <IoCalendarOutline /> {formatDate(commande.date)}
                        </span>
                        <span className={styles.montantLabel}>Montant total : {formatMontant(commande.montant)}</span>
                    </div>
                    </div>
                </div>
            </div>
            
            {/* Barre de progression pour arrivée partielle */}
            {commande.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE && (
            <div className={styles.progressSection}>
                <div className={styles.progressInfo}>
                <span>Avancement de la réception</span>
                <span>{progress.toFixed(0)}%</span>
                </div>
                <div className={styles.progressBar}>
                <div 
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                />
                </div>
            </div>
            )}
            
            <div className={styles.commandeDetails}>
            <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                <IoCalendarNumberOutline />
                </div>
                <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Livraison prévue</span>
                <span className={styles.detailValue}>{formatDate(commande.dateLivraison)}</span>
                </div>
            </div>
            
            <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                {commande.typeLivraison === 'livraison' ? <CiDeliveryTruck /> : <FaStore />}
                </div>
                <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Type</span>
                <span className={styles.detailValue}>
                    {commande.typeLivraison === 'livraison' ? 'Livraison' : 'À emporter'}
                </span>
                </div>
            </div>
            
            <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                <TbPackage />
                </div>
                <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Articles</span>
                <span className={styles.detailValue}>{commande.articles}</span>
                </div>
            </div>
            
            <div className={styles.detailItem}>
                <div className={styles.detailIcon}>
                <GiReceiveMoney />
                </div>
                <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Paiement</span>
                <span 
                    className={styles.detailValue}
                    style={{ color: getPaiementColor(commande.paiement) }}
                >
                    {commande.paiement}
                </span>
                </div>
            </div>
            </div>
            
            {commande.notes && (
            <div className={styles.commandeNotes}>
                <IoInformationCircleOutline />
                <span>{commande.notes}</span>
            </div>
            )}
        </div>
        
        <div className={styles.commandeCardFooter}>
            <div className={styles.commandeProduits}>
            <span className={styles.produitsLabel}>Produits principaux:</span>
            <div className={styles.produitsList}>
                {commande.produits.slice(0, 3).map((produit, index) => (
                <span key={index} className={styles.produitTag}>
                    {produit.nom} ({produit.qtyRecue || 0}/{produit.qty})
                </span>
                ))}
                {commande.produits.length > 3 && (
                <span className={styles.moreProduits}>
                    +{commande.produits.length - 3}
                </span>
                )}
            </div>
            </div>
            
            <div className={styles.commandeQuickActions}>
            <Button 
                variant="outline"
                size="small"
                icon="truck"
                onClick={() => onSuivi(commande)}
                className={styles.actionButton}
            >
                Suivi
            </Button>
            
            {(commande.typeCommande === COMMANDE_TYPES.EN_COURS || 
                commande.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE) && (
                <Button 
                variant="primary"
                size="small"
                icon="check"
                onClick={handleValidateRedirect}
                className={styles.actionButton}
                >
                Valider
                </Button>
            )}
            
            <Button 
                variant="secondary"
                size="small"
                icon="receipt"
                onClick={() => onPrint(commande)}
                className={styles.actionButton}
            >
                Facture
            </Button>
            </div>
        </div>
        </div>
    );
    };

    // Composant principal
    const Commandes = () => {
    const navigate = useNavigate();
    
    // États pour les données
    const [commandes, setCommandes] = useState(mockCommandes);
    
    // États pour l'interface
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('all');
    const [selectedPaiement, setSelectedPaiement] = useState('all');
    const [selectedPriorite, setSelectedPriorite] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [viewMode, setViewMode] = useState('list');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [activeFilter, setActiveFilter] = useState(COMMANDE_TYPES.EN_COURS);
    
    // États pour les modales et toasts
    const [toasts, setToasts] = useState([]);
    const [selectedCommande, setSelectedCommande] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Fonction pour ajouter un toast
    const addToast = (message, type = "info") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        
        setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 5000);
    };

    // Calcul des commandes filtrées
    const filteredCommandes = useMemo(() => {
        let filtered = [...commandes];

        // Filtre par type (En cours, Arrivée partielle, Validée)
        if (activeFilter === COMMANDE_TYPES.EN_COURS) {
        filtered = filtered.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.EN_COURS);
        } else if (activeFilter === COMMANDE_TYPES.ARRIVEE_PARTIELLE) {
        filtered = filtered.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE);
        } else if (activeFilter === COMMANDE_TYPES.VALIDEE) {
        filtered = filtered.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.VALIDEE);
        }

        // Filtre de recherche
        if (searchTerm) {
        filtered = filtered.filter(commande =>
            commande.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commande.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            commande.vendeur.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        // Filtre par statut
        if (selectedStatut !== 'all') {
        filtered = filtered.filter(commande => commande.statut === selectedStatut);
        }

        // Filtre par paiement
        if (selectedPaiement !== 'all') {
        filtered = filtered.filter(commande => commande.paiement === selectedPaiement);
        }

        // Filtre par priorité
        if (selectedPriorite !== 'all') {
        filtered = filtered.filter(commande => commande.priorite === selectedPriorite);
        }

        // Filtre par date
        if (dateRange.start) {
        filtered = filtered.filter(commande => 
            new Date(commande.date) >= new Date(dateRange.start)
        );
        }
        if (dateRange.end) {
        filtered = filtered.filter(commande => 
            new Date(commande.date) <= new Date(dateRange.end)
        );
        }

        // Tri
        filtered.sort((a, b) => {
        switch (sortBy) {
            case 'recent':
            return new Date(b.date) - new Date(a.date);
            case 'ancien':
            return new Date(a.date) - new Date(b.date);
            case 'montant_asc':
            return a.montant - b.montant;
            case 'montant_desc':
            return b.montant - a.montant;
            case 'livraison':
            return new Date(a.dateLivraison) - new Date(b.dateLivraison);
            default:
            return 0;
        }
        });

        return filtered;
    }, [commandes, activeFilter, searchTerm, selectedStatut, selectedPaiement, selectedPriorite, sortBy, dateRange]);

    // Calcul des statistiques
    const stats = useMemo(() => {
        const totalCommandes = commandes.length;
        const totalMontant = commandes.reduce((sum, cmd) => sum + cmd.montant, 0);
        const commandesEnCours = commandes.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.EN_COURS).length;
        const commandesArriveePartielle = commandes.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE).length;
        const commandesValidees = commandes.filter(cmd => cmd.typeCommande === COMMANDE_TYPES.VALIDEE).length;
        const moyenneMontant = totalMontant / totalCommandes || 0;
        
        const today = new Date().toISOString().split('T')[0];
        const commandesAujourdhui = commandes.filter(cmd => cmd.date === today).length;
        
        return {
        totalCommandes,
        totalMontant,
        commandesEnCours,
        commandesArriveePartielle,
        commandesValidees,
        moyenneMontant,
        commandesAujourdhui
        };
    }, [commandes]);

    // Gestion des événements
    const handleViewCommande = (commande) => {
        navigate(`/detailCommandesAdmin/${commande.id}`, {
        state: { commande }
        });
    };

    const handleValidateClick = (commande) => {
        navigate(`/validationComande/${commande.id}`, {
        state: {
            commande,
            typeValidation: commande.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE 
            ? COMMANDE_TYPES.ARRIVEE_PARTIELLE 
            : COMMANDE_TYPES.VALIDEE
        }
        });
    };

    const handleDeleteClick = (commande) => {
        setSelectedCommande(commande);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedCommande) {
        setCommandes(commandes.filter(cmd => cmd.id !== selectedCommande.id));
        addToast('Commande supprimée avec succès', 'success');
        setShowDeleteModal(false);
        setSelectedCommande(null);
        }
    };

    const handlePrintCommande = (commande) => {
        // Simulation d'impression
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
        <html>
            <head>
            <title>Facture ${commande.numero}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .info { margin-bottom: 20px; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .total { text-align: right; font-weight: bold; margin-top: 20px; }
            </style>
            </head>
            <body>
            <div class="header">
                <h1>Facture ${commande.numero}</h1>
                <p>Date: ${new Date(commande.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div class="info">
                <p><strong>Client:</strong> ${commande.client}</p>
                <p><strong>Vendeur:</strong> ${commande.vendeur}</p>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Quantité reçue</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                ${commande.produits.map(p => `
                    <tr>
                    <td>${p.nom}</td>
                    <td>${p.qty}</td>
                    <td>${p.qtyRecue || 0}</td>
                    <td>${new Intl.NumberFormat('fr-MG').format(p.prix)} Ar</td>
                    <td>${new Intl.NumberFormat('fr-MG').format(p.qty * p.prix)} Ar</td>
                    </tr>
                `).join('')}
                </tbody>
            </table>
            <div class="total">
                <h3>Total: ${new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(commande.montant)}</h3>
            </div>
            </body>
        </html>
        `);
        printWindow.document.close();
        printWindow.print();
        
        addToast('Facture générée avec succès', 'success');
    };

    const handleSuiviClick = (commande) => {
        // Pour l'instant, on va juste afficher un message
        addToast(`Fonctionnalité de suivi pour ${commande.numero} à venir`, 'info');
    };

    const handleExport = () => {
        const csvContent = [
        ['Numéro', 'Client', 'Date', 'Statut', 'Type', 'Montant', 'Paiement', 'Type Livraison', 'Vendeur'],
        ...commandes.map(cmd => [
            cmd.numero,
            cmd.client,
            cmd.date,
            cmd.statut,
            cmd.typeCommande,
            cmd.montant,
            cmd.paiement,
            cmd.typeLivraison,
            cmd.vendeur
        ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commandes-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        addToast('Export terminé avec succès', 'success');
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedStatut('all');
        setSelectedPaiement('all');
        setSelectedPriorite('all');
        setSortBy('recent');
        setDateRange({ start: '', end: '' });
        setActiveFilter(COMMANDE_TYPES.EN_COURS);
        addToast('Filtres réinitialisés', 'info');
    };

    const handleQuickAction = (action) => {
        switch(action) {
        case 'new':
            navigate('/frmCommandesAdmin');
            break;
        case 'today':
            setDateRange({
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
            });
            addToast('Filtre: commandes d\'aujourd\'hui', 'info');
            break;
        case 'urgent':
            setSelectedPriorite('haute');
            addToast('Filtre: commandes prioritaires', 'info');
            break;
        case 'delayed':
            setSelectedStatut('retard');
            addToast('Filtre: commandes en retard', 'warning');
            break;
        default:
            break;
        }
    };

    // Configuration des colonnes pour le tableau
    const tableColumns = [
        {
        label: 'Commande',
        accessor: 'numero',
        render: (row) => (
            <div className={styles.tableCommandeInfo}>
            <div className={styles.commandeNumeroTable}>
                <TbReceipt2 />
                <div>
                <div className={styles.commandeNumeroText}>{row.numero}</div>
                <div className={styles.commandeClientTable}>{row.client}</div>
                </div>
            </div>
            </div>
        )
        },
        {
        label: 'Date',
        accessor: 'date',
        render: (row) => (
            <div className={styles.tableDate}>
            <div className={styles.dateValue}>
                {new Date(row.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
                })}
            </div>
            <div className={styles.dateLivraison}>
                <CiDeliveryTruck /> 
                {new Date(row.dateLivraison).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short'
                })}
            </div>
            </div>
        )
        },
        {
        label: 'Type',
        accessor: 'typeCommande',
        render: (row) => {
            const getTypeColor = () => {
            switch(row.typeCommande) {
                case COMMANDE_TYPES.EN_COURS: return '#3b82f6';
                case COMMANDE_TYPES.ARRIVEE_PARTIELLE: return '#f59e0b';
                case COMMANDE_TYPES.VALIDEE: return '#10b981';
                default: return '#64748b';
            }
            };
            
            const getTypeLabel = () => {
            switch(row.typeCommande) {
                case COMMANDE_TYPES.EN_COURS: return 'En cours';
                case COMMANDE_TYPES.ARRIVEE_PARTIELLE: return 'Arrivée partielle';
                case COMMANDE_TYPES.VALIDEE: return 'Validée';
                default: return 'Inconnu';
            }
            };
            
            return (
            <div className={styles.tableType}>
                <span 
                className={styles.typeBadge}
                style={{ 
                    backgroundColor: `${getTypeColor()}20`,
                    color: getTypeColor(),
                    border: `1px solid ${getTypeColor()}40`
                }}
                >
                {getTypeLabel()}
                </span>
            </div>
            );
        }
        },
        {
        label: 'Montant',
        accessor: 'montant',
        render: (row) => (
            <div className={styles.tableMontant}>
            <div className={styles.montantValue}>
                {new Intl.NumberFormat('fr-MG', {
                style: 'currency',
                currency: 'MGA',
                minimumFractionDigits: 0
                }).format(row.montant)}
            </div>
            <div className={styles.paiementBadge}>
                {row.paiement}
            </div>
            </div>
        )
        },
        {
        label: 'Vendeur',
        accessor: 'vendeur',
        render: (row) => (
            <div className={styles.tableVendeur}>
            <FaUserTie />
            <span>{row.vendeur}</span>
            </div>
        )
        },
        {
        label: 'Actions',
        accessor: 'actions',
        align: 'center',
        render: (row) => (
            <div className={styles.tableActions}>
            <Button 
                variant="eyebg"
                size="small"
                icon="eye"
                onClick={() => handleViewCommande(row)}
                title="Voir détails"
                className={styles.tableActionButton}
            />
            <Button 
                variant="secondary"
                size="small"
                icon="truck"
                onClick={() => handleSuiviClick(row)}
                title="Suivi"
                className={styles.tableActionButton}
            />
            {(row.typeCommande === COMMANDE_TYPES.EN_COURS || 
                row.typeCommande === COMMANDE_TYPES.ARRIVEE_PARTIELLE) && (
                <Button 
                variant="primary"
                size="small"
                icon="check"
                onClick={() => handleValidateClick(row)}
                title="Valider"
                className={styles.tableActionButton}
                />
            )}
            <Button 
                variant="danger"
                size="small"
                icon="trash"
                onClick={() => handleDeleteClick(row)}
                title="Supprimer"
                className={styles.tableActionButton}
            />
            </div>
        )
        }
    ];

    return (
        <div className={styles.dashboardModern}>
        <div className={styles.dashboardContent}>
            {/* Header */}
            <div className={`${styles.header} ${styles.commandesHeader}`}>
            <div className={styles.headerContent}>
                <div className={styles.headerText}>
                <div className={styles.headerTitleContent}>
                    <h1 className={styles.dashboardTitle}>
                    Gestion des <span className={styles.highlight}>Commandes</span>
                    </h1>
                    <p className={styles.dashboardSubtitle}>
                    Gérez, suivez et validez toutes les commandes de votre quincaillerie
                    </p>
                </div>
                </div>
                
                {/* Statistiques rapides */}
                <div className={styles.quickStats}>
                <div className={styles.quickStatItem}>
                    <div className={`${styles.statIcon} ${styles.primary}`}>
                    <TbReceipt2 />
                    </div>
                    <div className={styles.statInfo}>
                    <span className={styles.statValue}>{stats.totalCommandes}</span>
                    <span className={styles.statLabel}>Commandes</span>
                    </div>
                </div>
                
                <div className={styles.quickStatItem}>
                    <div className={`${styles.statIcon} ${styles.warning}`}>
                    <FaSync />
                    </div>
                    <div className={styles.statInfo}>
                    <span className={styles.statValue}>{stats.commandesEnCours}</span>
                    <span className={styles.statLabel}>En cours</span>
                    </div>
                </div>

                <div className={styles.quickStatItem}>
                    <div className={`${styles.statIcon} ${styles.orange}`}>
                    <IoAlertCircleOutline />
                    </div>
                    <div className={styles.statInfo}>
                    <span className={styles.statValue}>{stats.commandesArriveePartielle}</span>
                    <span className={styles.statLabel}>Arrivée partielle</span>
                    </div>
                </div>

                <div className={styles.quickStatItem}>
                    <div className={`${styles.statIcon} ${styles.success}`}>
                    <TbCircleCheck />
                    </div>
                    <div className={styles.statInfo}>
                    <span className={styles.statValue}>{stats.commandesValidees}</span>
                    <span className={styles.statLabel}>Validées</span>
                    </div>
                </div>
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
                    label="Ventes"
                />
                <StyledBreadcrumb
                    label="Commandes"
                />
                </Breadcrumbs>
            </div>
            </div>

            {/* Barre de contrôle */}
            <div className={styles.dashboardControls}>
            <div className={styles.searchSection}>
                <Input
                type="text"
                placeholder="Rechercher commande, client, vendeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="commandeSearch"
                icon={<IoSearchOutline />}
                fullWidth
                />
            </div>
            
            <div className={styles.actionsSection}>
                <Link 
                to="/frmCommandesAdmin"
                className={styles.newCommandeLink}
                >
                <Button 
                    variant="primary"
                    size="medium"
                    icon="add"
                    className={styles.actionButton}
                >
                    Nouvelle Commande
                </Button>
                </Link>
                <Button 
                variant="secondary"
                size="medium"
                icon="download"
                onClick={handleExport}
                className={styles.actionButton}
                >
                Exporter
                </Button>
                <Button 
                variant="secondary"
                size="medium"
                icon="print"
                onClick={() => window.print()}
                className={styles.actionButton}
                >
                Imprimer
                </Button>
            </div>
            </div>

            {/* Actions rapides */}
            <div className={styles.quickActionsBar}>
                <Button 
                    variant="outline"
                    size="medium"
                    icon="calendar"
                    onClick={() => handleQuickAction('today')}
                    className={styles.quickActionButton}
                >
                    Aujourd'hui
                </Button>
                <Button 
                    variant="outline"
                    size="medium"
                    icon="alert"
                    onClick={() => handleQuickAction('urgent')}
                    className={styles.quickActionButton}
                >
                    Prioritaires
                </Button>
                <Button 
                    variant="outline"
                    size="medium"
                    icon="warning"
                    onClick={() => handleQuickAction('delayed')}
                    className={styles.quickActionButton}
                >
                    En retard
                </Button>
                <Button 
                    variant="outline"
                    size="medium"
                    icon="refresh"
                    onClick={handleResetFilters}
                    className={styles.quickActionButton}
                >
                    Réinitialiser
                </Button>
            </div>

            {/* Filtres avancés */}
            <div className={styles.advancedFilters}>
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Statut:</label>
                    <InputSelect
                    value={selectedStatut}
                    onChange={setSelectedStatut}
                    options={statutOptions}
                    placeholder="Statut"
                    size="small"
                    icon={<IoCheckmarkCircleOutline />}
                    fullWidth
                    />
                </div>
                
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Paiement:</label>
                    <InputSelect
                    value={selectedPaiement}
                    onChange={setSelectedPaiement}
                    options={paiementOptions}
                    placeholder="Paiement"
                    size="small"
                    icon={<GiReceiveMoney />}
                    fullWidth
                    />
                </div>
                
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Priorité:</label>
                    <InputSelect
                    value={selectedPriorite}
                    onChange={setSelectedPriorite}
                    options={prioriteOptions}
                    placeholder="Priorité"
                    size="small"
                    icon={<IoAlertCircleOutline />}
                    fullWidth
                    />
                </div>
                
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Trier par:</label>
                    <InputSelect
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                        { value: 'recent', label: 'Plus récentes' },
                        { value: 'ancien', label: 'Plus anciennes' },
                        { value: 'montant_desc', label: 'Montant (décroissant)' },
                        { value: 'montant_asc', label: 'Montant (croissant)' },
                        { value: 'livraison', label: 'Date livraison' }
                    ]}
                    placeholder="Trier par"
                    size="small"
                    icon={<TbArrowsSort />}
                    fullWidth
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Date de:</label>
                    <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    name="dateStart"
                    icon={<IoCalendarOutline />}
                    fullWidth
                    />
                </div>
                
                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Date à:</label>
                    <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    name="dateEnd"
                    icon={<IoCalendarOutline />}
                    fullWidth
                    />
                </div>
            </div>

            {/* Boutons de filtrage principal */}
            <div className={styles.mainFilters}>
            <div className={styles.filterTabs}>
                <Button
                variant={activeFilter === COMMANDE_TYPES.EN_COURS ? "primary" : "outline"}
                size="large"
                icon="sync"
                onClick={() => setActiveFilter(COMMANDE_TYPES.EN_COURS)}
                className={styles.filterTab}
                >
                En cours ({stats.commandesEnCours})
                </Button>
                <Button
                variant={activeFilter === COMMANDE_TYPES.ARRIVEE_PARTIELLE ? "primary" : "outline"}
                size="large"
                icon="warning"
                onClick={() => setActiveFilter(COMMANDE_TYPES.ARRIVEE_PARTIELLE)}
                className={styles.filterTab}
                >
                Arrivée partielle ({stats.commandesArriveePartielle})
                </Button>
                <Button
                variant={activeFilter === COMMANDE_TYPES.VALIDEE ? "primary" : "outline"}
                size="large"
                icon="check"
                onClick={() => setActiveFilter(COMMANDE_TYPES.VALIDEE)}
                className={styles.filterTab}
                >
                Validée ({stats.commandesValidees})
                </Button>
            </div>
            </div>

            {/* Liste des commandes */}
            <section className={styles.dashboardSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                <TbReceipt2 className={styles.sectionIcon} />
                <div>
                    <h2 className={styles.sectionTitle}>
                    {activeFilter === COMMANDE_TYPES.EN_COURS && 'Commandes en Cours'}
                    {activeFilter === COMMANDE_TYPES.ARRIVEE_PARTIELLE && 'Commandes Arrivée Partielle'}
                    {activeFilter === COMMANDE_TYPES.VALIDEE && 'Commandes Validées'}
                    </h2>
                    <p className={styles.sectionSubtitle}>
                    {filteredCommandes.length} commande(s) trouvée(s)
                    </p>
                </div>
                </div>

                <div className={styles.sectionActions}>
                    <div className={styles.viewToggle}>
                        <Button 
                        variant={viewMode === 'list' ? 'primary' : 'outline'}
                        size="small"
                        icon="list"
                        onClick={() => setViewMode('list')}
                        className={styles.viewButton}
                        title="Vue liste"
                        />
                        <Button 
                        variant={viewMode === 'compact' ? 'primary' : 'outline'}
                        size="small"
                        icon="listDetails"
                        onClick={() => setViewMode('compact')}
                        className={styles.viewButton}
                        title="Vue compacte"
                        />
                        <Button 
                        variant={viewMode === 'grid' ? 'primary' : 'outline'}
                        size="small"
                        icon="grid"
                        onClick={() => setViewMode('grid')}
                        className={styles.viewButton}
                        title="Vue grille"
                        />
                    </div>
                </div>
            </div>
            
            {/* Vue grille ou tableau */}
            {viewMode === 'grid' ? (
                <div className={styles.commandesGrid}>
                {filteredCommandes.map((commande, index) => (
                    <CommandeCard
                    key={commande.id}
                    commande={commande}
                    onPrint={handlePrintCommande}
                    onSuivi={handleSuiviClick}
                    onDelete={handleDeleteClick}
                    delay={index * 100}
                    />
                ))}
                
                {filteredCommandes.length === 0 && (
                    <div className={styles.noResults}>
                    <TbReceipt2 className={styles.noResultsIcon} />
                    <h3 className={styles.noResultsTitle}>Aucune commande trouvée</h3>
                    <p className={styles.noResultsText}>
                        Aucune commande ne correspond à vos critères de recherche.
                    </p>
                    <Button 
                        variant="primary"
                        size="medium"
                        icon="refresh"
                        onClick={handleResetFilters}
                        className={styles.resetFiltersButton}
                    >
                        Réinitialiser les filtres
                    </Button>
                    </div>
                )}
                </div>
            ) : (
                <div className={styles.tableContainer}>
                <Table 
                    columns={tableColumns}
                    data={filteredCommandes}
                    className={styles.commandesTable}
                    striped={true}
                    hoverEffect={true}
                    compact={viewMode === 'compact'}
                    sortable={true}
                    selectable={true}
                    pagination={true}
                    itemsPerPage={viewMode === 'compact' ? 15 : 10}
                />
                
                {filteredCommandes.length === 0 && (
                    <div className={styles.noResults}>
                    <TbReceipt2 className={styles.noResultsIcon} />
                    <h3 className={styles.noResultsTitle}>Aucune commande trouvée</h3>
                    <p className={styles.noResultsText}>
                        Aucune commande ne correspond à vos critères de recherche.
                    </p>
                    <Button 
                        variant="primary"
                        size="medium"
                        icon="refresh"
                        onClick={handleResetFilters}
                        className={styles.resetFiltersButton}
                    >
                        Réinitialiser les filtres
                    </Button>
                    </div>
                )}
                </div>
            )}
            
            {/* Résumé */}
            {filteredCommandes.length > 0 && (
                <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total commandes:</span>
                    <span className={styles.summaryValue}>{filteredCommandes.length}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Montant total:</span>
                    <span className={styles.summaryValue}>
                    {new Intl.NumberFormat('fr-MG', {
                        style: 'currency',
                        currency: 'MGA',
                        minimumFractionDigits: 0
                    }).format(filteredCommandes.reduce((sum, cmd) => sum + cmd.montant, 0))}
                    </span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Moyenne par commande:</span>
                    <span className={styles.summaryValue}>
                    {new Intl.NumberFormat('fr-MG', {
                        style: 'currency',
                        currency: 'MGA',
                        minimumFractionDigits: 0
                    }).format(
                        filteredCommandes.reduce((sum, cmd) => sum + cmd.montant, 0) / filteredCommandes.length || 0
                    )}
                    </span>
                </div>
                </div>
            )}
            </section>

            {/* Alertes et actions */}
            <div className={styles.alertsSection}>
            {stats.commandesEnCours > 0 && (
                <div className={styles.alertCard}>
                <div className={`${styles.alertIcon} ${styles.warning}`}>
                    <FaSync />
                </div>
                <div className={styles.alertContent}>
                    <h4 className={styles.alertTitle}>{stats.commandesEnCours} commandes en cours</h4>
                    <p className={styles.alertText}>Valider les quantités reçues pour mettre à jour le statut</p>
                </div>
                <Button 
                    variant="warning"
                    size="medium"
                    icon="check"
                    onClick={() => setActiveFilter(COMMANDE_TYPES.EN_COURS)}
                    className={styles.alertButton}
                >
                    Voir
                </Button>
                </div>
            )}
            
            {stats.commandesArriveePartielle > 0 && (
                <div className={styles.alertCard}>
                <div className={`${styles.alertIcon} ${styles.orange}`}>
                    <IoAlertCircleOutline />
                </div>
                <div className={styles.alertContent}>
                    <h4 className={styles.alertTitle}>{stats.commandesArriveePartielle} commandes en arrivée partielle</h4>
                    <p className={styles.alertText}>Compléter la réception pour finaliser les commandes</p>
                </div>
                <Button 
                    variant="warning"
                    size="medium"
                    icon="eye"
                    onClick={() => setActiveFilter(COMMANDE_TYPES.ARRIVEE_PARTIELLE)}
                    className={styles.alertButton}
                >
                    Vérifier
                </Button>
                </div>
            )}
            </div>

            <div>
            <ScrollToTop />
            <Footer />
            </div>
        </div>

        {/* Modale de suppression */}
        <Modal 
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
        >
            <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
                <IoAlertCircleOutline />
            </div>
            <h3 className={styles.modalTitle}>Confirmer la suppression</h3>
            <p className={styles.modalText}>
                Êtes-vous sûr de vouloir supprimer la commande <strong>{selectedCommande?.numero}</strong> ?
                Cette action est irréversible.
            </p>
            <div className={styles.modalActions}>
                <Button 
                variant="outline"
                size="medium"
                onClick={() => setShowDeleteModal(false)}
                className={styles.modalButton}
                >
                Annuler
                </Button>
                <Button 
                variant="danger"
                size="medium"
                onClick={handleDeleteConfirm}
                className={styles.modalButton}
                >
                Supprimer
                </Button>
            </div>
            </div>
        </Modal>

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

    export default Commandes;