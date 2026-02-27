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
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

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
      setTimeout(() => navigate('/login-selection'), 2000);
    } else {
      setErrors({ general: result.message || 'Registration failed' });
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream">
        <div className="glass-panel p-5 text-center animate-fade-up" style={{ maxWidth: '500px' }}>
          <div className="display-1 text-success mb-3">✨</div>
          <h2 className="font-script text-gold mb-3">Welcome to Cube Cake!</h2>
          <p className="lead text-chocolate">Your account has been created.</p>
          <div className="spinner-border text-gold mt-3" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel p-4 p-md-5 animate-fade-up" style={{ width: '100%', maxWidth: '900px', display: 'flex', gap: '2rem' }}>

        {/* Left Side - Visual (Hidden on mobile) */}
        <div className="d-none d-md-flex flex-column justify-content-center align-items-center p-4 rounded-4 text-white text-center position-relative overflow-hidden"
          style={{ flex: 1, background: 'var(--royal-chocolate)', minHeight: '500px' }}>
          <div className="position-absolute w-100 h-100 top-0 start-0" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")',
            backgroundSize: 'cover', opacity: 0.3
          }}></div>
          <div className="position-relative z-1">
            <i className="bi bi-cake2 display-1 text-gold mb-4 d-block"></i>
            <h3 className="font-script text-white display-6">Join the Sweetness</h3>
            <p className="opacity-75 mt-3">Create an account to order custom cakes and track your treats.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ flex: 1.2 }}>
          <div className="text-center mb-4">
            <h2 className="display-6 fw-bold text-chocolate">Create Account</h2>
            <p className="small text-secondary">Join us to start ordering delicious cakes</p>
          </div>

          <form onSubmit={handleSubmit}>
            {errors.general && <div className="alert alert-danger mb-4 small">{errors.general}</div>}

            <div className="mb-3">
              <label className="form-label small fw-bold text-chocolate">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-chocolate">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-chocolate">Phone Number</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-chocolate">Password</label>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-chocolate">Confirm</label>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-royal w-100 mt-3" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
              ) : (
                <><i className="bi bi-person-plus-fill me-2"></i>Sign Up</>
              )}
            </button>

            <div className="text-center mt-4">
              <p className="small text-secondary mb-0">
                Already have an account? <Link to="/login-selection" className="text-gold fw-bold text-decoration-none">Sign In</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;