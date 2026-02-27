import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config';

const ShopSettingsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // FIX: allow both shop_owner AND super_admin
    if (!user || (user.role !== 'shop_owner' && user.role !== 'super_admin')) {
      navigate('/'); return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_CONFIG.SHOPS.SETTINGS, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setFormData({
          shopName: data.settings.shopName,
          description: data.settings.description || '',
          email: data.settings.email,
          phone: data.settings.phone,
          whatsapp: data.settings.whatsapp || '',
          address: {
            street: data.settings.address?.street || '',
            city: data.settings.address?.city || '',
            state: data.settings.address?.state || '',
            zipCode: data.settings.address?.zipCode || ''
          },
          settings: {
            preparationTime: data.settings.settings?.preparationTime || 120,
            deliveryFee: data.settings.settings?.deliveryFee || 150,
            maxOrdersPerDay: data.settings.settings?.maxOrdersPerDay || 50,
            autoAcceptOrders: data.settings.settings?.autoAcceptOrders || false
          }
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(''); setErrorMsg('');
    try {
      const res = await fetch(API_CONFIG.SHOPS.SETTINGS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Settings saved successfully!');
        fetchSettings();
        setTimeout(() => setSuccessMsg(''), 3500);
      } else {
        setErrorMsg('Failed to save settings. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const Section = ({ icon, title, children }) => (
    <div className="content-card mb-4">
      <div className="content-card-header">
        <h6 className="content-card-title">
          <i className={`bi ${icon} me-2`} style={{color:'var(--rg-primary)'}}></i>{title}
        </h6>
      </div>
      <div className="content-card-body">{children}</div>
    </div>
  );

  if (loading) {
    return <div className="loading-screen"><div className="spinner-gradient"></div><p>Loading settings…</p></div>;
  }

  return (
    <div className="shop-page-bg">
      {/* Toast messages */}
      {successMsg && (
        <div className="alert alert-success" style={{position:'fixed',top:'80px',right:'1.5rem',zIndex:9999,boxShadow:'var(--shadow-md)',minWidth:'260px',animation:'fadeUp 0.3s ease'}}>
          <i className="bi bi-check-circle me-2"></i>{successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger" style={{position:'fixed',top:'80px',right:'1.5rem',zIndex:9999,boxShadow:'var(--shadow-md)',minWidth:'260px'}}>
          <i className="bi bi-exclamation-circle me-2"></i>{errorMsg}
        </div>
      )}

      {/* Header */}
      <div className="shop-page-header">
        <div>
          <h2 className="shop-page-title">
            <span className="shop-page-title-icon"><i className="bi bi-gear"></i></span>
            Shop Settings
          </h2>
          <p className="shop-page-subtitle">Manage your shop profile, contact info, and preferences</p>
        </div>
        <button className="btn-outline-rose" onClick={() => navigate('/shop/dashboard')}>
          <i className="bi bi-arrow-left me-1"></i> Dashboard
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          {/* Left column */}
          <div className="col-md-8">
            <Section icon="bi-shop" title="Basic Information">
              <div className="mb-3">
                <label className="form-label">Shop Name</label>
                <input type="text" className="form-control" value={formData.shopName || ''} onChange={(e) => setFormData({...formData, shopName: e.target.value})} required />
              </div>
              <div className="mb-0">
                <label className="form-label">Shop Description</label>
                <textarea className="form-control" rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Tell customers about your bakery…" />
              </div>
            </Section>

            <Section icon="bi-telephone" title="Contact Information">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input type="text" className="form-control" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div className="col-12">
                  <label className="form-label">WhatsApp Number <span style={{color:'var(--text-soft)',fontWeight:400,textTransform:'none',letterSpacing:0}}>(optional)</span></label>
                  <input type="text" className="form-control" value={formData.whatsapp || ''} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} placeholder="+94 77 000 0000" />
                </div>
              </div>
            </Section>

            <Section icon="bi-geo-alt" title="Address">
              <div className="mb-3">
                <label className="form-label">Street Address</label>
                <input type="text" className="form-control" value={formData.address?.street || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" value={formData.address?.city || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State / Province</label>
                  <input type="text" className="form-control" value={formData.address?.state || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value}})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Zip Code</label>
                  <input type="text" className="form-control" value={formData.address?.zipCode || ''} onChange={(e) => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} />
                </div>
              </div>
            </Section>

            <Section icon="bi-sliders" title="Shop Preferences">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Prep Time (min)</label>
                  <input type="number" className="form-control" value={formData.settings?.preparationTime || 120} onChange={(e) => setFormData({...formData, settings: {...formData.settings, preparationTime: parseInt(e.target.value)}})} min="1" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Delivery Fee (LKR)</label>
                  <input type="number" className="form-control" value={formData.settings?.deliveryFee || 150} onChange={(e) => setFormData({...formData, settings: {...formData.settings, deliveryFee: parseInt(e.target.value)}})} min="0" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Max Orders / Day</label>
                  <input type="number" className="form-control" value={formData.settings?.maxOrdersPerDay || 50} onChange={(e) => setFormData({...formData, settings: {...formData.settings, maxOrdersPerDay: parseInt(e.target.value)}})} min="1" />
                </div>
              </div>
              <div className="mt-3 p-3" style={{background:'var(--rg-pale)',borderRadius:'var(--radius-sm)',border:'1.5px solid var(--rg-blush)'}}>
                <div className="form-check mb-0">
                  <input type="checkbox" className="form-check-input" id="autoAccept" checked={formData.settings?.autoAcceptOrders || false} onChange={(e) => setFormData({...formData, settings: {...formData.settings, autoAcceptOrders: e.target.checked}})} />
                  <label className="form-check-label" htmlFor="autoAccept" style={{fontWeight:600,fontSize:'0.9rem',color:'var(--text-dark)'}}>
                    Auto-accept new orders
                  </label>
                </div>
                <small style={{color:'var(--text-soft)',fontSize:'0.8rem'}}>When enabled, new orders are automatically confirmed without manual review</small>
              </div>
            </Section>

            <div className="d-flex gap-2">
              <button type="submit" className="btn-rose" disabled={saving}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className="bi bi-check-circle me-1"></i>Save Settings</>}
              </button>
              <button type="button" className="btn-outline-rose" onClick={fetchSettings}>
                <i className="bi bi-arrow-counterclockwise me-1"></i> Reset
              </button>
            </div>
          </div>

          {/* Right column: status card */}
          <div className="col-md-4">
            <div className="content-card" style={{position:'sticky',top:'80px'}}>
              <div className="content-card-header">
                <h6 className="content-card-title"><i className="bi bi-info-circle me-2" style={{color:'var(--rg-primary)'}}></i>Shop Status</h6>
              </div>
              <div className="content-card-body">
                <div className="mb-3">
                  <div className="form-label">Shop URL Slug</div>
                  <div style={{fontFamily:'monospace',background:'var(--cream-warm)',padding:'0.5rem 0.75rem',borderRadius:'var(--radius-sm)',fontSize:'0.85rem',color:'var(--text-mid)',border:'1px solid var(--cream-deep)'}}>
                    /shops/{settings?.shopSlug || '—'}
                  </div>
                </div>
                <div className="mb-3">
                  <div className="form-label">Verification</div>
                  {settings?.isVerified
                    ? <span className="badge" style={{background:'#D4EDDA',color:'#155724',fontSize:'0.82rem'}}><i className="bi bi-patch-check me-1"></i>Verified</span>
                    : <span className="badge" style={{background:'#FFF3CD',color:'#856404',fontSize:'0.82rem'}}><i className="bi bi-clock me-1"></i>Pending</span>
                  }
                </div>
                <div className="mb-3">
                  <div className="form-label">Member Since</div>
                  <div style={{color:'var(--text-mid)',fontSize:'0.9rem'}}>{settings?.createdAt ? new Date(settings.createdAt).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'}) : '—'}</div>
                </div>
                <hr style={{borderColor:'var(--linen)'}} />
                <div className="form-label mb-2">Quick Stats</div>
                {[
                  { label:'Total Orders', value: settings?.stats?.totalOrders || 0 },
                  { label:'Total Revenue', value: `LKR ${(settings?.stats?.totalRevenue || 0).toLocaleString()}` },
                ].map((s,i) => (
                  <div key={i} className="d-flex justify-content-between mb-2 py-1" style={{borderBottom:'1px solid var(--linen)'}}>
                    <span style={{color:'var(--text-soft)',fontSize:'0.88rem'}}>{s.label}</span>
                    <strong style={{color:'var(--text-dark)',fontSize:'0.9rem'}}>{s.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopSettingsPage;
