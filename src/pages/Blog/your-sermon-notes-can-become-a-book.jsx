import React from 'react';
import { Link } from 'react-router-dom';
import heroImg from '../../assets/blog/sermon-notes-book-hero.png';

export default function YourSermonNotesCanBecomeABook() {
  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '40px 20px',
        }}
      >
        <article
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            background: 'white',
            borderRadius: '24px',
            padding: '50px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {/* Breadcrumb */}
          <div style={{ marginBottom: '20px' }}>
            <Link to="/blog" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Blog
            </Link>
          </div>

          {/* Header badge */}
          <div
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: '#f8f7ff',
              color: '#667eea',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Writing &amp; Ministry
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            Your Sermon Notes Can Become a Book
          </h1>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              color: '#999',
              fontSize: '14px',
              marginBottom: '40px',
              paddingBottom: '20px',
              borderBottom: '2px solid #e0e0e0',
            }}
          >
            <span>📅 October 21, 2025</span>
            <span>⏱️ 10 min read</span>
          </div>

          {/* Hero Image */}
          <div style={{ margin: '24px 0 36px' }}>
            <img
              src={heroImg}
              alt="Pastor reviewing sermon notes and writing a manuscript"
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
          <div style={{ lineHeight: 1.8, color: '#333', fontSize: '18px' }}>
            <p style={{ marginBottom: '24px', fontSize: '20px', color: '#667eea', fontWeight: 500 }}>
              The sermons you have preached week after week are more than faithful Sunday labors—they are seeds that
              can be gathered, refined, and multiplied into a book that continues bearing fruit long after the benediction.
              Before you print a single page, there is a holy first step: asking whether the Lord is inviting you to steward
              your sermon notes for readers you may never meet (<em>Proverbs 16:9</em>).
            </p>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              Seeking the Father&apos;s Will First
            </h2>
            <p style={{ marginBottom: 18 }}>
              The foundation of any Christian writing project is divine direction, not personal ambition. The question is
              never simply, “Can I write this book?” but “Is God calling me to write it?” Scripture cautions us against making
              plans apart from the Lord (<em>James 4:13–15</em>). Even the apostle Paul had to yield his preaching itinerary to
              the Spirit’s leading when the Lord redirected him to Macedonia (<em>Acts 16:6–10</em>). If Paul needed such
              direction for his spoken ministry, we should certainly seek heaven’s voice before launching a written one.
            </p>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              A Prayer of Consecration and Wisdom
            </h2>
            <p style={{ marginBottom: 18 }}>
              When you sense the Holy Spirit nudging you toward authorship, respond with consecration. Offer your notes,
              time, and influence back to the Father. Pray, “Here am I, send me” (<em>Isaiah 6:8</em>), recognizing that every
              insight you have taught was a gift of grace (<em>James 1:17</em>). Ask for wisdom to know which messages belong
              in book form and when readers most need them (<em>James 1:5</em>). Commit to write only for God’s glory and not
              for personal platform (<em>John 7:18</em>).
            </p>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              Mining Your Sermon Archives for Gold
            </h2>
            <p style={{ marginBottom: 18 }}>
              With a settled call, you can revisit your sermon archives with fresh eyes. Gather your outlines, manuscripts,
              and Bible study notes from recent years. Ask the Spirit to help you notice patterns and repeated burdens.
              Perhaps you have returned often to spiritual warfare, prayer, family restoration, or persevering through trials.
              These threads typically reveal the specific message the Lord has been developing in you.
            </p>
            <p style={{ marginBottom: 18 }}>
              Categorize your sermons by theme rather than date. Seemingly disconnected messages may emerge as a single,
              unified body of teaching—like discovering a tapestry woven over years by the same Shepherd
              (<em>Ecclesiastes 12:11</em>). Sermons on David’s valleys, Peter’s restoration, and Paul’s thorn might all
              highlight God’s strength in human weakness, pointing toward a compelling book concept.
            </p>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              Building Through Meditation and Journaling
            </h2>
            <p style={{ marginBottom: 18 }}>
              Turning weekly notes into chapters requires deeper meditation. Follow the psalmist’s pattern: “I will meditate
              on Your precepts” (<em>Psalm 119:15</em>). Set aside regular time to revisit each theme and let the Holy Spirit
              expand the truths you taught in thirty minutes into robust, chapter-length insights. Keep a dedicated journal for
              this project—record fresh revelation, testimonies of changed lives, and contemporary situations that make the
              message timely. Like Mary, treasure and ponder these things in your heart (<em>Luke 2:19</em>).
            </p>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              Practical Steps to Realize Your Book Project
            </h2>
            <ol style={{ marginLeft: 24, marginBottom: 24 }}>
              <li style={{ marginBottom: 18 }}>
                <strong>Establish a writing schedule.</strong> Pair divine calling with practical planning as Nehemiah did.
                Reserve consistent writing windows—even 30 focused minutes a day can move a manuscript forward.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Create a detailed outline.</strong> Prepare the field before building the house (<em>Proverbs 24:27</em>).
                Arrange your sermon themes into a logical flow that serves readers and keeps the narrative tight.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Write to one person.</strong> Picture a specific congregant who needs these truths. Jesus often revealed
                the Kingdom one conversation at a time. Writing to someone concrete keeps your tone pastoral and personal.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Include stories and testimonies.</strong> Preserve the real-life narratives that made your sermons
                resonate. Like Jesus’ parables, these accounts demonstrate how biblical truths transform daily life.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Maintain biblical integrity.</strong> Be a worker who rightly handles the Word (<em>2 Timothy 2:15</em>).
                Expand sermon points into fully supported, context-aware teaching. Invite trusted peers to review your drafts.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Edit ruthlessly.</strong> Fewer, sharper words often carry greater power (<em>Proverbs 10:19</em>). Remove
                redundancies and off-topic tangents. Set aside good content that doesn’t fit this book for future projects.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Seek feedback from your congregation.</strong> Ask those who first heard these messages which teachings
                shaped them most. Their insight will confirm the book’s focus and reveal where clarification is needed.
              </li>
              <li style={{ marginBottom: 18 }}>
                <strong>Partner with writing professionals.</strong> Two are better than one (<em>Ecclesiastes 4:9–10</em>).
                Collaborating with a Christian editor or writing coach helps your spoken voice translate effectively to the page.
              </li>
            </ol>

            <h2 style={{ fontSize: '30px', color: '#764ba2', marginTop: 36, marginBottom: 18 }}>
              A Final Word of Encouragement
            </h2>
            <p style={{ marginBottom: 18 }}>
              The shift from pulpit to print may feel daunting, yet the God who empowered your preaching will sustain your
              writing (<em>Philippians 4:13</em>). Your sermon notes are the record of years spent listening to God on behalf of
              His people. As you offer them back to Him, He can amplify their reach far beyond your sanctuary. Books endure,
              disciple new generations, and continue ministering when your voice grows quiet.
            </p>
            <p style={{ marginBottom: 18 }}>
              Remember that the power is not in eloquence but in God’s Word. When His truth goes forth, it does not return void
              (<em>Isaiah 55:11</em>). If the Lord is prompting you to steward your notes as a book, step forward in prayer,
              wisdom, and discipline. The publishing fields are white with readers hungry for shepherds who unite biblical depth
              with pastoral care. Your unique voice—tempered by study, prayer, and lived obedience—may be exactly what the Body
              needs next.
            </p>
            <p style={{ marginBottom: 0, fontWeight: 600, color: '#4c1d95' }}>
              Begin with prayer. Proceed with wisdom. Persist with discipline. Your sermon notes can indeed become a book that
              glorifies God and edifies His people for years to come.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
