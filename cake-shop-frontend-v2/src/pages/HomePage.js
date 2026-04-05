import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config';


const formatLKR = (amount) => `Rs. ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [shopCakes, setShopCakes] = useState([]);
  const [loadingCakes, setLoadingCakes] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [stats, setStats] = useState({ happyClients: 0, flavors: 0, partnerShops: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        const res = await fetch(`${API_CONFIG.PUBLIC.CAKES}?limit=8`);
        const data = await res.json();
        if (data.success) setShopCakes(data.cakes);
      } catch (e) { console.error(e); }
      finally { setLoadingCakes(false); }
    };
    fetchCakes();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(API_CONFIG.PUBLIC.STATS);
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      if (heroRef.current) {
        const { width, height, left, top } = heroRef.current.getBoundingClientRect();
        setMousePos({ x: (e.clientX - left) / width - 0.5, y: (e.clientY - top) / height - 0.5 });
      }
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const features = [
    { icon: 'bi-gem', title: 'Premium Ingredients', desc: 'Finest quality, sourced fresh every day', accent: '#C9933A' },
    { icon: 'bi-palette', title: 'Custom Design', desc: 'Craft your own unique masterpiece online', accent: '#C4614A' },
    { icon: 'bi-truck', title: 'Island-Wide Delivery', desc: 'Reliable delivery across Sri Lanka', accent: '#2A7A5A' },
    { icon: 'bi-shield-check', title: 'Satisfaction Guaranteed', desc: '100% happiness or we make it right', accent: '#2E5FA3' },
  ];

  return (
    <div style={{ overflowX: 'hidden', fontFamily: "'DM Sans', sans-serif", background: '#FAFAF8' }}>

      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #FAFAF8 0%, #F0EDE6 50%, #E8E2D8 100%)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Ambient orbs */}
        <div style={{
          position: 'absolute', top: '8%', right: '12%',
          width: 480, height: 480,
          background: 'radial-gradient(circle, rgba(201,147,58,0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          transform: `translate(${mousePos.x * 18}px, ${mousePos.y * 18}px)`,
          transition: 'transform 0.4s ease',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '12%', left: '6%',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(196,97,74,0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px)`,
          transition: 'transform 0.4s ease',
          pointerEvents: 'none',
        }} />
        {/* Grain texture */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center" style={{ minHeight: '90vh' }}>
            <div className="col-lg-6">
              {isAuthenticated && user && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(201,147,58,0.1)',
                  border: '1px solid rgba(201,147,58,0.25)',
                  borderRadius: 50, padding: '0.35rem 1rem',
                  marginBottom: '1.5rem',
                }}>
                  <i className="bi bi-star-fill" style={{ color: '#C9933A', fontSize: '0.7rem' }}></i>
                  <span style={{ color: '#A67A28', fontSize: '0.82rem', fontWeight: 600 }}>
                    Welcome back, {user?.name?.split(' ')[0]}
                  </span>
                </div>
              )}

              <div style={{
                fontSize: '0.68rem', color: '#8A8A8A',
                letterSpacing: 5, textTransform: 'uppercase',
                marginBottom: '1rem', fontWeight: 500,
              }}>
                Artisan Bakery · Sri Lanka
              </div>

              <h1 style={{
                color: '#0D0D0D',
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: '1.5rem',
                fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.03em',
              }}>
                Where Every Cake<br />
                <span style={{
                  fontStyle: 'italic',
                  background: 'linear-gradient(135deg, #C9933A, #E8B860)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>Tells a Story</span>
              </h1>

              <p style={{
                color: '#5A5A5A', fontSize: '1.1rem',
                lineHeight: 1.75, maxWidth: 500, marginBottom: '2.5rem',
              }}>
                Handcrafted cakes made with love, from our partner bakeries across Sri Lanka.
                Design your dream cake or choose from our curated collection.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <button onClick={() => navigate('/create')} className="btn-pulse-ring" style={{
                  padding: '0.9rem 2.2rem',
                  background: '#0D0D0D',
                  border: 'none', borderRadius: 50,
                  color: '#FAFAF8', fontWeight: 700,
                  fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(13,13,13,0.2)',
                  transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
                  fontFamily: 'inherit',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 32px rgba(13,13,13,0.28)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,13,13,0.2)'; }}
                >
                  <i className="bi bi-palette me-2"></i>Design a Cake
                </button>
                <button onClick={() => navigate('/gallery')} style={{
                  padding: '0.9rem 2.2rem',
                  background: 'transparent',
                  border: '1.5px solid #0D0D0D',
                  borderRadius: 50,
                  color: '#0D0D0D', fontWeight: 600,
                  fontSize: '0.95rem', cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
                  fontFamily: 'inherit',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0D0D0D'; e.currentTarget.style.color = '#FAFAF8'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0D0D0D'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <i className="bi bi-grid me-2"></i>Browse Gallery
                </button>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '2.5rem' }}>
                {[
                  {
                    v: loadingStats ? '...' :
                      (stats.happyClients >= 10 ? `${Math.floor(stats.happyClients / 10) * 10}+` : stats.happyClients),
                    l: 'Happy Clients'
                  },
                  { v: loadingStats ? '...' : stats.flavors, l: 'Flavors' },
                  { v: loadingStats ? '...' : stats.partnerShops, l: 'Partner Shops' }
                ].map((s, i) => (
                  <div key={i} style={{ cursor: 'default' }}>
                    <div className="hero-stat-num" style={{
                      color: '#0D0D0D', fontWeight: 800,
                      fontSize: '1.7rem', lineHeight: 1,
                      fontFamily: "'Playfair Display', serif",
                    }}>{s.v}</div>
                    <div style={{ color: '#8A8A8A', fontSize: '0.75rem', marginTop: '0.2rem', fontWeight: 500 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cake visual visual redesigned */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
              <div style={{
                position: 'relative',
                width: 500,
                height: 500,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: `perspective(1000px) rotateY(${mousePos.x * 10}deg) rotateX(${mousePos.y * -10}deg)`,
                transition: 'transform 0.5s ease-out',
              }}>
                {/* Glow / Aura */}
                <div style={{
                  position: 'absolute',
                  width: '80%',
                  height: '80%',
                  background: 'radial-gradient(circle, rgba(201,147,58,0.2) 0%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  animation: 'pulseGlow 4s ease-in-out infinite',
                }} />

                {/* Premium Cake Image */}
                <div style={{
                  position: 'relative',
                  width: '90%',
                  height: '90%',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                  animation: 'floatPremium 6s ease-in-out infinite',
                }}>
                  <img
                    src="/hero-cake.png"
                    alt="Artisan Royal Cake"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.1))',
                    pointerEvents: 'none',
                  }} />
                </div>

                {/* Floating elements */}
                {['✨', '🌸', '✨'].map((e, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    fontSize: '2rem',
                    left: i === 0 ? '-5%' : i === 1 ? '95%' : '80%',
                    top: i === 0 ? '20%' : i === 1 ? '60%' : '10%',
                    animation: `floatEmoji ${4 + i * 0.5}s ease-in-out infinite`,
                    animationDelay: `${i * 0.4}s`,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                  }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', animation: 'scrollBounce 2s infinite' }}>
          <div style={{ color: '#8A8A8A', fontSize: '0.65rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Scroll</div>
          <i className="bi bi-chevron-down" style={{ color: '#8A8A8A', fontSize: '1rem' }} />
        </div>
      </section>

      {/* ===== PROMOTIONS ===== */}
      <section style={{ padding: '6rem 0', background: '#FAFAF8' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#C9933A', letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>Limited Time Offers</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem,4vw,2.8rem)',
              fontWeight: 700, color: '#0D0D0D',
              marginBottom: '0.5rem', letterSpacing: '-0.02em',
            }}>
              Exclusive <span style={{ fontStyle: 'italic', color: '#C9933A' }}>Treasures</span> For You
            </h2>
          </div>

          <div className="promo-grid">
            <div className="promo-card">
              <div className="promo-tag">New Member</div>
              <h3 className="promo-title">Welcome Bliss</h3>
              <p className="promo-desc">Get 15% OFF on your first custom cake masterpiece. Use code: WELCOME15</p>
              <button className="promo-btn" onClick={() => navigate('/create')}>Design Now</button>
            </div>

            <div className="promo-card" style={{ background: 'var(--ink)', borderColor: 'var(--ink-soft)' }}>
              <div className="promo-tag" style={{ background: 'rgba(201,147,58,0.2)', color: 'var(--accent-light)' }}>Weekend Special</div>
              <h3 className="promo-title" style={{ color: 'var(--surface)' }}>Midnight Cocoa</h3>
              <p className="promo-desc" style={{ color: 'rgba(255,255,255,0.6)' }}>Free delivery on all dark chocolate collection this weekend only.</p>
              <button className="promo-btn" style={{ background: 'var(--accent)', color: 'var(--ink)' }} onClick={() => navigate('/gallery')}>Explore Collection</button>
            </div>

            <div className="promo-card">
              <div className="promo-tag">Loyalty Reward</div>
              <h3 className="promo-title">Sugar Points</h3>
              <p className="promo-desc">Earn double sugar points for every order above Rs. 5,000 this month.</p>
              <button className="promo-btn" onClick={() => navigate('/gallery')}>Shop Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNER SHOPS CAKES ===== */}
      <section style={{ background: '#FFFFFF', padding: '7rem 0', borderTop: '1px solid #F0EDE6' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#C9933A', letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>From Our Network</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem,4vw,2.8rem)',
              fontWeight: 700, color: '#0D0D0D',
              marginBottom: '0.75rem', letterSpacing: '-0.02em',
            }}>
              Handpicked Cakes from<br />
              <span style={{ fontStyle: 'italic', color: '#C9933A' }}>Trusted Bakeries</span>
            </h2>
            <p style={{ color: '#8A8A8A', fontSize: '0.98rem', maxWidth: 480, margin: '0 auto' }}>
              Discover beautiful cakes crafted by our verified partner shops across Sri Lanka
            </p>
          </div>

          {
            loadingCakes ? (
              <div style={{ textAlign: 'center', padding: '3rem' }} >
                <div className="spinner-border" style={{ color: '#C9933A', width: '2.5rem', height: '2.5rem' }}></div>
              </div >
            ) : shopCakes.length > 0 ? (
              <div className="row g-4">
                {shopCakes.map((cake, idx) => (
                  <div className="col-sm-6 col-lg-3" key={cake._id}>
                    <div
                      className="home-cake-card"
                      style={{
                        background: '#FAFAF8',
                        borderRadius: 20,
                        overflow: 'hidden',
                        boxShadow: '0 2px 16px rgba(13,13,13,0.06)',
                        border: '1px solid #E2E0DB',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                        <img
                          src={cake.image}
                          alt={cake.name}
                          className="home-cake-img"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Overlay on hover */}
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(13,13,13,0.45)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          opacity: hoveredCard === idx ? 1 : 0,
                          transition: 'opacity 0.3s ease',
                        }}>
                          <button onClick={() => navigate(`/shops/${cake.shopSlug}`)} style={{
                            padding: '0.45rem 1rem',
                            background: 'rgba(255,255,255,0.95)',
                            border: 'none', borderRadius: 50,
                            color: '#0D0D0D', fontWeight: 600, fontSize: '0.78rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}>View Shop</button>
                          <button onClick={() => navigate('/order', { state: { galleryCake: { ...cake, shopId: cake.shop } } })} style={{
                            padding: '0.45rem 1rem',
                            background: '#C9933A',
                            border: 'none', borderRadius: 50,
                            color: '#FAFAF8', fontWeight: 700, fontSize: '0.78rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                          }}>Order Now</button>
                        </div>
                        {cake.isPopular && (
                          <div style={{
                            position: 'absolute', top: 12, right: 12,
                            background: '#0D0D0D',
                            borderRadius: 50, padding: '0.2rem 0.75rem',
                            fontSize: '0.68rem', fontWeight: 700, color: '#FAFAF8',
                          }}>🔥 Popular</div>
                        )}
                      </div>
                      <div style={{ padding: '1.25rem' }}>
                        <h6 style={{ fontWeight: 700, color: '#0D0D0D', marginBottom: '0.2rem', fontSize: '0.95rem', fontFamily: "'Playfair Display', serif" }}>{cake.name}</h6>
                        <p style={{ color: '#C9933A', fontSize: '0.76rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          <i className="bi bi-shop me-1"></i>{cake.shopName}
                        </p>
                        <p style={{ color: '#8A8A8A', fontSize: '0.82rem', lineHeight: 1.45, marginBottom: '1rem' }}>{cake.description?.substring(0, 60)}...</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#0D0D0D', fontWeight: 800, fontSize: '1rem', fontFamily: "'Playfair Display', serif" }}>{formatLKR(cake.priceLKR)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', background: '#F4F3F0', borderRadius: 20, border: '1px solid #E2E0DB' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.25 }}>🎂</div>
                <p style={{ color: '#8A8A8A' }}>No cakes from partner shops yet.</p>
                <button onClick={() => navigate('/shops')} style={{ padding: '0.6rem 1.5rem', background: '#0D0D0D', border: 'none', borderRadius: 50, color: '#FAFAF8', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Browse Shops</button>
              </div>
            )}

          {
            shopCakes.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <button onClick={() => navigate('/gallery')} style={{
                  padding: '0.85rem 2.5rem',
                  background: 'transparent',
                  border: '1.5px solid #0D0D0D',
                  borderRadius: 50, color: '#0D0D0D',
                  fontWeight: 700, fontSize: '0.92rem',
                  cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0D0D0D'; e.currentTarget.style.color = '#FAFAF8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#0D0D0D'; e.currentTarget.style.transform = 'none'; }}
                >
                  <i className="bi bi-grid me-2"></i>View Full Gallery
                </button>
              </div>
            )
          }
        </div>
      </section >

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ background: '#F4F3F0', padding: '7rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ fontSize: '0.68rem', color: '#C4614A', letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>Why Choose Us</div>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem,4vw,2.8rem)',
              fontWeight: 700, color: '#0D0D0D',
              marginBottom: '0.5rem', letterSpacing: '-0.02em',
            }}>
              The Art of <span style={{ fontStyle: 'italic', color: '#C9933A' }}>Exceptional</span> Cakes
            </h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div className="col-sm-6 col-lg-3" key={i}>
                <div
                  className="home-feature-card"
                  style={{
                    background: hoveredFeature === i ? '#FFFFFF' : '#FAFAF8',
                    borderRadius: 20, padding: '2rem',
                    height: '100%', border: '1px solid #E2E0DB',
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredFeature(i)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div style={{
                    width: 60, height: 60,
                    margin: '0 auto 1.25rem',
                    background: hoveredFeature === i ? `${f.accent}15` : '#F0EDE6',
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.3s ease',
                    border: hoveredFeature === i ? `1px solid ${f.accent}30` : '1px solid transparent',
                  }}>
                    <i className={`bi ${f.icon}`} style={{
                      color: hoveredFeature === i ? f.accent : '#5A5A5A',
                      fontSize: '1.6rem',
                      transition: 'color 0.3s ease',
                    }}></i>
                  </div>
                  <h4 style={{ fontWeight: 700, color: '#0D0D0D', fontSize: '1rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>{f.title}</h4>
                  <p style={{ color: '#8A8A8A', fontSize: '0.875rem', margin: 0, lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{
        background: '#0D0D0D',
        padding: '7rem 0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Accent blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '8%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(201,147,58,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '8%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(196,97,74,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        {/* Dot grid */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          backgroundImage: 'radial-gradient(circle, #FFFFFF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div style={{ fontSize: '0.68rem', color: 'rgba(201,147,58,0.6)', letterSpacing: 5, textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>Start Creating</div>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem,4vw,3rem)',
                color: '#FAFAF8', fontWeight: 700,
                marginBottom: '1.25rem', lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}>
                Your Dream Cake<br />
                <span style={{ fontStyle: 'italic', color: '#C9933A' }}>Awaits You</span>
              </h2>
              <p style={{ color: 'rgba(250,250,248,0.45)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                Design it from scratch with our builder, or browse hundreds of cakes from partner shops island-wide.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/create')} className="btn-pulse-ring" style={{
                  padding: '0.9rem 2.5rem',
                  background: '#C9933A',
                  border: 'none', borderRadius: 50,
                  color: '#0D0D0D', fontWeight: 700,
                  fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(201,147,58,0.3)',
                  transition: 'all 0.28s ease', fontFamily: 'inherit',
                  position: 'relative',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(201,147,58,0.42)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,147,58,0.3)'; }}
                >
                  <i className="bi bi-stars me-2"></i>Start Designing
                </button>
                <button onClick={() => navigate('/gallery')} style={{
                  padding: '0.9rem 2.5rem',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.18)',
                  borderRadius: 50, color: '#FAFAF8',
                  fontWeight: 600, fontSize: '0.95rem',
                  cursor: 'pointer', transition: 'all 0.28s ease', fontFamily: 'inherit',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'none'; }}
                >
                  <i className="bi bi-grid me-2"></i>Explore Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes floatPremium {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes floatLayer {
          0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}
          50%{transform:translateX(-50%) translateY(-14px) rotate(0.4deg)}
        }
        @keyframes floatEmoji {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-10px)}
        }
        @keyframes scrollBounce {
          0%,20%,50%,80%,100%{transform:translateX(-50%) translateY(0)}
          40%{transform:translateX(-50%) translateY(-10px)}
          60%{transform:translateX(-50%) translateY(-5px)}
        }
        @keyframes ringPulse {
          0%  { transform: scale(1);   opacity: 0.6; }
          100%{ transform: scale(1.7); opacity: 0;   }
        }
        .btn-pulse-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 999px;
          border: 2px solid currentColor;
          opacity: 0;
        }
        .btn-pulse-ring:hover::before {
          animation: ringPulse 0.65s ease-out forwards;
        }
        .home-cake-card:hover .home-cake-img { transform: scale(1.09); }
      `}</style>
    </div>
  );
};

export default HomePage;
