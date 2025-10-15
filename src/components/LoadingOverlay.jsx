import React from 'react';

export default function LoadingOverlay({ isVisible, message = 'Preparing your study' }) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-card">
        <div className="bible-animation">
          <div className="bible-book">
            <div className="book-cover" />
            <div className="book-spine" />
            <div className="book-pages">
              <span />
              <span />
              <span />
            </div>
            <div className="book-cross" />
          </div>
        </div>
        <p className="loading-message">{message}</p>
        <div className="loading-scroll">
          <span className="scrolling-text">
            Preparing your study • Preparing your study • Preparing your study • Preparing your study •{' '}
          </span>
        </div>
      </div>
    </div>
  );
}
