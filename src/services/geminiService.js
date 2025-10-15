// src/services/geminiService.js
// Requires: npm i @google/generative-ai youtube-transcript
// NOTE: In many browsers, YouTube captions endpoints block CORS.
// This file still tries in-browser; if transcript length keeps logging 0,
// move transcript fetching to a tiny server proxy (as discussed).

import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';

const MODEL_NAME = 'gemini-2.5-flash';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/* ----------------------------- Utilities ----------------------------- */

function safeLower(s) { return typeof s === 'string' ? s.toLowerCase() : s; }

function chunkText(text, maxChars = 12000, overlap = 300) {
  if (!text) return [];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + maxChars);
    chunks.push(text.slice(i, end));
    i = end - overlap; // small overlap to keep context continuity
    if (i < 0) i = 0;
    if (i >= text.length) break;
  }
  return chunks;
}

function dedupeStrings(arr) {
  const seen = new Set();
  const out = [];
  for (const s of arr || []) {
    const key = safeLower(s || '').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(s);
  }
  return out;
}

function unionThemes(arrays) {
  return dedupeStrings([].concat(...arrays));
}

function average(nums) {
  if (!nums?.length) return 0;
  return nums.reduce((a, b) => a + (b || 0), 0) / nums.length;
}

/* ---------------------- Transcript Retrieval ------------------------ */

export async function fetchYouTubeTranscript(videoId) {
  try {
    const items = await YoutubeTranscript.fetchTranscript(videoId);
    const full = items.map(i => i.text).join(' ').replace(/\s+/g, ' ').trim();
    return { ok: true, text: full, items };
  } catch (err) {
    console.warn('Transcript fetch failed or unavailable. Falling back:', err?.message || err);
    return { ok: false, text: '' };
  }
}

/* --------------------- Schema & Model Helpers ----------------------- */

const analysisSchema = {
  type: 'object',
  properties: {
    isChristianTeaching: { type: 'boolean' },
    confidence: { type: 'number' },
    reason: { type: 'string' },
    mainThemes: { type: 'array', items: { type: 'string' } },
    scriptureReferences: { type: 'array', items: { type: 'string' } }
  },
  required: ['isChristianTeaching', 'confidence', 'reason', 'mainThemes', 'scriptureReferences']
};

const daySchema = {
  type: 'object',
  properties: {
    day: { type: 'number' },
    title: { type: 'string' },
    passage: { type: 'string' },
    content: { type: 'string' }
  },
  required: ['day', 'title', 'passage', 'content']
};

const studyArraySchema = {
  type: 'array',
  items: daySchema,
  minItems: 5,
  maxItems: 5
};

function getModel() {
  return genAI.getGenerativeModel({ model: MODEL_NAME });
}

function extractStatus(err) {
  if (!err) return undefined;
  if (typeof err.status === 'number') return err.status;
  if (err.response?.status) return err.response.status;
  const message = err.message || '';
  const match = message.match(/\[(\d{3})\]/);
  if (match) return Number(match[1]);
  return undefined;
}

async function generateWithRetry(model, request, maxAttempts = 3, initialDelay = 800) {
  let attempt = 0;
  let delay = initialDelay;

  while (attempt < maxAttempts) {
    try {
      return await model.generateContent(request);
    } catch (err) {
      const status = extractStatus(err);
      const retriable = status === 429 || status === 503;
      attempt += 1;

      if (!retriable || attempt >= maxAttempts) {
        throw err;
      }

      console.warn(
        `Gemini request failed with status ${status}. Retrying in ${delay}ms (attempt ${attempt}/${maxAttempts}).`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/* ---------------------- Public API: Analyze ------------------------- */
/**
 * Analyze whether a video is Christian teaching, using transcript when available.
 * @param {string} videoTitle
 * @param {string} videoDescription
 * @param {string} [videoId] - Optional YouTube videoId to pull transcript
 */
export async function analyzeVideoForBiblicalContent(videoTitle, videoDescription, videoId) {
  const model = getModel();

  // Try to ground the model with transcript
  let transcript = '';
  if (videoId) {
    const t = await fetchYouTubeTranscript(videoId);
    if (t.ok) transcript = t.text;
  }
  console.log('Transcript length (analyze):', transcript ? transcript.length : 0);

  // If transcript is long, map-reduce across chunks
  if (transcript && transcript.length > 4000) {
    const chunks = chunkText(transcript, 12000, 300);

    const partials = [];
    for (const chunk of chunks) {
      const res = await generateWithRetry(model, {
        systemInstruction:
          'You are a conservative, charismatic, text-grounded biblical content analyzer. Only use the provided transcript.',
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: analysisSchema
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
`VIDEO CONTEXT:
Title: ${videoTitle}
Description: ${videoDescription}

TRANSCRIPT CHUNK (analyze only what is here):
${chunk}

Task: Determine if this chunk reflects Christian biblical teaching/sermon content. Extract explicit themes and scripture references mentioned in the text.`
              }
            ]
          }
        ]
      });

      const parsed = JSON.parse(res.response.text());
      partials.push(parsed);
    }

    // Reduce: merge all partials
    const isChristianVotes = partials.map(p => p.isChristianTeaching ? 1 : 0);
    const isChristianTeaching = average(isChristianVotes) >= 0.5;
    const confidence = average(partials.map(p => p.confidence || 0.7));
    const reason = 'Aggregated from transcript analysis across chunks.';
    const mainThemes = unionThemes(partials.map(p => p.mainThemes || []));
    const scriptureReferences = unionThemes(partials.map(p => p.scriptureReferences || []));

    return { isChristianTeaching, confidence, reason, mainThemes, scriptureReferences };
  }

  // Fallback: short transcript (or none) — still pass whatever we have
  const res = await generateWithRetry(model, {
    systemInstruction:
      'You are a conservative, charismatic, text-grounded biblical content analyzer. Prefer evidence from transcript; otherwise be cautious.',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: analysisSchema
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text:
`VIDEO CONTEXT
Title: ${videoTitle}
Description: ${videoDescription}

${transcript ? `TRANSCRIPT (may be truncated): ${transcript.slice(0, 16000)}` : 'NO TRANSCRIPT AVAILABLE'}

Task: Determine if this is clearly Christian biblical teaching or preaching, extract themes and scripture references only from provided text.`
          }
        ]
      }
    ]
  });

  const parsed = JSON.parse(res.response.text());
  return parsed;
}

