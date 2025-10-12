import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import GeneratePage from './pages/GeneratePage';
import StudyPage from './pages/StudyPage';
import LibraryPage from './pages/LibraryPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'generate',
        element: (
          <ProtectedRoute>
            <GeneratePage />
          </ProtectedRoute>
        )
      },
      {
        path: 'study/:studyId',
        element: (
          <ProtectedRoute>
            <StudyPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'library',
        element: (
          <ProtectedRoute>
            <LibraryPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'blog',
        element: <BlogListPage />
      },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />
      }
    ]
  }
]);