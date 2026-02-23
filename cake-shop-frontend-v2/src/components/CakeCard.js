import React, { useState } from 'react';
import { formatLKR } from '../config/currency';

const CakeCard = ({ cake }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const price = cake.priceLKR;

  return (
    <div 
      className="col-md-6 col-lg-4 mb-4 d-flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`glass-card-enhanced card h-100 border-0 w-100 ${isHovered ? 'hover-lift' : ''}`}
           style={{ transition: 'all 0.3s ease' }}>
        
        <div className="position-relative overflow-hidden rounded-top">
          <img 
            src={cake.image} 
            className="card-img-top"
            alt={cake.name}
            style={{ 
              height: '220px', 
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          
          <div className="position-absolute top-0 end-0 p-2 d-flex gap-1">
            {cake.isNew && (
              <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-star-fill me-1"></i>NEW
              </span>
            )}
            {cake.isPopular && (
              <span className="badge bg-warning" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-fire me-1"></i>POPULAR
              </span>
            )}
          </div>
          
          <div className={`position-absolute top-0 start-0 w-100 h-100 bg-dark d-flex align-items-center justify-content-center 
                          ${isHovered ? 'opacity-75' : 'opacity-0'}`}
               style={{ transition: 'opacity 0.3s ease' }}>
            <button 
              className="btn btn-frosting btn-enhanced"
              onClick={() => alert(`Quick view: ${cake.name}`)}
            >
              <i className="bi bi-eye me-2"></i>
              Quick View
            </button>
          </div>
        </div>
        
        <div className="card-body d-flex flex-column p-4">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title fw-bold text-chocolate mb-0">{cake.name}</h5>
            <div className="d-flex align-items-center">
              <i className="bi bi-star-fill text-warning me-1"></i>
              <span className="fw-bold">{cake.rating}</span>
            </div>
          </div>
          
          <p className="card-text text-muted mb-3 flex-grow-1" style={{ fontSize: '0.9rem' }}>
            {cake.description.length > 80 ? cake.description.substring(0, 80) + '...' : cake.description}
          </p>
          
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <span className="fw-bold fs-4 text-apricot">{formatLKR(price)}</span>
              <small className="text-muted ms-2" style={{ fontSize: '0.8rem' }}>starting from</small>
            </div>
            
            <button 
              className="btn btn-outline-apricot btn-sm btn-enhanced"
              onClick={() => alert(`Added ${cake.name} to cart!`)}
              style={{ fontSize: '0.9rem' }}
            >
              <i className="bi bi-cart-plus me-1"></i>
              Add
            </button>
          </div>
          
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex justify-content-between">
              <small className="text-muted">
                <i className="bi bi-tag me-1"></i>
                {cake.category}
              </small>
              <small className="text-muted">
                <i className="bi bi-palette me-1"></i>
                {cake.flavors.length} flavors
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CakeCard;