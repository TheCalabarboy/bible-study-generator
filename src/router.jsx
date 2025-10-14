import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/Blog';

// hand-styled blog pages (static)
import BuildStudyPlan from './pages/Blog/build-study-plan-from-church-sermon';
import SermonNotes from './pages/Blog/what-to-do-with-sermon-notes';
import StudyWithFriends from './pages/Blog/practical-ways-study-bible-with-friends.jsx';
import ThematicStudy from './pages/Blog/going-deeper-study-bible-in-themes';

// (optional) generic fallback for slugs not covered by static pages
import Post from './pages/Blog/Post';

import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';

const NotFound = () => (
  <div style={{ padding: 40 }}>Page not found. <a href="/">Go Home</a></div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'privacy', element: <Privacy /> },

      // Blog hub + nested routes
      {
        path: 'blog',
        children: [
          { index: true, element: <BlogListPage /> }, // /blog

          // STATIC posts — these must be here so they win over :slug
          { path: 'build-study-plan-from-church-sermon', element: <BuildStudyPlan /> },
          { path: 'what-to-do-with-sermon-notes', element: <SermonNotes /> },
          { path: 'practical-ways-study-bible-with-friends', element: <StudyWithFriends /> },
          { path: 'going-deeper-study-bible-in-themes', element: <ThematicStudy /> },

          // FALLBACK for any other slugs (reads from blogData.js)
          { path: ':slug', element: <Post /> },
        ],
      },

      { path: '*', element: <NotFound /> },
    ],
  },
]);
