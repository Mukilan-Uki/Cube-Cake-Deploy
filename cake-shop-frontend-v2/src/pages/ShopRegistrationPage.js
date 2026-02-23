// src/pages/ShopRegistrationPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ShopRegistrationPage = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    businessType: 'bakery'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Min 6 chars required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:5001/api/auth/register-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: 'admin'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Application submitted successfully!' });
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel p-4 p-md-5 animate-fade-up" style={{ width: '100%', maxWidth: '800px' }}>
        <div className="text-center mb-5">
          <div className="rounded-circle p-3 d-inline-flex mb-3 align-items-center justify-content-center bg-white shadow-sm" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-shop-window text-chocolate fs-2"></i>
          </div>
          <h2 className="display-5 fw-bold text-chocolate">Partner With Us</h2>
          <p className="text-secondary">Register your patisserie and reach more customers</p>
        </div>

        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`alert border-0 rounded-3 mb-4 text-center ${message.type === 'success' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
              {message.text}
            </div>
          )}

          <div className="row g-4">
            <div className="col-12"><h5 className="text-gold border-bottom border-secondary border-opacity-10 pb-2 mb-0">Business Details</h5></div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Shop Name</label>
              <input
                type="text"
                className={`form-control ${errors.shopName ? 'is-invalid' : ''}`}
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Business Type</label>
              <select
                className="form-select border-2"
                style={{ borderRadius: '12px', padding: '12px' }}
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              >
                <option value="bakery">Bakery</option>
                <option value="cafe">Cafe</option>
                <option value="home-business">Home Business</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Shop Address</label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Contact Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-12 mt-4"><h5 className="text-gold border-bottom border-secondary border-opacity-10 pb-2 mb-0">Owner Details</h5></div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Full Name</label>
              <input
                type="text"
                className={`form-control ${errors.ownerName ? 'is-invalid' : ''}`}
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-chocolate">Email Address</label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

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
              <label className="form-label small fw-bold text-chocolate">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div className="form-check mt-4 mb-4">
            <input className="form-check-input" type="checkbox" id="terms" required />
            <label className="form-check-label small text-secondary" htmlFor="terms">
              I agree to the <Link to="/terms" className="text-gold text-decoration-none">Terms</Link> & <Link to="/privacy" className="text-gold text-decoration-none">Privacy Policy</Link>
            </label>
          </div>

          <button type="submit" className="btn-royal w-100 py-3" disabled={loading}>
            {loading ? 'Submitting Application...' : 'Register Business'}
          </button>

          <div className="text-center mt-4">
            <p className="small text-secondary mb-0">
              Already a partner? <Link to="/admin/login" className="text-chocolate fw-bold text-decoration-none">Login Dashboard</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistrationPage;