// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@customer.com',
      password: 'customer123',
      rememberMe: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password, formData.rememberMe);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream py-5">
      <div className="glass-panel overflow-hidden p-0 animate-fade-up" style={{ 
        width: '100%', 
        maxWidth: '1000px', 
        display: 'flex', 
        flexDirection: 'row', 
        minHeight: '600px',
        background: 'white'
      }}>

        {/* Left Side - Visual with Gradient */}
        <div className="d-none d-lg-flex flex-column justify-content-center align-items-center p-5 text-white position-relative" style={{ 
          width: '45%', 
          background: 'linear-gradient(135deg, #2C1810 0%, #4A2C2A 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated Background Elements */}
          <div className="position-absolute w-100 h-100" style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.2) 0%, transparent 50%)',
            animation: 'pulseGlow 4s ease-in-out infinite'
          }}></div>
          
          <div className="position-absolute" style={{
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,107,139,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'antigravity-float 8s ease-in-out infinite'
          }}></div>

          <div className="position-relative z-2 text-center">
            {/* Animated Cake Icon */}
            <div className="mb-4 animate-antigravity">
              <div className="position-relative d-inline-block">
                <div className="rounded-circle p-4" style={{
                  background: 'linear-gradient(135deg, #D4AF37, #F1D06E)',
                  boxShadow: '0 10px 30px rgba(212,175,55,0.4)',
                  width: '100px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-cake2 display-4 text-white"></i>
                </div>
                <div className="position-absolute top-0 start-100 translate-middle">
                  <span className="badge bg-gradient-primary rounded-pill px-3 py-2 animate-pulse-glow">
                    Sweet!
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className="font-script display-5 text-gold mb-3" style={{
              textShadow: '0 2px 10px rgba(212,175,55,0.3)'
            }}>Sweet Moments</h2>
            
            <p className="lead opacity-75 mb-4" style={{ fontSize: '1.1rem' }}>
              "Life is short, eat dessert first."
            </p>
            
            {/* Decorative Line */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
              <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}></div>
              <i className="bi bi-star-fill text-gold" style={{ fontSize: '0.8rem' }}></i>
              <div style={{ width: '50px', height: '2px', background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)' }}></div>
            </div>
            
            <div className="mt-5">
              <div className="small text-uppercase text-gold mb-3" style={{ letterSpacing: '2px' }}>
                New to Cube Cake?
              </div>
              <button 
                onClick={() => navigate('/register')} 
                className="btn-glass px-5 py-3"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <i className="bi bi-person-plus me-2"></i>
                Join Us Today
              </button>
            </div>

            {/* Testimonial */}
            <div className="mt-5 pt-4">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                {[1,2,3,4,5].map(star => (
                  <i key={star} className="bi bi-star-fill text-gold" style={{ fontSize: '0.8rem' }}></i>
                ))}
              </div>
              <p className="small opacity-75 fst-italic mb-0">
                "The best cakes I've ever tasted!"
              </p>
              <p className="small opacity-50 mt-1">- Happy Customer</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-5 d-flex flex-column justify-content-center" style={{ flex: 1, background: 'white' }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-2" style={{ 
              background: 'linear-gradient(135deg, #2C1810, #FF6B8B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Welcome Back
            </h2>
            <p className="text-secondary">Sign in to continue your sweet journey</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger border-0 rounded-3 p-3 mb-4 d-flex align-items-center" style={{
                background: 'rgba(220, 53, 69, 0.1)',
                color: '#dc3545'
              }}>
                <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
                <span className="small">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: '#2C1810', letterSpacing: '0.5px' }}>
                <i className="bi bi-envelope me-2" style={{ color: '#D4AF37' }}></i>
                Email Address
              </label>
              <div className="position-relative">
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    height: '55px',
                    borderRadius: '15px',
                    border: '2px solid #f0f0f0',
                    padding: '0 20px 0 50px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: '#f8f9fa'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8f9fa';
                  }}
                />
                <i className="bi bi-envelope-fill position-absolute top-50 translate-middle-y" style={{
                  left: '20px',
                  color: '#D4AF37',
                  fontSize: '1.2rem'
                }}></i>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: '#2C1810', letterSpacing: '0.5px' }}>
                <i className="bi bi-lock me-2" style={{ color: '#D4AF37' }}></i>
                Password
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{
                    height: '55px',
                    borderRadius: '15px',
                    border: '2px solid #f0f0f0',
                    padding: '0 50px 0 50px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    background: '#f8f9fa'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#D4AF37';
                    e.target.style.boxShadow = '0 0 0 4px rgba(212,175,55,0.1)';
                    e.target.style.background = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#f0f0f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8f9fa';
                  }}
                />
                <i className="bi bi-lock-fill position-absolute top-50 translate-middle-y" style={{
                  left: '20px',
                  color: '#D4AF37',
                  fontSize: '1.2rem'
                }}></i>
                <button
                  type="button"
                  className="position-absolute top-50 translate-middle-y btn btn-link p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    right: '15px',
                    color: '#D4AF37',
                    textDecoration: 'none'
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  style={{
                    borderColor: '#D4AF37',
                    cursor: 'pointer'
                  }}
                />
                <label className="form-check-label small text-secondary" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgot-password" 
                className="text-decoration-none small fw-bold"
                style={{ color: '#FF6B8B' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              className="btn w-100 py-3 mb-4 position-relative overflow-hidden"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                border: 'none',
                borderRadius: '50px',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.1rem',
                boxShadow: '0 8px 20px rgba(255,107,139,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 30px rgba(255,107,139,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(255,107,139,0.3)';
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" style={{ width: '1.2rem', height: '1.2rem' }}></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Sign In
                </>
              )}
            </button>

            {/* Demo Account Button */}
            <button 
              type="button" 
              onClick={fillDemoCredentials} 
              className="btn w-100 py-2 mb-4"
              style={{
                background: 'transparent',
                border: '2px solid #FF9E6D',
                borderRadius: '50px',
                color: '#FF9E6D',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#FF9E6D';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#FF9E6D';
              }}
            >
              <i className="bi bi-person-badge me-2"></i>
              Use Demo Account
            </button>

            {/* Social Login */}
            <div className="text-center mb-3">
              <p className="small text-secondary mb-3">Or continue with</p>
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-outline-secondary rounded-circle p-3" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-google"></i>
                </button>
                <button className="btn btn-outline-secondary rounded-circle p-3" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-facebook"></i>
                </button>
                <button className="btn btn-outline-secondary rounded-circle p-3" style={{ width: '50px', height: '50px' }}>
                  <i className="bi bi-apple"></i>
                </button>
              </div>
            </div>

            {/* Mobile Register Link */}
            <div className="d-lg-none text-center mt-4">
              <p className="small text-secondary mb-2">Need an account?</p>
              <Link 
                to="/register" 
                className="fw-bold text-decoration-none"
                style={{ color: '#FF6B8B' }}
              >
                Create Account <i className="bi bi-arrow-right ms-1"></i>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Add Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes antigravity-float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          .animate-antigravity {
            animation: antigravity-float 6s ease-in-out infinite;
          }
          .animate-pulse-glow {
            animation: pulseGlow 2s ease-in-out infinite;
          }
          .btn {
            transition: all 0.3s ease !important;
          }
          .btn:hover {
            transform: translateY(-2px);
          }
          .form-control:focus {
            outline: none;
          }
        `
      }} />
    </div>
  );
};

export default LoginPage;