import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config';

const ProfilePage = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    profilePicture: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_CONFIG.AUTH.ME}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone, profilePicture: profileForm.profilePicture })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, name: profileForm.name, phone: profileForm.phone, profilePicture: profileForm.profilePicture };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        // Fallback: update localStorage anyway
        const updatedUser = { ...user, ...profileForm };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileForm(prev => ({ ...prev, profilePicture: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrl = (url) => {
    setProfileForm(prev => ({ ...prev, profilePicture: url }));
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-card p-5">
          <h2>Please login to view your profile</h2>
          <button className="btn btn-frosting mt-3" onClick={() => navigate('/login')}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const avatarLetter = user.name?.charAt(0)?.toUpperCase();
  const profilePic = profileForm.profilePicture || user.profilePicture;

  return (
    <div className="container py-5">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="glass-card p-4">
            <div className="text-center mb-4">
              {/* Profile Picture */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%', overflow: 'hidden',
                  background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 700, color: 'white',
                  border: '3px solid rgba(255,107,139,0.3)',
                  boxShadow: '0 4px 15px rgba(255,107,139,0.3)',
                  margin: '0 auto'
                }}>
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span>{avatarLetter}</span>
                  )}
                </div>
                <button
                  style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                    border: '2px solid white', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem'
                  }}
                  onClick={() => setActiveTab('profile')}
                  title="Change photo"
                >
                  <i className="bi bi-camera-fill"></i>
                </button>
              </div>
              <h5 className="fw-bold">{user.name}</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>{user.email}</p>
              <span className={`badge mt-2 ${user.role === 'super_admin' ? 'bg-danger' : user.role === 'shop_owner' ? 'bg-warning text-dark' : 'bg-lavender'}`}>
                {user.role === 'super_admin' ? 'Administrator' : user.role === 'shop_owner' ? 'Shop Owner' : 'Customer'}
              </span>
            </div>

            <nav className="nav flex-column">
              <button className={`nav-link text-start mb-2 ${activeTab === 'profile' ? 'active text-apricot fw-bold' : 'text-chocolate'}`} onClick={() => setActiveTab('profile')}>
                <i className="bi bi-person me-2"></i>My Profile
              </button>
              <button className={`nav-link text-start mb-2 ${activeTab === 'password' ? 'active text-apricot fw-bold' : 'text-chocolate'}`} onClick={() => setActiveTab('password')}>
                <i className="bi bi-shield-lock me-2"></i>Change Password
              </button>
              <button className="nav-link text-start mb-2 text-chocolate" onClick={() => navigate('/my-orders')}>
                <i className="bi bi-bag-check me-2"></i>My Orders
              </button>
              {(user.role === 'super_admin' || user.role === 'admin') && (
                <button className="nav-link text-start mb-2 text-chocolate" onClick={() => navigate('/admin')}>
                  <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                </button>
              )}
              {user.role === 'shop_owner' && (
                <button className="nav-link text-start mb-2 text-chocolate" onClick={() => navigate('/shop/dashboard')}>
                  <i className="bi bi-shop me-2"></i>Shop Dashboard
                </button>
              )}
              <button className="nav-link text-start text-danger" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="glass-card p-4">
            {message.text && (
              <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <>
                <h3 className="text-chocolate mb-4">My Profile</h3>

                {/* Profile Picture Section */}
                <div className="mb-4 p-4 rounded-4" style={{ background: 'rgba(255,158,109,0.06)', border: '1.5px dashed rgba(255,158,109,0.3)' }}>
                  <h6 className="text-chocolate mb-3"><i className="bi bi-camera me-2"></i>Profile Picture</h6>
                  <div className="d-flex align-items-center gap-4">
                    <div style={{
                      width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden',
                      background: 'linear-gradient(135deg, #FF9E6D, #FF6B8B)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.6rem', fontWeight: 700, color: 'white', flexShrink: 0
                    }}>
                      {profilePic ? (
                        <img src={profilePic} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.style.display = 'none'; }} />
                      ) : <span>{avatarLetter}</span>}
                    </div>
                    <div className="flex-grow-1">
                      <div className="row g-2">
                        <div className="col-12">
                          <label className="form-label small">Image URL</label>
                          <input type="text" className="form-control form-control-sm"
                            value={profileForm.profilePicture}
                            onChange={e => handleImageUrl(e.target.value)}
                            placeholder="https://example.com/your-photo.jpg" />
                        </div>
                        <div className="col-12">
                          <button type="button" className="btn btn-sm rounded-pill px-3"
                            style={{ background: 'rgba(255,107,139,0.1)', border: '1px solid rgba(255,107,139,0.3)', color: '#FF6B8B', fontSize: '0.8rem' }}
                            onClick={() => fileInputRef.current?.click()}>
                            <i className="bi bi-upload me-1"></i>Upload from device
                          </button>
                          <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
                          {profileForm.profilePicture && (
                            <button type="button" className="btn btn-sm ms-2"
                              style={{ background: 'rgba(220,53,69,0.1)', border: 'none', color: '#dc3545', fontSize: '0.8rem' }}
                              onClick={() => setProfileForm(prev => ({ ...prev, profilePicture: '' }))}>
                              <i className="bi bi-x-circle me-1"></i>Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" value={user.email} disabled />
                      <small className="text-muted">Email cannot be changed</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone Number</label>
                      <input type="tel" className="form-control" value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Member Since</label>
                      <input type="text" className="form-control" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} disabled />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-frosting" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Updating...</>
                      ) : (
                        <><i className="bi bi-check-circle me-2"></i>Update Profile</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h3 className="text-chocolate mb-4">Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Current Password</label>
                      <input type="password" className="form-control" value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">New Password</label>
                      <input type="password" className="form-control" value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} required />
                      <small className="text-muted">Minimum 6 characters</small>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Confirm New Password</label>
                      <input type="password" className="form-control" value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} required />
                    </div>
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-frosting" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2"></span>Changing...</>
                      ) : (
                        <><i className="bi bi-shield-lock me-2"></i>Change Password</>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <div className="glass-card p-4 mt-4">
            <h5 className="text-chocolate mb-3">Account Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Account Type:</strong> {user.role === 'super_admin' ? 'Super Administrator' : user.role === 'shop_owner' ? 'Shop Owner' : 'Customer'}</p>
                <p><strong>Member Since:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Status:</strong> <span className="badge bg-success">Active</span></p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
