import { useEffect, useState } from "react";
import { stockAPI } from "../services/stock.api";
import StockForm from "../components/StockForm";
import StockTable from "../components/StockTable";
import styles from "./StockPage.module.css";

export default function StockPage() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadStocks = async () => {
    try {
      const data = await stockAPI.getAll();
      setStocks(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.header}>Gestion de Stock</h1>
        
        <StockForm onAdd={loadStocks} />
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            Chargement du stock...
          </div>
        ) : (
          <StockTable stocks={stocks} />
        )}
      </div>
    </div>
  );
}