import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.png';

export default function Navigation() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

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
      id="nav-shell"
      style={{
        background: 'transparent',
        padding: 'var(--space-2) 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all var(--transition-base)',
      }}
    >
      <div
        id="nav-inner"
        style={{
          maxWidth: '1400px',
          margin: 'var(--space-4) auto 0',
          padding: 'var(--space-2) var(--space-3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-8)',
          background: 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(var(--blur-lg))',
          WebkitBackdropFilter: 'blur(var(--blur-lg))',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          borderRadius: '999px',
        }}
      >
        {/* Left: Logo / Home */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            transition: 'opacity var(--transition-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          <img
            src={Logo}
            alt="SermonDive"
            style={{
              height: '38px',
              width: 'auto',
            }}
          />
          <span
            style={{
              fontWeight: 600,
              fontSize: '18px',
              color: 'var(--color-gray-800)',
              letterSpacing: '-0.01em',
            }}
          >
            SermonDive
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div
          id="nav-links"
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            justifyContent: 'space-between',
            maxWidth: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            {links.map((l) => (
              <Link
                key={l.path}
                to={l.path}
                style={{
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '15px',
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-xl)',
                  color: isActive(l.path)
                    ? 'var(--color-primary)'
                    : 'var(--color-gray-700)',
                  background: isActive(l.path)
                    ? 'rgba(0, 122, 255, 0.12)'
                    : 'transparent',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(l.path)) {
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.color = 'var(--color-gray-900)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(l.path)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--color-gray-700)';
                  }
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <Link
            to="/generate"
            style={{
              textDecoration: 'none',
              padding: 'var(--space-3) var(--space-5)',
              borderRadius: 'var(--radius-full)',
              background: 'var(--gradient-primary)',
              color: 'var(--color-white)',
              fontWeight: 600,
              fontSize: '15px',
              boxShadow: 'var(--shadow-sm)',
              transition: 'opacity var(--transition-fast)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--color-gray-900)',
            display: 'none', // Hidden by default (desktop)
          }}
          aria-label="Open Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? 'all' : 'none',
          transition: 'all 0.3s ease-in-out',
          transform: isMenuOpen ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-gray-900)',
          }}
          aria-label="Close Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          {links.map((l, index) => (
            <Link
              key={l.path}
              to={l.path}
              style={{
                textDecoration: 'none',
                fontSize: '24px',
                fontWeight: 600,
                color: isActive(l.path) ? 'var(--color-primary)' : 'var(--color-gray-800)',
                transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                opacity: isMenuOpen ? 1 : 0,
                transition: `all 0.4s ease ${index * 0.05 + 0.1}s`,
              }}
            >
              {l.label}
            </Link>
          ))}

          <Link
            to="/generate"
            style={{
              marginTop: '16px',
              textDecoration: 'none',
              padding: '16px 48px',
              borderRadius: '999px',
              background: 'var(--gradient-primary)',
              color: 'white',
              fontSize: '20px',
              fontWeight: 700,
              boxShadow: '0 10px 30px rgba(0, 122, 255, 0.3)',
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
              opacity: isMenuOpen ? 1 : 0,
              transition: `all 0.4s ease ${links.length * 0.05 + 0.1}s`,
            }}
          >
            Get Started
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #nav-shell {
            padding: 12px 12px 0;
          }
          #nav-inner {
            margin: 0 auto;
            padding: 10px 16px; /* slightly more padding */
            gap: 10px;
            border-radius: 999px; /* keep pill shape on mobile too */
          }
          
          /* Hide desktop links on mobile */
          .desktop-nav {
            display: none !important;
          }
          
          /* Show mobile toggle */
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav >
  );
}
