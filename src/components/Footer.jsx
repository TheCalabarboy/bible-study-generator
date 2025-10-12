import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(102, 126, 234, 0.1)',
      padding: '40px 20px',
      marginTop: '60px',
      borderTop: '1px solid rgba(102, 126, 234, 0.2)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '30px',
      }}>
        <div>
          <h3 style={{ color: '#667eea', fontSize: '18px', marginBottom: '15px' }}>
            SermonDive
          </h3>
          <p style={{ color: '#666', lineHeight: '1.6', fontSize: '14px' }}>
            Transform sermons into daily spiritual growth with AI-powered Bible study guides.
          </p>
        </div>
        
        <div>
          <h3 style={{ color: '#667eea', fontSize: '18px', marginBottom: '15px' }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
              Home
            </Link>
            <Link to="/about" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
              About Us
            </Link>
            <Link to="/faq" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
              FAQ
            </Link>
            <Link to="/privacy" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            Privacy Policy
            </Link>
          </div>
        </div>
        
        <div>
          <h3 style={{ color: '#667eea', fontSize: '18px', marginBottom: '15px' }}>
            Get in Touch
          </h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            <a href="mailto:contact@sermondive.com" style={{ color: '#667eea', textDecoration: 'none' }}>
              contact@sermondive.com
            </a>
          </p>
        </div>
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '40px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
        color: '#999',
        fontSize: '14px',
      }}>
        © {new Date().getFullYear()} SermonDive. All rights reserved.
      </div>
    </footer>
  );
}