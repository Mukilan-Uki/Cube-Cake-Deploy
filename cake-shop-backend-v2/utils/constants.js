// Order statuses
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected'
};

// Payment statuses
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Payment methods
const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online'
};

// Delivery types
const DELIVERY_TYPES = {
  PICKUP: 'pickup',
  DELIVERY: 'delivery'
};

// User roles
const USER_ROLES = {
  CUSTOMER: 'customer',
  SHOP_OWNER: 'shop_owner',
  SUPER_ADMIN: 'super_admin'
};

// Business types
const BUSINESS_TYPES = {
  BAKERY: 'bakery',
  CAFE: 'cafe',
  HOME_BUSINESS: 'home_business',
  PATISSERIE: 'patisserie'
};

// Cake sizes
const CAKE_SIZES = {
  SMALL: { id: 'small', name: 'Small', price: 8997, serves: '4-6 people' },
  MEDIUM: { id: 'medium', name: 'Medium', price: 11997, serves: '8-10 people' },
  LARGE: { id: 'large', name: 'Large', price: 17997, serves: '12-15 people' },
  XL: { id: 'xl', name: 'Extra Large', price: 23997, serves: '20+ people' }
};

// Cake bases
const CAKE_BASES = {
  CHOCOLATE: { id: 'chocolate', name: 'Chocolate', price: 2500 },
  VANILLA: { id: 'vanilla', name: 'Vanilla', price: 2000 },
  RED_VELVET: { id: 'red-velvet', name: 'Red Velvet', price: 3000 },
  CARROT: { id: 'carrot', name: 'Carrot', price: 2800 },
  LEMON: { id: 'lemon', name: 'Lemon', price: 2200 }
};

// Frostings
const FROSTINGS = {
  VANILLA: { id: 'vanilla', name: 'Vanilla Buttercream', price: 1500 },
  CHOCOLATE: { id: 'chocolate', name: 'Chocolate Ganache', price: 2000 },
  CREAM_CHEESE: { id: 'cream-cheese', name: 'Cream Cheese', price: 1800 },
  STRAWBERRY: { id: 'strawberry', name: 'Strawberry', price: 1600 },
  MATCHA: { id: 'matcha', name: 'Matcha', price: 2200 }
};

// Toppings
const TOPPINGS = {
  SPRINKLES: { id: 'sprinkles', name: 'Rainbow Sprinkles', price: 800 },
  BERRIES: { id: 'berries', name: 'Fresh Berries', price: 1800 },
  FLOWERS: { id: 'flowers', name: 'Edible Flowers', price: 2200 },
  CHOCOLATE_CHIPS: { id: 'chocolate-chips', name: 'Chocolate Chips', price: 1200 },
  NUTS: { id: 'nuts', name: 'Crushed Nuts', price: 1200 },
  GOLD_LEAF: { id: 'gold-leaf', name: 'Gold Leaf', price: 3500 }
};

module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  DELIVERY_TYPES,
  USER_ROLES,
  BUSINESS_TYPES,
  CAKE_SIZES,
  CAKE_BASES,
  FROSTINGS,
  TOPPINGS
};