import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatLKR, formatLargeLKR } from '../utils/helpers';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
      } else {
        console.error('Failed to fetch stats:', statsResult.message);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to load data. Please check if backend is running.');
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
        
        alert(`✅ Order ${orderId} status updated to ${newStatus}`);
      } else {
        alert(`❌ Failed to update order: ${result.message}`);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('❌ Error updating order. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
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
    const todaysOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    );
    
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
      averageOrderValue: monthlyOrders.length > 0 
        ? monthlyOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0) / monthlyOrders.length 
        : 0
    };
  };

  const monthlyStats = calculateMonthlyStats();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = () => {
    fetchAdminData();
  };

  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Total (LKR)', 'Status', 'Delivery Date', 'Order Date'];
    const csvData = filteredOrders.map(order => [
      order.orderId,
      order.customerName,
      order.email,
      order.phone,
      order.totalPrice,
      order.status,
      formatDate(order.deliveryDate),
      formatDate(order.createdAt)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5">
          <i className="bi bi-shield-lock fs-1 text-danger mb-3"></i>
          <h2 className="text-danger">Access Denied</h2>
          <p className="text-muted mb-4">You do not have administrator privileges.</p>
          <button 
            className="btn btn-frosting mt-3"
            onClick={() => navigate('/')}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="py-4" style={{
        background: 'linear-gradient(135deg, #4A2C2A 0%, #2C1810 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-5 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                <i className="bi bi-speedometer2 me-3"></i>
                Admin Dashboard
              </h1>
              <p className="mb-0 opacity-75">
                <i className="bi bi-shop me-2"></i>
                Cube Cake Studio • {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="d-flex gap-3">
              <button 
                onClick={handleRefresh}
                className="btn btn-outline-light rounded-pill px-4"
                disabled={isLoading}
              >
                <i className={`bi ${isLoading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'} me-2`}></i>
                Refresh
              </button>
              <button 
                onClick={exportOrdersCSV}
                className="btn btn-light rounded-pill px-4"
                disabled={filteredOrders.length === 0}
              >
                <i className="bi bi-download me-2"></i>
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-4 mb-5">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span className="badge bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                      <i className="bi bi-bag fs-5"></i>
                    </span>
                  </div>
                  <span className="text-success small">
                    <i className="bi bi-arrow-up me-1"></i>
                    +{todaysStats.newOrders} today
                  </span>
                </div>
                <h3 className="display-6 fw-bold mb-2">{stats.totalOrders}</h3>
                <p className="text-muted mb-0">Total Orders</p>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-warning bg-opacity-10 text-warning p-2 rounded-3">
                    <i className="bi bi-clock-history fs-5"></i>
                  </span>
                </div>
                <h3 className="display-6 fw-bold mb-2">{stats.pendingOrders}</h3>
                <p className="text-muted mb-0">Pending Orders</p>
                <small className="text-warning">Requires attention</small>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-success bg-opacity-10 text-success p-2 rounded-3">
                    <i className="bi bi-check2-circle fs-5"></i>
                  </span>
                </div>
                <h3 className="display-6 fw-bold mb-2">{stats.completedOrders}</h3>
                <p className="text-muted mb-0">Completed</p>
                <small className="text-success">Delivered</small>
              </div>
            </div>
          </div>
          
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge bg-strawberry bg-opacity-10 text-strawberry p-2 rounded-3">
                    <i className="bi bi-currency-rupee fs-5"></i>
                  </span>
                </div>
                <h3 className="display-6 fw-bold mb-2">{formatLKR(stats.totalRevenue)}</h3>
                <p className="text-muted mb-0">Total Revenue</p>
                <small className="text-success">
                  +{formatLKR(todaysStats.revenueToday)} today
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-graph-up me-2 text-apricot"></i>
                  Monthly Performance
                </h5>
                <div className="row">
                  <div className="col-4">
                    <div className="text-center">
                      <div className="fs-1 fw-bold text-apricot">{monthlyStats.total}</div>
                      <small className="text-muted">Orders</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <div className="fs-1 fw-bold text-strawberry">{formatLargeLKR(monthlyStats.revenue)}</div>
                      <small className="text-muted">Revenue</small>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="text-center">
                      <div className="fs-1 fw-bold text-lavender">{formatLargeLKR(monthlyStats.averageOrderValue)}</div>
                      <small className="text-muted">Avg. Order</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-lightning-charge me-2 text-warning"></i>
                  Today's Summary
                </h5>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">New Orders</span>
                  <span className="fw-bold">{todaysStats.newOrders}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Cakes to Prepare</span>
                  <span className="fw-bold text-warning">{todaysStats.cakesToPrepare}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Today's Revenue</span>
                  <span className="fw-bold text-success">{formatLKR(todaysStats.revenueToday)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <div className="row g-3">
              <div className="col-md-5">
                <div className="input-group">
                  <span className="input-group-text bg-light border-0">
                    <i className="bi bi-search text-muted"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Search by order ID, customer, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      className="btn btn-outline-secondary border-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="col-md-3">
                <select
                  className="form-select border-0 bg-light"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-2">
                <select
                  className="form-select border-0 bg-light"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              
              <div className="col-md-2">
                <button 
                  className="btn w-100 rounded-pill"
                  style={{
                    background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                    border: 'none',
                    color: 'white'
                  }}
                  onClick={() => {/* Add order modal */}}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  New Order
                </button>
              </div>
            </div>
            
            {(searchTerm || statusFilter !== 'all' || dateRange !== 'all') && (
              <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                <span className="text-muted small">Active filters:</span>
                {searchTerm && (
                  <span className="badge bg-light text-dark d-flex align-items-center gap-1 p-2">
                    Search: "{searchTerm}"
                    <button 
                      className="btn-close btn-close-dark btn-sm ms-1"
                      onClick={() => setSearchTerm('')}
                      style={{ fontSize: '0.5rem' }}
                    ></button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="badge bg-light text-dark d-flex align-items-center gap-1 p-2">
                    Status: {statusFilter}
                    <button 
                      className="btn-close btn-close-dark btn-sm ms-1"
                      onClick={() => setStatusFilter('all')}
                      style={{ fontSize: '0.5rem' }}
                    ></button>
                  </span>
                )}
                <span className="badge bg-light text-dark p-2">
                  {filteredOrders.length} orders found
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">
                <i className="bi bi-box-seam me-2 text-apricot"></i>
                Order Management
              </h4>
              
              <div className="d-flex align-items-center gap-3">
                <small className="text-muted">
                  Showing {filteredOrders.length} of {orders.length} orders
                </small>
                <span className="badge bg-apricot bg-opacity-10 text-apricot p-2">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-strawberry" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading orders from database...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-5">
                <div className="display-1 text-muted mb-3">
                  <i className="bi bi-inbox"></i>
                </div>
                <h4 className="text-chocolate mb-2">No Orders Found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No orders have been placed yet.'}
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button 
                    className="btn btn-outline-apricot rounded-pill px-4"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateRange('all');
                    }}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 rounded-start">Order ID</th>
                      <th className="border-0">Customer</th>
                      <th className="border-0">Cake Details</th>
                      <th className="border-0">Total (LKR)</th>
                      <th className="border-0">Status</th>
                      <th className="border-0">Delivery</th>
                      <th className="border-0 rounded-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.orderId || order._id}>
                        <td>
                          <div className="fw-bold text-primary">#{order.orderId}</div>
                          <small className="text-muted">{formatDate(order.createdAt)}</small>
                        </td>
                        <td>
                          <div className="fw-medium">{order.customerName}</div>
                          <small className="text-muted d-block">{order.email}</small>
                          <small className="text-muted">{order.phone}</small>
                        </td>
                        <td>
                          <div>
                            <span className="badge bg-light text-dark me-1">
                              {order.base || 'Custom'}
                            </span>
                            <span className="badge bg-light text-dark">
                              {order.size || 'Medium'}
                            </span>
                            {order.layers && (
                              <div className="small text-muted mt-1">
                                {order.layers} layers • {order.toppings?.length || 0} toppings
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold fs-5" style={{ color: '#FF6B8B' }}>
                            {formatLKR(order.totalPrice || 0)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${statusColors[order.status] || 'secondary'} px-3 py-2`}>
                            {order.status}
                          </span>
                          {order.status === 'Pending' && (
                            <small className="d-block text-warning mt-1">
                              <i className="bi bi-exclamation-circle me-1"></i>
                              Action needed
                            </small>
                          )}
                        </td>
                        <td>
                          <div>{formatDate(order.deliveryDate)}</div>
                          <span className={`badge ${order.deliveryType === 'delivery' ? 'bg-info' : 'bg-secondary'} mt-1`}>
                            <i className={`bi ${order.deliveryType === 'delivery' ? 'bi-truck' : 'bi-shop'} me-1`}></i>
                            {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-sm btn-outline-primary rounded-circle"
                              onClick={() => {
                                alert(`Order Details:\n\nID: ${order.orderId}\nCustomer: ${order.customerName}\nStatus: ${order.status}\nTotal: ${formatLKR(order.totalPrice)}`);
                              }}
                              title="View Details"
                              style={{ width: '35px', height: '35px' }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            
                            <div className="dropdown">
                              <button 
                                className="btn btn-sm btn-outline-warning rounded-circle"
                                type="button"
                                data-bs-toggle="dropdown"
                                title="Change Status"
                                style={{ width: '35px', height: '35px' }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 p-2">
                                {Object.keys(statusColors).map(status => (
                                  <li key={status}>
                                    <button 
                                      className={`dropdown-item rounded-2 ${order.status === status ? 'active' : ''}`}
                                      onClick={() => updateOrderStatus(order.orderId, status)}
                                      disabled={order.status === status}
                                    >
                                      {order.status === status && (
                                        <i className="bi bi-check-circle me-2 text-success"></i>
                                      )}
                                      {status}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <button 
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              onClick={() => window.open(`mailto:${order.email}?subject=Order%20${order.orderId}%20-%20Cube%20Cake`)}
                              title="Send Email"
                              style={{ width: '35px', height: '35px' }}
                            >
                              <i className="bi bi-envelope"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-printer me-2 text-apricot"></i>
                  Reports
                </h5>
                <p className="text-muted small mb-3">Generate daily sales and order reports</p>
                <button className="btn btn-outline-apricot w-100 rounded-pill">
                  <i className="bi bi-file-pdf me-2"></i>
                  Download Report
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-envelope me-2 text-strawberry"></i>
                  Notifications
                </h5>
                <p className="text-muted small mb-3">Send updates to customers</p>
                <button className="btn btn-outline-strawberry w-100 rounded-pill">
                  <i className="bi bi-megaphone me-2"></i>
                  Broadcast Message
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-gear me-2 text-lavender"></i>
                  Settings
                </h5>
                <p className="text-muted small mb-3">Configure store preferences</p>
                <button className="btn btn-outline-lavender w-100 rounded-pill">
                  <i className="bi bi-sliders2 me-2"></i>
                  Open Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 1s linear infinite;
          }
          .bg-strawberry {
            background-color: #FF6B8B !important;
          }
          .bg-strawberry-bg-opacity-10 {
            background-color: rgba(255, 107, 139, 0.1) !important;
          }
          .text-strawberry {
            color: #FF6B8B !important;
          }
        `
      }} />
    </div>
  );
};

export default AdminPage;