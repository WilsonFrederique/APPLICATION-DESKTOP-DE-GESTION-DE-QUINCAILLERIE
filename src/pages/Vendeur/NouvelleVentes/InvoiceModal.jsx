import React, { useState, useMemo, useRef, useCallback } from 'react';
import styles from './InvoiceModal.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputSelect from '../../../components/Input/InputSelect';
import {
  IoPersonOutline,
  IoCallOutline,
  IoLocationOutline,
  IoInformationCircleOutline
} from "react-icons/io5";
import {
  MdPayment,
  MdReceiptLong
} from "react-icons/md";
import {
  TbCopy
} from "react-icons/tb";

// Données mock pour les clients existants
const mockClients = [
  {
    id: 1,
    nom: 'SARL Batiment Plus',
    telephone: '+261 34 00 123 45',
    adresse: 'Analakely, Antananarivo 101'
  },
  {
    id: 2,
    nom: 'Entreprise Construction Pro',
    telephone: '+261 32 00 987 65',
    adresse: 'Ivandry, Antananarivo'
  },
  {
    id: 3,
    nom: 'Mr. Randria Jean-Pierre',
    telephone: '+261 33 00 456 78',
    adresse: 'Ambohibao, Antananarivo'
  },
  {
    id: 4,
    nom: 'Groupe Immobilier Pro',
    telephone: '+261 34 11 223 34',
    adresse: 'Ankorondrano, Antananarivo'
  },
  {
    id: 5,
    nom: 'SARL Materiaux Pro',
    telephone: '+261 32 11 334 45',
    adresse: 'Andraharo, Antananarivo'
  }
];

