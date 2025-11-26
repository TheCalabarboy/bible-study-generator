import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png'; // keep if you want the logo on the FAQ card

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How does SermonDive work?',
      answer:
        'Simply paste a YouTube link to a Christian sermon, and our AI analyzes the content to create a 5-day Bible study guide with Scripture readings, reflection questions, and practical applications.',
    },
    {
      question: 'Is SermonDive free to use?',
      answer:
        'Yes! SermonDive is completely free. We believe in making deep Bible study accessible to everyone.',
    },
    {
      question: 'What kind of videos can I use?',
      answer:
        'Any YouTube video featuring Christian sermons, Bible teachings, or biblical preaching from credible Christian sources. The content should be Christ-centered and scripturally sound.',
    },
    {
      question: 'Can I customize my study plan?',
      answer:
        "Yes! You can choose the session length, include deeper analysis with Greek/Hebrew word studies, add memory verses, and select whether it's for personal study or group discussion.",
    },
    {
      question: 'How long does it take to generate a study?',
      answer:
        'Typically 30–60 seconds. Our AI analyzes the sermon content and creates a comprehensive 5-day study plan tailored to your preferences.',
    },
    {
      question: 'Can I download my studies?',
      answer:
        'Absolutely! Each daily study can be downloaded as a text file or Word document for easy printing and sharing.',
    },
    {
      question: 'Is this theologically sound?',
      answer:
        'We strive for theological accuracy based on orthodox Christian teaching. However, we always recommend discussing deeper theological questions with your local church pastor or elder.',
    },
    {
      question: 'Can I use this for my small group?',
      answer:
        "Yes! When generating your study, select 'Small Group' as your usage type to get discussion-focused questions perfect for group settings.",
    },
    {
      question: 'What Bible translation do you use?',
      answer:
        'We primarily use the ESV (English Standard Version), but you can study using any translation you prefer.',
    },
    {
      question: 'Can I share my studies?',
      answer:
        'Yes! Feel free to share your downloaded studies with friends, family, or your church community.',
    },
  ];

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
          maxWidth: '1100px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.94)',
          borderRadius: '24px',
          padding: 'var(--space-12)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* Optional logo on the card */}
        <img
          src={Logo}
          alt="SermonDive Logo"
          style={{
            width: '160px',
            height: 'auto',
            margin: '0 auto var(--space-6)',
            display: 'block',
          }}
        />

        <h1
          style={{
            fontSize: 'clamp(36px, 4vw, 48px)',
            color: 'var(--color-gray-900)',
            marginBottom: 'var(--space-2)',
            textAlign: 'center',
            fontWeight: 400,
          }}
        >
          Frequently Asked Questions
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginBottom: 'var(--space-8)', fontSize: 17 }}>
          Everything you need to know about SermonDive
        </p>

        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              marginBottom: 'var(--space-3)',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.9)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                width: '100%',
                padding: 'var(--space-4)',
                background: openIndex === index ? 'rgba(0, 122, 255, 0.06)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--color-gray-900)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{faq.question}</span>
              <span style={{ fontSize: '22px', color: 'var(--color-primary)' }}>
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            {openIndex === index && (
              <div
                style={{
                  padding: '0 var(--space-4) var(--space-4)',
                  background: 'rgba(0,0,0,0.02)',
                  color: 'var(--color-gray-700)',
                  lineHeight: 1.7,
                  fontSize: 16,
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}

        <div
          style={{
            textAlign: 'center',
            marginTop: 'var(--space-10)',
            padding: 'var(--space-6)',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 style={{ color: 'var(--color-gray-900)', marginBottom: 'var(--space-2)', fontSize: 20, letterSpacing: '-0.01em' }}>
            Still have questions?
          </h3>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-4)', fontSize: 16 }}>
            We&apos;re here to help! Reach out to us anytime.
          </p>
          <a
            href="mailto:contact@sermondive.com"
            style={{
              display: 'inline-block',
              padding: 'var(--space-3) var(--space-6)',
              background: 'var(--gradient-primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              fontWeight: 600,
              fontSize: 15,
              boxShadow: 'var(--shadow-sm)',
              transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Contact Us
          </a>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <Link
            to="/"
            style={{
              color: 'var(--color-primary)',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 600,
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
