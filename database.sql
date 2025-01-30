CREATE DATABASE IF NOT EXISTS 3d_manager;
USE 3d_manager;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  barcode VARCHAR(100),
  type ENUM('UN', 'KG', 'L') DEFAULT 'UN',
  purchase_price DECIMAL(10, 2),
  gross_cost DECIMAL(10, 2),
  image_url TEXT,
  validity_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entries (
  id VARCHAR(50) PRIMARY KEY,
  entry_code VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  origin VARCHAR(50) NOT NULL,
  xml_path TEXT,
  supplier_id VARCHAR(50),
  supplier_name VARCHAR(255),
  supplier_cnpj VARCHAR(20),
  recipient_cnpj VARCHAR(20),
  recipient_name VARCHAR(255),
  note_number VARCHAR(50),
  series VARCHAR(20),
  entry_type VARCHAR(50),
  access_key VARCHAR(255),
  import_date DATE,
  emission_date DATE,
  entry_date DATE,
  authorization_protocol VARCHAR(100),
  nfe_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('Entrada', 'Produtos', 'Saída') NOT NULL,
  status ENUM('Adicionado', 'Removido', 'Modificado') NOT NULL,
  item_id VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  supplier_name VARCHAR(255),
  product_name VARCHAR(255),
  quantity INT,
  unit_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Add unique constraint to barcode if not exists
ALTER TABLE products
ADD UNIQUE INDEX idx_barcode (barcode);

-- Add indexes for better performance
ALTER TABLE history
ADD INDEX idx_type (type),
ADD INDEX idx_status (status),
ADD INDEX idx_item_id (item_id);

ALTER TABLE entries
ADD INDEX idx_supplier_cnpj (supplier_cnpj),
ADD INDEX idx_entry_date (entry_date);


select * from users;

select * from products;

select * from history;

select * from entries;

CREATE TABLE IF NOT EXISTS entry_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entry_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) AS (quantity * price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

