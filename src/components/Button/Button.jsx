import React from "react";
import styles from './Button.module.css';

// Import des icônes
import { FaPlus } from "react-icons/fa6";
import { 
  IoSearchOutline,
  IoEyeOutline,
  IoTrashOutline,
  IoPrintOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoFilterOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCashOutline,
  IoCartOutline,
  IoReceiptOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoChevronDownOutline,
  IoBarcodeOutline,
  IoCalculatorOutline,
  IoArrowBackOutline,
  IoQrCodeOutline,
  IoSaveOutline,
  IoShareSocialOutline,
  IoNotificationsOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoWalletOutline,
  IoRemoveOutline,
  IoAddOutline,
  IoGridOutline,
  IoShareOutline,
  IoListOutline
} from "react-icons/io5";
import { 
  FaBox, 
  FaTruck, 
  FaMoneyBillWave, 
  FaCreditCard,
  FaPercentage,
  FaClipboardList,
  FaChartLine,
  FaUserTie,
  FaWarehouse,
  FaBarcode,
  FaTags,
  FaWeightHanging,
  FaStore,
  FaRegEdit,
  FaShoppingCart
} from "react-icons/fa";
import { 
  TbBuildingWarehouse, 
  TbCategory, 
  TbCurrencyDollar,
  TbTruckDelivery,
  TbArrowsSort,
  TbSortAscending,
  TbSortDescending,
  TbListDetails
} from "react-icons/tb";
import { 
  MdInventory, 
  MdLocalShipping, 
  MdAttachMoney,
  MdPayment,
  MdCategory,
  MdPointOfSale,
  MdOutlineSell,
  MdOutlineTrendingUp,
  MdOutlineStorefront,
  MdOutlineShoppingCart
} from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import { GiWeight, GiCash, GiShoppingCart } from "react-icons/gi";
import { CiMoneyBill, CiCreditCard1, CiShoppingTag } from "react-icons/ci";
import { IoLockOpenOutline } from "react-icons/io5";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { MdPassword } from "react-icons/md";

// Mapping des noms d'icônes aux composants d'icônes
const iconMap = {
  precedant: GrFormPrevious,
  suivant: GrFormNext,
  plus: FaPlus,
  search: IoSearchOutline,
  eye: IoEyeOutline,
  active: IoLockOpenOutline,
  inactive: HiOutlineLockClosed,
  password: MdPassword,
  trash: IoTrashOutline,
  edit: FaRegEdit,
  print: IoPrintOutline,
  download: IoDownloadOutline,
  partager: IoShareOutline,
  refresh: IoRefreshOutline,
  filter: IoFilterOutline,
  filterOutline: IoFilterOutline,
  alert: IoAlertCircleOutline,
  check: IoCheckmarkCircleOutline,
  close: IoCloseCircleOutline,
  warning: IoWarningOutline,
  info: IoInformationCircleOutline,
  notifications: IoNotificationsOutline,
  cash: IoCashOutline,
  cart: IoCartOutline,
  receipt: IoReceiptOutline,
  time: IoTimeOutline,
  calendar: IoCalendarOutline,
  person: IoPersonOutline,
  chevronDown: IoChevronDownOutline,
  barcode: IoBarcodeOutline,
  calculator: IoCalculatorOutline,
  back: IoArrowBackOutline,
  qrcode: IoQrCodeOutline,
  save: IoSaveOutline,
  share: IoShareSocialOutline,
  wallet: IoWalletOutline,
  remove: IoRemoveOutline,
  minus: IoRemoveOutline,
  add: IoAddOutline,
  grid: IoGridOutline,
  list: IoListOutline,
  box: FaBox,
  truck: FaTruck,
  moneyBill: FaMoneyBillWave,
  creditCard: FaCreditCard,
  percentage: FaPercentage,
  clipboard: FaClipboardList,
  chart: FaChartLine,
  chartLine: FaChartLine,
  userTie: FaUserTie,
  warehouse: FaWarehouse,
  barcodeFa: FaBarcode,
  tags: FaTags,
  weight: FaWeightHanging,
  store: FaStore,
  shoppingCart: FaShoppingCart,
  buildingWarehouse: TbBuildingWarehouse,
  category: TbCategory,
  currencyDollar: TbCurrencyDollar,
  truckDelivery: TbTruckDelivery,
  arrowsSort: TbArrowsSort,
  sortAsc: TbSortAscending,
  sortDesc: TbSortDescending,
  listDetails: TbListDetails,
  inventory: MdInventory,
  localShipping: MdLocalShipping,
  attachMoney: MdAttachMoney,
  payment: MdPayment,
  pointOfSale: MdPointOfSale,
  sell: MdOutlineSell,
  trendingUp: MdOutlineTrendingUp,
  storefront: MdOutlineStorefront,
  shoppingCartMd: MdOutlineShoppingCart,
  weightGi: GiWeight,
  cashGi: GiCash,
  shoppingCartGi: GiShoppingCart,
  moneyBillCi: CiMoneyBill,
  creditCardCi: CiCreditCard1,
  shoppingTag: CiShoppingTag,
};

const Button = ({
  variant = "primary",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className = "",
  children,
  icon = null,
  iconPosition = "left",
  size = "medium",
  fullWidth = false,
}) => {
  // Classes CSS dynamiques basées sur les props
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    (disabled || loading) ? styles.disabled : '',
    (!disabled && !loading) ? styles.enabled : '',
    loading ? styles.loading : '',
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  // Récupérer le composant d'icône
  let IconComponent = null;
  
  if (icon) {
    if (typeof icon === 'string') {
      IconComponent = iconMap[icon];
    } else {
      // Si l'icône est déjà un composant React
      IconComponent = icon;
    }
  }

  const loadingDotClasses = (index) => [
    styles.loadingDot,
    loading && variant === "outline" ? styles.loadingOutline : styles.loadingDefault,
    styles[`dot${index}`]
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
    >
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingDots}>
            <div className={loadingDotClasses(1)}></div>
            <div className={loadingDotClasses(2)}></div>
            <div className={loadingDotClasses(3)}></div>
          </div>
        </div>
      )}

      {!loading && (
        <span className={styles.content}>
          {IconComponent && iconPosition === "left" && (
            <span className={styles.icon}>
              <IconComponent />
            </span>
          )}
          {children && <span className={styles.text}>{children}</span>}
          {IconComponent && iconPosition === "right" && (
            <span className={styles.icon}>
              <IconComponent />
            </span>
          )}
        </span>
      )}
    </button>
  );
};

export default Button;