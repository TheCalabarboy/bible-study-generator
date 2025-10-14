import React, { useState } from 'react';
import { generateBibleStudy } from '../services/geminiService';

export default function Topics() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [studies, setStudies] = useState([]);

  const defaultOptions = {
    usageSelection: 'Personal Study',
    startDate: '',
    includeDeeperAnalysis: true,
    sessionLength: '30 min',
    includeActionSteps: true,
    includeMemoryVerses: true
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    if (!topic.trim()) {
      setError('Please enter a topic (e.g., “Forgiveness”, “Faith and Works”).');
      return;
    }
    setIsGenerating(true);
    try {
      // We reuse your study generator without a transcript.
      const studiesArr = await generateBibleStudy(
        `Topical Study: ${topic}`,
        `User topic: ${topic}`,
        [topic],          // themes
        [],               // scriptures (model will fill)
        defaultOptions    // options
      );
      setStudies(studiesArr || []);
    } catch (err) {
      console.error(err);
      setError('Could not generate a study for that topic. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', padding: '40px 20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        background: 'white', borderRadius: 16, padding: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ fontSize: 32, marginBottom: 8, color: '#4b4b4b' }}>
          Topic Studies
        </h1>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Enter any biblical topic or doctrine and we’ll generate a 5-day, theologically grounded study plan.
        </p>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Forgiveness, Holiness, The Fruit of the Spirit…"
            style={{
              flex: 1, padding: 12, fontSize: 16,
              border: '2px solid #e0e0e0', borderRadius: 8, outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={isGenerating}
            style={{
              padding: '12px 20px', fontWeight: 700, fontSize: 16,
              border: 'none', borderRadius: 10, cursor: 'pointer',
              background: isGenerating ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            {isGenerating ? 'Generating…' : 'Generate'}
          </button>
        </form>

        {error && (
          <div style={{ background: '#fee', color: '#b00020', padding: 12, borderRadius: 8, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {studies.length > 0 && (
          <div>
            <h2 style={{ fontSize: 24, marginBottom: 12, color: '#4b4b4b' }}>
              Your 5-Day Plan
            </h2>
            {studies.map((s) => (
              <div key={s.day} style={{
                border: '1px solid #eee', borderRadius: 12, padding: 16, marginBottom: 12
              }}>
                <h3 style={{ margin: '0 0 6px 0', color: '#667eea' }}>
                  {s.title} — <span style={{ color: '#764ba2' }}>{s.passage}</span>
                </h3>
                <div style={{ whiteSpace: 'pre-wrap', color: '#444' }}>{s.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
