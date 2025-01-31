export async function addHistoryEntry(connection, entry) {
  try {
    await connection.query(
      `INSERT INTO history (
        type, status, item_id, category, 
        supplier_name, product_name, quantity, unit_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.type,
        entry.status,
        entry.item_id,
        entry.category,
        entry.supplier_name || null,
        entry.product_name || null,
        entry.quantity || null,
        entry.unit_price || null
      ]
    );
  } catch (error) {
    console.error('Error adding history entry:', error);
    throw error;
  }
}