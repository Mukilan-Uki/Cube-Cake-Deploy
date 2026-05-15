import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import SidebarNav from "./components/SidebarNav";
import ShopSidebarNav from "./components/ShopSidebarNav";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireAuth from "./components/RequireAuth";

// Pages
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import BuilderPage from "./pages/BuilderPage";
import OrderPage from "./pages/OrderPage";
import SuccessPage from "./pages/SuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShopRegistrationPage from "./pages/ShopRegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";

// Shop Owner Pages
import ShopOwnerDashboard from "./pages/ShopOwnerDashboard";
import ShopOrdersPage from "./pages/ShopOrdersPage";
import ShopCakesPage from "./pages/ShopCakesPage";
import ShopSettingsPage from "./pages/ShopSettingsPage";
import ShopOwnerCakesPage from "./pages/ShopOwnerCakesPage";

// Public Shop Pages
import PublicShopPage from "./pages/PublicShopPage";
import AllShopsPage from "./pages/AllShopsPage";

const addGoogleFonts = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const isShopManagementRoute =
    location.pathname.startsWith("/shop/") || location.pathname === "/shop";
  const isAdminRoute = location.pathname === "/admin";
  const isPublicShopRoute = location.pathname.startsWith("/shops/");
  const isAuthRoute = [
    "/login-selection",
    "/register",
    "/register/shop",
  ].includes(location.pathname);
  const isShopOwnerRoute = isShopManagementRoute || isAdminRoute;
  const showSidebar = !isShopOwnerRoute && !isPublicShopRoute;

  // Shop/Admin layout: collapsible sidebar sits in normal flow beside content
  if (isShopOwnerRoute) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <ShopSidebarNav />
        <div
          className="app-main-content"
          style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}
        >
          <div className="mobile-navbar-wrapper">
            <Navbar />
          </div>
          <Routes>
            <Route
              path="/shop/dashboard"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopOwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/orders"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/cakes"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopCakesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/my-cakes"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopOwnerCakesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/settings"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shop/register"
              element={
                <ProtectedRoute requiredRole="shop_owner">
                  <ShopRegistrationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    );
  }

  // Customer/public layout: SidebarNav is position:fixed, so offset content with marginLeft
  return (
    <div className="app-root" style={{ minHeight: "100vh" }}>
      {showSidebar && <SidebarNav />}
      <div className="mobile-navbar-wrapper">
        <Navbar />
      </div>
      <div
        className="app-main-content"
        style={{
          marginLeft: showSidebar ? "88px" : 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/create" element={<BuilderPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/shops" element={<AllShopsPage />} />
            <Route path="/shops/:shopSlug" element={<PublicShopPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/shop" element={<ShopRegistrationPage />} />
            <Route path="/login-selection" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/order"
              element={
                <RequireAuth>
                  <OrderPage />
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        {!isPublicShopRoute && !isAuthRoute && <Footer />}
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

const NotFound = () => (
  <div className="container py-5 text-center">
    <div className="py-5">
      <div className="display-1 mb-3" style={{ fontSize: "6rem" }}>
        🍰
      </div>
      <h1 className="display-1 fw-bold" style={{ color: "#FF6B8B" }}>
        404
      </h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-secondary mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        className="btn btn-lg rounded-pill px-5 py-3"
        style={{
          background: "linear-gradient(135deg, #FF9E6D, #FF6B8B)",
          border: "none",
          color: "white",
        }}
        onClick={() => (window.location.href = "/")}
      >
        <i className="bi bi-house-door me-2"></i>Back to Home
      </button>
    </div>
  </div>
);

export default App;
