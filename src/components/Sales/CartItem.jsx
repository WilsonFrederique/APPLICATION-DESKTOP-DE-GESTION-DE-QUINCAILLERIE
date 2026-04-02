import PropTypes from 'prop-types';
import React from 'react';
import Bx from '../UI/Boxicon';

const CartItem = ({ item, onUpdateQuantity, onUpdatePrice, onRemove }) => {
    return (
        <div className="flex gap-3 p-3 bg-white rounded border border-slate-100 hover:border-slate-200 transition-colors group">
            <div className="relative w-14 h-14 rounded overflow-hidden shrink-0 bg-slate-50">
                <img src={item.image} alt={item.nom} className="w-full h-full object-cover" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white text-xs font-bold rounded flex items-center justify-center">
                    {item.quantity}
                </span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 leading-snug truncate">{item.nom}</p>
                        <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 rounded px-2 py-0.5 mt-1">{item.unit}</span>
                    </div>
                    <button
                        onClick={() => onRemove(item.id)}
                        className="w-6 h-6 flex items-center justify-center rounded text-red-500 bg-red-50 transition-all shrink-0 cursor-pointer"
                    >
                        <Bx icon="trash" className="text-base" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded p-1">
                        <button
                            onClick={() => item.quantity > 1 && onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-bold"
                        >
                            <Bx icon="minus" className="text-sm" />
                        </button>
                        <input
                            type="number" min="1" max={item.stock} value={item.quantity}
                            onChange={(e) => onUpdateQuantity(item.id, Math.max(1, Math.min(item.stock, Number.parseInt(e.target.value) || 1)))}
                            className="w-10 text-center text-sm font-bold text-slate-800 bg-transparent border-none outline-none"
                        />
                        <button
                            onClick={() => item.quantity < item.stock && onUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-white hover:text-sky-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-base font-bold"
                        >
                            <Bx icon="plus" className="text-sm" />
                        </button>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-100 transition-all">
                            <Bx icon="pencil" className="text-xs text-slate-300" />
                            <input
                                type="number"
                                min="1"
                                value={item.price}
                                onChange={(e) => {
                                    const val = Number.parseInt(e.target.value) || 0;
                                    if (val > 0) onUpdatePrice(item.id, item.unit, val);
                                }}
                                className="w-25 text-right font-bold text-slate-700 bg-transparent border-none outline-none"
                            />
                            <span className="text-xs text-slate-400 shrink-0">Ar</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CartItem.propTypes = {
    item: PropTypes.object,
    onUpdateQuantity: PropTypes.func,
    onUpdatePrice: PropTypes.func,
    onRemove: PropTypes.func,
}

export default CartItem;