// src/services/geminiService.js
// SECURE VERSION: Calls backend API instead of Gemini directly
// API key is now kept server-side only

/* ----------------------------- Utilities ----------------------------- */

function safeLower(s) { return typeof s === 'string' ? s.toLowerCase() : s; }

function chunkText(text, maxChars = 12000, overlap = 300) {
  if (!text) return [];
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(text.length, i + maxChars);
    chunks.push(text.slice(i, end));
    i = end - overlap;
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
 */
function repairJSON(jsonString) {
  let repaired = jsonString;

  // Remove any markdown code fences
  repaired = repaired.replace(/```json\n?/g, '').replace(/```\n?/g, '');

  // Remove any BOM or invisible characters at start
  repaired = repaired.replace(/^\uFEFF/, '').trim();

  // Track string state and bracket depth
  let inString = false;
  let escaped = false;
  let depth = 0;

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

  // If we're still in a string at the end, close it
  if (inString) {
    console.log('⚠ Detected unterminated string, closing it...');
    repaired = repaired + '"';
  }

  // If depth is still positive, close remaining structures
  while (depth > 0) {
    console.log(`⚠ Detected ${depth} unclosed brackets/braces, closing them...`);
    repaired += '}';
    depth--;
  }

  return repaired;
}

/**
 * Validates that a study is complete and not truncated
 */
function isStudyComplete(study) {
  if (!study || !study.content) return false;

  const content = study.content;
  const contentLength = content.length;

  if (contentLength < 500) return false;

  const requiredSections = [
    /##\s*Introduction/i,
    /##\s*Scripture Reading/i,
    /##\s*Key Points/i,
    /##\s*(Reflection|Discussion|Family|Exploratory)\s*Questions/i,
    /##\s*Prayer Focus/i
  ];

  const sectionsFound = requiredSections.filter(regex => regex.test(content)).length;

  if (sectionsFound < 4) return false;

  const lastLines = content.split('\n').slice(-5).join('\n').trim();
  if (lastLines.length < 50) return false;

  return true;
}

/**
 * Validates that all studies in an array are complete
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

/* ---------------------- API Helper ---------------------- */

// Determine API base URL (works in dev and production)
const API_BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL || '');

/**
 * Call the secure backend Gemini API
 */
