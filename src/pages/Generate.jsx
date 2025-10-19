import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import App from '../App'; // uses your existing generator flow

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ padding: '16px', border: '1px solid #f99', borderRadius: '8px' }}>
      <p>Something went wrong:</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
      <button type="button" onClick={resetErrorBoundary} style={{ marginTop: '8px' }}>
        Try again
      </button>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  );
}
