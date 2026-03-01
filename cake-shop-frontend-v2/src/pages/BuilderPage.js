import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatLKR } from '../config/currency';

const BuilderPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  const [cakeDesign, setCakeDesign] = useState({
    base: 'chocolate',
    frosting: 'vanilla',
    size: 'medium',
    layers: 2,
    toppings: [],
    message: '',
    colors: {
      cake: '#8B4513',
      frosting: '#FFF5E6',
      decorations: '#FF6B8B'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [showPreview, setShowPreview] = useState(true);

  // Updated sizes with correct pricing
  const sizes = [
    { id: 'small', name: 'Small', priceLKR: 8997.00, serves: '4-6 people', diameter: '6 inches' },
    { id: 'medium', name: 'Medium', priceLKR: 11997.00, serves: '8-10 people', diameter: '8 inches' },
    { id: 'large', name: 'Large', priceLKR: 17997.00, serves: '12-15 people', diameter: '10 inches' },
    { id: 'xl', name: 'Extra Large', priceLKR: 23997.00, serves: '20+ people', diameter: '12 inches' }
  ];

  // Updated cake bases with correct pricing
  const cakeBases = [
    { id: 'chocolate', name: 'Chocolate', priceLKR: 2500, color: '#8B4513', description: 'Rich chocolate flavor' },
    { id: 'vanilla', name: 'Vanilla', priceLKR: 2000, color: '#F3E5AB', description: 'Classic vanilla taste' },
    { id: 'red-velvet', name: 'Red Velvet', priceLKR: 3000, color: '#8B0000', description: 'Velvety red with cream cheese' },
    { id: 'carrot', name: 'Carrot', priceLKR: 2800, color: '#FF8C00', description: 'Moist with nuts and spices' },
    { id: 'lemon', name: 'Lemon', priceLKR: 2200, color: '#FFFACD', description: 'Tangy citrus flavor' }
  ];

  // Updated frostings with correct pricing
  const frostings = [
    { id: 'vanilla', name: 'Vanilla Buttercream', priceLKR: 1500, color: '#FFF5E6', description: 'Sweet and creamy' },
    { id: 'chocolate', name: 'Chocolate Ganache', priceLKR: 2000, color: '#4A2C2A', description: 'Rich chocolate coating' },
    { id: 'cream-cheese', name: 'Cream Cheese', priceLKR: 1800, color: '#FFFAF0', description: 'Tangy and smooth' },
    { id: 'strawberry', name: 'Strawberry', priceLKR: 1600, color: '#FFB6C1', description: 'Fruity and light' },
    { id: 'matcha', name: 'Matcha', priceLKR: 2200, color: '#98FB98', description: 'Japanese green tea flavor' }
  ];

  // Updated toppings with correct pricing
  const toppings = [
    { id: 'sprinkles', name: 'Rainbow Sprinkles', priceLKR: 800, icon: 'bi-stars', description: 'Colorful candy sprinkles' },
    { id: 'berries', name: 'Fresh Berries', priceLKR: 1800, icon: 'bi-berry', description: 'Strawberries, blueberries, raspberries' },
    { id: 'flowers', name: 'Edible Flowers', priceLKR: 2200, icon: 'bi-flower1', description: 'Natural floral decorations' },
    { id: 'chocolate-chips', name: 'Chocolate Chips', priceLKR: 1200, icon: 'bi-droplet', description: 'Dark, milk, white chocolate' },
    { id: 'nuts', name: 'Crushed Nuts', priceLKR: 1200, icon: 'bi-tree', description: 'Almonds, walnuts, pecans' },
    { id: 'gold-leaf', name: 'Gold Leaf', priceLKR: 3500, icon: 'bi-gem', description: 'Premium edible gold' }
  ];

  // Fixed price calculation function
  const calculatePrice = () => {
    // Base price from size
    const basePriceLKR = sizes.find(s => s.id === cakeDesign.size)?.priceLKR || 11997.00;
    
    // Cake base flavor price
    const baseCakeLKR = cakeBases.find(b => b.id === cakeDesign.base)?.priceLKR || 0;
    
    // Frosting price
    const frostingPriceLKR = frostings.find(f => f.id === cakeDesign.frosting)?.priceLKR || 0;
    
    // Toppings price
    const toppingsPriceLKR = cakeDesign.toppings.reduce((total, toppingId) => {
      const topping = toppings.find(t => t.id === toppingId);
      return total + (topping?.priceLKR || 0);
    }, 0);
    
    // Extra layers price (first 2 layers are included)
    const extraLayers = Math.max(0, cakeDesign.layers - 2);
    const layersPriceLKR = extraLayers * 1500;
    
    // Calculate total
    const totalLKR = basePriceLKR + baseCakeLKR + frostingPriceLKR + toppingsPriceLKR + layersPriceLKR;
    
    console.log('Builder Price Breakdown:', {
      size: cakeDesign.size,
      basePriceLKR,
      baseCakeLKR,
      frostingPriceLKR,
      toppingsPriceLKR,
      layersPriceLKR,
      totalLKR
    });
    
    return {
      totalLKR,
      breakdown: {
        base: basePriceLKR,
        cakeType: baseCakeLKR,
        frosting: frostingPriceLKR,
        toppings: toppingsPriceLKR,
        layers: layersPriceLKR
      }
    };
  };

  const priceDetails = calculatePrice();

  const calculatePrepTime = () => {
    let hours = 2;
    hours += (cakeDesign.layers - 2) * 0.5;
    hours += cakeDesign.toppings.length * 0.25;
    if (cakeDesign.message) hours += 0.25;
    return Math.ceil(hours * 2) / 2;
  };

  const toggleTopping = (toppingId) => {
    setCakeDesign(prev => ({
      ...prev,
      toppings: prev.toppings.includes(toppingId)
        ? prev.toppings.filter(id => id !== toppingId)
        : [...prev.toppings, toppingId]
    }));
  };

  const handleColorChange = (type, color) => {
    setCakeDesign(prev => ({
      ...prev,
      colors: { ...prev.colors, [type]: color }
    }));
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cakeWidth = 200;
    const cakeHeight = 150;
    const cakeX = (canvas.width - cakeWidth) / 2;
    const cakeY = (canvas.height - cakeHeight) / 2;

    const layerHeight = cakeHeight / cakeDesign.layers;
    for (let i = 0; i < cakeDesign.layers; i++) {
      ctx.fillStyle = cakeDesign.colors.cake;
      ctx.fillRect(cakeX, cakeY + i * layerHeight, cakeWidth, layerHeight - 2);
      
      if (i < cakeDesign.layers - 1) {
        ctx.fillStyle = cakeDesign.colors.frosting;
        ctx.fillRect(cakeX + 5, cakeY + (i + 1) * layerHeight - 2, cakeWidth - 10, 4);
      }
    }

    // Frosting on top
    ctx.fillStyle = cakeDesign.colors.frosting;
    ctx.beginPath();
    ctx.moveTo(cakeX, cakeY);
    ctx.lineTo(cakeX + cakeWidth, cakeY);
    for (let x = cakeX; x <= cakeX + cakeWidth; x += 10) {
      const yOffset = Math.sin(x / 20) * 5;
      ctx.lineTo(x, cakeY - 15 + yOffset);
    }
    ctx.lineTo(cakeX, cakeY - 15);
    ctx.closePath();
    ctx.fill();

    // Draw toppings
    cakeDesign.toppings.forEach(toppingId => {
      ctx.fillStyle = cakeDesign.colors.decorations;
      if (toppingId === 'sprinkles') {
        for (let i = 0; i < 30; i++) {
          ctx.fillRect(cakeX + Math.random() * cakeWidth, cakeY - 10 + Math.random() * 20, 2, 6);
        }
      } else if (toppingId === 'berries') {
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(cakeX + 30 + i * 25, cakeY - 10, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    // Draw message
    if (cakeDesign.message) {
      ctx.fillStyle = '#4A2C2A';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cakeDesign.message, canvas.width / 2, cakeY + cakeHeight + 25);
    }
  }, [cakeDesign]);

  // Auto-save draft
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(cakeDesign).length > 0) {
        localStorage.setItem('cakeDesignDraft', JSON.stringify(cakeDesign));
      }
    }, 5000);
    return () => clearTimeout(autoSaveTimer);
  }, [cakeDesign]);

  // Load saved draft
  useEffect(() => {
    const savedDraft = localStorage.getItem('cakeDesignDraft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setCakeDesign(draft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const validateDesign = () => {
    const errors = [];
    if (cakeDesign.layers > 5) errors.push('Maximum 5 layers allowed');
    if (cakeDesign.message && cakeDesign.message.length > 30) errors.push('Message must be 30 characters or less');
    if (cakeDesign.toppings.length > 5) errors.push('Maximum 5 toppings allowed');
    return errors;
  };

  const handleSaveDesign = async () => {
    const errors = validateDesign();
    if (errors.length > 0) {
      alert(`Please fix the following:\n${errors.join('\n')}`);
      return;
    }
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const design = {
      ...cakeDesign,
      finalPriceLKR: priceDetails.totalLKR,
      priceBreakdown: priceDetails.breakdown,
      designId: Date.now(),
      createdAt: new Date().toISOString()
    };

    // Save design to localStorage as fallback for order page
    localStorage.setItem('cakeDesign', JSON.stringify(design));
    
    setIsSaving(false);
    // Go directly to order page — custom designs do NOT save to gallery
    navigate('/order', { state: { design } });
  };
  const templates = [
    {
      name: 'Birthday Classic',
      description: 'Perfect for birthday celebrations',
      design: {
        base: 'chocolate',
        frosting: 'chocolate',
        size: 'large',
        layers: 3,
        toppings: ['sprinkles', 'berries'],
        message: 'Happy Birthday!',
        colors: { cake: '#8B4513', frosting: '#4A2C2A', decorations: '#FF6B8B' }
      }
    },
    {
      name: 'Wedding Elegance',
      description: 'Elegant design for weddings',
      design: {
        base: 'red-velvet',
        frosting: 'cream-cheese',
        size: 'xl',
        layers: 4,
        toppings: ['berries', 'flowers', 'gold-leaf'],
        message: 'Congratulations!',
        colors: { cake: '#8B0000', frosting: '#FFFAF0', decorations: '#FF1493' }
      }
    },
    {
      name: 'Luxury Gold',
      description: 'Premium gold leaf decoration',
      design: {
        base: 'chocolate',
        frosting: 'matcha',
        size: 'large',
        layers: 3,
        toppings: ['gold-leaf', 'berries'],
        message: 'You\'re Golden!',
        colors: { cake: '#8B4513', frosting: '#98FB98', decorations: '#D4AF37' }
      }
    }
  ];

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="bg-cream py-3 sticky-top" style={{ zIndex: 1000 }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="mb-0 text-chocolate">
              <i className="bi bi-palette me-2"></i>
              Cake Builder Studio
            </h5>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <button
                  key={step}
                  className={`btn btn-sm ${activeStep === step ? 'btn-primary-gradient' : 'btn-outline-gradient'}`}
                  onClick={() => setActiveStep(step)}
                >
                  Step {step}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* Live Preview Column */}
          {showPreview && (
            <div className="col-lg-4 mb-4">
              <div className="sticky-top" style={{ top: '80px' }}>
                <div className="glass-panel p-4 mb-4">
                  <h4 className="text-chocolate mb-3">
                    <i className="bi bi-cake me-2"></i>
                    Live Preview
                  </h4>
                  <div className="text-center mb-3">
                    <canvas 
                      ref={canvasRef}
                      width={400}
                      height={300}
                      className="border rounded bg-cream w-100"
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="glass-panel p-4">
                  <h4 className="text-chocolate mb-3">Order Summary</h4>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Cake Size</span>
                      <span className="fw-bold">{sizes.find(s => s.id === cakeDesign.size)?.name}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Cake Base</span>
                      <span>{cakeBases.find(b => b.id === cakeDesign.base)?.name}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Frosting</span>
                      <span>{frostings.find(f => f.id === cakeDesign.frosting)?.name}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Layers</span>
                      <span>{cakeDesign.layers}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Toppings</span>
                      <span>{cakeDesign.toppings.length}</span>
                    </div>
                    
                    <hr />
                    
                    {/* Price Breakdown */}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small">
                        <span>Base Cake</span>
                        <span>{formatLKR(priceDetails.breakdown.base)}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>{cakeBases.find(b => b.id === cakeDesign.base)?.name} Flavor</span>
                        <span>+{formatLKR(priceDetails.breakdown.cakeType)}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>{frostings.find(f => f.id === cakeDesign.frosting)?.name}</span>
                        <span>+{formatLKR(priceDetails.breakdown.frosting)}</span>
                      </div>
                      {priceDetails.breakdown.layers > 0 && (
                        <div className="d-flex justify-content-between small">
                          <span>Extra Layers ({cakeDesign.layers - 2})</span>
                          <span>+{formatLKR(priceDetails.breakdown.layers)}</span>
                        </div>
                      )}
                      {priceDetails.breakdown.toppings > 0 && (
                        <div className="d-flex justify-content-between small">
                          <span>Toppings ({cakeDesign.toppings.length})</span>
                          <span>+{formatLKR(priceDetails.breakdown.toppings)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
                      <span>Total</span>
                      <span className="text-gradient">{formatLKR(priceDetails.totalLKR)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Preparation Time:</span>
                      <span className="fw-medium">{calculatePrepTime()} hours</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Serves:</span>
                      <span className="fw-medium">{sizes.find(s => s.id === cakeDesign.size)?.serves}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-primary-gradient w-100 mt-4 py-3"
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-bag-check me-2"></i>
                        Proceed to Order — {formatLKR(priceDetails.totalLKR)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Builder Column */}
          <div className={showPreview ? "col-lg-8" : "col-12"}>
            {/* Step indicators */}
            <div className="mb-4">
              <h3 className="text-chocolate mb-1">
                {activeStep === 1 && "Choose Your Cake Base"}
                {activeStep === 2 && "Select Frosting"}
                {activeStep === 3 && "Size & Layers"}
                {activeStep === 4 && "Add Toppings"}
                {activeStep === 5 && "Personalize"}
              </h3>
            </div>

            {/* Step 1: Cake Base */}
            {activeStep === 1 && (
              <div className="glass-panel p-4">
                <div className="row g-3">
                  {cakeBases.map(base => (
                    <div key={base.id} className="col-md-6">
                      <div 
                        className={`card h-100 cursor-pointer ${cakeDesign.base === base.id ? 'border-gold border-3' : 'border-light'}`}
                        onClick={() => setCakeDesign(prev => ({ ...prev, base: base.id }))}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title">{base.name}</h5>
                              <p className="text-muted small">{base.description}</p>
                            </div>
                            <span className="badge bg-gradient-primary">+{formatLKR(base.priceLKR)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Frosting */}
            {activeStep === 2 && (
              <div className="glass-panel p-4">
                <div className="row g-3">
                  {frostings.map(frosting => (
                    <div key={frosting.id} className="col-md-6">
                      <div 
                        className={`card h-100 cursor-pointer ${cakeDesign.frosting === frosting.id ? 'border-gold border-3' : 'border-light'}`}
                        onClick={() => setCakeDesign(prev => ({ ...prev, frosting: frosting.id }))}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title">{frosting.name}</h5>
                              <p className="text-muted small">{frosting.description}</p>
                            </div>
                            <span className="badge bg-gradient-primary">+{formatLKR(frosting.priceLKR)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Size & Layers */}
            {activeStep === 3 && (
              <div className="glass-panel p-4">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5 className="text-chocolate mb-3">Select Size</h5>
                    {sizes.map(size => (
                      <button
                        key={size.id}
                        className={`btn w-100 text-start p-3 mb-2 ${cakeDesign.size === size.id ? 'btn-primary-gradient' : 'btn-outline-gradient'}`}
                        onClick={() => setCakeDesign(prev => ({ ...prev, size: size.id }))}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-bold">{size.name}</div>
                            <small>{size.serves}</small>
                          </div>
                          <span className="fw-bold">{formatLKR(size.priceLKR)}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="col-md-6">
                    <h5 className="text-chocolate mb-3">Number of Layers</h5>
                    <div className="text-center">
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <button 
                          className="btn btn-outline-gradient rounded-circle"
                          onClick={() => setCakeDesign(prev => ({ 
                            ...prev, 
                            layers: Math.max(1, prev.layers - 1) 
                          }))}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <span className="mx-4 fs-1 fw-bold">{cakeDesign.layers}</span>
                        <button 
                          className="btn btn-outline-gradient rounded-circle"
                          onClick={() => setCakeDesign(prev => ({ 
                            ...prev, 
                            layers: Math.min(5, prev.layers + 1) 
                          }))}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                      <p className="text-muted small">
                        Base price includes 2 layers. Extra layers: +{formatLKR(1500)} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Toppings */}
            {activeStep === 4 && (
              <div className="glass-panel p-4">
                <h5 className="text-chocolate mb-3">Add Toppings</h5>
                <div className="row g-3">
                  {toppings.map(topping => (
                    <div key={topping.id} className="col-md-6 col-lg-4">
                      <div 
                        className={`card h-100 cursor-pointer ${cakeDesign.toppings.includes(topping.id) ? 'border-gold border-3' : 'border-light'}`}
                        onClick={() => toggleTopping(topping.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <i className={`bi ${topping.icon} fs-4 mb-2 d-block text-gold`}></i>
                              <h6 className="card-title">{topping.name}</h6>
                              <p className="text-muted small">{topping.description}</p>
                            </div>
                            <span className="badge bg-gradient-primary">+{formatLKR(topping.priceLKR)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Personalize */}
            {activeStep === 5 && (
              <div className="glass-panel p-4">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5 className="text-chocolate mb-3">Custom Message</h5>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="E.g., Happy Birthday Sarah!"
                      value={cakeDesign.message}
                      onChange={(e) => setCakeDesign(prev => ({ ...prev, message: e.target.value }))}
                      maxLength={30}
                    />
                    <small className="text-muted">{cakeDesign.message.length}/30 characters</small>
                  </div>

                  <div className="col-md-6">
                    <h5 className="text-chocolate mb-3">Custom Colors</h5>
                    <div className="mb-3">
                      <label className="form-label">Cake Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={cakeDesign.colors.cake}
                        onChange={(e) => handleColorChange('cake', e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Frosting Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={cakeDesign.colors.frosting}
                        onChange={(e) => handleColorChange('frosting', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn-outline-gradient"
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Previous
              </button>
              
              {activeStep < 5 ? (
                <button 
                  className="btn-primary-gradient"
                  onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                >
                  Next Step
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              ) : (
                <button 
                  className="btn-primary-gradient"
                  onClick={handleSaveDesign}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving to Gallery...' : `Proceed to Order (${formatLKR(priceDetails.totalLKR)})`}
                </button>
              )}
            </div>

            {/* Templates */}
            <div className="mt-5">
              <h4 className="text-chocolate mb-3">Try Templates</h4>
              <div className="row g-3">
                {templates.map((template, index) => (
                  <div key={index} className="col-md-4">
                    <div 
                      className="glass-panel p-3 text-center"
                      onClick={() => {
                        setCakeDesign(prev => ({
                          ...prev,
                          ...template.design
                        }));
                        setActiveStep(5);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <h6 className="mb-2">{template.name}</h6>
                      <p className="small text-muted">{template.description}</p>
                      <span className="badge bg-gradient-primary">Apply</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;