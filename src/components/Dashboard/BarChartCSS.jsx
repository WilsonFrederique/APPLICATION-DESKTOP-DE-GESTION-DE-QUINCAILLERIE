import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { formatAr } from '../../utils/function/format';

const BarChartCSS = ({ data, mode }) => {
    // tooltip stocke { item, mouseX, mouseY } en coordonnées page
    const [tooltip, setTooltip] = useState(null);
    const containerRef = useRef(null);

    const maxVal = useMemo(() =>
        Math.max(...data.map(d => mode === 'ventes' ? d.ventes : d.ca)),
        [data, mode]);

    const yTicks = useMemo(() => {
        const steps = 5;
        return Array.from({ length: steps + 1 }, (_, i) =>
            Math.round((maxVal / steps) * (steps - i))
        );
    }, [maxVal]);

    const formatY = (v) => {
        if (mode !== 'ca') return v;
        if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
        if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
        return v;
    };

    const CHART_H = 260;
    const Y_LABEL_W = mode === 'ca' ? 44 : 32;

    const handleMouseMove = (e, item) => {
        setTooltip({ item, mouseX: e.clientX, mouseY: e.clientY });
    };
    const handleMouseLeave = () => setTooltip(null);

    return (
        <div ref={containerRef} className="w-full relative select-none">

            {/* Zone graphique */}
            <div className="flex gap-0" style={{ paddingLeft: Y_LABEL_W }}>

                {/* Axe Y */}
                <div
                    className="absolute left-0 top-0 flex flex-col justify-between pr-2 text-right"
                    style={{ width: Y_LABEL_W, height: CHART_H }}
                >
                    {yTicks.map(t => (
                        <span key={t} className="text-[10px] font-semibold text-slate-400 leading-none">
                            {formatY(t)}
                        </span>
                    ))}
                </div>

                {/* Barres + grille */}
                <div
                    className="relative flex-1 flex items-end gap-[3px]"
                    style={{ height: CHART_H }}
                >
                    {/* Lignes de grille */}
                    {yTicks.map(t => (
                        <div
                            key={t}
                            className="absolute left-0 right-0 border-t border-slate-100"
                            style={{ bottom: `${(t / maxVal) * 100}%` }}
                        />
                    ))}

                    {/* Barres */}
                    {data.map((item, index) => {
                        const val = mode === 'ventes' ? item.ventes : item.ca;
                        const pct = maxVal > 0 ? (val / maxVal) * 100 : 0;
                        const ratio = maxVal > 0 ? val / maxVal : 0;
                        const opacity = 0.45 + ratio * 0.55;
                        const isHovered = tooltip?.item?.ref === item.ref;

                        return (
                            <div
                                key={item.ref}
                                className="relative flex-1 flex flex-col items-center justify-end"
                                style={{ height: '100%', cursor: 'pointer' }}
                                onMouseMove={(e) => handleMouseMove(e, item)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Zone hover invisible toute hauteur */}
                                <div className="absolute inset-0" />

                                {/* Barre */}
                                <div
                                    className="w-full rounded-t-[3px] transition-all duration-200"
                                    style={{
                                        height: `${pct}%`,
                                        minHeight: pct > 0 ? 2 : 0,
                                        backgroundColor: `rgba(2,132,199,${opacity})`,
                                        filter: isHovered ? 'brightness(1.15)' : 'none',
                                        transform: isHovered ? 'scaleY(1.02)' : 'scaleY(1)',
                                        transformOrigin: 'bottom',
                                    }}
                                />

                                {/* Label X */}
                                <div
                                    className="absolute w-full text-center"
                                    style={{ top: CHART_H + 6 }}
                                >
                                    <span
                                        className="text-[9px] font-semibold text-slate-400 block"
                                        style={{
                                            writingMode: data.length > 10 ? 'vertical-rl' : 'horizontal-tb',
                                            transform: data.length > 10 ? 'rotate(180deg)' : 'none',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            maxHeight: data.length > 10 ? 72 : 'none',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {item.nom.length > 10 ? item.nom.slice(0, 9) + '…' : item.nom}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tooltip — positionné en fixed sur les coordonnées souris */}
            {tooltip && (
                <div
                    className="fixed z-9999 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-2xl border border-white/10 pointer-events-none"
                    style={{
                        left: tooltip.mouseX + 14,
                        top: tooltip.mouseY - 70,
                        minWidth: 170,
                    }}
                >
                    <p className="text-sm font-bold text-white mb-1.5 whitespace-nowrap">
                        {tooltip.item.nom}
                    </p>
                    <p className="text-xs text-slate-300">
                        <span className="text-white font-bold">{tooltip.item.ventes}</span> ventes
                    </p>
                    <p className="text-xs text-sky-300 mt-0.5">{formatAr(tooltip.item.ca)}</p>
                </div>
            )}
        </div>
    );
};

BarChartCSS.propTypes = {
    data: PropTypes.array.isRequired,
    mode: PropTypes.string,
};

export default BarChartCSS;