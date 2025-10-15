// src/pages/Blog.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogListPage() {
  // ---------- styles (defined here so nothing is "not defined") ----------
  const pageWrap = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
  };

  const container = {
    maxWidth: '1000px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '24px',
    padding: '50px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  };

  const heading = {
    fontSize: '42px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
    lineHeight: 1.2,
  };

  const sub = {
    color: '#666',
    marginBottom: '30px',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  };

  const cardStyle = {
    display: 'block',
    textDecoration: 'none',
    background: '#f8f7ff',
    border: '2px solid #ece9ff',
    borderRadius: '16px',
    padding: '22px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    color: '#333',
  };

  const cardTitle = {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#333',
  };

  const cardExcerpt = {
    fontSize: '14px',
    color: '#555',
    marginBottom: '14px',
    lineHeight: 1.6,
  };

  const cardMeta = {
    display: 'inline-block',
    background: '#eae7ff',
    color: '#667eea',
    fontSize: '12px',
    fontWeight: 700,
    padding: '6px 10px',
    borderRadius: '8px',
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
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
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
