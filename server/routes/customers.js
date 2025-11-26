import express from 'express';
import pool from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [customers] = await pool.query(`
      SELECT * FROM customers
      ORDER BY created_at DESC
    `);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Erro ao carregar clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [customers] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [req.params.id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(customers[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Erro ao carregar cliente' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, document, email, phone, address, city, state, zip_code } = req.body;

    if (!name || !document) {
      return res.status(400).json({ message: 'Nome e documento são obrigatórios' });
    }

    const [existingCustomer] = await pool.query(
      'SELECT id FROM customers WHERE document = ?',
      [document]
    );

    if (existingCustomer.length > 0) {
      return res.status(400).json({ message: 'Cliente com este documento já existe' });
    }

    const [result] = await pool.query(
      `INSERT INTO customers (name, document, email, phone, address, city, state, zip_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, document, email, phone, address, city, state, zip_code]
    );

    const [newCustomer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newCustomer[0]);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Erro ao criar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, document, email, phone, address, city, state, zip_code } = req.body;
    const { id } = req.params;

    const [existingCustomer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const [duplicateCheck] = await pool.query(
      'SELECT id FROM customers WHERE document = ? AND id != ?',
      [document, id]
    );

    if (duplicateCheck.length > 0) {
      return res.status(400).json({ message: 'Já existe outro cliente com este documento' });
    }

    await pool.query(
      `UPDATE customers
       SET name = ?, document = ?, email = ?, phone = ?,
           address = ?, city = ?, state = ?, zip_code = ?
       WHERE id = ?`,
      [name, document, email, phone, address, city, state, zip_code, id]
    );

    const [updatedCustomer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    res.json(updatedCustomer[0]);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [customer] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );

    if (customer.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const [exits] = await pool.query(
      'SELECT COUNT(*) as count FROM exits WHERE customer_id = ?',
      [id]
    );

    if (exits[0].count > 0) {
      return res.status(400).json({
        message: 'Não é possível excluir cliente com saídas registradas'
      });
    }

    await pool.query('DELETE FROM customers WHERE id = ?', [id]);

    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Erro ao remover cliente' });
  }
});

export default router;
