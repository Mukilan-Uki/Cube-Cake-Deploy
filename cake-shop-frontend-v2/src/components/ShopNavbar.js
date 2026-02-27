import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShopNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/shop/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/shop/my-cakes', label: 'My Cakes', icon: 'bi-cake2' },
    { path: '/shop/orders', label: 'Orders', icon: 'bi-bag-check' },
    { path: '/shop/settings', label: 'Settings', icon: 'bi-gear' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="shop-navbar">
      {/* Left: Brand + Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/shop/dashboard" className="shop-navbar-brand">
          <div className="shop-navbar-logo">
            <i className="bi bi-shop"></i>
          </div>
          <span className="shop-navbar-name">
            {user?.shopName || 'Shop Panel'}
          </span>
        </Link>

        <div className="shop-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`shop-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Store link, user info, logout */}
      <div className="shop-nav-right">
        <Link to="/" className="shop-nav-store-link">
          <i className="bi bi-globe2"></i>
          View Store
        </Link>

        <div className="shop-nav-user">
          <div className="shop-nav-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div>
            <div className="shop-nav-user-name">{user?.name?.split(' ')[0] || 'Owner'}</div>
            <div className="shop-nav-user-role">Shop Owner</div>
          </div>
        </div>

        <button className="shop-nav-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default ShopNavbar;
