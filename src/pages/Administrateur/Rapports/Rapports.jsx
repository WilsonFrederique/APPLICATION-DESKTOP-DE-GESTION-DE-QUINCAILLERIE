import React, { useState, useMemo, useRef } from 'react';
import styles from './Rapports.module.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoCalendarOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoEyeOutline,
  IoShareSocialOutline,
  IoAnalyticsOutline,
  IoBarChartOutline,
  IoPieChartOutline,
  IoStatsChartOutline,
  IoDocumentTextOutline,
  IoCashOutline,
  IoCartOutline,
  IoTrendingUpOutline,
  IoTrendingDownOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
  IoCloseCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoPeopleOutline,
  IoStorefrontOutline,
  IoGridOutline,
  IoListOutline
} from "react-icons/io5";
import { 
  FaChartLine, 
  FaUsers, 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaWarehouse,
  FaFileExcel,
  FaFilePdf,
  FaFileCsv,
  FaChartBar,
  FaChartPie
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCurrencyDollar, 
  TbReportAnalytics,
  TbChartLine,
  TbChartBar,
  TbChartPie2
} from "react-icons/tb";
import { 
  MdInventory, 
  MdCategory, 
  MdLocalShipping, 
  MdAttachMoney,
  MdDateRange,
  MdOutlineInsights
} from "react-icons/md";
import { Chip, emphasize, styled } from '@mui/material';
import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';

// Définir StyledBreadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

// Composant de carte de rapport
const ReportCard = ({ 
  title, 
  description, 
  icon, 
  color = 'primary',
  type = 'sales',
  onGenerate,
  delay = 0
}) => (
  <div 
    className={`${styles.reportCard} ${styles[color]}`}
    style={{ animationDelay: `${delay}ms` }}
    onClick={() => onGenerate(type)}
  >
    <div className={styles.reportBackground}></div>
    <div className={styles.reportContentWrapper}>
      <div className={styles.reportIconWrapper}>
        {icon}
      </div>
      <div className={styles.reportContent}>
        <h3 className={styles.reportTitle}>{title}</h3>
        <p className={styles.reportDescription}>{description}</p>
      </div>
      <div className={styles.reportArrow}>
        <IoChevronForwardOutline />
      </div>
    </div>
  </div>
);

