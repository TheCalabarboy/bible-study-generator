import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '16px 24px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <Link 
            to="/" 
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'white',
            }}
          >
            <span style={{ fontSize: '32px', marginRight: '12px' }}>📖</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>SermonDive</span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link
              to="/blog"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              📝 Blog
            </Link>

            {currentUser ? (
              <>
                <Link
                  to="/generate"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  ✨ Generate Study
                </Link>
                
                <Link
                  to="/library"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    transition: 'background 0.3s',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  📚 Library
                </Link>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginLeft: '12px',
                }}>
                  <span style={{ color: 'white', fontSize: '14px' }}>
                    {currentUser.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                style={{
                  padding: '10px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#667eea',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#f8f7ff',
        padding: '24px',
        textAlign: 'center',
        marginTop: '48px',
        borderTop: '2px solid #e8e5ff',
      }}>
        <p style={{ color: '#666', fontSize: '14px' }}>
          © 2025 SermonDive. Deepening faith through God's Word.
        </p>
      </footer>
    </div>
  );
}