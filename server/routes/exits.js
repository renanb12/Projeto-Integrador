import express from 'express';
import pool from '../config/database.js';
import { auth } from '../middleware/auth.js';
import { addHistoryEntry } from '../utils/historyUtils.js';

const router = express.Router();

router.use(auth);

// Get all exits
router.get('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [exits] = await connection.query(`
      SELECT e.*, p.name as product_name, p.type as product_type
      FROM exits e
      JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC
    `);
    res.json(exits);
  } catch (error) {
    console.error('Error fetching exits:', error);
    res.status(500).json({ message: 'Erro ao carregar saídas' });
  } finally {
    connection.release();
  }
});

// Create exit
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { productId, quantity, reason } = req.body;

    // Get product info
    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    );

    if (products.length === 0) {
      throw new Error('Produto não encontrado');
    }

    const product = products[0];

    if (product.stock < quantity) {
      throw new Error('Quantidade maior que o estoque disponível');
    }

    // Generate a unique ID
    const exitId = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Create exit record - Removido total_price da inserção
    await connection.query(
      `INSERT INTO exits (
        id, product_id, quantity, reason, unit_price
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        exitId,
        productId,
        quantity,
        reason,
        product.price
      ]
    );

    // Update product stock
    await connection.query(
      'UPDATE products SET stock = stock - ? WHERE id = ?',
      [quantity, productId]
    );

    // Add history entry
    await addHistoryEntry(connection, {
      type: 'Saída',
      status: 'Adicionado',
      item_id: exitId,
      category: product.category,
      product_name: product.name,
      quantity: quantity,
      unit_price: product.price
    });

    await connection.commit();
    res.status(201).json({ message: 'Saída registrada com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating exit:', error);
    res.status(500).json({ message: error.message || 'Erro ao registrar saída' });
  } finally {
    connection.release();
  }
});

export default router;