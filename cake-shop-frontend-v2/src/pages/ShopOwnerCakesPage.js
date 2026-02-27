import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';
import { API_CONFIG } from '../config';

const ShopOwnerCakesPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cakes, setCakes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', priceLKR: '', category: 'Birthday',
    image: '', isAvailable: true, isPopular: false
  });

  const categories = ['Birthday', 'Wedding', 'Anniversary', 'Special', 'Custom', 'Kids'];

  useEffect(() => {
    if (!user || (user.role !== 'shop_owner' && user.role !== 'super_admin')) {
      navigate('/'); return;
    }
    fetchCakes();
  }, [user, navigate]);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_CONFIG.SHOPS.MY_CAKES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setCakes(data.cakes);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingCake ? API_CONFIG.SHOPS.CAKE(editingCake._id) : API_CONFIG.SHOPS.ADD_CAKE;
      const method = editingCake ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...formData, priceLKR: parseFloat(formData.priceLKR) })
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        resetForm();
        fetchCakes();
        showSuccess(editingCake ? 'Cake updated successfully!' : 'New cake added successfully!');
      }
    } catch (error) {
      console.error('Error saving cake:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name, description: cake.description, priceLKR: cake.priceLKR,
      category: cake.category, image: cake.image || '',
      isAvailable: cake.isAvailable, isPopular: cake.isPopular || false
    });
    setImagePreview(cake.image || '');
    setShowModal(true);
  };

  const handleDelete = async (cakeId) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;
    try {
      const res = await fetch(API_CONFIG.SHOPS.CAKE(cakeId), {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) { fetchCakes(); showSuccess('Cake deleted.'); }
    } catch (error) {
      console.error('Error deleting cake:', error);
    }
  };

  const toggleAvailability = async (cakeId) => {
    try {
      const res = await fetch(API_CONFIG.SHOPS.CAKE_TOGGLE(cakeId), {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchCakes();
    } catch (error) { console.error(error); }
  };

  const togglePopular = async (cakeId) => {
    try {
      const res = await fetch(API_CONFIG.SHOPS.CAKE_POPULAR(cakeId), {
        method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) fetchCakes();
    } catch (error) { console.error(error); }
  };

  const resetForm = () => {
    setEditingCake(null);
    setFormData({ name:'', description:'', priceLKR:'', category:'Birthday', image:'', isAvailable:true, isPopular:false });
    setImagePreview('');
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner-gradient"></div><p>Loading your cakes…</p></div>;
  }

  return (
    <div className="shop-page-bg">
      {/* Success toast */}
      {successMsg && (
        <div className="alert alert-success" style={{ position:'fixed', top:'80px', right:'1.5rem', zIndex:9999, boxShadow:'var(--shadow-md)', minWidth:'260px', animation:'fadeUp 0.3s ease' }}>
          <i className="bi bi-check-circle me-2"></i>{successMsg}
        </div>
      )}

      {/* Header */}
      <div className="shop-page-header">
        <div>
          <h2 className="shop-page-title">
            <span className="shop-page-title-icon"><i className="bi bi-cake2"></i></span>
            Manage My Cakes
          </h2>
          <p className="shop-page-subtitle">Add and manage your cake catalog — these appear on the public home page</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-outline-rose" onClick={() => navigate('/shop/dashboard')}>
            <i className="bi bi-arrow-left me-1"></i> Dashboard
          </button>
          <button className="btn-rose" onClick={() => { resetForm(); setShowModal(true); }}>
            <i className="bi bi-plus-circle me-1"></i> Add New Cake
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Cakes', value: cakes.length, icon: 'bi-grid', iconClass: 'stat-icon-rose' },
          { label: 'Available', value: cakes.filter(c => c.isAvailable).length, icon: 'bi-eye', iconClass: 'stat-icon-green' },
          { label: 'Popular', value: cakes.filter(c => c.isPopular).length, icon: 'bi-star', iconClass: 'stat-icon-gold' },
        ].map((s,i) => (
          <div className="col-4" key={i}>
            <div className="stat-card">
              <div><div className="stat-card-label">{s.label}</div><div className="stat-card-value">{s.value}</div></div>
              <div className={`stat-card-icon ${s.iconClass}`}><i className={`bi ${s.icon}`}></i></div>
            </div>
          </div>
        ))}
      </div>

      {/* Cakes Grid or Empty state */}
      {cakes.length > 0 ? (
        <div className="row g-3">
          {cakes.map(cake => (
            <div className="col-md-6 col-lg-4" key={cake._id}>
              <div className="card h-100" style={{overflow:'hidden'}}>
                <div className="cake-card-img-wrap">
                  <img
                    src={cake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'}
                    className="cake-card-img"
                    alt={cake.name}
                  />
                </div>
                {/* Overlay badges */}
                <div style={{position:'absolute',top:'10px',right:'10px',display:'flex',gap:'4px'}}>
                  {cake.isPopular && (
                    <span className="badge" style={{background:'var(--gold-mid)',color:'var(--text-dark)'}}>
                      <i className="bi bi-star-fill me-1"></i>Popular
                    </span>
                  )}
                  <span className="badge" style={{background: cake.isAvailable ? '#D4EDDA' : '#F0E8E2', color: cake.isAvailable ? '#155724' : '#9B8080'}}>
                    {cake.isAvailable ? 'Live' : 'Hidden'}
                  </span>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h5 style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:'1.05rem',color:'var(--text-dark)',margin:0}}>{cake.name}</h5>
                    <span style={{fontFamily:'var(--font-display)',fontWeight:700,color:'var(--rg-primary)',fontSize:'1rem',whiteSpace:'nowrap',marginLeft:'8px'}}>{formatLKR(cake.priceLKR)}</span>
                  </div>
                  <p style={{fontSize:'0.82rem',color:'var(--text-soft)',marginBottom:'0.75rem',lineHeight:1.5}}>
                    {cake.description?.length > 90 ? cake.description.substring(0, 90) + '…' : cake.description || 'No description'}
                  </p>
                  <span className="shop-badge"><i className="bi bi-tag me-1"></i>{cake.category}</span>

                  {/* Actions */}
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2" style={{borderTop:'1px solid var(--linen)'}}>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm" style={{background:'var(--rg-blush)',color:'var(--rg-primary)',border:'none',borderRadius:'var(--radius-sm)',padding:'5px 10px'}} onClick={() => handleEdit(cake)} title="Edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm" style={{background:'#fde8e8',color:'#c0392b',border:'none',borderRadius:'var(--radius-sm)',padding:'5px 10px'}} onClick={() => handleDelete(cake._id)} title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm"
                        style={{background: cake.isAvailable ? '#fff3e0' : '#e8f5e9', color: cake.isAvailable ? '#e65100' : '#2e7d32', border:'none', borderRadius:'var(--radius-sm)', padding:'5px 10px'}}
                        onClick={() => toggleAvailability(cake._id)}
                        title={cake.isAvailable ? 'Hide' : 'Show'}
                      >
                        <i className={`bi ${cake.isAvailable ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{background: cake.isPopular ? 'var(--gold-pale)' : 'var(--cream-mid)', color: cake.isPopular ? 'var(--gold-rich)' : 'var(--text-soft)', border:'none', borderRadius:'var(--radius-sm)', padding:'5px 10px', transition:'all 0.2s'}}
                      onClick={() => togglePopular(cake._id)}
                      title={cake.isPopular ? 'Remove from popular' : 'Mark popular'}
                    >
                      <i className={`bi ${cake.isPopular ? 'bi-star-fill' : 'bi-star'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="content-card">
          <div className="content-card-body text-center py-5">
            <div style={{fontSize:'4rem',opacity:0.2,marginBottom:'1rem'}}>🎂</div>
            <h5 style={{fontFamily:'var(--font-display)',color:'var(--text-dark)'}}>No Cakes Added Yet</h5>
            <p style={{color:'var(--text-soft)',maxWidth:'360px',margin:'0 auto 1.5rem'}}>
              Start adding your delicious cakes. They will appear on the public home page with your shop name.
            </p>
            <button className="btn-rose" onClick={() => { resetForm(); setShowModal(true); }}>
              <i className="bi bi-plus-circle me-2"></i>Add Your First Cake
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(61,38,38,0.4)', backdropFilter:'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${editingCake ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{color:'var(--rg-primary)'}}></i>
                  {editingCake ? 'Edit Cake' : 'Add New Cake'}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{padding:'1.5rem'}}>
                  <div className="row g-3">
                    {/* Left col: image */}
                    <div className="col-md-5">
                      <div style={{background:'var(--rg-pale)',borderRadius:'var(--radius-md)',overflow:'hidden',marginBottom:'0.75rem',height:'180px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={() => setImagePreview('')} />
                        ) : (
                          <div style={{textAlign:'center',color:'var(--text-soft)'}}>
                            <i className="bi bi-image" style={{fontSize:'2.5rem',opacity:0.3}}></i>
                            <p style={{fontSize:'0.78rem',marginTop:'0.5rem'}}>Image preview</p>
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input type="text" className="form-control" value={formData.image} onChange={handleImageChange} placeholder="https://example.com/cake.jpg" />
                        <small style={{color:'var(--text-soft)',fontSize:'0.75rem'}}>Paste any image URL from the web</small>
                      </div>
                      <div className="mb-0">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Right col: details */}
                    <div className="col-md-7">
                      <div className="mb-3">
                        <label className="form-label">Cake Name *</label>
                        <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Strawberry Dream Cake" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price (LKR) *</label>
                        <input type="number" className="form-control" value={formData.priceLKR} onChange={(e) => setFormData({...formData, priceLKR: e.target.value})} placeholder="3500" required min="0" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description *</label>
                        <textarea className="form-control" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe your cake — flavours, ingredients, occasion…" required />
                      </div>
                      {/* Toggles */}
                      <div className="d-flex gap-3 mt-1">
                        <div style={{background:'var(--cream-warm)',borderRadius:'var(--radius-sm)',padding:'0.7rem 1rem',flex:1,border:'1.5px solid var(--cream-deep)'}}>
                          <div className="form-check mb-0">
                            <input type="checkbox" className="form-check-input" id="isAvailable" checked={formData.isAvailable} onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})} />
                            <label className="form-check-label" htmlFor="isAvailable" style={{fontWeight:600,fontSize:'0.85rem',color:'var(--text-dark)'}}>
                              <i className="bi bi-eye me-1" style={{color:'var(--rg-primary)'}}></i>Available
                            </label>
                          </div>
                          <small style={{color:'var(--text-soft)',fontSize:'0.75rem'}}>Visible to customers</small>
                        </div>
                        <div style={{background:'var(--cream-warm)',borderRadius:'var(--radius-sm)',padding:'0.7rem 1rem',flex:1,border:'1.5px solid var(--cream-deep)'}}>
                          <div className="form-check mb-0">
                            <input type="checkbox" className="form-check-input" id="isPopular" checked={formData.isPopular} onChange={(e) => setFormData({...formData, isPopular: e.target.checked})} />
                            <label className="form-check-label" htmlFor="isPopular" style={{fontWeight:600,fontSize:'0.85rem',color:'var(--text-dark)'}}>
                              <i className="bi bi-star me-1" style={{color:'var(--gold-rich)'}}></i>Popular
                            </label>
                          </div>
                          <small style={{color:'var(--text-soft)',fontSize:'0.75rem'}}>Shows on home page</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-outline-rose" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn-rose" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className={`bi ${editingCake ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>{editingCake ? 'Update Cake' : 'Add Cake'}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerCakesPage;
