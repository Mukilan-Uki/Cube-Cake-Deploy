import { formatLKR } from '../config/currency';

export const cakeData = [
  {
    id: 1,
    name: "Chocolate Dream",
    description: "Rich dark chocolate cake with creamy chocolate ganache and chocolate shavings",
    priceLKR: 13797.00,
    category: "Birthday",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    rating: 4.8,
    flavors: ["Chocolate", "Dark Chocolate"],
    sizes: ["Small", "Medium", "Large"],
    isPopular: true,
    isNew: false
  },
  {
    id: 2,
    name: "Vanilla Elegance",
    description: "Classic vanilla sponge with buttercream frosting and fresh berries",
    priceLKR: 11997.00,
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop",
    rating: 4.6,
    flavors: ["Vanilla", "Buttercream"],
    sizes: ["Medium", "Large"],
    isPopular: true,
    isNew: false
  },
  {
    id: 3,
    name: "Strawberry Bliss",
    description: "Fresh strawberry cake with cream cheese frosting and strawberry topping",
    priceLKR: 12897.00,
    category: "Anniversary",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop",
    rating: 4.9,
    flavors: ["Strawberry", "Cream Cheese"],
    sizes: ["Small", "Medium", "Large"],
    isPopular: true,
    isNew: true
  },
  {
    id: 4,
    name: "Red Velvet Royal",
    description: "Classic red velvet with cream cheese frosting and edible gold leaf",
    priceLKR: 14997.00,
    category: "Special",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
    rating: 4.9,
    flavors: ["Red Velvet", "Cream Cheese"],
    sizes: ["Medium", "Large"],
    isPopular: true,
    isNew: false
  }
];

export const cakeCategories = ["All", "Birthday", "Wedding", "Anniversary", "Special", "Spring"];