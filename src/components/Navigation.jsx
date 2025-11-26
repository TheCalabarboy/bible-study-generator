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
        background: 'rgba(255, 255, 255, 0.86)',
        backdropFilter: 'blur(var(--blur-lg))',
        WebkitBackdropFilter: 'blur(var(--blur-lg))',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: 'var(--shadow-xs)',
        padding: 'var(--space-2) 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all var(--transition-base)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: 'var(--space-3) var(--space-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-8)',
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
    </nav>
  );
}
