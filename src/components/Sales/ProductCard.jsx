import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Bx from '../UI/Boxicon';
import { formatAr } from '../../utils/function/format';


const ProductCard = ({ product, onAddToCart }) => {
    const [unit, setUnit] = useState(product.unite);
    const isLowStock = product.stock <= product.seuilMin;

    const handleAddToCart = () => {
        onAddToCart({ ...product, quantity: 1, unit, price: unit === product.unite ? product.prixVente : product.prixDetail });
        setUnit(product.unite);
    };

    return (
        <div className="group bg-white rounded border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300">
            <div className="relative h-[120px] overflow-hidden bg-slate-50">
                <img src={product.image} alt={product.nom} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {isLowStock && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        <Bx icon="error" className="text-sm" /> Stock bas
                    </div>
                )}
                <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                    {product.categorie.split(' ')[0]}
                </span>
            </div>

            <div className="p-3 flex flex-col gap-3 flex-1">
                <div>
                    <h4 className="text-base font-bold text-slate-800 leading-snug line-clamp-2">{product.nom}</h4>
                </div>

                { isLowStock && (
                    <span className={`flex items-center gap-1.5 text-sm font-bold text-red-500`}>
                        <Bx icon="error-circle" className="text-base" />
                        Stock : {product.stock} {product.unite}
                    </span>
                ) }

                <div className="flex items-center gap-2 mt-auto">
                    {product.peutEtreVenduEnDetail ? (
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="flex-1 text-sm font-semibold text-slate-700 border border-slate-200 rounded px-1 py-2 bg-slate-50 cursor-pointer focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-100 transition-all"
                        >
                            <option value={product.unite}>{product.unite} · {formatAr(product.prixVente)}</option>
                            <option value={product.uniteDetail}>{product.uniteDetail} · {formatAr(product.prixDetail)}</option>
                        </select>
                    ) : (
                        <div className="flex-1 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-2 truncate">
                            {formatAr(product.prixVente)} / {product.unite}
                        </div>
                    )}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="w-8 h-8 flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded transition-all duration-150 active:scale-95 shrink-0 cursor-pointer"
                        aria-label={`Ajouter ${product.nom}`}
                    >
                        <Bx icon="plus" className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

ProductCard.propTypes = {
    product: PropTypes.object,
    onAddToCart: PropTypes.func,
}

export default ProductCard;
