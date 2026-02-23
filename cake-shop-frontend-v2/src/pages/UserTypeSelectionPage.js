import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-5" style={{ maxWidth: '700px' }}>
        <div className="text-center mb-5">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-4 d-inline-block mb-3">
            <i className="bi bi-cake text-white fs-1"></i>
          </div>
          <h1 className="font-script gradient-text display-4">Join Cube Cake</h1>
          <p className="lead text-chocolate">Select your account type to get started</p>
        </div>

        <div className="row g-4">
          {/* Customer Registration */}
          <div className="col-md-6">
            <div 
              className="glass-card p-4 text-center h-100 cursor-pointer"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF9E6D'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              onClick={() => navigate('/register/customer')}
            >
              <div className="rounded-circle bg-apricot bg-opacity-10 p-4 d-inline-flex mb-4">
                <i className="bi bi-person-fill fs-2 text-apricot"></i>
              </div>
              <h3 className="text-chocolate mb-3">Customer</h3>
              <p className="text-muted mb-4">
                Order cakes, track deliveries, and save your favorite designs
              </p>
              <ul className="text-start text-muted small mb-4">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Browse & order cakes
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Custom cake designer
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Track order status
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Save favorite designs
                </li>
              </ul>
              <button className="btn btn-frosting w-100">
                Register as Customer
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          {/* Shop Owner Registration */}
          <div className="col-md-6">
            <div 
              className="glass-card p-4 text-center h-100 cursor-pointer"
              style={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF6B8B'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              onClick={() => navigate('/register/shop')}
            >
              <div className="rounded-circle bg-strawberry bg-opacity-10 p-4 d-inline-flex mb-4">
                <i className="bi bi-shop fs-2 text-strawberry"></i>
              </div>
              <h3 className="text-chocolate mb-3">Cake Shop Owner</h3>
              <p className="text-muted mb-4">
                List your cakes, manage orders, and grow your business
              </p>
              <ul className="text-start text-muted small mb-4">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Sell your cakes
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Order management
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Sales analytics
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Customer management
                </li>
              </ul>
              <button className="btn w-100" style={{
                background: 'linear-gradient(135deg, #FF6B8B, #9D5CFF)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '12px',
                fontWeight: '600'
              }}>
                Register as Shop Owner
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-muted mb-3">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login-selection')}
              className="btn btn-link text-decoration-none fw-bold"
              style={{ color: '#FF6B8B' }}
            >
              Sign in here
            </button>
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn btn-link text-decoration-none"
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;