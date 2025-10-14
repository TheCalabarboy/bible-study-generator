// src/data/blogData.js

// 1) Named export: posts
export const posts = [
  {
    slug: 'build-study-plan-from-church-sermon',
    title: 'Build a Study Plan from a Church Sermon',
    excerpt:
      'Turn any Sunday message into a structured 5-day Bible study with Scripture, questions, and prayer.',
  },
  
  {
    slug: 'what-to-do-with-sermon-notes',
    title: 'What To Do with Sermon Notes',
    excerpt:
      'Simple ways to turn your notes into spiritual growth: habit loops, reflection prompts, and action steps.',
        slug: 'what-to-do-with-sermon-notes',
        title: 'What To Do with Sermon Notes',
        date: '2025-10-14',
        author: 'SermonDive Team',
        tags: ['discipleship', 'habits', 'sermon-notes', 'spiritual-formation'],
        cover: '/blog/sermon-notes.jpg', // optional: place an image at public/blog/sermon-notes.jpg
        excerpt:
            'A simple, Kingdom-shaped rhythm to turn sermon notes into Spirit-led formation—moving from ink on a page to obedience in your week.',
        content: `
        # What To Do with Sermon Notes

        You don’t need another stack of paper sanctified by coffee stains. You need a way for the Word you heard to become the life you live. Here’s a simple, Kingdom-shaped rhythm to turn sermon notes into Spirit-led formation—moving from ink on a page to obedience in your week (James 1:22–25, ESV; Luke 8:15, ESV).

        ## 1) Pray before you process

        Ask the Spirit to illuminate and anchor the Word (John 14:26; 1 Cor 2:12–13). A thirty-second prayer—“Lord, plant this in good soil”—prepares your heart more than thirty extra minutes of anxious rereading.

        ## 2) Capture the Big Gospel Idea

        In one or two sentences, summarize the sermon as “Good News about Jesus” (Luke 24:27; 2 Tim 3:16–17). Example: “Because the risen King is near, I can cast my anxiety on Him and practice gentleness this week.” Keep Christ at the center—not just a moral to try harder, but a Savior to trust deeper.

        ## 3) Trace the Kingdom thread

        Ask: What did this teach about the reign of God—already here, not yet complete (Matt 4:17; Rom 14:17; Rev 11:15)? Note one implication for your neighborhood, work, or home. The Kingdom is not a theory; it’s a present reality that reorders our ordinary.

        ## 4) Identify one concrete act of obedience

        Translate insight into a **Rule of Life**—a small, repeatable practice (Matt 7:24; John 13:17). Use the “**One Thing**” formula:

        * **I will** (practice) **at** (time/place) **because** (promise of God).
        * Example: “I will begin each commute with Psalm 23 aloud because the Lord is my Shepherd.”

        ## 5) Bind it to Scripture in context

        Attach your “One Thing” to 2–3 key passages the sermon used. Read them in full, not just the verse fragments you jotted (Acts 17:11; Col 3:16; Ps 119:11). Let Scripture interpret Scripture and keep your obedience rooted in the text.

        ## 6) Share with one person for encouragement

        Invite a trusted brother or sister to ask you about your “One Thing” midweek (Heb 10:24–25; Prov 27:17). The aim is mutual strengthening, not spiritual surveillance. Grace fuels accountability.

        ## 7) Archive with purpose, not guilt

        Tag your notes with three quick labels:

        * **Theme:** e.g., Prayer, Justice, Holiness
        * **Text(s):** e.g., Philippians 4; Matthew 6
        * **Practice:** e.g., Daily gratitude at lunch  
        Whether you use a notebook or an app, these tags make past truth retrievable when life gets loud (Deut 6:6–9).

        ---

        ### A 10-Minute Weekly Template

        1. **Breathe & Pray (1 min)** – “Spirit, illuminate.”
        2. **Big Gospel Idea (2 min)** – One sentence centered on Christ.
        3. **Kingdom Implication (2 min)** – Where the King is at work in your world.
        4. **One Thing (3 min)** – Specific practice tied to a promise.
        5. **Share & Tag (2 min)** – Text a friend; add theme/text/practice.

        ---

        ### Why this works (theologically speaking)

        * It unites **Christology** and **discipleship**: Jesus isn’t an illustration; He is the message and the means (Col 1:28; Gal 2:20).
        * It honors the **already/not yet**: small acts of obedience witness to a Kingdom that has arrived and is still arriving (Matt 6:10; Phil 2:12–13).
        * It keeps formation **Word-anchored and Spirit-empowered**: Scripture shapes the mind; the Spirit energizes the will (Rom 12:1–2; Eph 3:16–19).

        ---

        ### For further meditation this week

        Read and pray through: Luke 8:4–15; James 1:22–25; Colossians 3:12–17; Matthew 7:24–27; Philippians 4:4–9 (ESV/NIV). Ask: “How does this reveal Christ the King, and what practice fits my real life right now?”

        Bring this into conversation with a mature believer, and consider journaling one way you saw the King’s reign interrupt your usual patterns.

        While this provides a framework, the Holy Spirit is your ultimate teacher (1 John 2:27). Spend time in His presence, study the Word, and allow the Father to reveal truth personally. All theology must lead to deeper intimacy with Christ and transformation.
        `.trim()
    },

  {
    slug: 'practical-ways-study-bible-with-friends',
    title: 'Practical Ways to Study the Bible with Friends',
    excerpt:
      'Make Scripture conversations natural and fruitful with easy formats and weekly rhythms.',
  },
  {
    slug: 'sermon-notes-can-become-book',
    title: 'Your Sermon Notes Can Become a Book',
    excerpt:
      'From raw notes to a short devotional or booklet— outline patterns that actually work.',
  },
  {
    slug: 'going-deeper-study-bible-in-themes',
    title: 'Going Deeper: Study the Bible in Themes',
    excerpt:
      'Trace themes across Scripture— covenant, kingdom, presence— to see the big story more clearly.',
  },
];

// 2) (Optional) helper used by Post.jsx pages
export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}
