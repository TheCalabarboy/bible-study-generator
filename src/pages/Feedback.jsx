import React, { useState } from 'react';

const MAILTO = 'contact@sermondive.com';

const encodeMailtoBody = ({ name, email, message }) => {
  const lines = [
    `Name: ${name || 'Anonymous'}`,
    `Email: ${email || 'Not provided'}`,
    '',
    'Feedback:',
    message,
  ];
  return encodeURIComponent(lines.join('\n'));
};

export default function Feedback() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.message.trim()) {
      setStatus('Please include a short message so we know how to help.');
      return;
    }

    const mailtoUrl = `mailto:${MAILTO}?subject=${encodeURIComponent('SermonDive Feedback')}&body=${encodeMailtoBody(form)}`;
    setStatus('Opening your email app…');

    // Kick off the email in the user’s default email client.
    window.location.href = mailtoUrl;
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      padding: 'var(--space-100) var(--space-12)',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'var(--gradient-warm-cool)',
        opacity: 0.12,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(36px, 4vw, 48px)', color: 'var(--color-gray-900)', marginBottom: 'var(--space-3)', fontWeight: 400 }}>
          Share Your Feedback
        </h1>
        <p style={{ fontSize: 17, color: 'var(--color-gray-600)', marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
          We’d love to hear how SermonDive is serving you or ideas for improvement. Please fill out the quick form below
          and we’ll receive it at <strong style={{ color: 'var(--color-primary)' }}>{MAILTO}</strong>.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'rgba(255,255,255,0.94)',
            borderRadius: 20,
            padding: 'var(--space-8)',
            boxShadow: 'var(--shadow-lg)',
            display: 'grid',
            gap: 'var(--space-6)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 8 }}>
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={updateField('name')}
              placeholder="Optional"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: '1px solid var(--color-gray-200)',
                fontSize: 16,
                background: 'white',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="Optional, if you’d like a reply"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: '1px solid var(--color-gray-200)',
                fontSize: 16,
                background: 'white',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 8 }}>
              Your Message *
            </label>
            <textarea
              value={form.message}
              onChange={updateField('message')}
              rows="6"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 14,
                border: '1px solid var(--color-gray-200)',
                fontSize: 16,
                resize: 'vertical',
                background: 'white',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              justifySelf: 'start',
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: 'var(--gradient-primary)',
              color: 'white',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'opacity var(--transition-fast)',
            }}
            onMouseEnter={(event) => { event.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={(event) => { event.currentTarget.style.opacity = '1'; }}
          >
            Send feedback
          </button>

          {status && (
            <p style={{ fontSize: 14, color: 'var(--color-gray-700)' }}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
