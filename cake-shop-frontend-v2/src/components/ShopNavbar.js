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
    <nav style={{
      background: 'linear-gradient(135deg, #2C1810 0%, #4A2C2A 100%)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 15px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      {/* Logo / Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/shop/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #D4AF37, #F1D06E)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className="bi bi-shop text-dark fs-5"></i>
          </div>
          <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>
            {user?.shopName || 'Shop Panel'}
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: location.pathname === item.path ? '#2C1810' : 'rgba(255,255,255,0.8)',
                background: location.pathname === item.path ? '#D4AF37' : 'transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'rgba(212,175,55,0.15)';
                  e.currentTarget.style.color = '#D4AF37';
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                }
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          to="/"
          style={{
            color: 'rgba(255,255,255,0.6)',
            textDecoration: 'none',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <i className="bi bi-globe2"></i>
          View Store
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.8rem',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 10,
          border: '1px solid rgba(212,175,55,0.2)'
        }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #D4AF37, #F1D06E)',
            borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '0.8rem', color: '#2C1810'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'S'}
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>
              {user?.name?.split(' ')[0] || 'Owner'}
            </div>
            <div style={{ color: '#D4AF37', fontSize: '0.7rem', opacity: 0.8 }}>Shop Owner</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,107,107,0.15)',
            border: '1px solid rgba(255,107,107,0.3)',
            color: '#FF6B6B',
            borderRadius: 8,
            padding: '0.4rem 0.9rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,107,107,0.15)'}
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default ShopNavbar;
