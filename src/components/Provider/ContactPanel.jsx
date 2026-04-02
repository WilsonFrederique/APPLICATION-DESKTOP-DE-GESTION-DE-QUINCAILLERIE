import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';

const ContactPanel = ({ provider, getInitials, getAvatarColor, onClose }) => {
    const contacts = [
        { icon: 'phone', color: 'bg-sky-50 text-sky-600', label: 'Téléphone', value: provider.telephone, href: `tel:${provider.telephone}` },
        { icon: 'whatsapp bxl-whatsapp', color: 'bg-emerald-50 text-emerald-600', label: 'WhatsApp', value: provider.whatsapp, href: provider.whatsapp ? `https://wa.me/${provider.whatsapp.replace(/\s/g, '')}` : null },
        { icon: 'envelope', color: 'bg-violet-50 text-violet-600', label: 'Email', value: provider.email, href: provider.email ? `mailto:${provider.email}` : null },
        { icon: 'facebook bxl-facebook', color: 'bg-blue-50 text-blue-600', label: 'Facebook', value: provider.facebook, href: provider.facebook ? `https://${provider.facebook}` : null },
    ].filter(c => c.value);

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-sm bg-white rounded shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="bg-slate-800 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: getAvatarColor(provider.id) }}
                        >
                            {getInitials(provider.nom)}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-white leading-tight truncate max-w-[180px]">{provider.nom}</h3>
                            <p className="text-xs text-white/60 mt-0.5 truncate max-w-[180px]">{provider.adresse || 'Adresse non renseignée'}</p>
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
                    {provider.note && (
                        <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2.5">
                            <Bx icon="note" className="text-base text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 leading-relaxed">{provider.note}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

ContactPanel.propTypes = {
    provider: PropTypes.object.isRequired,
    getInitials: PropTypes.func,
    getAvatarColor: PropTypes.func,
    onClose: PropTypes.func,
}

export default ContactPanel;