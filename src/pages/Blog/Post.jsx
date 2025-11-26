import React from 'react';
import { useParams, Link } from 'react-router-dom';
import * as BlogData from '../../data/blogData';  // <-- import all, be resilient
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Post() {
  const { slug } = useParams();

  // Use whichever export exists: getPostBySlug OR getBlogPostBySlug
  const getBySlug =
    BlogData.getPostBySlug ||
    BlogData.getBlogPostBySlug ||
    (() => null);

  const post = getBySlug(slug);

  if (!post) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none' }}>
            ← Back to Blog
          </Link>
        </div>
        <h1>Post not found</h1>
      </div>
    );
  }

  const html = DOMPurify.sanitize(marked.parse(post.content || ''));

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      padding: 'var(--space-100) var(--space-12)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-warm-cool)',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/blog" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
            ← Back to Blog
          </Link>
        </div>

        <h1 style={{ fontSize: 'clamp(34px, 4vw, 46px)', marginBottom: 8, color: 'var(--color-gray-900)', fontWeight: 400 }}>
          {post.title}
        </h1>
        <p style={{ color: 'var(--color-gray-600)', marginBottom: 24 }}>
          {post.date} · {post.readTime} · {post.category}
        </p>

        {post.content ? (
          <div
            style={{
              background: 'rgba(255,255,255,0.94)',
              borderRadius: 20,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div
            style={{
              background: 'rgba(255,255,255,0.94)',
              borderRadius: 20,
              padding: 'var(--space-6)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ lineHeight: 1.8, fontSize: 16, color: 'var(--color-gray-700)' }}>
              Full article coming soon. Browse other posts on the blog.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
