// src/components/CakeCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatLKR } from '../config/currency';

const CakeCard = ({ cake }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const price = cake.priceLKR;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      ...cake,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    
    // Show success message
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 m-3 p-3 bg-success text-white rounded-3 shadow';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <i class="bi bi-check-circle me-2"></i>
      ${cake.name} added to cart!
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (cake.isCustomDesign && cake.designData) {
      // Custom designed cake — pass the original design data so order page shows custom details
      navigate('/order', { state: { design: cake.designData } });
    } else {
      // Gallery/shop cake — pass full cake object including shopId from the shop field
      // The shop field may be a populated object or a plain id string
      const shopId = cake.shop?._id || cake.shop || cake.shopId || null;
      navigate('/order', { state: { galleryCake: { ...cake, shopId } } });
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div 
        className="col-md-6 col-lg-4 mb-4 d-flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`glass-panel overflow-hidden border-0 h-100 w-100 ${isHovered ? 'hover-antigravity' : ''}`}
             style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
             onClick={() => navigate(`/cake/${cake.id}`)}>
          
          <div className="position-relative overflow-hidden" style={{ height: '250px' }}>
            <img 
              src={cake.image} 
              className="w-100 h-100"
              alt={cake.name}
              style={{ 
                objectFit: 'cover',
                transition: 'transform 0.6s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            />
            
            {/* Badges */}
            <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
              {cake.isNew && (
                <span className="badge bg-primary-gradient px-3 py-2">
                  <i className="bi bi-star-fill me-1"></i>NEW
                </span>
              )}
              {cake.isPopular && (
                <span className="badge bg-secondary-gradient px-3 py-2">
                  <i className="bi bi-fire me-1"></i>HOT
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="position-absolute top-0 start-0 p-3">
              <span className="badge bg-white text-dark shadow-sm px-3 py-2">
                <i className="bi bi-star-fill text-warning me-1"></i>
                {cake.rating}
              </span>
            </div>
            
            {/* Hover Overlay with Actions */}
            <div className={`position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center gap-2
                            ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                 style={{ 
                   background: 'linear-gradient(135deg, rgba(255,107,139,0.9), rgba(157,92,255,0.9))',
                   transition: 'opacity 0.3s ease'
                 }}>
              <button 
                className="btn btn-light rounded-circle p-3 magnetic-hover"
                onClick={handleQuickView}
                title="Quick View"
              >
                <i className="bi bi-eye"></i>
              </button>
              <button 
                className="btn btn-light rounded-circle p-3 magnetic-hover"
                onClick={handleAddToCart}
                title="Add to Cart"
              >
                <i className="bi bi-cart-plus"></i>
              </button>
              <button 
                className="btn btn-light rounded-circle p-3 magnetic-hover"
                onClick={handleBuyNow}
                title="Buy Now"
              >
                <i className="bi bi-lightning-charge"></i>
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="card-title fw-bold text-chocolate mb-0">{cake.name}</h5>
            </div>
            
            <p className="text-muted small mb-3" style={{ minHeight: '40px' }}>
              {cake.description.length > 60 ? cake.description.substring(0, 60) + '...' : cake.description}
            </p>
            
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="badge bg-cream text-chocolate">
                <i className="bi bi-tag me-1"></i>
                {cake.category}
              </span>
              {cake.flavors && (
                <span className="badge bg-cream text-chocolate">
                  <i className="bi bi-droplet me-1"></i>
                  {cake.flavors[0]}
                </span>
              )}
            </div>

            {/* Shop Info */}
            {cake.shopName && (
              <div className="d-flex align-items-center gap-1 mb-3 p-2 rounded-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <i className="bi bi-shop text-gold" style={{ fontSize: '0.85rem' }}></i>
                <div>
                  <span className="fw-semibold text-chocolate" style={{ fontSize: '0.8rem' }}>{cake.shopName}</span>
                  {cake.shopLocation && (
                    <span className="text-muted ms-1" style={{ fontSize: '0.75rem' }}>
                      <i className="bi bi-geo-alt me-1"></i>{cake.shopLocation}
                    </span>
                  )}
                </div>
              </div>
            )}
            
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold fs-4 text-gradient">{formatLKR(price)}</span>
                <small className="text-muted ms-2">LKR</small>
              </div>
              
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-gradient btn-sm px-3 py-2"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-1"></i>
                  Cart
                </button>
                <button 
                  className="btn-primary-gradient btn-sm px-4 py-2"
                  onClick={handleBuyNow}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowQuickView(false)}>
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-content glass-panel border-0">
              <div className="modal-header border-0">
                <h5 className="modal-title text-chocolate">{cake.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowQuickView(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img src={cake.image} alt={cake.name} className="img-fluid rounded-3" />
                  </div>
                  <div className="col-md-6">
                    <p className="text-secondary">{cake.description}</p>
                    
                    <div className="mb-3">
                      <strong>Category:</strong> {cake.category}
                    </div>
                    
                    <div className="mb-3">
                      <strong>Flavors:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {cake.flavors?.map(flavor => (
                          <span key={flavor} className="badge bg-cream text-chocolate px-3 py-2">
                            {flavor}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <strong>Sizes:</strong>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {cake.sizes?.map(size => (
                          <span key={size} className="badge bg-cream text-chocolate px-3 py-2">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between align-items-center mt-4">
                      <span className="h3 text-gradient mb-0">{formatLKR(price)} LKR</span>
                      <button 
                        className="btn-primary-gradient px-4 py-2"
                        onClick={() => {
                          addToCart(cake);
                          setShowQuickView(false);
                        }}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CakeCard;