import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import Input from '../../Input/Input';
import Bx from '../../UI/Boxicon';
import { formatAr } from '../../../utils/function/format';

/* ─── Mock data ─── */
const TODAY = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const TOP_PRODUITS = [
    { nom: 'Ciment 50kg',           ref: 'CIM-50KG',       ventes: 312, ca: 15600000 },
    { nom: 'Tôle Galv. 3m',         ref: 'TOL-GALV',       ventes: 287, ca: 86100000 },
    { nom: 'Vis à Bois 5×50',       ref: 'VIS-BOIS',       ventes: 264, ca:   660000 },
    { nom: 'Peinture Blanche 10L',  ref: 'PEINT-BLC',      ventes: 241, ca: 28920000 },
    { nom: 'Sable Fin 25kg',        ref: 'SAB-FIN',        ventes: 228, ca:  4560000 },
    { nom: 'Parpaing 20cm',         ref: 'PARP-20',        ventes: 209, ca:  5225000 },
    { nom: 'Planche Pin 3m',        ref: 'PLN-PIN',        ventes: 195, ca:  9750000 },
    { nom: 'Clous 3cm (kg)',        ref: 'CLO-3CM',        ventes: 183, ca:    915000 },
    { nom: 'Tige Fer 12mm',         ref: 'TIG-12',         ventes: 171, ca: 17100000 },
    { nom: 'Grillage 1m',           ref: 'GRL-1M',         ventes: 158, ca:  3160000 },
    { nom: 'Colle Carrelage 25kg',  ref: 'COL-CAR',        ventes: 144, ca:  3600000 },
    { nom: 'Câble Élec. 2.5mm',     ref: 'CAB-ELEC',       ventes: 132, ca:  6600000 },
    { nom: 'Plaque Fibro 1.2m',     ref: 'PLQ-FIB',        ventes: 119, ca: 11900000 },
    { nom: 'Tuyau PVC 100mm',       ref: 'TUY-PVC',        ventes: 108, ca:  5400000 },
    { nom: 'Enduit Façade 25kg',    ref: 'END-FAC',        ventes:  97, ca:  2910000 },
    { nom: 'Robinet Laiton',        ref: 'ROB-LAI',        ventes:  89, ca:  4450000 },
    { nom: 'Serrure Entrée',        ref: 'SER-ENT',        ventes:  78, ca:  7800000 },
    { nom: 'Charnière 3"',          ref: 'CHA-3PO',        ventes:  67, ca:    670000 },
    { nom: 'Peinture Ext. 5L',      ref: 'PEINT-EXT',      ventes:  58, ca:  4060000 },
    { nom: 'Mortier Colle 25kg',    ref: 'MOR-COL',        ventes:  47, ca:  1175000 },
];

const STOCK_CRITIQUE = [
    { nom: 'Ciment Portland 50kg',  ref: 'CIM-50KG',      stock: 15, seuilMin: 20 },
    { nom: 'Tôle galvanisée 3m',    ref: 'TOL-GALV-3M',   stock: 8,  seuilMin: 10 },
    { nom: 'Vis à bois 5×50mm',     ref: 'VIS-BOIS-5x50', stock: 5,  seuilMin: 20 },
    { nom: 'Peinture ext. 10L',     ref: 'PEINT-EXT-10L', stock: 3,  seuilMin: 15 },
    { nom: 'Sable fin (sac 25kg)',  ref: 'SAB-FIN-25KG',  stock: 12, seuilMin: 25 },
];

/* ─── Tooltip personnalisé ─── */
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-slate-800 text-white px-4 py-3 rounded shadow-xl border border-white/10 min-w-[160px]">
            <p className="text-sm font-bold text-white mb-1">{label}</p>
            <p className="text-xs text-slate-300">{payload[0]?.value} ventes</p>
            <p className="text-xs text-sky-300 mt-0.5">{formatAr(payload[0]?.payload?.ca)}</p>
        </div>
    );
};

