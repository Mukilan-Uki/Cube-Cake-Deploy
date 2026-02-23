import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-chocolate text-cream py-5 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="font-script fs-3 mb-3">
              <i className="bi bi-cake me-2"></i>
              Cube Cake
            </h5>
            <p className="text-cream opacity-75">
              Where cakes transform into edible masterpieces and every celebration finds its perfect sweet expression
            </p>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-cream text-decoration-none opacity-75">Home</a></li>
              <li><a href="/gallery" className="text-cream text-decoration-none opacity-75">Cake Gallery</a></li>
              <li><a href="/create" className="text-cream text-decoration-none opacity-75">Custom Design</a></li>
              <li><a href="/order" className="text-cream text-decoration-none opacity-75">Place Order</a></li>
            </ul>
          </div>
          
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Contact Us</h5>
            <p className="text-cream opacity-75 mb-2">
              <i className="bi bi-geo-alt me-2"></i>
              Main Street, Santhively, Batticaloa
            </p>
            <p className="text-cream opacity-75 mb-2">
              <i className="bi bi-telephone me-2"></i>
              0743086099
            </p>
            <p className="text-cream opacity-75">
              <i className="bi bi-envelope me-2"></i>
              hello@cubecake.com
            </p>
          </div>
        </div>
        
        <hr className="bg-cream opacity-25" />
        
        <div className="text-center pt-3">
          <p className="mb-0 text-cream opacity-75">
            © 2025 Cube Cake Shop • Made with <i className="bi bi-heart-fill text-danger mx-1"></i> and sprinkles
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;