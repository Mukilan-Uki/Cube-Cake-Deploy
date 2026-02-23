// src/pages/AdminLogin.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: 'admin@cubecake.com',
    password: 'admin123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      if (response.ok) {
        setBackendStatus('online');
      } else {
        setBackendStatus('error');
      }
    } catch (err) {
      setBackendStatus('offline');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        })
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        throw new Error('Server error');
      }

      if (response.ok && result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setAuthData(result.user, result.token);
        navigate('/admin');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel p-4 p-md-5 animate-fade-up" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="rounded-circle p-3 d-inline-flex mb-3 align-items-center justify-content-center"
            style={{ background: 'var(--royal-chocolate)', width: '70px', height: '70px', boxShadow: '0 10px 20px rgba(44,24,16,0.2)' }}>
            <i className="bi bi-shield-lock text-gold fs-2"></i>
          </div>
          <h2 className="font-script text-gold display-6">Admin Portal</h2>
          <p className="text-secondary small text-uppercase" style={{ letterSpacing: '1px' }}>Secure Access</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger rounded-3 p-3 mb-4 small">
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label small fw-bold text-chocolate text-uppercase">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 border" style={{ borderRadius: '12px 0 0 12px' }}>
                <i className="bi bi-envelope text-gold"></i>
              </span>
              <input
                type="email"
                className="form-control border-start-0 ps-0"
                style={{ borderRadius: '0 12px 12px 0' }}
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="form-label small fw-bold text-chocolate text-uppercase">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 border" style={{ borderRadius: '12px 0 0 12px' }}>
                <i className="bi bi-key text-gold"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0 ps-0"
                style={{ borderRadius: '0 12px 12px 0' }}
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-royal w-100 mb-4"
            disabled={loading}
          >
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2"></span>Authenticating...</span>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-link text-decoration-none text-secondary small"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Storefront
            </button>
          </div>

          <div className="mt-4 text-center">
            <div className={`d-inline-flex align-items-center px-3 py-1 rounded-pill small ${backendStatus === 'online' ? 'bg-success bg-opacity-10 text-success' :
                backendStatus === 'offline' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'
              }`}>
              <div className={`rounded-circle me-2 ${backendStatus === 'online' ? 'bg-success' :
                  backendStatus === 'offline' ? 'bg-danger' : 'bg-secondary'
                }`} style={{ width: '8px', height: '8px' }}></div>
              System Status: {backendStatus === 'online' ? 'Online' : backendStatus === 'offline' ? 'Offline' : 'Checking...'}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;