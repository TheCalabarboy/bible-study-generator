import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeVideoForBiblicalContent(videoTitle, videoDescription) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// In generateBibleStudy function
const prompt = `
You are a Christian pastor and Bible study author. Create a detailed 5-day Bible study guide based on this sermon.

Video Title: ${videoTitle}
Main Themes: ${themes.join(', ')}
Scripture References: ${scriptures.join(', ')}
Study Type: ${options.usageSelection}
Session Length: ${options.sessionLength}
Start Date: ${options.startDate || 'Not specified'}

${options.includeDeeperAnalysis ? 'INCLUDE: Greek/Hebrew word studies and historical/cultural context for key terms.' : ''}
${options.includeMemoryVerses ? 'INCLUDE: One memory verse for each day.' : ''}
${options.includeActionSteps ? 'INCLUDE: Specific, practical action steps for each day.' : ''}

// ... rest of your prompt
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
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