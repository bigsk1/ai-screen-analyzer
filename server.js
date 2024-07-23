// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://host.docker.internal:11434';

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
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(400).json({ error: 'Anthropic API key is not configured' });
  }

  try {
    const { prompt, imageData, context } = req.body;
    
    let messages;

    if (imageData) {
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: context + "\n" + prompt },
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageData.split(',')[1] } }
          ]
        }
      ];
    } else {
      messages = [
        { role: "user", content: context + "\n" + prompt }
      ];
    }

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: messages,
    }, {
      headers: {
        'x-api-key': `${process.env.ANTHROPIC_API_KEY}`,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error with Anthropic API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while processing your request', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Anthropic Model:', ANTHROPIC_MODEL);
  console.log('API Keys loaded:');
  console.log('- Anthropic:', process.env.ANTHROPIC_API_KEY ? 'Set' : 'Not set');
});