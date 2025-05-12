
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
