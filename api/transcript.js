// Vercel Serverless Function for YouTube Transcript
// Fetches transcripts server-side to avoid CORS issues

import { YoutubeTranscript } from 'youtube-transcript';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { videoId } = req.body;

    if (!videoId) {
      return res.status(400).json({ error: 'Missing videoId' });
    }

    const items = await YoutubeTranscript.fetchTranscript(videoId);
    const fullText = items.map(i => i.text).join(' ').replace(/s+/g, ' ').trim();

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json({
      ok: true,
      text: fullText,
      items: items
    });

  } catch (error) {
    console.error('Transcript fetch error:', error);

    // Set CORS headers even on error
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json({
      ok: false,
      text: '',
      error: error.message
    });
  }
}
