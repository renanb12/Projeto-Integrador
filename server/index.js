import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import entryRoutes from './routes/entries.js';
import historyRoutes from './routes/history.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/entries', entryRoutes);
app.use('/api/history', historyRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});