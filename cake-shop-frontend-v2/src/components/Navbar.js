import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { path: "/", label: "Home", icon: "bi-house-door" },
    { path: "/gallery", label: "Gallery", icon: "bi-grid-3x3-gap" },
    { path: "/create", label: "Design Studio", icon: "bi-palette" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: "rgba(250,250,248,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(13,13,13,0.08)",
        padding: "0.85rem 0",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div
            style={{
              width: 40,
              height: 40,
              background: "#0D0D0D",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i
              className="bi bi-cake2 text-white"
              style={{ fontSize: "1.2rem" }}
            ></i>
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#0D0D0D",
              letterSpacing: "-0.02em",
            }}
          >
            Cube<span style={{ color: "#C9933A" }}>Cake</span>
          </span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mx-1">
                <Link
                  to={item.path}
                  className="nav-link px-3 py-2 d-flex align-items-center"
                  style={{
                    color:
                      location.pathname === item.path ? "#0D0D0D" : "#5A5A5A",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: "0.92rem",
                    transition: "all 0.2s ease",
                    borderRadius: 8,
                    background:
                      location.pathname === item.path
                        ? "rgba(13,13,13,0.06)"
                        : "transparent",
                    position: "relative",
                  }}
                >
                  <i
                    className={`bi ${item.icon} me-2`}
                    style={{ fontSize: "0.85rem" }}
                  ></i>
                  {item.label}
                  {location.pathname === item.path && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 20,
                        height: 2,
                        background: "#C9933A",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    background: "transparent",
                    border: "1.5px solid #E2E0DB",
                    borderRadius: 50,
                    padding: "0.4rem 1rem 0.4rem 0.4rem",
                    textDecoration: "none",
                    color: "#0D0D0D",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#0D0D0D")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#E2E0DB")
                  }
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#0D0D0D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FAFAF8",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase() || "?"}</span>
                    )}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: "0.88rem" }}>
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>

                <div className="dropdown">
                  <button
                    className="btn"
                    style={{
                      background: "transparent",
                      border: "1.5px solid #E2E0DB",
                      borderRadius: 50,
                      padding: "0.4rem 0.65rem",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "#0D0D0D")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "#E2E0DB")
                    }
                    data-bs-toggle="dropdown"
                  >
                    <i
                      className="bi bi-chevron-down"
                      style={{ fontSize: "0.75rem" }}
                    ></i>
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-2"
                    style={{ minWidth: 180 }}
                  >
                    <li>
                      <Link
                        className="dropdown-item rounded-2 py-2"
                        to="/my-orders"
                        style={{ fontSize: "0.88rem" }}
                      >
                        <i className="bi bi-box me-2"></i> My Orders
                      </Link>
                    </li>
                    {user?.role === "super_admin" && (
                      <li>
                        <Link
                          className="dropdown-item rounded-2 py-2"
                          to="/admin"
                          style={{ fontSize: "0.88rem" }}
                        >
                          <i className="bi bi-speedometer2 me-2"></i> Admin
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item rounded-2 py-2 text-danger"
                        onClick={handleLogout}
                        style={{ fontSize: "0.88rem" }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>

                <Link
                  to="/order"
                  className="btn"
                  style={{
                    background: "#0D0D0D",
                    borderRadius: 50,
                    padding: "0.5rem 1.25rem",
                    color: "#FAFAF8",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    border: "none",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1E1E1E";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0D0D0D";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <i className="bi bi-bag me-1"></i>Cart
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login-selection"
                  className="btn"
                  style={{
                    background: "#0D0D0D",
                    borderRadius: 50,
                    padding: "0.5rem 1.3rem",
                    color: "#FAFAF8",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    border: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#1E1E1E";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0D0D0D";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="btn"
                  style={{
                    background: "transparent",
                    border: "1.5px solid #0D0D0D",
                    borderRadius: 50,
                    padding: "0.5rem 1.3rem",
                    color: "#0D0D0D",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0D0D0D";
                    e.currentTarget.style.color = "#FAFAF8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#0D0D0D";
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
