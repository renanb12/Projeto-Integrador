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