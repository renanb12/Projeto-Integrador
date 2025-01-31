import type { HistoryEntry } from '../types/history';

export async function fetchHistory(): Promise<HistoryEntry[]> {
  try {
    const response = await fetch('http://localhost:3000/api/history');
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}