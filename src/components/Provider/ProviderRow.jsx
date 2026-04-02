import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';

const ProviderRow = ({ provider, getInitials, getAvatarColor, onEdit, onDelete, onViewContact }) => {
    const hasWhatsapp = !!provider.whatsapp;
    const hasFacebook = !!provider.facebook;
    const hasEmail = !!provider.email;

    return (
        <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">

            {/* Avatar */}
            <td className="px-4 py-3.5 w-12">
                <div
                    className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0 select-none"
                    style={{ background: getAvatarColor(provider.id) }}
                >
                    {getInitials(provider.nom)}
                </div>
            </td>

            {/* Nom */}
            <td className="px-3 py-3.5">
                <span className="text-base font-bold text-slate-800">{provider.nom}</span>
                {provider.adresse && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <Bx icon="map-pin" className="text-xs text-slate-300 shrink-0" />
                        <span className="text-xs text-slate-400 truncate max-w-[200px]">{provider.adresse}</span>
                    </div>
                )}
            </td>

            {/* Téléphone */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2 text-slate-600">
                    <Bx icon="phone" className="text-base text-slate-400 shrink-0" />
                    <span className="text-sm">{provider.telephone}</span>
                </div>
            </td>

            {/* Canaux de contact */}
            <td className="px-3 py-3.5">
                <div className="flex items-center gap-2">
                    {hasWhatsapp && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-100" title="WhatsApp disponible">
                            <Bx icon="whatsapp bxl-whatsapp" className="text-base" />
                        </span>
                    )}
                    {hasEmail && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-violet-50 text-violet-600 border border-violet-100" title="Email disponible">
                            <Bx icon="envelope" className="text-base" />
                        </span>
                    )}
                    {hasFacebook && (
                        <span className="w-7 h-7 flex items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100" title="Facebook disponible">
                            <Bx icon="facebook bxl-facebook" className="text-base" />
                        </span>
                    )}
                    {!hasWhatsapp && !hasEmail && !hasFacebook && (
                        <span className="text-sm text-slate-300 italic">—</span>
                    )}
                    <button
                        onClick={() => onViewContact(provider)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-slate-500 border border-slate-200 rounded hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all ml-1"
                        title="Voir tous les contacts"
                    >
                        <Bx icon="show" className="text-sm" /> Voir
                    </button>
                </div>
            </td>

            {/* Note */}
            <td className="px-3 py-3.5 max-w-[180px]">
                {provider.note ? (
                    <span className="text-sm text-slate-500 truncate block" title={provider.note}>{provider.note}</span>
                ) : (
                    <span className="text-sm text-slate-300 italic">—</span>
                )}
            </td>

            {/* Actions */}
            <td className="px-3 py-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                    <button
                        onClick={() => onEdit(provider)}
                        title="Modifier"
                        className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200 transition-all"
                    >
                        <Bx icon="edit" className="text-base" />
                    </button>
                    <button
                        onClick={() => onDelete(provider)}
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

ProviderRow.propTypes = {
    provider: PropTypes.object.isRequired,
    getInitials: PropTypes.func,
    getAvatarColor: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onViewContact: PropTypes.func,
};

export default ProviderRow;