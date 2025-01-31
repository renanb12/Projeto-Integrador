export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  barcode?: string;
  type: 'UN' | 'KG' | 'L';
  purchase_price?: number;
  gross_cost?: number;
  image_url?: string;
  validity_date?: string;
  created_at: string;
}