import React, { useState, useEffect } from 'react';
import { FiLogIn } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* الشعار على اليسار */}
        <div className="logo-container">
         <a href="/"> <img 
            src="https://ik.imagekit.io/8wpbbs3fv/photos/logo%20icon.png?updatedAt=1754224442298" 
            alt="شعار الموقع" 
            className="nav-logo"
          /> </a>
        </div>

        {/* أقسام التنقل في المنتصف مع الأزرار */}
        <div className="nav-links">
          <a href="/" className="nav-link">الرئيسية</a>
          <a href="/partner" className="nav-link">الشراكات</a>
          <a href="/about" className="nav-link">عنا</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;