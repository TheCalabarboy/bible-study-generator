import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoModal from '../components/VideoModal';

export default function HomePage() {
  const introVideoId = import.meta.env.VITE_INTRO_VIDEO_ID || 'IwooZSKSDpg';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* DocShield-Inspired Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-warm-cool)',
        opacity: 0.15,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: 'var(--space-100) var(--space-12)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Hero Section - DocShield Style */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-100)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Icon with subtle animation */}
          <div style={{
            fontSize: '72px',
            marginBottom: 'var(--space-6)',
            animation: 'float 3s ease-in-out infinite',
          }}>📖</div>

          <h1 style={{
            fontSize: 'clamp(48px, 7vw, 80px)',
            fontWeight: '400',
            marginBottom: 'var(--space-8)',
            color: 'var(--color-gray-900)',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
          }}>
            Transform Sermons into<br />Daily Spiritual Growth
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            lineHeight: '1.6',
            color: 'var(--color-gray-700)',
            maxWidth: '800px',
            margin: '0 auto var(--space-71)',
            fontWeight: '400',
          }}>
            Turn any Christian sermon or teaching into a comprehensive 5-day Bible study plan.
            Deepen your faith, explore Scripture, and apply biblical truth to your life.
          </p>

          {/* Primary CTA - DocShield Style */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link
              to="/generate"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4) var(--space-8)',
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--color-gray-900)',
                background: 'var(--color-gray-100)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                border: '1px solid var(--color-gray-200)',
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
              Get Started
            </Link>

            <Link
              to="/topics"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-4) var(--space-8)',
                fontSize: '17px',
                fontWeight: '600',
                color: 'var(--color-gray-700)',
                background: 'transparent',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                border: '1px solid var(--color-gray-300)',
                transition: 'opacity var(--transition-fast)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
              }}
            >
              Browse Topics
            </Link>
          </div>
        </div>

        {/* Feature Cards - DocShield Spacing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--space-71)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          {/* Sermon Analysis Card */}
          <Link
            to="/generate"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(var(--blur-md))',
              WebkitBackdropFilter: 'blur(var(--blur-md))',
              padding: 'var(--space-12)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              textDecoration: 'none',
              transition: 'opacity var(--transition-fast)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-5)',
              fontSize: '28px',
            }}>
              🎥
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-gray-900)',
              letterSpacing: '-0.01em',
            }}>
              Sermon Analysis
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--color-gray-600)',
              fontWeight: '400',
            }}>
              Paste any YouTube sermon link and our AI analyzes the content to create personalized studies.
            </p>
          </Link>

          {/* Topical Study Card */}
          <Link
            to="/topics"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(var(--blur-md))',
              WebkitBackdropFilter: 'blur(var(--blur-md))',
              padding: 'var(--space-12)',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              textDecoration: 'none',
              transition: 'opacity var(--transition-fast)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-5)',
              fontSize: '28px',
            }}>
              📚
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-gray-900)',
              letterSpacing: '-0.01em',
            }}>
              Topical Study
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: 'var(--color-gray-600)',
              fontWeight: '400',
            }}>
              Enter any biblical topic or doctrine and get a comprehensive Scripture-based study plan.
            </p>
          </Link>
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
