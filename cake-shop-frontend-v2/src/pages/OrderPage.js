import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import RequireAuth from '../components/RequireAuth';
import { formatLKR } from '../config/currency';

const OrderPageContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const design = location.state?.design || JSON.parse(localStorage.getItem('cakeDesign') || '{}');

  const [orderDetails, setOrderDetails] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    deliveryDate: '',
    deliveryAddress: '',
    deliveryType: 'pickup',
    specialInstructions: '',
    paymentMethod: 'cash'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
     // Redirect to login if not authenticated
  if (!user) {
    navigate('/login-selection', { 
      state: { from: '/order' },
      replace: true 
    });
  }
  
    if (user) {
      setOrderDetails(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const validateForm = () => {
    const errors = [];
    
    if (!orderDetails.customerName.trim()) errors.push('Name is required');
    if (!orderDetails.phone.trim()) errors.push('Phone is required');
    if (!orderDetails.email.trim()) errors.push('Email is required');
    if (!orderDetails.deliveryDate) errors.push('Delivery date is required');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (orderDetails.email && !emailRegex.test(orderDetails.email)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  };

  const calculateTotalPrice = () => {
    const basePriceLKR = 11997.00;
    const customizationPriceLKR = (design.layers || 2) * 1500 + (design.toppings?.length || 0) * 600;
    const deliveryPriceLKR = orderDetails.deliveryType === 'delivery' ? 1500.00 : 0;
    
    return basePriceLKR + customizationPriceLKR + deliveryPriceLKR;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert(`Please fix:\n${errors.join('\n')}`);
      return;
    }
    
    setIsSubmitting(true);
    
    const formattedDate = new Date(orderDetails.deliveryDate).toISOString();
    const totalPriceLKR = calculateTotalPrice();
    
    const orderData = {
      ...design,
      ...orderDetails,
      deliveryDate: formattedDate,
      status: 'Pending',
      totalPrice: totalPriceLKR,
      currency: 'LKR'
    };

    try {
      const result = await apiService.createOrder(orderData);
      
      if (result.success) {
        localStorage.removeItem('cakeDesign');
        localStorage.setItem('currentOrder', JSON.stringify(result.order));
        navigate('/success', { state: { order: result.order } });
      } else {
        alert('Failed to create order: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-transparent border-0 pt-4 px-4">
              <h4 className="mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                <i className="bi bi-bag-heart me-2 text-strawberry"></i>
                Order Summary
              </h4>
            </div>
            
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="rounded-4 bg-cream p-4">
                    <i className="bi bi-cake3 fs-1" style={{ color: '#FF9E6D' }}></i>
                  </div>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-strawberry">
                    {design.layers || 2} Layers
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-3">Your Creation</h6>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-light text-dark p-2">
                    <i className="bi bi-cake me-1"></i>
                    {design.base || 'Chocolate'}
                  </span>
                  <span className="badge bg-light text-dark p-2">
                    <i className="bi bi-droplet me-1"></i>
                    {design.frosting || 'Vanilla'}
                  </span>
                  <span className="badge bg-light text-dark p-2">
                    <i className="bi bi-arrows-angle-expand me-1"></i>
                    {design.size || 'Medium'}
                  </span>
                  <span className="badge bg-light text-dark p-2">
                    <i className="bi bi-stars me-1"></i>
                    {design.toppings?.length || 0} Toppings
                  </span>
                </div>
              </div>

              <div className="border-top pt-4">
                <h6 className="fw-bold mb-3">Price Details (LKR)</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Cake Base</span>
                  <span className="fw-medium">{formatLKR(11997.00)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Customizations</span>
                  <span className="fw-medium">{formatLKR(4500.00)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery</span>
                  <span className="fw-medium">{orderDetails.deliveryType === 'delivery' ? formatLKR(1500.00) : 'FREE'}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
                  <span>Total</span>
                  <span style={{ color: '#FF6B8B' }}>{formatLKR(calculateTotalPrice())}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="orderForm"
                className="btn w-100 mt-4 py-3 rounded-pill"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                  border: 'none',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Confirm & Pay ({formatLKR(calculateTotalPrice())})
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <form id="orderForm" onSubmit={handleSubmit}>
            <div className="glass-card p-4 mb-4">
              <h5 className="text-chocolate mb-4">Contact Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={orderDetails.customerName}
                    onChange={(e) => setOrderDetails({...orderDetails, customerName: e.target.value})}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={orderDetails.phone}
                    onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    value={orderDetails.email}
                    onChange={(e) => setOrderDetails({...orderDetails, email: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="glass-card p-4 mb-4">
              <h5 className="text-chocolate mb-4">Delivery Options</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Delivery Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={orderDetails.deliveryDate}
                    onChange={(e) => setOrderDetails({...orderDetails, deliveryDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Delivery Type *</label>
                  <select
                    className="form-select"
                    value={orderDetails.deliveryType}
                    onChange={(e) => setOrderDetails({...orderDetails, deliveryType: e.target.value})}
                  >
                    <option value="pickup">Pickup from Shop (Free)</option>
                    <option value="delivery">Home Delivery (+₨ 1,500.00)</option>
                  </select>
                </div>
                {orderDetails.deliveryType === 'delivery' && (
                  <div className="col-12">
                    <label className="form-label">Delivery Address *</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={orderDetails.deliveryAddress}
                      onChange={(e) => setOrderDetails({...orderDetails, deliveryAddress: e.target.value})}
                      required
                    ></textarea>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-4 mb-4">
              <h5 className="text-chocolate mb-4">Special Instructions</h5>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Any special requests? Allergies, dietary restrictions, or custom message for the cake..."
                value={orderDetails.specialInstructions}
                onChange={(e) => setOrderDetails({...orderDetails, specialInstructions: e.target.value})}
              ></textarea>
            </div>

            <div className="glass-card p-4 mb-4">
              <h5 className="text-chocolate mb-4">Payment Method</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cash"
                      value="cash"
                      checked={orderDetails.paymentMethod === 'cash'}
                      onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                    />
                    <label className="form-check-label" htmlFor="cash">
                      <i className="bi bi-cash me-2"></i>
                      Cash on Delivery/Pickup
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={orderDetails.paymentMethod === 'card'}
                      onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                    />
                    <label className="form-check-label" htmlFor="card">
                      <i className="bi bi-credit-card me-2"></i>
                      Credit/Debit Card
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const OrderPage = () => (
  <RequireAuth>
    <OrderPageContent />
  </RequireAuth>
);

export default OrderPage;