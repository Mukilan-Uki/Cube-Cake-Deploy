import { formatLKR } from '../config/currency';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

// Canvas helper functions
const adjustColor = (hex, amount) => {
  try {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
    const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch { return hex; }
};

const roundedRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

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
  const [pricingData, setPricingData] = useState(null);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch('/api/designing-data');
        const data = await response.json();
        setPricingData(data);

        // Ensure initial cakeDesign IDs match what's available in data
        if (data.bases?.length > 0 && !data.bases.find(b => b.id === cakeDesign.base)) {
          setCakeDesign(prev => ({ ...prev, base: data.bases[0].id }));
        }
        if (data.frostings?.length > 0 && !data.frostings.find(f => f.id === cakeDesign.frosting)) {
          setCakeDesign(prev => ({ ...prev, frosting: data.frostings[0].id }));
        }
        if (data.sizes?.length > 0 && !data.sizes.find(s => s.id === cakeDesign.size)) {
          setCakeDesign(prev => ({ ...prev, size: data.sizes[0].id }));
          setShowPreview(true);
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error);
      }
    };

    fetchPricingData();
  });

  // Use pricingData if available, otherwise empty arrays
  const sizes = pricingData?.sizes || [];
  const cakeBases = pricingData?.bases || [];
  const frostings = pricingData?.frostings || [];
  const toppings = pricingData?.toppings || [];

  // Fixed price calculation function
  const calculatePrice = () => {
    // Return default if data not loaded
    if (!pricingData || sizes.length === 0) {
      return {
        totalLKR: 0,
        breakdown: { base: 0, cakeType: 0, frosting: 0, toppings: 0, layers: 0 }
      };
    }

    try {
      // Base price from size
      const sizeData = Array.isArray(sizes) ? (sizes.find(s => s.id === cakeDesign.size) || sizes[0]) : null;
      const basePriceLKR = sizeData?.priceLKR || 0;

      // Cake base flavor price
      const baseCakeLKR = Array.isArray(cakeBases) ? (cakeBases.find(b => b.id === cakeDesign.base)?.priceLKR || 0) : 0;

      // Frosting price
      const frostingPriceLKR = Array.isArray(frostings) ? (frostings.find(f => f.id === cakeDesign.frosting)?.priceLKR || 0) : 0;

      // Toppings price
      const toppingsPriceLKR = (Array.isArray(cakeDesign.toppings) && Array.isArray(toppings))
        ? cakeDesign.toppings.reduce((total, toppingId) => {
          const topping = toppings.find(t => t.id === toppingId);
          return total + (topping?.priceLKR || 0);
        }, 0)
        : 0;

      // Extra layers price (first 2 layers are included)
      const extraLayers = Math.max(0, cakeDesign.layers - 2);
      const layersPriceLKR = extraLayers * (pricingData?.extraLayerPrice || 1500);

      // Calculate total
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
    } catch (err) {
      console.error('Error calculating price:', err);
      return {
        totalLKR: 0,
        breakdown: { base: 0, cakeType: 0, frosting: 0, toppings: 0, layers: 0 }
      };
    }
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

    const cakeWidth = 220;
    const layerH = 55;
    const cakeHeight = cakeDesign.layers * layerH;
    const cakeX = (canvas.width - cakeWidth) / 2;
    const baseY = canvas.height - 80;
    const cakeTopY = baseY - cakeHeight;

    // Draw shadow/plate
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, baseY + 10, cakeWidth / 2 + 20, 14, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fill();
    ctx.restore();

    // Draw each layer with 3D-ish effect
    for (let i = cakeDesign.layers - 1; i >= 0; i--) {
      const layerY = cakeTopY + i * layerH;

      // Side shadow
      ctx.save();
      const sideGrad = ctx.createLinearGradient(cakeX, 0, cakeX + cakeWidth, 0);
      sideGrad.addColorStop(0, 'rgba(0,0,0,0.2)');
      sideGrad.addColorStop(0.15, 'rgba(0,0,0,0)');
      sideGrad.addColorStop(0.85, 'rgba(0,0,0,0)');
      sideGrad.addColorStop(1, 'rgba(0,0,0,0.25)');

      // Main layer
      const layerGrad = ctx.createLinearGradient(cakeX, layerY, cakeX, layerY + layerH);
      layerGrad.addColorStop(0, cakeDesign.colors.cake);
      layerGrad.addColorStop(0.3, adjustColor(cakeDesign.colors.cake, 30));
      layerGrad.addColorStop(1, adjustColor(cakeDesign.colors.cake, -30));
      ctx.fillStyle = layerGrad;
      roundedRect(ctx, cakeX, layerY, cakeWidth, layerH, 6);
      ctx.fill();

      // Overlay shadow
      ctx.fillStyle = sideGrad;
      roundedRect(ctx, cakeX, layerY, cakeWidth, layerH, 6);
      ctx.fill();

      // Top highlight
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      roundedRect(ctx, cakeX + 4, layerY + 2, cakeWidth - 8, 8, 3);
      ctx.fill();

      // Frosting between layers
      if (i > 0) {
        const frostGrad = ctx.createLinearGradient(cakeX, layerY - 6, cakeX, layerY + 2);
        frostGrad.addColorStop(0, cakeDesign.colors.frosting);
        frostGrad.addColorStop(1, adjustColor(cakeDesign.colors.frosting, -20));
        ctx.fillStyle = frostGrad;
        roundedRect(ctx, cakeX + 2, layerY - 5, cakeWidth - 4, 8, 3);
        ctx.fill();
      }
      ctx.restore();
    }

    // Top frosting (wavy drips)
    const topY = cakeTopY;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cakeX, topY);
    for (let x = cakeX; x <= cakeX + cakeWidth; x += 8) {
      const wave = Math.sin((x - cakeX) / 18) * 6;
      ctx.lineTo(x, topY - 12 + wave);
    }
    ctx.lineTo(cakeX + cakeWidth, topY);
    ctx.lineTo(cakeX, topY);
    ctx.closePath();
    const frostGrad = ctx.createLinearGradient(0, topY - 18, 0, topY + 4);
    frostGrad.addColorStop(0, cakeDesign.colors.frosting);
    frostGrad.addColorStop(1, adjustColor(cakeDesign.colors.frosting, -15));
    ctx.fillStyle = frostGrad;
    ctx.fill();
    ctx.restore();

    // Drips on sides
    for (let d = 0; d < 5; d++) {
      const drx = cakeX + 20 + d * 40 + Math.sin(d * 2.3) * 10;
      const drLen = 15 + Math.sin(d * 1.7) * 10;
      ctx.save();
      ctx.fillStyle = cakeDesign.colors.frosting;
      ctx.beginPath();
      ctx.ellipse(drx, topY + drLen / 2, 5, drLen / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw toppings
    const toppingColors = {
      'sprinkles': ['#FF6B8B', '#FF9E6D', '#9D5CFF', '#4CAF50', '#FFD700'],
      'berries': '#CC2200',
      'flowers': '#FF69B4',
      'chocolate-chips': '#3B1A08',
      'nuts': '#8B6914',
      'gold-leaf': '#D4AF37'
    };

    cakeDesign.toppings.forEach(toppingId => {
      ctx.save();
      if (toppingId === 'sprinkles') {
        const colors = toppingColors.sprinkles;
        for (let s = 0; s < 20; s++) {
          ctx.fillStyle = colors[s % colors.length];
          const sx = cakeX + 15 + Math.random() * (cakeWidth - 30);
          const sy = topY - 5 + Math.random() * 8;
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(Math.random() * Math.PI);
          ctx.fillRect(-4, -1.5, 8, 3);
          ctx.restore();
        }
      } else if (toppingId === 'berries') {
        for (let b = 0; b < 7; b++) {
          const bx = cakeX + 20 + b * 26 + (b % 2) * 10;
          const by = topY - 10;
          ctx.beginPath();
          ctx.arc(bx, by, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#CC2200';
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.arc(bx - 2, by - 2, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#228B22';
          ctx.fillRect(bx - 1, by - 13, 2, 6);
        }
      } else if (toppingId === 'flowers') {
        for (let f = 0; f < 5; f++) {
          const fx = cakeX + 25 + f * 38;
          const fy = topY - 12;
          for (let p = 0; p < 5; p++) {
            const angle = (p / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(fx + Math.cos(angle) * 6, fy + Math.sin(angle) * 6, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#FF69B4';
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(fx, fy, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
        }
      } else if (toppingId === 'chocolate-chips') {
        for (let c = 0; c < 12; c++) {
          const cx2 = cakeX + 15 + Math.random() * (cakeWidth - 30);
          const cy = topY - 4 + Math.random() * 6;
          ctx.beginPath();
          ctx.arc(cx2, cy, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#3B1A08';
          ctx.fill();
        }
      } else if (toppingId === 'gold-leaf') {
        ctx.globalAlpha = 0.85;
        for (let g = 0; g < 6; g++) {
          const gx = cakeX + 20 + g * 30 + Math.sin(g) * 8;
          const gy = topY - 8;
          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(Math.random() * 0.5 - 0.25);
          const leafGrad = ctx.createLinearGradient(-10, -5, 10, 5);
          leafGrad.addColorStop(0, '#D4AF37');
          leafGrad.addColorStop(0.5, '#F1D06E');
          leafGrad.addColorStop(1, '#B8860B');
          ctx.fillStyle = leafGrad;
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
    });

    // Message
    if (cakeDesign.message) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = adjustColor(cakeDesign.colors.cake, -80);
      ctx.font = 'bold 13px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(cakeDesign.message.substring(0, 22), canvas.width / 2, cakeTopY + cakeHeight / 2 + 5);
      ctx.restore();
    }
  }, [cakeDesign, pricingData]);

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

  if (!pricingData) {
    return (
      <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-cream">
        <div className="spinner-border text-primary-gradient mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h5 className="text-chocolate animate-pulse">Setting up your Cake Studio...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="bg-cream py-3 sticky-top" style={{ zIndex: 4000 }}>
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
                      height={400}
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
                  {Array.isArray(cakeBases) && cakeBases.map(base => (
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
                  {Array.isArray(frostings) && frostings.map(frosting => (
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
                    {Array.isArray(sizes) && sizes.map(size => (
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
                        {/* Base price includes 2 layers. Extra layers: +{formatLKR(PRICING.EXTRA_LAYER_PRICE)} each */}
                        Base price includes 2 layers. Extra layers: +{formatLKR(pricingData?.extraLayerPrice || 1500)} each
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
                  {Array.isArray(toppings) && toppings.map(topping => (
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