import React, { useState, useMemo } from 'react';
import Input from '../../components/UI/Input/Input';
import FournisseurModal from '../../components/Provider/ProviderModal';
import ContactPanel from '../../components/Provider/ContactPanel';
import ProviderRow from '../../components/Provider/ProviderRow';
import Bx from '../../components/UI/Boxicon';

/* ─── Helpers avatar ─── */
const AVATAR_COLORS = ['#0891b2', '#7c3aed', '#059669', '#d97706', '#3b82f6', '#6366f1'];
const getInitials = (nom) => {
    const parts = nom.trim().split(' ');
    return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

/* ─── Données mock ─── */
const initialProviders = [
    { id: 1, nom: 'SARL Import Ciment Pro', telephone: '+261 34 11 000 01', whatsapp: '+261 34 11 000 01', facebook: 'fb.com/importciment', email: 'contact@ciment.mg', adresse: 'Zone industrielle, Antananarivo', note: 'Livraison sous 3 jours ouvrés' },
    { id: 2, nom: 'Quincaillerie Centrale', telephone: '+261 32 22 000 02', whatsapp: '', facebook: '', email: '', adresse: 'Analakely, Antananarivo', note: '' },
    { id: 3, nom: 'Ferronnerie du Nord', telephone: '+261 33 33 000 03', whatsapp: '+261 33 33 000 03', facebook: 'fb.com/ferronord', email: 'info@ferronord.mg', adresse: 'Mahajanga', note: 'Minimum de commande : 500 000 Ar' },
    { id: 4, nom: 'Peintures & Déco Malagasy', telephone: '+261 34 44 000 04', whatsapp: '+261 34 44 000 04', facebook: 'fb.com/peinturedeco', email: '', adresse: 'Fianarantsoa', note: '' },
    { id: 5, nom: 'Bois & Matériaux Réunion', telephone: '+261 32 55 000 05', whatsapp: '', facebook: '', email: 'bois@reunion.re', adresse: 'Toamasina', note: 'Importation — délai 2 semaines' },
];

const Providers = () => {
    const [fournisseurs, setFournisseurs] = useState(initialProviders);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingFournisseur, setEditingFournisseur] = useState(null);
    const [contactFournisseur, setContactFournisseur] = useState(null);

    const filtered = useMemo(() => {
        let list = [...fournisseurs];
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            list = list.filter(f =>
                f.nom.toLowerCase().includes(q) ||
                f.telephone.includes(q) ||
                f.adresse.toLowerCase().includes(q)
            );
        }
        return list.sort((a, b) => a.nom.localeCompare(b.nom));
    }, [fournisseurs, searchTerm]);

    const handleSave = (data) => {
        if (editingFournisseur) {
            setFournisseurs(prev => prev.map(f => f.id === data.id ? { ...f, ...data } : f));
        } else {
            setFournisseurs(prev => [...prev, data]);
        }
        setShowModal(false);
        setEditingFournisseur(null);
    };

    const handleEdit = (f) => { setEditingFournisseur(f); setShowModal(true); };
    const handleDelete = (f) => {
        if (globalThis.confirm?.(`Supprimer "${f.nom}" ?`))
            setFournisseurs(prev => prev.filter(x => x.id !== f.id));
    };

    return (
        <div className="flex flex-col overflow-hidden bg-transparent h-full p-3">
            <div className="bg-white rounded border border-slate-200 shadow-lg shadow-slate-100 flex flex-col overflow-hidden h-full">

                {/* Header */}
                <div className="flex flex-col gap-3 px-4 pt-3 pb-3 border-b border-slate-100 shrink-0">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">Gestion des Fournisseurs</h2>
                        <button
                            onClick={() => { setEditingFournisseur(null); setShowModal(true); }}
                            className="flex items-center gap-2 px-4 h-11 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded transition-all whitespace-nowrap"
                        >
                            <Bx icon="plus" className="text-lg" /> Nouveau fournisseur
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1">
                            <Input
                                type="text"
                                placeholder="Rechercher par nom, téléphone, adresse…"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                name="fournisseurSearch"
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
                <div className="flex-1 overflow-auto [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] p-2">
                    {filtered.length > 0 ? (
                        <table className="w-full border-collapse min-w-[700px] border border-slate-100">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="w-12 px-4 py-3"></th>
                                    {['Nom / Adresse', 'Téléphone', 'Contacts', 'Note', 'Actions'].map(h => (
                                        <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(f => (
                                    <ProviderRow
                                        key={f.id}
                                        provider={f}
                                        getInitials={getInitials}
                                        getAvatarColor={getAvatarColor}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onViewContact={setContactFournisseur}
                                    />
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                            <Bx icon="building" className="text-6xl text-slate-300 mb-4" />
                            <h3 className="text-xl font-bold text-slate-700 mb-1">Aucun fournisseur trouvé</h3>
                            <p className="text-base text-slate-400 mb-5">Aucun fournisseur ne correspond à votre recherche.</p>
                            <button
                                onClick={() => setSearchTerm('')}
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
                            {filtered.length} fournisseur{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                        </span>
                    </div>
                )}
            </div>

            {showModal && (
                <FournisseurModal
                    isOpen={showModal}
                    onClose={() => { setShowModal(false); setEditingFournisseur(null); }}
                    onSave={handleSave}
                    fournisseur={editingFournisseur}
                />
            )}

            {contactFournisseur && (
                <ContactPanel
                    provider={contactFournisseur}
                    getInitials={getInitials}
                    getAvatarColor={getAvatarColor}
                    onClose={() => setContactFournisseur(null)}
                />
            )}
        </div>
    );
};

export default Providers;