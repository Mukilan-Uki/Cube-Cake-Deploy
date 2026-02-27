// Central configuration for all API URLs
// To change backend URL, update this single variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

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

  // Health check
  HEALTH: `${BACKEND_URL}/health`,

  // Shop owner endpoints
  SHOPS: {
    DASHBOARD: `${API_BASE_URL}/shops/dashboard`,
    SETTINGS: `${API_BASE_URL}/shops/settings`,
    MY_CAKES: `${API_BASE_URL}/shops/my-cakes`,
    CAKE: (id) => `${API_BASE_URL}/shops/cakes/${id}`,
    CAKE_TOGGLE: (id) => `${API_BASE_URL}/shops/cakes/${id}/toggle`,
    CAKE_POPULAR: (id) => `${API_BASE_URL}/shops/cakes/${id}/popular`,
    ORDERS: `${API_BASE_URL}/shops/orders`,
    ORDER_STATUS: (orderId) => `${API_BASE_URL}/shops/orders/${orderId}/status`,
    ADD_CAKE: `${API_BASE_URL}/shops/cakes`,
  },

  // Super Admin endpoints
  ADMIN: {
    STATS:              `${API_BASE_URL}/admin/stats`,
    ORDERS:             `${API_BASE_URL}/admin/orders`,
    ORDER_STATUS: (id)=> `${API_BASE_URL}/admin/orders/${id}/status`,
    USERS:              `${API_BASE_URL}/admin/users`,
    USER_TOGGLE: (id)=> `${API_BASE_URL}/admin/users/${id}/toggle`,
    SHOPS:              `${API_BASE_URL}/admin/shops`,
    SHOP_VERIFY: (id)=> `${API_BASE_URL}/admin/shops/${id}/verify`,
    SHOP_TOGGLE: (id)=> `${API_BASE_URL}/admin/shops/${id}/toggle`,
  },

  // Public endpoints
  PUBLIC: {
    CAKES: `${API_BASE_URL}/public/cakes`,
    SHOPS: `${API_BASE_URL}/public/shops`,
    SHOP: (slug) => `${API_BASE_URL}/public/shops/${slug}`,
  }
};
