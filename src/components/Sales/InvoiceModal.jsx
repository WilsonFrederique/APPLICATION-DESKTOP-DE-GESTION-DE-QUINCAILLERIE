import PropTypes from 'prop-types';
import React, { useState, useMemo, useCallback } from 'react';
import Input from '../../components/Input/Input';
import InputTextarea from '../../components/Input/InputTextarea';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

/* ─── Clients mock ─── */
const mockClients = [
  { id: 1, nom: 'SARL Batiment Plus', telephone: '+261 34 00 123 45', adresse: 'Analakely, Antananarivo 101' },
  { id: 2, nom: 'Entreprise Construction Pro', telephone: '+261 32 00 987 65', adresse: 'Ivandry, Antananarivo' },
  { id: 3, nom: 'Mr. Randria Jean-Pierre', telephone: '+261 33 00 456 78', adresse: 'Ambohibao, Antananarivo' },
  { id: 4, nom: 'Groupe Immobilier Pro', telephone: '+261 34 11 223 34', adresse: 'Ankorondrano, Antananarivo' },
  { id: 5, nom: 'SARL Materiaux Pro', telephone: '+261 32 11 334 45', adresse: 'Andraharo, Antananarivo' },
];

/* ─── Génération numéro facture ─── */
const generateInvoiceNumber = () => {
  const now = new Date();
  const today = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const lastDate = localStorage.getItem('lastInvoiceDate');
  let counter = lastDate === today ? (Number.parseInt(localStorage.getItem('invoiceCounter')) || 0) + 1 : 1;
  localStorage.setItem('invoiceCounter', counter.toString());
  localStorage.setItem('lastInvoiceDate', today);
  return `${today}${String(counter).padStart(3, '0')}`;
};

const PAYMENT_LABELS = {
  espèces: 'ESPÈCES',
  virement: 'VIREMENT',
  mvola: 'MVOLA',
  airtelmoney: 'AIRTEL MONEY',
  orangemoney: 'ORANGE MONEY',
  credit: 'CRÉDIT',
};

const getDueDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toLocaleDateString('fr-FR');
};

