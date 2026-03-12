import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const AVATAR_COLORS = ['#3b82f6', '#6366f1', '#0891b2', '#059669', '#d97706', '#7c3aed'];
const getInitials = (nom) => {
    const parts = nom.trim().split(' ');
    return parts.length === 1
        ? parts[0][0].toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
const getAvatarColor = (id) => AVATAR_COLORS[id % AVATAR_COLORS.length];

const CustomerRow = ({ customer, onEdit, onDelete, onViewCredit }) => {
    const hasCredit = customer.credit_utilise > 0;
    const pct = customer.credit_autorise > 0
        ? Math.min(100, Math.round((customer.credit_utilise / customer.credit_autorise) * 100))
        : 0;
    const isMaxed = pct >= 100;
    const isHigh = pct >= 75;

    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">

            {/* Avatar */}
            <td className="px-4 py-3.5 w-12">
                <div
                    className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0 select-none"
                    style={{ background: getAvatarColor(customer.id) }}
                >
                    {getInitials(customer.nom)}
                </div>
            </td>

            {/* Nom */}
            <td className="px-3 py-3.5">
                <span className="text-base font-bold text-slate-800">{customer.nom}</span>
            </td>

            {/* Téléphone */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="phone" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm">{customer.telephone}</span>
                </div>
            </td>

            {/* Adresse */}
            <td className="px-3 py-3.5 max-w-[200px]">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="map-pin" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm truncate">{customer.adresse}</span>
                </div>
            </td>

            {/* Crédit */}
            <td className="px-3 py-3.5">
                {customer.credit_autorise > 0 ? (
                    <button
                        onClick={() => onViewCredit(customer)}
                        className="flex flex-col gap-1.5 group text-left"
                        title="Voir le détail du crédit"
                    >
                        <div className="flex items-center gap-1.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-all group-hover:opacity-80
                                ${isMaxed ? 'bg-red-100 text-red-700' : isHigh ? 'bg-amber-100 text-amber-700' : hasCredit ? 'bg-sky-100 text-sky-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                <Bx icon="credit-card" className="text-sm" />
                                {hasCredit ? formatAr(customer.credit_utilise) : 'Soldé'}
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
                        onClick={() => onEdit(customer)}
                        title="Modifier"
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                    >
                        <Bx icon="edit" className="text-base" />
                    </button>
                    <button
                        onClick={() => onDelete(customer)}
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

CustomerRow.propTypes = {
    customer: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onViewCredit: PropTypes.func,
}

export default CustomerRow;