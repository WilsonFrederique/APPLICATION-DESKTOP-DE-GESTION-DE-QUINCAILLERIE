import React, { useState, useMemo } from 'react';
import Input from '../../components/UI/Input/Input';
import Bx from '../../components/UI/Boxicon';
import BarChartCSS from '../../components/Dashboard/BarChartCSS';
import KpiCard from '../../components/Dashboard/KpiCard';
import StockRow from '../../components/Dashboard/StockRow';
import { formatAr } from '../../utils/function/format';

const TODAY = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});

const TOP_PRODUITS = [
    { nom: 'Ciment 50kg', ref: 'CIM-50KG', ventes: 312, ca: 15600000 },
    { nom: 'Tôle Galv. 3m', ref: 'TOL-GALV', ventes: 287, ca: 86100000 },
    { nom: 'Vis à Bois 5×50', ref: 'VIS-BOIS', ventes: 264, ca: 660000 },
    { nom: 'Peinture Blanche 10L', ref: 'PEINT-BLC', ventes: 241, ca: 28920000 },
    { nom: 'Sable Fin 25kg', ref: 'SAB-FIN', ventes: 228, ca: 4560000 },
    { nom: 'Parpaing 20cm', ref: 'PARP-20', ventes: 209, ca: 5225000 },
    { nom: 'Planche Pin 3m', ref: 'PLN-PIN', ventes: 195, ca: 9750000 },
    { nom: 'Clous 3cm (kg)', ref: 'CLO-3CM', ventes: 183, ca: 915000 },
    { nom: 'Tige Fer 12mm', ref: 'TIG-12', ventes: 171, ca: 17100000 },
    { nom: 'Grillage 1m', ref: 'GRL-1M', ventes: 158, ca: 3160000 },
    { nom: 'Colle Carrelage', ref: 'COL-CAR', ventes: 144, ca: 3600000 },
    { nom: 'Câble Élec. 2.5mm', ref: 'CAB-ELEC', ventes: 132, ca: 6600000 },
    { nom: 'Plaque Fibro', ref: 'PLQ-FIB', ventes: 119, ca: 11900000 },
    { nom: 'Tuyau PVC 100mm', ref: 'TUY-PVC', ventes: 108, ca: 5400000 },
    { nom: 'Enduit Façade', ref: 'END-FAC', ventes: 97, ca: 2910000 },
    { nom: 'Robinet Laiton', ref: 'ROB-LAI', ventes: 89, ca: 4450000 },
    { nom: 'Serrure Entrée', ref: 'SER-ENT', ventes: 78, ca: 7800000 },
    { nom: 'Charnière 3"', ref: 'CHA-3PO', ventes: 67, ca: 670000 },
    { nom: 'Peinture Ext. 5L', ref: 'PEINT-EXT', ventes: 58, ca: 4060000 },
    { nom: 'Mortier Colle 25kg', ref: 'MOR-COL', ventes: 47, ca: 1175000 },
];

const STOCK_CRITIQUE = [
    { nom: 'Ciment Portland 50kg', ref: 'CIM-50KG', stock: 15, seuilMin: 20 },
    { nom: 'Tôle galvanisée 3m', ref: 'TOL-GALV-3M', stock: 8, seuilMin: 10 },
    { nom: 'Vis à bois 5×50mm', ref: 'VIS-BOIS-5x50', stock: 5, seuilMin: 20 },
    { nom: 'Peinture ext. 10L', ref: 'PEINT-EXT-10L', stock: 3, seuilMin: 15 },
    { nom: 'Sable fin (sac 25kg)', ref: 'SAB-FIN-25KG', stock: 12, seuilMin: 25 },
];

const Dashboard = () => {
    const [search, setSearch] = useState('');
    const [barMode, setBarMode] = useState('ventes');
    const [barCount, setBarCount] = useState(20);

    const chartData = useMemo(() =>
        TOP_PRODUITS.slice(0, barCount),
        [barCount]);

    const totalChart = useMemo(() =>
        chartData.reduce((s, p) => s + (barMode === 'ventes' ? p.ventes : p.ca), 0),
        [chartData, barMode]);

    return (
        <div className="flex flex-col overflow-y-auto overflow-x-hidden bg-transparent h-full p-3 gap-3">

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
                <KpiCard title="Ventes du jour" value="24" subtitle="8 en attente de paiement" icon="cart" trend={12.4} iconBg="bg-sky-50 text-sky-600" />
                <KpiCard title="Chiffre d'affaires" value={formatAr(1250000)} subtitle="Aujourd'hui" icon="dollar-circle" trend={8.2} iconBg="bg-emerald-50 text-emerald-600" />
                <KpiCard title="Crédits en cours" value={formatAr(358000)} subtitle="3 clients concernés" icon="time" trend={-3.1} iconBg="bg-amber-50 text-amber-600" />
                <KpiCard title="Taux de conversion" value="68.5%" subtitle="Sur les 30 derniers jours" icon="trending-up" trend={2.5} iconBg="bg-violet-50 text-violet-600" />
            </div>

            {/* ══ Contenu principal ══ */}
            <div className="grid grid-cols-[1fr_300px] gap-3 min-h-0">

                {/* ── Histogramme ── */}
                <div className="bg-white border border-slate-200 rounded hover:shadow-lg hover:shadow-slate-100 flex flex-col overflow-hidden">

                    {/* Header */}
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
                        <div className="flex items-center gap-2">
                            <div className="flex rounded overflow-hidden border border-slate-200">
                                {[{ key: 'ventes', label: 'Ventes' }, { key: 'ca', label: 'CA' }].map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setBarMode(m.key)}
                                        className={`px-3 py-1.5 text-xs font-bold transition-all ${barMode === m.key ? 'bg-sky-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>
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

                    {/* Chart */}
                    <div className="flex-1 px-5 pt-5 pb-4" style={{ minHeight: 340 }}>
                        <BarChartCSS data={chartData} mode={barMode} />
                    </div>

                    {/* Pied */}
                    <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 shrink-0 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-sky-600" />
                            <span className="text-xs text-slate-500">
                                {barMode === 'ventes' ? 'Nombre de ventes' : "Chiffre d'affaires (Ar)"}
                            </span>
                        </div>
                        <span className="text-xs text-slate-400">
                            Total : <strong className="text-slate-600">
                                {barMode === 'ventes' ? `${totalChart} ventes` : formatAr(totalChart)}
                            </strong>
                        </span>
                    </div>
                </div>

                {/* ── Colonne droite ── */}
                <div className="flex flex-col gap-3">

                    {/* Stock critique */}
                    <div className="bg-white border border-slate-200 rounded hover:shadow-lg hover:shadow-slate-100 flex flex-col overflow-hidden">
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
                        <div className="px-4 py-1">
                            {STOCK_CRITIQUE.map((p, i) => <StockRow key={p.ref} product={p} index={i} />)}
                        </div>
                        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50 shrink-0">
                            <button className="text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors flex items-center gap-1">
                                Gérer les stocks <Bx icon="right-arrow-alt" className="text-base" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;