import { API_CONFIG } from '../config';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiService = {
  // ========== AUTH API ==========
  async register(userData) {
    try {
      const response = await fetch(API_CONFIG.AUTH.REGISTER, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: 'Network error. Check if backend is running.' 
      };
    }
  },

  async login(credentials) {
    try {
      const response = await fetch(API_CONFIG.AUTH.LOGIN, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: 'Cannot connect to server.' 
      };
    }
  },

  async adminLogin(credentials) {
    try {
      const response = await fetch(API_CONFIG.AUTH.ADMIN_LOGIN, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(credentials)
      });
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Cannot connect to admin server' 
      };
    }
  },

  async getProfile() {
    try {
      const response = await fetch(API_CONFIG.AUTH.ME, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  },

  // ========== ORDERS API ==========
  async getOrders() {
    try {
      const response = await fetch(API_CONFIG.ORDERS.BASE, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      return { success: false, orders: [] };
    }
  },

  async getMyOrders() {
    try {
      const response = await fetch(API_CONFIG.ORDERS.MY_ORDERS, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get my orders error:', error);
      return { success: false, message: 'Network error', orders: [] };
    }
  },

  async createOrder(orderData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { 
          success: false, 
          message: 'You must be logged in to place an order' 
        };
      }

      const response = await fetch(API_CONFIG.ORDERS.BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      return { 
        success: false, 
        message: 'Failed to create order. Please try again.' 
      };
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(API_CONFIG.ORDERS.UPDATE_STATUS(orderId), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Update order status error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  // ========== CAKES API ==========
  async getCakes() {
    try {
      const response = await fetch(API_CONFIG.CAKES, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get cakes error:', error);
      return { success: false, cakes: [] };
    }
  },

  // ========== STATS API ==========
  async getStats() {
    try {
      const response = await fetch(API_CONFIG.STATS, {
        headers: getAuthHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      return { success: false, stats: {} };
    }
  },

  // ========== HEALTH CHECK ==========
  async checkBackendHealth() {
    try {
      const response = await fetch(API_CONFIG.HEALTH, {
        headers: { 'Accept': 'application/json' }
      });
      
      return await response.json();
    } catch (error) {
      return { 
        success: false, 
        message: 'Backend is not responding' 
      };
    }
  }
};