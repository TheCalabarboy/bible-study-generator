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
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px' }}>
      <h1 style={{ fontSize: 36, color: '#4b5563', marginBottom: 16 }}>Share Your Feedback</h1>
      <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 32, lineHeight: 1.7 }}>
        We’d love to hear how SermonDive is serving you or ideas for improvement. Please fill out the quick form below
        and we’ll receive it at <strong style={{ color: '#667eea' }}>{MAILTO}</strong>.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          display: 'grid',
          gap: 24,
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>
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
              borderRadius: 12,
              border: '1px solid #d1d5db',
              fontSize: 16,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>
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
              borderRadius: 12,
              border: '1px solid #d1d5db',
              fontSize: 16,
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#4b5563', marginBottom: 8 }}>
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
              borderRadius: 12,
              border: '1px solid #d1d5db',
              fontSize: 16,
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            justifySelf: 'start',
            padding: '14px 28px',
            borderRadius: 999,
            border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 15px 30px rgba(102, 126, 234, 0.25)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(event) => { event.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(event) => { event.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Send feedback
        </button>

        {status && (
          <p style={{ fontSize: 14, color: '#4b5563' }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
