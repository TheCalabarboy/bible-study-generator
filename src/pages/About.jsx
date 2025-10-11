import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Navigation from '../components/Navigation';

export default function About() {
  return (
    <>
      <Navigation />  {/* ← ADD THIS LINE */}
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <img 
          src={Logo} 
          alt="SermonDive Logo" 
          style={{ 
            width: '200px', 
            height: 'auto',
            margin: '0 auto 30px',
            display: 'block'
          }} 
        />
        
        <h1 style={{ fontSize: '36px', color: '#667eea', marginBottom: '20px', textAlign: 'center' }}>
          About SermonDive
        </h1>
        
        <div style={{ lineHeight: '1.8', color: '#333', fontSize: '16px' }}>
          <h2 style={{ fontSize: '24px', color: '#764ba2', marginTop: '30px' }}>Our Mission</h2>
          <p>
            SermonDive exists to help Christians grow deeper in their faith by transforming 
            powerful sermons into practical, daily Bible study plans. We believe that consistent 
            engagement with God's Word transforms lives.
          </p>
          
          <h2 style={{ fontSize: '24px', color: '#764ba2', marginTop: '30px' }}>How It Works</h2>
          <p>
            Simply paste a YouTube link to a Christian sermon or teaching, and our AI-powered 
            platform analyzes the content to create a comprehensive 5-day Bible study guide. 
            Each study includes:
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li>Daily Scripture readings</li>
            <li>Reflection questions for personal growth</li>
            <li>Prayer focuses</li>
            <li>Practical application steps</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', color: '#764ba2', marginTop: '30px' }}>Our Values</h2>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>Scripture-Centered:</strong> The Bible is our ultimate authority</li>
            <li><strong>Christ-Focused:</strong> Every study points to Jesus</li>
            <li><strong>Theologically Sound:</strong> We maintain orthodox Christian teaching</li>
            <li><strong>Practical:</strong> Faith that transforms daily life</li>
          </ul>
          
          <h2 style={{ fontSize: '24px', color: '#764ba2', marginTop: '30px' }}>Who We Serve</h2>
          <p>
            SermonDive is designed for individuals seeking deeper Bible study, small groups 
            looking for discussion materials, families wanting to grow together spiritually, 
            and anyone who wants to get more from the sermons they hear.
          </p>
          
          <h2 style={{ fontSize: '24px', color: '#764ba2', marginTop: '30px' }}>Contact Us</h2>
          <p>
            Have questions or feedback? We'd love to hear from you at{' '}
            <a href="mailto:contact@sermondive.com" style={{ color: '#667eea' }}>
              contact@sermondive.com
            </a>
          </p>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '15px 30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Start Your Bible Study
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}