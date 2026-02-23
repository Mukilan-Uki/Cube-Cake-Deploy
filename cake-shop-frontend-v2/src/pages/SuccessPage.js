import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { formatLKR } from '../config/currency';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order || JSON.parse(localStorage.getItem('currentOrder'));

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (order) {
      const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orders.unshift(order);
      localStorage.setItem('orderHistory', JSON.stringify(orders));
    }
  }, []);

  if (!order) {
    return (
      <div className="container text-center py-5">
        <h2>No Order Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-frosting mt-3">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center">
      <div className="glass-card p-5 max-w-2xl mx-auto">
        <div className="display-1 mb-3">🎉</div>
        <h1 className="display-5 font-script gradient-text mb-3">
          Order Confirmed!
        </h1>
        
        <div className="alert alert-success fs-4 mb-4">
          <i className="bi bi-check-circle me-2"></i>
          Thank you for your order!
        </div>

        <div className="glass-card p-4 mb-4 text-start">
          <h4 className="mb-3">Order Details</h4>
          <p><strong>Order ID:</strong> {order.orderId || 'ORD-' + Date.now()}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Total Amount:</strong> {formatLKR(order.totalPrice || 0)}</p>
          <p><strong>Status:</strong> <span className="badge bg-warning">Preparing</span></p>
          <p><strong>Estimated Ready:</strong> 2-3 hours</p>
        </div>

        <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-frosting"
          >
            <i className="bi bi-house me-2"></i>
            Back to Home
          </button>
          
          <button 
            onClick={() => window.print()}
            className="btn btn-outline-apricot"
          >
            <i className="bi bi-printer me-2"></i>
            Print Receipt
          </button>
          
          <button 
            onClick={() => navigate('/gallery')}
            className="btn btn-outline-strawberry"
          >
            <i className="bi bi-cake me-2"></i>
            Order Another Cake
          </button>
        </div>

        <div className="mt-5 text-muted">
          <p className="mb-1">
            <i className="bi bi-envelope me-2"></i>
            Order confirmation sent to {order.email}
          </p>
          <p>
            <i className="bi bi-telephone me-2"></i>
            We'll contact you at {order.phone} if needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;