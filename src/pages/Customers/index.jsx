import React, { useState, useMemo } from 'react';
import Input from '../../components/UI/Input/Input';
import CustomerModal from '../../components/Customer/CustomerModal';
import Bx from '../../components/UI/Boxicon';
import CreditPanel from '../../components/Customer/CreditPanel';
import CustomerRow from '../../components/Customer/CustomerRow';

/* ─── Données mock ─── */
const initialClients = [
    { id: 1, nom: 'SARL Batiment Plus', telephone: '+261 34 00 123 45', adresse: 'Analakely, Antananarivo 101', credit_autorise: 500000, credit_utilise: 320000 },
    { id: 2, nom: 'Entreprise Construction Pro', telephone: '+261 32 00 987 65', adresse: 'Ivandry, Antananarivo', credit_autorise: 0, credit_utilise: 0 },
    { id: 3, nom: 'Mr. Randria Jean-Pierre', telephone: '+261 33 00 456 78', adresse: 'Ambohibao, Antananarivo', credit_autorise: 200000, credit_utilise: 200000 },
    { id: 4, nom: 'Groupe Immobilier Pro', telephone: '+261 34 11 223 34', adresse: 'Ankorondrano, Antananarivo', credit_autorise: 1000000, credit_utilise: 150000 },
    { id: 5, nom: 'SARL Materiaux Pro', telephone: '+261 32 11 334 45', adresse: 'Andraharo, Antananarivo', credit_autorise: 300000, credit_utilise: 0 },
    { id: 6, nom: 'Mr. Andriamora', telephone: '+261 33 12 445 56', adresse: 'Anosy, Antananarivo', credit_autorise: 0, credit_utilise: 0 },
];

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
                                        customer={client}
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