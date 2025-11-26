import express from 'express';
import pool from '../config/database.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const [routes] = await pool.query(`
      SELECT
        dr.*,
        dt.license_plate as vehicle,
        COUNT(DISTINCT drs.id) as stops
      FROM delivery_routes dr
      LEFT JOIN delivery_trucks dt ON dr.truck_id = dt.id
      LEFT JOIN delivery_route_stops drs ON dr.id = drs.route_id
      GROUP BY dr.id
      ORDER BY dr.created_at DESC
    `);
    res.json(routes);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ message: 'Erro ao carregar entregas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [routes] = await pool.query(`
      SELECT
        dr.*,
        dt.license_plate as vehicle,
        dt.model as vehicle_model
      FROM delivery_routes dr
      LEFT JOIN delivery_trucks dt ON dr.truck_id = dt.id
      WHERE dr.id = ?
    `, [req.params.id]);

    if (routes.length === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }

    const [stops] = await pool.query(`
      SELECT
        drs.*,
        c.name as customer_name,
        c.address,
        c.city,
        c.state
      FROM delivery_route_stops drs
      JOIN customers c ON drs.customer_id = c.id
      WHERE drs.route_id = ?
      ORDER BY drs.stop_order ASC
    `, [req.params.id]);

    res.json({ ...routes[0], stops });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({ message: 'Erro ao carregar entrega' });
  }
});

router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { route_name, truck_id, driver_name, departure_time, estimated_arrival, stops } = req.body;

    if (!route_name || !driver_name) {
      return res.status(400).json({ message: 'Nome da rota e motorista são obrigatórios' });
    }

    const [result] = await connection.query(
      `INSERT INTO delivery_routes
       (route_name, truck_id, driver_name, departure_time, estimated_arrival, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [route_name, truck_id || null, driver_name, departure_time, estimated_arrival]
    );

    const routeId = result.insertId;

    if (stops && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        await connection.query(
          `INSERT INTO delivery_route_stops
           (route_id, customer_id, stop_order, status)
           VALUES (?, ?, ?, 'pending')`,
          [routeId, stop.customer_id, i + 1]
        );
      }
    }

    await connection.commit();

    const [newRoute] = await connection.query(
      'SELECT * FROM delivery_routes WHERE id = ?',
      [routeId]
    );

    res.status(201).json(newRoute[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Error creating delivery:', error);
    res.status(500).json({ message: 'Erro ao criar entrega' });
  } finally {
    connection.release();
  }
});

router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { route_name, truck_id, driver_name, status, departure_time, estimated_arrival, current_location } = req.body;

    const [existingRoute] = await connection.query(
      'SELECT * FROM delivery_routes WHERE id = ?',
      [id]
    );

    if (existingRoute.length === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }

    await connection.query(
      `UPDATE delivery_routes
       SET route_name = ?, truck_id = ?, driver_name = ?, status = ?,
           departure_time = ?, estimated_arrival = ?, current_location = ?
       WHERE id = ?`,
      [route_name, truck_id, driver_name, status, departure_time, estimated_arrival, current_location, id]
    );

    await connection.commit();

    const [updatedRoute] = await connection.query(
      'SELECT * FROM delivery_routes WHERE id = ?',
      [id]
    );

    res.json(updatedRoute[0]);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating delivery:', error);
    res.status(500).json({ message: 'Erro ao atualizar entrega' });
  } finally {
    connection.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [route] = await pool.query(
      'SELECT * FROM delivery_routes WHERE id = ?',
      [id]
    );

    if (route.length === 0) {
      return res.status(404).json({ message: 'Rota não encontrada' });
    }

    await pool.query('DELETE FROM delivery_routes WHERE id = ?', [id]);

    res.json({ message: 'Rota removida com sucesso' });
  } catch (error) {
    console.error('Error deleting delivery:', error);
    res.status(500).json({ message: 'Erro ao remover entrega' });
  }
});

router.get('/trucks/list', async (req, res) => {
  try {
    const [trucks] = await pool.query(`
      SELECT * FROM delivery_trucks
      ORDER BY license_plate ASC
    `);
    res.json(trucks);
  } catch (error) {
    console.error('Error fetching trucks:', error);
    res.status(500).json({ message: 'Erro ao carregar caminhões' });
  }
});

router.post('/trucks', async (req, res) => {
  try {
    const { license_plate, model, capacity_kg, status } = req.body;

    if (!license_plate) {
      return res.status(400).json({ message: 'Placa é obrigatória' });
    }

    const [result] = await pool.query(
      `INSERT INTO delivery_trucks (license_plate, model, capacity_kg, status)
       VALUES (?, ?, ?, ?)`,
      [license_plate, model, capacity_kg, status || 'available']
    );

    const [newTruck] = await pool.query(
      'SELECT * FROM delivery_trucks WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newTruck[0]);
  } catch (error) {
    console.error('Error creating truck:', error);
    res.status(500).json({ message: 'Erro ao criar caminhão' });
  }
});

export default router;
