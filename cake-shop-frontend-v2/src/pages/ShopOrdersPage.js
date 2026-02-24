import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const ShopOrdersPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'shop_owner') {
      navigate('/');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/shops/orders?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
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
        fetchOrders();
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
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (filter !== 'all' && order.status !== filter) return false;
    if (searchTerm) {
      return order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             order.customerPhone.includes(searchTerm);
    }
    return true;
  });

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
                  <i className="bi bi-box me-2"></i>
                  Order Management
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

      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by order ID, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All Orders
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'confirmed' ? 'btn-info' : 'btn-outline-info'}`}
                  onClick={() => setFilter('confirmed')}
                >
                  Confirmed
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'preparing' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('preparing')}
                >
                  Preparing
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'ready' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('ready')}
                >
                  Ready
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6>Order Summary</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Orders:</span>
                <strong>{orders.length}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Pending:</span>
                <strong className="text-warning">{orders.filter(o => o.status === 'pending').length}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Processing:</span>
                <strong className="text-primary">{orders.filter(o => ['confirmed', 'preparing'].includes(o.status)).length}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
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
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map(order => (
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
                            <strong className="text-primary">{formatLKR(order.totalPrice)}</strong>
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
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOrdersPage;