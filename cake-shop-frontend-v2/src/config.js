// Central configuration for all API URLs
const API_BASE_URL = 'http://localhost:5001/api';
const BACKEND_URL = 'http://localhost:5001';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  BACKEND_URL: BACKEND_URL,
  
  // Auth endpoints
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    ADMIN_LOGIN: `${API_BASE_URL}/auth/admin/login`,
    VERIFY_ADMIN: `${API_BASE_URL}/auth/verify-admin`,
    ME: `${API_BASE_URL}/auth/me`
  },
  
  // Order endpoints
  ORDERS: {
    BASE: `${API_BASE_URL}/orders`,
    MY_ORDERS: `${API_BASE_URL}/orders/my-orders`,
    UPDATE_STATUS: (orderId) => `${API_BASE_URL}/orders/${orderId}/status`
  },
  
  // Cake endpoints
  CAKES: `${API_BASE_URL}/cakes`,
  
  // Stats endpoint
  STATS: `${API_BASE_URL}/stats`,
  
  // Test endpoints
  HEALTH: `${BACKEND_URL}/health`
};