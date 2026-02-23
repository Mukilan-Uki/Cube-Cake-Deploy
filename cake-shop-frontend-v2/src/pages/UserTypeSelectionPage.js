// src/pages/UserTypeSelectionPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserTypeSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel p-5 animate-fade-up" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-chocolate mb-2">Join Our Community</h1>
          <p className="lead text-secondary">Choose how you want to experience Cube Cake</p>
        </div>

        <div className="row g-4">
          {/* Customer Registration */}
          <div className="col-md-6">
            <div
              className="glass-panel p-4 text-center h-100 position-relative overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.5)' }}
              onClick={() => navigate('/register/customer')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.borderColor = 'var(--royal-gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle border border-2 border-gold p-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-person-heart fs-1 text-gold"></i>
                </div>
              </div>
              <h3 className="h4 text-chocolate fw-bold mb-3">Cake Lover</h3>
              <ul className="text-start text-secondary small mb-4 ps-4 list-unstyled">
                <li className="mb-2"><i className="bi bi-check2 text-gold me-2"></i>Order custom cakes</li>
                <li className="mb-2"><i className="bi bi-check2 text-gold me-2"></i>Track deliveries</li>
                <li className="mb-2"><i className="bi bi-check2 text-gold me-2"></i>Save favorites</li>
              </ul>
              <button className="btn-royal w-100">
                Join as Customer
              </button>
            </div>
          </div>

          {/* Shop Owner Registration */}
          <div className="col-md-6">
            <div
              className="glass-panel p-4 text-center h-100 position-relative overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.5)' }}
              onClick={() => navigate('/register/shop')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                e.currentTarget.style.borderColor = 'var(--royal-chocolate)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle border border-2 border-chocolate p-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-shop-window fs-1 text-chocolate"></i>
                </div>
              </div>
              <h3 className="h4 text-chocolate fw-bold mb-3">Patisserie Owner</h3>
              <ul className="text-start text-secondary small mb-4 ps-4 list-unstyled">
                <li className="mb-2"><i className="bi bi-check2 text-chocolate me-2"></i>Sell your creations</li>
                <li className="mb-2"><i className="bi bi-check2 text-chocolate me-2"></i>Manage orders</li>
                <li className="mb-2"><i className="bi bi-check2 text-chocolate me-2"></i>Grow your business</li>
              </ul>
              <button className="btn-royal-outline w-100" style={{ borderColor: 'var(--royal-chocolate)', color: 'var(--royal-chocolate)' }}>
                Register Business
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-secondary mb-0">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login-selection')}
              className="btn btn-link text-gold text-decoration-none fw-bold p-0 align-baseline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionPage;