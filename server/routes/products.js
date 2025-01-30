import express from 'express';
import pool from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { addHistoryEntry } from '../utils/historyUtils.js';

const router = express.Router();

router.use(auth);

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT 
        p.*,
        (p.stock * p.price) as stock_value,
        (p.stock * COALESCE(p.purchase_price, p.price * 0.6)) as cost_value,
        (p.stock * p.price) - (p.stock * COALESCE(p.purchase_price, p.price * 0.6)) as profit_value
      FROM products p
      ORDER BY p.created_at DESC
    `);
    
    const totals = products.reduce((acc, product) => ({
      stockValue: acc.stockValue + Number(product.stock_value || 0),
      costValue: acc.costValue + Number(product.cost_value || 0),
      profitValue: acc.profitValue + Number(product.profit_value || 0)
    }), { stockValue: 0, costValue: 0, profitValue: 0 });

    res.json({ products, totals });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      category,
      stock,
      price,
      purchase_price,
      barcode,
      type = 'UN'
    } = req.body;

    // Generate a unique ID
    const productId = Math.random().toString(36).substring(2) + Date.now().toString(36);

    await connection.query(
      `INSERT INTO products (
        id, name, category, stock, price, purchase_price,
        barcode, type, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [productId, name, category, stock, price, purchase_price, barcode, type]
    );

    // Add history entry
    await addHistoryEntry(connection, {
      type: 'Produtos',
      status: 'Adicionado',
      item_id: productId,
      category,
      product_name: name,
      quantity: stock,
      unit_price: price
    });

    await connection.commit();

    const [newProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    res.status(201).json(newProduct[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Update product
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const {
      name,
      category,
      stock,
      price,
      purchase_price,
      barcode,
      type
    } = req.body;

    const [existingProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await connection.query(
      `UPDATE products 
       SET name = ?, category = ?, stock = ?, price = ?,
           purchase_price = ?, barcode = ?, type = ?
       WHERE id = ?`,
      [name, category, stock, price, purchase_price, barcode, type, id]
    );

    // Add history entry
    await addHistoryEntry(connection, {
      type: 'Produtos',
      status: 'Modificado',
      item_id: id,
      category,
      product_name: name,
      quantity: stock,
      unit_price: price
    });

    await connection.commit();

    const [updatedProduct] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    res.json(updatedProduct[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    
    const [product] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (product.length === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    await connection.query('DELETE FROM products WHERE id = ?', [id]);

    // Add history entry
    await addHistoryEntry(connection, {
      type: 'Produtos',
      status: 'Removido',
      item_id: id,
      category: product[0].category,
      product_name: product[0].name,
      quantity: product[0].stock,
      unit_price: product[0].price
    });

    await connection.commit();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;