/* ------------------- Public API: Study Generation ------------------- */
/**
 * Generate a 5-day study grounded in the sermon transcript and detected themes.
 * @param {string} videoTitle
 * @param {string} videoDescription
 * @param {string[]} themes
 * @param {string[]} scriptures
 * @param {object} options
 * @param {string} [videoId] - Optional YouTube videoId to include transcript evidence
 * @param {string} [customContext] - Raw user-provided text to ground the study
 */
export async function generateBibleStudy(
  videoTitle,
  videoDescription,
  themes,
  scriptures,
  options,
  videoId,
  customContext = ''
) {
  const model = getModel();

  // Try to get transcript (best-effort). Even a few thousand chars improves specificity.
  let transcript = '';
  if (customContext) {
    transcript = customContext;
    console.log('Custom context provided for study generation. Length:', transcript.length);
  } else if (videoId) {
    const t = await fetchYouTubeTranscript(videoId);
    if (t.ok) transcript = t.text;
  }
  console.log('Transcript length (study):', transcript ? transcript.length : 0);

  // Trim transcript to a manageable context; the structure/pattern does not need the entire thing.
  // Prefer a few instructive slices: head, middle, tail.
  function sliceAround(text, parts = 3, each = 3500) {
    if (!text) return '';
    const len = text.length;
    if (len <= parts * each) return text;
    const third = Math.floor(len / 3);
    const head = text.slice(0, each);
    const middle = text.slice(Math.max(0, third - Math.floor(each / 2)), Math.max(0, third - Math.floor(each / 2)) + each);
    const tail = text.slice(len - each);
    return `${head}\n...\n${middle}\n...\n${tail}`;
  }
  const transcriptSlices = sliceAround(transcript);

  // Usage profile
  let usageInstructions = '';
  let questionType = 'reflection';
  switch (options.usageSelection) {
    case 'Personal Study':
      usageInstructions = `Use "I/my/me" language; prayer focuses for individual growth; include personal application.`;
      questionType = 'Reflection Questions';
      break;
    case 'Small Group':
      usageInstructions = `Use "we/us/our" language; include discussion starters and group activities.`;
      questionType = 'Discussion Questions';
      break;
    case 'Family Devotions':
      usageInstructions = `Use family-friendly language; include child-accessible examples and a simple family action.`;
      questionType = 'Family Questions';
      break;
    case 'Sharing with Friends':
      usageInstructions = `Use accessible, invitational language; connect clearly to the Gospel for newcomers.`;
      questionType = 'Exploratory Questions';
      break;
    default:
      questionType = 'Reflection Questions';
      break;
  }

  const includeDeeper = !!options.includeDeeperAnalysis;
  const includeMemory = !!options.includeMemoryVerses;
  const includeAction = !!options.includeActionSteps;

  // —— Beefed-up expert prompt (grounded, exegetical, pastoral) ——
  const studyPrompt = `
You are a seasoned pastor-theologian and Bible study author. Produce a five-day study that is
(1) grounded ONLY in the provided transcript excerpts and the supplied themes/scriptures,
(2) exegetically rigorous (historical–grammatical method),
(3) pastorally warm and spiritually formative,
(4) precise, non-generic, and specific to THIS sermon.

CONTEXT
• VIDEO TITLE: ${videoTitle}
• THEMES (guide rails): ${themes.join(', ')}
• KEY SCRIPTURES (seed list): ${scriptures.join(', ')}
• TRANSCRIPT EXCERPTS (primary evidence; do not invent content not supported here):
${transcriptSlices || '[No transcript available — respond cautiously and avoid speculative claims.]'}

USAGE PROFILE
• TYPE: ${options.usageSelection}
• SESSION LENGTH: ${options.sessionLength}
• INCLUDE: ${includeDeeper ? 'Deeper analysis (Greek/Hebrew & historical context).' : '—'}
• INCLUDE: ${includeMemory ? 'One key memory verse per day.' : '—'}
• INCLUDE: ${includeAction ? 'One practical action step per day.' : '—'}

AUTHORSHIP & THEOLOGY (do not browse the web)
• Emulate expert-level exegesis and catechesis informed by broadly respected scholarship
  (e.g., early church fathers, Reformers, classic evangelical commentators, creeds/confessions),
  but DO NOT fabricate citations, dates, or page numbers.
• Keep Christ-centered and Trinitarian; make Gospel connections explicit where faithful to the text.
• Distinguish primary doctrines from secondary debates; note major interpretive options fairly,
  then defend the most text-faithful reading from the transcript and Scripture.
• Integrate original-language insight (Greek/Hebrew) ONLY when it clarifies the text; transliterate terms and define them plainly.

OUTPUT SPEC
• Return ONLY valid JSON (no markdown fences, no extra text).
• JSON MUST be an array of exactly five objects with fields: day, title, passage, content.
• Inside each day's "content" string, use Markdown sections exactly as shown below.
• Keep tone pastoral, clear, and concrete; avoid clichés and filler.

PER-DAY REQUIREMENTS (tailor to the transcript)
Day 1 — FOUNDATION: Introduce the theme; establish biblical basis from the sermon’s anchor text.
Day 2 — BIBLICAL CONTEXT: Trace theme across Scripture; OT→NT links; historical background.
Day 3 — THEOLOGICAL DEPTH: Doctrinal significance; Gospel connection; careful nuance.
Day 4 — PRACTICAL APPLICATION: Concrete practices, obstacles, and patterns of obedience.
Day 5 — INTEGRATION & RESPONSE: Summation, worship, long-term practices and community.

MANDATORY MARKDOWN SHAPE FOR EACH "content" FIELD
# Day [Number]: [Title]

## Introduction
[3–5 paragraphs tightly tied to the transcript; avoid fluff.]

## Scripture Reading: [Primary Reference]
[Give immediate context (author/audience/setting), flow of argument, and why the sermon used it.]

## Key Points
1. [Point 1 — rooted in transcript and text]
2. [Point 2 — with cross-refs, briefly explained]
3. [Point 3 — with doctrinal insight tied to the Gospel]
${includeDeeper ? '4. [Original-language or historical note that genuinely clarifies meaning]' : ''}

## ${questionType}
1. [...]
2. [...]
3. [...]
4. [...]
5. [...]

## Prayer Focus
[A short, specific prayer that reflects the day’s teaching.]
${includeMemory ? '\n## Memory Verse\n[Book Chapter:Verse — quote the verse faithfully]\n' : ''}${includeAction ? '\n## Action Step\n[One concrete, measurable practice for the next 24–48 hours]\n' : ''}

CONSTRAINTS
• Do not assert facts not supported by the transcript or Scripture. If uncertain, say so briefly.
• Quote Scripture succinctly; reference clearly (e.g., John 15:1–5). Avoid paraphrasing that distorts meaning.
• Avoid culture wars and speculation; aim for spiritual formation grounded in the text.

RETURN FORMAT (JSON ONLY; EXACTLY FIVE ITEMS):
[
  {"day":1,"title":"...","passage":"...","content":"..."},
  {"day":2,"title":"...","passage":"...","content":"..."},
  {"day":3,"title":"...","passage":"...","content":"..."},
  {"day":4,"title":"...","passage":"...","content":"..."},
  {"day":5,"title":"...","passage":"...","content":"..."}
]
`.trim();

  const res = await generateWithRetry(model, {
    systemInstruction: 'Produce precise, evidence-grounded studies. Output must be valid JSON according to the given schema.',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: studyArraySchema
    },
    contents: [{ role: 'user', parts: [{ text: studyPrompt }]}]
  });

  const parsed = JSON.parse(res.response.text());
  // Light normalization in case the model misses a field
  return parsed.map((study, index) => ({
    day: typeof study.day === 'number' ? study.day : (index + 1),
    title: study.title || `Day ${index + 1}`,
    passage: study.passage || (scriptures[index] || scriptures[0] || 'Matthew 28:19-20'),
    content: study.content || 'Study content'
  }));
}
