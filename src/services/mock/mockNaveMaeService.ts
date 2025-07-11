
import { appConfig } from "@/config/appConfig";
import { simulateNetworkDelay, simulateError } from "./mockUtils";

export interface ConsolidatedMetrics {
  totalStudios: number;
  totalArtists: number;
  totalAppointments: number;
  totalRevenue: number;
  totalClients: number;
  monthlyGrowth: number;
}

export class MockNaveMaeService {
  async getConsolidatedMetrics(): Promise<ConsolidatedMetrics> {
    if (appConfig.dataSource.logServiceCalls) {
      console.log("MockNaveMaeService: getConsolidatedMetrics called");
    }
    
    await simulateNetworkDelay();
    if (await simulateError()) {
      throw new Error("Failed to fetch consolidated metrics");
    }
    
    return {
      totalStudios: 4,
      totalArtists: 24,
      totalAppointments: 156,
      totalRevenue: 89500,
      totalClients: 1250,
      monthlyGrowth: 12.5
    };
  }
}

export const mockNaveMaeService = new MockNaveMaeService();
