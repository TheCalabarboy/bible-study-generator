export function extractVideoId(url) {
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
  // Try multiple methods to get video info
  
  // Method 1: Try oEmbed API with no-cors mode (won't get response but validates video exists)
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
  // This allows the app to continue even if we can't fetch metadata
  return {
    title: `YouTube Video (${videoId})`,
    author: 'YouTube Creator',
    thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    duration: 0
  };
}

export function validateYouTubeUrl(url) {
  const videoId = extractVideoId(url);
  return videoId !== null;
}