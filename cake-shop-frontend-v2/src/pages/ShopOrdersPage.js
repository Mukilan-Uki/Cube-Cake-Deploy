import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';
import { API_CONFIG } from '../config';

const ShopOrdersPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // FIX: allow both shop_owner AND super_admin
    if (!user || (user.role !== 'shop_owner' && user.role !== 'super_admin')) {
      navigate('/'); return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_CONFIG.SHOPS.ORDERS}?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      if (data.success) fetchOrders();
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
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // FIX: filteredOrders properly declared
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (order.orderId && order.orderId.toLowerCase().includes(searchLower)) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  if (loading) {
    return <div className="loading-screen"><div className="spinner-gradient"></div><p>Loading orders…</p></div>;
  }

  return (
    <div className="shop-page-bg">
      {/* Header */}
      <div className="shop-page-header">
        <div>
          <h2 className="shop-page-title">
            <span className="shop-page-title-icon"><i className="bi bi-bag-check"></i></span>
            Order Management
          </h2>
          <p className="shop-page-subtitle">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-outline-rose" onClick={() => navigate('/shop/dashboard')}>
            <i className="bi bi-arrow-left me-1"></i> Dashboard
          </button>
          <button className="btn-rose" onClick={fetchOrders}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        </div>
      </div>

      {/* Summary + Search row */}
      <div className="row g-3 mb-4">
        {/* Summary cards */}
        <div className="col-md-8">
          <div className="row g-3 h-100">
            {[
              { label:'Total', value: orders.length, icon:'bi-bag', cls:'stat-icon-rose' },
              { label:'Pending', value: orders.filter(o=>o.status==='pending').length, icon:'bi-clock', cls:'stat-icon-gold' },
              { label:'Processing', value: orders.filter(o=>['confirmed','preparing'].includes(o.status)).length, icon:'bi-arrow-repeat', cls:'stat-icon-blue' },
              { label:'Completed', value: orders.filter(o=>o.status==='completed').length, icon:'bi-check-circle', cls:'stat-icon-green' },
            ].map((s,i) => (
              <div className="col-3" key={i}>
                <div className="stat-card flex-column align-items-center text-center gap-1 py-3">
                  <div className={`stat-card-icon ${s.cls}`} style={{margin:'0 auto 0.35rem'}}><i className={`bi ${s.icon}`}></i></div>
                  <div className="stat-card-value" style={{fontSize:'1.6rem'}}>{s.value}</div>
                  <div className="stat-card-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="col-md-4">
          <div className="content-card h-100">
            <div className="content-card-body d-flex align-items-center" style={{height:'100%'}}>
              <div style={{position:'relative',width:'100%'}}>
                <i className="bi bi-search" style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-soft)'}}></i>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search orders, customers…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{paddingLeft:'2.2rem'}}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="content-card mb-3">
        <div className="content-card-body" style={{padding:'0.75rem 1.25rem'}}>
          <div className="filter-tabs">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key)}
              >
                {tab.label}
                <span style={{marginLeft:'4px',opacity:0.75,fontSize:'0.78rem'}}>
                  ({tab.key === 'all' ? orders.length : orders.filter(o => o.status === tab.key).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="content-card">
        <div style={{overflowX:'auto'}}>
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Order ID</th><th>Customer</th><th>Items</th>
                <th>Total</th><th>Status</th><th>Delivery</th><th>Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <tr key={order.orderId}>
                  <td><strong>#{order.orderId?.slice(-6) || order.orderId}</strong></td>
                  <td>
                    <div style={{fontWeight:600,color:'var(--text-dark)'}}>{order.customerName}</div>
                    <small style={{color:'var(--text-soft)'}}>{order.customerPhone}</small>
                  </td>
                  <td>
                    <div style={{fontSize:'0.85rem'}}>{order.cakeDetails?.size || 'N/A'} Cake</div>
                    <small style={{color:'var(--text-soft)'}}>
                      {order.cakeDetails?.layers || 0} layers · {order.cakeDetails?.toppings?.length || 0} toppings
                    </small>
                  </td>
                  <td><strong style={{color:'var(--rg-primary)'}}>{formatLKR(order.totalPrice)}</strong></td>
                  <td><span className={`badge ${getStatusClass(order.status)}`}>{order.status}</span></td>
                  <td>
                    <span className="badge" style={{background: order.deliveryType === 'delivery' ? '#CCE5FF' : '#F0E8E2', color: order.deliveryType === 'delivery' ? '#004085' : '#6B4F50'}}>
                      <i className={`bi ${order.deliveryType === 'delivery' ? 'bi-truck' : 'bi-shop'} me-1`}></i>
                      {order.deliveryType}
                    </span>
                  </td>
                  <td><small style={{color:'var(--text-soft)'}}>{formatDate(order.createdAt)}</small></td>
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
              )) : (
                <tr>
                  <td colSpan="8" className="text-center py-5" style={{color:'var(--text-soft)'}}>
                    <div style={{fontSize:'2.5rem',opacity:0.2,marginBottom:'0.75rem'}}>📦</div>
                    {searchTerm || filter !== 'all' ? 'No orders match your filters' : 'No orders yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopOrdersPage;
