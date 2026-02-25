// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatLKR, formatLargeLKR } from '../utils/helpers';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const statusOptions = ['all', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  const statusColors = { 'Pending': 'warning', 'Preparing': 'info', 'Ready': 'primary', 'Completed': 'success', 'Cancelled': 'danger' };

  useEffect(() => { fetchAdminData(); }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const ordersResult = await apiService.getOrders();
      if (ordersResult.success) setOrders(ordersResult.orders || []);
      const statsResult = await apiService.getStats();
      if (statsResult.success) setStats(statsResult.stats || { totalOrders: 0, pendingOrders: 0, completedOrders: 0, totalRevenue: 0 });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const result = await apiService.updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        const statsResult = await apiService.getStats();
        if (statsResult.success) setStats(statsResult.stats);
      } else {
        alert(`Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return order.orderId?.toLowerCase().includes(s) || order.customerName?.toLowerCase().includes(s) || order.email?.toLowerCase().includes(s);
    }
    return true;
  });

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

  const todaysStats = (() => {
    const today = new Date().toDateString();
    const t = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    return { newOrders: t.length, cakesToPrepare: t.filter(o => ['Pending','Preparing'].includes(o.status)).length, revenueToday: t.reduce((s,o) => s + (o.totalPrice||0), 0) };
  })();

  const monthlyStats = (() => {
    const m = new Date().getMonth(), y = new Date().getFullYear();
    const mo = orders.filter(o => { const d = new Date(o.createdAt); return d.getMonth()===m && d.getFullYear()===y; });
    const rev = mo.reduce((s,o) => s + (o.totalPrice||0), 0);
    return { total: mo.length, revenue: rev, averageOrderValue: mo.length > 0 ? rev/mo.length : 0 };
  })();

  const exportOrdersCSV = () => {
    const headers = ['Order ID','Customer','Email','Phone','Total (LKR)','Status','Order Date'];
    const csvContent = [headers, ...filteredOrders.map(o => [o.orderId,o.customerName,o.email,o.phone,o.totalPrice,o.status,formatDate(o.createdAt)])].map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv' }));
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // FIXED: role check uses 'super_admin'
  if (!user || user.role !== 'super_admin') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-cream">
        <div className="glass-panel p-5 text-center" style={{ maxWidth: '500px' }}>
          <i className="bi bi-shield-exclamation display-1 text-strawberry mb-3"></i>
          <h2 className="text-chocolate">Access Denied</h2>
          <p className="text-secondary mb-4">You do not have administrator privileges.</p>
          <button className="btn-royal" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-cream">
      {/* Admin Top Navbar */}
      <nav style={{ background: 'linear-gradient(135deg, #1a0f0c 0%, #2C1810 100%)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 15px rgba(0,0,0,0.4)', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #D4AF37, #F1D06E)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="bi bi-shield-lock text-dark"></i>
          </div>
          <span style={{ color: '#D4AF37', fontWeight: 700, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem' }}>
            <i className="bi bi-globe2 me-1"></i>View Store
          </Link>
          <div style={{ color: '#D4AF37', fontSize: '0.85rem', padding: '0.3rem 0.7rem', background: 'rgba(212,175,55,0.1)', borderRadius: 8, border: '1px solid rgba(212,175,55,0.2)' }}>
            <i className="bi bi-person-badge me-1"></i>{user?.name?.split(' ')[0]}
          </div>
          <button onClick={() => { logout(); navigate('/'); }} style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B', borderRadius: 8, padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.85rem' }}>
            <i className="bi bi-box-arrow-right me-1"></i>Logout
          </button>
        </div>
      </nav>

      {/* Page Header */}
      <div className="py-5 text-white" style={{ background: 'var(--royal-chocolate)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 font-script text-gold mb-0">Admin Dashboard</h1>
              <p className="text-white-50">Overview of your patisserie's performance</p>
            </div>
            <div className="d-flex gap-2">
              <button onClick={fetchAdminData} className="btn btn-outline-light rounded-pill px-4" disabled={isLoading}>
                <i className={`bi ${isLoading ? 'bi-arrow-repeat' : 'bi-arrow-clockwise'} me-2`}></i>Refresh
              </button>
              <button onClick={exportOrdersCSV} className="btn btn-light rounded-pill px-4" disabled={filteredOrders.length === 0}>
                <i className="bi bi-download me-2"></i>Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Stats Row */}
        <div className="row g-4 mb-5">
          {[
            { title: 'Total Orders', value: stats.totalOrders, icon: 'bi-bag', color: 'primary', sub: `+${todaysStats.newOrders} today` },
            { title: 'Pending', value: stats.pendingOrders, icon: 'bi-clock-history', color: 'warning', sub: 'Requires attention' },
            { title: 'Completed', value: stats.completedOrders, icon: 'bi-check2-circle', color: 'success', sub: 'Delivered' },
            { title: 'Revenue', value: formatLKR(stats.totalRevenue), icon: 'bi-currency-rupee', color: 'danger', sub: `+${formatLKR(todaysStats.revenueToday)} today` }
          ].map((item, idx) => (
            <div className="col-xl-3 col-md-6" key={idx}>
              <div className="glass-panel p-4 h-100 position-relative overflow-hidden">
                <div className={`rounded-circle p-2 bg-${item.color} bg-opacity-10 text-${item.color} d-inline-flex mb-3`}>
                  <i className={`bi ${item.icon} fs-4`}></i>
                </div>
                <h3 className="display-6 fw-bold text-chocolate mb-1">{item.value}</h3>
                <p className="text-secondary mb-0 small text-uppercase fw-bold">{item.title}</p>
                <small className="text-success">{item.sub}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly + Today */}
        <div className="row g-4 mb-5">
          <div className="col-lg-8">
            <div className="glass-panel p-4 h-100">
              <h5 className="text-chocolate fw-bold border-bottom pb-3 mb-4">Monthly Performance</h5>
              <div className="row text-center">
                <div className="col-4 border-end">
                  <h3 className="display-6 fw-bold text-gold">{monthlyStats.total}</h3>
                  <span className="text-secondary small">Orders this month</span>
                </div>
                <div className="col-4 border-end">
                  <h3 className="display-6 fw-bold" style={{color:'#FF6B8B'}}>{formatLargeLKR(monthlyStats.revenue)}</h3>
                  <span className="text-secondary small">Revenue</span>
                </div>
                <div className="col-4">
                  <h3 className="display-6 fw-bold text-info">{formatLargeLKR(monthlyStats.averageOrderValue)}</h3>
                  <span className="text-secondary small">Avg. Order Value</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="glass-panel p-4 h-100">
              <h5 className="text-chocolate fw-bold border-bottom pb-3 mb-4">Today's Summary</h5>
              <ul className="list-group list-group-flush bg-transparent">
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-secondary">New Orders</span>
                  <span className="fw-bold text-chocolate">{todaysStats.newOrders}</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-secondary">To Prepare</span>
                  <span className="fw-bold text-warning">{todaysStats.cakesToPrepare}</span>
                </li>
                <li className="list-group-item bg-transparent d-flex justify-content-between px-0">
                  <span className="text-secondary">Today's Revenue</span>
                  <span className="fw-bold text-success">{formatLKR(todaysStats.revenueToday)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-panel p-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <h4 className="text-chocolate fw-bold mb-0">Recent Orders</h4>
            <div className="d-flex gap-2">
              <input type="text" className="form-control rounded-pill border-0 bg-white" placeholder="Search orders..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '250px' }} />
              <select className="form-select rounded-pill border-0 bg-white" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '150px' }}>
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt === 'all' ? 'All Status' : opt}</option>)}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="text-secondary small text-uppercase">
                <tr>
                  <th className="border-0">Order ID</th>
                  <th className="border-0">Customer</th>
                  <th className="border-0">Total</th>
                  <th className="border-0">Status</th>
                  <th className="border-0">Date</th>
                  <th className="border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? filteredOrders.map(order => (
                  <tr key={order.orderId}>
                    <td className="fw-bold text-chocolate">#{order.orderId}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.customerName}</div>
                      <div className="small text-secondary">{order.email}</div>
                    </td>
                    <td className="fw-bold" style={{color:'#FF6B8B'}}>{formatLKR(order.totalPrice)}</td>
                    <td>
                      <span className={`badge rounded-pill bg-${statusColors[order.status] || 'secondary'} bg-opacity-10 text-${statusColors[order.status] || 'secondary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-secondary small">{formatDate(order.createdAt)}</td>
                    <td className="text-end">
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light rounded-circle" data-bs-toggle="dropdown">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-sm">
                          <li><h6 className="dropdown-header">Update Status</h6></li>
                          {Object.keys(statusColors).map(status => (
                            <li key={status}>
                              <button className={`dropdown-item ${order.status === status ? 'active' : ''}`} onClick={() => updateOrderStatus(order.orderId, status)}>
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-secondary">No orders found matching your criteria.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