/* ─── KPI Card ─── */
const KpiCard = ({ title, value, subtitle, icon, trend, iconBg }) => (
    <div className="bg-white border border-slate-200 rounded p-5 flex flex-col gap-3 hover:border-slate-300 hover:shadow-md transition-all">
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

/* ─── Stock row ─── */
const StockRow = ({ produit, index }) => {
    const pct     = Math.min(100, Math.round((produit.stock / produit.seuilMin) * 100));
    const isDanger = produit.stock <= 5;
    const isLow    = produit.stock <= produit.seuilMin * 0.5;

    return (
        <div
            className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-black ${isDanger ? 'bg-red-100 text-red-600' : isLow ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                {index + 1}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{produit.nom}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full ${isDanger ? 'bg-red-500' : isLow ? 'bg-amber-400' : 'bg-emerald-500'}`}
                            style={{ width: `${pct}%` }}
                        />
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${isDanger ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-500'}`}>
                        {produit.stock} / {produit.seuilMin}
                    </span>
                </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold shrink-0 ${isDanger ? 'bg-red-100 text-red-700' : isLow ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                {isDanger ? 'Critique' : isLow ? 'Faible' : 'Bas'}
            </span>
        </div>
    );
};

/* ══════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════ */
const Dashboard = () => {
    const [search,   setSearch]   = useState('');
    const [barMode,  setBarMode]  = useState('ventes'); // ventes | ca
    const [barCount, setBarCount] = useState(20);

    const chartData = useMemo(() =>
        TOP_PRODUITS.slice(0, barCount).map(p => ({
            nom:    p.nom.length > 14 ? p.nom.slice(0, 13) + '…' : p.nom,
            ventes: p.ventes,
            ca:     p.ca,
            ref:    p.ref,
        })),
        [barCount]);

    const maxVal = useMemo(() =>
        Math.max(...chartData.map(d => barMode === 'ventes' ? d.ventes : d.ca)),
        [chartData, barMode]);

    return (
        <div className="flex flex-col overflow-hidden bg-transparent h-full p-3 gap-3 [scrollbar-width:thin]">

            {/* ══ Header ══ */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-sky-600 rounded flex items-center justify-center shadow-md shadow-sky-200">
                        <Bx icon="store" className="text-2xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 leading-tight">Tableau de bord</h1>
                        <p className="text-sm text-slate-400 mt-0.5 capitalize">{TODAY}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-64">
                        <Input
                            type="text"
                            placeholder="Rechercher…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            name="dashSearch"
                            icon={<Bx icon="search" className="text-lg" />}
                            fullWidth
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 h-11 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded transition-all whitespace-nowrap shadow-sm shadow-sky-200">
                        <Bx icon="plus" className="text-lg" /> Nouvelle vente
                    </button>
                </div>
            </div>

            {/* ══ KPIs ══ */}
            <div className="grid grid-cols-4 gap-3 shrink-0">
                <KpiCard
                    title="Ventes du jour"
                    value="24"
                    subtitle="8 en attente de paiement"
                    icon="cart"
                    trend={12.4}
                    iconBg="bg-sky-50 text-sky-600"
                />
                <KpiCard
                    title="Chiffre d'affaires"
                    value="1.25M Ar"
                    subtitle="Aujourd'hui"
                    icon="dollar-circle"
                    trend={8.2}
                    iconBg="bg-emerald-50 text-emerald-600"
                />
                <KpiCard
                    title="Crédits en cours"
                    value="380K Ar"
                    subtitle="3 clients concernés"
                    icon="time"
                    trend={-3.1}
                    iconBg="bg-amber-50 text-amber-600"
                />
                <KpiCard
                    title="Taux de conversion"
                    value="68.5%"
                    subtitle="Sur les 30 derniers jours"
                    icon="trending-up"
                    trend={2.5}
                    iconBg="bg-violet-50 text-violet-600"
                />
            </div>

            {/* ══ Contenu principal ══ */}
            <div className="grid grid-cols-[1fr_300px] gap-3 flex-1 min-h-0 overflow-hidden">

                {/* ── Histogramme top produits ── */}
                <div className="bg-white border border-slate-200 rounded shadow-sm flex flex-col overflow-hidden">

                    {/* Header section */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-sky-50 rounded flex items-center justify-center text-sky-600">
                                <Bx icon="bar-chart-alt-2" className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Produits les plus vendus</h2>
                                <p className="text-xs text-slate-400 mt-0.5">30 derniers jours</p>
                            </div>
                        </div>

                        {/* Contrôles */}
                        <div className="flex items-center gap-2">
                            {/* Mode ventes / CA */}
                            <div className="flex rounded overflow-hidden border border-slate-200">
                                {[
                                    { key: 'ventes', label: 'Ventes' },
                                    { key: 'ca',     label: 'CA'     },
                                ].map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setBarMode(m.key)}
                                        className={`px-3 py-1.5 text-xs font-bold transition-all ${barMode === m.key ? 'bg-sky-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                            {/* Nombre de produits */}
                            <div className="flex rounded overflow-hidden border border-slate-200">
                                {[10, 15, 20].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setBarCount(n)}
                                        className={`px-3 py-1.5 text-xs font-bold transition-all ${barCount === n ? 'bg-slate-700 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        Top {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Graphique */}
                    <div className="flex-1 p-4 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 4, right: 8, left: 8, bottom: barCount > 10 ? 60 : 40 }}
                                barCategoryGap="28%"
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis
                                    dataKey="nom"
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={false}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={v => barMode === 'ca'
                                        ? v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}K`
                                        : v}
                                    width={barMode === 'ca' ? 44 : 32}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                                <Bar
                                    dataKey={barMode}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                >
                                    {chartData.map((entry, index) => {
                                        const ratio = (barMode === 'ventes' ? entry.ventes : entry.ca) / maxVal;
                                        const opacity = 0.45 + ratio * 0.55;
                                        return (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`rgba(2, 132, 199, ${opacity})`}
                                            />
                                        );
                                    })}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Légende bas */}
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm bg-sky-600 opacity-90" />
                                <span className="text-xs text-slate-500">
                                    {barMode === 'ventes' ? 'Nombre de ventes' : "Chiffre d'affaires (Ar)"}
                                </span>
                            </div>
                        </div>
                        <span className="text-xs text-slate-400">
                            Total : <strong className="text-slate-600">
                                {barMode === 'ventes'
                                    ? `${TOP_PRODUITS.slice(0, barCount).reduce((s, p) => s + p.ventes, 0)} ventes`
                                    : formatAr(TOP_PRODUITS.slice(0, barCount).reduce((s, p) => s + p.ca, 0))}
                            </strong>
                        </span>
                    </div>
                </div>

                {/* ── Colonne droite ── */}
                <div className="flex flex-col gap-3 overflow-hidden">

                    {/* Stock critique */}
                    <div className="bg-white border border-slate-200 rounded shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-50 rounded flex items-center justify-center text-red-500">
                                    <Bx icon="error-circle" className="text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-slate-800">Stock critique</h2>
                                    <p className="text-xs text-slate-400">À réapprovisionner</p>
                                </div>
                            </div>
                            <span className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-700 text-xs font-black rounded-full">
                                {STOCK_CRITIQUE.length}
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-1 [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent]">
                            {STOCK_CRITIQUE.map((p, i) => <StockRow key={p.ref} produit={p} index={i} />)}
                        </div>
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                            <button className="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1">
                                Gérer les stocks <Bx icon="right-arrow-alt" className="text-base" />
                            </button>
                        </div>
                    </div>

                    {/* Mini stats */}
                    <div className="grid grid-cols-2 gap-2 shrink-0">
                        {[
                            { label: 'Clients actifs',  value: '15',   icon: 'group',         bg: 'bg-sky-50',    text: 'text-sky-600'    },
                            { label: 'Panier moyen',    value: '52K',  icon: 'shopping-bag',  bg: 'bg-emerald-50',text: 'text-emerald-600' },
                            { label: 'Alertes stock',   value: '8',    icon: 'error',         bg: 'bg-amber-50',  text: 'text-amber-600'   },
                            { label: 'Satisfaction',    value: '94%',  icon: 'like',          bg: 'bg-violet-50', text: 'text-violet-600'  },
                        ].map(({ label, value, icon, bg, text }) => (
                            <div key={label} className="bg-white border border-slate-200 rounded p-3.5 flex items-center gap-3 hover:border-slate-300 transition-all">
                                <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${bg} ${text}`}>
                                    <Bx icon={icon} className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-slate-800 leading-none">{value}</p>
                                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;