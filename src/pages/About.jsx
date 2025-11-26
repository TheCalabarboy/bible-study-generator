// src/pages/About.jsx
import React from 'react';
import Logo from '../assets/Logo.png';

export default function About() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        padding: 'var(--space-100) var(--space-12)',
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
          maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.92)',
          borderRadius: '24px',
          padding: 'var(--space-12)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <img src={Logo} alt="SermonDive" style={{ width: 140, height: 'auto' }} />
        </div>

        <h1
          style={{
            fontSize: 'clamp(42px, 6vw, 62px)',
            color: 'var(--color-gray-900)',
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            lineHeight: 1.1,
            fontWeight: 400,
          }}
        >
          About SermonDive
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginBottom: 'var(--space-10)', fontSize: '18px', lineHeight: 1.7 }}>
          Transforming sermons into practical, daily Bible studies with a calm, professional DocShield-inspired experience.
        </p>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--color-gray-900)', fontSize: 28, marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '-0.01em' }}>Our Mission</h2>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 17 }}>
            SermonDive exists to help Christians grow deeper in their faith by transforming powerful
            sermons into practical, daily Bible study plans. We believe that consistent engagement
            with God's Word transforms lives.
          </p>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--color-gray-900)', fontSize: 28, marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '-0.01em' }}>How It Works</h2>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 17 }}>
            Simply paste a YouTube link to a Christian sermon or teaching, and our AI-powered platform
            analyzes the content to create a comprehensive 5-day Bible study guide. Each study includes:
          </p>
          <ul style={{ color: 'var(--color-gray-700)', lineHeight: 1.9, paddingLeft: 22, fontSize: 17 }}>
            <li>Daily Scripture readings</li>
            <li>Reflection questions for personal growth</li>
            <li>Prayer focuses</li>
            <li>Practical application steps</li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--color-gray-900)', fontSize: 28, marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '-0.01em' }}>Our Values</h2>
          <ul style={{ color: 'var(--color-gray-700)', lineHeight: 1.9, paddingLeft: 22, fontSize: 17 }}>
            <li>
              <strong>Scripture-Centered:</strong> The Bible is our ultimate authority
            </li>
            <li>
              <strong>Christ-Focused:</strong> Every study points to Jesus
            </li>
            <li>
              <strong>Theologically Sound:</strong> We maintain orthodox Christian teaching
            </li>
            <li>
              <strong>Practical:</strong> Faith that transforms daily life
            </li>
          </ul>
        </section>

        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ color: 'var(--color-gray-900)', fontSize: 28, marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '-0.01em' }}>Who We Serve</h2>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 17 }}>
            SermonDive is designed for individuals seeking deeper Bible study, small groups looking for
            discussion materials, families wanting to grow together spiritually, and anyone who wants to
            get more from the sermons they hear.
          </p>
        </section>

        <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <h2 style={{ color: 'var(--color-gray-900)', fontSize: 28, marginBottom: 'var(--space-2)', fontWeight: 600, letterSpacing: '-0.01em' }}>Contact Us</h2>
          <p style={{ color: 'var(--color-gray-600)', lineHeight: 1.8, fontSize: 17 }}>
            Have questions or feedback? We’d love to hear from you at{' '}
            <a href="mailto:contact@sermondive.com" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
              contact@sermondive.com
            </a>.
          </p>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: 'var(--space-4) var(--space-8)',
                borderRadius: 'var(--radius-full)',
                background: 'var(--gradient-primary)',
                color: 'white',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: 16,
                boxShadow: 'var(--shadow-sm)',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Start Your Bible Study
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
