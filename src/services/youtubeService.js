export function extractVideoId(url) {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*?v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export async function getVideoInfo(videoId) {
  // Use YouTube oEmbed API for basic info
  const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  
  try {
    const response = await fetch(oEmbedUrl);
    if (!response.ok) {
      throw new Error('Video not found');
    }
    
    const data = await response.json();
    
    // Get duration using YouTube's iframe API trick
    const duration = await getVideoDuration(videoId);
    
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
      duration: duration // in minutes
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Could not fetch video information. Please check the URL.');
  }
}

async function getVideoDuration(videoId) {
  try {
    // Fetch the video page HTML
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Extract duration from the page metadata
    // Look for "duration" in the JSON-LD structured data
    const durationMatch = html.match(/"lengthSeconds":"(\d+)"/);
    
    if (durationMatch && durationMatch[1]) {
      const seconds = parseInt(durationMatch[1]);
      const minutes = Math.floor(seconds / 60);
      return minutes;
    }
    
    // Fallback: return 0 if we can't determine duration
    // The validation will handle this
    return 0;
  } catch (error) {
    console.error('Duration fetch error:', error);
    return 0;
  }
}

export function validateYouTubeUrl(url) {
  const videoId = extractVideoId(url);
  return videoId !== null;
}