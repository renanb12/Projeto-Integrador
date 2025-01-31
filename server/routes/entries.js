import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import { parseXMLFile } from '../utils/xmlParser.js';
import { addHistoryEntry } from '../utils/historyUtils.js';
import { auth } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer for XML file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/xml' || file.originalname.endsWith('.xml')) {
      cb(null, true);
    } else {
      cb(new Error('Only XML files are allowed'));
    }
  }
});

router.use(auth);

// Get all entries
router.get('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [entries] = await connection.query(`
      SELECT e.*, 
             COUNT(DISTINCT ep.id) as total_products,
             SUM(ep.quantity) as total_items,
             SUM(ep.total) as total_value
      FROM entries e
      LEFT JOIN entry_products ep ON e.id = ep.entry_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Erro ao carregar entradas' });
  } finally {
    connection.release();
  }
});

// Get entry products
router.get('/:id/products', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [products] = await connection.query(`
      SELECT 
        ep.*,
        p.name,
        p.barcode as code
      FROM entry_products ep
      JOIN products p ON ep.product_id = p.id
      WHERE ep.entry_id = ?
      ORDER BY ep.created_at ASC
    `, [req.params.id]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching entry products:', error);
    res.status(500).json({ message: 'Erro ao carregar produtos da entrada' });
  } finally {
    connection.release();
  }
});

router.post('/import-xml', upload.single('xml'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    if (!req.file) {
      throw new Error('Nenhum arquivo enviado');
    }

    // Parse XML file
    const xmlData = await parseXMLFile(req.file.path);
    
    // Create entry
    const entryId = Date.now().toString();
    await connection.query(
      `INSERT INTO entries (
        id, entry_code, status, origin, xml_path,
        supplier_name, supplier_cnpj, recipient_cnpj, recipient_name,
        note_number, series, entry_type, access_key, emission_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entryId,
        xmlData.general.number,
        'Processando',
        'Importação',
        req.file.path,
        xmlData.supplier.name,
        xmlData.supplier.cnpj,
        xmlData.recipient.cnpj,
        xmlData.recipient.name,
        xmlData.general.number,
        xmlData.general.series,
        'Compra',
        xmlData.accessKey,
        new Date(xmlData.general.date)
      ]
    );

    // Process products
    for (const product of xmlData.products) {
      // First, create or get the product
      let productId;
      const [existingProducts] = await connection.query(
        'SELECT id FROM products WHERE barcode = ?',
        [product.code]
      );

      const purchasePrice = parseFloat(product.price);
      const sellingPrice = purchasePrice * 1.6; // Preço de venda = preço de custo + 60%

      if (existingProducts.length === 0) {
        // Create new product
        productId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        await connection.query(
          `INSERT INTO products (
            id, name, category, stock, price, purchase_price, barcode, type
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            product.name,
            'Importado',
            parseFloat(product.quantity),
            sellingPrice,
            purchasePrice,
            product.code,
            'UN'
          ]
        );
      } else {
        productId = existingProducts[0].id;
        // Update existing product stock and prices
        await connection.query(
          `UPDATE products 
           SET stock = stock + ?,
               purchase_price = ?,
               price = ?
           WHERE id = ?`,
          [parseFloat(product.quantity), purchasePrice, sellingPrice, productId]
        );
      }

      // Insert into entry_products
      await connection.query(
        `INSERT INTO entry_products (
          entry_id, product_id, quantity, price
        ) VALUES (?, ?, ?, ?)`,
        [
          entryId,
          productId,
          parseFloat(product.quantity),
          purchasePrice // Usar o preço de custo na entrada
        ]
      );

      // Add history entry
      await addHistoryEntry(connection, {
        type: 'Entrada',
        status: 'Adicionado',
        item_id: entryId,
        category: 'Importação',
        supplier_name: xmlData.supplier.name,
        product_name: product.name,
        quantity: parseFloat(product.quantity),
        unit_price: purchasePrice
      });
    }

    await connection.commit();
    res.status(201).json({ message: 'XML importado com sucesso' });
  } catch (error) {
    await connection.rollback();
    console.error('Error importing XML:', error);
    res.status(500).json({ message: error.message || 'Erro ao importar XML' });
  } finally {
    connection.release();
  }
});

export default router;