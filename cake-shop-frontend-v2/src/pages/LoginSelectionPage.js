import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSelectionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-card p-5" style={{ maxWidth: '600px' }}>
        <div className="text-center mb-5">
          <div className="bg-gradient-to-r from-apricot to-strawberry rounded-circle p-4 d-inline-block mb-3">
            <i className="bi bi-cake text-white fs-1"></i>
          </div>
          <h1 className="font-script gradient-text display-4">Welcome to Cube Cake</h1>
          <p className="lead text-chocolate">Choose your login type</p>
        </div>

        <div className="row g-4">
          {/* Customer Login */}
          <div className="col-md-6">
            <div 
              className="glass-card p-4 text-center h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/login/customer')}
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
                  Browse cake gallery
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Design custom cakes
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Track your orders
                </li>
              </ul>
              <button className="btn btn-frosting w-100">
                Continue as Customer
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          {/* Shop Owner Login */}
          <div className="col-md-6">
            <div 
              className="glass-card p-4 text-center h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/admin/login')}
            >
              <div className="rounded-circle bg-strawberry bg-opacity-10 p-4 d-inline-flex mb-4">
                <i className="bi bi-shield-lock fs-2 text-strawberry"></i>
              </div>
              <h3 className="text-chocolate mb-3">Shop Owner</h3>
              <p className="text-muted mb-4">
                Manage orders, inventory, and shop analytics (Admin access required)
              </p>
              <ul className="text-start text-muted small mb-4">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Manage cake orders
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Update order status
                </li>
                <li>
                  <i className="bi bi-check-circle text-success me-2"></i>
                  View shop analytics
                </li>
              </ul>
              <button className="btn btn-strawberry w-100">
                <i className="bi bi-shield-lock me-2"></i>
                Shop Owner Login
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-muted mb-3">Don't have an account?</p>
          <div className="d-flex justify-content-center gap-3">
            <button 
              onClick={() => navigate('/register')}
              className="btn btn-outline-apricot"
            >
              <i className="bi bi-person-plus me-2"></i>
              Register as Customer
            </button>
<button 
  onClick={() => navigate('/register/shop')}  // Changed from alert to navigation
  className="btn btn-outline-strawberry"
>
  <i className="bi bi-shop me-2"></i>
  Register Shop
</button>
          </div>
        </div>

        <div className="text-center mt-4">
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

export default LoginSelectionPage;