// Fonction utilitaire pour générer le numéro de facture
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}${month}${day}`;

  const lastInvoiceDate = localStorage.getItem('lastInvoiceDate');
  let counter = 1;
  if (lastInvoiceDate === today) {
    counter = parseInt(localStorage.getItem('invoiceCounter')) + 1 || 1;
  }

  localStorage.setItem('invoiceCounter', counter.toString());
  localStorage.setItem('lastInvoiceDate', today);

  const counterStr = String(counter).padStart(3, '0');
  return `${today}${counterStr}`;
};

const InvoiceModal = ({ cart, onClose, onCompleteSale }) => {
  const [paymentMethod, setPaymentMethod] = useState('espèces');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');

  const invoicePreviewRef = useRef(null);
  const invoiceNumber = useMemo(() => generateInvoiceNumber(), []);

  // Formatter de devise mémorisé (créé une seule fois)
  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }, []);

  // Calculs mémorisés pour éviter les recalculs à chaque render
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  const tax = useMemo(() => {
    return Math.round(total * 0.2);
  }, [total]);

  const grandTotal = useMemo(() => {
    return total + tax;
  }, [total, tax]);

  // Fonction formatCurrency optimisée
  const formatCurrency = useCallback((amount) => {
    return currencyFormatter.format(amount);
  }, [currencyFormatter]);

  // Gérer la sélection d'un client existant
  const handleClientSelect = useCallback((clientId) => {
    if (clientId) {
      const selectedClient = mockClients.find(c => c.id === parseInt(clientId));
      if (selectedClient) {
        setClientName(selectedClient.nom);
        setClientPhone(selectedClient.telephone);
        setClientAddress(selectedClient.adresse);
        setShowManualInput(false);
      }
    } else {
      setClientName('');
      setClientPhone('');
      setClientAddress('');
    }
    setSelectedClientId(clientId);
  }, []);

  // Basculer vers la saisie manuelle
  const handleToggleManualInput = useCallback(() => {
    setShowManualInput(!showManualInput);
    if (!showManualInput) {
      setSelectedClientId('');
      setClientName('');
      setClientPhone('');
      setClientAddress('');
    }
  }, [showManualInput]);

  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(`FAC-${invoiceNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompleteSale = useCallback(() => {
    // Les informations du client ne sont plus requises
    const invoiceData = {
      numero: `FAC-${invoiceNumber}`,
      client: {
        nom: clientName || 'Client non spécifié',
        telephone: clientPhone || '',
        adresse: clientAddress || ''
      },
      items: cart,
      subtotal,
      discount,
      total,
      tax,
      grandTotal,
      paymentMethod,
      notes,
      date: new Date().toISOString(),
      statut: paymentMethod === 'credit' ? 'credit' : 'paye'
    };

    onCompleteSale(invoiceData);
  }, [invoiceNumber, clientName, clientPhone, clientAddress, cart, subtotal, discount, total, tax, grandTotal, paymentMethod, notes, onCompleteSale]);

  const handlePrintInvoice = () => {
    // Construire le HTML de la facture
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Facture FAC-${invoiceNumber}</title>
          <meta charset="UTF-8">
          <style>
            @page {
              size: 80mm 297mm;
              margin: 2mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 10px;
              line-height: 1.3;
              color: #000;
              padding: 5px;
              margin: 0;
            }
            .invoice-print {
              width: 76mm;
              max-width: 76mm;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            .company-name {
              font-size: 12px;
              font-weight: bold;
              margin: 2px 0;
              text-transform: uppercase;
            }
            .company-details {
              font-size: 8px;
              color: #555;
              margin: 1px 0;
            }
            .invoice-title {
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              margin: 5px 0;
              text-transform: uppercase;
            }
            .invoice-meta {
              display: flex;
              justify-content: space-between;
              font-size: 8px;
              margin: 5px 0;
              padding: 3px 0;
              border-top: 1px dashed #666;
              border-bottom: 1px dashed #666;
            }
            .client-info {
              font-size: 9px;
              margin: 5px 0;
              padding: 3px;
              background: #f5f5f5;
              border-radius: 2px;
            }
            .client-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin: 5px 0;
              font-size: 9px;
            }
            .table th {
              background: #333;
              color: white;
              padding: 3px;
              text-align: left;
              font-weight: bold;
              font-size: 8px;
            }
            .table td {
              padding: 3px;
              border-bottom: 1px solid #ddd;
              vertical-align: top;
            }
            .table .item-name { width: 40%; }
            .table .item-qty { width: 15%; text-align: center; }
            .table .item-price { width: 20%; text-align: right; }
            .table .item-total { width: 25%; text-align: right; font-weight: bold; }
            .totals { margin: 8px 0; font-size: 10px; }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .total-row.grand-total {
              font-weight: bold;
              font-size: 11px;
              border-top: 2px solid #000;
              padding-top: 4px;
              margin-top: 4px;
            }
            .payment-info {
              font-size: 8px;
              margin: 5px 0;
              padding: 3px;
              background: #f5f5f5;
              border-radius: 2px;
            }
            .footer {
              text-align: center;
              margin-top: 10px;
              padding-top: 5px;
              border-top: 1px solid #000;
              font-size: 8px;
              color: #555;
            }
            .thank-you {
              font-style: italic;
              margin: 5px 0;
              font-size: 9px;
              text-align: center;
            }
            .notes {
              margin: 5px 0;
              padding: 3px;
              border: 1px dashed #666;
              font-size: 8px;
              font-style: italic;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-print { width: 76mm; }
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="invoice-print">
            <div class="header">
              <div class="company-name">QUINCAILLERIE PRO</div>
              <div class="company-details">Ampitakely, Fianarantsoa 301</div>
              <div class="company-details">Tél: +261 34 00 123 45</div>
              <div class="company-details">NIF: 123456789 | STAT: 987654321</div>
            </div>
            
            <div class="invoice-title">FACTURE</div>
            
            <div class="invoice-meta">
              <div>
                <div><strong>N°:</strong> FAC-${invoiceNumber}</div>
                <div><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</div>
              </div>
              <div>
                <div><strong>Mode:</strong> ${paymentMethod}</div>
              </div>
            </div>
            
            <div class="client-info">
              <div class="client-name">${clientName || 'Client non spécifié'}</div>
              <div>${clientAddress || 'Adresse non spécifiée'}</div>
              <div>Tél: ${clientPhone || 'Non spécifié'}</div>
            </div>
            
            <table class="table">
              <thead>
                <tr>
                  <th class="item-name">Article</th>
                  <th class="item-qty">Qté</th>
                  <th class="item-price">Prix</th>
                  <th class="item-total">Total</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map(item => `
                  <tr>
                    <td class="item-name">${item.nom}</td>
                    <td class="item-qty">${item.quantity}</td>
                    <td class="item-price">${formatCurrency(item.price)}</td>
                    <td class="item-total">${formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div class="total-row">
                <span>Sous-total:</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              ${discount > 0 ? `
                <div class="total-row">
                  <span>Remise:</span>
                  <span>- ${formatCurrency(discount)}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>TVA (20%):</span>
                <span>${formatCurrency(tax)}</span>
              </div>
              <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>${formatCurrency(grandTotal)}</span>
              </div>
            </div>
            
            ${notes ? `
              <div class="notes">
                <strong>Notes:</strong><br>${notes}
              </div>
            ` : ''}
            
            <div class="payment-info">
              <div><strong>Mode de paiement:</strong> ${({
                espèces: 'ESPÈCES',
                virement: 'VIREMENT',
                mvola: 'MVOLA',
                airtelmoney: 'AIRTEL MONEY',
                orangemoney: 'ORANGE MONEY',
                credit: 'CRÉDIT'
              })[paymentMethod] || paymentMethod.toUpperCase()}</div>
              ${paymentMethod === 'credit' ? `
                <div><strong>Échéance:</strong> ${(() => {
                  const dueDate = new Date();
                  dueDate.setDate(dueDate.getDate() + 14);
                  return dueDate.toLocaleDateString('fr-FR');
                })()}</div>
              ` : ''}
            </div>
  
            <div class="thank-you">Merci pour votre confiance !</div>
            
            <div class="footer">
              <div>Cette facture est un document officiel</div>
              <div>Imprimé le ${new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </body>
      </html>
    `;
  
    // ✅ Utiliser un Blob URL au lieu de document.write() (déprécié)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
  
    const printWindow = window.open(blobUrl, '_blank', 'width=800,height=600');
  
    if (!printWindow) {
      alert("Veuillez autoriser les popups pour cette page afin d'imprimer la facture.");
      URL.revokeObjectURL(blobUrl); // Nettoyer
      return;
    }
  
    // Nettoyer l'URL Blob après fermeture de la fenêtre
    printWindow.addEventListener('afterprint', () => {
      URL.revokeObjectURL(blobUrl);
    });
  };

  return (
    <div className={styles.modalOverlayFull}>
      <div className={styles.modalContainerFull}>
        {/* En-tête du modal */}
        <div className={styles.modalHeaderFull}>
          <div className={styles.modalHeaderContentFull}>
            <div className={styles.headerTitleFull}>
              <MdReceiptLong className={styles.headerIconFull} />
              <div>
                <h1 className={styles.modalTitleFull}>Validation de la Vente</h1>
                <p className={styles.modalSubtitleFull}>Facture compacte format petit papier</p>
              </div>
            </div>
            <div className={styles.headerActionsFull}>
              <div className={styles.invoiceNumberBadge} onClick={copyInvoiceNumber} title="Copier le numéro">
                <span className={styles.invoiceNumberLabel}>N° Facture:</span>
                <span className={styles.invoiceNumberValue}>FAC-{invoiceNumber}</span>
                <TbCopy className={styles.copyIcon} />
                {copied && <span className={styles.copiedTooltip}>Copié!</span>}
              </div>
              <Button
                variant="outline"
                size="medium"
                icon="print"
                onClick={handlePrintInvoice}
                className={styles.printBtnFull}
              >
                Imprimer
              </Button>
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

        {/* Contenu principal */}
        <div className={styles.modalBodyFull}>
          {/* Colonne gauche - Configuration */}
          <div className={styles.configColumn}>
            <div className={styles.configContent}>
              <div className={styles.configSection}>
                <div className={styles.sectionHeader}>
                  <IoPersonOutline className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Client</h3>
                </div>

                {!showManualInput ? (
                  <>
                    <div className={styles.formGroupFull}>
                      <InputSelect
                        label="Sélectionner un client existant"
                        value={selectedClientId}
                        onChange={handleClientSelect}
                        options={[
                          { value: '', label: 'Aucun client sélectionné' },
                          ...mockClients.map(client => ({
                            value: client.id.toString(),
                            label: `${client.nom} - ${client.telephone}`
                          }))
                        ]}
                        placeholder="Choisir un client..."
                        icon={<IoPersonOutline />}
                        fullWidth
                        className={styles.formInputFull}
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <Button
                        variant="outline"
                        size="medium"
                        icon="plus"
                        onClick={handleToggleManualInput}
                        className={styles.manualInputBtn}
                        fullWidth
                      >
                        Entrer les informations manuellement
                      </Button>
                    </div>

                    {selectedClientId && (
                      <div className={styles.selectedClientInfo}>
                        <div className={styles.clientInfoItem}>
                          <strong>Nom:</strong> {clientName}
                        </div>
                        <div className={styles.clientInfoItem}>
                          <strong>Téléphone:</strong> {clientPhone}
                        </div>
                        <div className={styles.clientInfoItem}>
                          <strong>Adresse:</strong> {clientAddress}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className={styles.manualInputHeader}>
                      <span className={styles.manualInputTitle}>Saisie manuelle</span>
                      <Button
                        variant="ghost"
                        size="small"
                        icon="close"
                        onClick={handleToggleManualInput}
                        className={styles.backToSelectBtn}
                      >
                        Retour à la sélection
                      </Button>
                    </div>

                    <div className={styles.formRowCompact}>
                      <div className={styles.formGroupHalf}>
                        <Input
                          type="text"
                          label="Nom complet"
                          placeholder="Nom du client"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className={styles.formInputFull}
                          icon={<IoPersonOutline />}
                          fullWidth
                        />
                      </div>
                      <div className={styles.formGroupHalf}>
                        <Input
                          type="text"
                          label="Adresse"
                          placeholder="Adresse de livraison"
                          value={clientAddress}
                          onChange={(e) => setClientAddress(e.target.value)}
                          className={styles.formInputFull}
                          icon={<IoLocationOutline />}
                          fullWidth
                        />
                      </div>
                    </div>
                    <div className={styles.formRowCompact}>
                      <div className={styles.formGroupHalf}>
                        <Input
                          type="tel"
                          label="Téléphone"
                          placeholder="034 00 123 45"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className={styles.formInputHalf}
                          icon={<IoCallOutline />}
                          fullWidth
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.formGroupFull} style={{ marginTop: '1rem' }}>
                  <InputSelect
                    label="Mode de paiement"
                    value={paymentMethod}
                    onChange={setPaymentMethod}
                    options={[
                      { value: 'espèces', label: 'Espèces' },
                      { value: 'virement', label: 'Virement' },
                      { value: 'mvola', label: 'MVola' },
                      { value: 'airtelmoney', label: 'AirtelMoney' },
                      { value: 'orangemoney', label: 'OrangeMoney' },
                      { value: 'credit', label: 'Crédit' }
                    ]}
                    placeholder="Sélectionner..."
                    icon={<MdPayment />}
                    fullWidth
                    className={styles.formInputFull}
                    required
                  />
                </div>
              </div>

              <div className={styles.configSection}>
                <div className={styles.sectionHeader}>
                  <IoInformationCircleOutline className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Notes</h3>
                </div>
                <InputTextarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes pour la facture..."
                  rows={2}
                  fullWidth
                  helperText="Maximum 200 caractères"
                  showCharCount
                  maxLength={200}
                  className={styles.notesInputFull}
                />
              </div>
            </div>
          </div>

          {/* Colonne droite - Prévisualisation facture format petit papier */}
          <div className={styles.invoiceColumn}>
            <div className={styles.invoicePreviewContainer} ref={invoicePreviewRef}>
              <div className={styles.paperReceipt}>
                {/* Header avec informations entreprise */}
                <div className={styles.printHeader}>
                  <div className={styles.printCompanyName}>QUINCAILLERIE PRO</div>
                  <div className={styles.printCompanyDetails}>Ampitakely, Fianarantsoa 301</div>
                  <div className={styles.printCompanyDetails}>Tél: +261 34 00 123 45</div>
                  <div className={styles.printCompanyDetails}>NIF: 123456789 | STAT: 987654321</div>
                </div>

                {/* Titre FACTURE */}
                <div className={styles.printInvoiceTitle}>FACTURE</div>

                {/* Métadonnées facture */}
                <div className={styles.printInvoiceMeta}>
                  <div>
                    <div><strong>N°:</strong> FAC-{invoiceNumber}</div>
                    <div><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div>
                    <div><strong>Mode:</strong> {(() => {
                      const paymentLabels = {
                        'espèces': 'Espèces',
                        'virement': 'Virement',
                        'mvola': 'MVola',
                        'airtelmoney': 'AirtelMoney',
                        'orangemoney': 'OrangeMoney',
                        'credit': 'Crédit'
                      };
                      return paymentLabels[paymentMethod] || paymentMethod;
                    })()}</div>
                  </div>
                </div>

                {/* Informations client */}
                <div className={styles.printClientInfo}>
                  <div className={styles.printClientName}>{clientName || "Client non spécifié"}</div>
                  <div>{clientAddress || "Adresse non spécifiée"}</div>
                  <div>Tél: {clientPhone || "Non spécifié"}</div>
                </div>

                {/* Tableau des articles */}
                <table className={styles.printTable}>
                  <thead>
                    <tr>
                      <th className={styles.printTableItemName}>Article</th>
                      <th className={styles.printTableQty}>Qté</th>
                      <th className={styles.printTablePrice}>Prix</th>
                      <th className={styles.printTableTotal}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length > 0 ? (
                      cart.map((item, index) => (
                        <tr key={`${item.id}-${index}`}>
                          <td className={styles.printTableItemName}>{item.nom}</td>
                          <td className={styles.printTableQty}>{item.quantity}</td>
                          <td className={styles.printTablePrice}>{formatCurrency(item.price)}</td>
                          <td className={styles.printTableTotal}>{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '10px' }}>Aucun article</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Totaux */}
                <div className={styles.printTotals}>
                  <div className={styles.printTotalRow}>
                    <span>Sous-total:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className={styles.printTotalRow}>
                      <span>Remise:</span>
                      <span>- {formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className={styles.printTotalRow}>
                    <span>TVA (20%):</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className={`${styles.printTotalRow} ${styles.printTotalRowGrand}`}>
                    <span>TOTAL:</span>
                    <span>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                {/* Notes */}
                {notes && (
                  <div className={styles.printNotes}>
                    <strong>Notes:</strong><br />
                    {notes}
                  </div>
                )}

                {/* Informations paiement */}
                <div className={styles.printPaymentInfo}>
                  <div><strong>Mode de paiement:</strong> {(() => {
                    const paymentLabels = {
                      'espèces': 'ESPÈCES',
                      'virement': 'VIREMENT',
                      'mvola': 'MVOLA',
                      'airtelmoney': 'AIRTEL MONEY',
                      'orangemoney': 'ORANGE MONEY',
                      'credit': 'CRÉDIT'
                    };
                    return paymentLabels[paymentMethod] || paymentMethod.toUpperCase();
                  })()}</div>
                  {paymentMethod === 'credit' && (
                    <div><strong>Échéance:</strong> {(() => {
                      const dueDate = new Date();
                      dueDate.setDate(dueDate.getDate() + 14);
                      return dueDate.toLocaleDateString('fr-FR');
                    })()}</div>
                  )}
                </div>

                {/* Message de remerciement */}
                <div className={styles.printThankYou}>
                  Merci pour votre confiance !
                </div>

                {/* Footer */}
                <div className={styles.printFooter}>
                  <div>Cette facture est un document officiel</div>
                  <div>Imprimé le {new Date().toLocaleString('fr-FR')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions en bas */}
        <div className={styles.modalFooterFull}>
          <div className={styles.footerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Produits:</span>
              <span className={styles.statValue}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Montant:</span>
              <span className={styles.statValue}>{formatCurrency(grandTotal)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Statut:</span>
              <span className={styles.statValueStatus} data-status={paymentMethod}>
                {paymentMethod === 'credit' ? 'CRÉDIT' : 'PAYÉ'}
              </span>
            </div>
          </div>
          <div className={styles.footerActions}>
            <Button
              variant="outline"
              size="large"
              icon="back"
              onClick={onClose}
              className={styles.cancelBtnFull}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="large"
              icon="check"
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className={styles.confirmBtnFull}
            >
              Valider la Vente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;