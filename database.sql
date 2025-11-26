CREATE DATABASE IF NOT EXISTS 3d_manager;
USE 3d_manager;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
  status ENUM('active', 'inactive') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock DECIMAL(10,3) NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  barcode VARCHAR(100),
  type ENUM('UN', 'KG', 'L') DEFAULT 'UN',
  purchase_price DECIMAL(10, 2),
  gross_cost DECIMAL(10, 2),
  image_url TEXT,
  location VARCHAR(100),
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

CREATE TABLE IF NOT EXISTS entry_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  entry_id VARCHAR(50) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) AS (quantity * price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exits (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  customer_id INT,
  quantity DECIMAL(10,3) NOT NULL,
  reason VARCHAR(50) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS delivery_trucks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  model VARCHAR(100),
  capacity_kg DECIMAL(10,2),
  status ENUM('available', 'in_use', 'maintenance') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_name VARCHAR(255) NOT NULL,
  truck_id INT,
  driver_name VARCHAR(255) NOT NULL,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  departure_time TIME,
  estimated_arrival TIME,
  actual_arrival TIME,
  current_location TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (truck_id) REFERENCES delivery_trucks(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS delivery_route_stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  customer_id INT NOT NULL,
  stop_order INT NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  arrival_time TIMESTAMP NULL,
  departure_time TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES delivery_routes(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS delivery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stop_id INT NOT NULL,
  exit_id VARCHAR(50),
  product_id VARCHAR(50) NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  delivered_quantity DECIMAL(10,3),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (stop_id) REFERENCES delivery_route_stops(id) ON DELETE CASCADE,
  FOREIGN KEY (exit_id) REFERENCES exits(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

ALTER TABLE products
ADD UNIQUE INDEX IF NOT EXISTS idx_barcode (barcode);

ALTER TABLE history
ADD INDEX IF NOT EXISTS idx_type (type),
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_item_id (item_id);

ALTER TABLE entries
ADD INDEX IF NOT EXISTS idx_supplier_cnpj (supplier_cnpj),
ADD INDEX IF NOT EXISTS idx_entry_date (entry_date);

ALTER TABLE customers
ADD INDEX IF NOT EXISTS idx_document (document),
ADD INDEX IF NOT EXISTS idx_city (city);

ALTER TABLE delivery_routes
ADD INDEX IF NOT EXISTS idx_status (status),
ADD INDEX IF NOT EXISTS idx_created_at (created_at);