/* ══════════════════════════════════════════════
   INVOICE MODAL
══════════════════════════════════════════════ */
const InvoiceModal = ({ cart, onClose, onCompleteSale }) => {
  const [paymentMethod, setPaymentMethod] = useState('espèces');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);

  const invoiceNumber = useMemo(() => generateInvoiceNumber(), []);

  /* ── Calculs ── */
  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]);
  const paidAmount = useMemo(() => Math.min(Math.max(0, Number.parseInt(amountPaid) || 0), total), [amountPaid, total]);
  const restantAmount = useMemo(() => total - paidAmount, [total, paidAmount]);

  /* ── Client ── */
  const handleClientSelect = useCallback((clientId) => {
    if (clientId) {
      const c = mockClients.find(c => c.id === Number.parseInt(clientId));
      if (c) { setClientName(c.nom); setClientPhone(c.telephone); setClientAddress(c.adresse); setShowManualInput(false); }
    } else {
      setClientName(''); setClientPhone(''); setClientAddress('');
    }
    setSelectedClientId(clientId);
  }, []);

  const handleToggleManual = useCallback(() => {
    setShowManualInput(v => !v);
    if (!showManualInput) { setSelectedClientId(''); setClientName(''); setClientPhone(''); setClientAddress(''); }
  }, [showManualInput]);

  /* ── Copier numéro ── */
  const copyInvoiceNumber = () => {
    navigator.clipboard.writeText(`FAC-${invoiceNumber}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Valider vente ── */
  const handleCompleteSale = useCallback(() => {
    onCompleteSale({
      numero: `FAC-${invoiceNumber}`,
      client: { nom: clientName || 'Client non spécifié', telephone: clientPhone || '', adresse: clientAddress || '' },
      items: cart, total,
      ...(paymentMethod === 'credit' ? { amountPaid: paidAmount, restant: restantAmount } : {}),
      paymentMethod, notes,
      date: new Date().toISOString(),
      statut: paymentMethod === 'credit' ? 'credit' : 'paye',
    });
  }, [invoiceNumber, clientName, clientPhone, clientAddress, cart, total, paidAmount, restantAmount, paymentMethod, notes, onCompleteSale]);

  /* ── Impression ── */
  const handlePrint = () => {
    const creditLines = paymentMethod === 'credit' ? `
      <div class="tr" style="color:#059669;font-weight:600"><span>Montant payé :</span><span>${formatAr(paidAmount)}</span></div>
      <div class="tr" style="color:#e11d48;font-weight:700"><span>Restant dû :</span><span>${formatAr(restantAmount)}</span></div>
      <div style="font-size:8px;margin:3px 0"><b>Échéance :</b> ${getDueDate()}</div>
    ` : '';

    const html = `<!DOCTYPE html><html><head><title>Facture FAC-${invoiceNumber}</title><meta charset="UTF-8">
    <style>
      @page{size:80mm 297mm;margin:2mm}
      body{font-family:'Segoe UI',sans-serif;font-size:10px;line-height:1.3;color:#000;padding:5px;margin:0}
      .w{width:76mm;max-width:76mm;margin:0 auto}
      .hdr{text-align:center;border-bottom:1px solid #000;padding-bottom:5px;margin-bottom:5px}
      .cn{font-size:12px;font-weight:bold;margin:2px 0;text-transform:uppercase}
      .cd{font-size:8px;color:#555;margin:1px 0}
      .title{font-size:14px;font-weight:bold;text-align:center;margin:5px 0;text-transform:uppercase}
      .meta{display:flex;justify-content:space-between;font-size:8px;margin:5px 0;padding:3px 0;border-top:1px dashed #666;border-bottom:1px dashed #666}
      .cli{font-size:9px;margin:5px 0;padding:3px;background:#f5f5f5}
      table{width:100%;border-collapse:collapse;margin:5px 0;font-size:9px}
      th{background:#333;color:#fff;padding:3px;text-align:left;font-size:8px}
      td{padding:3px;border-bottom:1px solid #ddd}
      .tr{display:flex;justify-content:space-between;margin:2px 0;font-size:10px}
      .grand{font-weight:bold;font-size:11px;border-top:2px solid #000;padding-top:4px;margin-top:4px}
      .credit-block{margin-top:5px;padding-top:4px;border-top:1px dashed #ccc}
      .pay{font-size:8px;margin:5px 0;padding:3px;background:#f5f5f5}
      .ftr{text-align:center;margin-top:10px;padding-top:5px;border-top:1px solid #000;font-size:8px;color:#555}
    </style></head>
    <body onload="window.print()"><div class="w">
      <div class="hdr"><div class="cn">QUINCAILLERIE PRO</div><div class="cd">Ampitakely, Fianarantsoa 301</div><div class="cd">Tél: +261 34 00 123 45</div><div class="cd">NIF: 123456789 | STAT: 987654321</div></div>
      <div class="title">FACTURE</div>
      <div class="meta"><div><div><b>N°:</b> FAC-${invoiceNumber}</div><div><b>Date:</b> ${new Date().toLocaleDateString('fr-FR')}</div></div><div><b>Mode:</b> ${PAYMENT_LABELS[paymentMethod]}</div></div>
      <div class="cli"><b>${clientName || 'Client non spécifié'}</b><div>${clientAddress || ''}</div><div>Tél: ${clientPhone || ''}</div></div>
      <table><thead><tr><th style="width:40%">Article</th><th style="width:15%;text-align:center">Qté</th><th style="width:20%;text-align:right">Prix</th><th style="width:25%;text-align:right">Total</th></tr></thead>
      <tbody>${cart.map(i => `<tr><td>${i.nom}</td><td style="text-align:center">${i.quantity}</td><td style="text-align:right">${formatAr(i.price)}</td><td style="text-align:right;font-weight:bold">${formatAr(i.price * i.quantity)}</td></tr>`).join('')}</tbody></table>
      <div>
        <div class="tr grand"><span>TOTAL :</span><span>${formatAr(total)}</span></div>
        ${paymentMethod === 'credit' ? `<div class="credit-block">${creditLines}</div>` : ''}
      </div>
      ${notes ? `<div style="margin:5px 0;padding:3px;border:1px dashed #666;font-size:8px;font-style:italic"><b>Notes:</b><br>${notes}</div>` : ''}
      <div class="pay"><b>Mode de paiement:</b> ${PAYMENT_LABELS[paymentMethod]}</div>
      <div style="font-style:italic;margin:5px 0;font-size:9px;text-align:center">Merci pour votre confiance !</div>
      <div class="ftr"><div>Cette facture est un document officiel</div><div>Imprimé le ${new Date().toLocaleString('fr-FR')}</div></div>
    </div></body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank', 'width=800,height=600');
    if (!win) { alert("Veuillez autoriser les popups pour imprimer."); URL.revokeObjectURL(url); return; }
    win.addEventListener('afterprint', () => URL.revokeObjectURL(url));
  };

  /* ────────────────── JSX ────────────────── */
  return (
    <div className="fixed inset-0 bg-slate-800 z-10000 flex items-center justify-center overflow-hidden">
      <div className="w-screen h-screen bg-white flex flex-col">

        {/* ── Header ── */}
        <div className="bg-slate-800 px-6 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-sky-400">
                <Bx icon="receipt" className="text-2xl" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-tight">Validation de la Vente</h1>
                <p className="text-xs text-white/60">Facture format petit papier</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type='button'
                onClick={copyInvoiceNumber}
                className="relative flex items-center gap-2 bg-white/10 border border-sky-400/30 rounded px-3 py-2 cursor-pointer hover:bg-white/20 transition-all"
              >
                <span className="text-xs text-white/70 font-medium">N° Facture :</span>
                <span className="text-sm font-bold text-white tracking-wide">FAC-{invoiceNumber}</span>
                <Bx icon="copy" className="text-sm text-white/60" />
                {copied && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                    Copié !
                  </span>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500/20 border border-sky-400/40 text-white text-sm font-semibold rounded hover:bg-sky-500/30 transition-all"
              >
                <Bx icon="printer" className="text-base" /> Imprimer
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center bg-white/10 border border-white/20 text-white rounded hover:bg-white/20 transition-all"
              >
                <Bx icon="x" className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden min-h-0 bg-slate-50">

          {/* ── Left: config ── */}
          <div className="w-[45%] min-w-[320px] border-r border-slate-200 bg-white overflow-y-auto p-5 flex flex-col gap-4">

            {/* Client */}
            <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-sky-50 rounded flex items-center justify-center text-sky-500">
                  <Bx icon="user" className="text-lg" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Client</h3>
              </div>

              {showManualInput ? (
                <>
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                    <span className="text-sm font-semibold text-sky-600 flex items-center gap-1.5">
                      <Bx icon="edit" className="text-base" /> Saisie manuelle
                    </span>
                    <button
                      onClick={handleToggleManual}
                      className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 rounded px-2 py-1 hover:bg-slate-50 transition-all"
                    >
                      <Bx icon="arrow-back" className="text-sm" /> Retour à la sélection
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input type="text" label="Nom complet" placeholder="Nom du client" value={clientName} onChange={(e) => setClientName(e.target.value)} icon={<Bx icon="user" className="text-lg" />} fullWidth />
                    <Input type="text" label="Adresse" placeholder="Adresse" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} icon={<Bx icon="map" className="text-lg" />} fullWidth />
                  </div>
                  <Input type="tel" label="Téléphone" placeholder="034 00 123 45" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} icon={<Bx icon="phone" className="text-lg" />} fullWidth />
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor='Client' className="block text-sm font-medium text-slate-600 mb-1">Sélectionner un client existant</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => handleClientSelect(e.target.value)}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                    >
                      <option value="">Aucun client sélectionné</option>
                      {mockClients.map(c => (
                        <option key={c.id} value={c.id.toString()}>{c.nom} — {c.telephone}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleToggleManual}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-slate-300 bg-slate-50 text-slate-500 text-sm font-semibold rounded hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all"
                  >
                    <Bx icon="plus" className="text-base" /> Entrer les informations manuellement
                  </button>

                  {selectedClientId && (
                    <div className="mt-3 p-3 bg-sky-50 border border-sky-200 border-l-4 border-l-sky-500 rounded">
                      {[['Nom', clientName], ['Téléphone', clientPhone], ['Adresse', clientAddress]].map(([label, value]) => (
                        <p key={label} className="text-sm text-slate-800 mb-1 last:mb-0">
                          <span className="font-semibold text-sky-600">{label} :</span> {value}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Paiement */}
            <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-emerald-50 rounded flex items-center justify-center text-emerald-600">
                  <Bx icon="credit-card" className="text-lg" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Mode de paiement</h3>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'espèces', label: 'Espèces', icon: 'money' },
                  { value: 'virement', label: 'Virement', icon: 'transfer-alt' },
                  { value: 'mvola', label: 'MVola', icon: 'mobile-alt' },
                  { value: 'airtelmoney', label: 'Airtel Money', icon: 'mobile' },
                  { value: 'orangemoney', label: 'Orange Money', icon: 'mobile-vibration' },
                  { value: 'credit', label: 'Crédit', icon: 'time' },
                ].map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => { setPaymentMethod(value); if (value !== 'credit') setAmountPaid(''); }}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded border text-xs font-semibold transition-all cursor-pointer ${paymentMethod === value
                        ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50'
                      }`}
                  >
                    <Bx icon={icon} className="text-xl" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Champ montant payé — uniquement pour crédit */}
              {paymentMethod === 'credit' && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded flex items-center gap-2">
                    <Bx icon="info-circle" className="text-amber-500 text-lg shrink-0" />
                    <p className="text-xs text-amber-700 font-medium">
                      Échéance dans 14 jours — {getDueDate()}
                    </p>
                  </div>

                  <label htmlFor='montant' className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Montant payé maintenant <span className="text-slate-400 font-normal">(Ar)</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    placeholder="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full border border-slate-200 rounded px-3 py-2.5 text-base font-semibold text-slate-800 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100"
                  />

                  {/* Récap payé / restant */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-center">
                      <p className="text-xs text-emerald-600 font-medium mb-0.5">Payé</p>
                      <p className="text-sm font-bold text-emerald-700">{formatAr(paidAmount)}</p>
                    </div>
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-center">
                      <p className="text-xs text-rose-600 font-medium mb-0.5">Restant dû</p>
                      <p className="text-sm font-bold text-rose-700">{formatAr(restantAmount)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500">
                  <Bx icon="note" className="text-lg" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Notes</h3>
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
              />
            </div>
          </div>

          {/* ── Right: invoice preview ── */}
          <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col items-center py-6 px-4">
            <div
              className="bg-white shadow-lg border border-slate-200"
              style={{ width: 420, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", fontSize: 13, lineHeight: 1.5, color: '#000', padding: 16 }}
            >
              {/* En-tête entreprise */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: 8, marginBottom: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase', margin: '3px 0' }}>QUINCAILLERIE PRO</div>
                <div style={{ fontSize: 11, color: '#555', margin: '2px 0' }}>Ampitakely, Fianarantsoa 301</div>
                <div style={{ fontSize: 11, color: '#555', margin: '2px 0' }}>Tél: +261 34 00 123 45</div>
                <div style={{ fontSize: 11, color: '#555', margin: '2px 0' }}>NIF: 123456789 | STAT: 987654321</div>
              </div>

              {/* Titre */}
              <div style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', margin: '8px 0', textTransform: 'uppercase' }}>FACTURE</div>

              {/* Méta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, margin: '8px 0', padding: '5px 0', borderTop: '1px dashed #666', borderBottom: '1px dashed #666' }}>
                <div>
                  <div><strong>N° :</strong> FAC-{invoiceNumber}</div>
                  <div><strong>Date :</strong> {new Date().toLocaleDateString('fr-FR')}</div>
                </div>
                <div><strong>Mode :</strong> {PAYMENT_LABELS[paymentMethod]}</div>
              </div>

              {/* Client */}
              <div style={{ fontSize: 12, margin: '8px 0', padding: 6, background: '#f5f5f5' }}>
                <div style={{ fontWeight: 'bold', marginBottom: 2 }}>{clientName || 'Client non spécifié'}</div>
                <div>{clientAddress || 'Adresse non spécifiée'}</div>
                <div>Tél : {clientPhone || 'Non spécifié'}</div>
              </div>

              {/* Tableau articles */}
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '8px 0', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ background: '#333', color: '#fff', padding: 5, textAlign: 'left', fontSize: 11, width: '40%' }}>Article</th>
                    <th style={{ background: '#333', color: '#fff', padding: 5, textAlign: 'center', fontSize: 11, width: '15%' }}>Qté</th>
                    <th style={{ background: '#333', color: '#fff', padding: 5, textAlign: 'right', fontSize: 11, width: '20%' }}>Prix</th>
                    <th style={{ background: '#333', color: '#fff', padding: 5, textAlign: 'right', fontSize: 11, width: '25%' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? cart.map((item, idx) => (
                    <tr key={`${item.id}-${idx}`}>
                      <td style={{ padding: 5, borderBottom: '1px solid #ddd' }}>{item.nom}</td>
                      <td style={{ padding: 5, borderBottom: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: 5, borderBottom: '1px solid #ddd', textAlign: 'right' }}>{formatAr(item.price)}</td>
                      <td style={{ padding: 5, borderBottom: '1px solid #ddd', textAlign: 'right', fontWeight: 'bold' }}>{formatAr(item.price * item.quantity)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ padding: 14, textAlign: 'center', color: '#999' }}>Aucun article</td></tr>
                  )}
                </tbody>
              </table>

              {/* Totaux */}
              <div style={{ margin: '10px 0', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 15, borderTop: '2px solid #000', paddingTop: 6, marginTop: 6 }}>
                  <span>TOTAL :</span><span>{formatAr(total)}</span>
                </div>

                {/* Bloc crédit — montant payé + restant */}
                {paymentMethod === 'credit' && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed #bbb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', color: '#059669', fontWeight: 600, fontSize: 13 }}>
                      <span>Montant payé :</span><span>{formatAr(paidAmount)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '3px 0', color: '#e11d48', fontWeight: 700, fontSize: 14 }}>
                      <span>Restant dû :</span><span>{formatAr(restantAmount)}</span>
                    </div>
                    <div style={{ margin: '5px 0', fontSize: 11, color: '#777' }}>
                      <strong>Échéance :</strong> {getDueDate()}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              {notes && (
                <div style={{ margin: '8px 0', padding: 5, border: '1px dashed #666', fontSize: 11, fontStyle: 'italic' }}>
                  <strong>Notes :</strong><br />{notes}
                </div>
              )}

              {/* Mode de paiement */}
              <div style={{ fontSize: 11, margin: '8px 0', padding: 5, background: '#f5f5f5' }}>
                <strong>Mode de paiement :</strong> {PAYMENT_LABELS[paymentMethod]}
              </div>

              {/* Remerciement */}
              <div style={{ fontStyle: 'italic', margin: '8px 0', fontSize: 12, textAlign: 'center' }}>
                Merci pour votre confiance !
              </div>

              {/* Pied de page */}
              <div style={{ textAlign: 'center', marginTop: 12, paddingTop: 8, borderTop: '1px solid #000', fontSize: 11, color: '#555' }}>
                <div>Cette facture est un document officiel</div>
                <div>Imprimé le {new Date().toLocaleString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 shrink-0 flex items-center justify-between">

          {/* Stats */}
          <div className="flex items-center gap-6">
            {[
              { label: 'Produits', value: cart.reduce((s, i) => s + i.quantity, 0) },
              { label: 'Total', value: formatAr(total) },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">{label} :</span>
                <span className="text-base font-bold text-slate-800">{value}</span>
              </div>
            ))}
            {paymentMethod === 'credit' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 font-medium">Restant :</span>
                <span className="text-base font-bold text-rose-600">{formatAr(restantAmount)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Statut :</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded uppercase tracking-wide ${paymentMethod === 'credit'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                {paymentMethod === 'credit' ? 'CRÉDIT' : 'PAYÉ'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 text-sm font-semibold rounded hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Bx icon="arrow-back" className="text-base" /> Annuler
            </button>
            <button
              onClick={handleCompleteSale}
              disabled={cart.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded shadow-sm shadow-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] cursor-pointer"
            >
              <Bx icon="check-circle" className="text-base" /> Valider la Vente
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

InvoiceModal.propTypes = {
  cart: PropTypes.array,
  onClose: PropTypes.func,
  onCompleteSale: PropTypes.func,
}

export default InvoiceModal;