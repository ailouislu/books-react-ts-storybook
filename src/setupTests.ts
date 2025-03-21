import '@testing-library/jest-dom';

jest.mock('axios', () => {
    return {
      __esModule: true,
      default: {
        create: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({}),
          post: jest.fn().mockResolvedValue({}),
          interceptors: {
            request: { use: jest.fn(), eject: jest.fn() },
            response: { use: jest.fn(), eject: jest.fn() }
          }
        })),
        get: jest.fn().mockResolvedValue({}),
        post: jest.fn().mockResolvedValue({})
      }
    };
  });
