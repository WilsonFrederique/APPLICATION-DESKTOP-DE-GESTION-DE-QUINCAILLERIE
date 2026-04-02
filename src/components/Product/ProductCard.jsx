import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
    const getStockStatus = () => {
        if (product.stock === 0) return { label: 'Rupture', color: 'bg-gray-500/90' };
        if (product.stock <= product.seuilMin) return { label: 'Critique', color: 'bg-red-500/90' };
        if (product.stock <= product.seuilMin * 1.5) return { label: 'Faible', color: 'bg-amber-500/90' };
        return { label: 'Bon', color: 'bg-emerald-500/90' };
    };

    const { label, color } = getStockStatus();
    const isCritical = product.stock <= product.seuilMin;

    return (
        <div className="bg-white border border-slate-200 rounded overflow-hidden flex flex-col hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300 transition-all">
            {/* Image */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                    src={product.image}
                    alt={product.nom}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className={`absolute top-2 right-2 ${color} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
                    {label}
                </span>
                {isCritical && (
                    <div className="absolute top-2 left-2 w-8 h-8 bg-red-500/95 text-white rounded-full flex items-center justify-center z-10">
                        <Bx icon="error" className="text-base" />
                    </div>
                )}
            </div>

            {/* Contenu */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                    <h4 className="text-lg font-bold text-slate-800 m-0 leading-snug line-clamp-2">{product.nom}</h4>
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 bg-slate-100 px-2.5 py-1 rounded w-fit">
                    <Bx icon="purchase-tag" className="text-base" /> {product.categorie}
                </span>

                <div className="flex flex-col gap-1.5 text-base">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Bx icon="package" className="text-lg text-slate-400" />
                        <span>Stock : <strong className="text-slate-800 font-semibold">{product.stock}</strong> {product.unite}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                        <Bx icon="dollar-circle" className="text-lg text-slate-400" />
                        <span>Prix : <strong className="text-slate-800 font-semibold">{formatAr(product.prixVente)}</strong></span>
                    </div>
                </div>

                <div className="flex justify-end gap-1 pt-2.5 border-t border-slate-100">
                    <button onClick={() => onView(product)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 rounded hover:bg-slate-100 transition-all"><Bx icon="show" className="text-base" /> Voir</button>
                    <button onClick={() => onEdit(product)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 rounded hover:bg-sky-50 hover:text-sky-600 transition-all"><Bx icon="edit" className="text-base" /> Modifier</button>
                    <button onClick={() => onDelete(product)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 rounded hover:bg-red-50 hover:text-red-500 transition-all"><Bx icon="trash" className="text-base" /> Supprimer</button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object.isRequired,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default ProductCard;