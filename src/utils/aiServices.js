import axios from 'axios';
import { resizeImage } from './imageUtils';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OLLAMA_API_URL = '/ollama';
const BACKEND_URL = 'http://localhost:5000';

export const analyzeImage = async (imageData, model, prompt, context = '') => {
  const resizedImageData = await resizeImage(imageData);
 
  switch (model) {
    case 'openai':
      return analyzeWithOpenAI(resizedImageData, prompt, context);
    case 'anthropic':
      return analyzeWithAnthropic(resizedImageData, prompt, context);
    case 'ollama':
      return analyzeWithOllama(resizedImageData, prompt, context);
    default:
      throw new Error('Invalid model selected');
  }
};

export const chatWithAI = async (model, prompt, context = '', ollamaModel = 'llama3') => {
  switch (model) {
    case 'openai':
      return chatWithOpenAI(prompt, context);
    case 'anthropic':
      return chatWithAnthropic(prompt, context);
    case 'ollama':
      return analyzeWithOllama(null, prompt, context, ollamaModel);
    default:
      throw new Error('Invalid model selected');
  }
};

const analyzeWithOpenAI = async (imageData, prompt, context) => {
  if (!process.env.REACT_APP_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }
  try {
    const messages = [
      { role: "system", content: "You are a helpful assistant that can analyze images and respond to queries about them." },
      { role: "user", content: context }, // Add the context as a user message
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...(imageData ? [{ type: "image_url", image_url: { url: imageData } }] : [])
        ]
      }
    ];
    const response = await axios.post(OPENAI_API_URL, {
      model: imageData ? "gpt-4o" : "gpt-4o-mini",
      messages: messages,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error with OpenAI:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const chatWithOpenAI = async (prompt, context) => {
  return analyzeWithOpenAI(null, prompt, context);
};

const analyzeWithAnthropic = async (imageData, prompt, context) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/anthropic`, {
      prompt,
      imageData,
      context
    });
    return response.data.content[0].text;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('Anthropic API key is not configured');
    }
    console.error('Error with Anthropic:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const chatWithAnthropic = async (prompt, context) => {
  return analyzeWithAnthropic(null, prompt, context);
};

export const analyzeWithOllama = async (imageData, prompt, context, model = 'llava') => {
  try {
    const requestBody = {
      model: model,
      prompt: `${context}\n\nHuman: ${prompt}\n\nAssistant:`,
      stream: false,
    };

    if (imageData) {
      requestBody.images = [imageData.split(',')[1]];
    }

    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, requestBody);
    return response.data.response;
  } catch (error) {
    console.error('Error analyzing with Ollama:', error.message);
    throw error;
  }
};

export const getOllamaModels = async () => {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/api/tags`);
    if (Array.isArray(response.data.models)) {
      return response.data.models;
    } else if (typeof response.data.models === 'object') {
      return Object.entries(response.data.models).map(([name, details]) => ({
        name,
        ...details
      }));
    } else {
      console.error('Unexpected Ollama models response format');
      return [];
    }
  } catch (error) {
    console.error('Error fetching Ollama models:', error.message);
    throw error;
  }
};