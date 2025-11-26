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
import { Input, Select, Checkbox, Button, Card, Label, ErrorMessage, SuccessBanner } from './components/UIComponents';

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
        <div style={{
          minHeight: '100vh',
          background: 'var(--gradient-hero)',
          padding: 'var(--space-100) var(--space-12)',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--space-71)',
            }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <img
                  src={Logo}
                  alt="SermonDive Logo"
                  style={{
                    width: '180px',
                    height: 'auto',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </div>
              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '400',
                marginBottom: 'var(--space-4)',
                color: 'var(--color-gray-900)',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
              }}>
                SermonDive
              </h1>
              <p style={{
                fontSize: '20px',
                color: 'var(--color-gray-700)',
                fontWeight: '400',
                lineHeight: '1.6',
              }}>
                Transform YouTube Sermons into a 5-Day Bible Study Plan
              </p>
            </div>

            {/* Main Card */}
            <Card style={{ marginBottom: 'var(--space-6)' }}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <Label style={{ fontSize: '20px', marginBottom: 'var(--space-2)' }}>
                  🎥 YouTube Link
                </Label>
                <p style={{
                  color: 'var(--color-gray-600)',
                  marginBottom: 'var(--space-4)',
                  fontSize: '15px',
                }}>
                  Enter a YouTube link of a Christian Sermon:
                </p>

                <Input
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Options */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <Label>How would you like this study to be used?</Label>
                <Select
                  value={options.usageSelection}
                  onChange={(e) => setOptions({ ...options, usageSelection: e.target.value })}
                >
                  <option>Personal Study</option>
                  <option>Small Group</option>
                  <option>Family Devotions</option>
                  <option>Sharing with Friends</option>
                </Select>
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <Label>📅 Start Date (Optional)</Label>
                <Input
                  type="date"
                  value={options.startDate}
                  onChange={(e) => setOptions({ ...options, startDate: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: 'var(--space-6)' }}>
                <Label>⏱️ Session Length</Label>
                <Select
                  value={options.sessionLength}
                  onChange={(e) => setOptions({ ...options, sessionLength: e.target.value })}
                >
                  <option>15 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>1 hour</option>
                </Select>
              </div>

              <div style={{
                background: 'var(--color-gray-50)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
              }}>
                <Checkbox
                  checked={options.includeDeeperAnalysis}
                  onChange={(e) => setOptions({ ...options, includeDeeperAnalysis: e.target.checked })}
                  label="Include Deeper Analysis"
                  description="Add Greek/Hebrew word studies and historical context"
                  style={{ padding: 'var(--space-2)', margin: 0 }}
                />

                <Checkbox
                  checked={options.includeMemoryVerses}
                  onChange={(e) => setOptions({ ...options, includeMemoryVerses: e.target.checked })}
                  label="Include Memory Verses"
                  description="Add key verses to memorize each day"
                  style={{ padding: 'var(--space-2)', margin: 0 }}
                />

                <Checkbox
                  checked={options.includeActionSteps}
                  onChange={(e) => setOptions({ ...options, includeActionSteps: e.target.checked })}
                  label="Include Action Steps"
                  description="Add practical application for each day"
                  style={{ padding: 'var(--space-2)', margin: 0 }}
                />
              </div>

              <Button
                onClick={generateStudy}
                disabled={!youtubeLink || isGenerating}
                variant="gradient"
                style={{ marginTop: 'var(--space-4)' }}
              >
                {isGenerating ? '🤖 Analyzing video & generating study...' : '✨ Generate Study Guide'}
              </Button>

              {validationError && (
                <ErrorMessage style={{ marginTop: 'var(--space-4)' }}>
                  {validationError}
                </ErrorMessage>
              )}
            </Card>
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
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      padding: 'var(--space-71) var(--space-12)',
    }}>
      {overlay}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Success Banner */}
          <SuccessBanner style={{ marginBottom: 'var(--space-6)' }}>
            <div>
              <h2 style={{
                fontSize: 'clamp(24px, 3vw, 32px)',
                fontWeight: '700',
                marginBottom: 'var(--space-1)',
                letterSpacing: '-0.01em',
              }}>
                5-Day Study Plan Generated!
              </h2>
              <p style={{ fontSize: '16px', opacity: '0.95', fontWeight: '500' }}>
                Click through the tabs to explore each day's generated study
              </p>
            </div>
          </SuccessBanner>

        {/* Video & Summary Section */}
        <Card style={{ marginBottom: 'var(--space-6)' }}>
          {/* Video Embed */}
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-8)',
            boxShadow: 'var(--shadow-md)',
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
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(88, 86, 214, 0.05) 100%)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(0, 122, 255, 0.1)',
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-4)',
              letterSpacing: '-0.01em',
            }}>
              📝 Sermon Summary
            </h3>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: 'var(--color-gray-700)',
              fontWeight: '400',
            }}>
              This sermon explores the themes of {dailyStudies[0]?.passage || 'biblical teaching'} and
              focuses on spiritual growth through {dailyStudies[0]?.title?.toLowerCase() || 'faith and perseverance'}.
              The teaching emphasizes practical application and deep scriptural understanding.
            </p>
          </div>
        </Card>

        {/* Day Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(var(--blur-md))',
          WebkitBackdropFilter: 'blur(var(--blur-md))',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
          padding: '0',
          display: 'flex',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          borderBottom: 'none',
        }}>
          {dailyStudies.map((study) => (
            <button
              key={study.day}
              onClick={() => setActiveDay(study.day)}
              style={{
                flex: '1',
                minWidth: '120px',
                padding: 'var(--space-4) var(--space-6)',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                borderBottom: activeDay === study.day ? '3px solid var(--color-primary)' : '3px solid transparent',
                background: activeDay === study.day ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
                color: activeDay === study.day ? 'var(--color-primary)' : 'var(--color-gray-600)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                borderRadius: activeDay === study.day ? 'var(--radius-lg) var(--radius-lg) 0 0' : '0',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                if (activeDay !== study.day) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.color = 'var(--color-gray-900)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeDay !== study.day) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-gray-600)';
                }
              }}
            >
              Day {study.day}
            </button>
          ))}
        </div>

        {/* Study Content Card */}
        <Card style={{
          borderRadius: '0 0 var(--radius-2xl) var(--radius-2xl)',
          marginBottom: 'var(--space-6)',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        }}>
          {/* Day Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(88, 86, 214, 0.05) 100%)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            marginBottom: 'var(--space-8)',
            border: '1px solid rgba(0, 122, 255, 0.1)',
          }}>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: '700',
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-3)',
              wordBreak: 'break-word',
              letterSpacing: '-0.02em',
            }}>
              {currentStudy.title}
            </h2>
            {currentStudy.date && (
              <p style={{
                fontSize: '15px',
                color: 'var(--color-gray-600)',
                marginBottom: 'var(--space-1)',
                fontWeight: '500',
              }}>
                📅 {currentStudy.date}
              </p>
            )}
            <p style={{
              fontSize: '15px',
              color: 'var(--color-gray-600)',
              fontWeight: '500',
            }}>
              📖 {currentStudy.passage}
            </p>
          </div>

          {/* Study Content */}
          <div style={{
            background: 'var(--color-gray-50)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-gray-100)',
            maxHeight: '500px',
            overflowY: 'auto',
            marginBottom: 'var(--space-8)',
          }}
          ref={studyContentRef}>
            <div
              style={{
                color: 'var(--color-gray-900)',
                fontFamily: 'var(--font-sans)',
                lineHeight: '1.7',
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
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-6)',
          }}>
            <Button
              onClick={() => downloadDayStudy('txt')}
              variant="primary"
            >
              📄 Download Text
            </Button>

            <Button
              onClick={() => downloadDayStudy('word')}
              variant="gradient"
            >
              📘 Download Word
            </Button>
          </div>

          <div style={{ marginBottom: 'var(--space-8)' }}>
            <Button
              onClick={downloadFullStudy}
              variant="gradient"
              style={{ width: 'auto', paddingLeft: 'var(--space-8)', paddingRight: 'var(--space-8)' }}
            >
              📘 Download Full Study (Word)
            </Button>
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
            gap: 'var(--space-4)',
            marginTop: 'var(--space-6)',
          }}>
            <Button
              onClick={() => {
                setActiveDay(Math.max(1, activeDay - 1));
                logEvent('Navigation', 'Previous_Day', `Day ${activeDay - 1}`);
              }}
              disabled={activeDay === 1}
              variant="gradient"
            >
              ← Previous Day
            </Button>

            <Button
              onClick={() => {
                logEvent('Navigation', 'New_Study', 'From Results Page');
                setStep('input');
                setYoutubeLink('');
                setActiveDay(1);
                setDailyStudies([]);
              }}
              variant="primary"
            >
              🔄 New Study
            </Button>

            <Button
              onClick={() => {
                setActiveDay(Math.min(dailyStudies.length, activeDay + 1));
                logEvent('Navigation', 'Next_Day', `Day ${activeDay + 1}`);
              }}
              disabled={activeDay === dailyStudies.length}
              variant="gradient"
            >
              Next Day →
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
