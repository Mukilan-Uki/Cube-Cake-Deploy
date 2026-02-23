// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
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

  return (
    <div className="d-flex">
      <SidebarNav />
      <div className="main-content" style={{
        flex: 1,
        marginLeft: '80px',
        width: 'calc(100% - 80px)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/create" element={<BuilderPage />} />
            <Route path="/success" element={<SuccessPage />} />
            
            {/* Auth Routes */}
            <Route path="/register" element={<UserTypeSelectionPage />} />
            <Route path="/register/customer" element={<RegisterPage />} />
            <Route path="/register/shop" element={<ShopRegistrationPage />} />
            <Route path="/login-selection" element={<LoginSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login/customer" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Routes */}
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

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminPage />
              </ProtectedRoute>
            } />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    addGoogleFonts();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
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