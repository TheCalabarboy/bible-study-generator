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

        {/* Right: Nav links + CTA */}
        <div
          id="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            justifyContent: 'space-between',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxWidth: '100%',
            minWidth: 0,
            flex: '1 1 auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flexWrap: 'wrap',
              minWidth: 0,
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
      </div>
      <style>{`
        @media (max-width: 768px) {
          #nav-shell {
            padding: 12px 12px 0;
          }
          #nav-inner {
            margin: 0 auto;
            padding: 10px 12px;
            gap: 10px;
            borderRadius: 18px;
          }
          #nav-links {
            gap: 8px;
          }
          #nav-links > div:nth-child(1) {
            gap: 6px;
            flex-wrap: nowrap;
            overflow-x: auto;
          }
          #nav-links a {
            padding: 8px 12px;
            font-size: 14px;
          }
          #nav-links a:last-of-type {
            padding: 10px 16px;
            font-size: 14px;
          }
        }
      `}</style>
    </nav>
  );
}
