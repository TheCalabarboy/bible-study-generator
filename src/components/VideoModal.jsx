
import React, { useState, useEffect } from 'react';
import './VideoModal.css';

const DEFAULT_STORAGE_KEY = 'introVideoDismissed';

const VideoModal = ({
  videoId,
  storageKey = DEFAULT_STORAGE_KEY,
  headline = 'Welcome to SermonDive',
  description = 'Watch this quick intro to see how SermonDive turns sermons into daily study plans.',
  autoplay = true,
  muteOnStart = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rememberPreference, setRememberPreference] = useState(false);

  useEffect(() => {
    if (!videoId) return;
    try {
      const hasDismissed = localStorage.getItem(storageKey);
      if (hasDismissed !== 'true') {
        setIsOpen(true);
      }
    } catch (error) {
      console.warn('Unable to read intro video preference', error);
      setIsOpen(true);
    }
  }, [videoId, storageKey]);

  if (!videoId || !isOpen) return null;

  const persistDismissal = () => {
    try {
      localStorage.setItem(storageKey, 'true');
    } catch (error) {
      console.warn('Unable to persist intro video preference', error);
    }
  };

  const handleClose = (persist) => {
    setIsOpen(false);
    if (persist || rememberPreference) {
      persistDismissal();
    }
  };

  const embedUrl = (() => {
    const params = new URLSearchParams({ rel: '0' });
    if (autoplay) params.set('autoplay', '1');
    if (autoplay && muteOnStart) params.set('mute', '1');
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  })();

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="intro-video-title">
      <div className="modal-content">
        <button
          type="button"
          className="modal-close"
          aria-label="Close intro video"
          onClick={() => handleClose(false)}
        >
          ×
        </button>

        {headline && <h2 id="intro-video-title">{headline}</h2>}
        {description && <p className="modal-description">{description}</p>}

        <div className="video-container">
          <iframe
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            playsInline
          />
        </div>

        <div className="modal-footer">
          <label className="modal-checkbox">
            <input
              type="checkbox"
              checked={rememberPreference}
              onChange={(event) => setRememberPreference(event.target.checked)}
            />
            Don't show this again
          </label>

          <div className="modal-actions">
            <button type="button" className="modal-primary" onClick={() => handleClose(false)}>
              Start exploring
            </button>
            <button type="button" className="modal-secondary" onClick={() => handleClose(true)}>
              Never show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
