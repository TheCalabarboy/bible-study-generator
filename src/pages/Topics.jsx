import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { linkScriptureReferences } from '../utils/linkScriptureReferences';
import { normalizeStudyMarkdown } from '../utils/normalizeStudyMarkdown';
import { generateBibleStudy } from '../services/geminiService';
import { exportStudyToWord } from '../utils/exportToWord';
import LoadingOverlay from '../components/LoadingOverlay';

export default function Topics() {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [studies, setStudies] = useState([]);
  const hasStudies = studies.length > 0;
  const trimmedTopic = topic.trim();
  const focusLabel = trimmedTopic.length > 160
    ? `${trimmedTopic.slice(0, 157)}…`
    : trimmedTopic;
  const pageRef = useRef(null);

  const renderer = useMemo(() => {
    const customRenderer = new marked.Renderer();

    customRenderer.heading = (text, level) => {
      const base = 'font-weight: bold; margin: 16px 0 8px 0;';
      const styles = {
        1: 'font-size: 28px; color: #667eea; margin: 24px 0 12px 0;',
        2: 'font-size: 22px; color: #764ba2; margin: 20px 0 10px 0;',
        3: 'font-size: 18px; color: #333; margin: 16px 0 8px 0;',
      };
      const style = styles[level] || base;
      return `<h${level} style="${style}">${text}</h${level}>`;
    };

    customRenderer.list = (body, ordered) => {
      const style = 'margin-left: 24px; margin-bottom: 12px;';
      return ordered
        ? `<ol style="${style}">${body}</ol>`
        : `<ul style="${style}">${body}</ul>`;
    };

    customRenderer.listitem = (text) => `<li style="margin-bottom: 8px;">${text}</li>`;

    customRenderer.strong = (text) =>
      `<strong style="font-weight: bold; color: #333;">${text}</strong>`;

    customRenderer.link = (href, title, text) => {
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" style="color:#667eea; text-decoration:underline;">${text}</a>`;
    };

    customRenderer.paragraph = (text) =>
      `<p style="margin: 12px 0; line-height: 1.8; color: #333;">${text}</p>`;

    return customRenderer;
  }, []);

  useEffect(() => {
    marked.setOptions({
      gfm: true,
      breaks: false,
      headerIds: false,
      mangle: false,
      renderer,
    });
  }, [renderer]);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    const handleClick = (event) => {
      const anchor = event.target.closest('a[data-scripture-link="true"]');
      if (anchor && container.contains(anchor)) {
        event.preventDefault();
        window.open(anchor.href, 'scriptureReference', 'width=600,height=700,noopener');
      }
    };

    container.addEventListener('click', handleClick);
    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [hasStudies, studies]);

  const renderStudyHTML = useCallback((markdown) => {
    const normalized = normalizeStudyMarkdown(markdown ?? '');
    const withLinks = linkScriptureReferences(normalized);
    const raw = marked.parse(withLinks);
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
  }, [renderer]);

  const downloadPlan = useCallback(async () => {
    if (studies.length === 0) {
      return;
    }

    const topicLabelRaw = trimmedTopic || 'Bible Study Plan';
    const topicLabel = topicLabelRaw.length > 80
      ? `${topicLabelRaw.slice(0, 77)}...`
      : topicLabelRaw;
    const combinedContent = studies.map((study, index) => {
      const dayNumber = study.day || index + 1;
      const safeTitle = study.title || `Day ${dayNumber}`;
      const passageLine = study.passage ? `**Key Passage:** ${study.passage}\n\n` : '';
      const safeContent = normalizeStudyMarkdown(study.content || '');
      return `# Day ${dayNumber}: ${safeTitle}\n\n${passageLine}${safeContent}`;
    }).join('\n\n---\n\n');

    const slugify = (value) =>
      (value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'topical-study';

    const filenameBase = slugify(topicLabel);

    await exportStudyToWord(
      combinedContent,
      null,
      `Topical Study - ${topicLabel}`,
      `${filenameBase}-full-study.docx`
    );
  }, [studies, trimmedTopic]);

  const downloadStudy = useCallback(async (study, index, format) => {
    if (!study) {
      return;
    }

    const dayNumber = study.day || index + 1;
    const safeTitle = study.title || `Day ${dayNumber}`;
    const safeContent = normalizeStudyMarkdown(study.content || '');

    if (format === 'word') {
      await exportStudyToWord(safeContent, dayNumber, safeTitle);
    } else if (format === 'txt') {
      const blob = new Blob([safeContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `day-${dayNumber}-study.txt`;
      a.click();
    }
  }, []);

  const downloadButtonBase = {
    padding: '12px 20px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

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
    if (!trimmedTopic) {
      setError('Please enter a topic, question, or text to explore.');
      return;
    }
    setIsGenerating(true);
    try {
      const normalizedInput = trimmedTopic
        .replace(/\r\n/g, '\n')
        .replace(/\u00a0/g, ' ')
        .trim();

      const themeCandidates = Array.from(
        new Set(
          normalizedInput
            .split(/[\n,;:.!?]/)
            .map((segment) => segment.trim())
            .filter((segment) => segment.length >= 3)
        )
      );

      const topicalThemes = themeCandidates.slice(0, 5);
      if (topicalThemes.length === 0) {
        topicalThemes.push(normalizedInput.slice(0, 60) || 'General Study');
      }

      const titleSeed = topicalThemes[0] || 'User Submission';

      // We reuse your study generator without a transcript.
      const previewSnippet = normalizedInput.length > 600
        ? `${normalizedInput.slice(0, 600)}…`
        : normalizedInput;

      const studiesArr = await generateBibleStudy(
        `Topical Study: ${titleSeed}`,
        `User provided text for analysis. The content from the user is included below verbatim for reference:\n\n${previewSnippet}`,
        topicalThemes,          // themes
        [],                     // scriptures (model will fill)
        defaultOptions,         // options
        null,                   // videoId
        normalizedInput         // custom context so the model can ground in user text
      );
      const normalizedStudies = (studiesArr || []).map((study, index) => ({
        day: study.day || index + 1,
        title: study.title || `Day ${index + 1}`,
        passage: study.passage || '',
        content: study.content || ''
      }));
      setStudies(normalizedStudies);
    } catch (err) {
      console.error(err);
      const message = (err && err.message) || '';
      const normalizedMessage = message.toLowerCase();
      if (err?.status === 503 || normalizedMessage.includes('503') || normalizedMessage.includes('overloaded')) {
        setError('Our AI partner is momentarily overloaded. Please wait a few seconds and try again.');
      } else if (err?.status === 429 || normalizedMessage.includes('429') || normalizedMessage.includes('rate limit')) {
        setError('We are receiving a lot of requests right now. Please retry in a moment.');
      } else {
        setError('Could not generate a study for that topic. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <LoadingOverlay isVisible={isGenerating} />
      <div
        ref={pageRef}
        style={{ minHeight: 'calc(100vh - 200px)', padding: '40px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          background: 'white', borderRadius: 16, padding: 24,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}>
          <h1 style={{ fontSize: 32, marginBottom: 8, color: '#4b4b4b' }}>
            Topical Study
          </h1>
          <p style={{ color: '#666', marginBottom: 16 }}>
            Paste any topic, passage, question, or even a full block of text and we’ll craft a 5-day, theologically grounded study plan.
          </p>

          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: Write a study around 1 Corinthians 12 and the practice of speaking in tongues within the local church..."
              rows={6}
              style={{
                width: '100%',
                padding: 14,
                fontSize: 16,
                lineHeight: 1.6,
                border: '2px solid #e0e0e0',
                borderRadius: 12,
                outline: 'none',
                resize: 'vertical',
                minHeight: '140px'
              }}
            />
            <button
              type="submit"
              disabled={isGenerating}
              style={{
                alignSelf: 'flex-start',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: 16,
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                background: isGenerating ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.35)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
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

          {hasStudies && (
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 8, color: '#3f3f46' }}>
                Your {studies.length}-Day Topical Study
              </h2>
              {trimmedTopic && (
                <p style={{ color: '#6b7280', marginBottom: 20 }}>
                  Focus:{' '}
                  <span style={{ color: '#4c1d95', fontWeight: 700 }}>
                    {focusLabel}
                  </span>
                </p>
              )}
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={downloadPlan}
                  style={{
                    ...downloadButtonBase,
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    boxShadow: '0 6px 18px rgba(59, 130, 246, 0.35)',
                  }}
                >
                  📘 Download Full Study (Word)
                </button>
              </div>
              <div>
                {studies.map((study, index) => {
                  const dayNumber = study.day || index + 1;
                  const safeKey = `day-${dayNumber}-${index}`;
                  const studyContent = study.content && study.content.trim().length > 0
                    ? study.content
                    : 'Content will be available shortly.';
                  return (
                    <div
                      key={safeKey}
                      style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
                        border: '1px solid rgba(102, 126, 234, 0.25)',
                        borderRadius: 18,
                        padding: 24,
                        marginBottom: 20,
                        boxShadow: '0 18px 35px rgba(15, 23, 42, 0.08)'
                      }}
                    >
                      <div style={{ marginBottom: 18 }}>
                        <span style={{
                          display: 'inline-block',
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#4c1d95',
                          padding: '6px 14px',
                          borderRadius: '999px',
                          fontWeight: 600,
                          fontSize: 14,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          boxShadow: '0 6px 15px rgba(124, 58, 237, 0.2)'
                        }}>
                          Day {dayNumber}
                        </span>
                        <h3 style={{ margin: '12px 0 6px 0', color: '#312e81', fontSize: 22 }}>
                          {study.title}
                        </h3>
                        {study.passage && (
                          <p style={{ color: '#5b21b6', fontWeight: 600 }}>
                            📖 {study.passage}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          borderRadius: 12,
                          padding: '18px 22px',
                          border: '1px solid rgba(148, 163, 184, 0.25)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                          maxHeight: '360px',
                          overflowY: 'auto',
                          lineHeight: '1.8',
                          color: '#2f2f2f'
                        }}
                        dangerouslySetInnerHTML={{ __html: renderStudyHTML(studyContent) }}
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
                        <button
                          onClick={() => downloadStudy(study, index, 'txt')}
                          style={{
                            ...downloadButtonBase,
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          }}
                        >
                          📄 Day {dayNumber} Text
                        </button>
                        <button
                          onClick={() => downloadStudy(study, index, 'word')}
                          style={{
                            ...downloadButtonBase,
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                          }}
                        >
                          📘 Day {dayNumber} Word
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
