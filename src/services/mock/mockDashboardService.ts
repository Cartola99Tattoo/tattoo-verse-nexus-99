
import { appConfig } from "@/config/appConfig";
import { IDashboardService, IDashboardStats } from "../interfaces/IDashboardService";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

// Mock dashboard data
const mockDashboardStats: IDashboardStats = {
  totalSales: 15750.90,
  newCustomers: 28,
  pendingOrders: 12,
  upcomingAppointments: 15,
  blogViews: 1254
};

// Mock recent customers
const mockRecentCustomers = [
  {
    id: "1",
    first_name: "João",
    last_name: "Silva",
    email: "joao.silva@example.com",
    created_at: "2024-05-10T14:30:00Z",
    avatar_url: null
  },
  {
    id: "2",
    first_name: "Maria",
    last_name: "Oliveira",
    email: "maria.oliveira@example.com",
    created_at: "2024-05-09T09:15:00Z",
    avatar_url: null
  },
  {
    id: "3",
    first_name: "Pedro",
    last_name: "Santos",
    email: "pedro.santos@example.com",
    created_at: "2024-05-08T16:45:00Z",
    avatar_url: null
  },
  {
    id: "4",
    first_name: "Ana",
    last_name: "Sousa",
    email: "ana.sousa@example.com",
    created_at: "2024-05-07T11:20:00Z",
    avatar_url: null
  },
  {
    id: "5",
    first_name: "Carlos",
    last_name: "Ferreira",
    email: "carlos.ferreira@example.com",
    created_at: "2024-05-06T08:10:00Z",
    avatar_url: null
  }
];

// Mock recent orders
const mockRecentOrders = [
  {
    id: "1",
    reference_code: "ORD-2024-001",
    status: "pending",
    total_amount: 150.00,
    created_at: "2024-05-10T16:30:00Z",
    customer_name: "João Silva"
  },
  {
    id: "2",
    reference_code: "ORD-2024-002",
    status: "paid",
    total_amount: 89.90,
    created_at: "2024-05-09T14:20:00Z",
    customer_name: "Maria Oliveira"
  },
  {
    id: "3",
    reference_code: "ORD-2024-003",
    status: "shipped",
    total_amount: 200.00,
    created_at: "2024-05-08T10:45:00Z",
    customer_name: "Pedro Santos"
  },
  {
    id: "4",
    reference_code: "ORD-2024-004",
    status: "delivered",
    total_amount: 120.50,
    created_at: "2024-05-07T15:10:00Z",
    customer_name: "Ana Sousa"
  },
  {
    id: "5",
    reference_code: "ORD-2024-005",
    status: "canceled",
    total_amount: 75.00,
    created_at: "2024-05-06T09:30:00Z",
    customer_name: "Carlos Ferreira"
  }
];

// Mock upcoming appointments
const mockUpcomingAppointments = [
  {
    id: "1",
    client_name: "João Silva",
    artist_name: "André Mendes",
    start_date: "2024-05-15T14:00:00Z",
    end_date: "2024-05-15T16:00:00Z",
    status: "agendado",
    description: "Tatuagem de manga braço direito"
  },
  {
    id: "2",
    client_name: "Maria Oliveira",
    artist_name: "Mariana Costa",
    start_date: "2024-05-16T10:00:00Z",
    end_date: "2024-05-16T12:00:00Z",
    status: "agendado",
    description: "Cover-up nas costas"
  },
  {
    id: "3",
    client_name: "Pedro Santos",
    artist_name: "André Mendes",
    start_date: "2024-05-17T15:30:00Z",
    end_date: "2024-05-17T17:30:00Z",
    status: "agendado",
    description: "Tatuagem minimalista pulso"
  }
];

// Mock DashboardService implementation
export class MockDashboardService implements IDashboardService {
  async fetchDashboardStats(): Promise<IDashboardStats | null> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockDashboardService: fetchDashboardStats called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch dashboard stats");
    }
    
    return { ...mockDashboardStats };
  }

  async fetchRecentCustomers(limit: number = 5): Promise<any[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockDashboardService: fetchRecentCustomers called with limit:", limit);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch recent customers");
    }
    
    return mockRecentCustomers.slice(0, limit);
  }

  async fetchRecentOrders(limit: number = 5): Promise<any[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockDashboardService: fetchRecentOrders called with limit:", limit);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch recent orders");
    }
    
    return mockRecentOrders.slice(0, limit);
  }

  async fetchUpcomingAppointments(limit: number = 5): Promise<any[]> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockDashboardService: fetchUpcomingAppointments called with limit:", limit);
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch upcoming appointments");
    }
    
    return mockUpcomingAppointments.slice(0, limit);
  }
}

// Export a singleton instance of the service
export const mockDashboardService = new MockDashboardService();
