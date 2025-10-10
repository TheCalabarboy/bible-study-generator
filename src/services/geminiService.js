// src/services/geminiService.js
// Requires: npm i @google/generative-ai youtube-transcript
// If you cannot or don't want to use youtube-transcript in the browser due to CORS,
// this still tries gracefully and falls back to title/description-only mode.

import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';

const MODEL_NAME = 'gemini-2.5-pro'; // per your note
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
    // Tries official/auto captions. Returns array of {text, offset, duration}
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

  // If transcript is long, map-reduce across chunks
  if (transcript && transcript.length > 4000) {
    const chunks = chunkText(transcript, 12000, 300);

    // Map: analyze each chunk with a strict JSON schema
    const partials = [];
    for (const chunk of chunks) {
      const res = await model.generateContent({
        systemInstruction:
          'You are a conservative, text-grounded biblical content analyzer. Only use the provided transcript.',
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
  const res = await model.generateContent({
    systemInstruction:
      'You are a conservative, text-grounded biblical content analyzer. Prefer evidence from transcript; otherwise be cautious.',
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
 */
export async function generateBibleStudy(videoTitle, videoDescription, themes, scriptures, options, videoId) {
  const model = getModel();

  // Try to get transcript (best-effort). Even a few thousand chars improves specificity.
  let transcript = '';
  if (videoId) {
    const t = await fetchYouTubeTranscript(videoId);
    if (t.ok) transcript = t.text;
  }

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
      questionType = 'personal reflection';
      break;
    case 'Small Group':
      usageInstructions = `Use "we/us/our" language; include discussion starters and group activities.`;
      questionType = 'group discussion';
      break;
    case 'Family Devotions':
      usageInstructions = `Use family-friendly language; include child-accessible examples and a simple family action.`;
      questionType = 'family discussion';
      break;
    case 'Sharing with Friends':
      usageInstructions = `Use accessible, invitational language; connect clearly to the Gospel for newcomers.`;
      questionType = 'exploratory discussion';
      break;
    default:
      break;
  }

  const includeDeeper = !!options.includeDeeperAnalysis;
  const includeMemory = !!options.includeMemoryVerses;
  const includeAction = !!options.includeActionSteps;

  const studyPrompt =
`You are an experienced pastor and Bible study author. Write a detailed 5-day study grounded ONLY in the provided transcript excerpts and themes.

VIDEO TITLE: ${videoTitle}
THEMES: ${themes.join(', ')}
KEY SCRIPTURES: ${scriptures.join(', ')}

USAGE TYPE: ${options.usageSelection}
INSTRUCTIONS: ${usageInstructions}
SESSION LENGTH: ${options.sessionLength}
${includeDeeper ? 'INCLUDE deeper analysis (Greek/Hebrew & historical context) when relevant.' : ''}
${includeMemory ? 'INCLUDE one key memory verse each day.' : ''}
${includeAction ? 'INCLUDE one practical action step each day.' : ''}

TRANSCRIPT EXCERPTS (evidence):
${transcriptSlices || '[Transcript unavailable; use themes/scriptures cautiously.]'}

OUTPUT RULES:
- Return ONLY valid JSON (no markdown fences).
- Use this exact array shape of five objects (days 1–5).
- Content should be Markdown, but keep it inside JSON strings.

ARRAY SHAPE:
[
  {"day":1,"title":"...", "passage":"...", "content":"..."},
  {"day":2,"title":"...", "passage":"...", "content":"..."},
  {"day":3,"title":"...", "passage":"...", "content":"..."},
  {"day":4,"title":"...", "passage":"...", "content":"..."},
  {"day":5,"title":"...", "passage":"...", "content":"..."}
]

CONTENT TEMPLATE INSIDE EACH "content" FIELD:
# Day [Number]: [Title]

## Introduction
[2-3 paragraphs]

## Scripture Reading: [Reference]
[Context + how the sermon used this.]

## Key Points
1. ...
2. ...
3. ...

## ${questionType.charAt(0).toUpperCase() + questionType.slice(1)} Questions
1. ...
2. ...
3. ...
4. ...
5. ...

## Prayer Focus
[Specific prayer]

${includeMemory ? '## Memory Verse\n[Reference and text]\n' : ''}${includeAction ? '## Action Step\n[Specific step]\n' : ''}

Ensure claims are supported by the transcript excerpts when possible.`;

  const res = await model.generateContent({
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
