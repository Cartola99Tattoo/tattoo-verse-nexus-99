
import { appConfig } from "@/config/appConfig";

// Helper to simulate network delay
export const simulateNetworkDelay = async (): Promise<void> => {
  const delay = appConfig.mockData.delay;
  if (delay > 0) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
};

// Helper to simulate random errors
export const simulateError = async (): Promise<boolean> => {
  const errorRate = appConfig.mockData.errorRate;
  return Math.random() < errorRate;
};

// Helper to generate mock IDs
export const generateMockId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Helper for delay
export const delay = async (ms: number = 500): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
