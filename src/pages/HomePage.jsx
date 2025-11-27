import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoModal from '../components/VideoModal';
import HeroReading from '../assets/hero-reading.png';
import Logo from '../assets/Logo.png';

export default function HomePage() {
  const introVideoId = import.meta.env.VITE_INTRO_VIDEO_ID || 'IwooZSKSDpg';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #4a6bc9 0%, #6f8fda 45%, #e8f0ff 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* DocShield-Inspired Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(120% 90% at 50% 15%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 60%)',
        opacity: 0.9,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--space-100) var(--space-12)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Hero Section - DocShield match */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-100)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <img src={Logo} alt="SermonDive" style={{ width: 140, height: 'auto' }} />
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 80px)',
            fontWeight: 400,
            marginBottom: 'var(--space-4)',
            color: 'white',
            letterSpacing: '-0.02em',
            lineHeight: '1.05',
          }}>
            Transform Sermons into<br />Daily Spiritual Growth
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2.3vw, 20px)',
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '760px',
            margin: '0 auto var(--space-6)',
            fontWeight: 400,
          }}>
            Turn any Christian sermon or teaching into a comprehensive 5-day Bible study plan. Deepen your faith, explore Scripture, and apply biblical truth to your life.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 'var(--space-10)',
          }}>
            <Link
              to="/generate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 28px',
                fontSize: '17px',
                fontWeight: 600,
                color: '#0f172a',
                background: 'white',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                transition: 'opacity var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              Get started
            </Link>

            <Link
              to="/faq"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 26px',
                fontSize: '17px',
                fontWeight: 600,
                color: 'white',
                background: 'linear-gradient(135deg, #3b5fae 0%, #6f8fda 100%)',
                borderRadius: '999px',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                transition: 'opacity var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              See how it works
            </Link>
          </div>

        </div>

        {/* Feature Cards - DocShield Spacing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          {/* Sermon Analysis Card */}
          <Link
            to="/generate"
            style={{
              background: 'linear-gradient(135deg, #3b5fae 0%, #6f8fda 100%)',
              padding: 'var(--space-8)',
              borderRadius: '12px',
              border: 'none',
              textDecoration: 'none',
              transition: 'opacity var(--transition-fast)',
              boxShadow: '0 12px 30px rgba(59, 95, 174, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2f4f9d 0%, #5c7fda 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
              fontSize: '22px',
              color: 'white',
            }}>
              🎬
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: 'var(--space-2)',
              color: 'white',
              letterSpacing: '-0.01em',
            }}>
              Sermon Analysis
            </h3>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '400',
            }}>
              Paste any YouTube sermon link and our AI analyzes the content to create personalized studies.
            </p>
          </Link>

          {/* Topical Study Card */}
          <Link
            to="/topics"
            style={{
              background: 'linear-gradient(135deg, #3b5fae 0%, #6f8fda 100%)',
              padding: 'var(--space-8)',
              borderRadius: '12px',
              border: 'none',
              textDecoration: 'none',
              transition: 'opacity var(--transition-fast)',
              boxShadow: '0 12px 30px rgba(59, 95, 174, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2f4f9d 0%, #5c7fda 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-3)',
              fontSize: '22px',
              color: 'white',
            }}>
              📖
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: 'var(--space-2)',
              color: 'white',
              letterSpacing: '-0.01em',
            }}>
              Topical Study
            </h3>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '400',
            }}>
              Enter any biblical topic or doctrine and get a comprehensive Scripture-based study plan.
            </p>
          </Link>
        </div>

        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          marginTop: 'var(--space-8)',
          marginBottom: '-120px',
        }}>
          <img
            src={HeroReading}
            alt="Young woman reading the Bible"
            style={{
              width: 'min(520px, 90vw)',
              display: 'block',
              position: 'relative',
              top: '0',
              marginBottom: '-40px',
            }}
          />
        </div>
      </div>

      {introVideoId && (
        <VideoModal
          videoId={introVideoId}
          storageKey="introVideoDismissed"
          headline="Welcome to SermonDive"
          description="Here's a quick tour showing how to transform sermons into five-day Bible studies."
        />
      )}

      {/* Floating Animation Keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
