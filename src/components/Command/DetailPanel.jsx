import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const DetailPanel = ({ commande, statusConfig, onClose, onEdit }) => {
    const cfg = statusConfig[commande.statut];

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
                                <div key={l.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
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

DetailPanel.propTypes = {
    commande: PropTypes.object.isRequired,
    statusConfig: PropTypes.object,
    onClose: PropTypes.func,
    onEdit: PropTypes.func,
}

export default DetailPanel;