// src/services/geminiService.js
// Requires: npm i @google/generative-ai youtube-transcript
// NOTE: In many browsers, YouTube captions endpoints block CORS.
// This file still tries in-browser; if transcript length keeps logging 0,
// move transcript fetching to a tiny server proxy (as discussed).

import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';

const MODEL_NAME = 'gemini-1.5-pro-latest';
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

/**
 * Attempts to repair malformed JSON by fixing common issues
 * @param {string} jsonString - Potentially malformed JSON string
 * @returns {string} - Repaired JSON string
 */
function repairJSON(jsonString) {
  let repaired = jsonString;

  // Remove any markdown code fences
  repaired = repaired.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Remove any BOM or invisible characters at start
  repaired = repaired.replace(/^\uFEFF/, '').trim();

  // --- Advanced Repair: Fix internal unescaped quotes and newlines ---
  // This is the most common cause of "Expected ',' or ']'" errors.
  let repairedChars = [];
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];
    repairedChars.push(char);

    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
    }
  }

  // Reset for a second pass to fix structures
  for (let i = 0; i < repaired.length; i++) {
    const char = repaired[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      depth++;
    } else if (char === '}' || char === ']') {
      depth--;
    }
  }

  // If we're still in a string at the end, it's a truncation. Close it.
  if (inString) {
    console.log('⚠ Detected unterminated string, closing it...');
    repaired = repaired + '"'; // Close the string
  }

  // If depth is still positive, close remaining structures
  while (depth > 0) {
    console.log(`⚠ Detected ${depth} unclosed brackets/braces, closing them...`);
    while (depth > 0) {
      repaired += '}';
      depth--;
    }
  }

  return repaired;
}

/**
 * Validates that a study is complete and not truncated
 * @param {object} study - Single study object
 * @returns {boolean} - True if study appears complete
 */
function isStudyComplete(study) {
  if (!study || !study.content) return false;

  const content = study.content;
  const contentLength = content.length;

  // Check minimum length (truncated studies are usually very short)
  if (contentLength < 500) return false;

  // Check for expected sections in the content
  const requiredSections = [
    /##\s*Introduction/i,
    /##\s*Scripture Reading/i,
    /##\s*Key Points/i,
    /##\s*(Reflection|Discussion|Family|Exploratory)\s*Questions/i,
    /##\s*Prayer Focus/i
  ];

  const sectionsFound = requiredSections.filter(regex => regex.test(content)).length;

  // At least 4 out of 5 required sections should be present
  if (sectionsFound < 4) return false;

  // Check that content doesn't end abruptly (has proper ending)
  // Truncated content often ends mid-sentence or without proper closure
  const lastLines = content.split('\n').slice(-5).join('\n').trim();
  if (lastLines.length < 50) return false;

  return true;
}

/**
 * Validates that all studies in an array are complete
 * @param {array} studies - Array of study objects
 * @returns {object} - {isValid: boolean, incompleteIndices: number[]}
 */
