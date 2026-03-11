import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Full name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email format';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'At least 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password, role: 'customer' });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login-selection'), 2000);
    } else {
      setErrors({ general: result.message || 'Registration failed' });
    }
    setLoading(false);
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '0.8rem 1rem 0.8rem 3rem',
    background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${hasError ? 'rgba(220,53,69,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, color: 'white', fontSize: '0.9rem', outline:'none', boxSizing:'border-box',
    transition:'border-color 0.2s', fontFamily:'inherit'
  });

  if (success) return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0a06,#1a0f08,#2c1810)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif" }}>
      <div style={{ textAlign:'center', color:'white' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>✨</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#D4AF37', fontSize:'2rem', marginBottom:'0.5rem' }}>Welcome!</h2>
        <p style={{ color:'rgba(255,255,255,0.5)' }}>Account created. Redirecting to login...</p>
        <div className="spinner-border mt-3" style={{ color:'#D4AF37', width:'1.5rem', height:'1.5rem' }}></div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f0a06 0%,#1a0f08 40%,#2c1810 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:"'Poppins',sans-serif", position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:'10%', right:'8%', width:300, height:300, background:'radial-gradient(circle,rgba(212,175,55,0.1) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(50px)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'15%', left:'5%', width:250, height:250, background:'radial-gradient(circle,rgba(255,107,139,0.08) 0%,transparent 70%)', borderRadius:'50%', filter:'blur(50px)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:500, background:'rgba(255,255,255,0.04)', backdropFilter:'blur(30px)', border:'1px solid rgba(212,175,55,0.18)', borderRadius:24, padding:'2.5rem', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <div style={{ width:64, height:64, margin:'0 auto 0.75rem', background:'linear-gradient(135deg,#D4AF37,#F1D06E)', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', boxShadow:'0 8px 20px rgba(212,175,55,0.3)' }}>🎂</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:700, background:'linear-gradient(135deg,#D4AF37,#F1D06E)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:0 }}>Create Account</h1>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.82rem', margin:'0.3rem 0 0' }}>Join Cube Cake and start ordering</p>
        </div>

        {errors.general && (
          <div style={{ background:'rgba(220,53,69,0.12)', border:'1px solid rgba(220,53,69,0.3)', borderRadius:10, padding:'0.7rem 1rem', marginBottom:'1.25rem', color:'#ff8080', fontSize:'0.85rem' }}>
            <i className="bi bi-exclamation-circle-fill me-2"></i>{errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>Full Name</label>
            <div style={{ position:'relative' }}>
              <i className="bi bi-person-fill" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'0.95rem' }} />
              <input type="text" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} placeholder="Your full name" style={inputStyle(errors.name)}
                onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=errors.name?'rgba(220,53,69,0.5)':'rgba(255,255,255,0.1)'} />
            </div>
            {errors.name && <p style={{ color:'#ff8080', fontSize:'0.75rem', margin:'0.25rem 0 0 0.25rem' }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>Email Address</label>
            <div style={{ position:'relative' }}>
              <i className="bi bi-envelope-fill" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'0.95rem' }} />
              <input type="email" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} placeholder="your@email.com" style={inputStyle(errors.email)}
                onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=errors.email?'rgba(220,53,69,0.5)':'rgba(255,255,255,0.1)'} />
            </div>
            {errors.email && <p style={{ color:'#ff8080', fontSize:'0.75rem', margin:'0.25rem 0 0 0.25rem' }}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>Phone</label>
            <div style={{ position:'relative' }}>
              <i className="bi bi-telephone-fill" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'0.95rem' }} />
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData,phone:e.target.value})} placeholder="+94 77 000 0000" style={inputStyle(false)}
                onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
            </div>
          </div>

          {/* Password row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
            <div>
              <label style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>Password</label>
              <div style={{ position:'relative' }}>
                <i className="bi bi-lock-fill" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'0.95rem' }} />
                <input type={showPass?'text':'password'} value={formData.password} onChange={e=>setFormData({...formData,password:e.target.value})} placeholder="Min 6 chars"
                  style={{...inputStyle(errors.password), paddingRight:'2.5rem'}}
                  onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=errors.password?'rgba(220,53,69,0.5)':'rgba(255,255,255,0.1)'} />
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:0, fontSize:'0.9rem' }}>
                  <i className={`bi ${showPass?'bi-eye-slash':'bi-eye'}`} />
                </button>
              </div>
              {errors.password && <p style={{ color:'#ff8080', fontSize:'0.72rem', margin:'0.2rem 0 0' }}>{errors.password}</p>}
            </div>
            <div>
              <label style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.72rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', display:'block', marginBottom:'0.4rem' }}>Confirm</label>
              <div style={{ position:'relative' }}>
                <i className="bi bi-lock-fill" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#D4AF37', fontSize:'0.95rem' }} />
                <input type={showConfirmPass?'text':'password'} value={formData.confirmPassword} onChange={e=>setFormData({...formData,confirmPassword:e.target.value})} placeholder="Repeat password"
                  style={{...inputStyle(errors.confirmPassword), paddingRight:'2.5rem'}}
                  onFocus={e=>e.target.style.borderColor='#D4AF37'} onBlur={e=>e.target.style.borderColor=errors.confirmPassword?'rgba(220,53,69,0.5)':'rgba(255,255,255,0.1)'} />
                <button type="button" onClick={()=>setShowConfirmPass(!showConfirmPass)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', padding:0, fontSize:'0.9rem' }}>
                  <i className={`bi ${showConfirmPass?'bi-eye-slash':'bi-eye'}`} />
                </button>
              </div>
              {errors.confirmPassword && <p style={{ color:'#ff8080', fontSize:'0.72rem', margin:'0.2rem 0 0' }}>{errors.confirmPassword}</p>}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'0.9rem', background:loading?'rgba(212,175,55,0.4)':'linear-gradient(135deg,#D4AF37,#F1D06E)',
            border:'none', borderRadius:12, color:'#1a0f08', fontWeight:700, fontSize:'1rem',
            cursor:loading?'not-allowed':'pointer', transition:'all 0.2s', boxShadow:'0 4px 20px rgba(212,175,55,0.3)', fontFamily:'inherit'
          }}>
            {loading ? <><span className="spinner-border spinner-border-sm me-2" style={{width:'1rem',height:'1rem'}}></span>Creating Account...</> : <><i className="bi bi-person-plus-fill me-2"></i>Create Account</>}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:'1.25rem' }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.85rem', margin:'0 0 0.4rem' }}>Already have an account?{' '}
            <Link to="/login-selection" style={{ color:'#D4AF37', fontWeight:600, textDecoration:'none' }}>Sign In</Link>
          </p>
        </div>

        {/* Shop Owner registration link at bottom */}
        <div style={{ marginTop:'1.5rem', padding:'1rem', background:'rgba(212,175,55,0.05)', border:'1px solid rgba(212,175,55,0.12)', borderRadius:12, textAlign:'center' }}>
          <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', margin:'0 0 0.5rem' }}>Want to sell cakes on our platform?</p>
          <Link to="/register/shop" style={{ color:'#D4AF37', fontWeight:600, textDecoration:'none', fontSize:'0.85rem' }}>
            <i className="bi bi-shop me-1"></i>Register as a Shop Owner here
          </Link>
        </div>
      </div>

      <style>{`input::placeholder{color:rgba(255,255,255,0.2)!important;} input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px rgba(20,12,6,0.9) inset!important;-webkit-text-fill-color:white!important;}`}</style>
    </div>
  );
};

export default RegisterPage;
