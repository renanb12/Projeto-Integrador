import api from './api';
import type { Entry } from '../types/entry';

export async function fetchEntries(): Promise<Entry[]> {
  try {
    const response = await api.get('/entries');
    return response.data;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
}

export async function fetchEntryProducts(entryId: string) {
  try {
    const response = await api.get(`/entries/${entryId}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching entry products:', error);
    throw error;
  }
}