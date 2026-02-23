import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: 'admin@cubecake.com',
    password: 'admin123'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('Checking...');

  // Check backend status on component mount
  useEffect(() => {
    checkBackendStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5001/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackendStatus(`✅ Backend is running (Port: 5001, DB: ${data.database})`);
      } else {
        setBackendStatus(`❌ Backend responded with error: ${response.status}`);
      }
    } catch (err) {
      console.error('Backend check failed:', err);
      setBackendStatus(`❌ Cannot connect to backend: ${err.message}`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('🔐 Attempting admin login with:', credentials.email);
    
    try {
      // Attempt login
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
        const responseText = await response.text();
        console.log('Raw response:', responseText);
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Server returned invalid JSON. Check backend.`);
      }
      
      if (response.ok && result.success) {
        console.log('✅ Admin login successful:', result);
        
        // Store session
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        // Navigate to admin page
        navigate('/admin');
      } else {
        setError(`❌ Login failed: ${result.message || 'Invalid credentials'}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`❌ Network error: ${error.message}. Make sure backend is running.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-shield-lock text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Admin Login</h2>
          <p className="text-muted">Cube Cake Administration Panel</p>
        </div>

        {/* Backend Status */}
        <div className={`alert ${backendStatus.includes('✅') ? 'alert-success' : 'alert-danger'} mb-4`}>
          <i className={`bi ${backendStatus.includes('✅') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
          {backendStatus}
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Admin Email</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-envelope text-chocolate"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-cream">
                <i className="bi bi-key text-chocolate"></i>
              </span>
              <input
                type="password"
                className="form-control"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-frosting w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Authenticating...
              </>
            ) : (
              <>
                <i className="bi bi-shield-lock me-2"></i>
                Login as Administrator
              </>
            )}
          </button>

          <div className="text-center mb-3">
            <small className="text-muted">
              Default admin: <strong>admin@cubecake.com</strong> / <strong>admin123</strong>
            </small>
          </div>
        </form>

        {/* Debug Buttons */}
        <div className="mt-4">
          <button 
            onClick={checkBackendStatus}
            className="btn btn-outline-secondary w-100 mb-2"
            disabled={loading}
          >
            <i className="bi bi-arrow-repeat me-2"></i>
            Re-check Backend Status
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn btn-link text-decoration-none w-100"
            disabled={loading}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Cake Shop
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;