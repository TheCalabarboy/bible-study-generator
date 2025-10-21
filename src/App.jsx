import React, { useEffect, useRef, useState } from 'react';
// import { useAuth } from './contexts/AuthContext'; // (unused while auth bypass is active)
import { exportStudyToWord } from './utils/exportToWord';
import { analyzeVideoForBiblicalContent, generateBibleStudy } from './services/geminiService';
import { extractVideoId, getVideoInfo, validateYouTubeUrl } from './services/youtubeService';
import Logo from './assets/Logo.png';
import { logEvent } from './utils/analytics';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { linkScriptureReferences } from './utils/linkScriptureReferences';
import { normalizeStudyMarkdown } from './utils/normalizeStudyMarkdown';
import LoadingOverlay from './components/LoadingOverlay';

function App() {
  // === AUTH FEATURE TOGGLE ===
  // Flip to false in the future when you want to enable sign-in.
  const AUTH_DISABLED = true;

  // Temporarily bypass auth to test AI features
  const currentUser = { email: 'test@example.com' };
  const login = async () => {};
  const signup = async () => {};
  const logout = async () => {};
  // const { currentUser, login, signup, logout } = useAuth();

  // Navigation and content states
  const [step, setStep] = useState('input');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [activeDay, setActiveDay] = useState(1);

  // Study options
  const [options, setOptions] = useState({
    usageSelection: 'Personal Study',
    startDate: '',
    includeDeeperAnalysis: false,
    sessionLength: '30 min',
    includeActionSteps: true,
    includeMemoryVerses: true
  });

  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // AI generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [dailyStudies, setDailyStudies] = useState([]);

  // Get current study
  const currentStudy = dailyStudies.length > 0 ? dailyStudies.find(s => s.day === activeDay) : null;

  // === Configure marked to produce clean, predictable HTML ===
  // Build from the stock renderer so nested markdown remains intact.
  const renderer = new marked.Renderer();

  renderer.heading = function heading(text, level) {
    const styles = {
      1: 'font-size: 28px; color: #667eea; margin: 24px 0 12px 0; font-weight: bold;',
      2: 'font-size: 22px; color: #764ba2; margin: 20px 0 10px 0; font-weight: bold;',
      3: 'font-size: 18px; color: #333; margin: 16px 0 8px 0; font-weight: bold;',
    };
    const style = styles[level] || 'font-weight: bold; margin: 16px 0 8px 0;';
    return `<h${level} style="${style}">${text}</h${level}>\n`;
  };

  renderer.list = function list(body, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    const style = 'margin-left: 20px; margin-bottom: 12px;';
    return `<${tag} style="${style}">\n${body}</${tag}>\n`;
  };

  renderer.listitem = function listitem(text) {
    return `<li style="margin-bottom: 8px;">${text}</li>\n`;
  };

  renderer.strong = function strong(text) {
    return `<strong style="font-weight:bold; color:#333;">${text}</strong>`;
  };

  renderer.link = function link(href, title, text) {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" style="color:#667eea; text-decoration:underline;">${text}</a>`;
  };

  renderer.paragraph = function paragraph(text) {
    return `<p style="margin:12px 0; line-height:1.8; color:#333;">${text}</p>\n`;
  };

  // Auth handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      setStep('input');
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Please log in instead.');
      } else if (error.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setAuthError('Invalid email or password.');
      } else if (error.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password.');
      } else {
        setAuthError('An error occurred. Please try again.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    // Auth is disabled; just reset UI to the input screen.
    setStep('input');
    setYoutubeLink('');
    setActiveDay(1);
  };

  const generateStudy = async () => {
    setIsGenerating(true);
    setValidationError('');

    try {
      // Track that someone started generating a study
      logEvent('Study', 'Generate_Started', youtubeLink);

      console.log('Step 1: Validating URL...');
      if (!validateYouTubeUrl(youtubeLink)) {
        setValidationError('Please provide a valid YouTube URL.');
        setIsGenerating(false);
        return;
      }

      console.log('Step 2: Getting video info...');
      const videoId = extractVideoId(youtubeLink);
      let videoInfo;

      try {
        videoInfo = await getVideoInfo(videoId);
      } catch (error) {
        console.log('Could not fetch video metadata, using defaults');
        videoInfo = {
          title: `YouTube Sermon (${videoId})`,
          author: 'Christian Teacher',
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          duration: 0
        };
      }

      console.log('Video info:', videoInfo);

      console.log('Step 3: Analyzing content...');
      const analysis = await analyzeVideoForBiblicalContent(
        videoInfo.title,
        `Author: ${videoInfo.author}`,
        videoId // pass videoId so the service can fetch transcript
      );
      console.log('Analysis result:', analysis);

      // Validate analysis response
      if (!analysis || typeof analysis !== 'object') {
        throw new Error('Invalid analysis response from AI');
      }

      // Provide defaults if AI didn't return expected data
      const mainThemes = analysis.mainThemes && Array.isArray(analysis.mainThemes)
        ? analysis.mainThemes
        : ['Faith', 'Scripture Study', 'Christian Living'];

      const scriptureReferences = analysis.scriptureReferences && Array.isArray(analysis.scriptureReferences)
        ? analysis.scriptureReferences
        : ['Matthew 28:19-20', 'Romans 12:1-2'];

      const isChristianContent = analysis.isChristianTeaching !== undefined
        ? analysis.isChristianTeaching
        : true;

      const confidence = analysis.confidence || 0.8;

      console.log('Processed themes:', mainThemes);
      console.log('Processed scriptures:', scriptureReferences);

      if (!isChristianContent || confidence < 0.6) {
        setValidationError(
          'The link you provided does not appear to be a biblical teaching. Please ensure the video is a scriptural teaching or sermon from a credible Christian source and try again.'
        );
        setIsGenerating(false);
        return;
      }

      console.log('Step 4: Generating study...');
      const generatedStudies = await generateBibleStudy(
        videoInfo.title,
        `Themes: ${mainThemes.join(', ')}`,
        mainThemes,
        scriptureReferences,
        options,
        videoId // pass videoId so the service can ground the study in transcript excerpts
      );
      console.log('Generated studies:', generatedStudies);

      if (!generatedStudies || generatedStudies.length === 0) {
        throw new Error('No studies were generated');
      }

      const studiesWithDates = generatedStudies.map((study, index) => ({
        day: study.day || (index + 1),
        title: study.title || `Day ${index + 1}`,
        passage: study.passage || 'Scripture Reference',
        content: study.content || 'Study content',
        date: options.startDate
          ? new Date(new Date(options.startDate).getTime() + (index * 86400000))
              .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : ''
      }));

      console.log('Studies with dates:', studiesWithDates);
      setDailyStudies(studiesWithDates);
      // Track successful study generation
      logEvent('Study', 'Generate_Success', videoInfo.title);
      setActiveDay(studiesWithDates[0].day); // ensure activeDay matches first available study
      setStep('result');

    } catch (error) {
      console.error('Generation error:', error);
      const message = error?.message || '';
      const status = typeof error?.status === 'number'
        ? error.status
        : (error?.response?.status ||
          (() => {
            const match = message.match(/\[(\d{3})\s*\]/);
            return match ? Number(match[1]) : undefined;
          })());

      if (status === 503 || message.toLowerCase().includes('overloaded')) {
        setValidationError('Our servers are pretty hot right now. Please wait a bit and try again.');
      } else if (status === 429 || message.toLowerCase().includes('rate limit')) {
        setValidationError('We are handling a lot of requests at the moment. Give it a moment and try again.');
      } else {
        setValidationError(
          message || 'An error occurred while generating the study. Please try again.'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDayStudy = async (format) => {
    const study = dailyStudies.find((s) => s.day === activeDay);
    if (!study) return;

    if (format === 'txt') {
      const blob = new Blob([study.content || ''], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `day-${study.day}-study.txt`;
      a.click();
    } else if (format === 'word') {
      // Pass raw content - exportStudyToWord will handle normalization
      await exportStudyToWord(study.content, activeDay, study.title, null, study.passage);
    } else {
      return;
    }

    logEvent('Download', `Day_${activeDay}_${format.toUpperCase()}`, study.title);
  };

  const downloadFullStudy = async () => {
    if (!dailyStudies.length) return;

    const combinedContent = dailyStudies
      .map((study, index) => {
        const dayNumber = study.day || index + 1;
        const title = study.title || `Day ${dayNumber}`;
        const passageLine = study.passage ? `**Key Passage:** ${study.passage}\n\n` : '';
        const content = study.content || '';  // Pass raw content without normalization
        return `# Day ${dayNumber}: ${title}\n\n${passageLine}${content}`;
      })
      .join('\n\n---\n\n');

    const baseTitle = dailyStudies[0]?.title || 'Full Study Guide';
    const slugify = (value) =>
      (value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'study-guide';
    const filenameBase = slugify(baseTitle);

    await exportStudyToWord(
      combinedContent,
      null,
      `Full Study Guide`,
      `${filenameBase}-full-study.docx`,
      null  // No passage for full study
    );

    logEvent('Download', 'Full_WORD', baseTitle);
  };

  // Reusable styles
  const styles = {
    gradientBg: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      padding: '48px',
      maxWidth: '500px',
      width: '100%',
      margin: '0 auto',
    },
    button: {
      padding: '16px 32px',
      fontSize: '18px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    primaryButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
  };

  // Register the renderer and other options via marked.use()
  marked.use({
    renderer,
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false
  });

  // Markdown → sanitized HTML
  const renderStudyHTML = (markdown) => {
    const normalized = normalizeStudyMarkdown(markdown ?? '');
    const raw = marked.parse(normalized);
    const withLinks = linkScriptureReferences(raw);
    const clean = DOMPurify.sanitize(withLinks, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div'],
      ALLOWED_ATTR: ['style', 'href', 'title', 'target', 'rel', 'data-scripture-link'],
      ALLOW_DATA_ATTR: true
    });
    return clean;
  };

  const overlay = <LoadingOverlay isVisible={isGenerating} message="Please wait as the study is generated. If it returns an error, kindly try again as the generator can be overloaded sometimes" />;
  const studyContentRef = useRef(null);

  useEffect(() => {
    const container = studyContentRef.current;
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
  }, [currentStudy]);

  // LOGIN SCREEN
  if (!AUTH_DISABLED && step === 'login' && !currentUser) {
    return (
      <>
        {overlay}
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>📖</div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', marginBottom: '12px' }}>
                Bible Study Generator
              </h1>
              <p style={{ fontSize: '18px', color: '#666' }}>
                {isSignup ? 'Create your account to begin' : 'Welcome back! Please log in to continue.'}
              </p>
            </div>

            <form onSubmit={handleAuth}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#333', fontWeight: 'bold', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#333', fontWeight: 'bold', marginBottom: '8px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                  At least 6 characters
                </p>
              </div>

              {authError && (
                <div style={{
                  background: '#fee',
                  color: '#c00',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  ...styles.button,
                  ...styles.primaryButton,
                  width: '100%',
                  marginTop: '16px',
                  opacity: authLoading ? 0.7 : 1,
                  cursor: authLoading ? 'wait' : 'pointer',
                }}
              >
                {authLoading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Log In')}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setAuthError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '16px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up'}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // INPUT SCREEN
  if (step === 'input') {
    return (
      <>
        {overlay}
        <div style={styles.gradientBg}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white', paddingTop: '40px' }}>
            <div style={{ marginBottom: '16px' }}>
              <img
                src={Logo}
                alt="SermonDive Logo"
                style={{
                  width: '200px',
                  height: 'auto',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '12px',
              fontFamily: "'Proxima Nova', sans-serif"
            }}>
              SermonDive
            </h1>
            <p style={{
              fontSize: '20px',
              opacity: '0.9',
              fontFamily: "'Poppins', sans-serif"
            }}>
              Transform YouTube Sermons into a 5-Day Bible Study Plan
            </p>
          </div>

          {/* Main Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            padding: '40px',
            marginBottom: '24px',
          }}>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: 'bold',
              fontSize: '24px',
              marginBottom: '16px'
            }}>
              🎥 YouTube Link
            </label>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Enter a YouTube link of a Christian Sermon:
            </p>

            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                marginTop: '12px',
                outline: 'none',
              }}
            />

            {/* Options */}
            <div style={{ marginTop: '32px' }}>
              <label style={{
                display: 'block',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '12px'
              }}>
                How would you like this study to be used?
              </label>
              <select
                value={options.usageSelection}
                onChange={(e) => setOptions({ ...options, usageSelection: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              >
                <option>Personal Study</option>
                <option>Small Group</option>
                <option>Family Devotions</option>
                <option>Sharing with Friends</option>
              </select>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'block',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '12px'
              }}>
                📅 Start Date (Optional)
              </label>
              <input
                type="date"
                value={options.startDate}
                onChange={(e) => setOptions({ ...options, startDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'block',
                color: '#333',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '12px'
              }}>
                ⏱️ Session Length
              </label>
              <select
                value={options.sessionLength}
                onChange={(e) => setOptions({ ...options, sessionLength: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  outline: 'none',
                }}
              >
                <option>15 min</option>
                <option>30 min</option>
                <option>45 min</option>
                <option>1 hour</option>
              </select>
            </div>

            <div style={{ marginTop: '24px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={options.includeDeeperAnalysis}
                  onChange={(e) => setOptions({ ...options, includeDeeperAnalysis: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                />
                <span>
                  <strong>Include Deeper Analysis</strong>
                  <span style={{ fontSize: '14px', color: '#666', display: 'block' }}>
                    Add Greek/Hebrew word studies and historical context
                  </span>
                </span>
              </label>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={options.includeMemoryVerses}
                  onChange={(e) => setOptions({ ...options, includeMemoryVerses: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                />
                <span>
                  <strong>Include Memory Verses</strong>
                  <span style={{ fontSize: '14px', color: '#666', display: 'block' }}>
                    Add key verses to memorize each day
                  </span>
                </span>
              </label>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                color: '#333',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={options.includeActionSteps}
                  onChange={(e) => setOptions({ ...options, includeActionSteps: e.target.checked })}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginRight: '10px',
                    cursor: 'pointer'
                  }}
                />
                <span>
                  <strong>Include Action Steps</strong>
                  <span style={{ fontSize: '14px', color: '#666', display: 'block' }}>
                    Add practical application for each day
                  </span>
                </span>
              </label>
            </div>

            <button
              onClick={generateStudy}
              disabled={!youtubeLink || isGenerating}
              style={{
                width: '100%',
                padding: '20px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: (!youtubeLink || isGenerating) ? 'not-allowed' : 'pointer',
                marginTop: '32px',
                background: (!youtubeLink || isGenerating) ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: (!youtubeLink || isGenerating) ? '#666' : 'white',
                boxShadow: (!youtubeLink || isGenerating) ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
              }}
            >
              {isGenerating ? '🤖 Analyzing video & generating study...' : '✨ Generate Study Guide'}
            </button>

            {validationError && (
              <div style={{
                background: '#fee',
                color: '#c00',
                padding: '16px',
                borderRadius: '12px',
                marginTop: '16px',
                fontSize: '14px',
                border: '2px solid #fcc',
              }}>
                ❌ {validationError}
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    );
  }

  // RESULT SCREEN (fallback debug if no currentStudy)
  if (!currentStudy) {
    return (
      <>
        {overlay}
        <div style={{ padding: '40px', textAlign: 'center', color: 'white' }}>
          <h2>Debug Info:</h2>
          <p>Step: {step}</p>
          <p>Daily Studies Length: {dailyStudies.length}</p>
          <p>Active Day: {activeDay}</p>
          <p>Current Study: {currentStudy ? 'Found' : 'NULL'}</p>
          <pre style={{ textAlign: 'left', background: 'white', color: 'black', padding: '20px', borderRadius: '8px' }}>
            {JSON.stringify(dailyStudies, null, 2)}
          </pre>
          <button
            onClick={() => {
              console.log('Step:', step);
              console.log('Daily Studies:', dailyStudies);
              console.log('Active Day:', activeDay);
            }}
            style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
          >
            Log Debug Info to Console
          </button>
        </div>
      </>
    );
  }

  // RESULT SCREEN (normal)
  return (
    <div style={styles.gradientBg}>
      {overlay}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Success Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          }}>
            <span style={{ fontSize: '48px', marginRight: '16px' }}>✅</span>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                5-Day Study Plan Generated!
              </h2>
              <p style={{ fontSize: '16px', opacity: '0.9' }}>
                Click through the tabs to explore each day's generated study
              </p>
            </div>
          </div>

        {/* Video & Summary Section */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '40px',
          marginBottom: '24px',
        }}>
          {/* Video Embed */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            marginBottom: '32px'
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${extractVideoId(youtubeLink)}`}
              title="YouTube video player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Sermon Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
            padding: '32px',
            borderRadius: '16px',
            border: '2px solid #e0d4f7'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#667eea',
              marginBottom: '16px',
              fontFamily: "'Proxima Nova', sans-serif"
            }}>
              📝 Sermon Summary
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333',
              fontFamily: "'Poppins', sans-serif"
            }}>
              This sermon explores the themes of {dailyStudies[0]?.passage || 'biblical teaching'} and
              focuses on spiritual growth through {dailyStudies[0]?.title?.toLowerCase() || 'faith and perseverance'}.
              The teaching emphasizes practical application and deep scriptural understanding.
            </p>
          </div>
        </div>

        {/* Day Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '0',
          display: 'flex',
          overflowX: 'auto',
          boxShadow: '0 -5px 20px rgba(0,0,0,0.1)',
        }}>
          {dailyStudies.map((study) => (
            <button
              key={study.day}
              onClick={() => setActiveDay(study.day)}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '20px 24px',
                fontSize: '18px',
                fontWeight: 'bold',
                border: 'none',
                borderBottom: activeDay === study.day ? '4px solid #667eea' : '4px solid transparent',
                background: activeDay === study.day ? '#f8f7ff' : 'white',
                color: activeDay === study.day ? '#667eea' : '#666',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: activeDay === study.day ? '12px 12px 0 0' : '0',
              }}
            >
              Day {study.day}
            </button>
          ))}
        </div>

        {/* Study Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 24px 24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '40px',
          marginBottom: '24px',
        }}>
          {/* Day Header */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f7ff 0%, #e8e5ff 100%)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
          }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px', wordBreak: 'break-word' }}>
              {currentStudy.title}
            </h2>
            {currentStudy.date && (
              <p style={{ fontSize: '16px', color: '#764ba2', marginBottom: '4px' }}>
                📅 {currentStudy.date}
              </p>
            )}
            <p style={{ fontSize: '16px', color: '#764ba2' }}>
              📖 {currentStudy.passage}
            </p>
          </div>

          {/* Study Content */}
          <div style={{
            background: 'linear-gradient(135deg, #f3e7ff 0%, #e0f2fe 100%)',
            padding: '32px',
            borderRadius: '16px',
            border: '2px solid #e0d4f7',
            maxHeight: '500px',
            overflowY: 'auto',
            marginBottom: '32px',
          }}
          ref={studyContentRef}>
            <div
              style={{
                color: '#333',
                fontFamily: 'inherit',
                lineHeight: '1.8',
                fontSize: '16px',
              }}
              dangerouslySetInnerHTML={{
                __html: renderStudyHTML(currentStudy.content)
              }}
            />
          </div>

          {/* Download Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}>
            <button
              onClick={() => downloadDayStudy('txt')}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.3s ease',
              }}
            >
              📄 Download Text
            </button>

            <button
              onClick={() => downloadDayStudy('word')}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                transition: 'transform 0.3s ease',
              }}
            >
              📘 Download Word
            </button>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <button
              onClick={downloadFullStudy}
              style={{
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.35)',
                transition: 'transform 0.3s ease',
              }}
            >
              📘 Download Full Study (Word)
            </button>
          </div>

          {/* Share Buttons */}
          <div style={{
            marginTop: '24px',
            padding: '24px',
            background: '#f9f9f9',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '16px',
              fontFamily: "'Proxima Nova', sans-serif"
            }}>
              📤 Share This Website
            </h4>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`mailto:?subject=5-Day Bible Study&body=${encodeURIComponent('Check out this Bible study: ' + window.location.href)}`}
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                📧 Email
              </a>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this 5-Day Bible Study!')}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  background: '#1DA1F2',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                🐦 Twitter
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  background: '#4267B2',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                📘 Facebook
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent('Check out this 5-Day Bible Study: ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '12px 24px',
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => {
                setActiveDay(Math.max(1, activeDay - 1));
                logEvent('Navigation', 'Previous_Day', `Day ${activeDay - 1}`);
              }}
              disabled={activeDay === 1}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: activeDay === 1 ? 'not-allowed' : 'pointer',
                background: activeDay === 1 ? '#e0e0e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: activeDay === 1 ? '#999' : 'white',
                boxShadow: activeDay === 1 ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.3s ease',
              }}
            >
              ← Previous Day
            </button>

            <button
              onClick={() => {
                logEvent('Navigation', 'New_Study', 'From Results Page');
                setStep('input');
                setYoutubeLink('');
                setActiveDay(1);
                setDailyStudies([]);
              }}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                boxShadow: '0 4px 15px rgba(107, 114, 128, 0.4)',
                transition: 'transform 0.3s ease',
              }}
            >
              🔄 New Study
            </button>

            <button
              onClick={() => {
                setActiveDay(Math.min(dailyStudies.length, activeDay + 1));
                logEvent('Navigation', 'Next_Day', `Day ${activeDay + 1}`);
              }}
              disabled={activeDay === dailyStudies.length}
              style={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '12px',
                cursor: activeDay === dailyStudies.length ? 'not-allowed' : 'pointer',
                background: activeDay === dailyStudies.length ? '#e0e0e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: activeDay === dailyStudies.length ? '#999' : 'white',
                boxShadow: activeDay === dailyStudies.length ? 'none' : '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.3s ease',
              }}
            >
              Next Day →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
