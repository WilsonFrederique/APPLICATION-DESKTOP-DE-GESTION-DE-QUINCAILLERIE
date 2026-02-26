import React, { useState, useMemo, useRef } from 'react';
import styles from './InvoiceModal.module.css';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import InputTextarea from '../../../components/Input/InputTextarea';
import InputSelect from '../../../components/Input/InputSelect';
import { 
  IoPersonOutline,
  IoCallOutline,
  IoLocationOutline,
  IoInformationCircleOutline,
  IoCartOutline,
  IoCloseOutline,
  IoPrintOutline
} from "react-icons/io5";
import { 
  MdPayment,
  MdOutlineSell,
  MdOutlineStorefront,
  MdPrint,
  MdReceiptLong
} from "react-icons/md";
import { 
  FaPercentage,
  FaTruck,
  FaStore,
  FaRegCopy
} from "react-icons/fa";
import { 
  TbTruckDelivery,
  TbReceipt,
  TbCopy
} from "react-icons/tb";

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
  const [deliveryStatus, setDeliveryStatus] = useState('livre');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  
  const invoicePreviewRef = useRef(null);
  const invoiceNumber = useMemo(() => generateInvoiceNumber(), []);
  
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return Math.max(0, subtotal - discount);
  };
  
  const calculateTax = () => {
    return Math.round(calculateTotal() * 0.2);
  };
  
  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(`FAC-${invoiceNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleCompleteSale = () => {
    if (!clientName.trim()) {
      alert('Veuillez saisir le nom du client');
      return;
    }
    
    const invoiceData = {
      numero: `FAC-${invoiceNumber}`,
      client: {
        nom: clientName,
        telephone: clientPhone,
        adresse: clientAddress
      },
      items: cart,
      subtotal: calculateSubtotal(),
      discount,
      total: calculateTotal(),
      tax: calculateTax(),
      grandTotal: calculateGrandTotal(),
      paymentMethod,
      deliveryStatus,
      notes,
      date: new Date().toISOString(),
      statut: paymentMethod === 'credit' ? 'credit' : 'paye'
    };
    
    onCompleteSale(invoiceData);
  };
  
  const handlePrintInvoice = () => {
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
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
            .table .item-name {
              width: 40%;
            }
            .table .item-qty {
              width: 15%;
              text-align: center;
            }
            .table .item-price {
              width: 20%;
              text-align: right;
            }
            .table .item-total {
              width: 25%;
              text-align: right;
              font-weight: bold;
            }
            .totals {
              margin: 8px 0;
              font-size: 10px;
            }
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
            }
            .notes {
              margin: 5px 0;
              padding: 3px;
              border: 1px dashed #666;
              font-size: 8px;
              font-style: italic;
            }
            .separator {
              text-align: center;
              margin: 10px 0;
              opacity: 0.5;
            }
            .bank-info {
              font-size: 7px;
              margin: 5px 0;
              padding: 3px;
              border-top: 1px dashed #666;
              border-bottom: 1px dashed #666;
            }
            .signature {
              margin-top: 20px;
              text-align: center;
            }
            .signature-line {
              width: 60%;
              height: 1px;
              background: #000;
              margin: 15px auto 5px;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .invoice-print { width: 76mm; }
            }
          </style>
        </head>
        <body>
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
                <div><strong>Livraison:</strong> ${deliveryStatus === 'livre' ? 'Livrée' : 'Retrait'}</div>
              </div>
            </div>
            
            <div class="client-info">
              <div class="client-name">${clientName || "Non spécifié"}</div>
              <div>${clientAddress || "Adresse non spécifiée"}</div>
              <div>Tél: ${clientPhone || "Non spécifié"}</div>
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
                <span>${formatCurrency(calculateSubtotal())}</span>
              </div>
              ${discount > 0 ? `
                <div class="total-row">
                  <span>Remise:</span>
                  <span>- ${formatCurrency(discount)}</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span>TVA (20%):</span>
                <span>${formatCurrency(calculateTax())}</span>
              </div>
              <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>${formatCurrency(calculateGrandTotal())}</span>
              </div>
            </div>
            
            ${notes ? `
              <div class="notes">
                <strong>Notes:</strong><br>
                ${notes}
              </div>
            ` : ''}
            
            <div class="payment-info">
              <div><strong>Mode de paiement:</strong> ${paymentMethod.toUpperCase()}</div>
              <div><strong>Échéance:</strong> ${(() => {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 14);
                return dueDate.toLocaleDateString('fr-FR');
              })()}</div>
            </div>
            
            <div class="bank-info">
              <strong>Coordonnées bancaires:</strong><br>
              BNI Madagascar - IBAN: MG46 0000 5010 0101 2345 6789 012
            </div>
            
            <div class="signature">
              <div class="signature-line"></div>
              <div>Signature et cachet</div>
            </div>
            
            <div class="separator">***</div>
            
            <div class="thank-you">Merci pour votre confiance !</div>
            
            <div class="footer">
              <div>Cette facture est un document officiel</div>
              <div>Imprimé le ${new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 250);
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
                <div className={styles.formRowCompact}>
                  <div className={styles.formGroupHalf}>
                    <Input
                        type="text"
                        label="Nom complet"
                        placeholder="Nom du client"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
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
                  <div className={styles.formGroupHalf}>
                        <InputSelect
                            label="Mode paiement"
                            value={paymentMethod}
                            onChange={setPaymentMethod} // Notez que InputSelect passe directement la valeur
                            options={[
                            { value: 'espèces', label: 'Espèces' },
                            { value: 'virement', label: 'Virement' },
                            { value: 'mvola', label: 'MVola' },
                            { value: 'credit', label: 'Crédit' }
                            ]}
                            placeholder="Sélectionner..."
                            icon={<MdPayment />}
                            fullWidth
                            className={styles.formInputHalf}
                            required
                        />
                    </div>
                </div>
              </div>
              
              <div className={styles.configSection}>
                <div className={styles.sectionHeader}>
                  <FaPercentage className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Montants</h3>
                </div>
                <div className={styles.amountsGrid}>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>Sous-total:</span>
                    <span className={styles.amountValue}>{formatCurrency(calculateSubtotal())}</span>
                  </div>
                  <div className={styles.formGroupFull}>
                    <Input
                      type="number"
                      label="Remise (MGA)"
                      placeholder="0"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                      min="0"
                      max={calculateSubtotal()}
                      className={styles.discountInputFull}
                      icon={<FaPercentage />}
                      fullWidth
                    />
                  </div>
                  <div className={styles.amountItem}>
                    <span className={styles.amountLabel}>TVA (20%):</span>
                    <span className={styles.amountValue}>{formatCurrency(calculateTax())}</span>
                  </div>
                  <div className={styles.amountItemTotal}>
                    <span className={styles.amountLabelTotal}>Total TTC:</span>
                    <span className={styles.amountValueTotal}>{formatCurrency(calculateGrandTotal())}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.configSection}>
                <div className={styles.sectionHeader}>
                  <TbTruckDelivery className={styles.sectionIcon} />
                  <h3 className={styles.sectionTitle}>Livraison</h3>
                </div>
                <div className={styles.deliveryOptions}>
                  <Button 
                    variant={deliveryStatus === 'livre' ? 'primary' : 'outline'}
                    size="small"
                    icon="truck"
                    onClick={() => setDeliveryStatus('livre')}
                    className={styles.deliveryOptionBtn}
                    fullWidth
                  >
                    Livraison
                  </Button>
                  <Button 
                    variant={deliveryStatus === 'non_livre' ? 'primary' : 'outline'}
                    size="small"
                    icon="store"
                    onClick={() => setDeliveryStatus('non_livre')}
                    className={styles.deliveryOptionBtn}
                    fullWidth
                  >
                    Retrait
                  </Button>
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
                  rows={3}
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
            <div className={styles}>
              <div className={styles.invoicePreviewContainer} ref={invoicePreviewRef}>
                <div className={styles.paperReceipt}>
                  {/* En-tête de la facture */}
                  <div className={styles.receiptHeader}>
                    <div className={styles.companyHeader}>
                      <h2 className={styles.companyName}>QUINCAILLERIE PRO</h2>
                      <p className={styles.companyDetails}>Ampitakely, Fianarantsoa 301</p>
                      <p className={styles.companyDetails}>Tél: +261 34 00 123 45</p>
                      <p className={styles.companyDetails}>NIF: 123456789 | STAT: 987654321</p>
                    </div>
                    
                    <div className={styles.invoiceTitleSection}>
                      <h1 className={styles.invoiceTitle}>FACTURE</h1>
                      <div className={styles.invoiceNumber}>
                        N°: <strong>FAC-{invoiceNumber}</strong>
                      </div>
                    </div>
                    
                    <div className={styles.invoiceMeta}>
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Date:</span>
                        <span className={styles.metaValue}>{new Date().toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Paiement:</span>
                        <span className={styles.metaValue}>{paymentMethod}</span>
                      </div>
                      <div className={styles.metaRow}>
                        <span className={styles.metaLabel}>Livraison:</span>
                        <span className={styles.metaValue}>
                          {deliveryStatus === 'livre' ? 'Livrée' : 'Retrait magasin'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Informations client */}
                  <div className={styles.clientSection}>
                    <div className={styles.clientHeader}>
                      <IoPersonOutline className={styles.clientIcon} />
                      <span className={styles.clientTitle}>CLIENT</span>
                    </div>
                    <div className={styles.clientInfo}>
                      <div className={styles.clientName}>{clientName || "Client non spécifié"}</div>
                      <div className={styles.clientDetail}>{clientAddress || "Adresse non spécifiée"}</div>
                      <div className={styles.clientDetail}>Tél: {clientPhone || "Non spécifié"}</div>
                    </div>
                  </div>
                  
                  {/* Tableau des articles avec scroll */}
                  <div className={styles.itemsTableContainer}>
                    <div className={styles.itemsTableHeader}>
                      <div className={styles.tableHeaderCell} style={{ width: '45%' }}>ARTICLE</div>
                      <div className={styles.tableHeaderCell} style={{ width: '15%' }}>QTÉ</div>
                      <div className={styles.tableHeaderCell} style={{ width: '20%' }}>PRIX U.</div>
                      <div className={styles.tableHeaderCell} style={{ width: '20%' }}>TOTAL</div>
                    </div>
                    
                    <div className={styles.itemsTableBody}>
                      {cart.length > 0 ? (
                        cart.map((item, index) => (
                          <div key={`${item.id}-${index}`} className={styles.itemRow}>
                            <div className={styles.itemCell} style={{ width: '45%' }}>
                              <div className={styles.itemName}>{item.nom}</div>
                            </div>
                            <div className={styles.itemCell} style={{ width: '15%' }}>
                              <div className={styles.itemQty}>{item.quantity}</div>
                            </div>
                            <div className={styles.itemCell} style={{ width: '20%' }}>
                              <div className={styles.itemPrice}>{formatCurrency(item.price)}</div>
                            </div>
                            <div className={styles.itemCell} style={{ width: '20%' }}>
                              <div className={styles.itemTotal}>{formatCurrency(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.emptyCart}>
                          <IoCartOutline />
                          <p>Aucun article</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Totaux */}
                  <div className={styles.totalsSection}>
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>Sous-total:</span>
                      <span className={styles.totalValue}>{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Remise:</span>
                        <span className={styles.totalValueDiscount}>- {formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <div className={styles.totalRow}>
                      <span className={styles.totalLabel}>TVA (20%):</span>
                      <span className={styles.totalValue}>{formatCurrency(calculateTax())}</span>
                    </div>
                    
                    <div className={styles.totalRowGrand}>
                      <span className={styles.totalLabelGrand}>TOTAL TTC:</span>
                      <span className={styles.totalValueGrand}>{formatCurrency(calculateGrandTotal())}</span>
                    </div>
                  </div>
                  
                  {/* Informations supplémentaires */}
                  <div className={styles.infoSection}>
                    <div className={styles.paymentInfo}>
                      <div className={styles.infoLabel}>Mode de paiement:</div>
                      <div className={styles.infoValue}>{paymentMethod.toUpperCase()}</div>
                    </div>
                    
                    {notes && (
                      <div className={styles.notesSection}>
                        <div className={styles.infoLabel}>Notes:</div>
                        <div className={styles.notesText}>{notes}</div>
                      </div>
                    )}
                    
                    <div className={styles.bankInfo}>
                      <div className={styles.infoLabel}>Coordonnées bancaires:</div>
                      <div className={styles.bankDetails}>
                        BNI Madagascar - IBAN: MG46 0000 5010 0101 2345 6789 012
                      </div>
                    </div>
                  </div>
                  
                  {/* Pied de page */}
                  <div className={styles.receiptFooter}>
                    <div className={styles.signature}>
                      <div className={styles.signatureLine}></div>
                      <div className={styles.signatureText}>Signature et cachet</div>
                    </div>
                    
                    <div className={styles.thankYou}>
                      <p>Merci pour votre confiance !</p>
                    </div>
                    
                    <div className={styles.footerDetails}>
                      <div>Facture générée le {new Date().toLocaleString('fr-FR')}</div>
                      <div className={styles.pageIndicator}>1/1</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions en bas */}
        <div className={styles.modalFooterFull}>
          <div className={styles.footerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Articles:</span>
              <span className={styles.statValue}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Montant:</span>
              <span className={styles.statValue}>{formatCurrency(calculateGrandTotal())}</span>
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
              disabled={cart.length === 0 || !clientName.trim()}
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