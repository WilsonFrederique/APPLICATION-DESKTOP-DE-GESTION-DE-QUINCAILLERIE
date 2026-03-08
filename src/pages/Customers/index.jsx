import React, { useState, useMemo } from 'react';
import Input from '../../components/Input/Input';
import CustomerModal from '../../components/Customer/CustomerModal';
import Bx from '../../components/UI/Boxicon';
import { formatAr } from '../../utils/function/format';

/* ─── Helpers avatar ─── */
const AVATAR_COLORS = ['#3b82f6', '#6366f1', '#0891b2', '#059669', '#d97706', '#7c3aed'];
const getInitials = (nom) => {
    const parts = nom.trim().split(' ');
    return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── Données mock ─── */
const initialClients = [
    { id: 1, nom: 'SARL Batiment Plus', telephone: '+261 34 00 123 45', adresse: 'Analakely, Antananarivo 101', credit_autorise: 500000, credit_utilise: 320000 },
    { id: 2, nom: 'Entreprise Construction Pro', telephone: '+261 32 00 987 65', adresse: 'Ivandry, Antananarivo', credit_autorise: 0, credit_utilise: 0 },
    { id: 3, nom: 'Mr. Randria Jean-Pierre', telephone: '+261 33 00 456 78', adresse: 'Ambohibao, Antananarivo', credit_autorise: 200000, credit_utilise: 200000 },
    { id: 4, nom: 'Groupe Immobilier Pro', telephone: '+261 34 11 223 34', adresse: 'Ankorondrano, Antananarivo', credit_autorise: 1000000, credit_utilise: 150000 },
    { id: 5, nom: 'SARL Materiaux Pro', telephone: '+261 32 11 334 45', adresse: 'Andraharo, Antananarivo', credit_autorise: 300000, credit_utilise: 0 },
    { id: 6, nom: 'Mr. Andriamora', telephone: '+261 33 12 445 56', adresse: 'Anosy, Antananarivo', credit_autorise: 0, credit_utilise: 0 },
];

/* ─── Panel détail crédit ─── */
const CreditPanel = ({ client, onClose }) => {
    const restant = client.credit_autorise - client.credit_utilise;
    const pct = client.credit_autorise > 0
        ? Math.min(100, Math.round((client.credit_utilise / client.credit_autorise) * 100))
        : 0;
    const isMaxed = pct >= 100;
    const isHigh = pct >= 75;

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-slate-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center text-sky-400 border border-white/10">
                            <Bx icon="credit-card" className="text-lg" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white leading-tight">Crédit en cours</h3>
                            <p className="text-xs text-white/60 mt-0.5 truncate max-w-[180px]">{client.nom}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-white border border-white/10 transition-all"
                    >
                        <Bx icon="x" className="text-base" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-4">

                    {/* Barre de progression */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500 font-medium">Utilisation du crédit</span>
                            <span className={`text-sm font-bold ${isMaxed ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {pct}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${isMaxed ? 'bg-red-500' : isHigh ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>

                    {/* Chiffres */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Autorisé', value: formatAr(client.credit_autorise), color: 'text-slate-800' },
                            { label: 'Utilisé', value: formatAr(client.credit_utilise), color: isMaxed ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-slate-800' },
                            { label: 'Restant', value: formatAr(restant), color: restant <= 0 ? 'text-red-600' : 'text-emerald-600' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-slate-50 border border-slate-200 rounded p-3 flex flex-col gap-1 text-center">
                                <span className="text-xs text-slate-400 font-medium">{label}</span>
                                <span className={`text-sm font-black leading-tight ${color}`}>{value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Alerte */}
                    {isMaxed && (
                        <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded">
                            <Bx icon="error" className="text-lg text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 font-medium">Crédit épuisé — aucune vente à crédit possible.</p>
                        </div>
                    )}
                    {!isMaxed && isHigh && (
                        <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded">
                            <Bx icon="error" className="text-lg text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-700 font-medium">Crédit presque épuisé — surveiller les prochaines ventes.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Ligne client ─── */
const CustomerRow = ({ client, onEdit, onDelete, onViewCredit }) => {
    const hasCredit = client.credit_utilise > 0;
    const pct = client.credit_autorise > 0
        ? Math.min(100, Math.round((client.credit_utilise / client.credit_autorise) * 100))
        : 0;
    const isMaxed = pct >= 100;
    const isHigh = pct >= 75;

    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">

            {/* Avatar */}
            <td className="px-4 py-3.5 w-12">
                <div
                    className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0 select-none"
                    style={{ background: getAvatarColor(client.id) }}
                >
                    {getInitials(client.nom)}
                </div>
            </td>

            {/* Nom */}
            <td className="px-3 py-3.5">
                <span className="text-base font-bold text-slate-800">{client.nom}</span>
            </td>

            {/* Téléphone */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="phone" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm">{client.telephone}</span>
                </div>
            </td>

            {/* Adresse */}
            <td className="px-3 py-3.5 max-w-[200px]">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="map-pin" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm truncate">{client.adresse}</span>
                </div>
            </td>

            {/* Crédit */}
            <td className="px-3 py-3.5">
                {client.credit_autorise > 0 ? (
                    <button
                        onClick={() => onViewCredit(client)}
                        className="flex flex-col gap-1.5 group text-left"
                        title="Voir le détail du crédit"
                    >
                        <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all group-hover:opacity-80
                                ${isMaxed ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : hasCredit ? 'bg-sky-100 text-sky-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                <Bx icon="credit-card" className="text-sm" />
                                {hasCredit ? formatAr(client.credit_utilise) : 'Soldé'}
                            </span>
                            <Bx icon="info-circle" className="text-sm text-slate-300 group-hover:text-sky-400 transition-colors" />
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${isMaxed ? 'bg-red-500' : isHigh ? 'bg-amber-400' : 'bg-sky-400'}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </button>
                ) : (
                    <span className="text-sm text-slate-300 italic">—</span>
                )}
            </td>

            {/* Actions */}
            <td className="px-3 py-3.5 text-center">
                <div className="flex flex-nowrap gap-1.5">
                    <button
                        onClick={() => onEdit(client)}
                        title="Modifier"
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                    >
                        <Bx icon="edit" className="text-base" />
                    </button>
                    <button
                        onClick={() => onDelete(client)}
                        title="Supprimer"
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                    >
                        <Bx icon="trash" className="text-base" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

/* ══════════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════════ */
const Customers = () => {
    const [clients, setClients] = useState(initialClients);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [creditClient, setCreditClient] = useState(null);

    const filteredClients = useMemo(() => {
        let list = [...clients];
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(c =>
                c.nom.toLowerCase().includes(q) ||
                c.telephone.includes(q) ||
                c.adresse.toLowerCase().includes(q)
            );
        }
        return list.sort((a, b) => a.nom.localeCompare(b.nom));
    }, [clients, searchTerm]);

    const handleSave = (data) => {
        if (editingClient) {
            setClients(prev => prev.map(c => c.id === data.id ? { ...c, ...data } : c));
        } else {
            setClients(prev => [...prev, { ...data, id: Date.now(), credit_autorise: 0, credit_utilise: 0 }]);
        }
        setShowModal(false);
        setEditingClient(null);
    };

    const handleEdit = (client) => { setEditingClient(client); setShowModal(true); };
    const handleDelete = (client) => {
        if (globalThis.confirm?.(`Supprimer le client "${client.nom}" ?`))
            setClients(prev => prev.filter(c => c.id !== client.id));
    };

    return (
        <div className="flex flex-col overflow-hidden bg-transparent h-full p-3">

            {/* ══ Carte principale ══ */}
            <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden h-full">

                {/* Header interne */}
                <div className="flex flex-col gap-3 px-4 pt-3 pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">Gestion des Clients</h2>
                        <button
                            onClick={() => { setEditingClient(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 h-11 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded transition-all whitespace-nowrap"
                        >
                            <Bx icon="plus" className="text-lg" /> Nouveau client
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, téléphone, adresse…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                name="clientSearch"
                                icon={<Bx icon="search" className="text-lg" />}
                                fullWidth
                            />
                        </div>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="w-11 h-11 shrink-0 flex items-center justify-center border border-slate-200 bg-white text-slate-500 rounded hover:bg-slate-50 hover:border-red-400 hover:text-red-500 transition-all"
                            title="Réinitialiser"
                        >
                            <Bx icon="reset" className="text-lg" />
                        </button>
                    </div>
                </div>

                {/* Tableau */}
                <div className="flex-1 overflow-auto p-2">
                    {filteredClients.length > 0 ? (
                        <table className="w-full border-collapse min-w-[640px] border border-slate-100">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="w-12 px-4 py-3"></th>
                                    {['Nom', 'Téléphone', 'Adresse', 'Crédit en cours', 'Actions'].map(h => (
                                        <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClients.map(client => (
                                    <CustomerRow
                                        key={client.id}
                                        client={client}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onViewCredit={setCreditClient}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <Bx icon="user" className="text-6xl text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-1">Aucun client trouvé</h3>
                            <p className="text-base text-slate-400 mb-5">Aucun client ne correspond à vos critères.</p>
                            <button
                                onClick={() => setSearchTerm('')}
                                className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-sm font-semibold rounded hover:bg-slate-50 transition-all"
                            >
                                <Bx icon="reset" className="text-base" /> Réinitialiser
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer compteur */}
                {filteredClients.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                        <span className="text-sm text-slate-400">
                            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} affiché{filteredClients.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <CustomerModal
                    isOpen={showModal}
                    onClose={() => { setShowModal(false); setEditingClient(null); }}
                    onSave={handleSave}
                    client={editingClient}
                />
            )}

            {creditClient && (
                <CreditPanel
                    client={creditClient}
                    onClose={() => setCreditClient(null)}
                />
            )}
        </div>
    );
};

export default Customers;