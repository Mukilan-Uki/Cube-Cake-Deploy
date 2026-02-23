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
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    // Email validation
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
    setMessage({ type: '', text: '' });

    try {
      // Call backend API for shop registration
      const response = await fetch('http://localhost:5001/api/auth/register-shop', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: 'admin' // Shop owners get admin role
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: '✅ Shop registration submitted successfully! We will review your application and contact you shortly.' 
        });
        
        // Clear form
        setFormData({
          shopName: '',
          ownerName: '',
          email: '',
          phone: '',
          address: '',
          password: '',
          confirmPassword: '',
          businessType: 'bakery'
        });
        
        // Auto-redirect after success
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
        
      } else {
        setMessage({ 
          type: 'error', 
          text: `❌ ${data.message || 'Registration failed. Please try again.'}` 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ 
        type: 'error', 
        text: '❌ Network error. Please check your connection and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-4 p-md-5" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="text-center mb-4">
          <div className="bg-gradient-to-r from-strawberry to-lavender rounded-circle p-3 d-inline-block mb-3">
            <i className="bi bi-shop text-white fs-2"></i>
          </div>
          <h2 className="font-script gradient-text">Register Your Cake Shop</h2>
          <p className="text-muted">Join Cube Cake as a shop owner and start selling your creations</p>
        </div>

        <form onSubmit={handleSubmit}>
          {message.text && (
            <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
              <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              {message.text}
            </div>
          )}

          <div className="row g-3">
            {/* Shop Information */}
            <div className="col-12">
              <h5 className="text-chocolate mb-3">Shop Information</h5>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Shop Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-shop text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.shopName ? 'is-invalid' : ''}`}
                  placeholder="Your Cake Shop Name"
                  value={formData.shopName}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                />
                {errors.shopName && <div className="invalid-feedback">{errors.shopName}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Business Type</label>
              <select
                className="form-select"
                value={formData.businessType}
                onChange={(e) => setFormData({...formData, businessType: e.target.value})}
              >
                <option value="bakery">Bakery</option>
                <option value="cafe">Cafe</option>
                <option value="restaurant">Restaurant</option>
                <option value="home-business">Home Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Owner Information */}
            <div className="col-12 mt-3">
              <h5 className="text-chocolate mb-3">Owner Information</h5>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Owner Full Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-person text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.ownerName ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                />
                {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone Number *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-phone text-chocolate"></i>
                </span>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="07X XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Email Address *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-envelope text-chocolate"></i>
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Shop Address *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-geo-alt text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  placeholder="Enter shop address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>
            </div>

            {/* Password Section */}
            <div className="col-12 mt-3">
              <h5 className="text-chocolate mb-3">Account Security</h5>
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-lock text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
              <small className="text-muted">Minimum 6 characters</small>
            </div>

            <div className="col-md-6">
              <label className="form-label">Confirm Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-cream">
                  <i className="bi bi-lock-fill text-chocolate"></i>
                </span>
                <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="form-check mt-4 mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              required
            />
            <label className="form-check-label" htmlFor="terms">
              I agree to the{' '}
              <Link to="/terms" className="text-decoration-none text-strawberry">
                Shop Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-decoration-none text-strawberry">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-frosting w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Registering Your Shop...
              </>
            ) : (
              <>
                <i className="bi bi-shop me-2"></i>
                Register Cake Shop
              </>
            )}
          </button>

          {/* Benefits Section */}
          <div className="mt-4 pt-3 border-top">
            <h6 className="text-chocolate mb-3">🎂 Benefits for Shop Owners:</h6>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Access to full admin dashboard
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Manage cake orders and inventory
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                View sales analytics and reports
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                List your cakes in our marketplace
              </li>
              <li>
                <i className="bi bi-check-circle text-success me-2"></i>
                Customer management tools
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="text-center mt-4">
            <p className="text-muted mb-2">
              Already have a shop account?{' '}
              <Link to="/admin/login" className="text-decoration-none fw-bold text-strawberry">
                Login here
              </Link>
            </p>
            <p className="text-muted mb-3">
              Want to register as a customer?{' '}
              <Link to="/register" className="text-decoration-none fw-bold text-apricot">
                Customer Registration
              </Link>
            </p>
            <button 
              onClick={() => navigate('/')}
              className="btn btn-link text-decoration-none"
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistrationPage;