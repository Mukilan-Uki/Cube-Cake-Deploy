// src/components/SidebarNav.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { path: '/', icon: 'bi-house-door', label: 'Home' },
    { path: '/gallery', icon: 'bi-grid-3x3-gap', label: 'Gallery' },
    { path: '/create', icon: 'bi-palette', label: 'Design' },
    { path: '/cart', icon: 'bi-bag-heart', label: 'Cart', badge: cartCount },
  ];

  const authItems = isAuthenticated ? [
    { path: '/profile', icon: 'bi-person-circle', label: 'Profile' },
    { path: '/my-orders', icon: 'bi-box', label: 'Orders' },
    ...(user?.role === 'super_admin' ? [{ path: '/admin', icon: 'bi-speedometer2', label: 'Admin Panel' }] : []),
    ...(user?.role === 'shop_owner' ? [{ path: '/shop/dashboard', icon: 'bi-shop', label: 'My Shop' }] : []),
  ] : [
    { path: '/login-selection', icon: 'bi-box-arrow-in-right', label: 'Login' },
    { path: '/register', icon: 'bi-person-plus', label: 'Register' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style>{`
        .sidebar-container {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 9999;
        }

        .sidebar {
          width: ${isHovered ? '220px' : '80px'};
          height: 100vh;
          background: linear-gradient(180deg, #1a0f0c 0%, #2C1810 100%);
          transition: width 0.3s cubic-bezier(0.2, 0.9, 0.4, 1);
          box-shadow: 4px 0 20px rgba(0,0,0,0.3);
          border-right: 1px solid rgba(212, 175, 55, 0.15);
          overflow-x: hidden;
          overflow-y: auto;
        }

        .sidebar::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #D4AF37;
          border-radius: 4px;
        }

        .logo-container {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          margin-bottom: 20px;
        }

        .logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #D4AF37, #F1D06E);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }

        .logo:hover {
          transform: scale(1.05) rotate(5deg);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.5);
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin: 4px 12px;
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.4s ease, height 0.4s ease;
          z-index: 0;
        }

        .nav-item:hover::before {
          width: 200px;
          height: 200px;
        }

        .nav-item:hover {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.05);
        }

        .nav-item.active {
          color: #D4AF37;
          background: linear-gradient(90deg, rgba(212, 175, 55, 0.15), transparent);
          border-left: 3px solid #D4AF37;
        }

        .nav-icon {
          min-width: 32px;
          font-size: 1.3rem;
          position: relative;
          z-index: 1;
          transition: transform 0.2s ease;
        }

        .nav-item:hover .nav-icon {
          transform: scale(1.1);
        }

        .nav-label {
          margin-left: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          opacity: ${isHovered ? 1 : 0};
          transition: opacity 0.2s ease 0.1s;
          position: relative;
          z-index: 1;
        }

        .badge-cart {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #FF6B8B, #FF9E6D);
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 20px;
          min-width: 18px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(255, 107, 139, 0.5);
          border: 2px solid #2C1810;
          z-index: 2;
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.3), transparent);
          margin: 15px 20px;
        }

        .user-section {
          padding: 15px 12px;
          margin: 10px 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.1);
          backdrop-filter: blur(5px);
          transition: all 0.2s ease;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #D4AF37, #F1D06E);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #2C1810;
          flex-shrink: 0;
        }

        .user-name {
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 2px;
          white-space: nowrap;
        }

        .user-role {
          color: #D4AF37;
          font-size: 0.7rem;
          opacity: 0.8;
          white-space: nowrap;
        }

        .logout-btn {
          width: calc(100% - 24px);
          margin: 10px 12px;
          padding: 10px;
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
          border-radius: 10px;
          color: #FF6B6B;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .logout-btn:hover {
          background: rgba(255, 107, 107, 0.2);
          border-color: #FF6B6B;
          transform: translateY(-2px);
        }

        .tooltip {
          position: fixed;
          left: 90px;
          background: #D4AF37;
          color: #2C1810;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          pointer-events: none;
          z-index: 10000;
          animation: fadeIn 0.2s ease;
        }

        .tooltip::before {
          content: '';
          position: absolute;
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 5px 5px 5px 0;
          border-style: solid;
          border-color: transparent #D4AF37 transparent transparent;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .bottom-decoration {
          position: absolute;
          bottom: 20px;
          left: 0;
          width: 100%;
          text-align: center;
          opacity: ${isHovered ? 0.3 : 0};
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
      `}</style>

      <div 
        className="sidebar-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setHoveredItem(null);
        }}
      >
        <div className="sidebar">
          {/* Logo */}
          <div className="logo-container">
            <Link to="/" className="text-decoration-none">
              <div className="logo">
                <i className="bi bi-cake2 text-white fs-2"></i>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="nav-icon position-relative">
                  <i className={`bi ${item.icon}`}></i>
                  {item.badge > 0 && (
                    <span className="badge-cart">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className="nav-label">{item.label}</span>
                {!isHovered && hoveredItem === item.label && (
                  <div className="tooltip">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}

            <div className="divider"></div>

            {authItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="nav-icon">
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <span className="nav-label">{item.label}</span>
                {!isHovered && hoveredItem === item.label && (
                  <div className="tooltip">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}

            {/* User Info (only when expanded) */}
            {isAuthenticated && isHovered && (
              <div className="user-section">
                <div className="d-flex align-items-center gap-2">
                  <div className="user-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = user?.name?.charAt(0) || 'U'; }} />
                    ) : (user?.name?.charAt(0) || 'U')}
                  </div>
                  <div>
                    <div className="user-name">{user?.name?.split(' ')[0]}</div>
                    <div className="user-role">{user?.role}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Logout Button */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="logout-btn d-flex align-items-center justify-content-center gap-2 w-100 border-0"
                onMouseEnter={() => setHoveredItem('Logout')}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <i className="bi bi-box-arrow-right"></i>
                {isHovered && <span className="small">Logout</span>}
                {!isHovered && hoveredItem === 'Logout' && (
                  <div className="tooltip">
                    Logout
                  </div>
                )}
              </button>
            )}
          </nav>

          {/* Bottom Decoration */}
          <div className="bottom-decoration">
            <i className="bi bi-cake2" style={{ color: '#D4AF37', fontSize: '1.2rem' }}></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarNav;