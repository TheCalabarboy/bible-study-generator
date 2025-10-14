import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/Blog';
import Post from './pages/Blog/Post'; // dynamic post page
import BuildStudyPlan from './pages/Blog/build-study-plan-from-church-sermon';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import GeneratePage from './pages/Generate';
import Topics from './pages/Topics';


const NotFound = () => (
  <div style={{ padding: 40 }}>
    Page not found. <a href="/">Go Home</a>
  </div>
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
      // Blog list + dynamic posts
      { path: 'blog', element: <BlogListPage /> },
      { path: 'blog/:slug', element: <Post /> },
      // Keep this special article if you want it as a featured page
      { path: 'blog/build-study-plan-from-church-sermon', element: <BuildStudyPlan /> },
      { path: '*', element: <NotFound /> },
      { path: 'generate', element: <GeneratePage /> },
      { path: 'topics', element: <Topics /> },

    ]
  }
]);
