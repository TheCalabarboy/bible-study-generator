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
      minHeight: 'calc(100vh - 200px)',
      background: 'linear-gradient(180deg, #F2F2F7 0%, #E5E5EA 50%, #FFFFFF 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(0, 122, 255, 0.03) 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, rgba(88, 86, 214, 0.03) 0%, transparent 50%)`,
        pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: 'var(--space-20) var(--space-6)',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-20)',
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
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: '700',
            marginBottom: 'var(--space-4)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.03em',
          }}>
            SermonDive
          </h1>

          <p style={{
            fontSize: 'clamp(20px, 3vw, 32px)',
            fontWeight: '600',
            marginBottom: 'var(--space-4)',
            color: 'var(--color-gray-800)',
            letterSpacing: '-0.01em',
          }}>
            Transform Sermons into Daily Spiritual Growth
          </p>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: '1.7',
            color: 'var(--color-gray-600)',
            maxWidth: '700px',
            margin: '0 auto var(--space-12)',
            fontWeight: '400',
          }}>
            Turn any Christian sermon or teaching into a comprehensive 5-day Bible study plan.
            Deepen your faith, explore Scripture, and apply biblical truth to your life.
          </p>

          {/* Primary CTA */}
          <Link
            to="/generate"
            style={{
              display: 'inline-block',
              padding: 'var(--space-4) var(--space-10)',
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-white)',
              background: 'var(--gradient-primary)',
              borderRadius: 'var(--radius-full)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all var(--transition-base)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.02)';
              e.target.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'var(--shadow-lg)';
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
          marginTop: 'var(--space-16)',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
        }}>
          {/* Sermon Analysis Card */}
          <Link
            to="/generate"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(var(--blur-md))',
              WebkitBackdropFilter: 'blur(var(--blur-md))',
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              textDecoration: 'none',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'rgba(0, 122, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
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
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(var(--blur-md))',
              WebkitBackdropFilter: 'blur(var(--blur-md))',
              padding: 'var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              textDecoration: 'none',
              transition: 'all var(--transition-base)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.borderColor = 'rgba(88, 86, 214, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.06)';
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
