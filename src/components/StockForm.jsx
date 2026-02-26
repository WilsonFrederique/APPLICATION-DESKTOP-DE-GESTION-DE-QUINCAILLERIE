import { useState } from "react";
import { stockAPI } from "../services/stock.api";
import styles from "./StockForm.module.css";

export default function StockForm({ onAdd }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!name.trim() || !qty.trim()) return;
    
    setLoading(true);
    try {
      await stockAPI.add({ name, qty: parseInt(qty) || 0 });
      setName("");
      setQty("");
      onAdd();
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <h3 className={styles.title}>Ajouter un produit</h3>
      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nom du produit</label>
          <input
            className={styles.input}
            placeholder="Ex: Ordinateur portable"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Quantité</label>
          <input
            className={styles.input}
            type="number"
            placeholder="Ex: 10"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            onKeyPress={handleKeyPress}
            min="0"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.button}
          disabled={loading || !name.trim() || !qty.trim()}
        >
          {loading ? "Ajout en cours..." : "Ajouter au stock"}
        </button>
      </div>
    </form>
  );
}