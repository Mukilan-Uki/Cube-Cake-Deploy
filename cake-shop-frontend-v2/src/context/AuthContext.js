// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Validate token on load
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Verify token with backend
          const response = await fetch('http://localhost:5001/api/auth/me', {
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
            // This fixes the refresh issue
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

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Don't auto-login - return success without setting user
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

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
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

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user // Changed from !!user && !!token to just !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};