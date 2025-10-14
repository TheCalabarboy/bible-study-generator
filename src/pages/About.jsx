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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src={Logo}
            alt="SermonDive"
            style={{ width: 160, height: 'auto' }}
          />
        </div>

        <h1
          style={{
            fontSize: '48px',
            color: '#667eea',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          About SermonDive
        </h1>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 28, marginBottom: 8 }}>
            Our Mission
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>
            SermonDive exists to help Christians grow deeper in their faith by
            transforming powerful sermons and teachings into structured,
            Christ-centered study plans you can use every day.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#6b21a8', fontSize: 28, marginBottom: 8 }}>
            What We Do
          </h2>
          <ul style={{ color: '#374151', lineHeight: 1.8, paddingLeft: 18 }}>
            <li>Turn any YouTube sermon into a 5-day study guide.</li>
            <li>Ground content in Scripture and orthodox Christian doctrine.</li>
            <li>Offer options for personal study, small groups, or families.</li>
            <li>Provide downloads (TXT / PDF / Word) for sharing and printing.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: '#6b21a8', fontSize: 28, marginBottom: 8 }}>
            The Center: Jesus
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.7 }}>
            Every plan points to Jesus Christ—His gospel, His kingdom, and His
            call to follow Him with head, heart, and hands.
          </p>
        </section>
      </div>
    </div>
  );
}
