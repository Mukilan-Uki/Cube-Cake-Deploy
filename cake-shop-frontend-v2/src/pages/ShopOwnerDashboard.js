import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [shopSettings, setShopSettings] = useState(null);
  const [cakes, setCakes] = useState([]);
  const [showAddCakeModal, setShowAddCakeModal] = useState(false);
  const [newCake, setNewCake] = useState({
    name: '',
    description: '',
    priceLKR: '',
    category: '',
    image: '',
    isPopular: false
  });

  useEffect(() => {
    // Check if user is shop owner
    if (!user || (user.role !== 'shop_owner' && user.role !== 'super_admin')) {
      navigate('/');
      return;
    }

    // If user has no shopId, redirect to shop registration
    if (!user.shopId) {
      navigate('/shop/register');
      return;
    }

    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const dashboardRes = await fetch('http://localhost:5001/api/shops/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const dashboardJson = await dashboardRes.json();
      
      if (dashboardJson.success) {
        setDashboardData(dashboardJson.dashboard);
      }

      // Fetch orders
      const ordersRes = await fetch('http://localhost:5001/api/shops/orders?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ordersJson = await ordersRes.json();
      
      if (ordersJson.success) {
        setOrders(ordersJson.orders);
      }

      // Fetch shop settings
      const settingsRes = await fetch('http://localhost:5001/api/shops/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const settingsJson = await settingsRes.json();
      
      if (settingsJson.success) {
        setShopSettings(settingsJson.settings);
      }

      // Fetch shop cakes
      const cakesRes = await fetch('http://localhost:5001/api/shops/cakes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const cakesJson = await cakesRes.json();
      
      if (cakesJson.success) {
        setCakes(cakesJson.cakes);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5001/api/shops/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      
      if (data.success) {
        // Refresh orders
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const addCake = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/shops/cakes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCake,
          priceLKR: parseFloat(newCake.priceLKR)
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setShowAddCakeModal(false);
        setNewCake({
          name: '',
          description: '',
          priceLKR: '',
          category: '',
          image: '',
          isPopular: false
        });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error adding cake:', error);
    }
  };

  const deleteCake = async (cakeId) => {
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
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error deleting cake:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'warning',
      'confirmed': 'info',
      'preparing': 'primary',
      'ready': 'success',
      'out_for_delivery': 'info',
      'delivered': 'success',
      'completed': 'success',
      'cancelled': 'danger',
      'rejected': 'danger'
    };
    return colors[status] || 'secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
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
                  <h2 className="mb-1" style={{ color: '#2C1810' }}>
                    {dashboardData?.shop?.shopName || 'Shop Dashboard'}
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {dashboardData?.shop?.address?.street || 'Address not set'}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => window.open(`http://localhost:3000/shop/${dashboardData?.shop?.shopSlug}`, '_blank')}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Public Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {dashboardData && (
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Orders</h6>
                    <h3 className="mb-0">{dashboardData.stats.totalOrders}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                    <i className="bi bi-bag fs-3 text-primary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Pending Orders</h6>
                    <h3 className="mb-0 text-warning">{dashboardData.stats.pendingOrders}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                    <i className="bi bi-clock-history fs-3 text-warning"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Today's Orders</h6>
                    <h3 className="mb-0">{dashboardData.stats.todaysOrders}</h3>
                  </div>
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                    <i className="bi bi-calendar-day fs-3 text-info"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2">Total Revenue</h6>
                    <h3 className="mb-0 text-success">{formatLKR(dashboardData.stats.totalRevenue)}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                    <i className="bi bi-currency-rupee fs-3 text-success"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="bi bi-box me-2"></i>
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'cakes' ? 'active' : ''}`}
                onClick={() => setActiveTab('cakes')}
              >
                <i className="bi bi-cake me-2"></i>
                My Cakes
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear me-2"></i>
                Settings
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Recent Orders</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentOrders?.map(order => (
                        <tr key={order.orderId}>
                          <td>
                            <strong>{order.orderId}</strong>
                          </td>
                          <td>{order.customerName}</td>
                          <td>{formatLKR(order.totalPrice)}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                              style={{ width: '120px' }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirm</option>
                              <option value="preparing">Preparing</option>
                              <option value="ready">Ready</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveTab('cakes')}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Cake
                  </button>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-list me-2"></i>
                    View All Orders
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setActiveTab('settings')}
                  >
                    <i className="bi bi-gear me-2"></i>
                    Shop Settings
                  </button>
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Shop Info</h5>
              </div>
              <div className="card-body">
                <p className="mb-2">
                  <i className="bi bi-envelope me-2 text-muted"></i>
                  {shopSettings?.email || 'Not set'}
                </p>
                <p className="mb-2">
                  <i className="bi bi-telephone me-2 text-muted"></i>
                  {shopSettings?.phone || 'Not set'}
                </p>
                <p className="mb-2">
                  <i className="bi bi-geo-alt me-2 text-muted"></i>
                  {shopSettings?.address?.street || 'Address not set'}
                </p>
                <p className="mb-0">
                  <i className="bi bi-check-circle me-2 text-muted"></i>
                  Status: {shopSettings?.isVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white border-0">
            <h5 className="mb-0">All Orders</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Delivery</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>
                        <strong>{order.orderId}</strong>
                      </td>
                      <td>
                        <div>{order.customerName}</div>
                        <small className="text-muted">{order.customerPhone}</small>
                      </td>
                      <td>
                        <div>{order.cakeDetails?.size} Cake</div>
                        <small className="text-muted">
                          {order.cakeDetails?.layers} layers • {order.cakeDetails?.toppings?.length || 0} toppings
                        </small>
                      </td>
                      <td>
                        <strong>{formatLKR(order.totalPrice)}</strong>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${order.deliveryType === 'delivery' ? 'info' : 'secondary'}`}>
                          {order.deliveryType}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <select 
                          className="form-select form-select-sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
                          style={{ width: '130px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirm</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cakes Tab */}
      {activeTab === 'cakes' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>My Cakes</h5>
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddCakeModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Cake
            </button>
          </div>

          <div className="row g-4">
            {cakes.map(cake => (
              <div className="col-md-4" key={cake._id}>
                <div className="card shadow-sm border-0 h-100">
                  <img 
                    src={cake.image || 'https://via.placeholder.com/300x200'} 
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
                    <p className="card-text text-muted small">{cake.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-primary">{formatLKR(cake.priceLKR)}</strong>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteCake(cake._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && shopSettings && (
        <div className="row">
          <div className="col-md-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Shop Settings</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Shop Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={shopSettings.shopName}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={shopSettings.email}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={shopSettings.phone}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={shopSettings.address?.street || ''}
                      readOnly
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Preparation Time (minutes)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={shopSettings.settings?.preparationTime || 120}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Delivery Fee (LKR)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={shopSettings.settings?.deliveryFee || 150}
                        readOnly
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Cake Modal */}
      {showAddCakeModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Cake</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAddCakeModal(false)}
                ></button>
              </div>
              <form onSubmit={addCake}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Cake Name *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newCake.name}
                      onChange={(e) => setNewCake({...newCake, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={newCake.description}
                      onChange={(e) => setNewCake({...newCake, description: e.target.value})}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Price (LKR) *</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={newCake.priceLKR}
                        onChange={(e) => setNewCake({...newCake, priceLKR: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Category</label>
                      <select 
                        className="form-select"
                        value={newCake.category}
                        onChange={(e) => setNewCake({...newCake, category: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Special">Special</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newCake.image}
                      onChange={(e) => setNewCake({...newCake, image: e.target.value})}
                      placeholder="https://example.com/cake.jpg"
                    />
                  </div>
                  <div className="form-check">
                    <input 
                      type="checkbox" 
                      className="form-check-input"
                      id="isPopular"
                      checked={newCake.isPopular}
                      onChange={(e) => setNewCake({...newCake, isPopular: e.target.checked})}
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
                    onClick={() => setShowAddCakeModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Add Cake
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

export default ShopOwnerDashboard;