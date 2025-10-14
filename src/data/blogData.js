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
      date: '2025-10-14',
    readTime: '7 min read',
    tag: 'Spiritual Formation'
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
