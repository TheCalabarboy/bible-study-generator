import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/sermon-notes-hero.png';

export default function SermonNotes() {
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

          {/* Header badge */}
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
            Spiritual Formation
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '20px',
            lineHeight: '1.2',
          }}>
            What To Do with Sermon Notes
          </h1>

          {/* Meta row */}
          <div style={{
            display: 'flex',
            gap: '20px',
            color: '#999',
            fontSize: '14px',
            marginBottom: '40px',
            paddingBottom: '20px',
            borderBottom: '2px solid #e0e0e0',
          }}>
            <span>📅 October 14, 2025</span>
            <span>⏱️ 7 min read</span>
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
          <div style={{ lineHeight: '1.8', color: '#333', fontSize: '18px' }}>
            <p style={{ marginBottom: '20px', fontSize: '20px', color: '#667eea', fontWeight: 500 }}>
              You don’t need another stack of paper sanctified by coffee stains. You need a way for the Word you heard
              to become the life you live. Here’s a simple, Kingdom-shaped rhythm to turn sermon notes into Spirit-led
              formation—moving from ink on a page to obedience in your week (<em>James 1:22–25</em>; <em>Luke 8:15</em>).
            </p>

            {/* 1 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              1) Pray before you process
            </h2>
            <p style={{ marginBottom: 20 }}>
              Ask the Spirit to illuminate and anchor the Word (<em>John 14:26</em>; <em>1 Cor 2:12–13</em>).
              A thirty-second prayer—“Lord, plant this in good soil”—prepares your heart more than thirty extra
              minutes of anxious rereading.
            </p>

            {/* 2 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              2) Capture the Big Gospel Idea
            </h2>
            <p style={{ marginBottom: 20 }}>
              In one or two sentences, summarize the sermon as “Good News about Jesus” (<em>Luke 24:27</em>;
              <em> 2 Tim 3:16–17</em>). Example: “Because the risen King is near, I can cast my anxiety on Him and
              practice gentleness this week.” Keep Christ at the center—not just a moral to try harder, but a Savior
              to trust deeper.
            </p>

            {/* 3 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              3) Trace the Kingdom thread
            </h2>
            <p style={{ marginBottom: 20 }}>
              Ask: What did this teach about the reign of God—already here, not yet complete
              (<em>Matt 4:17</em>; <em>Rom 14:17</em>; <em>Rev 11:15</em>)? Note one implication for your neighborhood,
              work, or home. The Kingdom is not a theory; it’s a present reality that reorders our ordinary.
            </p>

            {/* 4 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              4) Identify one concrete act of obedience
            </h2>
            <p style={{ marginBottom: 20 }}>
              Translate insight into a <strong>Rule of Life</strong>—a small, repeatable practice
              (<em>Matt 7:24</em>; <em>John 13:17</em>). Use the “<strong>One Thing</strong>” formula:
            </p>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 10 }}>
                <strong>I will</strong> (practice) <strong>at</strong> (time/place) <strong>because</strong> (promise of God).
              </li>
              <li style={{ marginBottom: 10 }}>
                Example: “I will begin each commute with Psalm 23 aloud because the Lord is my Shepherd.”
              </li>
            </ul>

            {/* 5 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              5) Bind it to Scripture in context
            </h2>
            <p style={{ marginBottom: 20 }}>
              Attach your “One Thing” to 2–3 key passages the sermon used. Read them in full, not just the verse
              fragments you jotted (<em>Acts 17:11</em>; <em>Col 3:16</em>; <em>Ps 119:11</em>). Let Scripture interpret
              Scripture and keep your obedience rooted in the text.
            </p>

            {/* 6 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              6) Share with one person for encouragement
            </h2>
            <p style={{ marginBottom: 20 }}>
              Invite a trusted brother or sister to ask you about your “One Thing” midweek (<em>Heb 10:24–25</em>;
              <em> Prov 27:17</em>). The aim is mutual strengthening, not spiritual surveillance. Grace fuels accountability.
            </p>

            {/* 7 */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              7) Archive with purpose, not guilt
            </h2>
            <p style={{ marginBottom: 12 }}>Tag your notes with three quick labels:</p>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Theme:</strong> e.g., Prayer, Justice, Holiness</li>
              <li style={{ marginBottom: 8 }}><strong>Text(s):</strong> e.g., Philippians 4; Matthew 6</li>
              <li style={{ marginBottom: 8 }}><strong>Practice:</strong> e.g., Daily gratitude at lunch</li>
            </ul>
            <p style={{ marginBottom: 20 }}>
              Whether you use a notebook or an app, these tags make past truth retrievable when life gets loud
              (<em>Deut 6:6–9</em>).
            </p>

            {/* Template callout */}
            <div style={{
              background: '#f8f7ff',
              padding: 20,
              borderRadius: 12,
              margin: '20px 0',
              borderLeft: '4px solid #667eea',
            }}>
              <h3 style={{ fontSize: 20, margin: 0, color: '#667eea' }}>A 10-Minute Weekly Template</h3>
              <ol style={{ marginLeft: 22, marginTop: 12, marginBottom: 0 }}>
                <li style={{ marginBottom: 8 }}><strong>Breathe & Pray (1 min)</strong> – “Spirit, illuminate.”</li>
                <li style={{ marginBottom: 8 }}><strong>Big Gospel Idea (2 min)</strong> – One sentence centered on Christ.</li>
                <li style={{ marginBottom: 8 }}><strong>Kingdom Implication (2 min)</strong> – Where the King is at work in your world.</li>
                <li style={{ marginBottom: 8 }}><strong>One Thing (3 min)</strong> – Specific practice tied to a promise.</li>
                <li style={{ marginBottom: 8 }}><strong>Share & Tag (2 min)</strong> – Text a friend; add theme/text/practice.</li>
              </ol>
            </div>

            {/* Why this works */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              Why this works (theologically speaking)
            </h2>
            <ul style={{ marginLeft: 30, marginBottom: 20 }}>
              <li style={{ marginBottom: 12 }}>
                It unites <strong>Christology</strong> and <strong>discipleship</strong>:
                Jesus isn’t an illustration; He is the message and the means
                (<em>Col 1:28</em>; <em>Gal 2:20</em>).
              </li>
              <li style={{ marginBottom: 12 }}>
                It honors the <strong>already/not yet</strong>: small acts of obedience witness to a Kingdom
                that has arrived and is still arriving (<em>Matt 6:10</em>; <em>Phil 2:12–13</em>).
              </li>
              <li style={{ marginBottom: 12 }}>
                It keeps formation <strong>Word-anchored and Spirit-empowered</strong>:
                Scripture shapes the mind; the Spirit energizes the will
                (<em>Rom 12:1–2</em>; <em>Eph 3:16–19</em>).
              </li>
            </ul>

            {/* Further meditation */}
            <h2 style={{ fontSize: '28px', color: '#764ba2', marginTop: 40, marginBottom: 20 }}>
              For further meditation this week
            </h2>
            <p style={{ marginBottom: 20 }}>
              Read and pray through: <em>Luke 8:4–15</em>; <em>James 1:22–25</em>;
              <em> Colossians 3:12–17</em>; <em>Matthew 7:24–27</em>; <em>Philippians 4:4–9</em>.
              Ask: “How does this reveal Christ the King, and what practice fits my real life right now?”
            </p>
            <p style={{ marginBottom: 20 }}>
              Bring this into conversation with a mature believer, and consider journaling one way you saw the King’s
              reign interrupt your usual patterns. While this provides a framework, the Holy Spirit is your ultimate
              teacher (<em>1 John 2:27</em>).
            </p>

            {/* CTA */}
            <div style={{
              background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
              padding: 30,
              borderRadius: 12,
              marginTop: 40,
              textAlign: 'center',
            }}>
              <h3 style={{ fontSize: 24, color: '#667eea', marginBottom: 15 }}>
                Turn Any Sermon into a 5-Day Study
              </h3>
              <p style={{ marginBottom: 20, color: '#666' }}>
                Paste a YouTube sermon link and let SermonDive build a Scripture-anchored plan in seconds.
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
