import api from './api';
import type { Exit } from '../types/exit';

export async function fetchExits(): Promise<Exit[]> {
  try {
    const { data } = await api.get('/exits');
    return data;
  } catch (error) {
    console.error('Error fetching exits:', error);
    throw error;
  }
}

export async function createExit(exitData: {
  productId: string;
  quantity: number;
  reason: string;
}): Promise<void> {
  try {
    await api.post('/exits', exitData);
  } catch (error) {
    console.error('Error creating exit:', error);
    throw error;
  }
}