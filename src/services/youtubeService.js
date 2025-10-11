export function extractVideoId(url) {
  // Remove any whitespace
  url = url.trim();
  
  // Comprehensive patterns for all YouTube URL formats
  const patterns = [
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    
    // Shortened URL: youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    
    // Embed URL: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    
    // Live URL: youtube.com/live/VIDEO_ID
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    
    // Watch URL with multiple parameters: youtube.com/watch?v=VIDEO_ID&other=params
    /(?:youtube\.com\/watch\?.*?v=)([a-zA-Z0-9_-]{11})/,
    
    // Mobile URL: m.youtube.com/watch?v=VIDEO_ID
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    
    // Mobile shortened: m.youtube.com/VIDEO_ID
    /(?:m\.youtube\.com\/)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      // Video IDs are always 11 characters
      const videoId = match[1];
      if (videoId.length === 11) {
        return videoId;
      }
    }
  }
  
  return null;
}

export async function getVideoInfo(videoId) {
  // Try multiple methods to get video info
  
  // Method 1: Try oEmbed API
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title,
        author: data.author_name,
        thumbnail: data.thumbnail_url,
        duration: 0
      };
    }
  } catch (error) {
    console.log('oEmbed failed, using fallback:', error);
  }
  
  // Method 2: Fallback - extract from URL and return basic info
  return {
    title: `YouTube Video (${videoId})`,
    author: 'YouTube Creator',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: 0
  };
}

export function validateYouTubeUrl(url) {
  // Must contain youtube.com or youtu.be
  const isYouTubeUrl = url.includes('youtube.com') || url.includes('youtu.be');
  
  if (!isYouTubeUrl) {
    return false;
  }
  
  // Must be able to extract a valid video ID
  const videoId = extractVideoId(url);
  return videoId !== null && videoId.length === 11;
}

// Helper function to strip timestamps and parameters (for display purposes)
export function cleanYouTubeUrl(url) {
  const videoId = extractVideoId(url);
  if (!videoId) return url;
  
  // Return clean watch URL without timestamps
  return `https://www.youtube.com/watch?v=${videoId}`;
}