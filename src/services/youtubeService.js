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
  // Use YouTube oEmbed API (CORS-friendly)
  const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  
  try {
    const response = await fetch(oEmbedUrl);
    if (!response.ok) {
      throw new Error('Video not found or is not accessible');
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
      duration: 0 // We'll estimate or skip duration check for now
    };
  } catch (error) {
    console.error('YouTube oEmbed error:', error);
    throw new Error('Could not fetch video information. Please verify the YouTube URL is valid and the video is public.');
  }
}

export function validateYouTubeUrl(url) {
  const videoId = extractVideoId(url);
  return videoId !== null;
}