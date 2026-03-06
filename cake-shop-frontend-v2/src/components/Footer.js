import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0D0D0D',
      color: '#FAFAF8',
      padding: '4rem 0 2rem',
    }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: 36, height: 36,
                background: 'rgba(201,147,58,0.15)',
                border: '1px solid rgba(201,147,58,0.3)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="bi bi-cake2" style={{ color: '#C9933A', fontSize: '1.1rem' }}></i>
              </div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.3rem', fontWeight: 700,
                color: '#FAFAF8',
              }}>
                Cube<span style={{ color: '#C9933A' }}>Cake</span>
              </span>
            </div>
            <p style={{ color: 'rgba(250,250,248,0.5)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 280 }}>
              Where cakes transform into edible masterpieces and every celebration finds its perfect sweet expression.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="https://www.instagram.com/mukilan_vasantharaj/" style={{
                  width: 34, height: 34,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(250,250,248,0.5)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,147,58,0.15)'; e.currentTarget.style.color = '#C9933A'; e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(250,250,248,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <i className="bi bi-instagram"></i>
                  </a>

                <a href="https://www.linkedin.com/in/mukilan-vasantharaj-640992372/" style={{
                  width: 34, height: 34,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(250,250,248,0.5)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,147,58,0.15)'; e.currentTarget.style.color = '#C9933A'; e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(250,250,248,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <i className="bi bi-linkedin"></i>
                  </a>

                <a href="https://web.whatsapp.com/" style={{
                  width: 34, height: 34,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(250,250,248,0.5)',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,147,58,0.15)'; e.currentTarget.style.color = '#C9933A'; e.currentTarget.style.borderColor = 'rgba(201,147,58,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(250,250,248,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                    <i className="bi bi-whatsapp"></i>
                  </a>
            </div>
          </div>

          <div className="col-md-4">
            <h6 style={{ color: '#FAFAF8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {[['/', 'Home'], ['/gallery', 'Cake Gallery'], ['/create', 'Custom Design'], ['/order', 'Place Order']].map(([href, label]) => (
                <li key={href}>
                  <a href={href} style={{ color: 'rgba(250,250,248,0.5)', fontSize: '0.88rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#FAFAF8'}
                    onMouseLeave={e => e.target.style.color = 'rgba(250,250,248,0.5)'}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4">
            <h6 style={{ color: '#FAFAF8', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Contact</h6>
            <div className="d-flex flex-column gap-3">
              {[
                { icon: 'bi-geo-alt', text: 'Main Street, Santhively, Batticaloa' },
                { icon: 'bi-telephone', text: '0743086099' },
                { icon: 'bi-envelope', text: 'cubecake@gmail.com' },
              ].map((item, i) => (
                <div key={i} className="d-flex gap-2 align-items-start">
                  <div style={{
                    width: 28, height: 28, flexShrink: 0,
                    background: 'rgba(201,147,58,0.12)',
                    border: '1px solid rgba(201,147,58,0.2)',
                    borderRadius: 7,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <i className={`bi ${item.icon}`} style={{ color: '#C9933A', fontSize: '0.75rem' }}></i>
                  </div>
                  <span style={{ color: 'rgba(250,250,248,0.5)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(250,250,248,0.3)', fontSize: '0.82rem', margin: 0 }}>
            © 2026 Cube Cake Shop • Made with <i className="bi bi-heart-fill" style={{ color: '#C4614A', margin: '0 3px' }}></i> and sprinkles
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
