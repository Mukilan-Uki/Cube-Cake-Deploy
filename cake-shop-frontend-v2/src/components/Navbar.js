import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', icon: 'bi-house-door' },
    { path: '/gallery', label: 'Gallery', icon: 'bi-grid-3x3-gap' },
    { path: '/create', label: 'Design Studio', icon: 'bi-palette' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 158, 109, 0.2)',
      padding: '1rem 0'
    }}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="position-relative">
            <div className="rounded-circle p-2" style={{
              background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
              boxShadow: '0 8px 20px rgba(255, 107, 139, 0.3)'
            }}>
              <i className="bi bi-cake2 fs-3 text-white"></i>
            </div>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
              <span className="visually-hidden">New</span>
            </span>
          </div>
          <span className="ms-2 fw-bold" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #4A2C2A, #FF6B8B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Cube Cake
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mx-2">
                <Link 
                  to={item.path}
                  className={`nav-link px-3 py-2 rounded-pill d-flex align-items-center ${
                    location.pathname === item.path ? 'active' : ''
                  }`}
                  style={{
                    color: location.pathname === item.path ? '#FF6B8B' : '#4A2C2A',
                    fontWeight: '500',
                    transition: 'all 0.3s ease',
                    background: location.pathname === item.path ? 'rgba(255, 107, 139, 0.1)' : 'transparent'
                  }}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side - Auth Based */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                {/* User Menu - When Logged In */}
                <div className="dropdown">
                  <button 
                    className="btn d-flex align-items-center gap-2 rounded-pill" 
                    style={{
                      background: 'rgba(255, 158, 109, 0.1)',
                      border: '1px solid rgba(255, 158, 109, 0.3)',
                      padding: '0.5rem 1rem'
                    }}
                    data-bs-toggle="dropdown"
                  >
                    <div className="rounded-circle bg-gradient-primary p-1">
                      <i className="bi bi-person-circle text-white"></i>
                    </div>
                    <span className="fw-medium">{user?.name?.split(' ')[0] || 'Account'}</span>
                    <i className="bi bi-chevron-down small"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 p-2">
                    <li>
                      <Link className="dropdown-item rounded-2 py-2" to="/profile">
                        <i className="bi bi-person me-2"></i> My Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded-2 py-2" to="/my-orders">
                        <i className="bi bi-box me-2"></i> My Orders
                      </Link>
                    </li>
                    {(user?.role === 'super_admin') && (
                      <li>
                        <Link className="dropdown-item rounded-2 py-2" to="/admin">
                          <i className="bi bi-speedometer2 me-2"></i> Admin
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item rounded-2 py-2 text-danger"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Cart Button */}
                <Link to="/order" className="btn position-relative rounded-pill" style={{
                  background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                  border: 'none',
                  padding: '0.5rem 1.2rem',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  <i className="bi bi-bag-heart me-1"></i>
                  Cart
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-lavender" style={{ fontSize: '0.7rem' }}>
                    0
                  </span>
                </Link>
              </>
            ) : (
              <>
                {/* Login/Register - When Logged Out */}
                <Link to="/login" className="btn rounded-pill px-4" style={{
                  background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </Link>
                
                <Link to="/register" className="btn rounded-pill px-4" style={{
                  background: 'transparent',
                  border: '2px solid #FF9E6D',
                  color: '#FF9E6D',
                  fontWeight: '500'
                }}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;