import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        background: 'var(--gradient-hero)',
        padding: 'var(--space-12) var(--space-6)',
        marginTop: 'var(--space-100)',
        borderTop: '1px solid rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'var(--gradient-warm-cool)',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-8)',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h3 style={{ color: 'var(--color-gray-900)', fontSize: '18px', marginBottom: 'var(--space-3)', fontWeight: 600, letterSpacing: '-0.01em' }}>
            SermonDive
          </h3>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.7, fontSize: '15px', maxWidth: '360px' }}>
            Transform sermons into daily spiritual growth with AI-powered Bible study guides tailored for personal and group journeys.
          </p>
        </div>

        <div>
          <h3 style={{ color: 'var(--color-gray-900)', fontSize: '16px', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
            Product
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/generate">Generate Study</FooterLink>
            <FooterLink to="/topics">Explore Topics</FooterLink>
            <FooterLink to="/quiz">Bible Quiz</FooterLink>
            <FooterLink to="/blog">Blog</FooterLink>
          </div>
        </div>

        <div>
          <h3 style={{ color: 'var(--color-gray-900)', fontSize: '16px', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
            Company
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <FooterLink to="/about">About</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/feedback">Feedback</FooterLink>
          </div>
        </div>

        <div>
          <h3 style={{ color: 'var(--color-gray-900)', fontSize: '16px', marginBottom: 'var(--space-3)', fontWeight: 600 }}>
            Get in touch
          </h3>
          <div style={{ color: 'var(--color-gray-600)', fontSize: '15px' }}>
            <a
              href="mailto:contact@sermondive.com"
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              contact@sermondive.com
            </a>
            <p style={{ marginTop: 'var(--space-3)', lineHeight: 1.6 }}>
              We’d love to hear how you’re using SermonDive with your church, small group, or personal study.
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          maxWidth: '1400px',
          margin: 'var(--space-8) auto 0',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)',
          color: 'var(--color-gray-500)',
          fontSize: '14px',
          flexWrap: 'wrap',
        }}
      >
        <div>© {new Date().getFullYear()} SermonDive. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <span>Built for discipleship</span>
          <span>•</span>
          <span>DocShield-inspired UI</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: 'var(--color-gray-600)',
        textDecoration: 'none',
        fontSize: '15px',
        transition: 'opacity var(--transition-fast)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      {children}
    </Link>
  );
}
