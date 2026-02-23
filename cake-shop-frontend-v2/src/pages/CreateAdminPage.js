import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAdminPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@cubecake.com',
    phone: '0743086099',
    password: 'admin123',
    role: 'admin'
  });
  const [message, setMessage] = useState('');

  const handleCreateAdmin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Admin created successfully!');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error.message}`);
    }
  };

  return (
    <div className="container py-5">
      <div className="glass-card p-5 max-w-500 mx-auto">
        <h2 className="text-center mb-4">Create Admin Account</h2>
        
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
        </div>
        
        <button 
          className="btn btn-danger w-100 mb-3"
          onClick={handleCreateAdmin}
        >
          Create Admin Account
        </button>
        
        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        
        <button 
          className="btn btn-outline-secondary w-100"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default CreateAdminPage;