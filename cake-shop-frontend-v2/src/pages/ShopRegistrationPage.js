import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShopRegistrationPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    businessType: 'bakery'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register-shop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Save token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to dashboard
        navigate('/shop/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card shadow border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <i className="bi bi-shop fs-1 text-primary"></i>
              <h2 className="mt-3">Register Your Shop</h2>
              <p className="text-muted">Start selling your cakes online</p>
            </div>

            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Shop Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.shopName}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Business Address *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Business Type</label>
                <select
                  className="form-select"
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                >
                  <option value="bakery">Bakery</option>
                  <option value="cafe">Cafe</option>
                  <option value="home_business">Home Business</option>
                  <option value="patisserie">Patisserie</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  minLength="6"
                />
                <small className="text-muted">Minimum 6 characters</small>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registering...
                  </>
                ) : (
                  'Register Shop'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Already have a shop?{' '}
                <button 
                  className="btn btn-link p-0"
                  onClick={() => navigate('/admin/login')}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationPage;