import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import SidebarNav from './components/SidebarNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RequireAuth from './components/RequireAuth';

// Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import BuilderPage from './pages/BuilderPage';
import OrderPage from './pages/OrderPage';
import SuccessPage from './pages/SuccessPage';
import LoginSelectionPage from './pages/LoginSelectionPage';
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ShopRegistrationPage from './pages/ShopRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage';
import CartPage from './pages/CartPage';

// Shop Owner Pages
import ShopOwnerDashboard from './pages/ShopOwnerDashboard';
import ShopOrdersPage from './pages/ShopOrdersPage';
import ShopCakesPage from './pages/ShopCakesPage';
import ShopSettingsPage from './pages/ShopSettingsPage';

// Public Shop Pages
import PublicShopPage from './pages/PublicShopPage';
import AllShopsPage from './pages/AllShopsPage';

// Add Google Fonts
const addGoogleFonts = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Check if current route is shop owner route (no sidebar)
  const isShopOwnerRoute = location.pathname.startsWith('/shop/') || 
                           location.pathname === '/shop' ||
                           location.pathname === '/admin/login' ||
                           location.pathname === '/admin';

  // Check if current route is public shop view
  const isPublicShopRoute = location.pathname.startsWith('/shops/');

  return (
    <div className={!isShopOwnerRoute && !isPublicShopRoute ? "d-flex" : ""}>
      {/* Only show sidebar for non-shop routes and non-public shop routes */}
      {!isShopOwnerRoute && !isPublicShopRoute && <SidebarNav />}
      
      <div className={!isShopOwnerRoute && !isPublicShopRoute ? "main-content" : ""} 
           style={!isShopOwnerRoute && !isPublicShopRoute ? {
             flex: 1,
             marginLeft: '88px',
             width: 'calc(100% - 88px)',
             minHeight: '100vh',
             display: 'flex',
             flexDirection: 'column'
           } : { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ flex: 1 }}>
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/create" element={<BuilderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* Public Shop Viewing Routes */}
            <Route path="/shops" element={<AllShopsPage />} />
            <Route path="/shops/:shopSlug" element={<PublicShopPage />} />

            {/* ========== AUTH ROUTES ========== */}
            <Route path="/register" element={<UserTypeSelectionPage />} />
            <Route path="/register/customer" element={<RegisterPage />} />
            <Route path="/register/shop" element={<ShopRegistrationPage />} />
            <Route path="/login-selection" element={<LoginSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/customer" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ========== CUSTOMER PROTECTED ROUTES ========== */}
            <Route path="/order" element={
              <RequireAuth>
                <OrderPage />
              </RequireAuth>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />

            <Route path="/my-orders" element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            } />

            {/* ========== SHOP OWNER ROUTES ========== */}
            <Route path="/shop/dashboard" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopOwnerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/shop/orders" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopOrdersPage />
              </ProtectedRoute>
            } />

            <Route path="/shop/cakes" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopCakesPage />
              </ProtectedRoute>
            } />

            <Route path="/shop/settings" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopSettingsPage />
              </ProtectedRoute>
            } />

            <Route path="/shop/register" element={
              <ProtectedRoute requiredRole="shop_owner">
                <ShopRegistrationPage />
              </ProtectedRoute>
            } />

            {/* ========== ADMIN ROUTES ========== */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="super_admin">
                <AdminPage />
              </ProtectedRoute>
            } />

            {/* ========== 404 ========== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        {/* Only show footer for non-shop routes */}
        {!isShopOwnerRoute && !isPublicShopRoute && <Footer />}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    addGoogleFonts();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

// 404 Component
const NotFound = () => (
  <div className="container py-5 text-center">
    <div className="py-5">
      <div className="display-1 mb-3" style={{ fontSize: '6rem' }}>🍰</div>
      <h1 className="display-1 fw-bold" style={{ color: '#FF6B8B' }}>404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-secondary mb-4">The page you're looking for doesn't exist or has been moved.</p>
      <button
        className="btn btn-lg rounded-pill px-5 py-3"
        style={{
          background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
          border: 'none',
          color: 'white'
        }}
        onClick={() => window.location.href = '/'}
      >
        <i className="bi bi-house-door me-2"></i>
        Back to Home
      </button>
    </div>
  </div>
);

export default App;