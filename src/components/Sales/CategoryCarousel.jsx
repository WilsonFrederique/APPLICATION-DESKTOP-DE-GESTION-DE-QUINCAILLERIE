import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Bx from '../UI/Boxicon';

const CategoryCarousel = ({ categories, selected, onChange, productCounts }) => {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: dir * 180, behavior: 'smooth' });
        }
    };

    const allCategories = [{ value: 'all', label: 'Tout' }, ...categories.map(c => ({ value: c, label: c }))];

    return (
        <div className="flex items-center gap-1 pb-3">
            <button
                onClick={() => scroll(-1)}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer"
            >
                <Bx icon="chevron-left" className="text-lg" />
            </button>

            <div
                ref={scrollRef}
                className="flex-1 flex items-center gap-2 overflow-x-auto"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {allCategories.map(({ value, label }) => {
                    const isActive = selected === value;
                    const count = value === 'all' ? productCounts.total : (productCounts[value] ?? 0);
                    return (
                        <button
                            key={value}
                            onClick={() => onChange(value)}
                            className={`flex items-center gap-2 px-3 py-2 rounded border text-sm font-semibold whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${isActive
                                ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50'
                                }`}
                        >
                            {label}
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Arrow right */}
            <button
                onClick={() => scroll(1)}
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-sky-600 hover:border-sky-300 transition-all cursor-pointer"
            >
                <Bx icon="chevron-right" className="text-lg" />
            </button>
        </div>
    );
};

CategoryCarousel.propTypes = {
    categories: PropTypes.array,
    selected: PropTypes.string,
    onChange: PropTypes.func,
    productCounts: PropTypes.object,
}

export default CategoryCarousel;