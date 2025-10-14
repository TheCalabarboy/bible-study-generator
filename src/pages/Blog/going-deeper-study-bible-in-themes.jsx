import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/thematic-study-hero.png';

export default function ThematicStudy() {
  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '40px 20px',
      }}>
        <article style={{
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '24px',
          padding: '50px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          <div style={{ marginBottom: '20px' }}>
            <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Blog
            </Link>
          </div>

          <div style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: '#f8f7ff',
            color: '#667eea',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}>
            Theology
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            Going Deeper: Study the Bible in Themes
          </h1>

          <div style={{
            display: 'flex',
            gap: '20px',
            color: '#999',
            fontSize: '14px',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e0e0e0',
          }}>
            <span>📅 October 13, 2025</span>
            <span>⏱️ 5 min read</span>
          </div>

            {/* HERO IMAGE */}
            <div style={{ margin: '24px 0 36px' }}>
            <img
                src={heroImg}
                alt="Describe the photo clearly for accessibility and SEO"
                loading="lazy"
                style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                }}
            />
            </div>

          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '18px' }}>
            <p style={{ marginBottom: 20, fontSize: 20, color: '#667eea', fontWeight: 500 }}>
              Thematic study traces a single thread (e.g., covenant, holiness, generosity) across the
              whole Bible. It helps you see Scripture as one story centered on Christ (Luke 24:27).
            </p>

            <h2 style={{ fontSize: 28, color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              Why Theme-Based Study?
            </h2>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}><strong>Clarity:</strong> Connects Old and New Testaments.</li>
              <li style={{ marginBottom: 10 }}><strong>Worship:</strong> Reveals God’s character across time.</li>
              <li style={{ marginBottom: 10 }}><strong>Practice:</strong> Shows how doctrine shapes daily life.</li>
            </ul>

            <h2 style={{ fontSize: 28, color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              A 4-Week Thematic Plan
            </h2>
            <p style={{ marginBottom: 20 }}>
              Pick one theme and follow this weekly flow. Example theme: <em>“God’s Faithfulness.”</em>
            </p>

            <h3 style={{ fontSize: 22, color: '#333', marginTop: 30, marginBottom: 15 }}><strong>Week 1 — Foundations</strong></h3>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Genesis 12:1–9; 15:1–6 — Promise to Abraham</li>
              <li style={{ marginBottom: 10 }}>Exodus 34:5–7 — God’s name and character</li>
            </ul>

            <h3 style={{ fontSize: 22, color: '#333', marginTop: 30, marginBottom: 15 }}><strong>Week 2 — Faithfulness in Israel’s Story</strong></h3>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Psalm 36; Psalm 89 — Covenant love endures</li>
              <li style={{ marginBottom: 10 }}>Lamentations 3:21–26 — Hope in suffering</li>
            </ul>

            <h3 style={{ fontSize: 22, color: '#333', marginTop: 30, marginBottom: 15 }}><strong>Week 3 — Fulfilled in Christ</strong></h3>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Luke 1:46–55; 1:68–79 — God remembers His promises</li>
              <li style={{ marginBottom: 10 }}>2 Corinthians 1:20 — “All the promises of God find their Yes in Him.”</li>
            </ul>

            <h3 style={{ fontSize: 22, color: '#333', marginTop: 30, marginBottom: 15 }}><strong>Week 4 — Faithfulness in the Church</strong></h3>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Hebrews 10:19–25 — Hold fast; encourage one another</li>
              <li style={{ marginBottom: 10 }}>1 Thessalonians 5:23–24 — “He who calls you is faithful.”</li>
            </ul>

            <div style={{
              background: '#f8f7ff',
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              borderLeft: '4px solid #667eea',
            }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                <strong>Tip:</strong> Use cross-references in a good study Bible and keep a running list
                of repeated words/ideas. Consider generating weekly outlines with{' '}
                <Link to="/" style={{ color: '#667eea' }}>SermonDive</Link> if your theme follows your church’s sermons.
              </p>
            </div>

            <h2 style={{ fontSize: 28, color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              Discussion & Application
            </h2>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>What does this theme reveal about God’s character?</li>
              <li style={{ marginBottom: 10 }}>How does the Gospel fulfill and deepen this theme?</li>
              <li style={{ marginBottom: 10 }}>What one practice will I adopt this week?</li>
            </ul>

            <h2 style={{ fontSize: 28, color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              Your Next Step
            </h2>
            <ol style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Choose one theme for the next month.</li>
              <li style={{ marginBottom: 10 }}>Select 6–8 passages spanning Old/New Testaments.</li>
              <li style={{ marginBottom: 10 }}>Use the same questions each week (observe/interpret/apply).</li>
              <li style={{ marginBottom: 10 }}>Record a weekly “One Thing” tied to a promise of God.</li>
            </ol>

            <div style={{
              background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
              padding: 30,
              borderRadius: 12,
              marginTop: 40,
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 24, color: '#667eea', marginBottom: 15 }}>Trace the Thread</h3>
              <p style={{ marginBottom: 20, color: '#666' }}>
                Pick sermons or passages around your theme and let SermonDive scaffold your week.
              </p>
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
                Generate a Study Plan
              </Link>
            </div>
          </div>

          {/* Related */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: '2px solid #e0e0e0' }}>
            <h3 style={{ fontSize: 24, color: '#333', marginBottom: 20 }}>Related Articles</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <Link to="/blog/build-study-plan-from-church-sermon" style={{ color: '#667eea', textDecoration: 'none', fontSize: 18 }}>
                → How to Build a Study Plan from Your Church Sermon
              </Link>
              <Link to="/blog/practical-ways-study-bible-with-friends" style={{ color: '#667eea', textDecoration: 'none', fontSize: 18 }}>
                → Practical Ways to Study the Bible with Friends
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
