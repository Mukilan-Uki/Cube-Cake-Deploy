import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const ShopOwnerCakesPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cakes, setCakes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceLKR: '',
    category: 'Birthday',
    image: '',
    isAvailable: true,
    isPopular: false
  });

  const categories = ['Birthday', 'Wedding', 'Anniversary', 'Special', 'Custom', 'Kids'];

  useEffect(() => {
    if (!user || (user.role !== 'shop_owner' && user.role !== 'super_admin')) {
      navigate('/');
      return;
    }
    fetchCakes();
  }, [user, navigate]);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/shops/my-cakes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setCakes(data.cakes);
      }
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData({...formData, image: url});
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCake 
        ? `http://localhost:5001/api/shops/cakes/${editingCake._id}`
        : 'http://localhost:5001/api/shops/cakes';
      
      const method = editingCake ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          priceLKR: parseFloat(formData.priceLKR)
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        resetForm();
        fetchCakes();
      }
    } catch (error) {
      console.error('Error saving cake:', error);
    }
  };

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name,
      description: cake.description,
      priceLKR: cake.priceLKR,
      category: cake.category,
      image: cake.image || '',
      isAvailable: cake.isAvailable,
      isPopular: cake.isPopular || false
    });
    setImagePreview(cake.image || '');
    setShowModal(true);
  };

  const handleDelete = async (cakeId) => {
    if (!window.confirm('Are you sure you want to delete this cake?')) return;
    
    try {
      const res = await fetch(`http://localhost:5001/api/shops/cakes/${cakeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        fetchCakes();
      }
    } catch (error) {
      console.error('Error deleting cake:', error);
    }
  };

  const toggleAvailability = async (cakeId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/shops/cakes/${cakeId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        fetchCakes();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
  };

  const togglePopular = async (cakeId) => {
    try {
      const res = await fetch(`http://localhost:5001/api/shops/cakes/${cakeId}/popular`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        fetchCakes();
      }
    } catch (error) {
      console.error('Error toggling popular:', error);
    }
  };

  const resetForm = () => {
    setEditingCake(null);
    setFormData({
      name: '',
      description: '',
      priceLKR: '',
      category: 'Birthday',
      image: '',
      isAvailable: true,
      isPopular: false
    });
    setImagePreview('');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">
                    <i className="bi bi-cake2 me-2 text-primary"></i>
                    Manage My Cakes
                  </h4>
                  <p className="text-muted mb-0">
                    Add and manage your cake catalog. These will appear on the public home page.
                  </p>
                </div>
                <div>
                  <button 
                    className="btn btn-outline-secondary me-2"
                    onClick={() => navigate('/shop/dashboard')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      resetForm();
                      setShowModal(true);
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Cake
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Cakes</h6>
              <h3>{cakes.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Available</h6>
              <h3 className="text-success">{cakes.filter(c => c.isAvailable).length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Popular</h6>
              <h3 className="text-warning">{cakes.filter(c => c.isPopular).length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Cakes Grid */}
      {cakes.length > 0 ? (
        <div className="row g-4">
          {cakes.map(cake => (
            <div className="col-md-6 col-lg-4" key={cake._id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="position-relative">
                  <img 
                    src={cake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'} 
                    className="card-img-top" 
                    alt={cake.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    {cake.isPopular && (
                      <span className="badge bg-warning me-1">
                        <i className="bi bi-star-fill me-1"></i>Popular
                      </span>
                    )}
                    <span className={`badge ${cake.isAvailable ? 'bg-success' : 'bg-secondary'}`}>
                      {cake.isAvailable ? 'Available' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{cake.name}</h5>
                    <h5 className="text-primary mb-0">{formatLKR(cake.priceLKR)}</h5>
                  </div>
                  <p className="card-text text-muted small">
                    {cake.description?.length > 100 
                      ? cake.description.substring(0, 100) + '...' 
                      : cake.description || 'No description'}
                  </p>
                  <div className="mb-2">
                    <span className="badge bg-light text-dark me-2">
                      <i className="bi bi-tag me-1"></i>
                      {cake.category}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(cake)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDelete(cake._id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button 
                        className={`btn btn-sm ${cake.isAvailable ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => toggleAvailability(cake._id)}
                        title={cake.isAvailable ? 'Hide from public' : 'Show to public'}
                      >
                        <i className={`bi ${cake.isAvailable ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                    <button 
                      className={`btn btn-sm ${cake.isPopular ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => togglePopular(cake._id)}
                      title={cake.isPopular ? 'Remove from popular' : 'Mark as popular'}
                    >
                      <i className="bi bi-star-fill"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-cake2 display-1 text-muted"></i>
                <h5 className="mt-4">No Cakes Added Yet</h5>
                <p className="text-muted mb-4">
                  Start adding your delicious cakes. They will appear on the public home page with your shop name.
                </p>
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Cake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Cake Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCake ? 'Edit Cake' : 'Add New Cake'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mb-3 text-center">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                      
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={formData.image}
                          onChange={handleImageChange}
                          placeholder="https://example.com/cake.jpg"
                        />
                        <small className="text-muted">
                          Use any image URL from the internet
                        </small>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Cake Name *</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Price (LKR) *</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={formData.priceLKR}
                          onChange={(e) => setFormData({...formData, priceLKR: e.target.value})}
                          required
                          min="0"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select 
                          className="form-select"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input"
                          id="isAvailable"
                          checked={formData.isAvailable}
                          onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="isAvailable">
                          Available for order
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input 
                          type="checkbox" 
                          className="form-check-input"
                          id="isPopular"
                          checked={formData.isPopular}
                          onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                        />
                        <label className="form-check-label" htmlFor="isPopular">
                          Mark as Popular (shows on home page)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    {editingCake ? 'Update Cake' : 'Add Cake'}
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