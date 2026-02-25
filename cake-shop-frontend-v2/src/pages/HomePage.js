// src/pages/HomePage.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cakeData } from '../utils/cakeData';
import { formatLKR } from '../config/currency';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add this state and useEffect to fetch cakes
  const [shopCakes, setShopCakes] = useState([]);
  const [loadingCakes, setLoadingCakes] = useState(true);

  const heroRef = useRef(null);

  // Fetch cakes from all shops
useEffect(() => {
  const fetchCakes = async () => {
    try {
      setLoadingCakes(true);
      const res = await fetch('http://localhost:5001/api/public/cakes?limit=8');
      const data = await res.json();
      if (data.success) {
        setShopCakes(data.cakes);
      }
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoadingCakes(false);
    }
  };

  fetchCakes();
}, []);

  useEffect(() => {
    setFeaturedCakes(cakeData.slice(0, 3));
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const { clientX, clientY } = e;
        const { width, height, left, top } = heroRef.current.getBoundingClientRect();
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: 'bi-gem', title: 'Premium Quality', desc: 'Finest ingredients, handcrafted daily', color: '#FF9E6D' },
    { icon: 'bi-palette', title: 'Custom Design', desc: 'Create your unique masterpiece', color: '#FF6B8B' },
    { icon: 'bi-truck', title: 'White Glove', desc: 'Concierge delivery service', color: '#9D5CFF' },
    { icon: 'bi-star', title: 'Award Winning', desc: 'Recognized for excellence', color: '#6A11CB' }
  ];

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    size: Math.random() * 6 + 2,
    color: i % 3 === 0 ? '#FF9E6D' : i % 3 === 1 ? '#FF6B8B' : '#9D5CFF'
  }));

  return (
    <div className="overflow-hidden">
      {/* --- HERO SECTION with Antigravity Effect --- */}
      <section ref={heroRef} className="hero-section position-relative" style={{ minHeight: '100vh' }}>
        {/* Animated Background Elements */}
        <div className="hero-background">
          <div className="floating-element floating-element-1" style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
          }}></div>
          <div className="floating-element floating-element-2" style={{
            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
          }}></div>
          <div className="floating-element floating-element-3" style={{
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 40}px)`
          }}></div>
          
          {/* Floating Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: particle.left,
                top: particle.top,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                animationDelay: particle.delay,
                animationDuration: `${Math.random() * 10 + 5}s`
              }}
            ></div>
          ))}
        </div>

        <div className="container position-relative z-1" style={{ paddingTop: '80px' }}>
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="animate-fade-up">
                {isAuthenticated && user && (
                  <div className="mb-4 d-inline-block">
                    <div className="glass-panel px-4 py-2 rounded-pill d-flex align-items-center magnetic-hover">
                      <i className="bi bi-crown text-gold me-2"></i>
                      <span className="small fw-bold text-chocolate">Welcome back, {user?.name?.split(' ')[0]}</span>
                    </div>
                  </div>
                )}

                <h1 className="display-1 mb-4" style={{ fontSize: 'calc(3rem + 2vw)', lineHeight: 1.1 }}>
                  <span className="font-script d-block mb-2" style={{
                    fontSize: '0.4em',
                    background: 'var(--gradient-sunset)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Artisan Bakery
                  </span>
                  <span className="fw-bold" style={{ color: '#2C1810' }}>Where Cakes</span> <br />
                  <span className="fw-bold text-gradient">Become Art</span>
                </h1>

                <p className="lead mb-5" style={{ 
                  maxWidth: '550px',
                  fontSize: '1.2rem',
                  color: '#4A2C2A',
                  opacity: 0.8
                }}>
                  Experience gravity-defying designs and ethereal flavors. 
                  Each creation is a masterpiece of culinary art.
                </p>

                <div className="d-flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/create')}
                    className="btn-primary-gradient px-5 py-3 magnetic-hover"
                  >
                    <i className="bi bi-magic me-2"></i>
                    Start Creating
                  </button>

                  <button
                    onClick={() => navigate('/gallery')}
                    className="btn-glass px-5 py-3"
                  >
                    View Gallery
                  </button>
                </div>

                {/* Stats with Animation */}
                <div className="d-flex gap-5 mt-5 pt-4">
                  {[
                    { value: '2.5K+', label: 'Happy Clients', color: '#FF9E6D' },
                    { value: '50+', label: 'Signature Flavors', color: '#FF6B8B' },
                    { value: '100%', label: 'Fresh Daily', color: '#9D5CFF' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center hover-antigravity" style={{ cursor: 'pointer' }}>
                      <div className="h2 fw-bold mb-0" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="small text-uppercase" style={{ letterSpacing: '1px', color: '#4A2C2A' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Visual Element with Antigravity Effect */}
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative mx-auto animate-antigravity" style={{ 
                width: '500px', 
                height: '600px',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}>
                {/* Floating Cake Layers with Parallax */}
                {[
                  { bottom: 80, width: 320, height: 100, color: '#2C1810', delay: 0 },
                  { bottom: 170, width: 280, height: 90, color: '#D4AF37', delay: 0.5 },
                  { bottom: 250, width: 240, height: 80, color: '#FFFFFF', delay: 1 },
                  { bottom: 320, width: 200, height: 70, color: '#FF6B8B', delay: 1.5 }
                ].map((layer, index) => (
                  <div
                    key={index}
                    className="position-absolute start-50 translate-middle-x tilt-effect"
                    style={{
                      bottom: `${layer.bottom}px`,
                      width: `${layer.width}px`,
                      height: `${layer.height}px`,
                      background: layer.color,
                      borderRadius: '20px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                      transform: `translateX(-50%) translateZ(${index * 20}px) rotate(${mousePosition.x * 2}deg)`,
                      transition: 'transform 0.3s ease',
                      animation: `antigravity-float ${5 + index}s ease-in-out infinite`,
                      animationDelay: `${layer.delay}s`
                    }}
                  >
                    {/* Decorative Elements */}
                    <div className="position-absolute w-100 h-100" style={{
                      background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                    }}></div>
                    
                    {/* Gold Dots */}
                    {index === 1 && Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="position-absolute rounded-circle"
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFD700',
                          left: `${10 + i * 12}%`,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          boxShadow: '0 0 10px gold'
                        }}
                      ></div>
                    ))}
                  </div>
                ))}

                {/* Floating Toppings */}
                <div className="position-absolute top-0 start-0 w-100 h-100">
                  {['🍓', '🍫', '✨', '🌸'].map((emoji, index) => (
                    <div
                      key={index}
                      className="position-absolute animate-antigravity"
                      style={{
                        fontSize: '2rem',
                        left: `${20 + index * 20}%`,
                        top: `${30 + index * 10}%`,
                        animationDelay: `${index * 0.5}s`,
                        filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))',
                        transform: `rotate(${mousePosition.x * 10}deg)`
                      }}
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5 animate-bounce">
          <div className="text-center">
            <span className="small text-uppercase" style={{ letterSpacing: '2px', color: '#4A2C2A' }}>Scroll</span>
            <div className="mt-2">
              <i className="bi bi-arrow-down fs-4" style={{ color: '#FF6B8B' }}></i>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION with Antigravity Cards --- */}
      <section className="py-6 position-relative" style={{ background: 'white' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="text-gradient text-uppercase fw-bold small" style={{ letterSpacing: '3px' }}>
              Why Choose Us
            </span>
            <h2 className="display-4 mt-2">
              The Art of <span className="font-script text-gradient">Exceptional</span> Cakes
            </h2>
          </div>

          <div className="row g-4">
            {features.map((feature, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="glass-panel h-100 p-4 text-center hover-antigravity position-relative overflow-hidden">
                  {/* Background Glow */}
                  <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: `radial-gradient(circle at 50% 50%, ${feature.color}20 0%, transparent 70%)`,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}></div>
                  
                  <div className="mb-4 d-inline-flex p-3 rounded-circle magnetic-hover" style={{
                    background: `${feature.color}15`
                  }}>
                    <i className={`bi ${feature.icon} fs-2`} style={{ color: feature.color }}></i>
                  </div>
                  
                  <h4 className="h5 fw-bold mb-3" style={{ color: '#2C1810' }}>{feature.title}</h4>
                  <p className="text-secondary small mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* // Add this section in your home page JSX after features section */}
{/* Shop Cakes Section */}
<section className="py-5">
  <div className="container">
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold mb-3">Cakes from Our Partner Shops</h2>
      <p className="lead text-muted">
        Delicious creations from trusted local bakeries
      </p>
    </div>

    {loadingCakes ? (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    ) : shopCakes.length > 0 ? (
      <div className="row g-4">
        {shopCakes.map(cake => (
          <div className="col-md-6 col-lg-3" key={cake._id}>
            <div className="card h-100 border-0 shadow-sm hover-card">
              <img 
                src={cake.image} 
                className="card-img-top" 
                alt={cake.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="card-title mb-0">{cake.name}</h6>
                  {cake.isPopular && (
                    <span className="badge bg-warning">Popular</span>
                  )}
                </div>
                <p className="text-muted small mb-2">
                  by <strong>{cake.shopName}</strong>
                </p>
                <p className="card-text text-muted small">
                  {cake.description.substring(0, 60)}...
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <strong className="text-primary">{formatLKR(cake.priceLKR)}</strong>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => navigate(`/shops/${cake.shopSlug}`)}
                  >
                    View Shop
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-5">
        <p className="text-muted">No cakes available from shops yet.</p>
      </div>
    )}
  </div>
</section>

      {/* --- FEATURED CAKES with Antigravity Effect --- */}
      <section className="py-6 position-relative" style={{ background: 'var(--cream-vanilla)' }}>
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <span className="text-gradient text-uppercase fw-bold small" style={{ letterSpacing: '3px' }}>
                Curated Selection
              </span>
              <h2 className="display-4 mt-2">
                This Month's <span className="font-script text-gradient">Favorites</span>
              </h2>
            </div>
            <button 
              onClick={() => navigate('/gallery')} 
              className="btn btn-link text-decoration-none fw-bold magnetic-hover"
              style={{ color: '#FF6B8B' }}
            >
              View All <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>

          <div className="row g-4">
            {featuredCakes.map((cake, index) => (
              <div className="col-md-4" key={cake.id}>
                <div className="glass-panel overflow-hidden border-0 h-100 p-0 hover-antigravity" style={{
                  animationDelay: `${index * 0.2}s`
                }}>
                  <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                    <img
                      src={cake.image}
                      alt={cake.name}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease'
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark shadow-sm px-3 py-2 rounded-pill">
                        <i className="bi bi-star-fill text-warning me-1"></i> {cake.rating}
                      </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{
                      background: 'linear-gradient(135deg, rgba(255,107,139,0.9), rgba(157,92,255,0.9))',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}>
                      <button className="btn btn-light rounded-pill px-4 py-2 magnetic-hover">
                        Quick View
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="h5 fw-bold mb-2" style={{ color: '#2C1810' }}>{cake.name}</h4>
                    <p className="text-secondary small mb-3">{cake.description.substring(0, 60)}...</p>
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="h5 fw-bold mb-0 text-gradient">{formatLKR(cake.priceLKR)}</span>
                        <span className="text-muted small ms-1">LKR</span>
                      </div>
                      
                      <button
                        onClick={() => navigate('/create')}
                        className="btn-primary-gradient btn-sm py-2 px-4"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION with Antigravity Effect --- */}
      <section className="py-6 position-relative text-white overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #2C1810 0%, #4A2C2A 100%)'
      }}>
        {/* Floating Elements */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="position-absolute rounded-circle animate-antigravity"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: `radial-gradient(circle, ${i % 2 ? '#FF9E6D' : '#FF6B8B'}20 0%, transparent 70%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                filter: 'blur(20px)'
              }}
            ></div>
          ))}
        </div>

        <div className="container py-5 position-relative z-1 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-3 fw-bold mb-4 font-script" style={{ color: '#D4AF37' }}>
                Ready to Create Magic?
              </h2>
              <p className="lead mb-5 opacity-75" style={{ fontSize: '1.3rem' }}>
                Book a consultation with our master pastry chefs and bring your dream cake to life.
                From wedding towers to birthday masterpieces.
              </p>
              <button
                onClick={() => navigate('/create')}
                className="btn-primary-gradient btn-lg px-5 py-3 magnetic-hover"
                style={{ fontSize: '1.2rem' }}
              >
                <i className="bi bi-stars me-2"></i>
                Start Your Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{
        __html: `
          .py-6 { padding-top: 6rem; padding-bottom: 6rem; }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-20px); }
            60% { transform: translateY(-10px); }
          }
          .animate-bounce {
            animation: bounce 2s infinite;
          }
          .hover-antigravity:hover .position-absolute {
            opacity: 1 !important;
          }
        `
      }} />
    </div>
  );
};

export default HomePage;