async function callGeminiAPI(payload, maxAttempts = 3) {
  let attempt = 0;
  let delay = 800;

  while (attempt < maxAttempts) {
    try {
      const response = await fetch(`${API_BASE}/api/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', payload })
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.error || 'API request failed');
        error.status = response.status;
        throw error;
      }

      return data.text;

    } catch (err) {
      const status = err.status;
      const retriable = status === 429 || status === 503;
      attempt += 1;

      if (!retriable || attempt >= maxAttempts) {
        throw err;
      }

      console.warn(
        `API request failed with status ${status}. Retrying in ${delay}ms (attempt ${attempt}/${maxAttempts}).`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

/* ---------------------- Transcript Retrieval ------------------------ */

export async function fetchYouTubeTranscript(videoId) {
  try {
    const response = await fetch(`${API_BASE}/api/transcript`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId })
    });

    const data = await response.json();

    if (data.ok) {
      return { ok: true, text: data.text, items: data.items };
    } else {
      console.warn('Transcript fetch failed:', data.error);
      return { ok: false, text: '' };
    }
  } catch (err) {
    console.warn('Transcript fetch error:', err?.message || err);
    return { ok: false, text: '' };
  }
}

/* --------------------- Schema Definitions ----------------------- */

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

/* ---------------------- Public API: Analyze ------------------------- */

export async function analyzeVideoForBiblicalContent(videoTitle, videoDescription, videoId) {
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
      const responseText = await callGeminiAPI({
        systemInstruction: 'You are a conservative, charismatic, text-grounded biblical content analyzer. Only use the provided transcript.',
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
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

      const parsed = JSON.parse(responseText);
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

  // Fallback: short transcript (or none)
  const responseText = await callGeminiAPI({
    systemInstruction: 'You are a conservative, charismatic, text-grounded biblical content analyzer. Prefer evidence from transcript; otherwise be cautious.',
    responseMimeType: 'application/json',
    responseSchema: analysisSchema,
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

  const parsed = JSON.parse(responseText);
  return parsed;
}

/* ------------------- Public API: Study Generation ------------------- */

export async function generateBibleStudy(
  videoTitle,
  videoDescription,
  themes,
  scriptures,
  options,
  videoId,
  customContext = ''
) {
  // Try to get transcript
  let transcript = '';
  if (customContext) {
    transcript = customContext;
    console.log('Custom context provided for study generation. Length:', transcript.length);
  } else if (videoId) {
    const t = await fetchYouTubeTranscript(videoId);
    if (t.ok) transcript = t.text;
  }
  console.log('Transcript length (study):', transcript ? transcript.length : 0);

  // Slice transcript for context
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
  const maxValidationAttempts = 3;
  let useTextMode = false;

  while (attempts < maxValidationAttempts) {
    attempts++;

    console.log(`Study generation attempt ${attempts}/${maxValidationAttempts}${useTextMode ? ' (text mode)' : ''}`);

    try {
      const payload = useTextMode
        ? {
            systemInstruction: 'Produce precise, evidence-grounded studies. Return ONLY a valid JSON array with exactly 5 study objects. CRITICAL: Complete ALL sections for ALL 5 days.',
            maxOutputTokens: 8192,
            temperature: 0.7,
            contents: [{ role: 'user', parts: [{ text: studyPrompt }]}]
          }
        : {
            systemInstruction: 'Produce precise, evidence-grounded studies. Output must be valid JSON according to the given schema. IMPORTANT: Complete ALL sections for ALL 5 days.',
            responseMimeType: 'application/json',
            responseSchema: studyArraySchema,
            maxOutputTokens: 8192,
            temperature: 0.7,
            contents: [{ role: 'user', parts: [{ text: studyPrompt }]}]
          };

      const responseText = await callGeminiAPI(payload);

      console.log('Response preview:', responseText.substring(0, 200));

      let parsed;
      let parseSucceeded = false;

      try {
        parsed = JSON.parse(responseText);
        parseSucceeded = true;
      } catch (parseError) {
        console.warn('Initial JSON parse failed, attempting repair:', parseError.message);

        try {
          const repairedJSON = repairJSON(responseText);
          parsed = JSON.parse(repairedJSON);
          console.log('✓ JSON parsed successfully after repair');
          parseSucceeded = true;
        } catch (repairError) {
          console.error('JSON parse failed after repair. Response length:', responseText.length);

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

          if (!parseSucceeded && attempts < maxValidationAttempts) {
            if (attempts >= 2 && !useTextMode) {
              console.log('⚠ Switching to text mode for next attempt...');
              useTextMode = true;
            }
            console.log('Retrying due to JSON parse error...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            continue;
          } else if (!parseSucceeded) {
            throw new Error(`Failed to parse JSON response after ${maxValidationAttempts} attempts: ${repairError.message}`);
          }
        }
      }

      if (!parseSucceeded) {
        throw new Error('Failed to parse JSON response.');
      }

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
        return parsed.map((study, index) => ({
          day: typeof study.day === 'number' ? study.day : (index + 1),
          title: study.title || `Day ${index + 1}`,
          passage: study.passage || (scriptures[index] || scriptures[0] || 'Matthew 28:19-20'),
          content: study.content || 'Study content'
        }));
      }

      console.warn(`✗ Validation failed: ${validation.message}`);

      if (attempts < maxValidationAttempts) {
        console.log('Retrying study generation due to incomplete content...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
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

      if (attempts < maxValidationAttempts) {
        console.log('Retrying after error...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      } else {
        throw error;
      }
    }
  }

  throw new Error('Study generation failed after all retry attempts');
}
