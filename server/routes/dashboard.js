import express from 'express';
import pool from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/stats', async (req, res) => {
  try {
    const [productCount] = await pool.query(
      'SELECT COUNT(*) as count FROM products'
    );

    const [revenueData] = await pool.query(`
      SELECT SUM(total_price) as total
      FROM exits
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const [customerCount] = await pool.query(
      'SELECT COUNT(*) as count FROM customers'
    );

    const [pendingDeliveries] = await pool.query(`
      SELECT COUNT(*) as count
      FROM delivery_routes
      WHERE status IN ('pending', 'in_progress')
    `);

    const [entriesThisMonth] = await pool.query(`
      SELECT COUNT(*) as count
      FROM entries
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    const [exitsThisMonth] = await pool.query(`
      SELECT COUNT(*) as count
      FROM exits
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    res.json({
      totalProducts: productCount[0].count,
      totalRevenue: revenueData[0].total || 0,
      totalCustomers: customerCount[0].count,
      pendingDeliveries: pendingDeliveries[0].count,
      entriesThisMonth: entriesThisMonth[0].count,
      exitsThisMonth: exitsThisMonth[0].count
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Erro ao carregar estatísticas' });
  }
});

router.get('/activities', async (req, res) => {
  try {
    const [activities] = await pool.query(`
      SELECT
        id,
        type,
        status,
        product_name as description,
        created_at as timestamp
      FROM history
      ORDER BY created_at DESC
      LIMIT 10
    `);

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Erro ao carregar atividades' });
  }
});

router.get('/low-stock', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT id, name, stock, type
      FROM products
      WHERE stock < 50
      ORDER BY stock ASC
      LIMIT 10
    `);

    res.json(products);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Erro ao carregar produtos com baixo estoque' });
  }
});

export default router;
