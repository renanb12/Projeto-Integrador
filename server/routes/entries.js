import express from 'express';
import pool from '../config/database.js';
import multer from 'multer';
import { parseXMLFile } from '../utils/xmlParser.js';
import { addHistoryEntry } from '../utils/historyUtils.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(auth);

// Get all entries
router.get('/', async (req, res) => {
  try {
    const [entries] = await pool.query(`
      SELECT e.*, 
             COUNT(p.id) as total_products,
             SUM(p.quantity) as total_items,
             SUM(p.price * p.quantity) as total_value
      FROM entries e
      LEFT JOIN entry_products p ON e.id = p.entry_id
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `);
    res.json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get entry products
router.get('/:id/products', async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.* 
      FROM entry_products p
      WHERE p.entry_id = ?
    `, [req.params.id]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching entry products:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/import-xml', upload.single('xml'), async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    if (!req.file) {
      throw new Error('No file uploaded');
    }

    // Parse XML file
    const xmlData = await parseXMLFile(req.file.path);
    
    // Create entry
    const entryId = Date.now().toString();
    const [entryResult] = await connection.query(
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

    // Process products and store them in entry_products table
    for (const product of xmlData.products) {
      await connection.query(
        `INSERT INTO entry_products (
          entry_id, code, name, quantity, price, total
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entryId,
          product.code,
          product.name,
          product.quantity,
          product.price,
          product.total
        ]
      );

      try {
        // Check if product exists by barcode
        const [existingProducts] = await connection.query(
          'SELECT * FROM products WHERE barcode = ?',
          [product.code]
        );

        let productId;
        if (existingProducts.length === 0) {
          // Generate a unique ID
          productId = Math.random().toString(36).substring(2) + Date.now().toString(36);
          
          // Try to insert new product
          await connection.query(
            `INSERT INTO products (
              id, name, category, stock, price, barcode, type,
              purchase_price, gross_cost
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              productId,
              product.name,
              'Importado', // Default category
              product.quantity,
              product.price,
              product.code,
              'UN',
              product.price * 0.7, // Example purchase price calculation
              product.price * 0.5  // Example gross cost calculation
            ]
          );

          // Add history entry for new product
          await addHistoryEntry(connection, {
            type: 'Produtos',
            status: 'Adicionado',
            item_id: productId,
            category: 'Importado',
            product_name: product.name,
            quantity: product.quantity,
            unit_price: product.price
          });
        } else {
          productId = existingProducts[0].id;
          // Update existing product
          await connection.query(
            `UPDATE products 
             SET stock = stock + ?,
                 price = CASE 
                   WHEN ? > price THEN ? 
                   ELSE price 
                 END,
                 purchase_price = CASE 
                   WHEN ? < purchase_price OR purchase_price IS NULL THEN ?
                   ELSE purchase_price 
                 END
             WHERE id = ?`,
            [
              product.quantity,
              product.price,
              product.price,
              product.price * 0.7,
              product.price * 0.7,
              productId
            ]
          );

          // Add history entry for updated product
          await addHistoryEntry(connection, {
            type: 'Produtos',
            status: 'Modificado',
            item_id: productId,
            category: 'Importado',
            product_name: product.name,
            quantity: product.quantity,
            unit_price: product.price
          });
        }
      } catch (error) {
        console.error(`Error processing product ${product.code}:`, error);
        continue;
      }
    }

    // Add history entry for the entry itself
    await addHistoryEntry(connection, {
      type: 'Entrada',
      status: 'Adicionado',
      item_id: entryId,
      category: 'Importação',
      supplier_name: xmlData.supplier.name,
      quantity: xmlData.products.length,
      unit_price: xmlData.products.reduce((sum, p) => sum + Number(p.price), 0)
    });

    await connection.commit();
    res.status(201).json({ message: 'XML imported successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error importing XML:', error);
    res.status(500).json({ message: error.message });
  } finally {
    connection.release();
  }
});

export default router;