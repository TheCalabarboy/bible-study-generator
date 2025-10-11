import React, { useState } from 'react';
import Logo from '../assets/Logo.png';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: "How does SermonDive work?",
      answer: "Simply paste a YouTube link to a Christian sermon, and our AI analyzes the content to create a 5-day Bible study guide with Scripture readings, reflection questions, and practical applications."
    },
    {
      question: "Is SermonDive free to use?",
      answer: "Yes! SermonDive is completely free. We believe in making deep Bible study accessible to everyone."
    },
    {
      question: "What kind of videos can I use?",
      answer: "Any YouTube video featuring Christian sermons, Bible teachings, or biblical preaching from credible Christian sources. The content should be Christ-centered and scripturally sound."
    },
    {
      question: "Can I customize my study plan?",
      answer: "Yes! You can choose the session length, include deeper analysis with Greek/Hebrew word studies, add memory verses, and select whether it's for personal study or group discussion."
    },
    {
      question: "How long does it take to generate a study?",
      answer: "Typically 30-60 seconds. Our AI analyzes the sermon content and creates a comprehensive 5-day study plan tailored to your preferences."
    },
    {
      question: "Can I download my studies?",
      answer: "Absolutely! Each daily study can be downloaded as a text file, PDF, or Word document for easy printing and sharing."
    },
    {
      question: "Is this theologically sound?",
      answer: "We strive for theological accuracy based on orthodox Christian teaching. However, we always recommend discussing deeper theological questions with your local church pastor or elder."
    },
    {
      question: "Can I use this for my small group?",
      answer: "Yes! When generating your study, select 'Small Group' as your usage type to get discussion-focused questions perfect for group settings."
    },
    {
      question: "What Bible translation do you use?",
      answer: "We primarily use the ESV (English Standard Version), but you can study using any translation you prefer."
    },
    {
      question: "Can I share my studies?",
      answer: "Yes! Feel free to share your downloaded studies with friends, family, or your church community."
    }
  ];
  
  return (
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
          Frequently Asked Questions
        </h1>
        
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>
          Everything you need to know about SermonDive
        </p>
        
        {faqs.map((faq, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: '20px',
                background: openIndex === index ? '#f8f7ff' : 'white',
                border: 'none',
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: '24px', color: '#667eea' }}>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            
            {openIndex === index && (
              <div style={{
                padding: '20px',
                background: '#f8f7ff',
                color: '#555',
                lineHeight: '1.6',
              }}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '30px',
          background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
          borderRadius: '12px',
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '10px' }}>Still have questions?</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We're here to help! Reach out to us anytime.
          </p>
          <a 
            href="mailto:contact@sermondive.com"
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
            Contact Us
          </a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <a 
            href="/"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}