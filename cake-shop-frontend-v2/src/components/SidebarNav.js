// src/components/SidebarNav.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: 'bi-house-door', color: '#FF9E6D', description: 'Go to homepage' },
    { path: '/gallery', label: 'Gallery', icon: 'bi-grid-3x3-gap', color: '#FF6B8B', description: 'Browse our cakes' },
    { path: '/create', label: 'Design Studio', icon: 'bi-palette', color: '#9D5CFF', description: 'Create your own' },
    { path: '/order', label: 'Cart', icon: 'bi-bag-heart', color: '#6AE1FF', description: 'View your cart' },
  ];

  const authItems = isAuthenticated ? [
    { path: '/profile', label: 'Profile', icon: 'bi-person-circle', color: '#FF9E6D', description: 'Your profile' },
    { path: '/my-orders', label: 'My Orders', icon: 'bi-box', color: '#FF6B8B', description: 'Track your orders' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: 'bi-speedometer2', color: '#9D5CFF', description: 'Admin dashboard' }] : []),
  ] : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div 
      className="sidebar position-fixed top-0 start-0 h-100 d-flex flex-column"
      style={{
        width: isExpanded ? '280px' : '80px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 158, 109, 0.2)',
        boxShadow: isExpanded ? '10px 0 30px rgba(0, 0, 0, 0.1)' : 'none',
        zIndex: 9999,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        setHoveredItem(null);
      }}
    >
      {/* Logo Section */}
      <div className="py-4 px-3" style={{
        borderBottom: '1px solid rgba(255, 158, 109, 0.2)',
        marginBottom: '1.5rem'
      }}>
        <Link to="/" className="text-decoration-none d-flex align-items-center">
          <div className="position-relative">
            <div className="rounded-circle p-2" style={{
              background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
              boxShadow: '0 8px 20px rgba(255, 107, 139, 0.3)',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-cake2 fs-3 text-white"></i>
            </div>
          </div>
          {isExpanded && (
            <div className="ms-3">
              <span className="fw-bold d-block" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.4rem',
                background: 'linear-gradient(135deg, #4A2C2A, #FF6B8B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                whiteSpace: 'nowrap',
                lineHeight: 1.2
              }}>
                Cube Cake
              </span>
              <span className="small text-muted">Premium Bakery</span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-grow-1 overflow-auto">
        <ul className="nav flex-column px-2">
          {navItems.map((item) => (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className="nav-link d-flex align-items-center rounded-3"
                style={{
                  padding: '12px',
                  color: location.pathname === item.path ? item.color : '#4A2C2A',
                  background: location.pathname === item.path ? `rgba(${hexToRgb(item.color)}, 0.1)` : 'transparent',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {location.pathname === item.path && (
                  <span className="position-absolute start-0 top-50 translate-middle-y" style={{
                    width: '4px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                    borderRadius: '0 4px 4px 0'
                  }}></span>
                )}
                
                <div className="d-flex align-items-center" style={{ width: '100%' }}>
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      background: location.pathname === item.path ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)` : 'transparent'
                    }}
                  >
                    <i 
                      className={`bi ${item.icon} fs-5`}
                      style={{ 
                        color: location.pathname === item.path ? item.color : '#4A2C2A',
                        transition: 'all 0.3s ease'
                      }}
                    ></i>
                  </div>
                  
                  <div className="ms-3">
                    <span 
                      className="fw-medium d-block"
                      style={{
                        opacity: isExpanded || hoveredItem === item.path ? 1 : 0,
                        transform: isExpanded || hoveredItem === item.path ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'all 0.3s ease',
                        color: location.pathname === item.path ? item.color : '#4A2C2A',
                        fontSize: '0.95rem'
                      }}
                    >
                      {item.label}
                    </span>
                    {isExpanded && (
                      <span className="small text-muted" style={{ fontSize: '0.7rem' }}>
                        {item.description}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 mx-3" style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,158,109,0.3), transparent)'
        }}></div>

        {/* Auth Items */}
        <ul className="nav flex-column px-2">
          {isAuthenticated ? (
            <>
              {authItems.map((item) => (
                <li key={item.path} className="nav-item mb-1">
                  <Link
                    to={item.path}
                    className="nav-link d-flex align-items-center rounded-3"
                    style={{
                      padding: '12px',
                      color: location.pathname === item.path ? item.color : '#4A2C2A',
                      background: location.pathname === item.path ? `rgba(${hexToRgb(item.color)}, 0.1)` : 'transparent',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div className="d-flex align-items-center" style={{ width: '100%' }}>
                      <div 
                        className="d-flex align-items-center justify-content-center rounded-3"
                        style={{
                          width: '40px',
                          height: '40px',
                          minWidth: '40px',
                          background: location.pathname === item.path ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)` : 'transparent'
                        }}
                      >
                        <i 
                          className={`bi ${item.icon} fs-5`}
                          style={{ 
                            color: location.pathname === item.path ? item.color : '#4A2C2A'
                          }}
                        ></i>
                      </div>
                      
                      <div className="ms-3">
                        <span 
                          className="fw-medium d-block"
                          style={{
                            opacity: isExpanded || hoveredItem === item.path ? 1 : 0,
                            transform: isExpanded || hoveredItem === item.path ? 'translateX(0)' : 'translateX(-10px)',
                            transition: 'all 0.3s ease',
                            color: location.pathname === item.path ? item.color : '#4A2C2A',
                            fontSize: '0.95rem'
                          }}
                        >
                          {item.label}
                        </span>
                        {isExpanded && (
                          <span className="small text-muted" style={{ fontSize: '0.7rem' }}>
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              
              {/* Logout Button */}
              <li className="nav-item mt-2">
                <button
                  onClick={handleLogout}
                  className="nav-link d-flex align-items-center rounded-3 w-100 border-0 bg-transparent"
                  style={{
                    padding: '12px',
                    color: '#FF4757',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={() => setHoveredItem('logout')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px'
                      }}
                    >
                      <i className="bi bi-box-arrow-right fs-5"></i>
                    </div>
                    
                    <span 
                      className="ms-3 fw-medium"
                      style={{
                        opacity: isExpanded || hoveredItem === 'logout' ? 1 : 0,
                        transform: isExpanded || hoveredItem === 'logout' ? 'translateX(0)' : 'translateX(-10px)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Sign Out
                    </span>
                  </div>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item mb-1">
                <Link
                  to="/login-selection"
                  className="nav-link d-flex align-items-center rounded-3"
                  style={{
                    padding: '12px',
                    color: '#FF9E6D',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={() => setHoveredItem('login')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px'
                      }}
                    >
                      <i className="bi bi-box-arrow-in-right fs-5"></i>
                    </div>
                    
                    <div className="ms-3">
                      <span 
                        className="fw-medium d-block"
                        style={{
                          opacity: isExpanded || hoveredItem === 'login' ? 1 : 0,
                          transform: isExpanded || hoveredItem === 'login' ? 'translateX(0)' : 'translateX(-10px)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Sign In
                      </span>
                      {isExpanded && (
                        <span className="small text-muted">Access your account</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
              
              <li className="nav-item">
                <Link
                  to="/register"
                  className="nav-link d-flex align-items-center rounded-3"
                  style={{
                    padding: '12px',
                    color: '#FF6B8B',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={() => setHoveredItem('register')}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="d-flex align-items-center" style={{ width: '100%' }}>
                    <div 
                      className="d-flex align-items-center justify-content-center rounded-3"
                      style={{
                        width: '40px',
                        height: '40px',
                        minWidth: '40px'
                      }}
                    >
                      <i className="bi bi-person-plus fs-5"></i>
                    </div>
                    
                    <div className="ms-3">
                      <span 
                        className="fw-medium d-block"
                        style={{
                          opacity: isExpanded || hoveredItem === 'register' ? 1 : 0,
                          transform: isExpanded || hoveredItem === 'register' ? 'translateX(0)' : 'translateX(-10px)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Register
                      </span>
                      {isExpanded && (
                        <span className="small text-muted">Create new account</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto py-4 px-3" style={{
        borderTop: '1px solid rgba(255, 158, 109, 0.2)'
      }}>
        {isExpanded ? (
          <div className="text-center">
            <p className="small text-muted mb-1">
              <i className="bi bi-clock me-1"></i>
              {currentTime.toLocaleTimeString()}
            </p>
            <div className="d-flex justify-content-center gap-2">
              <a href="tel:0743086099" className="btn btn-sm rounded-pill" style={{
                background: 'rgba(255, 107, 139, 0.1)',
                color: '#FF6B8B',
                fontSize: '0.8rem',
                textDecoration: 'none'
              }}>
                <i className="bi bi-telephone me-1"></i>
                Call Us
              </a>
              <a href="#" className="btn btn-sm rounded-pill" style={{
                background: 'rgba(255, 158, 109, 0.1)',
                color: '#FF9E6D',
                fontSize: '0.8rem',
                textDecoration: 'none'
              }}>
                <i className="bi bi-chat-dots me-1"></i>
                Chat
              </a>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center gap-2">
            <div className="position-relative">
              <i className="bi bi-headset fs-5" style={{ color: '#FF9E6D' }}></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                <span className="visually-hidden">Online</span>
              </span>
            </div>
            <small className="text-muted" style={{ fontSize: '0.6rem' }}>24/7</small>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to convert hex to rgb
const hexToRgb = (hex) => {
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const int = parseInt(c, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `${r}, ${g}, ${b}`;
};

export default SidebarNav;