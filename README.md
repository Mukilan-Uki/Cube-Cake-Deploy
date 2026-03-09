# Cube Cake - Multi-Vendor Cake Marketplace

A modern, full-stack web application that connects customers with local cake shops. Customers can browse, customize, and order cakes while shop owners manage their inventory and orders through an intuitive dashboard.

## Features

### Customer Features
- **Browse Cakes**: View all available cakes from partner shops
- **Custom Cake Builder**: Design your own custom cakes with interactive builder
- **Shopping Cart**: Add cakes to cart and manage quantities
- **Order Tracking**: Track orders in real-time
- **Shop Profiles**: View detailed information about cake shops
- **User Profiles**: Manage account settings and view order history

### Shop Owner Features
- **Dashboard**: Overview of orders, revenue, and shop analytics
- **Inventory Management**: Add, edit, and manage cake listings
- **Order Management**: View, confirm, and update order statuses
- **Shop Settings**: Configure shop details, delivery fees, and preparation times
- **Sales Analytics**: Track revenue and order statistics

### Admin Features
- **User Management**: Manage customers and shop owners
- **Platform Analytics**: View overall platform statistics
- **Order Oversight**: Monitor all orders across the platform

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation and routing
- **Bootstrap 5** - UI components and styling
- **Bootstrap Icons** - Icon library
- **Context API** - State management (Auth & Cart)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM for MongoDB

## Project Structure

```
Cube Cake Deploy/
├── cake-shop-backend-v2/
│   ├── config/              # Database configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Auth and error handling
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── utils/               # Helper functions
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
│
└── cake-shop-frontend-v2/
    ├── src/
    │   ├── components/      # Reusable React components
    │   ├── pages/           # Page components
    │   ├── context/         # React Context (Auth, Cart)
    │   ├── config/          # App configuration
    │   ├── utils/           # Helper functions
    │   ├── App.js           # Main app component
    │   └── index.js         # React entry point
    └── public/              # Static files
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Cube Cake Deploy"
   ```

2. **Setup Backend**
   ```bash
   cd cake-shop-backend-v2
   npm install
   
   # Create .env file with:
   # MONGODB_URI=your_mongodb_connection_string
   # JWT_SECRET=your_jwt_secret
   # PORT=5000
   
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd cake-shop-frontend-v2
   npm install
   npm start
   ```

The frontend will open at `http://localhost:3002` and the backend API will be at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new customer
- `POST /auth/login` - Login customer
- `POST /auth/register-shop` - Register shop owner
- `PUT /auth/profile` - Update user profile

### Public Routes
- `GET /public/cakes` - Get all cakes
- `GET /public/shops` - Get all shops
- `GET /public/shops/:slug` - Get shop details

### Cakes (Shop Owner)
- `GET /shops/cakes` - Get shop's cakes
- `POST /shops/cakes` - Create new cake
- `PUT /shops/cakes/:id` - Update cake
- `DELETE /shops/cakes/:id` - Delete cake

### Orders
- `GET /orders` - Get customer orders
- `POST /orders` - Create order
- `GET /shops/orders` - Get shop orders
- `PUT /shops/orders/:id/status` - Update order status

### Shop Settings
- `GET /shops/settings` - Get shop settings
- `PUT /shops/settings` - Update shop settings

### Admin
- `GET /admin/stats` - Get platform statistics
- `GET /admin/users` - Get all users
- `PATCH /admin/users/:id/toggle` - Activate/deactivate user

## Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored in localStorage and sent with API requests via the Authorization header.

**User Roles:**
- `customer` - Regular customer
- `shop_owner` - Shop owner
- `super_admin` - Platform administrator

## Styling

The frontend uses:
- **CSS Variables** for consistent theming
- **Bootstrap 5** for responsive layouts
- **Custom CSS** for unique components

## Dependencies

### Key Frontend Dependencies
- react, react-dom, react-router-dom
- bootstrap, bootstrap-icons
- axios or fetch API

### Key Backend Dependencies
- express
- mongoose
- jsonwebtoken
- bcryptjs
- dotenv

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin main`)
4. Open a Pull Request

## License

This project is private and not licensed for public use.

## Author

Built with for Cube Cake

---

**Happy Coding!**
