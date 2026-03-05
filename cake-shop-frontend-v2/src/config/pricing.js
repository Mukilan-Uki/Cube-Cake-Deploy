// src/config/pricing.js

export const PRICING = {
    // Base prices by cake size (in LKR)
    SIZES: [
        { id: 'small', name: 'Small', priceLKR: 8997.00, serves: '4-6 people', diameter: '6 inches' },
        { id: 'medium', name: 'Medium', priceLKR: 11997.00, serves: '8-10 people', diameter: '8 inches' },
        { id: 'large', name: 'Large', priceLKR: 17997.00, serves: '12-15 people', diameter: '10 inches' },
        { id: 'xl', name: 'Extra Large', priceLKR: 23997.00, serves: '20+ people', diameter: '12 inches' }
    ],

    // Additional costs for base flavors (in LKR)
    BASES: [
        { id: 'chocolate', name: 'Chocolate', priceLKR: 2500, color: '#8B4513', description: 'Rich chocolate flavor' },
        { id: 'vanilla', name: 'Vanilla', priceLKR: 2000, color: '#F3E5AB', description: 'Classic vanilla taste' },
        { id: 'red-velvet', name: 'Red Velvet', priceLKR: 3000, color: '#8B0000', description: 'Velvety red with cream cheese' },
        { id: 'carrot', name: 'Carrot', priceLKR: 2800, color: '#FF8C00', description: 'Moist with nuts and spices' },
        { id: 'lemon', name: 'Lemon', priceLKR: 2200, color: '#FFFACD', description: 'Tangy citrus flavor' }
    ],

    // Additional costs for frostings (in LKR)
    FROSTINGS: [
        { id: 'vanilla', name: 'Vanilla Buttercream', priceLKR: 1500, color: '#FFF5E6', description: 'Sweet and creamy' },
        { id: 'chocolate', name: 'Chocolate Ganache', priceLKR: 2000, color: '#4A2C2A', description: 'Rich chocolate coating' },
        { id: 'cream-cheese', name: 'Cream Cheese', priceLKR: 1800, color: '#FFFAF0', description: 'Tangy and smooth' },
        { id: 'strawberry', name: 'Strawberry', priceLKR: 1600, color: '#FFB6C1', description: 'Fruity and light' },
        { id: 'matcha', name: 'Matcha', priceLKR: 2200, color: '#98FB98', description: 'Japanese green tea flavor' }
    ],

    // Additional costs for toppings (in LKR)
    TOPPINGS: [
        { id: 'sprinkles', name: 'Rainbow Sprinkles', priceLKR: 800, icon: 'bi-stars', description: 'Colorful candy sprinkles' },
        { id: 'berries', name: 'Fresh Berries', priceLKR: 1800, icon: 'bi-berry', description: 'Strawberries, blueberries, raspberries' },
        { id: 'flowers', name: 'Edible Flowers', priceLKR: 2200, icon: 'bi-flower1', description: 'Natural floral decorations' },
        { id: 'chocolate-chips', name: 'Chocolate Chips', priceLKR: 1200, icon: 'bi-droplet', description: 'Dark, milk, white chocolate' },
        { id: 'nuts', name: 'Crushed Nuts', priceLKR: 1200, icon: 'bi-tree', description: 'Almonds, walnuts, pecans' },
        { id: 'gold-leaf', name: 'Gold Leaf', priceLKR: 3500, icon: 'bi-gem', description: 'Premium edible gold' }
    ],

    // Extra layer cost (after first 2)
    EXTRA_LAYER_PRICE: 1500,

    // Delivery configuration
    DELIVERY: {
        FEE: 1500.00,
        THRESHOLD_FREE: 0, // Set to 0 to always charge, or higher for free delivery
    }
};

// Helper function to calculate custom cake price
export const calculateCustomCakePrice = (design) => {
    const size = PRICING.SIZES.find(s => s.id === design.size) || PRICING.SIZES[1]; // default medium
    const base = PRICING.BASES.find(b => b.id === design.base) || { priceLKR: 0 };
    const frosting = PRICING.FROSTINGS.find(f => f.id === design.frosting) || { priceLKR: 0 };

    const toppingsPrice = (design.toppings || []).reduce((total, toppingId) => {
        const topping = PRICING.TOPPINGS.find(t => t.id === toppingId);
        return total + (topping?.priceLKR || 0);
    }, 0);

    const extraLayers = Math.max(0, (design.layers || 2) - 2);
    const layersPrice = extraLayers * PRICING.EXTRA_LAYER_PRICE;

    return size.priceLKR + base.priceLKR + frosting.priceLKR + toppingsPrice + layersPrice;
};
