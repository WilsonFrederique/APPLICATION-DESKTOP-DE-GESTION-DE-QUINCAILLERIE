import React, { useState, useMemo } from 'react';
import Input from '../../components/Input/Input';
import InputSelect from '../../components/Input/InputSelect';
import CategoryCarousel from '../../components/Sales/CategoryCarousel';
import CommandModal from '../../components/Command/CommandModal';
import Bx from '../../components/UI/Boxicon';
import { formatAr } from '../../utils/function/format';

/* ─── Statuts ─── */
const STATUT_CONFIG = {
    en_attente: { label: 'En attente', pill: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', border: 'border-l-amber-400', icon: 'time' },
    confirmee: { label: 'Confirmée', pill: 'bg-sky-100 text-sky-700', bar: 'bg-sky-400', border: 'border-l-sky-400', icon: 'check-circle' },
    livree: { label: 'Livrée', pill: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', border: 'border-l-emerald-500', icon: 'package' },
    annulee: { label: 'Annulée', pill: 'bg-red-100 text-red-700', bar: 'bg-red-400', border: 'border-l-red-400', icon: 'x-circle' },
};

/* ─── Données mock fournisseurs ─── */
const mockFournisseurs = [
    { id: 1, nom: 'SARL Import Ciment Pro' },
    { id: 2, nom: 'Quincaillerie Centrale' },
    { id: 3, nom: 'Ferronnerie du Nord' },
    { id: 4, nom: 'Peintures & Déco Malagasy' },
];

/* ─── Données mock commandes ─── */
const initialCommandes = [
    {
        id: 1, reference: 'CMD-001', fournisseurId: 1, fournisseurNom: 'SARL Import Ciment Pro',
        dateCommande: '2024-03-01', dateLivraison: '2024-03-05', statut: 'livree',
        lignes: [{ id: 1, produit: 'Ciment 50kg', quantite: 50, prixUnitaire: 35000, unite: 'sac' }],
        total: 1750000, note: '',
    },
    {
        id: 2, reference: 'CMD-002', fournisseurId: 3, fournisseurNom: 'Ferronnerie du Nord',
        dateCommande: '2024-03-10', dateLivraison: '2024-03-15', statut: 'confirmee',
        lignes: [
            { id: 1, produit: 'Tôle Galvanisée 3m', quantite: 20, prixUnitaire: 250000, unite: 'feuille' },
            { id: 2, produit: 'Vis à Bois 5x50', quantite: 5000, prixUnitaire: 150, unite: 'pièce' },
        ],
        total: 5750000, note: 'Livraison en deux fois',
    },
    {
        id: 3, reference: 'CMD-003', fournisseurId: 4, fournisseurNom: 'Peintures & Déco Malagasy',
        dateCommande: '2024-03-12', dateLivraison: '', statut: 'en_attente',
        lignes: [{ id: 1, produit: 'Peinture Blanche 10L', quantite: 30, prixUnitaire: 80000, unite: 'pot' }],
        total: 2400000, note: '',
    },
    {
        id: 4, reference: 'CMD-004', fournisseurId: 2, fournisseurNom: 'Quincaillerie Centrale',
        dateCommande: '2024-02-20', dateLivraison: '2024-02-25', statut: 'annulee',
        lignes: [{ id: 1, produit: 'Clous 3cm', quantite: 100, prixUnitaire: 5000, unite: 'kg' }],
        total: 500000, note: 'Rupture fournisseur',
    },
];

/* ─── Détail commande panel ─── */
const DetailPanel = ({ commande, onClose, onEdit }) => {
    const cfg = STATUT_CONFIG[commande.statut];

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-md bg-white rounded shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-slate-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="receipt" className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white">{commande.reference}</h3>
                            <p className="text-xs text-white/60 mt-0.5">{commande.fournisseurNom}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-white border border-white/10 transition-all">
                        <Bx icon="x" className="text-base" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Statut + dates */}
                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold ${cfg.pill}`}>
                            <Bx icon={cfg.icon} className="text-base" /> {cfg.label}
                        </span>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Commandé le {commande.dateCommande}</p>
                            {commande.dateLivraison && (
                                <p className="text-xs text-slate-400">Livraison le {commande.dateLivraison}</p>
                            )}
                        </div>
                    </div>

                    {/* Articles */}
                    <div className="bg-slate-50 border border-slate-200 rounded overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Articles</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {commande.lignes.map((l, i) => (
                                <div key={i} className="px-4 py-2.5 flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{l.produit}</p>
                                        <p className="text-xs text-slate-400">{l.quantite} × {formatAr(l.prixUnitaire)}</p>
                                    </div>
                                    <span className="text-sm font-bold text-slate-800 whitespace-nowrap">{formatAr(l.quantite * l.prixUnitaire)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="px-4 py-2.5 border-t border-slate-200 bg-white flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-500">Total</span>
                            <span className="text-lg font-black text-slate-800">{formatAr(commande.total)}</span>
                        </div>
                    </div>

                    {/* Note */}
                    {commande.note && (
                        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded">
                            <Bx icon="note" className="text-base text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">{commande.note}</p>
                        </div>
                    )}

                    {/* Bouton modifier */}
                    <button
                        onClick={() => { onClose(); onEdit(commande); }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                    >
                        <Bx icon="edit" className="text-base" /> Modifier cette commande
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════
   COMMANDES
══════════════════════════════════════════════ */
const Commands = () => {
    const [commandes, setCommandes] = useState(initialCommandes);
    const [searchTerm, setSearchTerm] = useState('');
    const [statutFilter, setStatutFilter] = useState('all');
    const [selectedFourn, setSelectedFourn] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingCommande, setEditingCommande] = useState(null);
    const [detailCommande, setDetailCommande] = useState(null);

    /* ── Catégories carousel = fournisseurs ── */
    const fournisseurNames = useMemo(() =>
        [...new Set(commandes.map(c => c.fournisseurNom))].sort(),
        [commandes]);

    const commandeCounts = useMemo(() => {
        const counts = { total: commandes.length };
        fournisseurNames.forEach(n => { counts[n] = commandes.filter(c => c.fournisseurNom === n).length; });
        return counts;
    }, [commandes, fournisseurNames]);

    const filtered = useMemo(() => {
        let list = [...commandes];
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(c =>
                c.reference.toLowerCase().includes(q) ||
                c.fournisseurNom.toLowerCase().includes(q) ||
                c.lignes.some(l => l.produit.toLowerCase().includes(q))
            );
        }
        if (statutFilter !== 'all') list = list.filter(c => c.statut === statutFilter);
        if (selectedFourn !== 'all') list = list.filter(c => c.fournisseurNom === selectedFourn);
        return list.sort((a, b) => b.dateCommande.localeCompare(a.dateCommande));
    }, [commandes, searchTerm, statutFilter, selectedFourn]);

    const stats = useMemo(() => ({
        total: commandes.length,
        en_attente: commandes.filter(c => c.statut === 'en_attente').length,
        confirmee: commandes.filter(c => c.statut === 'confirmee').length,
        livree: commandes.filter(c => c.statut === 'livree').length,
        annulee: commandes.filter(c => c.statut === 'annulee').length,
        totalValeur: commandes.filter(c => c.statut !== 'annulee').reduce((s, c) => s + c.total, 0),
    }), [commandes]);

    const handleSave = (data) => {
        if (editingCommande) {
            setCommandes(prev => prev.map(c => c.id === data.id ? data : c));
        } else {
            setCommandes(prev => [data, ...prev]);
        }
        setShowModal(false);
        setEditingCommande(null);
    };

    const handleEdit = (c) => { setEditingCommande(c); setShowModal(true); };
    const handleDelete = (c) => {
        if (globalThis.confirm?.(`Supprimer la commande "${c.reference}" ?`))
            setCommandes(prev => prev.filter(x => x.id !== c.id));
    };

    return (
        <div className="flex flex-col overflow-hidden bg-transparent h-full">
            <div className="grid grid-cols-[1fr_340px] gap-3 h-full p-3 overflow-hidden">

                {/* ══ Colonne gauche ══ */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col gap-3 px-4 pt-3 border-b border-slate-100 shrink-0">
                        <div className="flex items-start justify-between gap-3">
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">Gestion des Commandes</h2>
                            <button
                                onClick={() => { setEditingCommande(null); setShowModal(true); }}
                                className="flex items-center gap-2 px-4 h-11 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded transition-all whitespace-nowrap"
                            >
                                <Bx icon="plus" className="text-lg" /> Nouvelle commande
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Input
                                    type="text"
                                    placeholder="Rechercher par référence, fournisseur, article…"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    name="cmdSearch"
                                    icon={<Bx icon="search" className="text-lg" />}
                                    fullWidth
                                />
                            </div>
                            <div className="w-44 shrink-0">
                                <InputSelect
                                    value={statutFilter}
                                    onChange={setStatutFilter}
                                    options={[
                                        { value: 'all', label: 'Tous les statuts' },
                                        { value: 'en_attente', label: 'En attente' },
                                        { value: 'confirmee', label: 'Confirmée' },
                                        { value: 'livree', label: 'Livrée' },
                                        { value: 'annulee', label: 'Annulée' },
                                    ]}
                                    variant="outline"
                                    icon={<Bx icon="filter" className="text-lg" />}
                                    fullWidth
                                />
                            </div>
                            <button
                                onClick={() => { setSearchTerm(''); setStatutFilter('all'); setSelectedFourn('all'); }}
                                className="w-11 h-11 shrink-0 flex items-center justify-center border border-slate-200 bg-white text-slate-500 rounded hover:bg-slate-50 hover:border-red-400 hover:text-red-500 transition-all"
                                title="Réinitialiser"
                            >
                                <Bx icon="reset" className="text-lg" />
                            </button>
                        </div>

                        {/* Carousel fournisseurs */}
                        <CategoryCarousel
                            categories={fournisseurNames}
                            selected={selectedFourn}
                            onChange={setSelectedFourn}
                            productCounts={commandeCounts}
                        />
                    </div>

                    {/* Tableau */}
                    <div className="flex-1 overflow-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] p-2">
                        {filtered.length > 0 ? (
                            <table className="w-full border-collapse min-w-[560px] border border-slate-100">
                                <thead className="sticky top-0 z-10">
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        {['Référence', 'Fournisseur', 'Date', 'Articles', 'Total', 'Statut', 'Actions'].map(h => (
                                            <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(cmd => {
                                        const cfg = STATUT_CONFIG[cmd.statut];
                                        return (
                                            <tr key={cmd.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">

                                                {/* Référence */}
                                                <td className={`px-3 py-3.5 border-l-4 ${cfg.border}`}>
                                                    <button
                                                        onClick={() => setDetailCommande(cmd)}
                                                        className="text-sm font-black text-sky-600 hover:text-sky-700 hover:underline transition-all"
                                                    >
                                                        {cmd.reference}
                                                    </button>
                                                </td>

                                                {/* Fournisseur */}
                                                <td className="px-3 py-3.5">
                                                    <span className="text-sm font-semibold text-slate-700">{cmd.fournisseurNom}</span>
                                                </td>

                                                {/* Date */}
                                                <td className="px-3 py-3.5">
                                                    <span className="text-sm text-slate-600">{cmd.dateCommande}</span>
                                                    {cmd.dateLivraison && (
                                                        <p className="text-xs text-slate-400 mt-0.5">→ {cmd.dateLivraison}</p>
                                                    )}
                                                </td>

                                                {/* Articles */}
                                                <td className="px-3 py-3.5">
                                                    <span className="text-sm font-semibold text-slate-700">{cmd.lignes.length} article{cmd.lignes.length > 1 ? 's' : ''}</span>
                                                </td>

                                                {/* Total */}
                                                <td className="px-3 py-3.5">
                                                    <span className="text-base font-black text-slate-800 whitespace-nowrap">{formatAr(cmd.total)}</span>
                                                </td>

                                                {/* Statut */}
                                                <td className="px-3 py-3.5">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap ${cfg.pill}`}>
                                                        <Bx icon={cfg.icon} className="text-sm" /> {cfg.label}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="px-3 py-3.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setDetailCommande(cmd)}
                                                            title="Détail"
                                                            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                                                        >
                                                            <Bx icon="show" className="text-base" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(cmd)}
                                                            title="Modifier"
                                                            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                                                        >
                                                            <Bx icon="edit" className="text-base" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cmd)}
                                                            title="Supprimer"
                                                            className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                                                        >
                                                            <Bx icon="trash" className="text-base" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                <Bx icon="receipt" className="text-6xl text-slate-300 mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-1">Aucune commande trouvée</h3>
                                <p className="text-base text-slate-400 mb-5">Aucune commande ne correspond à vos critères.</p>
                                <button
                                    onClick={() => { setSearchTerm(''); setStatutFilter('all'); setSelectedFourn('all'); }}
                                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded hover:bg-slate-50 transition-all"
                                >
                                    <Bx icon="reset" className="text-base" /> Réinitialiser
                                </button>
                            </div>
                        )}
                    </div>

                    {filtered.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                            <span className="text-sm text-slate-400">
                                {filtered.length} commande{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* ══ Colonne droite — Stats ══ */}
                <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-200 shrink-0">
                        <h2 className="text-xl font-bold text-slate-800">Vue d'ensemble</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">

                        {/* Stats globales */}
                        {[
                            { icon: 'receipt', color: 'bg-sky-50 text-sky-500', value: stats.total, label: 'Commandes totales' },
                            { icon: 'dollar-circle', color: 'bg-emerald-50 text-emerald-600', value: formatAr(stats.totalValeur), label: 'Valeur totale' },
                        ].map(({ icon, color, value, label }) => (
                            <div key={label} className="bg-white border border-slate-200 rounded p-4 flex items-center gap-4">
                                <div className={`w-14 h-14 rounded flex items-center justify-center shrink-0 ${color}`}>
                                    <Bx icon={icon} className="text-3xl" />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-2xl font-bold text-slate-800 leading-none truncate">{value}</span>
                                    <span className="text-base text-slate-500 font-medium">{label}</span>
                                </div>
                            </div>
                        ))}

                        {/* Statuts */}
                        <div className="bg-white border border-slate-200 rounded p-4">
                            <h3 className="text-base font-bold text-slate-700 mb-3">Par statut</h3>
                            <div className="flex flex-col gap-2">
                                {Object.entries(STATUT_CONFIG).map(([key, cfg]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold w-32 shrink-0 ${cfg.pill}`}>
                                            <Bx icon={cfg.icon} className="text-sm" /> {cfg.label}
                                        </span>
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${cfg.bar}`}
                                                style={{ width: stats.total > 0 ? `${Math.round((stats[key] / stats.total) * 100)}%` : '0%' }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700 w-6 text-right shrink-0">{stats[key]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* En attente alert */}
                        {stats.en_attente > 0 && (
                            <div className="p-4 bg-amber-50 border border-amber-300 border-l-4 border-l-amber-500 rounded flex gap-3 items-start">
                                <Bx icon="time" className="text-2xl text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-base text-amber-800 mb-1 font-bold">Commandes en attente</strong>
                                    <p className="text-sm text-amber-700">
                                        {stats.en_attente} commande{stats.en_attente > 1 ? 's' : ''} attendent confirmation.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showModal && (
                <CommandModal
                    isOpen={showModal}
                    onClose={() => { setShowModal(false); setEditingCommande(null); }}
                    onSave={handleSave}
                    commande={editingCommande}
                    fournisseurs={mockFournisseurs}
                />
            )}

            {detailCommande && (
                <DetailPanel
                    commande={detailCommande}
                    onClose={() => setDetailCommande(null)}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
};

export default Commands;