function validateStudiesCompleteness(studies) {
  if (!Array.isArray(studies) || studies.length === 0) {
    return { isValid: false, incompleteIndices: [], message: 'No studies provided' };
  }

  if (studies.length !== 5) {
    return { isValid: false, incompleteIndices: [], message: `Expected 5 studies but got ${studies.length}` };
  }

  const incompleteIndices = [];
  studies.forEach((study, index) => {
    if (!isStudyComplete(study)) {
      incompleteIndices.push(index);
    }
  });

  if (incompleteIndices.length > 0) {
    return {
      isValid: false,
      incompleteIndices,
      message: `Studies ${incompleteIndices.map(i => i + 1).join(', ')} appear incomplete or truncated`
    };
  }

  return { isValid: true, incompleteIndices: [], message: 'All studies are complete' };
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

function getModel(config = {}) {
  return genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      maxOutputTokens: 8192, // Ensure enough tokens for complete study
      ...config
    }
  });
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

  // —— Streamlined expert prompt (grounded, exegetical, pastoral) ——
  const studyPrompt = `
Create a complete 5-day Bible study that is:
1. Grounded in the transcript excerpts and themes provided
2. Exegetically sound and pastorally warm
3. Specific to this teaching (not generic)

CONTEXT
• TITLE: ${videoTitle}
• THEMES: ${themes.join(', ')}
• SCRIPTURES: ${scriptures.join(', ')}
• TRANSCRIPT:
${transcriptSlices || '[No transcript — be cautious with claims]'}

PROFILE: ${options.usageSelection} | ${options.sessionLength}
${includeDeeper ? '• Include Greek/Hebrew insights where clarifying' : ''}
${includeMemory ? '• Include one memory verse per day' : ''}
${includeAction ? '• Include one action step per day' : ''}

EACH DAY MUST INCLUDE:
Day 1 — Foundation & biblical basis
Day 2 — Biblical context & OT-NT connections
Day 3 — Theological depth & Gospel links
Day 4 — Practical application
Day 5 — Integration & worship response

REQUIRED CONTENT STRUCTURE FOR EACH DAY:
# Day [N]: [Title]

## Introduction
[3-5 focused paragraphs from transcript]

## Scripture Reading: [Reference]
[Context, setting, and why this passage matters]

## Key Points
1. [Transcript-rooted point]
2. [Point with cross-refs]
3. [Doctrinal insight with Gospel connection]
${includeDeeper ? '4. [Greek/Hebrew or historical clarification]' : ''}

## ${questionType}
1. [Question]
2. [Question]
3. [Question]
4. [Question]
5. [Question]

## Prayer Focus
[Specific prayer reflecting the day's teaching]
${includeMemory ? '\n## Memory Verse\n[Verse reference and full text]\n' : ''}${includeAction ? '\n## Action Step\n[One concrete practice]\n' : ''}

CRITICAL: Complete ALL sections for ALL 5 days. Christ-centered, text-faithful, no speculation.

RETURN: JSON array with 5 complete objects: {"day":N,"title":"...","passage":"...","content":"..."}
`.trim();

  // Retry logic with validation
  let attempts = 0;
  const maxValidationAttempts = 3; // Increased to 3 attempts
  let useTextMode = false; // Flag to switch to text mode on repeated failures

  while (attempts < maxValidationAttempts) {
    attempts++;

    console.log(`Study generation attempt ${attempts}/${maxValidationAttempts}${useTextMode ? ' (text mode)' : ''}`);

    try {
      // Build generation config - use text mode as fallback
      const generationConfig = useTextMode
        ? {
            maxOutputTokens: 8192,
            temperature: 0.7
          }
        : {
            responseMimeType: 'application/json',
            responseSchema: studyArraySchema,
            maxOutputTokens: 8192,
            temperature: 0.7
          };

      const res = await generateWithRetry(model, {
        systemInstruction: useTextMode
          ? 'Produce precise, evidence-grounded studies. Return ONLY a valid JSON array with exactly 5 study objects. CRITICAL: Complete ALL sections for ALL 5 days. Each "content" field must include ALL required sections.'
          : 'Produce precise, evidence-grounded studies. Output must be valid JSON according to the given schema. IMPORTANT: Complete ALL sections for ALL 5 days. Do not truncate content.',
        generationConfig,
        contents: [{ role: 'user', parts: [{ text: studyPrompt }]}]
      });

      let responseText = res.response.text();

      // Log first 200 chars for debugging
      console.log('Response preview:', responseText.substring(0, 200));

      let parsed;
      let parseSucceeded = false;
      try {
        // First try: direct parse (should work with responseMimeType: 'application/json')
        parsed = JSON.parse(responseText);
        parseSucceeded = true;
      } catch (parseError) {
        console.warn('Initial JSON parse failed, attempting repair:', parseError.message);

        // Try advanced JSON repair
        try {
          const repairedJSON = repairJSON(responseText);
          parsed = JSON.parse(repairedJSON);
          console.log('✓ JSON parsed successfully after repair');
          parseSucceeded = true;
        } catch (repairError) {
          console.error('JSON parse failed after repair. Response length:', responseText.length);
          console.error('Parse error:', repairError.message);

          // Log a snippet around the error position if available
          const match = repairError.message.match(/position (\d+)/);
          if (match) {
            const pos = parseInt(match[1]);
            const start = Math.max(0, pos - 100);
            const end = Math.min(responseText.length, pos + 100);
            console.error('Context around error:', responseText.substring(start, end));
          }

          // Fallback: attempt to extract JSON array manually
          const arrayStart = responseText.indexOf('[');
          const arrayEnd = responseText.lastIndexOf(']');
          if (!parseSucceeded && arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
            const candidate = responseText.slice(arrayStart, arrayEnd + 1);
            try {
              parsed = JSON.parse(candidate);
              console.log('✓ JSON parsed successfully after array extraction');
              parseSucceeded = true;
            } catch (candidateError) {
              console.warn('Array extraction parse failed:', candidateError.message);
            }
          }

          // If this is not the last attempt, retry
          if (!parseSucceeded && attempts < maxValidationAttempts) {
            // Switch to text mode for next attempt if we're on attempt 2+
            if (attempts >= 2 && !useTextMode) {
              console.log('⚠ Switching to text mode for next attempt...');
              useTextMode = true;
            }
            console.log('Retrying due to JSON parse error...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            continue; // Skip to next iteration
          } else if (!parseSucceeded) {
            // Last attempt - throw error
            throw new Error(`Failed to parse JSON response after ${maxValidationAttempts} attempts: ${repairError.message}`);
          }
        }
      }

      if (!parseSucceeded) {
        throw new Error('Failed to parse JSON response.');
      }

      // Ensure parsed is an array
      if (!Array.isArray(parsed)) {
        console.error('Response is not an array:', typeof parsed);
        if (attempts < maxValidationAttempts) {
          console.log('Retrying due to invalid response format...');
          await new Promise(resolve => setTimeout(resolve, 1500));
          continue;
        } else {
          throw new Error('Response is not an array after all attempts');
        }
      }

      // Validate completeness
      const validation = validateStudiesCompleteness(parsed);

      if (validation.isValid) {
        console.log('✓ All studies validated as complete');
        // Light normalization in case the model misses a field
        return parsed.map((study, index) => ({
          day: typeof study.day === 'number' ? study.day : (index + 1),
          title: study.title || `Day ${index + 1}`,
          passage: study.passage || (scriptures[index] || scriptures[0] || 'Matthew 28:19-20'),
          content: study.content || 'Study content'
        }));
      }

      console.warn(`✗ Validation failed: ${validation.message}`);

      // If this is not the last attempt, retry
      if (attempts < maxValidationAttempts) {
        console.log('Retrying study generation due to incomplete content...');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Brief delay before retry
      } else {
        // Last attempt failed - log warning but return what we have
        console.error('Final attempt: Studies may be incomplete but returning available content');
        return parsed.map((study, index) => ({
          day: typeof study.day === 'number' ? study.day : (index + 1),
          title: study.title || `Day ${index + 1}`,
          passage: study.passage || (scriptures[index] || scriptures[0] || 'Matthew 28:19-20'),
          content: study.content || 'Study content for this day could not be generated.'
        }));
      }
    } catch (error) {
      console.error(`Attempt ${attempts} failed:`, error.message);

      // If this is not the last attempt, retry
      if (attempts < maxValidationAttempts) {
        console.log('Retrying after error...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Longer delay after error
        continue;
      } else {
        // Last attempt failed - throw error
        throw error;
      }
    }
  }

  // This should never be reached, but just in case
  throw new Error('Study generation failed after all retry attempts');
}
