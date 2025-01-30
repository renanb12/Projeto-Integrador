import api from './api';
import type { Product } from '../types/product';

export async function fetchProducts(): Promise<{ products: Product[], totals: any }> {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function createProduct(productData: Partial<Product>): Promise<Product> {
  try {
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}