import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';
import { API_CONFIG } from '../config';

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
    if (!user) { navigate('/login-selection'); return; }
    // FIX: allow both shop_owner AND super_admin
    if (user.role !== 'shop_owner' && user.role !== 'super_admin') {
      navigate('/'); return;
    }
    if (!user.shopId) { navigate('/shop/register'); return; }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_CONFIG.SHOPS.DASHBOARD, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      const json = await res.json();
      if (json.success) {
        setDashboardData(json.dashboard);
        setRecentOrders(json.dashboard.recentOrders || []);
        setStats(json.dashboard.stats || { totalOrders:0, pendingOrders:0, completedOrders:0, totalRevenue:0, totalCakes:0 });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(API_CONFIG.SHOPS.ORDER_STATUS(orderId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) fetchDashboardData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusClass = (status) => {
    const map = {
      pending: 'status-pending', confirmed: 'status-confirmed',
      preparing: 'status-preparing', ready: 'status-ready',
      out_for_delivery: 'status-confirmed', delivered: 'status-delivered',
      completed: 'status-completed', cancelled: 'status-cancelled',
      rejected: 'status-rejected'
    };
    return map[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-gradient"></div>
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: 'bi-bag', iconClass: 'stat-icon-rose' },
    { label: 'Pending', value: stats.pendingOrders || 0, icon: 'bi-clock-history', iconClass: 'stat-icon-gold' },
    { label: 'My Cakes', value: stats.totalCakes || 0, icon: 'bi-cake2', iconClass: 'stat-icon-blue' },
    { label: 'Total Revenue', value: formatLKR(stats.totalRevenue || 0), icon: 'bi-currency-rupee', iconClass: 'stat-icon-green', isMoney: true },
  ];

  return (
    <div className="shop-page-bg">
      {/* Header */}
      <div className="shop-page-header">
        <div>
          <h2 className="shop-page-title">
            <span className="shop-page-title-icon"><i className="bi bi-speedometer2"></i></span>
            {dashboardData?.shop?.shopName || 'My Dashboard'}
          </h2>
          <p className="shop-page-subtitle">
            <i className="bi bi-geo-alt me-1"></i>
            {dashboardData?.shop?.address?.street || 'Address not set'}
            {dashboardData?.shop?.email && <> &nbsp;·&nbsp; <i className="bi bi-envelope me-1"></i>{dashboardData.shop.email}</>}
          </p>
        </div>
        <div className="d-flex gap-2">
          {dashboardData?.shop?.shopSlug && (
            <button
              className="btn-outline-rose"
              onClick={() => window.open(`http://localhost:3000/shops/${dashboardData.shop.shopSlug}`, '_blank')}
            >
              <i className="bi bi-eye me-1"></i> View Public Store
            </button>
          )}
          <button className="btn-rose" onClick={fetchDashboardData}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {statCards.map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="stat-card">
              <div>
                <div className="stat-card-label">{s.label}</div>
                <div className="stat-card-value" style={s.isMoney ? { fontSize: '1.3rem' } : {}}>{s.value}</div>
              </div>
              <div className={`stat-card-icon ${s.iconClass}`}>
                <i className={`bi ${s.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="content-card mb-4">
        <div className="content-card-header">
          <h6 className="content-card-title"><i className="bi bi-lightning me-2" style={{color:'var(--rg-primary)'}}></i>Quick Actions</h6>
        </div>
        <div className="content-card-body">
          <div className="d-flex flex-wrap gap-2">
            <button className="quick-action-btn quick-action-primary" onClick={() => navigate('/shop/my-cakes')}>
              <i className="bi bi-cake2"></i> Manage Cakes
            </button>
            <button className="quick-action-btn quick-action-gold" onClick={() => navigate('/shop/my-cakes')}>
              <i className="bi bi-plus-circle"></i> Add New Cake
            </button>
            <button className="quick-action-btn quick-action-primary" onClick={() => navigate('/shop/orders')}>
              <i className="bi bi-bag-check"></i> All Orders
            </button>
            <button className="quick-action-btn quick-action-neutral" onClick={() => navigate('/shop/settings')}>
              <i className="bi bi-gear"></i> Shop Settings
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="content-card">
        <div className="content-card-header">
          <h6 className="content-card-title"><i className="bi bi-clock-history me-2" style={{color:'var(--rg-primary)'}}></i>Recent Orders</h6>
          <button className="btn-outline-rose" style={{padding:'0.4rem 0.9rem',fontSize:'0.82rem'}} onClick={() => navigate('/shop/orders')}>
            View All <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
        <div className="content-card-body" style={{padding:0}}>
          {recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Details</th>
                    <th>Total</th><th>Status</th><th>Date</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.orderId}>
                      <td><strong>#{order.orderId?.slice(-6) || order.orderId}</strong></td>
                      <td>
                        <div style={{fontWeight:600,color:'var(--text-dark)'}}>{order.customerName}</div>
                        <small style={{color:'var(--text-soft)'}}>{order.customerPhone}</small>
                      </td>
                      <td>
                        <small>{order.cakeDetails?.size || 'Medium'} · {order.cakeDetails?.layers || 2} layers</small>
                      </td>
                      <td><strong style={{color:'var(--rg-primary)'}}>{formatLKR(order.totalPrice)}</strong></td>
                      <td><span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                      <td><small>{formatDate(order.createdAt)}</small></td>
                      <td>
                        <select
                          className="status-select form-select form-select-sm"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.orderId, e.target.value)}
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
            <div className="text-center py-5">
              <div style={{fontSize:'3rem',opacity:0.25,marginBottom:'1rem'}}>🎂</div>
              <p style={{color:'var(--text-soft)'}}>No orders yet — your first order will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;
