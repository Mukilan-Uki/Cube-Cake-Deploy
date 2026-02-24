import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AllShopsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchShops();
  }, [city]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const url = city 
        ? `http://localhost:5001/api/public/shops?city=${city}`
        : 'http://localhost:5001/api/public/shops';
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setShops(data.shops);
      }
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredShops = shops.filter(shop => 
    shop.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="display-6 mb-3">Our Partner Shops</h1>
          <p className="text-muted">Find the perfect cake from our trusted partner shops</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search shops by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select 
            className="form-select"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">All Cities</option>
            <option value="Colombo">Colombo</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Jaffna">Jaffna</option>
          </select>
        </div>
      </div>

      {/* Shops Grid */}
      {filteredShops.length > 0 ? (
        <div className="row g-4">
          {filteredShops.map(shop => (
            <div className="col-md-6 col-lg-4" key={shop._id}>
              <div 
                className="card h-100 border-0 shadow-sm hover-shadow"
                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                onClick={() => navigate(`/shops/${shop.shopSlug}`)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <i className="bi bi-shop fs-3 text-primary"></i>
                    </div>
                    <div>
                      <h5 className="card-title mb-1">{shop.shopName}</h5>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-geo-alt me-1"></i>
                        {shop.address?.city || 'City not specified'}
                      </p>
                    </div>
                  </div>
                  
                  <p className="card-text text-muted small mb-3">
                    {shop.description || 'No description available'}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-telephone me-1 text-muted"></i>
                      <span className="small">{shop.phone}</span>
                    </div>
                    <span className="badge bg-primary bg-opacity-10 text-primary">
                      {shop.stats?.totalOrders || 0} orders
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-shop display-1 text-muted"></i>
              <h5 className="mt-3">No Shops Found</h5>
              <p className="text-muted">Try adjusting your search criteria</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllShopsPage;