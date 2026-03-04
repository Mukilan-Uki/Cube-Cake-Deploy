import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';
import { API_CONFIG } from '../config';

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [shopCakes, setShopCakes] = useState([]);
  const [loadingCakes, setLoadingCakes] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    { icon: 'bi-gem', title: 'Premium Ingredients', desc: 'Finest quality, sourced fresh every day', accent: '#D4AF37' },
    { icon: 'bi-palette', title: 'Custom Design', desc: 'Craft your own unique masterpiece online', accent: '#FF6B8B' },
    { icon: 'bi-truck', title: 'Island-Wide Delivery', desc: 'Reliable delivery across Sri Lanka', accent: '#9D5CFF' },
    { icon: 'bi-shield-check', title: 'Satisfaction Guaranteed', desc: '100% happiness or we make it right', accent: '#FF9E6D' },
  ];

  return (
    <div style={{ overflowX: 'hidden', fontFamily: "'Poppins', sans-serif" }}>
      {/* ===== HERO ===== */}
      <section ref={heroRef} style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0a06 0%, #1a0f08 50%, #2c1510 100%)', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Ambient blobs */}
        <div style={{ position:'absolute', top:'5%', right:'10%', width:500, height:500, background:'radial-gradient(circle,rgba(212,175,55,0.15) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(60px)', transform:`translate(${mousePos.x*20}px,${mousePos.y*20}px)`, transition:'transform 0.3s ease', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', left:'5%', width:400, height:400, background:'radial-gradient(circle,rgba(255,107,139,0.12) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(60px)', transform:`translate(${mousePos.x*-15}px,${mousePos.y*-15}px)`, transition:'transform 0.3s ease', pointerEvents:'none' }} />

        <div className="container" style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center" style={{ minHeight: '90vh' }}>
            <div className="col-lg-6">
              {isAuthenticated && user && (
                <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(212,175,55,0.12)', border:'1px solid rgba(212,175,55,0.25)', borderRadius:50, padding:'0.4rem 1rem', marginBottom:'1.5rem' }}>
                  <i className="bi bi-crown" style={{ color:'#D4AF37' }}></i>
                  <span style={{ color:'#D4AF37', fontSize:'0.85rem', fontWeight:600 }}>Welcome back, {user?.name?.split(' ')[0]}</span>
                </div>
              )}

              <div style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.4)', letterSpacing:4, textTransform:'uppercase', marginBottom:'1rem' }}>Artisan Bakery • Sri Lanka</div>

              <h1 style={{ color:'white', fontWeight:800, lineHeight:1.1, marginBottom:'1.5rem', fontSize:'clamp(2.5rem, 6vw, 4.5rem)' }}>
                Where Every Cake<br />
                <span style={{ background:'linear-gradient(135deg,#D4AF37,#F1D06E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontFamily:"'Playfair Display',serif", fontStyle:'italic' }}>Tells a Story</span>
              </h1>

              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'1.15rem', lineHeight:1.7, maxWidth:520, marginBottom:'2.5rem' }}>
                Handcrafted cakes made with love, from our partner bakeries across Sri Lanka. Design your dream cake or choose from our curated collection.
              </p>

              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginBottom:'3rem' }}>
                <button onClick={() => navigate('/create')} style={{ padding:'0.85rem 2rem', background:'linear-gradient(135deg,#D4AF37,#F1D06E)', border:'none', borderRadius:50, color:'#1a0f08', fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 8px 25px rgba(212,175,55,0.35)', transition:'all 0.2s', fontFamily:'inherit' }}
                  onMouseEnter={e=>{e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 12px 30px rgba(212,175,55,0.45)'}}
                  onMouseLeave={e=>{e.target.style.transform='translateY(0)';e.target.style.boxShadow='0 8px 25px rgba(212,175,55,0.35)'}}>
                  <i className="bi bi-palette me-2"></i>Design a Cake
                </button>
                <button onClick={() => navigate('/gallery')} style={{ padding:'0.85rem 2rem', background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:50, color:'white', fontWeight:600, fontSize:'1rem', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', fontFamily:'inherit' }}
                  onMouseEnter={e=>{e.target.style.background='rgba(255,255,255,0.12)'}}
                  onMouseLeave={e=>{e.target.style.background='rgba(255,255,255,0.07)'}}>
                  <i className="bi bi-grid me-2"></i>Browse Gallery
                </button>
              </div>

              <div style={{ display:'flex', gap:'3rem' }}>
                {[{ v:'2,500+', l:'Happy Clients' },{ v:'50+', l:'Flavors' },{ v:'15+', l:'Partner Shops' }].map((s,i) => (
                  <div key={i}>
                    <div style={{ color:'#D4AF37', fontWeight:800, fontSize:'1.75rem', lineHeight:1 }}>{s.v}</div>
                    <div style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8rem', marginTop:'0.25rem' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cake visual */}
            <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
              <div style={{ position:'relative', width:420, height:480 }}>
                {/* Glowing backdrop */}
                <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 60%,rgba(212,175,55,0.2) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(30px)' }} />
                
                {/* Animated cake layers */}
                {[
                  { bottom:80, w:320, h:85, bg:'linear-gradient(135deg,#2c1810,#3d2015)', delay:0, r:-2 },
                  { bottom:158, w:275, h:78, bg:'linear-gradient(135deg,#D4AF37,#a07d1d)', delay:0.4, r:1 },
                  { bottom:228, w:235, h:72, bg:'linear-gradient(135deg,#fff,#f5e6d0)', delay:0.8, r:-1 },
                  { bottom:292, w:190, h:65, bg:'linear-gradient(135deg,#FF6B8B,#c84a6a)', delay:1.2, r:2 },
                ].map((layer, i) => (
                  <div key={i} style={{
                    position:'absolute', left:'50%', transform:`translateX(-50%) rotate(${layer.r}deg)`,
                    bottom: layer.bottom, width: layer.w, height: layer.h,
                    background: layer.bg, borderRadius: 16,
                    boxShadow:'0 20px 40px rgba(0,0,0,0.4)', animation:`floatLayer ${6+i}s ease-in-out infinite`,
                    animationDelay:`${layer.delay}s`
                  }}>
                    <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 25% 25%,rgba(255,255,255,0.15) 0%,transparent 50%)', borderRadius:'inherit' }} />
                  </div>
                ))}

                {/* Floating emojis */}
                {['🍓','🍫','✨','🌸','🎂'].map((e,i) => (
                  <div key={i} style={{
                    position:'absolute', fontSize:'1.8rem',
                    left:`${15+i*17}%`, top:`${20+i*12}%`,
                    animation:`floatEmoji ${4+i*0.5}s ease-in-out infinite`,
                    animationDelay:`${i*0.3}s`,
                    filter:'drop-shadow(0 8px 15px rgba(0,0,0,0.3))',
                    transform:`rotate(${mousePos.x*8}deg)`
                  }}>{e}</div>
                ))}

                {/* Plate */}
                <div style={{ position:'absolute', bottom:50, left:'50%', transform:'translateX(-50%)', width:360, height:20, background:'radial-gradient(ellipse,rgba(255,255,255,0.12) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(8px)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', textAlign:'center', animation:'bounce 2s infinite' }}>
          <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.7rem', letterSpacing:2, textTransform:'uppercase', marginBottom:'0.5rem' }}>Scroll</div>
          <i className="bi bi-chevron-down" style={{ color:'rgba(255,255,255,0.3)', fontSize:'1.2rem' }} />
        </div>
      </section>

      {/* ===== PARTNER SHOPS CAKES ===== */}
      <section style={{ background:'#faf7f4', padding:'6rem 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <div style={{ fontSize:'0.72rem', color:'#D4AF37', letterSpacing:4, textTransform:'uppercase', fontWeight:700, marginBottom:'0.75rem' }}>From Our Network</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:700, color:'#1a0f08', marginBottom:'0.75rem' }}>
              Handpicked Cakes from<br /><span style={{ color:'#D4AF37', fontStyle:'italic' }}>Trusted Bakeries</span>
            </h2>
            <p style={{ color:'#6b5c52', fontSize:'1rem', maxWidth:500, margin:'0 auto' }}>Discover beautiful cakes crafted by our verified partner shops across Sri Lanka</p>
          </div>

          {loadingCakes ? (
            <div style={{ textAlign:'center', padding:'3rem' }}>
              <div className="spinner-border" style={{ color:'#D4AF37', width:'3rem', height:'3rem' }}></div>
            </div>
          ) : shopCakes.length > 0 ? (
            <div className="row g-4">
              {shopCakes.map(cake => (
                <div className="col-sm-6 col-lg-3" key={cake._id}>
                  <div style={{ background:'white', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', transition:'all 0.3s', cursor:'pointer' }}
                    onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.12)'}}
                    onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)'}}>
                    <div style={{ position:'relative', height:200, overflow:'hidden' }}>
                      <img src={cake.image} alt={cake.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s' }}
                        onMouseEnter={e=>e.target.style.transform='scale(1.08)'} onMouseLeave={e=>e.target.style.transform='scale(1)'} />
                      {cake.isPopular && (
                        <div style={{ position:'absolute', top:12, right:12, background:'linear-gradient(135deg,#D4AF37,#F1D06E)', borderRadius:50, padding:'0.2rem 0.75rem', fontSize:'0.72rem', fontWeight:700, color:'#1a0f08' }}>
                          🔥 Popular
                        </div>
                      )}
                    </div>
                    <div style={{ padding:'1.25rem' }}>
                      <h6 style={{ fontWeight:700, color:'#1a0f08', marginBottom:'0.25rem', fontSize:'0.95rem' }}>{cake.name}</h6>
                      <p style={{ color:'#9D5CFF', fontSize:'0.78rem', fontWeight:600, marginBottom:'0.5rem' }}>
                        <i className="bi bi-shop me-1"></i>{cake.shopName}
                      </p>
                      <p style={{ color:'#8a7060', fontSize:'0.82rem', lineHeight:1.4, marginBottom:'1rem' }}>{cake.description?.substring(0,60)}...</p>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ color:'#FF6B8B', fontWeight:800, fontSize:'1rem' }}>{formatLKR(cake.priceLKR)}</span>
                        <div style={{ display:'flex', gap:'0.5rem' }}>
                          <button onClick={() => navigate(`/shops/${cake.shopSlug}`)} style={{ padding:'0.35rem 0.75rem', background:'#faf7f4', border:'1px solid #e8ddd5', borderRadius:50, color:'#6b5c52', fontSize:'0.75rem', cursor:'pointer', fontFamily:'inherit' }}>Shop</button>
                          <button onClick={() => navigate('/order', { state: { galleryCake: {...cake, shopId: cake.shop} } })} style={{ padding:'0.35rem 0.75rem', background:'linear-gradient(135deg,#FF9E6D,#FF6B8B)', border:'none', borderRadius:50, color:'white', fontSize:'0.75rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Order</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'4rem', background:'white', borderRadius:20 }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:0.3 }}>🎂</div>
              <p style={{ color:'#8a7060' }}>No cakes from partner shops yet.</p>
              <button onClick={() => navigate('/shops')} style={{ padding:'0.6rem 1.5rem', background:'linear-gradient(135deg,#D4AF37,#F1D06E)', border:'none', borderRadius:50, color:'#1a0f08', fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>Browse Shops</button>
            </div>
          )}

          {shopCakes.length > 0 && (
            <div style={{ textAlign:'center', marginTop:'3rem' }}>
              <button onClick={() => navigate('/gallery')} style={{ padding:'0.85rem 2.5rem', background:'transparent', border:'2px solid #D4AF37', borderRadius:50, color:'#D4AF37', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' }}
                onMouseEnter={e=>{e.target.style.background='#D4AF37';e.target.style.color='#1a0f08'}}
                onMouseLeave={e=>{e.target.style.background='transparent';e.target.style.color='#D4AF37'}}>
                <i className="bi bi-grid me-2"></i>View Full Gallery
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section style={{ background:'white', padding:'6rem 0' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
            <div style={{ fontSize:'0.72rem', color:'#FF6B8B', letterSpacing:4, textTransform:'uppercase', fontWeight:700, marginBottom:'0.75rem' }}>Why Choose Us</div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,2.75rem)', fontWeight:700, color:'#1a0f08', marginBottom:'0.5rem' }}>
              The Art of <span style={{ color:'#D4AF37', fontStyle:'italic' }}>Exceptional</span> Cakes
            </h2>
          </div>
          <div className="row g-4">
            {features.map((f,i) => (
              <div className="col-sm-6 col-lg-3" key={i}>
                <div style={{ background:'#faf7f4', borderRadius:20, padding:'2rem', height:'100%', border:'1px solid #f0e8e0', transition:'all 0.3s', textAlign:'center' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow=`0 16px 40px ${f.accent}25`;e.currentTarget.style.borderColor=f.accent+'44'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none';e.currentTarget.style.borderColor='#f0e8e0'}}>
                  <div style={{ width:64, height:64, margin:'0 auto 1.25rem', background:`${f.accent}15`, borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <i className={`bi ${f.icon}`} style={{ color:f.accent, fontSize:'1.75rem' }}></i>
                  </div>
                  <h4 style={{ fontWeight:700, color:'#1a0f08', fontSize:'1rem', marginBottom:'0.5rem' }}>{f.title}</h4>
                  <p style={{ color:'#8a7060', fontSize:'0.875rem', margin:0, lineHeight:1.5 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section style={{ background:'linear-gradient(135deg,#1a0f08 0%,#2c1810 100%)', padding:'6rem 0', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'10%', left:'10%', width:300, height:300, background:'radial-gradient(circle,rgba(212,175,55,0.15) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(50px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', right:'10%', width:250, height:250, background:'radial-gradient(circle,rgba(255,107,139,0.12) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(50px)', pointerEvents:'none' }} />
        <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div style={{ fontSize:'0.72rem', color:'rgba(212,175,55,0.7)', letterSpacing:4, textTransform:'uppercase', fontWeight:700, marginBottom:'1rem' }}>Start Creating</div>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'white', fontWeight:700, marginBottom:'1.25rem', lineHeight:1.2 }}>
                Your Dream Cake<br /><span style={{ color:'#D4AF37', fontStyle:'italic' }}>Awaits You</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'1.1rem', lineHeight:1.7, marginBottom:'2.5rem' }}>
                Design it from scratch with our builder, or browse hundreds of cakes from partner shops island-wide.
              </p>
              <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
                <button onClick={() => navigate('/create')} style={{ padding:'0.9rem 2.5rem', background:'linear-gradient(135deg,#D4AF37,#F1D06E)', border:'none', borderRadius:50, color:'#1a0f08', fontWeight:700, fontSize:'1rem', cursor:'pointer', boxShadow:'0 8px 25px rgba(212,175,55,0.35)', transition:'all 0.2s', fontFamily:'inherit' }}
                  onMouseEnter={e=>e.target.style.transform='translateY(-2px)'} onMouseLeave={e=>e.target.style.transform='translateY(0)'}>
                  <i className="bi bi-stars me-2"></i>Start Designing
                </button>
                <button onClick={() => navigate('/gallery')} style={{ padding:'0.9rem 2.5rem', background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:50, color:'white', fontWeight:600, fontSize:'1rem', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', fontFamily:'inherit' }}
                  onMouseEnter={e=>e.target.style.background='rgba(255,255,255,0.14)'} onMouseLeave={e=>e.target.style.background='rgba(255,255,255,0.08)'}>
                  <i className="bi bi-grid me-2"></i>Explore Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floatLayer {
          0%,100%{transform:translateX(-50%) translateY(0) rotate(0deg)}
          50%{transform:translateX(-50%) translateY(-15px) rotate(0.5deg)}
        }
        @keyframes floatEmoji {
          0%,100%{transform:translateY(0)}
          50%{transform:translateY(-12px)}
        }
        @keyframes bounce {
          0%,20%,50%,80%,100%{transform:translateX(-50%) translateY(0)}
          40%{transform:translateX(-50%) translateY(-10px)}
          60%{transform:translateX(-50%) translateY(-5px)}
        }
      `}</style>
    </div>
  );
};

export default HomePage;
