import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { cakeData, cakeCategories } from '../utils/cakeData';
import CakeCard from '../components/CakeCard';
import { getCategoryIcon } from '../utils/helpers';
import { formatLKR } from '../config/currency';

const GalleryPage = () => {
  const location = useLocation();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [newDesignId, setNewDesignId] = useState(null);

  // Merge static cakes + custom designed cakes from localStorage
  const getAllCakes = () => {
    const customCakes = JSON.parse(localStorage.getItem('customGalleryCakes') || '[]');
    return [...customCakes, ...cakeData];
  };

  const allCakes = getAllCakes();
  const allCategories = ['All', 'Custom', ...cakeCategories.filter(c => c !== 'All')];

  const [cakes, setCakes] = useState(allCakes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState(50000);

  // Show success banner when navigated from builder
  useEffect(() => {
    if (location.state?.showSuccess && location.state?.newDesignId) {
      setShowSuccessBanner(true);
      setNewDesignId(location.state.newDesignId);
      setTimeout(() => setShowSuccessBanner(false), 6000);
    }
  }, [location.state]);

  // Re-read localStorage each time filters change so newly added custom cakes always appear
  useEffect(() => {
    const freshCakes = getAllCakes();
    let filtered = [...freshCakes];

    if (searchTerm) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cake.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(cake => cake.category === selectedCategory);
    }

    filtered = filtered.filter(cake => cake.priceLKR <= priceRange);

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.priceLKR - b.priceLKR);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.priceLKR - a.priceLKR);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      default:
        filtered.sort((a, b) => b.isPopular - a.isPopular);
    }

    setCakes(filtered);
  }, [searchTerm, selectedCategory, sortBy, priceRange, location.state]);

  return (
    <div className="container-fluid px-0">
      <div className="py-5 text-center" style={{
        background: 'linear-gradient(135deg, rgba(106,17,203,0.1) 0%, rgba(255,107,139,0.1) 100%)'
      }}>
        <div className="container">
          <h1 className="display-3 font-script gradient-text mb-3">Cake Gallery</h1>
          <p className="lead fs-4 text-chocolate">
            Browse our collection of handcrafted masterpieces
          </p>
        </div>
      </div>

      {/* Success Banner when arriving from Builder */}
      {showSuccessBanner && (
        <div className="container mt-4">
          <div className="alert border-0 d-flex align-items-center gap-3 p-4 rounded-4" style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,158,109,0.15))',
            border: '1.5px solid rgba(212,175,55,0.4) !important'
          }}>
            <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, #D4AF37, #FF9E6D)'
            }}>
              <i className="bi bi-check-lg text-white fs-5"></i>
            </div>
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1" style={{ color: '#2C1810' }}>🎂 Your cake design was added to the gallery!</h6>
              <p className="mb-0 text-muted small">It now appears at the top of the gallery. Click "Buy Now" on your cake to place an order.</p>
            </div>
            <button className="btn-close" onClick={() => setShowSuccessBanner(false)}></button>
          </div>
        </div>
      )}

      <div className="container py-4">
        <div className="glass-card p-4 mb-5">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-cream border-0">
                  <i className="bi bi-search text-chocolate"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-cream"
                  placeholder="Search cakes by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3">
              <select
                className="form-select bg-cream border-0"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Sort by: Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div className="col-12 mt-3">
              <div className="d-flex align-items-center gap-3">
                <span className="text-chocolate fw-medium">Price Range:</span>
                <span className="text-apricot fw-bold">{formatLKR(priceRange)}</span>
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  min="5000"
                  max="50000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  style={{ accentColor: 'var(--apricot)' }}
                />
              </div>
            </div>

            <div className="col-12">
              <div className="d-flex flex-wrap gap-2">
                {selectedCategory !== 'All' && (
                  <span className="badge bg-apricot d-flex align-items-center gap-1">
                    {selectedCategory}
                    <button 
                      className="btn-close btn-close-white btn-sm ms-1"
                      onClick={() => setSelectedCategory('All')}
                    ></button>
                  </span>
                )}
                {searchTerm && (
                  <span className="badge bg-strawberry d-flex align-items-center gap-1">
                    Search: "{searchTerm}"
                    <button 
                      className="btn-close btn-close-white btn-sm ms-1"
                      onClick={() => setSearchTerm('')}
                    ></button>
                  </span>
                )}
                <span className="badge bg-lavender">
                  Max Price: {formatLKR(priceRange)}
                </span>
                <span className="badge bg-sprinkle-blue">
                  {cakes.length} {cakes.length === 1 ? 'Cake' : 'Cakes'} Found
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h4 className="mb-3 text-chocolate">Browse by Category</h4>
          <div className="d-flex flex-wrap gap-2">
            {allCategories.map(category => (
              <button
                key={category}
                className={`btn ${selectedCategory === category ? 'btn-apricot' : 'btn-outline-apricot'} d-flex align-items-center`}
                onClick={() => setSelectedCategory(category)}
              >
                <i className={`bi ${getCategoryIcon(category)} me-2`}></i>
                {category}
                {category !== 'All' && (
                  <span className="badge bg-lavender ms-2">
                    {allCakes.filter(cake => cake.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {cakes.length > 0 ? (
          <>
            <div className="row">
              {cakes.map(cake => (
                <CakeCard key={cake.id} cake={cake} />
              ))}
            </div>

            <div className="text-center mt-5">
              <div className="glass-card d-inline-flex align-items-center gap-4 p-4">
                <div>
                  <h5 className="text-chocolate mb-1">Showing</h5>
                  <span className="fs-3 fw-bold text-apricot">{cakes.length}</span>
                  <span className="text-muted"> cakes</span>
                </div>
                <div className="vr"></div>
                <div>
                  <h5 className="text-chocolate mb-1">Price Range</h5>
                  <span className="fs-3 fw-bold text-strawberry">{formatLKR(Math.min(...cakes.map(c => c.priceLKR)))}</span>
                  <span className="text-muted"> - </span>
                  <span className="fs-3 fw-bold text-strawberry">{formatLKR(Math.max(...cakes.map(c => c.priceLKR)))}</span>
                </div>
                <div className="vr"></div>
                <div>
                  <h5 className="text-chocolate mb-1">Average Rating</h5>
                  <span className="fs-3 fw-bold text-lavender">
                    {(cakes.reduce((sum, cake) => sum + cake.rating, 0) / cakes.length).toFixed(1)}
                  </span>
                  <i className="bi bi-star-fill text-warning ms-1"></i>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="glass-card p-5 d-inline-block">
              <i className="bi bi-cake text-muted" style={{ fontSize: '4rem' }}></i>
              <h3 className="mt-3 text-chocolate">No Cakes Found</h3>
              <p className="text-muted mb-4">
                Try adjusting your filters or search term
              </p>
              <button 
                className="btn btn-frosting"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setPriceRange(15000);
                  setSortBy('default');
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;