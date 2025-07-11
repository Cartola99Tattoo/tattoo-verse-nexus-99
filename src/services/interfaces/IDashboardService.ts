
export interface IDashboardStats {
  totalSales: number;
  newCustomers: number;
  pendingOrders: number;
  upcomingAppointments: number;
  blogViews: number;
}

export interface IDashboardService {
  fetchDashboardStats(): Promise<IDashboardStats | null>;
  fetchRecentCustomers(limit?: number): Promise<any[]>;
  fetchRecentOrders(limit?: number): Promise<any[]>;
  fetchUpcomingAppointments(limit?: number): Promise<any[]>;
}
