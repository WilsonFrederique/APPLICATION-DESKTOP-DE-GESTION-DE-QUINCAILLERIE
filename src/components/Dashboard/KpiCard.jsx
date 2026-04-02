import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';

const KpiCard = ({ title, value, subtitle, icon, trend, iconBg }) => (
    <div className="bg-white border border-slate-200 rounded p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all">
        <div className="flex items-start justify-between">
            <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${iconBg}`}>
                <Bx icon={icon} className="text-2xl" />
            </div>
            {trend !== undefined && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    <Bx icon={trend >= 0 ? 'up-arrow-alt' : 'down-arrow-alt'} className="text-sm" />
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
        <div>
            <p className="text-3xl font-black text-slate-800 leading-none">{value}</p>
            <p className="text-base font-semibold text-slate-500 mt-1">{title}</p>
            {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

KpiCard.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.string,
    trend: PropTypes.number,
    iconBg: PropTypes.string,
}

export default KpiCard;