import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const { currentUser } = useAuth();

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '900px', textAlign: 'center', color: 'white' }}>
        {/* Hero Section */}
        <div style={{ fontSize: '80px', marginBottom: '24px' }}>📖</div>
        
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          lineHeight: '1.2',
        }}>
          SermonDive
        </h1>
        
        <p style={{ 
          fontSize: '28px', 
          marginBottom: '12px',
          opacity: '0.95',
        }}>
          Transform Sermons into Daily Spiritual Growth
        </p>

        <p style={{ 
          fontSize: '18px', 
          marginBottom: '40px',
          opacity: '0.9',
          lineHeight: '1.6',
          maxWidth: '700px',
          margin: '0 auto 40px',
        }}>
          Turn any Christian sermon or teaching into a comprehensive 5-day Bible study plan. 
          Deepen your faith, explore Scripture, and apply biblical truth to your life.
        </p>

        {/* CTA Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {currentUser ? (
            <Link
              to="/generate"
              style={{
                padding: '20px 40px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'white',
                color: '#667eea',
                textDecoration: 'none',
                display: 'inline-block',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ✨ Generate Study Plan
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: '20px 40px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: 'white',
                  color: '#667eea',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Get Started Free
              </Link>
              
              <Link
                to="/login"
                style={{
                  padding: '20px 40px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  border: '2px solid white',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: 'white',
                  textDecoration: 'none',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#667eea';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                Log In
              </Link>
            </>
          )}
        </div>

        {/* Features */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginTop: '60px',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Sermon Analysis
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.9' }}>
              Paste any YouTube sermon link and our AI analyzes the content to create personalized studies
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Topic Studies
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.9' }}>
              Enter any biblical topic or doctrine and get a comprehensive Scripture-based study plan
            </p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✝️</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
              Christ-Centered
            </h3>
            <p style={{ fontSize: '14px', opacity: '0.9' }}>
              Every study points to Jesus and is grounded in orthodox Christian theology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}