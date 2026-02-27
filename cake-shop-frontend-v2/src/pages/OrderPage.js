import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import RequireAuth from '../components/RequireAuth';
import { formatLKR } from '../config/currency';
import { API_CONFIG } from '../config';

const OrderPageContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
  const [design, setDesign] = useState({});
  const [galleryCake, setGalleryCake] = useState(null); // For gallery cake orders
  const isGalleryOrder = !!galleryCake;
  const [defaultShopId, setDefaultShopId] = useState(null);
  const [shopError, setShopError] = useState('');

  // Load design from location state or localStorage, and fetch a default shop for custom orders
  useEffect(() => {
    // Check if this is a gallery cake order
    if (location.state?.galleryCake) {
      setGalleryCake(location.state.galleryCake);
      setDesign({});
    } else if (location.state?.design) {
      setDesign(location.state.design);
      localStorage.setItem('cakeDesign', JSON.stringify(location.state.design));
    } else {
      // Then try localStorage
      const savedDesign = localStorage.getItem('cakeDesign');
      if (savedDesign) {
        try {
          setDesign(JSON.parse(savedDesign));
        } catch (error) {
          console.error('Error loading design:', error);
        }
      }
    }

    // Fetch a default shop to use for custom cake orders (which have no shopId)
    const fetchDefaultShop = async () => {
      try {
        const res = await fetch(`${API_CONFIG.PUBLIC.SHOPS}?limit=1`);
        const data = await res.json();
        if (data.success && data.shops && data.shops.length > 0) {
          setDefaultShopId(data.shops[0]._id);
          setShopError('');
        } else {
          setShopError('No shops are currently available. Please try again later.');
        }
      } catch (err) {
        console.error('Could not fetch default shop:', err);
        setShopError('Could not connect to the server. Please check your connection.');
      }
    };

    fetchDefaultShop();
  }, [location.state]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login-selection', { 
        state: { from: '/order' },
        replace: true 
      });
    }
  }, [user, navigate]);

  // Update form with user data
  useEffect(() => {
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
    
    if (orderDetails.deliveryType === 'delivery' && !orderDetails.deliveryAddress.trim()) {
      errors.push('Delivery address is required');
    }
    
    return errors;
  };

  // Fixed price calculation to match Builder page
  const calculateTotalPrice = () => {
    // If this is a gallery cake order
    if (isGalleryOrder && galleryCake) {
      const deliveryFee = orderDetails.deliveryType === 'delivery' ? 1500.00 : 0;
      return galleryCake.priceLKR + deliveryFee;
    }

    // If no design, return 0
    if (!design || Object.keys(design).length === 0) {
      return 0;
    }

    // Base prices from size
    const sizePrices = {
      'small': 8997.00,
      'medium': 11997.00,
      'large': 17997.00,
      'xl': 23997.00
    };
    
    // Additional costs for bases
    const baseAdditional = {
      'chocolate': 2500,
      'vanilla': 2000,
      'red-velvet': 3000,
      'carrot': 2800,
      'lemon': 2200
    };
    
    // Additional costs for frostings
    const frostingAdditional = {
      'vanilla': 1500,
      'chocolate': 2000,
      'cream-cheese': 1800,
      'strawberry': 1600,
      'matcha': 2200
    };
    
    // Additional costs for toppings
    const toppingAdditional = {
      'sprinkles': 800,
      'berries': 1800,
      'flowers': 2200,
      'chocolate-chips': 1200,
      'nuts': 1200,
      'gold-leaf': 3500
    };
    
    // Calculate each component
    const basePrice = sizePrices[design.size] || 11997.00;
    const baseExtra = baseAdditional[design.base] || 0;
    const frostingExtra = frostingAdditional[design.frosting] || 0;
    
    // Calculate toppings total
    const toppingsExtra = (design.toppings || []).reduce((total, toppingId) => {
      return total + (toppingAdditional[toppingId] || 0);
    }, 0);
    
    // Extra layers (first 2 are included)
    const extraLayers = Math.max(0, (design.layers || 2) - 2);
    const layersExtra = extraLayers * 1500;
    
    // Delivery fee
    const deliveryFee = orderDetails.deliveryType === 'delivery' ? 1500.00 : 0;
    
    // Calculate total
    const total = basePrice + baseExtra + frostingExtra + toppingsExtra + layersExtra + deliveryFee;
    
    console.log('✅ Order Page Price Calculation:', {
      size: design.size,
      basePrice,
      base: design.base,
      baseExtra,
      frosting: design.frosting,
      frostingExtra,
      toppings: design.toppings,
      toppingsExtra,
      layers: design.layers,
      extraLayers,
      layersExtra,
      deliveryFee,
      TOTAL: total
    });
    
    return total;
  };

  const totalPrice = calculateTotalPrice();

  // Helper function to get readable names
  const getSizeName = (sizeId) => {
    const sizes = {
      'small': 'Small (6")',
      'medium': 'Medium (8")',
      'large': 'Large (10")',
      'xl': 'Extra Large (12")'
    };
    return sizes[sizeId] || 'Medium (8")';
  };

  const getBaseName = (baseId) => {
    const bases = {
      'chocolate': 'Chocolate',
      'vanilla': 'Vanilla',
      'red-velvet': 'Red Velvet',
      'carrot': 'Carrot',
      'lemon': 'Lemon'
    };
    return bases[baseId] || 'Chocolate';
  };

  const getFrostingName = (frostingId) => {
    const frostings = {
      'vanilla': 'Vanilla Buttercream',
      'chocolate': 'Chocolate Ganache',
      'cream-cheese': 'Cream Cheese',
      'strawberry': 'Strawberry',
      'matcha': 'Matcha'
    };
    return frostings[frostingId] || 'Vanilla Buttercream';
  };

  const getToppingName = (toppingId) => {
    const toppingNames = {
      'sprinkles': 'Rainbow Sprinkles',
      'berries': 'Fresh Berries',
      'flowers': 'Edible Flowers',
      'chocolate-chips': 'Chocolate Chips',
      'nuts': 'Crushed Nuts',
      'gold-leaf': 'Gold Leaf'
    };
    return toppingNames[toppingId] || toppingId;
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
    
    // Combine design with order details
    // Resolve the shopId:
    // - For gallery/shop cakes: use the shopId passed from CakeCard
    // - For custom designs: use the defaultShopId fetched from the public API
    const resolvedShopId = isGalleryOrder
      ? (galleryCake.shopId || galleryCake.shop?._id || galleryCake.shop || defaultShopId)
      : defaultShopId;

    if (!resolvedShopId) {
      alert('No shop is available to process your order. Please try again later.');
      setIsSubmitting(false);
      return;
    }

    const orderData = isGalleryOrder ? {
      // Gallery cake order
      shopId: resolvedShopId,
      cakeDetails: {
        base: 'vanilla',
        frosting: 'vanilla',
        size: 'medium',
        layers: 2,
        toppings: [],
        message: galleryCake.name,
        colors: { cake: '#F3E5AB', frosting: '#FFF5E6', decorations: '#FF6B8B' },
        specialInstructions: `Gallery cake: ${galleryCake.name}. ${orderDetails.specialInstructions || ''}`
      },
      ...orderDetails,
      deliveryDate: formattedDate,
      paymentMethod: orderDetails.paymentMethod,
    } : {
      // Custom design order
      shopId: resolvedShopId,
      cakeDetails: {
        base: design.base || 'chocolate',
        frosting: design.frosting || 'vanilla',
        size: design.size || 'medium',
        layers: design.layers || 2,
        toppings: design.toppings || [],
        message: design.message || '',
        colors: design.colors || { cake: '#8B4513', frosting: '#FFF5E6', decorations: '#FF6B8B' },
        specialInstructions: orderDetails.specialInstructions || ''
      },
      ...orderDetails,
      deliveryDate: formattedDate,
      paymentMethod: orderDetails.paymentMethod,
    };

    console.log('Submitting order:', orderData);

    try {
      const result = await apiService.createOrder(orderData);
      
      if (result.success) {
        // Clear design from localStorage after successful order
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
      {shopError && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {shopError}
        </div>
      )}
      <div className="row">
        {/* Order Summary Column */}
        <div className="col-lg-5 mb-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '100px' }}>
            <h4 className="text-chocolate mb-4">
              <i className="bi bi-bag-heart me-2 text-gold"></i>
              Order Summary
            </h4>
            
            {/* Design Preview */}
            {isGalleryOrder && galleryCake ? (
              /* Gallery Cake Summary */
              <>
                <div className="text-center mb-4">
                  <img
                    src={galleryCake.image}
                    alt={galleryCake.name}
                    className="rounded-4 w-100"
                    style={{ height: '160px', objectFit: 'cover' }}
                  />
                </div>
                <div className="mb-4">
                  <h5 className="fw-bold text-chocolate mb-1">{galleryCake.name}</h5>
                  <p className="text-muted small mb-3">{galleryCake.description}</p>
                  <div className="bg-cream p-3 rounded-3 mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Category:</span>
                      <span className="fw-bold">{galleryCake.category}</span>
                    </div>
                    {galleryCake.flavors?.length > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Flavors:</span>
                        <span className="fw-bold">{galleryCake.flavors.join(', ')}</span>
                      </div>
                    )}
                    {galleryCake.sizes?.length > 0 && (
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Available Sizes:</span>
                        <span className="fw-bold">{galleryCake.sizes.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  {galleryCake.shopName && (
                    <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-shop text-gold fs-5"></i>
                        <span className="fw-bold text-chocolate">{galleryCake.shopName}</span>
                      </div>
                      {galleryCake.shopLocation && (
                        <div className="small text-muted ms-4">
                          <i className="bi bi-geo-alt me-1"></i>{galleryCake.shopLocation}
                        </div>
                      )}
                      {galleryCake.shopPhone && (
                        <div className="small text-muted ms-4">
                          <i className="bi bi-telephone me-1"></i>{galleryCake.shopPhone}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-top pt-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Cake Price</span>
                    <span className="fw-medium">{formatLKR(galleryCake.priceLKR)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 pt-2 border-top">
                    <span className="text-muted">Delivery</span>
                    <span className="fw-medium">
                      {orderDetails.deliveryType === 'delivery' ? formatLKR(1500) : 'FREE'}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-4 mt-3 pt-3 border-top border-2">
                    <span>Total</span>
                    <span className="text-gradient">{formatLKR(totalPrice)}</span>
                  </div>
                  <p className="text-muted small mt-3 mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    All prices are in Sri Lankan Rupees (LKR).
                  </p>
                </div>
              </>
            ) : (
              /* Custom Design Summary */
              <>
              <div className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <div className="rounded-4 bg-gradient-primary p-4" style={{ 
                    width: '120px', 
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-cake3 fs-1 text-white"></i>
                  </div>
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-gradient-primary">
                    {design.layers || 2} Layers
                  </span>
                </div>
              </div>

            {/* Design Details */}
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Your Custom Creation</h6>
              <div className="bg-cream p-3 rounded-3 mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Size:</span>
                  <span className="fw-bold">{getSizeName(design.size)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Base Flavor:</span>
                  <span className="fw-bold">{getBaseName(design.base)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Frosting:</span>
                  <span className="fw-bold">{getFrostingName(design.frosting)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Layers:</span>
                  <span className="fw-bold">{design.layers || 2}</span>
                </div>
                {design.toppings?.length > 0 && (
                  <div className="mb-2">
                    <span className="text-muted d-block mb-1">Toppings:</span>
                    <div className="d-flex flex-wrap gap-1">
                      {design.toppings.map(topping => (
                        <span key={topping} className="badge bg-gradient-primary">
                          {getToppingName(topping)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {design.message && (
                <div className="p-3 bg-cream rounded-3">
                  <small className="text-muted d-block">Message on cake:</small>
                  <p className="mb-0 fst-italic fw-bold">"{design.message}"</p>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="border-top pt-4">
              <h6 className="fw-bold mb-3">Price Breakdown</h6>
              
              {/* Base Price */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">
                  {getSizeName(design.size)} Base
                </span>
                <span className="fw-medium">
                  {formatLKR(design.size === 'small' ? 8997 : 
                            design.size === 'medium' ? 11997 :
                            design.size === 'large' ? 17997 : 23997)}
                </span>
              </div>
              
              {/* Base Flavor Extra */}
              {design.base && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    {getBaseName(design.base)} Flavor
                  </span>
                  <span className="fw-medium text-success">
                    +{formatLKR(design.base === 'chocolate' ? 2500 :
                               design.base === 'vanilla' ? 2000 :
                               design.base === 'red-velvet' ? 3000 :
                               design.base === 'carrot' ? 2800 : 2200)}
                  </span>
                </div>
              )}
              
              {/* Frosting Extra */}
              {design.frosting && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    {getFrostingName(design.frosting)} Frosting
                  </span>
                  <span className="fw-medium text-success">
                    +{formatLKR(design.frosting === 'vanilla' ? 1500 :
                               design.frosting === 'chocolate' ? 2000 :
                               design.frosting === 'cream-cheese' ? 1800 :
                               design.frosting === 'strawberry' ? 1600 : 2200)}
                  </span>
                </div>
              )}
              
              {/* Toppings */}
              {design.toppings?.length > 0 && (
                <div className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Toppings:</span>
                    <span className="fw-medium text-success">
                      +{formatLKR(design.toppings.reduce((sum, t) => {
                        return sum + (t === 'sprinkles' ? 800 :
                                     t === 'berries' ? 1800 :
                                     t === 'flowers' ? 2200 :
                                     t === 'chocolate-chips' ? 1200 :
                                     t === 'nuts' ? 1200 : 3500);
                      }, 0))}
                    </span>
                  </div>
                  <div className="ps-3">
                    {design.toppings.map(topping => (
                      <div key={topping} className="d-flex justify-content-between small">
                        <span className="text-muted">• {getToppingName(topping)}</span>
                        <span className="text-muted">
                          {formatLKR(topping === 'sprinkles' ? 800 :
                                    topping === 'berries' ? 1800 :
                                    topping === 'flowers' ? 2200 :
                                    topping === 'chocolate-chips' ? 1200 :
                                    topping === 'nuts' ? 1200 : 3500)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Extra Layers */}
              {design.layers > 2 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">
                    Extra Layers ({design.layers - 2})
                  </span>
                  <span className="fw-medium text-success">
                    +{formatLKR((design.layers - 2) * 1500)}
                  </span>
                </div>
              )}
              
              {/* Delivery Fee */}
              <div className="d-flex justify-content-between mb-2 pt-2 border-top">
                <span className="text-muted">Delivery</span>
                <span className="fw-medium">
                  {orderDetails.deliveryType === 'delivery' ? formatLKR(1500) : 'FREE'}
                </span>
              </div>
              
              {/* Grand Total */}
              <div className="d-flex justify-content-between fw-bold fs-4 mt-3 pt-3 border-top border-2">
                <span>Total</span>
                <span className="text-gradient">{formatLKR(totalPrice)}</span>
              </div>
              
              {/* Price Note */}
              <p className="text-muted small mt-3 mb-0">
                <i className="bi bi-info-circle me-1"></i>
                All prices are in Sri Lankan Rupees (LKR). Final price includes all customizations.
              </p>
            </div>
            </>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              form="orderForm"
              className="btn-primary-gradient w-100 mt-4 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Processing Order...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-2"></i>
                  Place Order • {formatLKR(totalPrice)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Form Column */}
        <div className="col-lg-7">
          <form id="orderForm" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="glass-panel p-4 mb-4">
              <h5 className="text-chocolate mb-4">
                <i className="bi bi-person me-2 text-gold"></i>
                Contact Information
              </h5>
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

            {/* Delivery Options */}
            <div className="glass-panel p-4 mb-4">
              <h5 className="text-chocolate mb-4">
                <i className="bi bi-truck me-2 text-gold"></i>
                Delivery Options
              </h5>
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
                    <option value="delivery">Home Delivery (+₨ 1,500)</option>
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
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="glass-panel p-4 mb-4">
              <h5 className="text-chocolate mb-4">
                <i className="bi bi-chat me-2 text-gold"></i>
                Special Instructions
              </h5>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Any special requests? Allergies, dietary restrictions, or additional notes..."
                value={orderDetails.specialInstructions}
                onChange={(e) => setOrderDetails({...orderDetails, specialInstructions: e.target.value})}
              />
            </div>

            {/* Payment Method */}
            <div className="glass-panel p-4 mb-4">
              <h5 className="text-chocolate mb-4">
                <i className="bi bi-credit-card me-2 text-gold"></i>
                Payment Method
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
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
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="online"
                      value="online"
                      checked={orderDetails.paymentMethod === 'online'}
                      onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                    />
                    <label className="form-check-label" htmlFor="online">
                      <i className="bi bi-wifi me-2"></i>
                      Online Payment
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