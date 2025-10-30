import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home' },
    { path: '/generate', label: 'Generate' },
    { path: '/topics', label: 'Topics' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
  ];

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <nav
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Left: Logo / Home */}
        <Link
          to="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <img src={Logo} alt="SermonDive" style={{ height: 40, width: 'auto' }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#333' }}>SermonDive</span>
        </Link>

        {/* Right: Nav links (NO Login) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {links.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              style={{
                textDecoration: 'none',
                fontWeight: 600,
                padding: '8px 12px',
                borderRadius: 10,
                color: isActive(l.path) ? '#5b67e6' : '#333',
                background: isActive(l.path) ? 'rgba(102,126,234,0.12)' : 'transparent',
                transition: 'background 0.2s, transform 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {l.label}
            </Link>
          ))}
          {/* Intentionally no Log In / Sign Up buttons */}
        </div>
      </div>
    </nav>
  );
}
