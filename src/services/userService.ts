import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'last_login'>): Promise<User> {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
