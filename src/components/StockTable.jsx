import styles from "./StockTable.module.css";

export default function StockTable({ stocks }) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Inventaire du stock</h3>
        <div className={styles.empty}>
          Aucun produit en stock. Ajoutez votre premier produit !
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Inventaire du stock ({stocks.length} produits)</h3>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.headerCell}>ID</th>
            <th className={styles.headerCell}>Produit</th>
            <th className={styles.headerCell}>Quantité</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((s, i) => (
            <tr key={i} className={styles.row}>
              <td className={styles.cell}>{i + 1}</td>
              <td className={styles.cell}>{s.name}</td>
              <td className={styles.cell}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: s.qty > 10 ? '#d4edda' : s.qty > 0 ? '#fff3cd' : '#f8d7da',
                  color: s.qty > 10 ? '#155724' : s.qty > 0 ? '#856404' : '#721c24',
                  fontWeight: '600'
                }}>
                  {s.qty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}