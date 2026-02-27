import { API_CONFIG } from '../config';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token with backend
          const response = await fetch(API_CONFIG.BASE_URL + '/auth/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUser(data.user);
              setToken(storedToken);
            } else {
              // Invalid token - clear storage
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setToken(null);
            }
          } else {
            // Token expired or invalid - keep user data but mark as not authenticated
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // Keep user data even if backend is unreachable
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  // Register customer
  const register = async (userData) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, message: 'Registration successful! Please login.' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  };

  // Register shop owner (creates user only)
  const registerShopOwner = async (userData) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/register-shop-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  };

  // Register shop (creates user AND shop in one step)
  const registerShop = async (shopData) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/register-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(shopData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        // Redirect to shop dashboard
        navigate('/shop/dashboard');
        
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  };

  // Login user (any role)
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        // Redirect based on role
        if (data.user.role === 'super_admin') {
          navigate('/admin');
        } else if (data.user.role === 'shop_owner') {
          if (data.user.shopId) {
            navigate('/shop/dashboard');
          } else {
            navigate('/shop/register');
          }
        } else {
          navigate('/');
        }
        
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Cannot connect to server`
      };
    }
  };

  // Admin/Shop Owner login
  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        
        // Redirect based on role and shop status
        if (data.user.role === 'super_admin') {
          navigate('/admin');
        } else if (data.user.role === 'shop_owner') {
          if (data.user.shopId) {
            navigate('/shop/dashboard');
          } else {
            navigate('/shop/register');
          }
        }
        
        return { success: true, data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Cannot connect to server`
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await fetch(API_CONFIG.BASE_URL + '/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, message: 'Profile updated successfully' };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return {
        success: false,
        message: `Network error: ${error.message}`
      };
    }
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is shop owner with registered shop
  const isShopOwnerWithShop = () => {
    return user?.role === 'shop_owner' && user?.shopId;
  };

  const value = {
    user,
    token,
    loading,
    register,
    registerShopOwner,
    registerShop,
    login,
    adminLogin,
    logout,
    updateProfile,
    hasRole,
    isShopOwnerWithShop,
    isAuthenticated: !!user,
    isShopOwner: user?.role === 'shop_owner',
    isAdmin: user?.role === 'super_admin',
    setAuthData: (userData, tokenData) => {
      setUser(userData);
      setToken(tokenData);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};