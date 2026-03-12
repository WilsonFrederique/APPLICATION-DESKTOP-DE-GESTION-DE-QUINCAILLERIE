import React from 'react';
import PropTypes from 'prop-types';

const StockRow = ({ product, index }) => {
    const pct = Math.min(100, Math.round((product.stock / product.seuilMin) * 100));
    const isDanger = product.stock <= 5;
    const isLow = product.stock <= product.seuilMin * 0.5;

    return (
        <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-black ${isDanger ? 'bg-red-100 text-red-600' : isLow ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {index + 1}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{product.nom}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isDanger ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${isDanger ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-500'}`}>
                        {product.stock} / {product.seuilMin}
                    </span>
                </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${isDanger ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {isDanger ? 'Critique' : isLow ? 'Faible' : 'Bas'}
            </span>
        </div>
    );
};

StockRow.propTypes = {
    product: PropTypes.object,
    index: PropTypes.number,
}

export default StockRow;