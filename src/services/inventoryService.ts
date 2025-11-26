import api from './api';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  location: string;
  status: 'available' | 'low' | 'out';
}

export async function fetchInventory(): Promise<InventoryItem[]> {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

export async function createInventoryItem(itemData: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  try {
    const response = await api.post('/inventory', itemData);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(id: string, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
  try {
    const response = await api.put(`/inventory/${id}`, itemData);
    return response.data;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(id: string): Promise<void> {
  try {
    await api.delete(`/inventory/${id}`);
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}
