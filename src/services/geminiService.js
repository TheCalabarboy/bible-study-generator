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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });

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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-exp' });

  // Customize the prompt based on usage type
  let usageInstructions = '';
  let questionType = 'reflection';
  
  switch(options.usageSelection) {
    case 'Personal Study':
      usageInstructions = `
This study is for PERSONAL DEVOTIONAL use. Include:
- Detailed Summary of the Lesson from the focus scripture
- Deep personal reflection questions
- "I/my/me" language for introspection
- Prayer focuses for individual spiritual growth
- Personal application action steps`;
      questionType = 'personal reflection';
      break;
      
    case 'Small Group':
      usageInstructions = `
This study is for SMALL GROUP DISCUSSION. Include:
- Detailed Summary of the Lesson from the focus scripture
- Discussion questions that spark conversation
- "We/us/our" language for community
- Group activity suggestions
- Questions with multiple perspectives
- Prayer focuses for the group`;
      questionType = 'group discussion';
      break;
      
    case 'Family Devotions':
      usageInstructions = `
This study is for FAMILY DEVOTIONS. Include:
- Detailed Summary of the Lesson from the focus scripture
- Age-appropriate language accessible to children
- Family-friendly illustrations and examples
- "Our family" language
- Questions children can understand and answer
- Family prayer focuses
- Simple action steps the whole family can do together`;
      questionType = 'family discussion';
      break;
      
    case 'Sharing with Friends':
      usageInstructions = `
This study is for SHARING WITH FRIENDS (evangelistic/introductory). Include:
- Detailed Summary of the Lesson from the focus scripture
- Accessible language for those new to faith
- Clear Gospel connections
- Questions that don't assume Bible knowledge
- Welcoming and inviting tone
- Prayer focuses for spiritual seeking`;
      questionType = 'exploratory discussion';
      break;
  }

  const prompt = `
You are a Christian experienced and expert pastor and Bible study author. Create a detailed 5-day Bible study guide following the EXACT structure below.

VIDEO TITLE: ${videoTitle}
MAIN THEMES: ${themes.join(', ')}
KEY SCRIPTURES: ${scriptures.join(', ')}

USAGE TYPE: ${options.usageSelection}
${usageInstructions}

SESSION LENGTH: ${options.sessionLength}
${options.includeDeeperAnalysis ? 'INCLUDE: Greek/Hebrew word studies and historical context in each day.' : ''}
${options.includeMemoryVerses ? 'INCLUDE: One key memory verse for each day.' : ''}
${options.includeActionSteps ? 'INCLUDE: One specific, practical action step for each day.' : ''}

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON - no markdown, no code blocks, no extra text
2. Use \\n\\n for paragraph breaks and \\n for line breaks in content strings
3. Follow the EXACT structure below for each day

REQUIRED 5-DAY STRUCTURE:

DAY 1: FOUNDATION
Focus: Introduce the main theme and establish biblical foundation
Include:
- Brief introduction (2-3 Paragraphs)
- Primary scripture passage with context (Be very thorough)
- 3-4 key theological truths
- 5 ${questionType} questions
- Specific prayer focus
${options.includeMemoryVerses ? '- Memory verse' : ''}
${options.includeActionSteps ? '- Practical action step' : ''}

DAY 2: BIBLICAL CONTEXT
Focus: Explore broader scriptural support and background
Include:
- How this theme appears throughout Scripture (2-3 Paragraphs)
- Old and New Testament connections
- Historical and cultural context
- 5 ${questionType} questions
- Prayer focus for wisdom and insight
${options.includeMemoryVerses ? '- Memory verse' : ''}
${options.includeActionSteps ? '- Practical action step' : ''}

DAY 3: THEOLOGICAL DEPTH
Focus: Dive into doctrinal significance and Gospel connections
Include:
- How this truth relates to the Gospel (2-3 Paragraphs)
- Connection to core Christian doctrine
- Theological implications (Deep Analysis)
${options.includeDeeperAnalysis ? '- Greek/Hebrew word study' : ''}
- 5 ${questionType} questions
- Prayer focus for sound doctrine
${options.includeMemoryVerses ? '- Memory verse' : ''}
${options.includeActionSteps ? '- Practical action step' : ''}

DAY 4: PRACTICAL APPLICATION
Focus: Living out the truth in daily life
Include:
- Concrete ways to apply this teaching (Explore deep truths)
- Real-life scenarios and examples (2-3 Paragraphs)
- Obstacles to application and how to overcome them
- 5 ${questionType} questions focused on obedience
- Prayer focus for transformation
${options.includeMemoryVerses ? '- Memory verse' : ''}
${options.includeActionSteps ? '- Practical action step' : ''}

DAY 5: INTEGRATION & RESPONSE
Focus: Worship, commitment, and moving forward
Include:
- Summary of key learnings from the week (Be very detailed)
- Call to worship and response
- Long-term life integration
- 5 ${questionType} questions about commitment
- Prayer of thanksgiving and dedication
${options.includeMemoryVerses ? '- Memory verse' : ''}
${options.includeActionSteps ? '- Practical action step' : ''}

FORMAT EACH DAY'S CONTENT AS MARKDOWN:
Use this exact structure for each day's "content" field:

# Day [Number]: [Title]\\n\\n## Introduction\\n[2-3 Paragraphs intro]\\n\\n## Scripture Reading: [Reference]\\n[Passage context]\\n\\n## Key Points\\n1. [Point 1]\\n2. [Point 2]\\n3. [Point 3]\\n\\n## ${questionType.charAt(0).toUpperCase() + questionType.slice(1)} Questions\\n1. [Question 1]\\n2. [Question 2]\\n3. [Question 3]\\n4. [Question 4]\\n5. [Question 5]\\n\\n## Prayer Focus\\n[Specific prayer point]${options.includeMemoryVerses ? '\\n\\n## Memory Verse\\n[Verse reference and text]' : ''}${options.includeActionSteps ? '\\n\\n## Action Step\\n[Specific action]' : ''}

RETURN ONLY THIS JSON ARRAY (no markdown, no code blocks):
[
  {
    "day": 1,
    "title": "Foundation: [Engaging Title]",
    "passage": "[Primary Scripture Reference]",
    "content": "[Full formatted content as described above]"
  },
  {
    "day": 2,
    "title": "Biblical Context: [Engaging Title]",
    "passage": "[Scripture Reference]",
    "content": "[Full formatted content]"
  },
  {
    "day": 3,
    "title": "Theological Depth: [Engaging Title]",
    "passage": "[Scripture Reference]",
    "content": "[Full formatted content]"
  },
  {
    "day": 4,
    "title": "Practical Application: [Engaging Title]",
    "passage": "[Scripture Reference]",
    "content": "[Full formatted content]"
  },
  {
    "day": 5,
    "title": "Integration & Response: [Engaging Title]",
    "passage": "[Scripture Reference]",
    "content": "[Full formatted content]"
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