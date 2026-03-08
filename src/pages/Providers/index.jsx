import React, { useState, useMemo } from 'react';
import Input from '../../components/Input/Input';
import FournisseurModal from '../../components/Provider/ProviderModal';
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

/* ─── Panel contact ─── */
const ContactPanel = ({ fournisseur, onClose }) => {
    const contacts = [
        { icon: 'phone', color: 'bg-sky-50 text-sky-600', label: 'Téléphone', value: fournisseur.telephone, href: `tel:${fournisseur.telephone}` },
        { icon: 'logo-whatsapp', color: 'bg-emerald-50 text-emerald-600', label: 'WhatsApp', value: fournisseur.whatsapp, href: fournisseur.whatsapp ? `https://wa.me/${fournisseur.whatsapp.replace(/\s/g, '')}` : null },
        { icon: 'envelope', color: 'bg-violet-50 text-violet-600', label: 'Email', value: fournisseur.email, href: fournisseur.email ? `mailto:${fournisseur.email}` : null },
        { icon: 'logo-facebook', color: 'bg-blue-50 text-blue-600', label: 'Facebook', value: fournisseur.facebook, href: fournisseur.facebook ? `https://${fournisseur.facebook}` : null },
    ].filter(c => c.value);

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-slate-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: getAvatarColor(fournisseur.id) }}
                        >
                            {getInitials(fournisseur.nom)}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white leading-tight truncate max-w-[180px]">{fournisseur.nom}</h3>
                            <p className="text-xs text-white/60 mt-0.5 truncate max-w-[180px]">{fournisseur.adresse || 'Adresse non renseignée'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white/70 hover:bg-red-500/30 hover:text-white border border-white/10 transition-all"
                    >
                        <Bx icon="x" className="text-base" />
                    </button>
                </div>

                {/* Contacts */}
                <div className="p-5 flex flex-col gap-3">
                    {contacts.length > 0 ? contacts.map(({ icon, color, label, value, href }) => (
                        <div key={label} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                            <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${color}`}>
                                <Bx icon={icon} className="text-lg" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-400 font-medium">{label}</p>
                                <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
                            </div>
                            {href && (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all shrink-0"
                                >
                                    <Bx icon="link-external" className="text-sm" />
                                </a>
                            )}
                        </div>
                    )) : (
                        <p className="text-sm text-slate-400 text-center py-4">Aucun contact renseigné</p>
                    )}

                    {/* Note */}
                    {fournisseur.note && (
                        <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2.5">
                            <Bx icon="note" className="text-base text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 leading-relaxed">{fournisseur.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─── Ligne fournisseur ─── */
const FournisseurRow = ({ fournisseur, onEdit, onDelete, onViewContact }) => {
    const hasWhatsapp = !!fournisseur.whatsapp;
    const hasFacebook = !!fournisseur.facebook;
    const hasEmail = !!fournisseur.email;

    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">

            {/* Avatar */}
            <td className="px-4 py-3.5 w-12">
                <div
                    className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0 select-none"
                    style={{ background: getAvatarColor(fournisseur.id) }}
                >
                    {getInitials(fournisseur.nom)}
                </div>
            </td>

            {/* Nom */}
            <td className="px-3 py-3.5">
                <span className="text-base font-bold text-slate-800">{fournisseur.nom}</span>
                {fournisseur.adresse && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Bx icon="map-pin" className="text-xs text-slate-300 shrink-0" />
                        <span className="text-xs text-slate-400 truncate max-w-[200px]">{fournisseur.adresse}</span>
                    </div>
                )}
            </td>

            {/* Téléphone */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="phone" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm">{fournisseur.telephone}</span>
                </div>
            </td>

            {/* Canaux de contact */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2">
                    {hasWhatsapp && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-100" title="WhatsApp disponible">
                            <Bx icon="logo-whatsapp" className="text-base" />
                        </span>
                    )}
                    {hasEmail && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-violet-50 text-violet-600 border border-violet-100" title="Email disponible">
                            <Bx icon="envelope" className="text-base" />
                        </span>
                    )}
                    {hasFacebook && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100" title="Facebook disponible">
                            <Bx icon="logo-facebook" className="text-base" />
                        </span>
                    )}
                    {!hasWhatsapp && !hasEmail && !hasFacebook && (
                        <span className="text-sm text-slate-300 italic">—</span>
                    )}
                    <button
                        onClick={() => onViewContact(fournisseur)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-500 border border-slate-200 rounded hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all ml-1"
                        title="Voir tous les contacts"
                    >
                        <Bx icon="show" className="text-sm" /> Voir
                    </button>
                </div>
            </td>

            {/* Note */}
            <td className="px-3 py-3.5 max-w-[180px]">
                {fournisseur.note ? (
                    <span className="text-sm text-slate-500 truncate block" title={fournisseur.note}>{fournisseur.note}</span>
                ) : (
                    <span className="text-sm text-slate-300 italic">—</span>
                )}
            </td>

            {/* Actions */}
            <td className="px-3 py-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => onEdit(fournisseur)}
                        title="Modifier"
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                    >
                        <Bx icon="edit" className="text-base" />
                    </button>
                    <button
                        onClick={() => onDelete(fournisseur)}
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
   FOURNISSEURS
══════════════════════════════════════════════ */
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
                                    <FournisseurRow
                                        key={f.id}
                                        fournisseur={f}
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
                    fournisseur={contactFournisseur}
                    onClose={() => setContactFournisseur(null)}
                />
            )}
        </div>
    );
};

export default Providers;