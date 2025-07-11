
// Configuration object for the application
export const appConfig = {
  // Data source configuration
  dataSource: {
    // Use mock data instead of real Supabase connection
    useMockData: true,
    // Log service calls (helpful for debugging)
    logServiceCalls: true,
  },
  // Mock data configuration
  mockData: {
    // Simulate network delay in milliseconds (0 = no delay)
    delay: 500,
    // Probability of mock error (0 = never, 1 = always)
    errorRate: 0,
  },
};
