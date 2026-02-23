import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import { formatLKR } from '../config/currency';

const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-selection');
      return;
    }

    fetchMyOrders();
  }, [isAuthenticated, navigate]);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await apiService.getMyOrders();
      
      if (result.success) {
        setOrders(result.orders || []);
      } else {
        setError(result.message || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Network error. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => 
      order.status.toLowerCase() === filter.toLowerCase()
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'warning',
      'Preparing': 'info',
      'Ready': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger'
    };
    
    return (
      <span className={`badge bg-${statusColors[status] || 'secondary'} px-3 py-2`}>
        {status}
      </span>
    );
  };

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

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="py-5">
          <div className="spinner-border text-apricot" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-chocolate">Loading your orders...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="font-script display-4 gradient-text">My Orders</h1>
        <p className="lead text-chocolate">
          Track and manage your cake orders
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchMyOrders}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Retry
          </button>
        </div>
      )}

      <div className="glass-card p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="mb-0 text-chocolate">
              <i className="bi bi-box-seam me-2"></i>
              Order History
            </h5>
            <small className="text-muted">
              {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
            </small>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map((filterType) => (
                <button
                  key={filterType}
                  className={`btn btn-sm ${filter === filterType ? 'btn-apricot' : 'btn-outline-apricot'}`}
                  onClick={() => setFilter(filterType)}
                >
                  {filterType === 'all' ? 'All Orders' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!loading && orders.length === 0 ? (
        <div className="text-center py-5">
          <div className="glass-card p-5">
            <div className="display-1 text-muted mb-3">
              <i className="bi bi-inbox"></i>
            </div>
            <h3 className="text-chocolate mb-3">No Orders Found</h3>
            <p className="text-muted mb-4">
              You haven't placed any orders yet. Start designing your first cake!
            </p>
            <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
              <button 
                className="btn btn-frosting px-4 py-2"
                onClick={() => navigate('/create')}
              >
                <i className="bi bi-palette me-2"></i>
                Design Your First Cake
              </button>
              <button 
                className="btn btn-outline-apricot px-4 py-2"
                onClick={() => navigate('/gallery')}
              >
                <i className="bi bi-grid-3x3-gap me-2"></i>
                Browse Gallery
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <div className="glass-card p-5 text-center">
              <i className="bi bi-filter-circle fs-1 text-muted mb-3"></i>
              <h5 className="text-chocolate mb-2">No {filter !== 'all' ? filter : ''} orders found</h5>
              <p className="text-muted mb-3">Try changing your filter selection</p>
              <button 
                className="btn btn-outline-apricot"
                onClick={() => setFilter('all')}
              >
                <i className="bi bi-funnel me-2"></i>
                Show All Orders
              </button>
            </div>
          ) : (
            <div className="row">
              {filteredOrders.map((order) => (
                <div key={order.orderId || order._id} className="col-12 mb-4">
                  <div className="glass-card p-4 hover-lift">
                    <div className="row align-items-center">
                      <div className="col-md-4 mb-3 mb-md-0">
                        <div className="d-flex align-items-center gap-3">
                          <div className="rounded-circle bg-cream p-3">
                            <i className="bi bi-cake2 fs-4" style={{ color: '#FF6B8B' }}></i>
                          </div>
                          <div>
                            <h5 className="fw-bold text-chocolate mb-1">#{order.orderId}</h5>
                            <div className="d-flex align-items-center gap-2">
                              <small className="text-muted">
                                <i className="bi bi-calendar3 me-1"></i>
                                {formatDate(order.createdAt)}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="mb-2">
                          <span className="text-muted small">Delivery Date</span>
                          <p className="mb-0 fw-medium">
                            <i className="bi bi-truck me-1"></i>
                            {formatDate(order.deliveryDate)}
                          </p>
                        </div>
                        <div>
                          <span className={`badge ${order.deliveryType === 'delivery' ? 'bg-info' : 'bg-secondary'}`}>
                            <i className={`bi ${order.deliveryType === 'delivery' ? 'bi-truck' : 'bi-shop'} me-1`}></i>
                            {order.deliveryType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-3 mb-3 mb-md-0">
                        <div className="mb-2">
                          <span className="text-muted small">Cake Details</span>
                          <p className="mb-0 fw-medium">
                            {order.base || 'Custom'} • {order.size || 'Medium'} • {order.layers || 2} Layers
                          </p>
                        </div>
                        {order.toppings && order.toppings.length > 0 && (
                          <small className="text-muted">
                            <i className="bi bi-stars me-1"></i>
                            {order.toppings.length} Toppings
                          </small>
                        )}
                      </div>

                      <div className="col-md-2">
                        <div className="d-flex flex-column align-items-md-end">
                          <div className="mb-2">
                            {getStatusBadge(order.status)}
                          </div>
                          <div className="fs-4 fw-bold" style={{ color: '#FF6B8B' }}>
                            {formatLKR(order.totalPrice || 0)}
                          </div>
                          <small className="text-muted">LKR</small>
                        </div>
                      </div>
                    </div>

                    {/* Order Footer with Actions */}
                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        {order.status === 'Ready' && (
                          <span className="text-success small">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Ready for pickup/delivery
                          </span>
                        )}
                        {order.status === 'Preparing' && (
                          <span className="text-info small">
                            <i className="bi bi-gear-fill me-1 spin"></i>
                            Your cake is being prepared
                          </span>
                        )}
                        {order.status === 'Pending' && (
                          <span className="text-warning small">
                            <i className="bi bi-clock-fill me-1"></i>
                            Awaiting confirmation
                          </span>
                        )}
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-sm btn-outline-apricot rounded-pill px-3"
                          onClick={() => {
                            alert(`Order Details:
                            
Order ID: ${order.orderId}
Date: ${formatDate(order.createdAt)}
Status: ${order.status}
Total: ${formatLKR(order.totalPrice)}
Delivery: ${order.deliveryType === 'delivery' ? order.deliveryAddress || 'Home Delivery' : 'Store Pickup'}
Payment: ${order.paymentMethod || 'Cash'}`);
                          }}
                        >
                          <i className="bi bi-eye me-1"></i>
                          View Details
                        </button>
                        
                        {order.status === 'Completed' && (
                          <button 
                            className="btn btn-sm btn-outline-success rounded-pill px-3"
                            onClick={() => {
                              alert('Thank you for your order! We hope you enjoyed your cake. 🎂');
                            }}
                          >
                            <i className="bi bi-star me-1"></i>
                            Review
                          </button>
                        )}
                        
                        {order.status === 'Pending' && (
                          <button 
                            className="btn btn-sm btn-outline-danger rounded-pill px-3"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this order?')) {
                                alert('Order cancellation requested. Our team will contact you shortly.');
                              }
                            }}
                          >
                            <i className="bi bi-x-circle me-1"></i>
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary Stats */}
          {orders.length > 0 && (
            <div className="glass-card p-4 mt-4">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <div className="text-center">
                    <div className="small text-muted">Total Orders</div>
                    <div className="fs-3 fw-bold text-chocolate">{orders.length}</div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="text-center">
                    <div className="small text-muted">Total Spent</div>
                    <div className="fs-3 fw-bold text-apricot">
                      {formatLKR(orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0))}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="text-center">
                    <div className="small text-muted">Completed</div>
                    <div className="fs-3 fw-bold text-success">
                      {orders.filter(o => o.status === 'Completed').length}
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="text-center">
                    <div className="small text-muted">Pending</div>
                    <div className="fs-3 fw-bold text-warning">
                      {orders.filter(o => ['Pending', 'Preparing', 'Ready'].includes(o.status)).length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin {
            animation: spin 2s linear infinite;
          }
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
        `
      }} />
    </div>
  );
};

export default MyOrdersPage;