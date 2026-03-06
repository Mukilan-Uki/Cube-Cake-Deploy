// src/pages/LoginPage.js - Unified login for all user types
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(formData.email, formData.password, formData.rememberMe);
    if (!result.success) {
      setError(result.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: 'white', fontSize: '0.95rem',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a06 0%, #1a0f08 40%, #2c1810 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', position: 'relative', overflow: 'hidden',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{ position:'absolute', top:'10%', left:'5%', width:400, height:400, background:'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', right:'5%', width:350, height:350, background:'radial-gradient(circle, rgba(255,107,139,0.1) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(60px)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:460, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(30px)', border:'1px solid rgba(212,175,55,0.18)', borderRadius:24, padding:'2.5rem', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:72, height:72, margin:'0 auto 1rem', background:'linear-gradient(135deg, #D4AF37, #F1D06E)', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 25px rgba(212,175,55,0.35)', fontSize:'2rem' }}>🎂</div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.8rem', fontWeight:700, background:'linear-gradient(135deg, #D4AF37, #F1D06E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>Cube Cake</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', margin:'0.35rem 0 0' }}>Sign in to your account</p>
        </div>

        {error && (
          <div style={{ background:'rgba(220,53,69,0.12)', border:'1px solid rgba(220,53,69,0.3)', borderRadius:12, padding:'0.75rem 1rem', marginBottom:'1.5rem', color:'#ff8080', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <i className="bi bi-exclamation-circle-fill"></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.75rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.5rem' }}>Email Address</label>
            <div style={{ position:'relative' }}>
              <i className="bi bi-envelope-fill" style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'1rem' }} />
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="your@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor='#D4AF37'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
          </div>

          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.75rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.5rem' }}>Password</label>
            <div style={{ position:'relative' }}>
              <i className="bi bi-lock-fill" style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'1rem' }} />
              <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="Enter your password"
                style={{...inputStyle, paddingRight:'3rem'}}
                onFocus={e => e.target.style.borderColor='#D4AF37'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.35)', cursor:'pointer', padding:0 }}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize:'1.1rem' }} />
              </button>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.75rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', cursor:'pointer', color:'rgba(255,255,255,0.45)', fontSize:'0.82rem' }}>
              <input type="checkbox" checked={formData.rememberMe} onChange={e => setFormData({...formData, rememberMe: e.target.checked})} style={{ accentColor:'#D4AF37' }} />
              Remember me
            </label>
          </div>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'0.9rem', background: loading ? 'rgba(212,175,55,0.4)' : 'linear-gradient(135deg, #D4AF37, #F1D06E)',
            border:'none', borderRadius:12, color:'#1a0f08', fontWeight:700, fontSize:'1rem',
            cursor: loading ? 'not-allowed' : 'pointer', transition:'all 0.2s', boxShadow:'0 4px 20px rgba(212,175,55,0.3)', fontFamily:'inherit'
          }}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" style={{width:'1rem',height:'1rem'}}></span>Signing In...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
            )}
          </button>
        </form>

        <div style={{ marginTop:'1.25rem', padding:'0.85rem 1rem', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.1)', borderRadius:10 }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.75rem', margin:0, textAlign:'center', lineHeight:1.6 }}>
            <i className="bi bi-info-circle me-1" style={{color:'#D4AF37'}}></i>
            You'll be automatically redirected to the right dashboard — Customer, Shop Owner, or Admin
          </p>
        </div>

        <div style={{ textAlign:'center', marginTop:'1.5rem' }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.85rem', margin:'0 0 0.5rem' }}>Don't have an account?</p>
          <Link to="/register" style={{ color:'#D4AF37', fontWeight:600, textDecoration:'none', fontSize:'0.9rem' }}>
            Create Account <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </div>

      <style>{`
        input[type="email"]::placeholder, input[type="password"]::placeholder, input[type="text"]::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px rgba(20,12,6,0.9) inset !important; -webkit-text-fill-color: white !important; }
      `}</style>
    </div>
  );
};

export default LoginPage;
