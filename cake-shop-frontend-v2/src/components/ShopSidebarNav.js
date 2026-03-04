// src/components/ShopSidebarNav.js - Sidebar for shop owner and admin routes
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShopSidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isAdmin = user?.role === 'super_admin';

  const shopNavItems = [
    { path: '/shop/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/shop/my-cakes', icon: 'bi-cake2', label: 'My Cakes' },
    { path: '/shop/orders', icon: 'bi-bag-check', label: 'Orders' },
    { path: '/shop/settings', icon: 'bi-gear', label: 'Settings' },
  ];

  const adminNavItems = [
    { path: '/admin', icon: 'bi-speedometer2', label: 'Overview' },
  ];

  const navItems = isAdmin ? adminNavItems : shopNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarWidth = isHovered ? '220px' : '72px';

  return (
    <>
      <style>{`
        .shop-sidebar { transition: width 0.3s cubic-bezier(0.2,0.9,0.4,1); overflow: hidden; }
        .shop-sidebar-item { display:flex; align-items:center; padding:0.75rem; border-radius:12px; text-decoration:none; transition:all 0.2s; color:rgba(255,255,255,0.55); gap:0.75rem; white-space:nowrap; margin-bottom:4px; }
        .shop-sidebar-item:hover { background:rgba(212,175,55,0.12); color:#D4AF37; }
        .shop-sidebar-item.active { background:rgba(212,175,55,0.18); color:#D4AF37; }
        .shop-sidebar-label { font-size:0.88rem; font-weight:600; opacity:${isHovered ? 1 : 0}; transition:opacity 0.2s; }
        .shop-sidebar-icon { font-size:1.25rem; flex-shrink:0; width:24px; text-align:center; }
      `}</style>
      <div
        className="shop-sidebar"
        style={{ width: sidebarWidth, height: '100vh', background: 'linear-gradient(180deg, #1a0f0c 0%, #2C1810 100%)', borderRight: '1px solid rgba(212,175,55,0.12)', display: 'flex', flexDirection: 'column', padding: '1rem 0.75rem', boxSizing: 'border-box', flexShrink: 0, position: 'sticky', top: 0 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.25rem', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#D4AF37,#F1D06E)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(212,175,55,0.3)' }}>
            {isAdmin ? '🛡️' : '🎂'}
          </div>
          <div style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', overflow: 'hidden' }}>
            <div style={{ color: '#D4AF37', fontWeight: 700, fontSize: '0.9rem', fontFamily: "'Playfair Display', serif", whiteSpace: 'nowrap' }}>
              {isAdmin ? 'Admin Panel' : (user?.shopName || 'Shop Panel')}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
              {isAdmin ? 'Super Admin' : 'Shop Owner'}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1 }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`shop-sidebar-item${location.pathname === item.path ? ' active' : ''}`}
            >
              <i className={`bi ${item.icon} shop-sidebar-icon`}></i>
              <span className="shop-sidebar-label" style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>{item.label}</span>
            </Link>
          ))}

          <div style={{ height: 1, background: 'rgba(212,175,55,0.12)', margin: '0.75rem 0' }} />

          <Link to="/" className="shop-sidebar-item">
            <i className="bi bi-globe2 shop-sidebar-icon"></i>
            <span className="shop-sidebar-label" style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>View Store</span>
          </Link>
        </div>

        {/* User + Logout */}
        <div style={{ borderTop: '1px solid rgba(212,175,55,0.12)', paddingTop: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.25rem', marginBottom: '0.5rem', overflow: 'hidden' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#D4AF37,#F1D06E)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#1a0f08', flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', overflow: 'hidden' }}>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{isAdmin ? 'Super Admin' : 'Shop Owner'}</div>
            </div>
          </div>

          <button onClick={handleLogout} className="shop-sidebar-item" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(220,100,100,0.7)', textAlign: 'left' }}>
            <i className="bi bi-box-arrow-right shop-sidebar-icon"></i>
            <span className="shop-sidebar-label" style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s', whiteSpace: 'nowrap' }}>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShopSidebarNav;
