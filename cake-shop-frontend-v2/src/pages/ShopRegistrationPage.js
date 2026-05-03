import { API_CONFIG } from "../config";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ShopRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    businessType: "bakery",
  });
  const [error, setError] = useState("");
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { checkEmailAvailability } = useAuth();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setEmailChecking(true);
        const result = await checkEmailAvailability(formData.email);
        if (!result.isAvailable) {
          setEmailError("This email is already taken");
        } else {
          setEmailError("");
        }
        setEmailChecking(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.email, checkEmailAvailability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (emailError) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        API_CONFIG.BASE_URL + "/auth/register-shop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      } else if (data.success) {
        // Save token and user data
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        navigate("/shop/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="card shadow border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <i className="bi bi-shop fs-1 text-primary"></i>
              <h2 className="mt-3">Register Your Shop</h2>
              <p className="text-muted">Start selling your cakes online</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Shop Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.shopName}
                  onChange={(e) =>
                    setFormData({ ...formData, shopName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <div className="position-relative">
                    <input
                      type="email"
                      className={`form-control ${emailError ? "is-invalid" : ""}`}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                    {emailChecking && (
                      <div
                        className="position-absolute"
                        style={{
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        ></div>
                      </div>
                    )}
                    {!emailChecking &&
                      formData.email &&
                      !emailError &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                        <i
                          className="bi bi-check-circle-fill text-success position-absolute"
                          style={{
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        ></i>
                      )}
                    {emailError && (
                      <div className="invalid-feedback">{emailError}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Business Address *</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Business Type</label>
                <select
                  className="form-select"
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                >
                  <option value="bakery">Bakery</option>
                  <option value="cafe">Cafe</option>
                  <option value="home_business">Home Business</option>
                  <option value="patisserie">Patisserie</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength="6"
                />
                <small className="text-muted">Minimum 6 characters</small>
              </div>

              <div className="mb-4">
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength="6"
                />
                <small className="text-muted">Minimum 6 characters</small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Registering...
                  </>
                ) : (
                  "Register Shop"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="mb-0">
                Already have a shop?{" "}
                <button
                  className="btn btn-link p-0"
                  onClick={() => navigate("/login-selection")}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationPage;
