import React from 'react';
import PropTypes from 'prop-types';
import Bx from '../UI/Boxicon';

const CategoryCard = ({ category, onEdit, onDelete }) => (
    <div className="bg-white border border-slate-200 rounded p-5 flex gap-4 hover:shadow-lg hover:shadow-slate-100 hover:border-slate-300 transition-all">
        {/* Icône */}
        <div className="w-16 h-16 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500 shrink-0">
            <Bx icon="category" className="text-4xl" />
        </div>

        {/* Contenu */}
        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-slate-800 m-0 flex-1 leading-snug">{category.nom}</h3>
                <span className="bg-sky-50 text-sky-600 px-3 py-0.5 rounded text-sm font-semibold whitespace-nowrap shrink-0">
                    {category.produitsCount} produit{category.produitsCount > 1 ? 's' : ''}
                </span>
            </div>

            {category.description && (
                <p className="text-base text-slate-500 m-0 leading-relaxed line-clamp-2">{category.description}</p>
            )}

            <p className="text-sm text-slate-400 m-0">
                Créée le {new Date(category.dateCreation).toLocaleDateString('fr-FR')}
            </p>

            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                <button
                    onClick={() => onEdit(category)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-600 rounded hover:bg-slate-100 transition-all"
                >
                    <Bx icon="edit" className="text-base" /> Modifier
                </button>
                <button
                    onClick={() => onDelete(category)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-500 rounded hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <Bx icon="trash" className="text-base" /> Supprimer
                </button>
            </div>
        </div>
    </div>
);

CategoryCard.propTypes = {
    category: PropTypes.object.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default CategoryCard;