import api from './api';

export interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingDeliveries: number;
  entriesThisMonth: number;
  exitsThisMonth: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function fetchRecentActivities(): Promise<RecentActivity[]> {
  try {
    const response = await api.get('/dashboard/activities');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    throw error;
  }
}
