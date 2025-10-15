import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/build-study-plan-hero.png';

export default function BuildStudyPlan() {
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

          {/* Header */}
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
            Bible Study Tips
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            How to Build a Study Plan from Your Church Sermon
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
            <span>📅 October 12, 2025</span>
            <span>⏱️ 6 min read</span>
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

          {/* Content */}
          <div style={{
            lineHeight: '1.8',
            color: '#333',
            fontSize: '18px',
          }}>
            <p style={{ marginBottom: '20px', fontSize: '20px', color: '#667eea', fontWeight: '500' }}>
              Sunday sermons can be powerful, but without intentional follow-up, their impact often 
              fades by Monday morning. Here's how to transform that Sunday message into a week of 
              transformative Bible study.
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Why Sunday Isn't Enough
            </h2>
            
            <p style={{ marginBottom: '20px' }}>
              Research shows that we forget up to 90% of what we hear within 48 hours. That powerful 
              sermon your pastor preached? Without deliberate reinforcement, most of it will slip 
              away before the week ends.
            </p>

            <p style={{ marginBottom: '20px' }}>
              But here's the good news: with a simple study plan, you can multiply the impact of 
              every sermon you hear. Instead of being a passive listener on Sunday, you become an 
              active disciple throughout the week.
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Step 1: Capture the Core Message
            </h2>

            <p style={{ marginBottom: '20px' }}>
              <strong>During or immediately after the sermon:</strong>
            </p>

            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>
                Write down the main Scripture passage(s) referenced
              </li>
              <li style={{ marginBottom: '10px' }}>
                Note 2-3 key points or themes the pastor emphasized
              </li>
              <li style={{ marginBottom: '10px' }}>
                Record any "aha moments" or convictions you felt
              </li>
              <li style={{ marginBottom: '10px' }}>
                Jot down any questions that arose
              </li>
            </ul>

            <div style={{
              background: '#f8f7ff',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              borderLeft: '4px solid #667eea',
            }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>
                <strong>Pro Tip:</strong> If your church posts sermon videos on YouTube, you already 
                have everything you need to create an automated study plan using{' '}
                <Link to="/" style={{ color: '#667eea' }}>SermonDive</Link>.
              </p>
            </div>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Step 2: Design Your 5-Day Framework
            </h2>

            <p style={{ marginBottom: '20px' }}>
              A well-structured study plan helps you progressively understand and apply the sermon's 
              message. Here's a proven framework:
            </p>

            <h3 style={{ fontSize: '22px', color: '#333', marginTop: '30px', marginBottom: '15px' }}>
              <strong>Monday: Foundation</strong>
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Read the main Scripture passage slowly, multiple times. Write down observations:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Who is speaking?</li>
              <li style={{ marginBottom: '10px' }}>Who is the audience?</li>
              <li style={{ marginBottom: '10px' }}>What's the historical context?</li>
              <li style={{ marginBottom: '10px' }}>What stands out to you?</li>
            </ul>

            <h3 style={{ fontSize: '22px', color: '#333', marginTop: '30px', marginBottom: '15px' }}>
              <strong>Tuesday: Context</strong>
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Read the surrounding chapters. Understanding context prevents misinterpretation and 
              reveals deeper meaning. Ask:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>What comes before and after this passage?</li>
              <li style={{ marginBottom: '10px' }}>How does it fit in the larger story?</li>
              <li style={{ marginBottom: '10px' }}>Are there cross-references to other Scriptures?</li>
            </ul>

            <h3 style={{ fontSize: '22px', color: '#333', marginTop: '30px', marginBottom: '15px' }}>
              <strong>Wednesday: Doctrine</strong>
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Connect the sermon to broader biblical truth. What does this passage teach about:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>God's character?</li>
              <li style={{ marginBottom: '10px' }}>Human nature?</li>
              <li style={{ marginBottom: '10px' }}>Salvation and the Gospel?</li>
              <li style={{ marginBottom: '10px' }}>Christian living?</li>
            </ul>

            <h3 style={{ fontSize: '22px', color: '#333', marginTop: '30px', marginBottom: '15px' }}>
              <strong>Thursday: Application</strong>
            </h3>
            <p style={{ marginBottom: '20px' }}>
              This is where transformation happens. Ask yourself:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>
                What does God want me to know from this passage?
              </li>
              <li style={{ marginBottom: '10px' }}>
                What does He want me to change?
              </li>
              <li style={{ marginBottom: '10px' }}>
                What specific action will I take this week?
              </li>
              <li style={{ marginBottom: '10px' }}>
                How can I share this truth with others?
              </li>
            </ul>

            <h3 style={{ fontSize: '22px', color: '#333', marginTop: '30px', marginBottom: '15px' }}>
              <strong>Friday: Integration</strong>
            </h3>
            <p style={{ marginBottom: '20px' }}>
              Reflect on the entire week. Journal about:
            </p>
            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>
                How has my understanding deepened since Sunday?
              </li>
              <li style={{ marginBottom: '10px' }}>
                What changes have I already begun to make?
              </li>
              <li style={{ marginBottom: '10px' }}>
                What do I want to remember long-term?
              </li>
              <li style={{ marginBottom: '10px' }}>
                How does this connect to my overall spiritual journey?
              </li>
            </ul>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Step 3: Create Accountability
            </h2>

            <p style={{ marginBottom: '20px' }}>
              Study plans work best when you have accountability. Consider:
            </p>

            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Find a study partner:</strong> Text each other daily insights
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Join a small group:</strong> Discuss the sermon together during the week
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Share publicly:</strong> Post one takeaway on social media each day
              </li>
              <li style={{ marginBottom: '10px' }}>
                <strong>Track your progress:</strong> Keep a journal or use a Bible study app
              </li>
            </ul>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Common Pitfalls to Avoid
            </h2>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                ❌ Making it too complicated
              </h3>
              <p>
                You don't need fancy journals or elaborate systems. Start with 10-15 minutes per day 
                using a simple notebook or phone app.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                ❌ Studying in isolation
              </h3>
              <p>
                God designed us for community. Share insights with your church family and learn from 
                their perspectives.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '10px' }}>
                ❌ Skipping application
              </h3>
              <p>
                Knowledge without application leads to pride. Always ask, "So what?" and "Now what?"
              </p>
            </div>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              The Automated Approach
            </h2>

            <p style={{ marginBottom: '20px' }}>
              Creating study plans manually is valuable, but it can be time-consuming. This is where 
              technology can serve your spiritual growth.
            </p>

            <p style={{ marginBottom: '20px' }}>
              Tools like <Link to="/" style={{ color: '#667eea' }}>SermonDive</Link> analyze sermon 
              content and automatically generate structured 5-day study plans with:
            </p>

            <ul style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '10px' }}>Daily Scripture readings</li>
              <li style={{ marginBottom: '10px' }}>Reflection questions</li>
              <li style={{ marginBottom: '10px' }}>Application points</li>
              <li style={{ marginBottom: '10px' }}>Prayer focuses</li>
            </ul>

            <p style={{ marginBottom: '20px' }}>
              This doesn't replace personal study—it enhances it by giving you a solid framework to 
              start from, freeing you to focus on application and spiritual growth rather than 
              structure and organization.
            </p>

            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: '40px', marginBottom: '20px' }}>
              Your Next Steps
            </h2>

            <p style={{ marginBottom: '20px' }}>
              Don't let this Sunday's sermon fade into memory. Here's your action plan:
            </p>

            <ol style={{ marginLeft: '30px', marginBottom: '20px' }}>
              <li style={{ marginBottom: '15px' }}>
                <strong>This Sunday:</strong> Take notes during the sermon, focusing on main 
                Scripture and key themes
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Sunday afternoon:</strong> Create your 5-day study outline using the 
                framework above
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Monday-Friday:</strong> Spend 10-15 minutes each morning following your plan
              </li>
              <li style={{ marginBottom: '15px' }}>
                <strong>Next Sunday:</strong> Notice how much more you retain and apply from your 
                previous week's study
              </li>
            </ol>

            <div style={{
              background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
              padding: '30px',
              borderRadius: '12px',
              marginTop: '40px',
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: '24px', color: '#667eea', marginBottom: '15px' }}>
                Want to Save Time?
              </h3>
              <p style={{ marginBottom: '20px', color: '#666' }}>
                Let SermonDive automatically create your weekly study plan from any sermon video.
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

          {/* Related Posts */}
          <div style={{
            marginTop: '60px',
            paddingTop: '40px',
            borderTop: '2px solid #e0e0e0',
          }}>
            <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
              Related Articles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <Link to="/blog/practical-ways-study-bible-with-friends" style={{ color: '#667eea', textDecoration: 'none', fontSize: '18px' }}>
                → Practical Ways to Study the Bible with Friends
              </Link>
              <Link to="/blog/going-deeper-study-bible-in-themes" style={{ color: '#667eea', textDecoration: 'none', fontSize: '18px' }}>
                → Going Deeper: Study the Bible in Themes
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}