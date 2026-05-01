import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ApiKeyProvider } from './contexts/ApiKeyContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ApiKeyProvider>
          <RouterProvider router={router} />
        </ApiKeyProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)