import React from 'react';

/**
 * Auth is disabled. This wrapper simply renders children.
 * When you want auth later, restore the redirect logic here.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
