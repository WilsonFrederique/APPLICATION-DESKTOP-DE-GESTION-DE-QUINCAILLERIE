import PropTypes from 'prop-types';
import React from 'react';
import Bx from '../UI/Boxicon';
import Button from '../UI/Button/Button';
import { formatAr, formatDate } from '../../utils/function/format';

const SalesHistoryItem = ({ sale }) => {

    return (
        <div className="bg-white rounded border border-slate-100 overflow-hidden hover:shadow-md hover:shadow-slate-100 hover:-translate-y-px transition-all duration-200">
            <div className={`h-1.5 w-full ${sale.statut === 'paye' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <div className="p-4">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                        <p className="text-base font-bold text-slate-800 font-mono">{sale.numero}</p>
                        <p className="text-sm text-slate-500 mt-1">{sale.client}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded ${sale.statut === 'paye' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                            <Bx icon={sale.statut === 'paye' ? 'check-circle' : 'error-circle'} className="text-base" />
                            {sale.statut === 'paye' ? 'Payé' : 'Crédit'}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded ${sale.livraison === 'livre' ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            <Bx icon={sale.livraison === 'livre' ? 'truck' : 'time'} className="text-base" />
                            {sale.livraison === 'livre' ? 'Livré' : 'En attente'}
                        </span>
                    </div>
                </div>

                {/* Detail grid */}
                <div className="grid grid-cols-4 gap-3 py-3 px-3 bg-slate-50 rounded mb-3">
                    {[
                        { label: 'Montant', value: formatAr(sale.montant), highlight: true },
                        { label: 'Articles', value: `${sale.items} produits` },
                        { label: 'Paiement', value: sale.paiement },
                        { label: 'Vendeur', value: sale.vendeur },
                    ].map(({ label, value, highlight }) => (
                        <div key={label}>
                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
                            <p className={`text-sm font-bold mt-1 ${highlight ? 'text-emerald-600' : 'text-slate-700'}`}>{value}</p>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Bx icon="calendar" className="text-base" />
                        <span>{formatDate(sale.date, true)}</span>
                    </div>
                    <div className="flex gap-2">
                        {[{ label: 'Détails' }, { label: 'Imprimer' }, ...(sale.statut === 'credit' ? [{ label: 'Payer' }] : [])].map(({ label }) => (
                            <Button key={label} variant="outline" size="small">{label}</Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

SalesHistoryItem.propTypes = {
    sale: PropTypes.object,
}

export default SalesHistoryItem;
