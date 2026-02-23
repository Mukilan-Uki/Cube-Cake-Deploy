// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  // Pre-fill demo credentials
  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@customer.com',
      password: 'customer123',
      rememberMe: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, formData.rememberMe);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="row g-0 align-items-center" style={{ maxWidth: '1100px' }}>
        {/* Left side - Decorative */}
        <div className="col-lg-6 d-none d-lg-block">
          <div className="p-5">
            <div className="position-relative">
              <div className="hero-cake-animation mx-auto">
                <div className="cake-base"></div>
                <div className="cake-layer-1"></div>
                <div className="cake-layer-2"></div>
                <div className="cake-topping"></div>
                <div className="cherry"></div>
              </div>
              <div className="text-center mt-4">
                <h2 className="font-script gradient-text display-5">Welcome Back!</h2>
                <p className="text-muted">Sign in to continue your sweet journey</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="col-lg-6">
          <div className="glass-card p-4 p-md-5 animate-fade-in">
            <div className="text-center mb-4 d-lg-none">
              <div className="bg-gradient-primary rounded-circle p-3 d-inline-block mb-3">
                <i className="bi bi-cake2 text-white fs-2"></i>
              </div>
            </div>

            <h3 className="text-center mb-4 fw-bold" style={{ color: '#4A2C2A' }}>
              <i className="bi bi-box-arrow-in-right me-2 text-strawberry"></i>
              Sign In
            </h3>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger animate-fade-in">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-medium">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-cream border-0">
                    <i className="bi bi-envelope text-chocolate"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-0 bg-cream"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-cream border-0">
                    <i className="bi bi-lock text-chocolate"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-0 bg-cream"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-cream border-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="mb-4 d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  />
                  <label className="form-check-label small" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-decoration-none small text-strawberry">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-frosting w-100 py-3 rounded-pill mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>

              <div className="text-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <hr className="flex-grow-1" />
                  <span className="text-muted small">or continue with</span>
                  <hr className="flex-grow-1" />
                </div>
              </div>

              <div className="d-flex gap-2 mb-4">
                <button 
                  type="button"
                  className="btn btn-outline-apricot flex-grow-1 py-2"
                  onClick={fillDemoCredentials}
                >
                  <i className="bi bi-person me-2"></i>
                  Demo User
                </button>
                <button 
                  type="button"
                  className="btn btn-outline-strawberry flex-grow-1 py-2"
                  onClick={() => navigate('/admin/login')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Admin
                </button>
              </div>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-bold text-apricot">
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;