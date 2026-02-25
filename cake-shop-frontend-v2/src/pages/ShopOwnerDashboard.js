import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCakes: 0
  });

  useEffect(() => {
    // Check if user is shop owner
    if (!user) {
      navigate('/login-selection');
      return;
    }

    if (user.role !== 'shop_owner' && user.role !== 'super_admin') {
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
      
      if (!dashboardRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const dashboardJson = await dashboardRes.json();
      
      if (dashboardJson.success) {
        setDashboardData(dashboardJson.dashboard);
        setRecentOrders(dashboardJson.dashboard.recentOrders || []);
        setStats(dashboardJson.dashboard.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalRevenue: 0,
          totalCakes: 0
        });
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
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating order:', error);
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
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
                    <i className="bi bi-shop me-2 text-primary"></i>
                    {dashboardData?.shop?.shopName || 'My Shop Dashboard'}
                  </h2>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {dashboardData?.shop?.address?.street || 'Address not set'}
                  </p>
                  <p className="text-muted mb-0 mt-1">
                    <i className="bi bi-envelope me-2"></i>
                    {dashboardData?.shop?.email || 'Email not set'} • 
                    <i className="bi bi-telephone ms-2 me-2"></i>
                    {dashboardData?.shop?.phone || 'Phone not set'}
                  </p>
                </div>
                <div className="d-flex gap-2">
                  {dashboardData?.shop?.shopSlug && (
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => window.open(`http://localhost:3000/shops/${dashboardData.shop.shopSlug}`, '_blank')}
                    >
                      <i className="bi bi-eye me-2"></i>
                      View Public Store
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="mb-0">{stats.totalOrders || 0}</h3>
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
                  <h3 className="mb-0 text-warning">{stats.pendingOrders || 0}</h3>
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
                  <h6 className="text-muted mb-2">My Cakes</h6>
                  <h3 className="mb-0 text-info">{stats.totalCakes || 0}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-cake2 fs-3 text-info"></i>
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
                  <h3 className="mb-0 text-success">{formatLKR(stats.totalRevenue || 0)}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-currency-rupee fs-3 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/shop/my-cakes')}
                >
                  <i className="bi bi-cake2 me-2"></i>
                  Manage My Cakes
                </button>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate('/shop/cakes?action=add')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add New Cake
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => navigate('/shop/orders')}
                >
                  <i className="bi bi-box me-2"></i>
                  View All Orders
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate('/shop/settings')}
                >
                  <i className="bi bi-gear me-2"></i>
                  Shop Settings
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/shop/dashboard')}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Refresh Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Orders</h5>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate('/shop/orders')}
              >
                View All Orders
              </button>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Cake</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.orderId}>
                          <td>
                            <strong>{order.orderId}</strong>
                          </td>
                          <td>
                            <div>{order.customerName}</div>
                            <small className="text-muted">{order.customerPhone}</small>
                          </td>
                          <td>
                            <small>
                              {order.cakeDetails?.size || 'Medium'} • 
                              {order.cakeDetails?.layers || 2} layers
                            </small>
                          </td>
                          <td>
                            <strong className="text-primary">{formatLKR(order.totalPrice)}</strong>
                          </td>
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
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-1 text-muted"></i>
                  <p className="text-muted mt-2">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;