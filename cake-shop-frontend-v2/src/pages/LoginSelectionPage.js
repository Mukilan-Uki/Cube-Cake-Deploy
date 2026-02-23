// src/pages/LoginSelectionPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel p-5 animate-fade-up" style={{ maxWidth: '700px', width: '100%' }}>
        <div className="text-center mb-5">
          <div className="rounded-circle p-4 d-inline-flex mb-3 align-items-center justify-content-center animate-float"
            style={{ background: 'var(--gradient-gold)', boxShadow: 'var(--glow-gold)', width: '100px', height: '100px' }}>
            <i className="bi bi-cake2 text-white display-3"></i>
          </div>
          <h1 className="display-4 fw-bold text-chocolate mb-2">Welcome Back</h1>
          <p className="lead text-secondary">Select your login portal</p>
        </div>

        <div className="row g-4">
          {/* Customer Login */}
          <div className="col-md-6">
            <div
              className="glass-panel p-4 text-center h-100 position-relative overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.5)' }}
              onClick={() => navigate('/login/customer')}
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
                <i className="bi bi-person-circle display-4 text-gold"></i>
              </div>
              <h3 className="h4 text-chocolate fw-bold mb-3">Customer</h3>
              <p className="small text-secondary mb-4">
                Order cakes, track deliveries, and manage your profile
              </p>
              <button className="btn-royal w-100 small">
                Customer Login
              </button>
            </div>
          </div>

          {/* Shop Owner Login */}
          <div className="col-md-6">
            <div
              className="glass-panel p-4 text-center h-100 position-relative overflow-hidden"
              style={{ cursor: 'pointer', transition: 'all 0.3s ease', background: 'rgba(255,255,255,0.5)' }}
              onClick={() => navigate('/admin/login')}
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
                <i className="bi bi-shop display-4 text-chocolate"></i>
              </div>
              <h3 className="h4 text-chocolate fw-bold mb-3">Shop Owner</h3>
              <p className="small text-secondary mb-4">
                Manage your bakery, orders, and inventory
              </p>
              <button className="btn-royal-outline w-100 small">
                Admin Portal
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-secondary mb-3">New to Cube Cake?</p>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="btn btn-link text-gold text-decoration-none fw-bold"
            >
              create an Account
            </button>
            <span className="text-muted">|</span>
            <button
              onClick={() => navigate('/register/shop')}
              className="btn btn-link text-chocolate text-decoration-none fw-bold"
            >
              Register Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelectionPage;