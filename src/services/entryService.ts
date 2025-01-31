import api from './api';
import type { Entry } from '../types/entry';

export async function fetchEntries(): Promise<Entry[]> {
  try {
    const { data } = await api.get('/entries');
    if (!data) {
      throw new Error('No data received from server');
    }
    return data;
  } catch (error: any) {
    console.error('Error fetching entries:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar entradas');
  }
}

export async function fetchEntryProducts(entryId: string) {
  try {
    const { data } = await api.get(`/entries/${entryId}/products`);
    if (!data) {
      throw new Error('No products data received from server');
    }
    return data;
  } catch (error: any) {
    console.error('Error fetching entry products:', error);
    throw new Error(error.response?.data?.message || 'Erro ao carregar produtos da entrada');
  }
}