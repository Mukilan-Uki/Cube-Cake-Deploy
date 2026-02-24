import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShopSettingsPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!user || user.role !== 'shop_owner') {
      navigate('/');
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/shops/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    try {
      const res = await fetch('http://localhost:5001/api/shops/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        alert('Settings updated successfully!');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
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
                  <i className="bi bi-gear me-2"></i>
                  Shop Settings
                </h4>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/shop/dashboard')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <h5 className="mb-3">Basic Information</h5>
                <div className="mb-3">
                  <label className="form-label">Shop Name</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.shopName || ''}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Shop Description</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">WhatsApp Number</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="Optional"
                  />
                </div>

                <h5 className="mb-3 mt-4">Address</h5>
                <div className="mb-3">
                  <label className="form-label">Street Address</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.address?.street || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      address: {...formData.address, street: e.target.value}
                    })}
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.address?.city || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, city: e.target.value}
                      })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.address?.state || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, state: e.target.value}
                      })}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Zip Code</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.address?.zipCode || ''}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, zipCode: e.target.value}
                      })}
                    />
                  </div>
                </div>

                <h5 className="mb-3 mt-4">Shop Settings</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preparation Time (minutes)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.settings?.preparationTime || 120}
                      onChange={(e) => setFormData({
                        ...formData, 
                        settings: {...formData.settings, preparationTime: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Delivery Fee (LKR)</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.settings?.deliveryFee || 150}
                      onChange={(e) => setFormData({
                        ...formData, 
                        settings: {...formData.settings, deliveryFee: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Max Orders Per Day</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={formData.settings?.maxOrdersPerDay || 50}
                      onChange={(e) => setFormData({
                        ...formData, 
                        settings: {...formData.settings, maxOrdersPerDay: parseInt(e.target.value)}
                      })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="form-check mt-4">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        id="autoAcceptOrders"
                        checked={formData.settings?.autoAcceptOrders || false}
                        onChange={(e) => setFormData({
                          ...formData, 
                          settings: {...formData.settings, autoAcceptOrders: e.target.checked}
                        })}
                      />
                      <label className="form-check-label" htmlFor="autoAcceptOrders">
                        Auto-accept new orders
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Shop Status</h5>
              <div className="mb-3">
                <strong>Shop Slug:</strong>
                <p className="text-muted mb-0">{settings?.shopSlug}</p>
              </div>
              <div className="mb-3">
                <strong>Verification Status:</strong>
                <p>
                  {settings?.isVerified ? (
                    <span className="badge bg-success">Verified</span>
                  ) : (
                    <span className="badge bg-warning">Pending Verification</span>
                  )}
                </p>
              </div>
              <div className="mb-3">
                <strong>Member Since:</strong>
                <p className="text-muted">
                  {new Date(settings?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <hr />
              <h6>Quick Stats</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Orders:</span>
                <strong>{settings?.stats?.totalOrders || 0}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Total Revenue:</span>
                <strong>LKR {settings?.stats?.totalRevenue || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;