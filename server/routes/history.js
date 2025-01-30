import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all history entries
router.get('/', async (req, res) => {
  try {
    const [history] = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;