// Composant de métrique de rapport
const ReportMetric = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  suffix = '',
  prefix = '',
  color = 'primary',
  delay = 0
}) => (
  <div 
    className={`${styles.reportMetric} ${styles[color]}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={styles.metricIcon}>
      {icon}
    </div>
    <div className={styles.metricContent}>
      <div className={styles.metricHeader}>
        <span className={styles.metricTitle}>{title}</span>
        {trend && (
          <span className={`${styles.metricTrend} ${trend === 'up' ? styles.positive : styles.negative}`}>
            {trend === 'up' ? <IoTrendingUpOutline /> : <IoTrendingDownOutline />}
            {trendValue}
          </span>
        )}
      </div>
      <div className={styles.metricValue}>
        {prefix}{value}{suffix}
      </div>
    </div>
  </div>
);

// Composant de tableau de données
const DataTable = ({ 
  title, 
  columns, 
  data, 
  keyField = 'id',
  sortable = true,
  onSort,
  onExport,
  delay = 0
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (!sortable) return;
    
    let newDirection = 'asc';
    if (sortColumn === column) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    
    setSortColumn(column);
    setSortDirection(newDirection);
    
    if (onSort) {
      onSort(column, newDirection);
    }
  };

  const formatValue = (value, type) => {
    if (type === 'currency') {
      return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0
      }).format(value);
    }
    if (type === 'percent') {
      return `${value}%`;
    }
    if (type === 'number') {
      return new Intl.NumberFormat('fr-MG').format(value);
    }
    return value;
  };

  return (
    <div 
      className={styles.dataTableContainer}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.tableHeader}>
        <h3 className={styles.tableTitle}>{title}</h3>
        {onExport && (
          <button className={styles.exportBtn} onClick={onExport}>
            <IoDownloadOutline />
            Exporter
          </button>
        )}
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`${styles.tableHeaderCell} ${sortable ? styles.sortable : ''} ${sortColumn === column.key ? styles.active : ''}`}
                  onClick={() => handleSort(column.key)}
                  style={{ width: column.width }}
                >
                  <span className={styles.headerContent}>
                    {column.label}
                    {sortable && (
                      <span className={styles.sortIndicator}>
                        {sortColumn === column.key && (
                          <span className={sortDirection === 'asc' ? styles.sortAsc : styles.sortDesc}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row[keyField] || rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={styles.tableDataCell}>
                    {column.render ? column.render(row[column.key], row) : formatValue(row[column.key], column.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className={styles.noData}>
          <IoDocumentTextOutline className={styles.noDataIcon} />
          <p className={styles.noDataText}>Aucune donnée disponible</p>
        </div>
      )}
    </div>
  );
};

// Composant de graphique
const ChartContainer = ({ 
  title, 
  type = 'bar', 
  data, 
  height = 300,
  onExport,
  delay = 0 
}) => {
  const chartRef = useRef(null);
  
  // Simuler un graphique avec des barres CSS
  const renderChart = () => {
    if (type === 'bar' && data) {
      const maxValue = Math.max(...data.datasets[0].data);
      
      return (
        <div className={styles.chartBars}>
          {data.labels.map((label, index) => {
            const value = data.datasets[0].data[index];
            const percentage = (value / maxValue) * 100;
            
            return (
              <div key={index} className={styles.chartBarGroup}>
                <div className={styles.chartBarLabel}>{label}</div>
                <div className={styles.chartBarContainer}>
                  <div 
                    className={`${styles.chartBar} ${styles[data.datasets[0].backgroundColor[index]]}`}
                    style={{ height: `${percentage}%` }}
                    title={`${value} ${data.datasets[0].label}`}
                  >
                    <span className={styles.chartBarValue}>{value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    if (type === 'line' && data) {
      return (
        <div className={styles.chartLineContainer}>
          <div className={styles.chartLine}>
            {/* Simuler une ligne de tendance */}
            <svg className={styles.lineSvg} viewBox="0 0 100 50" preserveAspectRatio="none">
              <path 
                d="M0,50 L20,40 L40,35 L60,20 L80,10 L100,0" 
                fill="none" 
                stroke="var(--primary-color)" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className={styles.chartLinePoints}>
              {data.datasets[0].data.map((value, index) => {
                const x = (index / (data.labels.length - 1)) * 100;
                const y = (1 - (value / Math.max(...data.datasets[0].data))) * 100;
                
                return (
                  <div 
                    key={index}
                    className={styles.chartPoint}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    title={`${data.labels[index]}: ${value}`}
                  >
                    <div className={styles.pointTooltip}>
                      {data.labels[index]}: {value.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.chartLineLabels}>
            {data.labels.map((label, index) => (
              <div key={index} className={styles.chartLineLabel}>{label}</div>
            ))}
          </div>
        </div>
      );
    }
    
    if (type === 'pie' && data) {
      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
      let cumulativeAngle = 0;
      
      return (
        <div className={styles.chartPieContainer}>
          <div className={styles.chartPie}>
            {data.datasets[0].data.map((value, index) => {
              const percentage = (value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = cumulativeAngle;
              cumulativeAngle += angle;
              
              return (
                <div 
                  key={index}
                  className={`${styles.pieSegment} ${styles[data.datasets[0].backgroundColor[index]]}`}
                  style={{
                    transform: `rotate(${startAngle}deg)`,
                    clipPath: `conic-gradient(at 50% 50%, transparent 0deg ${angle}deg, rgba(0,0,0,0.1) ${angle}deg)`
                  }}
                  title={`${data.labels[index]}: ${value} (${percentage.toFixed(1)}%)`}
                >
                  <div className={styles.segmentLabel} style={{ transform: `rotate(${angle/2}deg)` }}>
                    {percentage > 10 && `${percentage.toFixed(0)}%`}
                  </div>
                </div>
              );
            })}
            <div className={styles.pieCenter}>
              <span className={styles.pieTotal}>{total.toLocaleString()}</span>
            </div>
          </div>
          <div className={styles.pieLegend}>
            {data.labels.map((label, index) => (
              <div key={index} className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles[data.datasets[0].backgroundColor[index]]}`}></div>
                <span className={styles.legendLabel}>{label}</span>
                <span className={styles.legendValue}>
                  {data.datasets[0].data[index].toLocaleString()} ({((data.datasets[0].data[index] / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className={styles.chartPlaceholder}>
        <FaChartLine className={styles.placeholderIcon} />
        <p className={styles.placeholderText}>Aucune donnée disponible pour le graphique</p>
      </div>
    );
  };

  return (
    <div 
      className={`${styles.chartContainer} ${styles[type]}`}
      style={{ animationDelay: `${delay}ms`, minHeight: `${height}px` }}
    >
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
        <div className={styles.chartActions}>
          {onExport && (
            <button className={styles.chartActionBtn} onClick={onExport}>
              <IoDownloadOutline />
              Exporter
            </button>
          )}
          <button className={styles.chartActionBtn}>
            <IoPrintOutline />
            Imprimer
          </button>
        </div>
      </div>
      
      <div className={styles.chartBody} ref={chartRef} style={{ height: `${height}px` }}>
        {renderChart()}
      </div>
      
      <div className={styles.chartFooter}>
        <div className={styles.chartLegend}>
          {data && data.datasets && data.datasets.map((dataset, index) => (
            <div key={index} className={styles.chartLegendItem}>
              <div className={styles.legendIndicator} style={{ backgroundColor: `var(--${dataset.backgroundColor[index] || 'primary'}-color)` }}></div>
              <span className={styles.legendText}>{dataset.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant de filtre de période
const PeriodFilter = ({ 
  period, 
  onPeriodChange,
  startDate, 
  endDate, 
  onDateChange,
  customRanges = []
}) => {
  const periods = [
    { id: 'today', label: 'Aujourd\'hui' },
    { id: 'yesterday', label: 'Hier' },
    { id: 'week', label: 'Cette semaine' },
    { id: 'month', label: 'Ce mois' },
    { id: 'quarter', label: 'Ce trimestre' },
    { id: 'year', label: 'Cette année' },
    { id: 'custom', label: 'Période personnalisée' },
    ...customRanges
  ];

  return (
    <div className={styles.periodFilter}>
      <div className={styles.periodButtons}>
        {periods.map((p) => (
          <button
            key={p.id}
            className={`${styles.periodBtn} ${period === p.id ? styles.active : ''}`}
            onClick={() => onPeriodChange(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>
      
      {period === 'custom' && (
        <div className={styles.customDateRange}>
          <div className={styles.datePickerGroup}>
            <IoCalendarOutline className={styles.dateIcon} />
            <DatePicker
              selected={startDate}
              onChange={(date) => onDateChange(date, endDate)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className={styles.datePicker}
              dateFormat="dd/MM/yyyy"
              placeholderText="Date début"
              locale="fr"
            />
          </div>
          
          <span className={styles.dateSeparator}>à</span>
          
          <div className={styles.datePickerGroup}>
            <IoCalendarOutline className={styles.dateIcon} />
            <DatePicker
              selected={endDate}
              onChange={(date) => onDateChange(startDate, date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className={styles.datePicker}
              dateFormat="dd/MM/yyyy"
              placeholderText="Date fin"
              locale="fr"
            />
          </div>
          
          <button className={styles.applyDateBtn}>
            Appliquer
          </button>
        </div>
      )}
    </div>
  );
};

const Rapports = () => {
  // États pour les données
  const [reportType, setReportType] = useState('sales');
  const [period, setPeriod] = useState('month');
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [salesmanFilter, setSalesmanFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [viewMode, setViewMode] = useState('overview');
  
  // Données mock pour les rapports
  const mockSalesData = useMemo(() => [
    {
      id: 1,
      date: '15/03/2024',
      invoice: 'FAC-2024-00158',
      customer: 'SARL Batiment Plus',
      products: 12,
      amount: 1250000,
      payment: 'payé',
      delivery: 'livré',
      salesman: 'Rakoto Jean'
    },
    {
      id: 2,
      date: '14/03/2024',
      invoice: 'FAC-2024-00157',
      customer: 'Mr. Rakoto Jean',
      products: 3,
      amount: 380000,
      payment: 'crédit',
      delivery: 'non livré',
      salesman: 'Rasoa Niry'
    },
    {
      id: 3,
      date: '14/03/2024',
      invoice: 'FAC-2024-00156',
      customer: 'Entreprise Construction Pro',
      products: 25,
      amount: 2450000,
      payment: 'payé',
      delivery: 'livré',
      salesman: 'Rakoto Jean'
    },
    {
      id: 4,
      date: '13/03/2024',
      invoice: 'FAC-2024-00155',
      customer: 'Mme. Rasoa Niry',
      products: 5,
      amount: 125000,
      payment: 'payé',
      delivery: 'livré',
      salesman: 'Rasoa Niry'
    },
    {
      id: 5,
      date: '12/03/2024',
      invoice: 'FAC-2024-00154',
      customer: 'SARL Materiaux Express',
      products: 8,
      amount: 890000,
      payment: 'annulé',
      delivery: 'annulé',
      salesman: 'Rakoto Jean'
    },
    {
      id: 6,
      date: '11/03/2024',
      invoice: 'FAC-2024-00153',
      customer: 'Mr. Randria',
      products: 2,
      amount: 45000,
      payment: 'payé',
      delivery: 'livré',
      salesman: 'Rasoa Niry'
    },
    {
      id: 7,
      date: '10/03/2024',
      invoice: 'FAC-2024-00152',
      customer: 'Entreprise TP Plus',
      products: 15,
      amount: 1850000,
      payment: 'crédit',
      delivery: 'non livré',
      salesman: 'Rakoto Jean'
    },
    {
      id: 8,
      date: '09/03/2024',
      invoice: 'FAC-2024-00151',
      customer: 'Mme. Nirina',
      products: 7,
      amount: 320000,
      payment: 'payé',
      delivery: 'livré',
      salesman: 'Rasoa Niry'
    }
  ], []);

  const mockProductsData = useMemo(() => [
    {
      id: 1,
      name: 'Ciment 50kg',
      category: 'Matériaux Construction',
      sold: 1250,
      revenue: 47500000,
      stock: 15,
      threshold: 20,
      trend: '+12%'
    },
    {
      id: 2,
      name: 'Tôle Galvanisée 3m',
      category: 'Ferronnerie',
      sold: 845,
      revenue: 25350000,
      stock: 8,
      threshold: 10,
      trend: '+8%'
    },
    {
      id: 3,
      name: 'Vis à Bois 5x50',
      category: 'Quincaillerie',
      sold: 12500,
      revenue: 1875000,
      stock: 1200,
      threshold: 500,
      trend: '+15%'
    },
    {
      id: 4,
      name: 'Peinture Blanche 10L',
      category: 'Peinture',
      sold: 320,
      revenue: 9600000,
      stock: 5,
      threshold: 15,
      trend: '+5%'
    },
    {
      id: 5,
      name: 'Tuyau PVC 50mm',
      category: 'Plomberie',
      sold: 580,
      revenue: 2900000,
      stock: 22,
      threshold: 30,
      trend: '+10%'
    },
    {
      id: 6,
      name: 'Câble Électrique 2.5mm²',
      category: 'Électricité',
      sold: 450,
      revenue: 33750000,
      stock: 45,
      threshold: 20,
      trend: '+7%'
    },
    {
      id: 7,
      name: 'Marteau Professionnel',
      category: 'Outillage',
      sold: 120,
      revenue: 3000000,
      stock: 12,
      threshold: 5,
      trend: '+3%'
    }
  ], []);

  const mockFinancialData = useMemo(() => [
    {
      id: 1,
      month: 'Jan 2024',
      revenue: 18500000,
      cost: 12500000,
      profit: 6000000,
      margin: 32.4
    },
    {
      id: 2,
      month: 'Fév 2024',
      revenue: 21000000,
      cost: 14500000,
      profit: 6500000,
      margin: 31.0
    },
    {
      id: 3,
      month: 'Mar 2024',
      revenue: 24500000,
      cost: 16500000,
      profit: 8000000,
      margin: 32.7
    },
    {
      id: 4,
      month: 'Avr 2024',
      revenue: 19500000,
      cost: 13000000,
      profit: 6500000,
      margin: 33.3
    },
    {
      id: 5,
      month: 'Mai 2024',
      revenue: 22000000,
      cost: 15000000,
      profit: 7000000,
      margin: 31.8
    },
    {
      id: 6,
      month: 'Jun 2024',
      revenue: 23000000,
      cost: 15500000,
      profit: 7500000,
      margin: 32.6
    }
  ], []);

  // Données pour les graphiques
  const salesChartData = useMemo(() => ({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Ventes',
        data: [18500, 21000, 24500, 19500, 22000, 23000],
        backgroundColor: ['primary', 'secondary', 'success', 'warning', 'danger', 'info']
      }
    ]
  }), []);

  const productsChartData = useMemo(() => ({
    labels: ['Ciment', 'Tôle', 'Vis', 'Peinture', 'Tuyau', 'Câble', 'Marteau'],
    datasets: [
      {
        label: 'Ventes par produit',
        data: [1250, 845, 12500, 320, 580, 450, 120],
        backgroundColor: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'accent']
      }
    ]
  }), []);

  const categoryChartData = useMemo(() => ({
    labels: ['Matériaux', 'Ferronnerie', 'Quincaillerie', 'Peinture', 'Plomberie', 'Électricité', 'Outillage'],
    datasets: [
      {
        label: 'Ventes par catégorie',
        data: [47500, 25350, 1875, 9600, 2900, 33750, 3000],
        backgroundColor: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'accent']
      }
    ]
  }), []);

  // Calcul des métriques
  const metrics = useMemo(() => {
    const totalSales = mockSalesData.reduce((sum, sale) => sum + sale.amount, 0);
    const paidSales = mockSalesData.filter(s => s.payment === 'payé').reduce((sum, sale) => sum + sale.amount, 0);
    const creditSales = mockSalesData.filter(s => s.payment === 'crédit').reduce((sum, sale) => sum + sale.amount, 0);
    const deliveredSales = mockSalesData.filter(s => s.delivery === 'livré').length;
    const totalProducts = mockProductsData.reduce((sum, product) => sum + product.sold, 0);
    const criticalStock = mockProductsData.filter(p => p.stock <= p.threshold).length;
    
    return {
      totalSales,
      paidSales,
      creditSales,
      deliveredSales,
      totalProducts,
      criticalStock,
      averageSale: totalSales / mockSalesData.length,
      topProduct: mockProductsData.reduce((max, p) => p.revenue > max.revenue ? p : max, mockProductsData[0])
    };
  }, [mockSalesData, mockProductsData]);

  // Filtrage des données
  const filteredSalesData = useMemo(() => {
    let filtered = [...mockSalesData];
    
    // Filtre par statut de paiement
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(sale => sale.payment === paymentFilter);
    }
    
    // Filtre par vendeur
    if (salesmanFilter !== 'all') {
      filtered = filtered.filter(sale => sale.salesman === salesmanFilter);
    }
    
    return filtered;
  }, [mockSalesData, paymentFilter, salesmanFilter]);

  const filteredProductsData = useMemo(() => {
    if (categoryFilter === 'all') return mockProductsData;
    return mockProductsData.filter(product => product.category === categoryFilter);
  }, [mockProductsData, categoryFilter]);

  // Fonctions de gestion
  const handleGenerateReport = (type) => {
    setReportType(type);
    setViewMode('detailed');
    
    // Simuler la génération d'un rapport
    console.log(`Génération du rapport: ${type}`);
    
    // Dans une application réelle, vous récupéreriez les données ici
    // fetchReportData(type, startDate, endDate);
  };

  const handleExport = (format, data) => {
    let content, mimeType, extension;
    
    switch (format) {
      case 'pdf':
        // Simuler l'export PDF
        alert(`Export PDF généré pour ${data.length} enregistrements`);
        break;
      case 'excel':
        // Simuler l'export Excel
        content = data.map(row => Object.values(row).join(',')).join('\n');
        mimeType = 'application/vnd.ms-excel';
        extension = 'xlsx';
        break;
      case 'csv':
        content = data.map(row => Object.values(row).join(',')).join('\n');
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      default:
        return;
    }
    
    if (content) {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${reportType}-${new Date().toISOString().split('T')[0]}.${extension}`;
      a.click();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-MG').format(number);
  };

  // Colonnes pour les tableaux
  const salesColumns = [
    { key: 'date', label: 'Date', width: '100px' },
    { key: 'invoice', label: 'Facture', width: '120px' },
    { key: 'customer', label: 'Client', width: '150px' },
    { key: 'products', label: 'Produits', width: '80px', type: 'number' },
    { 
      key: 'amount', 
      label: 'Montant', 
      width: '120px',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'payment', 
      label: 'Paiement', 
      width: '100px',
      render: (value) => (
        <span className={`${styles.statusBadge} ${styles[value]}`}>
          {value === 'payé' && <IoCheckmarkCircleOutline />}
          {value === 'crédit' && <IoAlertCircleOutline />}
          {value === 'annulé' && <IoCloseCircleOutline />}
          {value}
        </span>
      )
    },
    { 
      key: 'delivery', 
      label: 'Livraison', 
      width: '100px',
      render: (value) => (
        <span className={`${styles.statusBadge} ${styles[value.replace(' ', '_')]}`}>
          {value === 'livré' && <IoCheckmarkCircleOutline />}
          {value === 'non livré' && <IoTimeOutline />}
          {value === 'annulé' && <IoCloseCircleOutline />}
          {value}
        </span>
      )
    },
    { key: 'salesman', label: 'Vendeur', width: '120px' }
  ];

  const productsColumns = [
    { key: 'name', label: 'Produit', width: '200px' },
    { key: 'category', label: 'Catégorie', width: '150px' },
    { key: 'sold', label: 'Vendus', width: '100px', type: 'number' },
    { 
      key: 'revenue', 
      label: 'Chiffre d\'affaires', 
      width: '150px',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'stock', 
      label: 'Stock', 
      width: '100px',
      render: (value, row) => (
        <span className={`${row.stock <= row.threshold ? styles.stockCritical : styles.stockGood}`}>
          {formatNumber(value)}
        </span>
      )
    },
    { 
      key: 'trend', 
      label: 'Tendance', 
      width: '100px',
      render: (value) => (
        <span className={`${styles.trendBadge} ${value.startsWith('+') ? styles.positive : styles.negative}`}>
          {value}
        </span>
      )
    }
  ];

  const financialColumns = [
    { key: 'month', label: 'Mois', width: '120px' },
    { 
      key: 'revenue', 
      label: 'Chiffre d\'affaires', 
      width: '150px',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'cost', 
      label: 'Coût', 
      width: '150px',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'profit', 
      label: 'Bénéfice', 
      width: '150px',
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'margin', 
      label: 'Marge', 
      width: '100px',
      render: (value) => (
        <span className={`${styles.marginBadge} ${value >= 30 ? styles.high : value >= 25 ? styles.medium : styles.low}`}>
          {value}%
        </span>
      )
    }
  ];

  return (
    <div className={styles.dashboardModern}>
      <div className={styles.dashboardContent}>
        {/* Header */}
        <div className={`${styles.header} ${styles.administrationHeader}`}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <div className={styles.headerTitleContent}>
                <h1 className={styles.dashboardTitle}>
                  Rapports & <span className={styles.highlight}>Analyses</span>
                </h1>
                <p className={styles.dashboardSubtitle}>
                  Analysez les performances, générez des rapports détaillés et suivez les tendances
                </p>
              </div>
            </div>
            
            {/* Métriques rapides */}
            <div className={styles.quickStats}>
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.primary}`}>
                  <TbCurrencyDollar />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{formatCurrency(metrics.totalSales)}</span>
                  <span className={styles.statLabel}>Ventes totales</span>
                </div>
              </div>
              
              <div className={styles.quickStatItem}>
                <div className={`${styles.statIcon} ${styles.warning}`}>
                  <IoCartOutline />
                </div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{formatNumber(metrics.totalProducts)}</span>
                  <span className={styles.statLabel}>Produits vendus</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.headerBreadcrumbs}>
            <Breadcrumbs aria-label="breadcrumb">
              <StyledBreadcrumb
                component="span"
                label="Accueil"
                icon={<HomeIcon fontSize="small" />}
                onClick={() => window.location.href = '/'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    window.location.href = '/';
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
              <StyledBreadcrumb
                label="Administration"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
              <StyledBreadcrumb
                label="Rapports"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Barre de contrôle */}
        <div className={styles.dashboardControls}>
          <div className={styles.controlsLeft}>
            <PeriodFilter
              period={period}
              onPeriodChange={setPeriod}
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              customRanges={[
                { id: 'last7', label: '7 derniers jours' },
                { id: 'last30', label: '30 derniers jours' },
                { id: 'last90', label: '90 derniers jours' }
              ]}
            />
          </div>
          
          <div className={styles.controlsRight}>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewBtn} ${viewMode === 'overview' ? styles.active : ''}`}
                onClick={() => setViewMode('overview')}
                title="Vue d'ensemble"
              >
                <IoGridOutline />
                <span>Vue d'ensemble</span>
              </button>
              <button 
                className={`${styles.viewBtn} ${viewMode === 'detailed' ? styles.active : ''}`}
                onClick={() => setViewMode('detailed')}
                title="Rapport détaillé"
              >
                <IoListOutline />
                <span>Détaillé</span>
              </button>
            </div>
            
            <div className={styles.exportButtons}>
              <button 
                className={`${styles.exportBtn} ${styles.pdf}`}
                onClick={() => handleExport('pdf', filteredSalesData)}
              >
                <FaFilePdf />
                PDF
              </button>
              <button 
                className={`${styles.exportBtn} ${styles.excel}`}
                onClick={() => handleExport('excel', filteredSalesData)}
              >
                <FaFileExcel />
                Excel
              </button>
              <button 
                className={`${styles.exportBtn} ${styles.csv}`}
                onClick={() => handleExport('csv', filteredSalesData)}
              >
                <FaFileCsv />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Filtres avancés */}
        <div className={styles.advancedFilters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Type de rapport:</label>
            <select 
              className={styles.filterSelect}
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="sales">Ventes</option>
              <option value="products">Produits</option>
              <option value="financial">Financier</option>
              <option value="inventory">Inventaire</option>
              <option value="customers">Clients</option>
              <option value="salesmen">Vendeurs</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Catégorie:</label>
            <select 
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">Toutes catégories</option>
              <option value="Matériaux Construction">Matériaux</option>
              <option value="Ferronnerie">Ferronnerie</option>
              <option value="Quincaillerie">Quincaillerie</option>
              <option value="Peinture">Peinture</option>
              <option value="Plomberie">Plomberie</option>
              <option value="Électricité">Électricité</option>
              <option value="Outillage">Outillage</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Paiement:</label>
            <select 
              className={styles.filterSelect}
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="payé">Payé</option>
              <option value="crédit">Crédit</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Vendeur:</label>
            <select 
              className={styles.filterSelect}
              value={salesmanFilter}
              onChange={(e) => setSalesmanFilter(e.target.value)}
            >
              <option value="all">Tous les vendeurs</option>
              <option value="Rakoto Jean">Rakoto Jean</option>
              <option value="Rasoa Niry">Rasoa Niry</option>
            </select>
          </div>
        </div>

        {/* Vue d'ensemble des rapports */}
        {viewMode === 'overview' && (
          <>
            {/* Métriques principales */}
            <section className={styles.dashboardSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                  <IoStatsChartOutline className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Indicateurs Clés</h2>
                </div>
                <div className={styles.sectionActions}>
                  <button className={styles.sectionActionBtn}>
                    <IoRefreshOutline />
                    Actualiser
                  </button>
                </div>
              </div>
              
              <div className={styles.metricsGrid}>
                <ReportMetric
                  title="Chiffre d'affaires"
                  value={formatCurrency(metrics.totalSales)}
                  icon={<TbCurrencyDollar />}
                  trend="up"
                  trendValue="12.4%"
                  color="primary"
                  delay={100}
                />
                
                <ReportMetric
                  title="Ventes payées"
                  value={formatCurrency(metrics.paidSales)}
                  icon={<IoCheckmarkCircleOutline />}
                  trend="up"
                  trendValue="8.2%"
                  color="success"
                  delay={200}
                />
                
                <ReportMetric
                  title="Crédits clients"
                  value={formatCurrency(metrics.creditSales)}
                  icon={<IoAlertCircleOutline />}
                  trend="down"
                  trendValue="3.1%"
                  color="warning"
                  delay={300}
                />
                
                <ReportMetric
                  title="Produits vendus"
                  value={formatNumber(metrics.totalProducts)}
                  icon={<FaBox />}
                  trend="up"
                  trendValue="15.3%"
                  color="accent"
                  delay={400}
                />
                
                <ReportMetric
                  title="Livraisons"
                  value={`${metrics.deliveredSales}/${mockSalesData.length}`}
                  icon={<FaTruck />}
                  trend="up"
                  trendValue="5.7%"
                  color="info"
                  delay={500}
                />
                
                <ReportMetric
                  title="Stock critique"
                  value={metrics.criticalStock}
                  icon={<IoAlertCircleOutline />}
                  trend="up"
                  trendValue="Attention!"
                  color="danger"
                  delay={600}
                />
              </div>
            </section>

            {/* Rapports disponibles */}
            <section className={styles.dashboardSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                  <TbReportAnalytics className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Rapports Disponibles</h2>
                </div>
                <p className={styles.sectionSubtitle}>
                  Cliquez sur un rapport pour le générer
                </p>
              </div>
              
              <div className={styles.reportsGrid}>
                <ReportCard
                  title="Rapport des Ventes"
                  description="Analyse détaillée des ventes par période, vendeur et client"
                  icon={<IoCartOutline />}
                  color="primary"
                  type="sales"
                  onGenerate={handleGenerateReport}
                  delay={100}
                />
                
                <ReportCard
                  title="Performance des Produits"
                  description="Top produits, rotation des stocks et tendances"
                  icon={<FaBox />}
                  color="success"
                  type="products"
                  onGenerate={handleGenerateReport}
                  delay={200}
                />
                
                <ReportCard
                  title="Rapport Financier"
                  description="Bénéfices, marges et analyse des coûts"
                  icon={<FaMoneyBillWave />}
                  color="accent"
                  type="financial"
                  onGenerate={handleGenerateReport}
                  delay={300}
                />
                
                <ReportCard
                  title="État du Stock"
                  description="Niveaux de stock, alertes et réapprovisionnement"
                  icon={<FaWarehouse />}
                  color="warning"
                  type="inventory"
                  onGenerate={handleGenerateReport}
                  delay={400}
                />
                
                <ReportCard
                  title="Analyse Clients"
                  description="Comportement d'achat et fidélisation"
                  icon={<FaUsers />}
                  color="info"
                  type="customers"
                  onGenerate={handleGenerateReport}
                  delay={500}
                />
                
                <ReportCard
                  title="Performance Vendeurs"
                  description="Productivité et comparaison des vendeurs"
                  icon={<IoPeopleOutline />}
                  color="secondary"
                  type="salesmen"
                  onGenerate={handleGenerateReport}
                  delay={600}
                />
              </div>
            </section>

            {/* Graphiques d'aperçu */}
            <section className={styles.dashboardSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitleWrapper}>
                  <FaChartLine className={styles.sectionIcon} />
                  <h2 className={styles.sectionTitle}>Aperçu Graphique</h2>
                </div>
                <div className={styles.sectionActions}>
                  <button className={styles.sectionActionBtn}>
                    <IoShareSocialOutline />
                    Partager
                  </button>
                </div>
              </div>
              
              <div className={styles.chartsGrid}>
                <ChartContainer
                  title="Évolution des Ventes"
                  type="line"
                  data={salesChartData}
                  height={300}
                  onExport={() => handleExport('pdf', salesChartData)}
                  delay={100}
                />
                
                <ChartContainer
                  title="Ventes par Catégorie"
                  type="pie"
                  data={categoryChartData}
                  height={300}
                  onExport={() => handleExport('pdf', categoryChartData)}
                  delay={200}
                />
              </div>
            </section>
          </>
        )}

        {/* Vue détaillée des rapports */}
        {viewMode === 'detailed' && (
          <>
            {/* En-tête du rapport */}
            <div className={styles.reportHeader}>
              <div className={styles.reportHeaderContent}>
                <div className={styles.reportTitleSection}>
                  <h2 className={styles.reportMainTitle}>
                    {reportType === 'sales' && 'Rapport des Ventes'}
                    {reportType === 'products' && 'Performance des Produits'}
                    {reportType === 'financial' && 'Rapport Financier'}
                    {reportType === 'inventory' && 'État du Stock'}
                    {reportType === 'customers' && 'Analyse Clients'}
                    {reportType === 'salesmen' && 'Performance Vendeurs'}
                  </h2>
                  <p className={styles.reportPeriod}>
                    Période: {startDate.toLocaleDateString('fr-FR')} - {endDate.toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className={styles.reportActions}>
                  <button 
                    className={`${styles.reportActionBtn} ${styles.primary}`}
                    onClick={handlePrint}
                  >
                    <IoPrintOutline />
                    Imprimer
                  </button>
                  <button 
                    className={`${styles.reportActionBtn} ${styles.secondary}`}
                    onClick={() => handleExport('pdf', filteredSalesData)}
                  >
                    <FaFilePdf />
                    PDF Complet
                  </button>
                </div>
              </div>
              
              <div className={styles.reportSummary}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Date de génération:</span>
                  <span className={styles.summaryValue}>{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Nombre d'enregistrements:</span>
                  <span className={styles.summaryValue}>{filteredSalesData.length}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total général:</span>
                  <span className={styles.summaryValue}>{formatCurrency(metrics.totalSales)}</span>
                </div>
              </div>
            </div>

            {/* Graphiques détaillés */}
            <div className={styles.detailedCharts}>
              <ChartContainer
                title={reportType === 'sales' ? 'Évolution des Ventes' : 'Distribution par Catégorie'}
                type={reportType === 'sales' ? 'line' : 'bar'}
                data={reportType === 'sales' ? salesChartData : categoryChartData}
                height={350}
                onExport={() => handleExport('pdf', salesChartData)}
              />
              
              {reportType === 'products' && (
                <ChartContainer
                  title="Top Produits"
                  type="bar"
                  data={productsChartData}
                  height={350}
                  onExport={() => handleExport('pdf', productsChartData)}
                />
              )}
            </div>

            {/* Tableaux de données détaillées */}
            <div className={styles.detailedTables}>
              {reportType === 'sales' && (
                <DataTable
                  title="Détail des Ventes"
                  columns={salesColumns}
                  data={filteredSalesData}
                  keyField="id"
                  sortable={true}
                  onExport={() => handleExport('excel', filteredSalesData)}
                />
              )}
              
              {reportType === 'products' && (
                <DataTable
                  title="Performance des Produits"
                  columns={productsColumns}
                  data={filteredProductsData}
                  keyField="id"
                  sortable={true}
                  onExport={() => handleExport('excel', filteredProductsData)}
                />
              )}
              
              {reportType === 'financial' && (
                <DataTable
                  title="Données Financières"
                  columns={financialColumns}
                  data={mockFinancialData}
                  keyField="id"
                  sortable={true}
                  onExport={() => handleExport('excel', mockFinancialData)}
                />
              )}
              
              {reportType === 'inventory' && (
                <div className={styles.inventoryReport}>
                  <div className={styles.inventorySection}>
                    <h3 className={styles.inventoryTitle}>Stock Critique</h3>
                    <div className={styles.inventoryList}>
                      {mockProductsData
                        .filter(p => p.stock <= p.threshold)
                        .map((product) => (
                          <div key={product.id} className={styles.inventoryItem}>
                            <div className={styles.itemInfo}>
                              <h4 className={styles.itemName}>{product.name}</h4>
                              <span className={styles.itemCategory}>{product.category}</span>
                            </div>
                            <div className={styles.itemStock}>
                              <div className={styles.stockIndicator}>
                                <div 
                                  className={styles.stockLevel}
                                  style={{ width: `${(product.stock / product.threshold) * 100}%` }}
                                ></div>
                              </div>
                              <span className={styles.stockValue}>
                                {product.stock} / {product.threshold}
                              </span>
                            </div>
                            <button className={styles.reorderBtn}>
                              Commander
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Analyse et insights */}
            <div className={styles.insightsContainer}>
              <div className={styles.insightsHeader}>
                <MdOutlineInsights className={styles.insightsIcon} />
                <h3 className={styles.insightsTitle}>Insights & Recommandations</h3>
              </div>
              
              <div className={styles.insightsGrid}>
                <div className={styles.insightCard}>
                  <div className={`${styles.insightIcon} ${styles.primary}`}>
                    <IoTrendingUpOutline />
                  </div>
                  <div className={styles.insightContent}>
                    <h4 className={styles.insightCardTitle}>Tendance positive</h4>
                    <p className={styles.insightText}>
                      Les ventes ont augmenté de 12.4% ce mois-ci par rapport au mois précédent.
                    </p>
                  </div>
                </div>
                
                <div className={styles.insightCard}>
                  <div className={`${styles.insightIcon} ${styles.warning}`}>
                    <IoAlertCircleOutline />
                  </div>
                  <div className={styles.insightContent}>
                    <h4 className={styles.insightCardTitle}>Attention requise</h4>
                    <p className={styles.insightText}>
                      {metrics.criticalStock} produits en stock critique nécessitent réapprovisionnement.
                    </p>
                  </div>
                </div>
                
                <div className={styles.insightCard}>
                  <div className={`${styles.insightIcon} ${styles.success}`}>
                    <IoCheckmarkCircleOutline />
                  </div>
                  <div className={styles.insightContent}>
                    <h4 className={styles.insightCardTitle}>Performance optimale</h4>
                    <p className={styles.insightText}>
                      {metrics.deliveredSales} sur {mockSalesData.length} commandes ont été livrées avec succès.
                    </p>
                  </div>
                </div>
                
                <div className={styles.insightCard}>
                  <div className={`${styles.insightIcon} ${styles.accent}`}>
                    <IoCashOutline />
                  </div>
                  <div className={styles.insightContent}>
                    <h4 className={styles.insightCardTitle}>Opportunité de croissance</h4>
                    <p className={styles.insightText}>
                      {formatCurrency(metrics.creditSales)} en crédits clients à recouvrer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Statistiques de bas de page */}
        <div className={styles.footerStats}>
          <div className={styles.footerStatItem}>
            <span className={styles.footerStatLabel}>Rapport généré:</span>
            <span className={styles.footerStatValue}>{new Date().toLocaleString('fr-FR')}</span>
          </div>
          <div className={styles.footerStatItem}>
            <span className={styles.footerStatLabel}>Données mises à jour:</span>
            <span className={styles.footerStatValue}>Aujourd'hui à 09:30</span>
          </div>
          <div className={styles.footerStatItem}>
            <span className={styles.footerStatLabel}>Version du rapport:</span>
            <span className={styles.footerStatValue}>2.1.4</span>
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Rapports;