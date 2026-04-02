import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const CreditPanel = ({ customer, onClose }) => {
    const restant = customer.credit_autorise - customer.credit_utilise;
    const pct = customer.credit_autorise > 0
        ? Math.min(100, Math.round((customer.credit_utilise / customer.credit_autorise) * 100))
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
                            <p className="text-xs text-white/60 mt-0.5 truncate max-w-[180px]">{customer.nom}</p>
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
                            { label: 'Autorisé', value: formatAr(customer.credit_autorise), color: 'text-slate-800' },
                            { label: 'Utilisé', value: formatAr(customer.credit_utilise), color: isMaxed ? 'text-red-600' : isHigh ? 'text-amber-600' : 'text-slate-800' },
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

CreditPanel.propTypes = {
    customer: PropTypes.object,
    onClose: PropTypes.func,
}

export default CreditPanel;