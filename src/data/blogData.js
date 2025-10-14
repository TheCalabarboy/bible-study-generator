export const blogPosts = [
  {
    id: 1,
    slug: 'build-study-plan-from-church-sermon',
    title: 'How to Build a Study Plan from Your Church Sermon',
    excerpt: 'Transform your Sunday sermon into a week-long spiritual growth journey. Learn practical steps to create meaningful Bible study plans from the messages you hear.',
    author: 'SermonDive Team',
    date: 'January 15, 2025',
    readTime: '8 min read',
    category: 'Bible Study Methods',
    image: '📖',
    tags: ['Study Plans', 'Sermons', 'Spiritual Growth'],
  },
  {
    id: 2,
    slug: 'what-to-do-with-sermon-notes',
    title: 'What to Do with the Sermon Notes You Have Been Keeping',
    excerpt: 'Your sermon notes are valuable spiritual treasures. Discover how to use AI to consolidate, organize, and track your spiritual growth journey through years of collected wisdom.',
    author: 'SermonDive Team',
    date: 'January 12, 2025',
    readTime: '10 min read',
    category: 'Note-Taking & Organization',
    image: '📝',
    tags: ['Sermon Notes', 'AI Tools', 'Spiritual Growth Tracking'],
  },
  {
    id: 3,
    slug: 'practical-ways-study-bible-with-friends',
    title: 'Practical Ways to Study the Bible with Friends',
    excerpt: 'Bible study is better together. Explore proven methods to create engaging, meaningful group studies that deepen friendships and faith simultaneously.',
    author: 'SermonDive Team',
    date: 'January 10, 2025',
    readTime: '12 min read',
    category: 'Group Study',
    image: '👥',
    tags: ['Small Groups', 'Community', 'Bible Study'],
  },
  {
    id: 4,
    slug: 'sermon-notes-can-become-book',
    title: 'Your Sermon Notes Can Become a Book',
    excerpt: 'Years of faithful note-taking can become a published legacy. Learn how to compile your spiritual insights into a book that blesses others.',
    author: 'SermonDive Team',
    date: 'January 8, 2025',
    readTime: '15 min read',
    category: 'Writing & Publishing',
    image: '📚',
    tags: ['Publishing', 'Writing', 'Legacy'],
  },
  {
    id: 5,
    slug: 'going-deeper-study-bible-in-themes',
    title: 'Going Deeper! Study the Bible in Themes',
    excerpt: 'Move beyond surface-level reading to thematic Bible study. Discover how studying Scripture by themes unlocks profound theological insights and life transformation.',
    author: 'SermonDive Team',
    date: 'January 5, 2025',
    readTime: '14 min read',
    category: 'Advanced Study',
    image: '🔍',
    tags: ['Thematic Study', 'Theology', 'Deep Dive'],
  },
];

// THIS IS IMPORTANT - Make sure you have this function:
export function getAllBlogPosts() {
  return blogPosts;
}

// THIS TOO:
export function getBlogPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}