import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';

export default function Navigation() {
  const location = useLocation();
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
  ];
  
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src={Logo} 
            alt="SermonDive" 
            style={{ 
              height: '40px',
              width: 'auto',
            }} 
          />
        </Link>
        
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                color: location.pathname === link.path ? '#667eea' : '#333',
                fontWeight: location.pathname === link.path ? 'bold' : '600',
                fontSize: '16px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: location.pathname === link.path ? '#f8f7ff' : 'transparent',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== link.path) {
                  e.target.style.background = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== link.path) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}