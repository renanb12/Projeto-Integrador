import api from './api';

export interface Delivery {
  id: string;
  route_name: string;
  driver: string;
  vehicle: string;
  stops: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  departure_time: string;
  estimated_arrival: string;
  current_location?: string;
}

export async function fetchDeliveries(): Promise<Delivery[]> {
  try {
    const response = await api.get('/deliveries');
    return response.data;
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    throw error;
  }
}

export async function createDelivery(deliveryData: Omit<Delivery, 'id'>): Promise<Delivery> {
  try {
    const response = await api.post('/deliveries', deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error creating delivery:', error);
    throw error;
  }
}

export async function updateDelivery(id: string, deliveryData: Partial<Delivery>): Promise<Delivery> {
  try {
    const response = await api.put(`/deliveries/${id}`, deliveryData);
    return response.data;
  } catch (error) {
    console.error('Error updating delivery:', error);
    throw error;
  }
}

export async function deleteDelivery(id: string): Promise<void> {
  try {
    await api.delete(`/deliveries/${id}`);
  } catch (error) {
    console.error('Error deleting delivery:', error);
    throw error;
  }
}
