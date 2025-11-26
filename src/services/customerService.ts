import api from './api';

export interface Customer {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  created_at: string;
}

export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

export async function createCustomer(customerData: Omit<Customer, 'id' | 'created_at'>): Promise<Customer> {
  try {
    const response = await api.post('/customers', customerData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  try {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await api.delete(`/customers/${id}`);
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}
