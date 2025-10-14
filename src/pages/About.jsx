// src/pages/About.jsx
import React from 'react';
import Logo from '../assets/Logo.png';

export default function About() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={Logo} alt="SermonDive" style={{ width: 160, height: 'auto' }} />
        </div>

        <h1
          style={{
            fontSize: '56px',
            color: '#7c83ff',
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 1.1,
          }}
        >
          About SermonDive
        </h1>

        {/* Our Mission */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 32, marginBottom: 12 }}>Our Mission</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 18 }}>
            SermonDive exists to help Christians grow deeper in their faith by transforming powerful
            sermons into practical, daily Bible study plans. We believe that consistent engagement
            with God's Word transforms lives.
          </p>
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 32, marginBottom: 12 }}>How It Works</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 18 }}>
            Simply paste a YouTube link to a Christian sermon or teaching, and our AI-powered platform
            analyzes the content to create a comprehensive 5-day Bible study guide. Each study includes:
          </p>
          <ul style={{ color: '#374151', lineHeight: 1.9, paddingLeft: 22, fontSize: 18 }}>
            <li>Daily Scripture readings</li>
            <li>Reflection questions for personal growth</li>
            <li>Prayer focuses</li>
            <li>Practical application steps</li>
          </ul>
        </section>

        {/* Our Values */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 32, marginBottom: 12 }}>Our Values</h2>
          <ul style={{ color: '#374151', lineHeight: 1.9, paddingLeft: 22, fontSize: 18 }}>
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

        {/* Who We Serve */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 32, marginBottom: 12 }}>Who We Serve</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 18 }}>
            SermonDive is designed for individuals seeking deeper Bible study, small groups looking for
            discussion materials, families wanting to grow together spiritually, and anyone who wants to
            get more from the sermons they hear.
          </p>
        </section>

        {/* Contact + CTA */}
        <section>
          <h2 style={{ color: '#6b21a8', fontSize: 32, marginBottom: 12 }}>Contact Us</h2>
          <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 18 }}>
            Have questions or feedback? We’d love to hear from you at{' '}
            <a href="mailto:contact@sermondive.com" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
              contact@sermondive.com
            </a>.
          </p>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '16px 28px',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: 18,
                boxShadow: '0 10px 25px rgba(102,126,234,0.35)',
              }}
            >
              Start Your Bible Study
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
