import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const ShopCakesPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cakes, setCakes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceLKR: '',
    category: '',
    image: '',
    isPopular: false
  });

  useEffect(() => {
    if (!user || user.role !== 'shop_owner') {
      navigate('/');
      return;
    }
    fetchCakes();
  }, [user, navigate]);

  const fetchCakes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/shops/cakes', {
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
        setEditingCake(null);
        setFormData({
          name: '',
          description: '',
          priceLKR: '',
          category: '',
          image: '',
          isPopular: false
        });
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
      description: cake.description || '',
      priceLKR: cake.priceLKR,
      category: cake.category || '',
      image: cake.image || '',
      isPopular: cake.isPopular || false
    });
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-cake me-2"></i>
                  My Cakes
                </h4>
                <div>
                  <button 
                    className="btn btn-outline-primary me-2"
                    onClick={() => navigate('/shop/dashboard')}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingCake(null);
                      setFormData({
                        name: '',
                        description: '',
                        priceLKR: '',
                        category: '',
                        image: '',
                        isPopular: false
                      });
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

      <div className="row g-4">
        {cakes.length > 0 ? (
          cakes.map(cake => (
            <div className="col-md-4 col-lg-3" key={cake._id}>
              <div className="card shadow-sm border-0 h-100">
                <img 
                  src={cake.image || 'https://via.placeholder.com/300x200?text=Cake'} 
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
                  <p className="card-text text-muted small">
                    {cake.description || 'No description'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <strong className="text-primary fs-5">{formatLKR(cake.priceLKR)}</strong>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(cake)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cake._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <i className="bi bi-cake display-1 text-muted"></i>
                <h5 className="mt-3">No Cakes Added Yet</h5>
                <p className="text-muted">Start adding your delicious cakes to the menu</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Cake
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Cake Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
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
                    setEditingCake(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
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
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Special">Special</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/cake.jpg"
                    />
                  </div>
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      id="isPopular"
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="isPopular">
                      Mark as Popular
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCake(null);
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

export default ShopCakesPage;