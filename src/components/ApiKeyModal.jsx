import React, { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import { Input, Button, Label, ErrorMessage, Checkbox } from './UIComponents';

export default function ApiKeyModal({ onConfirm }) {
  const { saveKey } = useApiKey();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [persist, setPersist] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Please enter your API key.');
      return;
    }
    if (!trimmed.startsWith('AIza')) {
      setError('This doesn\'t look like a valid Gemini key (should start with "AIza"). Double-check and try again.');
      return;
    }
    setError('');
    saveKey(trimmed, 'gemini', persist);
    onConfirm();
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
      }}>
        {/* Lock icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '40px' }}>🔑</span>
        </div>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#1a1a2e',
          textAlign: 'center',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}>
          Your AI Key — Private &amp; Secure
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#666',
          textAlign: 'center',
          lineHeight: '1.6',
          marginBottom: '32px',
        }}>
          SermonDive uses your own Gemini API key to generate studies.
          Your key is stored only in your browser and is never sent to our servers beyond the single generation request.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <Label style={{ marginBottom: '8px', display: 'block' }}>Gemini API Key</Label>
            <div style={{ position: 'relative' }}>
              <Input
                type={showKey ? 'text' : 'password'}
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                placeholder="AIza..."
                style={{ paddingRight: '52px', fontFamily: 'monospace' }}
              />
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#888',
                  padding: '4px',
                }}
                aria-label={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <ErrorMessage style={{ marginBottom: '16px' }}>{error}</ErrorMessage>}

          <div style={{ marginBottom: '28px' }}>
            <Checkbox
              checked={persist}
              onChange={e => setPersist(e.target.checked)}
              label="Remember on this device"
              description="Saves your key in localStorage so you don't need to re-enter it next time."
            />
          </div>

          <Button type="submit" variant="gradient" style={{ width: '100%', fontSize: '17px', padding: '16px' }}>
            Start Generating ✨
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#999' }}>
          Don't have a key?{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#667eea', textDecoration: 'underline' }}
          >
            Get a free Gemini API key →
          </a>
        </p>
      </div>
    </div>
  );
}
