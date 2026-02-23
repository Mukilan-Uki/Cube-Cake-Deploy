// src/pages/AdminPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatLKR, formatLargeLKR } from '../utils/helpers';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  const statusOptions = ['all', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

  const statusColors = {
    'Pending': 'warning',
    'Preparing': 'info',
    'Ready': 'primary',
    'Completed': 'success',
    'Cancelled': 'danger'
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);

      const ordersResult = await apiService.getOrders();
      if (ordersResult.success) {
        setOrders(ordersResult.orders || []);
      } else {
        console.error('Failed to fetch orders:', ordersResult.message);
        setOrders([]);
      }

      const statsResult = await apiService.getStats();
      if (statsResult.success) {
        setStats(statsResult.stats || {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalRevenue: 0
        });
      }
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
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: newStatus, updatedAt: new Date() }
              : order
          )
        );
        const statsResult = await apiService.getStats();
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      } else {
        alert(`❌ Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.orderId?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        order.email?.toLowerCase().includes(searchLower) ||
        order.phone?.includes(searchTerm)
      );
    }
    return true;
  });

  const calculateTodaysStats = () => {
    const today = new Date().toDateString();
    const todaysOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today);

    return {
      newOrders: todaysOrders.length,
      cakesToPrepare: todaysOrders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length,
      revenueToday: todaysOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    };
  };

  const todaysStats = calculateTodaysStats();

  const calculateMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    return {
      total: monthlyOrders.length,
      revenue: monthlyOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
      averageOrderValue: monthlyOrders.length > 0 ? monthlyOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / monthlyOrders.length : 0
    };
  };

  const monthlyStats = calculateMonthlyStats();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleRefresh = () => fetchAdminData();

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Total (LKR)', 'Status', 'Delivery Date', 'Order Date'];
    const csvData = filteredOrders.map(order => [
      order.orderId, order.customerName, order.email, order.phone, order.totalPrice, order.status, formatDate(order.deliveryDate), formatDate(order.createdAt)
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!user || user.role !== 'admin') {
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
      {/* Header */}
      <div className="py-5 bg-coffee text-white" style={{ background: 'var(--royal-chocolate)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 font-script text-gold mb-0">Admin Dashboard</h1>
              <p className="text-white-50">Overview of your patisserie's performance</p>
            </div>
            <div className="d-flex gap-2">
              <button onClick={handleRefresh} className="btn btn-outline-light rounded-pill px-4" disabled={isLoading}>
                <i className={`bi ${isLoading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'} me-2`}></i>Refresh
              </button>
              <button onClick={exportOrdersCSV} className="btn btn-light rounded-pill px-4" disabled={filteredOrders.length === 0}>
                <i className="bi bi-download me-2"></i>Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 mt-n5 position-relative" style={{ marginTop: '-3rem', zIndex: 2 }}>
        {/* Stats Row */}
        <div className="row g-4 mb-5">
          {[
            { title: 'Total Orders', value: stats.totalOrders, icon: 'bi-bag', color: 'primary', sub: `+${todaysStats.newOrders} today` },
            { title: 'Pending', value: stats.pendingOrders, icon: 'bi-clock-history', color: 'warning', sub: 'Requires attention' },
            { title: 'Completed', value: stats.completedOrders, icon: 'bi-check2-circle', color: 'success', sub: 'Delivered' },
            { title: 'Revenue', value: formatLKR(stats.totalRevenue), icon: 'bi-currency-rupee', color: 'strawberry', sub: `+${formatLKR(todaysStats.revenueToday)} today` }
          ].map((item, idx) => (
            <div className="col-xl-3 col-md-6" key={idx}>
              <div className="glass-panel p-4 h-100 position-relative overflow-hidden">
                <div className={`position-absolute top-0 end-0 p-3 opacity-10 text-${item.color}`}>
                  <i className={`bi ${item.icon} display-1`}></i>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`rounded-circle p-2 bg-${item.color} bg-opacity-10 text-${item.color}`}>
                    <i className={`bi ${item.icon} fs-4`}></i>
                  </div>
                </div>
                <h3 className="display-6 fw-bold text-chocolate mb-1">{item.value}</h3>
                <p className="text-secondary mb-0 small text-uppercase fw-bold">{item.title}</p>
                <small className={`text-${item.color === 'warning' ? 'warning' : 'success'}`}>{item.sub}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Summary */}
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
                  <h3 className="display-6 fw-bold text-strawberry">{formatLargeLKR(monthlyStats.revenue)}</h3>
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
              <input
                type="text"
                className="form-control rounded-pill border-0 bg-white"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '250px' }}
              />
              <select
                className="form-select rounded-pill border-0 bg-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt === 'all' ? 'All Status' : opt}</option>
                ))}
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
                  <tr key={order.orderId} style={{ background: 'transparent' }}>
                    <td className="fw-bold text-chocolate">#{order.orderId}</td>
                    <td>
                      <div className="fw-bold text-dark">{order.customerName}</div>
                      <div className="small text-secondary">{order.email}</div>
                    </td>
                    <td className="fw-bold text-strawberry">{formatLKR(order.totalPrice)}</td>
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
                              <button
                                className={`dropdown-item ${order.status === status ? 'active' : ''}`}
                                onClick={() => updateOrderStatus(order.orderId, status)}
                              >
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