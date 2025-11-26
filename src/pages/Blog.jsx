// src/pages/Blog.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogListPage() {
  // ---------- styles (defined here so nothing is "not defined") ----------
  const pageWrap = {
    position: 'relative',
    minHeight: '100vh',
    background: 'var(--gradient-hero)',
    padding: 'var(--space-100) var(--space-12)',
    overflow: 'hidden',
  };

  const container = {
    position: 'relative',
    maxWidth: '1200px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.94)',
    borderRadius: '24px',
    padding: 'var(--space-10)',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid rgba(0,0,0,0.05)',
  };

  const heading = {
    fontSize: 'clamp(36px, 4vw, 48px)',
    fontWeight: 400,
    color: 'var(--color-gray-900)',
    marginBottom: 'var(--space-2)',
    lineHeight: 1.1,
  };

  const sub = {
    color: 'var(--color-gray-600)',
    marginBottom: 'var(--space-6)',
    fontSize: 16,
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 'var(--space-6)',
  };

  const cardStyle = {
    display: 'block',
    textDecoration: 'none',
    background: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: '18px',
    padding: 'var(--space-5)',
    transition: 'opacity var(--transition-fast)',
    color: 'var(--color-gray-900)',
    boxShadow: 'var(--shadow-sm)',
  };

  const cardTitle = {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--color-gray-900)',
  };

  const cardExcerpt = {
    fontSize: '14px',
    color: 'var(--color-gray-600)',
    marginBottom: 'var(--space-3)',
    lineHeight: 1.6,
  };

  const cardMeta = {
    display: 'inline-block',
    background: 'rgba(0, 122, 255, 0.08)',
    color: 'var(--color-primary)',
    fontSize: '12px',
    fontWeight: 700,
    padding: '6px 10px',
    borderRadius: '10px',
  };

  // ---------- posts to show ----------
  const posts = [
    {
      to: '/blog/build-study-plan-from-church-sermon',
      title: 'How to Build a Study Plan from Your Church Sermon',
      excerpt:
        "Turn Sunday's message into a focused, 5-day study you’ll actually do.",
      meta: '6 min • Bible Study Tips',
    },
    {
      to: '/blog/what-to-do-with-sermon-notes',
      title: 'What To Do with Sermon Notes',
      excerpt:
        'A Kingdom-shaped rhythm to move from ink on a page to obedience in your week.',
      meta: '7 min • Practice',
    },
    {
      to: '/blog/going-deeper-study-bible-in-themes',
      title: 'Going Deeper: Study the Bible in Themes',
      excerpt:
        'Trace big biblical themes to see how the whole story points to Jesus.',
      meta: '5 min • Method',
    },
    {
      to: '/blog/practical-ways-study-bible-with-friends',
      title: 'Practical Ways to Study the Bible with Friends',
      excerpt:
        'Simple formats that make group study rich, honest, and consistent.',
      meta: '5 min • Community',
    },
    {
      to: '/blog/your-sermon-notes-can-become-a-book',
      title: 'Your Sermon Notes Can Become a Book',
      excerpt:
        'Discern God’s call, mine your archives, and steward years of preaching into a faithful manuscript.',
      meta: '10 min • Writing & Ministry',
    },
  ];

  return (
    <div style={pageWrap}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-warm-cool)',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />
      <section style={container}>
        <h1 style={heading}>Blog</h1>
        <p style={sub}>
          Practical, Christ-centered guides to help you turn sermons and Scripture
          into daily spiritual growth.
        </p>

        <div style={grid}>
          {posts.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <div style={cardTitle}>{p.title}</div>
              <div style={cardExcerpt}>{p.excerpt}</div>
              <span style={cardMeta}>{p.meta}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
