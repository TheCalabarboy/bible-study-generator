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
  // We'll use the oEmbed API (no API key needed!)
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Video not found');
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw new Error('Could not fetch video information. Please check the URL.');
  }
}

export function validateYouTubeUrl(url) {
  const videoId = extractVideoId(url);
  return videoId !== null;
}