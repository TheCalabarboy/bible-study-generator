import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeVideoForBiblicalContent(videoTitle, videoDescription) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = `
You are a biblical content analyzer. Analyze this YouTube video and determine if it's a Christian biblical teaching, sermon, or preaching.

Video Title: ${videoTitle}
Video Description: ${videoDescription}

You MUST respond with ONLY a valid JSON object in this exact format (no other text):
{
  "isChristianTeaching": true,
  "confidence": 0.9,
  "reason": "This appears to be a sermon based on the title",
  "mainThemes": ["Faith", "Grace", "Salvation"],
  "scriptureReferences": ["John 3:16", "Romans 8:28"]
}

Be strict - only return isChristianTeaching: true if it's clearly biblical Christian content.
If unsure, provide your best assessment with appropriate confidence level.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Extract JSON from response - handle code blocks
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to find JSON object
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      return {
        isChristianTeaching: parsed.isChristianTeaching ?? true,
        confidence: parsed.confidence ?? 0.7,
        reason: parsed.reason ?? 'Analysis completed',
        mainThemes: Array.isArray(parsed.mainThemes) ? parsed.mainThemes : ['Faith', 'Scripture'],
        scriptureReferences: Array.isArray(parsed.scriptureReferences) ? parsed.scriptureReferences : ['Matthew 28:19-20']
      };
    }
    
    // If no JSON found, return safe defaults
    console.warn('Could not parse JSON from Gemini, using defaults');
    return {
      isChristianTeaching: true,
      confidence: 0.7,
      reason: 'Could not parse AI response, proceeding with generation',
      mainThemes: ['Faith', 'Biblical Teaching', 'Christian Living'],
      scriptureReferences: ['Matthew 28:19-20', 'Romans 12:1-2']
    };
    
  } catch (error) {
    console.error('Gemini analysis error:', error);
    
    // Return safe defaults instead of throwing
    return {
      isChristianTeaching: true,
      confidence: 0.7,
      reason: 'Analysis unavailable, proceeding with generation',
      mainThemes: ['Faith', 'Biblical Teaching', 'Christian Living'],
      scriptureReferences: ['Matthew 28:19-20', 'Romans 12:1-2']
    };
  }
}

export async function generateBibleStudy(videoTitle, videoDescription, themes, scriptures, options) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
You are a Christian pastor and Bible study author. Create a detailed 5-day Bible study guide based on this sermon.

Video Title: ${videoTitle}
Main Themes: ${themes.join(', ')}
Scripture References: ${scriptures.join(', ')}
Study Type: ${options.usageSelection}
Start Date: ${options.startDate || 'Not specified'}

Create 5 daily studies following this EXACT structure for each day:

DAY 1: Focus on the first main theme
DAY 2: Explore related scriptures in depth
DAY 3: Mid-week reflection and application
DAY 4: Deeper theological connections
DAY 5: Personal application and commitment

For EACH day, provide:
1. A clear title (e.g., "Understanding God's Grace")
2. Main scripture passage with full verse text
3. 2-3 paragraphs of context and explanation
4. 5 ${options.usageSelection === 'Personal Study' ? 'reflection' : 'discussion'} questions tailored to ${options.usageSelection}
5. A prayer point
6. An action step

Format as clean text with clear sections. Be reverent, biblically accurate, and pastorally helpful.

Make questions specific to ${options.usageSelection}:
- Personal Study: introspective, individual growth
- Small Group: discussion-oriented, community-focused
- Family Devotions: age-appropriate, family-friendly
- Sharing with Friends: relational, evangelistic

Return the 5 daily studies as a JSON array with this structure:
[
  {
    "day": 1,
    "title": "...",
    "passage": "Scripture Reference",
    "content": "Full markdown content for the day"
  },
  ...
]
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw error;
  }
}