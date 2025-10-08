import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Helper function to sanitize JSON strings
function sanitizeJSON(jsonString) {
  // Remove markdown code blocks
  let cleaned = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Find JSON object or array
  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
  if (!jsonMatch) return null;
  
  let jsonText = jsonMatch[0];
  
  // Fix common JSON issues - remove control characters
  jsonText = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  
  return jsonText;
}

export async function analyzeVideoForBiblicalContent(videoTitle, videoDescription) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
You are a biblical content analyzer. Analyze this YouTube video and determine if it's a Christian biblical teaching, sermon, or preaching.

Video Title: ${videoTitle}
Video Description: ${videoDescription}

IMPORTANT: Respond with ONLY valid JSON. Do not include any newlines, tabs, or special characters in string values.
Use spaces instead of newlines. Keep all text on single lines.

Required format:
{
  "isChristianTeaching": true,
  "confidence": 0.9,
  "reason": "Brief explanation without line breaks",
  "mainThemes": ["Theme1", "Theme2", "Theme3"],
  "scriptureReferences": ["Reference1", "Reference2"]
}

Be strict - only return isChristianTeaching: true if it's clearly biblical Christian content.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    const sanitized = sanitizeJSON(text);
    
    if (sanitized) {
      try {
        const parsed = JSON.parse(sanitized);
        
        // Validate and return with defaults
        return {
          isChristianTeaching: parsed.isChristianTeaching ?? true,
          confidence: parsed.confidence ?? 0.7,
          reason: parsed.reason ?? 'Analysis completed',
          mainThemes: Array.isArray(parsed.mainThemes) ? parsed.mainThemes : ['Faith', 'Scripture'],
          scriptureReferences: Array.isArray(parsed.scriptureReferences) ? parsed.scriptureReferences : ['Matthew 28:19-20']
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Failed to parse:', sanitized);
      }
    }
    
    // Return safe defaults
    console.warn('Could not parse Gemini response, using defaults');
    return {
      isChristianTeaching: true,
      confidence: 0.7,
      reason: 'AI analysis unavailable',
      mainThemes: ['Faith', 'Biblical Teaching', 'Christian Living'],
      scriptureReferences: ['Matthew 28:19-20', 'Romans 12:1-2']
    };
    
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return {
      isChristianTeaching: true,
      confidence: 0.7,
      reason: 'Analysis unavailable',
      mainThemes: ['Faith', 'Biblical Teaching'],
      scriptureReferences: ['Matthew 28:19-20']
    };
  }
}

export async function generateBibleStudy(videoTitle, videoDescription, themes, scriptures, options) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
You are a Christian pastor and Bible study author. Create a detailed 5-day Bible study guide.

Video Title: ${videoTitle}
Main Themes: ${themes.join(', ')}
Scripture References: ${scriptures.join(', ')}
Study Type: ${options.usageSelection}
Session Length: ${options.sessionLength}

${options.includeDeeperAnalysis ? 'INCLUDE: Greek/Hebrew word studies and historical context.' : ''}
${options.includeMemoryVerses ? 'INCLUDE: One memory verse for each day.' : ''}
${options.includeActionSteps ? 'INCLUDE: Practical action steps for each day.' : ''}

Create 5 daily studies. For EACH day provide:
1. Clear title
2. Main scripture passage
3. Context and explanation (2-3 paragraphs)
4. 5 ${options.usageSelection === 'Personal Study' ? 'reflection' : 'discussion'} questions
5. Prayer point
6. Action step

CRITICAL: Return ONLY a valid JSON array. No markdown, no code blocks, no extra text.
Do NOT use newlines or special characters in the content strings. Use \\n for line breaks.

Format:
[
  {
    "day": 1,
    "title": "Day Title",
    "passage": "Scripture Reference",
    "content": "Full content with \\n for line breaks"
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw study generation response:', text.substring(0, 500));
    
    const sanitized = sanitizeJSON(text);
    
    if (sanitized) {
      try {
        const parsed = JSON.parse(sanitized);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((study, index) => ({
            day: study.day || (index + 1),
            title: study.title || `Day ${index + 1}`,
            passage: study.passage || 'Scripture Reference',
            content: study.content || 'Study content'
          }));
        }
      } catch (parseError) {
        console.error('Study JSON parse error:', parseError);
      }
    }
    
    // Fallback: generate simple studies
    console.warn('Could not parse AI-generated studies, using template');
    return generateFallbackStudies(themes, scriptures, options);
    
  } catch (error) {
    console.error('Gemini generation error:', error);
    return generateFallbackStudies(themes, scriptures, options);
  }
}

// Fallback study generator
function generateFallbackStudies(themes, scriptures, options) {
  const days = ['Understanding the Foundation', 'Deeper Exploration', 'Practical Application', 'Living It Out', 'Final Reflections'];
  
  return days.map((title, index) => ({
    day: index + 1,
    title: title,
    passage: scriptures[index] || scriptures[0] || 'Matthew 28:19-20',
    content: `# Day ${index + 1}: ${title}

## Introduction
Welcome to Day ${index + 1} of your study on ${themes.join(', ')}.

## Today's Scripture: ${scriptures[index] || scriptures[0] || 'Matthew 28:19-20'}

Study this passage and reflect on its meaning in your life.

## ${options.usageSelection === 'Personal Study' ? 'Reflection' : 'Discussion'} Questions

1. What does this passage teach about ${themes[0] || 'faith'}?
2. How can you apply this to your daily life?
3. What challenges do you face in living this out?
4. How does this connect to other biblical teachings?
5. What action will you take this week?

## Prayer Point
Lord, help me understand and apply Your Word in my life.

${options.includeActionSteps ? '\n## Action Step\nChoose one truth from today and put it into practice.\n' : ''}
${options.includeMemoryVerses ? '\n## Memory Verse\n' + (scriptures[index] || scriptures[0] || 'Matthew 28:19-20') + '\n' : ''}
`
  }));
}