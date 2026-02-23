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

  const cakeBases = [
    { id: 'chocolate', name: 'Chocolate', priceLKR: 1500, color: '#8B4513', description: 'Rich chocolate flavor' },
    { id: 'vanilla', name: 'Vanilla', priceLKR: 1200, color: '#F3E5AB', description: 'Classic vanilla taste' },
    { id: 'red-velvet', name: 'Red Velvet', priceLKR: 1800, color: '#8B0000', description: 'Velvety red with cream cheese' },
    { id: 'carrot', name: 'Carrot', priceLKR: 1500, color: '#FF8C00', description: 'Moist with nuts and spices' },
    { id: 'lemon', name: 'Lemon', priceLKR: 1200, color: '#FFFACD', description: 'Tangy citrus flavor' }
  ];

  const frostings = [
    { id: 'vanilla', name: 'Vanilla Buttercream', priceLKR: 900, color: '#FFF5E6', description: 'Sweet and creamy' },
    { id: 'chocolate', name: 'Chocolate Ganache', priceLKR: 1200, color: '#4A2C2A', description: 'Rich chocolate coating' },
    { id: 'cream-cheese', name: 'Cream Cheese', priceLKR: 1200, color: '#FFFAF0', description: 'Tangy and smooth' },
    { id: 'strawberry', name: 'Strawberry', priceLKR: 900, color: '#FFB6C1', description: 'Fruity and light' },
    { id: 'matcha', name: 'Matcha', priceLKR: 1500, color: '#98FB98', description: 'Japanese green tea flavor' }
  ];

  const toppings = [
    { id: 'sprinkles', name: 'Rainbow Sprinkles', priceLKR: 600, icon: 'bi-stars', description: 'Colorful candy sprinkles' },
    { id: 'berries', name: 'Fresh Berries', priceLKR: 1200, icon: 'bi-berry', description: 'Strawberries, blueberries, raspberries' },
    { id: 'flowers', name: 'Edible Flowers', priceLKR: 1500, icon: 'bi-flower1', description: 'Natural floral decorations' },
    { id: 'chocolate-chips', name: 'Chocolate Chips', priceLKR: 900, icon: 'bi-droplet', description: 'Dark, milk, white chocolate' },
    { id: 'nuts', name: 'Crushed Nuts', priceLKR: 900, icon: 'bi-tree', description: 'Almonds, walnuts, pecans' },
    { id: 'gold-leaf', name: 'Gold Leaf', priceLKR: 2400, icon: 'bi-gem', description: 'Premium edible gold' }
  ];

  const sizes = [
    { id: 'small', name: 'Small', priceLKR: 8997.00, serves: '4-6 people', diameter: '6 inches' },
    { id: 'medium', name: 'Medium', priceLKR: 11997.00, serves: '8-10 people', diameter: '8 inches' },
    { id: 'large', name: 'Large', priceLKR: 14997.00, serves: '12-15 people', diameter: '10 inches' },
    { id: 'xl', name: 'Extra Large', priceLKR: 20997.00, serves: '20+ people', diameter: '12 inches' }
  ];

  const calculatePrice = () => {
    const basePriceLKR = sizes.find(s => s.id === cakeDesign.size)?.priceLKR || 11997.00;
    const baseCakeLKR = cakeBases.find(b => b.id === cakeDesign.base)?.priceLKR || 0;
    const frostingPriceLKR = frostings.find(f => f.id === cakeDesign.frosting)?.priceLKR || 0;
    const toppingsPriceLKR = cakeDesign.toppings.reduce((total, toppingId) => {
      const topping = toppings.find(t => t.id === toppingId);
      return total + (topping?.priceLKR || 0);
    }, 0);
    const layersPriceLKR = (cakeDesign.layers - 2) * 900;
    
    const totalLKR = basePriceLKR + baseCakeLKR + frostingPriceLKR + toppingsPriceLKR + layersPriceLKR;
    
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
      const cakeGradient = ctx.createLinearGradient(
        cakeX, cakeY + i * layerHeight,
        cakeX + cakeWidth, cakeY + i * layerHeight
      );
      cakeGradient.addColorStop(0, cakeDesign.colors.cake);
      cakeGradient.addColorStop(1, shadeColor(cakeDesign.colors.cake, -20));
      
      ctx.fillStyle = cakeGradient;
      ctx.fillRect(cakeX, cakeY + i * layerHeight, cakeWidth, layerHeight - 2);
      
      if (i < cakeDesign.layers - 1) {
        ctx.fillStyle = cakeDesign.colors.frosting;
        ctx.fillRect(cakeX + 5, cakeY + (i + 1) * layerHeight - 2, cakeWidth - 10, 4);
      }
    }

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

    cakeDesign.toppings.forEach(toppingId => {
      ctx.fillStyle = cakeDesign.colors.decorations;
      
      if (toppingId === 'sprinkles') {
        for (let i = 0; i < 30; i++) {
          const x = cakeX + Math.random() * cakeWidth;
          const y = cakeY - 10 + Math.random() * 20;
          const angle = Math.random() * Math.PI * 2;
          const length = 4;
          const width = 1;
          
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillRect(-length/2, -width/2, length, width);
          ctx.restore();
        }
      } else if (toppingId === 'berries') {
        for (let i = 0; i < 6; i++) {
          const x = cakeX + 30 + i * 25;
          const y = cakeY - 10;
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    if (cakeDesign.message) {
      ctx.fillStyle = '#4A2C2A';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(cakeDesign.message, canvas.width / 2, cakeY + cakeHeight + 25);
    }

    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 3;

    function shadeColor(color, percent) {
      let R = parseInt(color.substring(1,3),16);
      let G = parseInt(color.substring(3,5),16);
      let B = parseInt(color.substring(5,7),16);

      R = parseInt(R * (100 + percent) / 100);
      G = parseInt(G * (100 + percent) / 100);
      B = parseInt(B * (100 + percent) / 100);

      R = (R<255)?R:255;
      G = (G<255)?G:255;
      B = (B<255)?B:255;

      const RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
      const GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
      const BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

      return "#"+RR+GG+BB;
    }
  }, [cakeDesign]);

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(cakeDesign).length > 0) {
        localStorage.setItem('cakeDesignDraft', JSON.stringify(cakeDesign));
      }
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [cakeDesign]);

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
    
    if (cakeDesign.layers > 5) {
      errors.push('Maximum 5 layers allowed');
    }
    
    if (cakeDesign.message && cakeDesign.message.length > 30) {
      errors.push('Message must be 30 characters or less');
    }
    
    if (cakeDesign.toppings.length > 5) {
      errors.push('Maximum 5 toppings allowed');
    }
    
    return errors;
  };

  const handleSaveDesign = async () => {
    const errors = validateDesign();
    if (errors.length > 0) {
      alert(`Please fix the following:\n${errors.join('\n')}`);
      return;
    }
    
    setIsSaving(true);  
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const design = {
      ...cakeDesign,
      finalPriceLKR: priceDetails.totalLKR,
      designId: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('cakeDesign', JSON.stringify(design));
    setIsSaving(false);
    
    alert('🎂 Design saved successfully! Redirecting to order...');
    navigate('/order', { state: { design } });
  };

  const templates = [
    {
      name: 'Birthday Classic',
      description: 'Perfect for birthday celebrations',
      design: {
        base: 'chocolate',
        frosting: 'chocolate',
        size: 'medium',
        layers: 3,
        toppings: ['sprinkles'],
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
        size: 'large',
        layers: 4,
        toppings: ['berries', 'flowers'],
        message: 'Congratulations!',
        colors: { cake: '#8B0000', frosting: '#FFFAF0', decorations: '#FF1493' }
      }
    },
    {
      name: 'Simple & Sweet',
      description: 'Minimal and delicious',
      design: {
        base: 'vanilla',
        frosting: 'strawberry',
        size: 'small',
        layers: 2,
        toppings: ['chocolate-chips'],
        message: 'You\'re Sweet!',
        colors: { cake: '#F3E5AB', frosting: '#FFB6C1', decorations: '#9D5CFF' }
      }
    }
  ];

  return (
    <div className="container-fluid px-0">
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
                  className={`btn btn-sm ${activeStep === step ? 'btn-apricot' : 'btn-outline-apricot'}`}
                  onClick={() => setActiveStep(step)}
                >
                  Step {step}
                </button>
              ))}
              <button 
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setShowPreview(!showPreview)}
              >
                <i className={`bi ${showPreview ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {showPreview && (
            <div className="col-lg-4 mb-4">
              <div className="sticky-top" style={{ top: '80px' }}>
                <div className="glass-card p-4 mb-4">
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

                  <div className="text-center">
                    <small className="text-muted">
                      This is a preview of your custom cake
                    </small>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h4 className="text-chocolate mb-3">Order Summary</h4>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Cake Size</span>
                      <span>{sizes.find(s => s.id === cakeDesign.size)?.name}</span>
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
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small">
                        <span>Cake Base</span>
                        <span>{formatLKR(priceDetails.breakdown.base)}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>{cakeBases.find(b => b.id === cakeDesign.base)?.name} Cake</span>
                        <span>+{formatLKR(priceDetails.breakdown.cakeType)}</span>
                      </div>
                      <div className="d-flex justify-content-between small">
                        <span>{frostings.find(f => f.id === cakeDesign.frosting)?.name}</span>
                        <span>+{formatLKR(priceDetails.breakdown.frosting)}</span>
                      </div>
                      {priceDetails.breakdown.layers > 0 && (
                        <div className="d-flex justify-content-between small">
                          <span>Extra Layers</span>
                          <span>+{formatLKR(priceDetails.breakdown.layers)}</span>
                        </div>
                      )}
                      {priceDetails.breakdown.toppings > 0 && (
                        <div className="d-flex justify-content-between small">
                          <span>Toppings</span>
                          <span>+{formatLKR(priceDetails.breakdown.toppings)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-3 pt-3 border-top">
                      <span>Total</span>
                      <span className="text-apricot">{formatLKR(priceDetails.totalLKR)}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Preparation Time:</span>
                      <span className="fw-medium">{calculatePrepTime()} hours</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">Serves:</span>
                      <span className="fw-medium">{sizes.find(s => s.id === cakeDesign.size)?.serves}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Currency:</span>
                      <span className="fw-medium">Sri Lankan Rupees (LKR)</span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-frosting w-100 mt-4"
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving Your Design...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Proceed to Order - {formatLKR(priceDetails.totalLKR)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className={showPreview ? "col-lg-8" : "col-12"}>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="text-chocolate mb-1">
                    {activeStep === 1 && "Choose Your Cake Base"}
                    {activeStep === 2 && "Select Frosting"}
                    {activeStep === 3 && "Size & Layers"}
                    {activeStep === 4 && "Add Toppings"}
                    {activeStep === 5 && "Personalize"}
                  </h3>
                  <p className="text-muted mb-0">
                    {activeStep === 1 && "Select your preferred cake flavor"}
                    {activeStep === 2 && "Choose frosting type"}
                    {activeStep === 3 && "Select size and number of layers"}
                    {activeStep === 4 && "Add decorations and toppings"}
                    {activeStep === 5 && "Add message and custom colors"}
                  </p>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">Step {activeStep} of 5</small>
                  <div className="progress" style={{ width: '100px', height: '4px' }}>
                    <div 
                      className="progress-bar bg-apricot" 
                      style={{ width: `${(activeStep / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {activeStep === 1 && (
              <div className="glass-card p-4">
                <div className="row g-3">
                  {cakeBases.map(base => (
                    <div key={base.id} className="col-md-6">
                      <div 
                        className={`card h-100 cursor-pointer ${cakeDesign.base === base.id ? 'border-apricot border-3' : 'border-light'}`}
                        onClick={() => setCakeDesign(prev => ({ ...prev, base: base.id }))}
                        style={{ transition: 'all 0.3s' }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div 
                              className="rounded-circle me-3 flex-shrink-0"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: base.color,
                                border: '2px solid #fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            ></div>
                            <div>
                              <h5 className="card-title d-flex justify-content-between">
                                {base.name}
                                <span className="badge bg-apricot">+{formatLKR(base.priceLKR)}</span>
                              </h5>
                              <p className="card-text text-muted small">{base.description}</p>
                              {cakeDesign.base === base.id && (
                                <div className="text-success small">
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="glass-card p-4">
                <div className="row g-3">
                  {frostings.map(frosting => (
                    <div key={frosting.id} className="col-md-6">
                      <div 
                        className={`card h-100 cursor-pointer ${cakeDesign.frosting === frosting.id ? 'border-strawberry border-3' : 'border-light'}`}
                        onClick={() => setCakeDesign(prev => ({ ...prev, frosting: frosting.id }))}
                        style={{ transition: 'all 0.3s' }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div 
                              className="rounded-circle me-3 flex-shrink-0"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: frosting.color,
                                border: '2px solid #fff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}
                            ></div>
                            <div>
                              <h5 className="card-title d-flex justify-content-between">
                                {frosting.name}
                                <span className="badge bg-strawberry">+{formatLKR(frosting.priceLKR)}</span>
                              </h5>
                              <p className="card-text text-muted small">{frosting.description}</p>
                              {cakeDesign.frosting === frosting.id && (
                                <div className="text-success small">
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Selected
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="glass-card p-4">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5 className="text-chocolate mb-3">Select Size</h5>
                    <div className="d-grid gap-2">
                      {sizes.map(size => (
                        <button
                          key={size.id}
                          className={`btn ${cakeDesign.size === size.id ? 'btn-lavender' : 'btn-outline-lavender'} text-start p-3`}
                          onClick={() => setCakeDesign(prev => ({ ...prev, size: size.id }))}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{size.name}</div>
                              <div className="small text-muted">{size.diameter} • {size.serves}</div>
                            </div>
                            <div className="fw-bold text-lavender">{formatLKR(size.priceLKR)}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5 className="text-chocolate mb-3">Number of Layers</h5>
                    <div className="text-center">
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <button 
                          className="btn btn-outline-apricot rounded-circle"
                          onClick={() => setCakeDesign(prev => ({ 
                            ...prev, 
                            layers: Math.max(1, prev.layers - 1) 
                          }))}
                          disabled={cakeDesign.layers <= 1}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="bi bi-dash fs-4"></i>
                        </button>
                        
                        <div className="mx-4 text-center">
                          <div className="display-2 fw-bold text-apricot">{cakeDesign.layers}</div>
                          <div className="text-muted">layers</div>
                        </div>
                        
                        <button 
                          className="btn btn-outline-apricot rounded-circle"
                          onClick={() => setCakeDesign(prev => ({ 
                            ...prev, 
                            layers: Math.min(5, prev.layers + 1) 
                          }))}
                          disabled={cakeDesign.layers >= 5}
                          style={{ width: '50px', height: '50px' }}
                        >
                          <i className="bi bi-plus fs-4"></i>
                        </button>
                      </div>
                      
                      <div className="glass-card p-3">
                        <div className="text-muted small mb-2">Layer Pricing:</div>
                        <div className="d-flex justify-content-between">
                          <span>2 layers (included)</span>
                          <span>Free</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Each additional layer</span>
                          <span>+{formatLKR(900)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="glass-card p-4">
                <div className="mb-4">
                  <h5 className="text-chocolate mb-3">Add Decorations & Toppings</h5>
                  <p className="text-muted small mb-0">
                    Select up to 5 toppings. Each adds {formatLKR(600)} to {formatLKR(2400)} to your total.
                  </p>
                </div>
                
                <div className="row g-3">
                  {toppings.map(topping => {
                    const isSelected = cakeDesign.toppings.includes(topping.id);
                    return (
                      <div key={topping.id} className="col-md-6 col-lg-4">
                        <div 
                          className={`card h-100 cursor-pointer ${isSelected ? 'border-sprinkle-blue border-3' : 'border-light'}`}
                          onClick={() => toggleTopping(topping.id)}
                          style={{ transition: 'all 0.3s' }}
                        >
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div className="rounded-circle bg-sprinkle-blue bg-opacity-10 p-2">
                                <i className={`bi ${topping.icon} fs-4 text-sprinkle-blue`}></i>
                              </div>
                              <span className="badge bg-sprinkle-blue">+{formatLKR(topping.priceLKR)}</span>
                            </div>
                            <h6 className="card-title">{topping.name}</h6>
                            <p className="card-text text-muted small">{topping.description}</p>
                            {isSelected && (
                              <div className="text-success small">
                                <i className="bi bi-check-circle-fill me-1"></i>
                                Added
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="glass-card p-4">
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5 className="text-chocolate mb-3">Add a Custom Message</h5>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="E.g., Happy Birthday Sarah!"
                        value={cakeDesign.message}
                        onChange={(e) => setCakeDesign(prev => ({ ...prev, message: e.target.value }))}
                        maxLength={30}
                      />
                      <div className="d-flex justify-content-between mt-2">
                        <small className="text-muted">Maximum 30 characters</small>
                        <small className={cakeDesign.message.length === 30 ? 'text-danger' : 'text-muted'}>
                          {cakeDesign.message.length}/30
                        </small>
                      </div>
                    </div>
                    
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Your message will be written on top of the cake using edible ink.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <h5 className="text-chocolate mb-3">Customize Colors</h5>
                    <div className="mb-3">
                      <label className="form-label">Cake Color</label>
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={cakeDesign.colors.cake}
                          onChange={(e) => handleColorChange('cake', e.target.value)}
                          style={{ width: '60px', height: '60px' }}
                        />
                        <div>
                          <div className="small text-muted">Main cake layers color</div>
                          <div className="small text-muted">Default: Chocolate Brown</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Frosting Color</label>
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={cakeDesign.colors.frosting}
                          onChange={(e) => handleColorChange('frosting', e.target.value)}
                          style={{ width: '60px', height: '60px' }}
                        />
                        <div>
                          <div className="small text-muted">Frosting and between layers</div>
                          <div className="small text-muted">Default: Cream White</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="form-label">Decoration Color</label>
                      <div className="d-flex align-items-center gap-3">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={cakeDesign.colors.decorations}
                          onChange={(e) => handleColorChange('decorations', e.target.value)}
                          style={{ width: '60px', height: '60px' }}
                        />
                        <div>
                          <div className="small text-muted">Toppings and accents color</div>
                          <div className="small text-muted">Default: Strawberry Pink</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn btn-outline-chocolate"
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Previous Step
              </button>
              
              <div className="d-flex gap-2">
                {activeStep < 5 ? (
                  <button 
                    className="btn btn-apricot"
                    onClick={() => setActiveStep(prev => Math.min(5, prev + 1))}
                  >
                    Next Step
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button 
                    className="btn btn-frosting"
                    onClick={handleSaveDesign}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : `Complete Design & Order (${formatLKR(priceDetails.totalLKR)})`}
                  </button>
                )}
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-chocolate mb-3">Need Inspiration? Try Our Templates</h4>
              <div className="row g-3">
                {templates.map((template, index) => (
                  <div key={index} className="col-md-4">
                    <div 
                      className="glass-card p-3 cursor-pointer"
                      onClick={() => {
                        setCakeDesign(prev => ({
                          ...prev,
                          ...template.design
                        }));
                        setActiveStep(5);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0">{template.name}</h6>
                        <span className="badge bg-lavender">Quick Apply</span>
                      </div>
                      <p className="text-muted small mb-3">{template.description}</p>
                      <div className="d-flex gap-1">
                        {template.design.toppings.map(toppingId => (
                          <span key={toppingId} className="badge bg-sprinkle-blue">
                            {toppings.find(t => t.id === toppingId)?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="glass-card p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="text-chocolate mb-2">Need Help Designing?</h5>
              <p className="text-muted mb-0">
                Our cake experts are available to help you create the perfect cake.
                Call us at <strong>0743 086099</strong> for personalized assistance.
              </p>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-chocolate">
                <i className="bi bi-chat-dots me-2"></i>
                Live Chat Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;