
// This is a simplified version as we don't have actual axios installed
// It provides the minimal API surface needed for the application to build

const api = {
  post: async (url: string, data: any) => {
    console.log('API POST call to', url, 'with data', data);
    return {
      data: {
        url: 'https://example.com/checkout/success'
      }
    };
  },
  get: async (url: string) => {
    console.log('API GET call to', url);
    return {
      data: {}
    };
  }
};

export { api };
