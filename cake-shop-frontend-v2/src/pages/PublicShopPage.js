import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatLKR } from '../config/currency';

const PublicShopPage = () => {
  const { shopSlug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [cakes, setCakes] = useState([]);
  const [selectedCake, setSelectedCake] = useState(null);

  useEffect(() => {
    fetchShopData();
  }, [shopSlug]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5001/api/public/shops/${shopSlug}`);
      const data = await res.json();
      if (data.success) {
        setShop(data.shop);
        setCakes(data.cakes || []);
      }
    } catch (error) {
      console.error('Error fetching shop:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="container py-5 text-center">
        <h2>Shop Not Found</h2>
        <p>The shop you're looking for doesn't exist.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Shop Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="bi bi-shop fs-1 text-primary"></i>
                </div>
                <div>
                  <h1 className="display-6 mb-1">{shop.shopName}</h1>
                  <p className="text-muted mb-0">
                    <i className="bi bi-geo-alt me-2"></i>
                    {shop.address?.street || 'Address not available'}
                  </p>
                  <p className="text-muted">
                    <i className="bi bi-telephone me-2"></i>
                    {shop.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cakes Grid */}
      <div className="row">
        <div className="col-12 mb-4">
          <h3>Our Cakes</h3>
        </div>
        {cakes.length > 0 ? (
          cakes.map(cake => (
            <div className="col-md-4 col-lg-3 mb-4" key={cake._id}>
              <div className="card h-100 border-0 shadow-sm">
                <img 
                  src={cake.image || 'https://via.placeholder.com/300x200?text=Cake'} 
                  className="card-img-top" 
                  alt={cake.name}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{cake.name}</h5>
                    {cake.isPopular && (
                      <span className="badge bg-warning">Popular</span>
                    )}
                  </div>
                  <p className="card-text text-muted small">
                    {cake.description || 'No description available'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <strong className="text-primary fs-5">{formatLKR(cake.priceLKR)}</strong>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedCake(cake)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-cake display-1 text-muted"></i>
              <h5 className="mt-3">No Cakes Available</h5>
              <p className="text-muted">This shop hasn't added any cakes yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Cake Details Modal */}
      {selectedCake && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCake.name}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedCake(null)}
                ></button>
              </div>
              <div className="modal-body">
                <img 
                  src={selectedCake.image || 'https://via.placeholder.com/400x300?text=Cake'} 
                  className="img-fluid rounded mb-3" 
                  alt={selectedCake.name}
                />
                <p>{selectedCake.description || 'No description available'}</p>
                <p><strong>Price:</strong> {formatLKR(selectedCake.priceLKR)}</p>
                {selectedCake.category && (
                  <p><strong>Category:</strong> {selectedCake.category}</p>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedCake(null)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    // Navigate to custom design or order page
                    navigate('/create');
                  }}
                >
                  Order Custom Cake
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicShopPage;