// src/pages/CartPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatLKR } from '../config/currency';

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getSubtotal,
    cartCount 
  } = useCart();

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login-selection', { state: { from: '/cart' } });
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Save cart items to localStorage for order page
    localStorage.setItem('checkoutItems', JSON.stringify(cartItems));
    navigate('/order');
  };

  const handleContinueShopping = () => {
    navigate('/gallery');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center py-5">
          <div className="glass-panel p-5" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
            <h3 className="text-chocolate mb-3">Your Cart is Empty</h3>
            <p className="text-secondary mb-4">
              Looks like you haven't added any cakes to your cart yet.
              Browse our gallery and find your perfect cake!
            </p>
            <button
              onClick={handleContinueShopping}
              className="btn-primary-gradient px-5 py-3"
            >
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Browse Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-chocolate">
          <i className="bi bi-cart me-3"></i>
          Your Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h2>
        <button
          onClick={clearCart}
          className="btn btn-outline-danger rounded-pill px-4"
        >
          <i className="bi bi-trash me-2"></i>
          Clear Cart
        </button>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-lg-8 mb-4">
          {cartItems.map((item, index) => {
            const itemId = item.id || item.designId || item.orderId || index;
            const itemPrice = item.priceLKR || item.totalPrice || 0;
            const itemName = item.name || item.customerName || 'Custom Cake';
            const itemImage = item.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop';
            
            return (
              <div key={itemId} className="glass-panel p-4 mb-3 hover-antigravity">
                <div className="row align-items-center">
                  <div className="col-md-2 mb-3 mb-md-0">
                    <img
                      src={itemImage}
                      alt={itemName}
                      className="rounded-3"
                      style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3 mb-md-0">
                    <h5 className="fw-bold text-chocolate mb-2">{itemName}</h5>
                    {item.base && (
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-cream text-chocolate">
                          {item.base} • {item.frosting}
                        </span>
                        {item.size && (
                          <span className="badge bg-cream text-chocolate">
                            {item.size}
                          </span>
                        )}
                      </div>
                    )}
                    {item.toppings && item.toppings.length > 0 && (
                      <small className="text-muted d-block mt-2">
                        <i className="bi bi-stars me-1"></i>
                        {item.toppings.length} toppings
                      </small>
                    )}
                  </div>
                  
                  <div className="col-md-2 mb-3 mb-md-0">
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) - 1)}
                        disabled={item.quantity <= 1}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <span className="mx-3 fw-bold">{item.quantity || 1}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={() => updateQuantity(itemId, (item.quantity || 1) + 1)}
                        style={{ width: '32px', height: '32px' }}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-md-2 mb-3 mb-md-0">
                    <div className="fw-bold text-gradient fs-5">
                      {formatLKR(itemPrice * (item.quantity || 1))}
                    </div>
                  </div>
                  
                  <div className="col-md-2 text-end">
                    <button
                      className="btn btn-link text-danger"
                      onClick={() => removeFromCart(itemId)}
                    >
                      <i className="bi bi-trash fs-5"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '100px' }}>
            <h4 className="text-chocolate mb-4">Order Summary</h4>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold">{formatLKR(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery Fee</span>
                <span className="fw-bold">{deliveryFee > 0 ? formatLKR(deliveryFee) : 'Free'}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="h5 fw-bold">Total</span>
                <span className="h5 fw-bold text-gradient">{formatLKR(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary-gradient w-100 py-3 mb-3"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Proceed to Checkout
            </button>

            <button
              onClick={handleContinueShopping}
              className="btn-glass w-100 py-3"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </button>

            {/* Cart Stats */}
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Items in cart</span>
                <span className="fw-bold">{cartCount}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Average item price</span>
                <span className="fw-bold">
                  {cartCount > 0 ? formatLKR(subtotal / cartCount) : formatLKR(0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
