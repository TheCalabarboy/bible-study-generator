// Vercel Serverless Function for Gemini API
// This keeps the API key server-side only

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with server-side environment variable (not VITE_ prefixed)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-pro';

// CORS headers for the response
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
    const { action, payload } = req.body;

    if (!action || !payload) {
      return res.status(400).json({ error: 'Missing action or payload' });
    }

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        maxOutputTokens: payload.maxOutputTokens || 8192,
        temperature: payload.temperature || 0.7,
        ...(payload.responseMimeType && { responseMimeType: payload.responseMimeType }),
        ...(payload.responseSchema && { responseSchema: payload.responseSchema }),
      }
    });

    const result = await generateWithRetry(model, {
      systemInstruction: payload.systemInstruction,
      generationConfig: model.generationConfig,
      contents: payload.contents
    });

    const responseText = result.response.text();

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(200).json({
      success: true,
      text: responseText
    });

  } catch (error) {
    console.error('Gemini API error:', error);

    const status = extractStatus(error);

    // Set CORS headers even on error
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    return res.status(status || 500).json({
      error: error.message || 'Internal server error',
      status: status
    });
  }
}

// Helper: Extract HTTP status from error
function extractStatus(err) {
  if (!err) return undefined;
  if (typeof err.status === 'number') return err.status;
  if (err.response?.status) return err.response.status;
  const message = err.message || '';
  const match = message.match(/\[(\d{3})\]/);
  if (match) return Number(match[1]);
  return undefined;
}

// Helper: Retry with exponential backoff
async function generateWithRetry(model, request, maxAttempts = 3, initialDelay = 800) {
  let attempt = 0;
  let delay = initialDelay;

  while (attempt < maxAttempts) {
    try {
      return await model.generateContent(request);
    } catch (err) {
      const status = extractStatus(err);
      const retriable = status === 429 || status === 503;
      attempt += 1;

      if (!retriable || attempt >= maxAttempts) {
        throw err;
      }

      console.warn(
        `Gemini request failed with status ${status}. Retrying in ${delay}ms (attempt ${attempt}/${maxAttempts}).`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
