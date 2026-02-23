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
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    setFeaturedCakes(cakeData.slice(0, 3));
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let time = 0;
    
    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPremiumCake(ctx, canvas.width, canvas.height, time);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const drawPremiumCake = (ctx, w, h, t) => {
    const centerX = w / 2;
    const centerY = h / 2 - 20;
    
    const gradient1 = ctx.createLinearGradient(centerX - 100, centerY + 50, centerX + 100, centerY + 80);
    gradient1.addColorStop(0, '#8B4513');
    gradient1.addColorStop(0.5, '#A0522D');
    gradient1.addColorStop(1, '#8B4513');
    
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    ctx.fillStyle = gradient1;
    roundedRect(ctx, centerX - 120, centerY + 30, 240, 70, 20);
    ctx.fill();
    
    const gradient2 = ctx.createLinearGradient(centerX - 80, centerY - 20, centerX + 80, centerY);
    gradient2.addColorStop(0, '#FF9E6D');
    gradient2.addColorStop(1, '#FF6B8B');
    
    ctx.fillStyle = gradient2;
    roundedRect(ctx, centerX - 90, centerY - 10, 180, 60, 15);
    ctx.fill();
    
    const gradient3 = ctx.createLinearGradient(centerX - 50, centerY - 70, centerX + 50, centerY - 50);
    gradient3.addColorStop(0, '#9D5CFF');
    gradient3.addColorStop(1, '#6AE1FF');
    
    ctx.fillStyle = gradient3;
    roundedRect(ctx, centerX - 60, centerY - 60, 120, 50, 12);
    ctx.fill();
    
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 8; i++) {
      const x = centerX - 50 + i * 15 + Math.sin(t + i) * 5;
      const y = centerY - 60 + Math.cos(t * 2 + i) * 3;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    for (let i = 0; i < 30; i++) {
      const x = centerX - 150 + (i * 10) + Math.sin(t * 3 + i) * 10;
      const y = centerY - 80 + Math.cos(t * 2 + i) * 15;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(t + i) * 0.3})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const roundedRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x - r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  const features = [
    { icon: 'bi-gem', title: 'Premium Quality', desc: 'Finest ingredients, handcrafted daily' },
    { icon: 'bi-palette', title: 'Custom Design', desc: 'Create your unique masterpiece' },
    { icon: 'bi-truck', title: 'White Glove', desc: 'Concierge delivery service' },
    { icon: 'bi-star', title: 'Award Winning', desc: 'Recognized for excellence' }
  ];

  return (
    <div className="overflow-hidden">
      <section className="position-relative min-vh-100 d-flex align-items-center" style={{
        background: 'linear-gradient(145deg, #FFF9F5 0%, #FFE8E0 100%)'
      }}>
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="position-absolute" style={{
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255,158,109,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}></div>
          <div className="position-absolute" style={{
            bottom: '10%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,107,139,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`
          }}></div>
        </div>

        <div className="container position-relative">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              {isAuthenticated && user && (
                <div className="mb-4 animate__animated animate__fadeInUp">
                  <span className="badge px-4 py-2 rounded-pill" style={{
                    background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                    color: 'white'
                  }}>
                    <i className="bi bi-star-fill me-2"></i>
                    Welcome back, {user?.name?.split(' ')[0] || 'Guest'}!
                  </span>
                </div>
              )}
              
              <h1 className="display-1 fw-bold mb-4" style={{
                fontFamily: "'Playfair Display', serif",
                lineHeight: '1.1',
                fontSize: 'calc(3.5rem + 1.5vw)'
              }}>
                <span style={{ color: '#4A2C2A' }}>Artisan</span>
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Cake Studio</span>
              </h1>
              
              <p className="fs-4 mb-5" style={{ color: '#6c757d', maxWidth: '600px' }}>
                Where confectionery meets artistry. Each creation is a masterpiece, 
                crafted with passion and the finest ingredients.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate('/create')}
                  className="btn btn-lg rounded-pill px-5 py-3"
                  style={{
                    background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                    border: 'none',
                    color: 'white',
                    fontWeight: '600',
                    boxShadow: '0 10px 30px rgba(255, 107, 139, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <i className="bi bi-magic me-2"></i>
                  Start Creating
                </button>
                
                <button 
                  onClick={() => navigate('/gallery')}
                  className="btn btn-lg rounded-pill px-5 py-3"
                  style={{
                    background: 'transparent',
                    border: '2px solid #FF9E6D',
                    color: '#FF9E6D',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FF9E6D';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#FF9E6D';
                  }}
                >
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  View Gallery
                </button>
              </div>
              
              <div className="d-flex gap-5 mt-5 pt-4">
                <div>
                  <div className="display-5 fw-bold" style={{ color: '#FF6B8B' }}>2.5K+</div>
                  <div className="text-secondary">Happy Customers</div>
                </div>
                <div>
                  <div className="display-5 fw-bold" style={{ color: '#FF6B8B' }}>1.5K+</div>
                  <div className="text-secondary">Cakes Delivered</div>
                </div>
                <div>
                  <div className="display-5 fw-bold" style={{ color: '#FF6B8B' }}>50+</div>
                  <div className="text-secondary">Flavors</div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative" style={{ height: '600px' }}>
                <canvas 
                  ref={canvasRef}
                  width={600}
                  height={600}
                  className="position-absolute top-50 start-50 translate-middle"
                  style={{
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.15))'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
          <div className="d-flex flex-column align-items-center">
            <span className="text-secondary small mb-2">Scroll to explore</span>
            <div className="rounded-pill bg-light" style={{ 
              width: '30px', 
              height: '50px', 
              border: '2px solid #FF9E6D' 
            }}>
              <div className="bg-apricot rounded-pill mx-auto" style={{
                width: '6px',
                height: '12px',
                marginTop: '8px',
                animation: 'bounce 2s infinite'
              }}></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6" style={{ background: 'white' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="badge text-dark px-4 py-2 rounded-pill mb-3" style={{
              background: '#f8f9fa',
              color: '#4A2C2A'
            }}>
              WHY CHOOSE US
            </span>
            <h2 className="display-4 fw-bold mb-3" style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: 'calc(2.5rem + 1vw)'
            }}>
              The Art of <span style={{ color: '#FF6B8B' }}>Exceptional</span> Cakes
            </h2>
            <p className="fs-5 text-secondary mx-auto" style={{ maxWidth: '700px' }}>
              We don't just bake cakes — we create edible art that makes every celebration unforgettable
            </p>
          </div>
          
          <div className="row g-4 mt-4">
            {features.map((feature, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card h-100 border-0 rounded-4 p-4" style={{
                  background: 'white',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 30px 60px rgba(255, 107, 139, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.02)';
                }}>
                  <div className="d-inline-flex p-3 rounded-3 mb-3" style={{
                    background: 'linear-gradient(135deg, rgba(255,158,109,0.1), rgba(255,107,139,0.1))',
                    width: 'fit-content'
                  }}>
                    <i className={`bi ${feature.icon} fs-2`} style={{ color: '#FF6B8B' }}></i>
                  </div>
                  <h4 className="fw-bold mb-2">{feature.title}</h4>
                  <p className="text-secondary mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-6" style={{ background: '#FFF9F5' }}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="badge text-dark px-4 py-2 rounded-pill mb-3" style={{
              background: '#f8f9fa',
              color: '#4A2C2A'
            }}>
              CURATED SELECTION
            </span>
            <h2 className="display-4 fw-bold mb-3" style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: 'calc(2.5rem + 1vw)'
            }}>
              This Month's <span style={{ color: '#FF9E6D' }}>Masterpieces</span>
            </h2>
          </div>
          
          <div className="row g-4">
            {featuredCakes.map((cake, index) => (
              <div className="col-md-4" key={cake.id}>
                <div className="card border-0 rounded-4 overflow-hidden" style={{
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="position-relative overflow-hidden" style={{ height: '300px' }}>
                    <img 
                      src={cake.image} 
                      className="w-100 h-100"
                      alt={cake.name}
                      style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-white text-dark px-3 py-2 rounded-pill shadow-sm">
                        ⭐ {cake.rating}
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-2">{cake.name}</h4>
                    <p className="text-secondary mb-3">{cake.description.substring(0, 60)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-4 fw-bold" style={{ color: '#FF6B8B' }}>{formatLKR(cake.priceLKR)}</span>
                      <button 
                        className="btn rounded-pill px-4 py-2"
                        style={{
                          background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                          border: 'none',
                          color: 'white'
                        }}
                        onClick={() => navigate('/create')}
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

      <section className="position-relative py-6" style={{
        background: 'linear-gradient(135deg, #4A2C2A 0%, #2C1810 100%)'
      }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold text-white mb-4" style={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: 'calc(2.5rem + 1vw)'
              }}>
                Ready to Create Something
                <span className="d-block" style={{ color: '#FFD700' }}>Extraordinary?</span>
              </h2>
              <p className="fs-5 text-white-50 mb-5">
                Book a consultation with our master pastry chefs and bring your dream cake to life.
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="btn btn-lg rounded-pill px-5 py-3"
                style={{
                  background: '#FFD700',
                  border: 'none',
                  color: '#2C1810',
                  fontWeight: '600',
                  fontSize: '1.2rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 215, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Start Your Creation
              </button>
            </div>
          </div>
        </div>
        
        <div className="position-absolute bottom-0 start-0 w-100 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '50px', width: '100%' }}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity="0.1" fill="#ffffff"></path>
          </svg>
        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }
          .py-6 {
            padding-top: 5rem;
            padding-bottom: 5rem;
          }
          @media (min-width: 992px) {
            .py-6 {
              padding-top: 6rem;
              padding-bottom: 6rem;
            }
          }
        `
      }} />
    </div>
  );
};

export default HomePage;