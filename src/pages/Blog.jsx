import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { getAllBlogPosts } from '../data/blogData';

export default function Blog() {
  const blogPosts = [
    {
      id: 'build-study-plan-from-sermon',
      title: 'How to Build a Study Plan from Your Church Sermon',
      excerpt: 'Transform Sunday sermons into a week of spiritual growth. Learn practical steps to create meaningful Bible study plans that help you apply what you hear.',
      date: 'October 12, 2025',
      readTime: '6 min read',
      category: 'Bible Study Tips'
    },
    {
      id: 'ai-sermon-notes',
      title: 'What to Do With All Your Sermon Notes',
      excerpt: 'Discover how AI can help you consolidate years of sermon notes, track your spiritual growth, and create personalized study resources.',
      date: 'October 11, 2025',
      readTime: '5 min read',
      category: 'Technology & Faith'
    },
    {
      id: 'study-bible-with-friends',
      title: 'Practical Ways to Study the Bible with Friends',
      excerpt: 'Turn sermon-based studies into meaningful group discussions. Get actionable tips for starting and sustaining a thriving Bible study group.',
      date: 'October 10, 2025',
      readTime: '7 min read',
      category: 'Community'
    },
    {
      id: 'sermon-notes-to-book',
      title: 'Your Sermon Notes Can Become a Book',
      excerpt: 'Learn how to compile, organize, and publish your spiritual journey. Turn years of sermon notes into a lasting legacy of faith.',
      date: 'October 9, 2025',
      readTime: '8 min read',
      category: 'Writing & Publishing'
    },
    {
      id: 'study-bible-themes',
      title: 'Going Deeper: Study the Bible in Themes',
      excerpt: 'Move beyond individual sermons to thematic Bible study. Explore how connecting multiple teachings reveals deeper biblical truths.',
      date: 'October 8, 2025',
      readTime: '6 min read',
      category: 'Advanced Study'
    }
  ];

  return (
    <>
      <Navigation />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}>
        {/* Header */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 40px',
          textAlign: 'center',
          color: 'white',
        }}>
          <img 
            src={Logo} 
            alt="SermonDive Logo" 
            style={{ 
              width: '150px', 
              height: 'auto',
              margin: '0 auto 20px',
              display: 'block'
            }} 
          />
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '15px' }}>
            SermonDive Blog
          </h1>
          <p style={{ fontSize: '20px', opacity: '0.9' }}>
            Tips, insights, and inspiration for deeper Bible study
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
        }}>
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '6px 12px',
                  background: '#f8f7ff',
                  color: '#667eea',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                  alignSelf: 'flex-start',
                }}>
                  {post.category}
                </div>
                
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '15px',
                  lineHeight: '1.3',
                }}>
                  {post.title}
                </h2>
                
                <p style={{
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '20px',
                  flex: 1,
                }}>
                  {post.excerpt}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '15px',
                  borderTop: '1px solid #e0e0e0',
                  color: '#999',
                  fontSize: '14px',
                }}>
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          maxWidth: '800px',
          margin: '60px auto 0',
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        }}>
          <h3 style={{ fontSize: '28px', color: '#667eea', marginBottom: '15px' }}>
            Ready to Transform Your Sermon Notes?
          </h3>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '16px' }}>
            Try SermonDive and turn any sermon into a personalized 5-day Bible study plan.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '18px',
            }}
          >
            Generate Your Study Plan
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}