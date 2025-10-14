import React from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../data/blogData'; // adjust import path if different

export default function BlogListPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 36, marginBottom: 16, color: '#333' }}>Blog</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Essays and guides on Bible study and spiritual formation.
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        {posts.map((p) => (
          <Link
            key={p.slug}
            to={`/blog/${p.slug}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              padding: 20,
              borderRadius: 12,
              border: '1px solid #eee',
              background: 'white',
              color: '#333',
              transition: 'transform .1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <h3 style={{ margin: '0 0 6px 0', color: '#667eea' }}>{p.title}</h3>
            <p style={{ margin: 0, color: '#666' }}>{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
