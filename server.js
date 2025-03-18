// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configure CORS to accept requests from the frontend in the same container
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'anthropic-version'],
  credentials: true
}));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'POST') {
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
  }
  next();
});

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://host.docker.internal:11434';

// Helper function to detect MIME type from data URL
function detectMimeType(dataUrl) {
  if (!dataUrl) return 'image/jpeg'; // Default fallback
  
  try {
    // Extract the MIME type from the data URL
    const matches = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    
    if (matches && matches.length > 1) {
      return matches[1];
    }
    
    // If we can't extract from the header, just return a safe default
    return 'image/jpeg';
  } catch (error) {
    console.warn('Error detecting MIME type:', error.message);
    return 'image/jpeg';
  }
}

// Ollama routes
app.get('/ollama/api/tags', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Ollama tags:', error.message);
    res.status(500).json({ error: 'Failed to fetch Ollama tags' });
  }
});

app.post('/ollama/api/generate', async (req, res) => {
  try {
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error generating Ollama response:', error.message);
    res.status(500).json({ error: 'Failed to generate Ollama response' });
  }
});

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20240620";

app.post('/api/anthropic', async (req, res) => {
  try {
    console.log('Anthropic API request received');
    const { prompt, imageData, context } = req.body;
    
    console.log(`Prompt: "${prompt?.substring(0, 50)}${prompt?.length > 50 ? '...' : ''}"`);
    console.log(`Context length: ${context?.length || 0} characters`);
    console.log(`Image data: ${imageData ? 'Present' : 'Not present'}`);

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Anthropic API key not configured');
      return res.status(400).json({ 
        error: 'Anthropic API key not configured',
        details: 'Please add your Anthropic API key to the .env file'
      });
    }

    if (!process.env.ANTHROPIC_MODEL) {
      console.error('Anthropic model not configured');
      return res.status(400).json({ 
        error: 'Anthropic model not configured',
        details: 'Please specify the Anthropic model in the .env file'
      });
    }

    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: process.env.ANTHROPIC_MODEL,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: context ? `${context}\n\n${prompt}` : prompt },
                ...(imageData ? [{
                  type: 'image',
                  source: {
                    type: 'base64',
                    media_type: detectMimeType(imageData),
                    data: imageData.split(',')[1]
                  }
                }] : [])
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      console.log('Anthropic API response received:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
      res.json(response.data);
    } catch (apiError) {
      console.error('Anthropic API error:', apiError.response?.data || apiError.message);
      
      // Check for specific API errors
      if (apiError.response?.status === 401) {
        return res.status(400).json({
          error: 'Invalid Anthropic API key',
          details: 'Please check your Anthropic API key in the .env file'
        });
      } else if (apiError.response?.status === 429) {
        return res.status(529).json({
          error: 'Anthropic API rate limit exceeded',
          details: 'Please try again in a few moments'
        });
      }
      
      return res.status(500).json({
        error: 'Anthropic API error',
        details: apiError.response?.data?.error?.message || apiError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Anthropic Model:', ANTHROPIC_MODEL);
  console.log('API Keys loaded:');
  console.log('- Anthropic:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
});