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
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none' }}>
          ← Back to Blog
        </Link>
      </div>

      <h1 style={{ fontSize: 36, marginBottom: 8 }}>{post.title}</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        {post.date} · {post.readTime} · {post.category}
      </p>

      {post.content ? (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}
        >
          <p style={{ lineHeight: 1.8, fontSize: 16 }}>
            Full article coming soon. Browse other posts on the blog.
          </p>
        </div>
      )}
    </div>
  );
}
