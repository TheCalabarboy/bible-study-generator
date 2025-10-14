import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/study-with-friends-hero.png';

export default function StudyWithFriends() {
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
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px' }}>
            <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Blog
            </Link>
          </div>

          {/* Tag */}
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
            Community
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            Practical Ways to Study the Bible with Friends
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex',
            gap: '20px',
            color: '#999',
            fontSize: '14px',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e0e0e0',
          }}>
            <span>📅 October 12, 2025</span>
            <span>⏱️ 4 min read</span>
          </div>

          {/* Content */}
          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '18px' }}>
            <p style={{ marginBottom: '20px', fontSize: '20px', color: '#667eea', fontWeight: 500 }}>
              Spiritual growth thrives in relationships. Studying Scripture with friends adds
              encouragement, accountability, and shared wisdom—“iron sharpening iron” (Prov 27:17).
              Here are simple, repeatable ways to make it life-giving (not complicated).
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              1) Form a Micro-Group (3–5 people)
            </h2>
            <p style={{ marginBottom: 20 }}>
              Small is better. It keeps the conversation honest and practical. Decide on a cadence
              (weekly/biweekly) and meet for 60–75 minutes—at a cafe, home, or over video.
            </p>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}><strong>Keep it simple:</strong> Bible, notebook, and a plan.</li>
              <li style={{ marginBottom: 10 }}><strong>Rotate roles:</strong> facilitator, reader, prayer lead.</li>
              <li style={{ marginBottom: 10 }}><strong>Respect time:</strong> start/finish on time; protect the rhythm.</li>
            </ul>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              2) Use a 4-Step Conversational Flow
            </h2>
            <ol style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>
                <strong>Read:</strong> Read the passage aloud twice. Different readers help everyone engage.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Observe:</strong> What stands out? Repeated words? Commands? Promises? (What does it say?)
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Interpret:</strong> What did it mean for the original audience? How does this reveal Christ?
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Apply:</strong> What one specific step will I take this week (James 1:22)?
              </li>
            </ol>

            <div style={{
              background: '#f8f7ff',
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
              borderLeft: '4px solid #667eea',
            }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                <strong>Tip:</strong> If your group listens to the same Sunday sermon, you can generate a
                5-day study outline automatically with{' '}
                <Link to="/" style={{ color: '#667eea' }}>SermonDive</Link> and discuss highlights together.
              </p>
            </div>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              3) Try These Easy Formats
            </h2>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>
                <strong>Passage-of-the-Week:</strong> One chapter; same 4-step flow each meeting.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Sermon-Follow-Up:</strong> Use your pastor’s text; share a “One Thing” obedience step.
              </li>
              <li style={{ marginBottom: 10 }}>
                <strong>Theme Sprint (4 weeks):</strong> Pick a theme (e.g., prayer, generosity) and trace
                4 key passages together.
              </li>
            </ul>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              4) Build Gentle Accountability
            </h2>
            <p style={{ marginBottom: 20 }}>
              Keep it grace-filled and specific: “What step did you try? What helped or got in the way?”
              Celebrate progress, pray for obstacles, and reset goals weekly.
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              5) Pray With Scripture
            </h2>
            <p style={{ marginBottom: 20 }}>
              Close by turning the passage into prayer. Read a verse and pray it back to God as a group.
              This binds truth to the heart (Col 3:16).
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              A Simple 60-Minute Agenda
            </h2>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>10 min – Catch up & answered prayers</li>
              <li style={{ marginBottom: 10 }}>20 min – Read & Observe</li>
              <li style={{ marginBottom: 10 }}>20 min – Interpret & Apply</li>
              <li style={{ marginBottom: 10 }}>10 min – Prayer (pray the passage)</li>
            </ul>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              Your Next Step
            </h2>
            <ol style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>Invite 2–4 friends.</li>
              <li style={{ marginBottom: 10 }}>Pick a weekly time and place.</li>
              <li style={{ marginBottom: 10 }}>Choose a passage or use your church’s sermon text.</li>
              <li style={{ marginBottom: 10 }}>Commit to one “One Thing” each week and follow up.</li>
            </ol>

            <div style={{
              background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
              padding: 30,
              borderRadius: 12,
              marginTop: 40,
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 24, color: '#667eea', marginBottom: 15 }}>Start Together</h3>
              <p style={{ marginBottom: 20, color: '#666' }}>
                Generate a study from a sermon, share it with your group, and discuss your “One Thing.”
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
                Try SermonDive Free
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
              <Link to="/blog/going-deeper-study-bible-in-themes" style={{ color: '#667eea', textDecoration: 'none', fontSize: 18 }}>
                → Going Deeper: Study the Bible in Themes
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
