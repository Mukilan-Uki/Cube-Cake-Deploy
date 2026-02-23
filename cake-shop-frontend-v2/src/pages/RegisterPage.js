// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: 'customer'
    });
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login-selection');
      }, 2000);
    } else {
      setErrors({ general: result.message || 'Registration failed' });
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream">
        <div className="glass-card p-5 text-center animate-fade-in" style={{ maxWidth: '500px' }}>
          <div className="display-1 text-success mb-3">✨</div>
          <h2 className="font-script gradient-text mb-3">Welcome to Cube Cake!</h2>
          <p className="lead">Your account has been created successfully!</p>
          <p className="text-muted mb-4">Please log in with your credentials to continue.</p>
          <div className="spinner-border text-apricot mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5 animate-fade-in" style={{ width: '100%', maxWidth: '550px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-primary rounded-circle p-3 d-inline-block mb-3 animate-float">
            <i className="bi bi-cake2 text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Create Account</h2>
          <p className="text-muted">Join us to start ordering delicious cakes</p>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="alert alert-danger animate-fade-in">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-medium">Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-person text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className={`form-control border-0 bg-cream ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Email *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-envelope text-chocolate"></i>
                </span>
                <input
                  type="email"
                  className={`form-control border-0 bg-cream ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Phone *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-phone text-chocolate"></i>
                </span>
                <input
                  type="tel"
                  className={`form-control border-0 bg-cream ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="07X XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-lock text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control border-0 bg-cream ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <small className="text-muted">Min. 6 characters</small>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-medium">Confirm *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-lock-fill text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control border-0 bg-cream ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>

          <div className="form-check mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              required
            />
            <label className="form-check-label small" htmlFor="terms">
              I agree to the{' '}
              <Link to="/terms" className="text-decoration-none text-apricot">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-decoration-none text-apricot">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-frosting w-100 mt-4 py-3 rounded-pill"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-muted mb-2">
              Already have an account?{' '}
              <Link to="/login-selection" className="text-decoration-none fw-bold text-strawberry">
                Sign In
              </Link>
            </p>
            <p className="text-muted small">
              Want to register as a shop?{' '}
              <Link to="/register/shop" className="text-decoration-none fw-bold" style={{ color: '#9D5CFF' }}>
                Shop Registration
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;