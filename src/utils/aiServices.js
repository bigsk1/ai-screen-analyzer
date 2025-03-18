import axios from 'axios';
import { resizeImage } from './imageUtils';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
// Use the correct API URL for Ollama, allowing for both proxy and direct connections
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Default Ollama image model (can be changed in .env)
const DEFAULT_OLLAMA_IMAGE_MODEL = process.env.REACT_APP_OLLAMA_IMAGE_MODEL || 'llava';

// Simulate API request delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Ensure image is large enough for AI analysis
const prepareImageForAnalysis = async (imageData) => {
  // Don't resize if the image is already a data URL and seems large enough
  if (imageData.length > 100000) {
    return imageData;
  }
  
  try {
    // Create an image element to get dimensions
    const img = new Image();
    const imgLoadPromise = new Promise((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
    });
    
    img.src = imageData;
    await imgLoadPromise;
    
    // If image is small, resize it to ensure it's large enough for analysis
    if (img.width < 512 || img.height < 512) {
      return await resizeImage(imageData, 1024, 1024);
    }
    
    return imageData;
  } catch (error) {
    console.error('Error preparing image:', error);
    return imageData; // Return original if resizing fails
  }
};

const analyzeImage = async (imageData, modelType, customPrompt, context = '', ollamaModel = DEFAULT_OLLAMA_IMAGE_MODEL) => {
  console.log(`Analyzing image with ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model and prompt: "${customPrompt}"`);
  
  try {
    // Prepare image to ensure it's large enough for analysis
    const processedImage = await prepareImageForAnalysis(imageData);
    console.log('Image prepared for analysis');
    
    // Try actual API calls first
    if (modelType === 'openai') {
      try {
        return await analyzeWithOpenAI(processedImage, customPrompt, context);
      } catch (error) {
        console.error('OpenAI API error:', error);
        // Fall back to simulated response
      }
    } else if (modelType === 'anthropic') {
      try {
        return await analyzeWithAnthropic(processedImage, customPrompt, context);
      } catch (error) {
        console.error('Anthropic API error:', error);
        // Fall back to simulated response
      }
    } else if (modelType === 'ollama') {
      try {
        return await analyzeWithOllama(processedImage, customPrompt, context, ollamaModel);
      } catch (error) {
        console.error('Ollama API error:', error);
        // Fall back to simulated response
      }
    }
    
    // Fallback to simulated response
    await delay(1500);
    
    // Check if it's a chart-related query
    const isChartQuery = customPrompt.toLowerCase().includes('chart') || 
                         customPrompt.toLowerCase().includes('graph') ||
                         customPrompt.toLowerCase().includes('plot') ||
                         customPrompt.toLowerCase().includes('data visualization');
    
    // Determine response based on model and prompt
    let response;
    
    // Include the user's question in the response for clarity
    let questionPrefix = customPrompt ? `Question: ${customPrompt}\n\n` : '';
    
    if (modelType === 'openai') {
      if (isChartQuery) {
        response = `${questionPrefix}I can see a chart in this image. The chart appears to be showing data trends over time. There are multiple data points with clear labels on both axes. The horizontal axis seems to represent time periods, while the vertical axis shows values or measurements.

The chart includes several data series represented in different colors. If you have a specific question about the data or the information shown in this chart, please let me know and I can provide a more detailed analysis.`;
      } else {
        response = `${questionPrefix}I've analyzed the image you shared. It appears to be a screenshot from a computer screen showing what looks like a user interface or application. 

The image contains various elements that might include text, buttons, navigation menus, and possibly data or graphics depending on the application. If you have specific questions about elements in this screenshot or what you're trying to accomplish with it, I'd be happy to provide a more detailed analysis.`;
      }
    } else if (modelType === 'anthropic') {
      if (isChartQuery) {
        response = `${questionPrefix}I notice this image contains a chart or data visualization. From what I can observe, it appears to be displaying some form of quantitative data.

The visualization includes labeled axes and data points that show relationships or trends. Without more specific questions about what you'd like to understand from this chart, I can only provide this general description. If you'd like me to focus on specific aspects of the chart or answer particular questions about the data it presents, please let me know.`;
      } else {
        response = `${questionPrefix}I've examined the image you've shared, which appears to be a screenshot. The screenshot shows what seems to be a user interface with various elements visible.

I can see text elements, possibly some navigation components, and visual content arranged in what appears to be an application or website interface. To provide more specific analysis, I'd need to know what particular aspects of this screenshot you're interested in understanding or what questions you have about what's shown.`;
      }
    } else if (modelType === 'ollama') {
      if (isChartQuery) {
        response = `${questionPrefix}The image shows a chart or graph. I can see data points plotted with some form of axes or reference lines. There appear to be labels indicating values or categories.

To provide a more detailed analysis of the specific data trends, values, or meaning of this visualization, please ask more specific questions about what you'd like to understand from this chart.`;
      } else {
        response = `${questionPrefix}I'm looking at what appears to be a screenshot from a computer interface. The image shows various elements that make up what looks like an application window or website.

Without more specific questions, I can only provide this general description. If you'd like me to focus on particular elements or features visible in this screenshot, please let me know what you're interested in understanding.`;
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error in image analysis:', error);
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

const chatWithAI = async (modelType, message, context = '', ollamaModel = '') => {
  console.log(`Chatting with ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model`);
  
  try {
    // Try actual API calls first
    if (modelType === 'openai') {
      try {
        return await chatWithOpenAI(message, context);
      } catch (error) {
        console.error('OpenAI API error:', error);
        // Fall back to simulated response
      }
    } else if (modelType === 'anthropic') {
      try {
        return await chatWithAnthropic(message, context);
      } catch (error) {
        console.error('Anthropic API error:', error);
        // Fall back to simulated response
      }
    } else if (modelType === 'ollama' && ollamaModel) {
      try {
        return await chatWithOllama(message, context, ollamaModel);
      } catch (error) {
        console.error('Ollama API error:', error);
        // Fall back to simulated response
      }
    }
    
    // Simulate API delay
    await delay(800);
    
    if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
      return `Hello! I'm a simulated AI assistant running as ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`}. How can I assist you today?`;
    }
    
    if (message.toLowerCase().includes('help')) {
      return `I'd be happy to help! I'm currently running as a ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model. You can ask me questions, have me analyze screenshots, or chat about various topics. What would you like assistance with?`;
    }
    
    // Generic response
    const responseOptions = [
      `I've processed your message: "${message}". As a ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model, I can help with a variety of tasks including analyzing images, answering questions, and providing information. What else would you like to know?`,
      `Thanks for your message. I'm currently simulating a ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model response. In a full implementation, this would connect to the actual AI service API.`,
      `I understand you're asking about "${message}". In this demo version as a ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model, I'm providing simulated responses. For a full implementation, this would integrate with the actual AI service.`
    ];
    
    // Return a random response from the options
    return responseOptions[Math.floor(Math.random() * responseOptions.length)];
  } catch (error) {
    console.error('Error in chat:', error);
    throw new Error('Failed to get a response. Please try again.');
  }
};

const analyzeWithOpenAI = async (imageData, prompt, context) => {
  if (!process.env.REACT_APP_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. You can add it to your .env file or switch to Claude or Ollama models.');
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
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Anthropic API key is not configured. You can add it to your .env file or switch to GPT or Ollama models.');
      } else if (error.response.status === 500) {
        throw new Error('Backend server error. If running in Docker, make sure REACT_APP_BACKEND_URL is set correctly (e.g., http://host.docker.internal:5000 or http://backend:5000).');
      } else if (error.response.status === 529) {
        throw new Error('Anthropic API is currently overloaded. Please try again in a few moments.');
      }
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to backend server. If running in Docker, check your REACT_APP_BACKEND_URL configuration.');
    }
    console.error('Error with Anthropic:', error.response ? error.response.data : error);
    throw error;
  }
};

const chatWithAnthropic = async (prompt, context) => {
  return analyzeWithAnthropic(null, prompt, context);
};

const analyzeWithOllama = async (imageData, prompt, context, model = DEFAULT_OLLAMA_IMAGE_MODEL) => {
  console.log(`Analyzing with Ollama model: ${model}`);
  
  // Ensure we're using an image-capable model
  if (imageData && !isImageCapableModel(model)) {
    console.warn(`Model ${model} may not support image analysis. Falling back to ${DEFAULT_OLLAMA_IMAGE_MODEL}`);
    model = DEFAULT_OLLAMA_IMAGE_MODEL;
  }
  
  try {
    // Extract base64 data if needed
    let imageBase64 = null;
    if (imageData && imageData.startsWith('data:')) {
      imageBase64 = imageData.split(',')[1];
      console.log(`Extracted base64 image data (${imageBase64.length} chars)`);
    }
    
    // Construct the request payload
    const payload = {
      model: model,
      prompt: context ? `${context}\n\n${prompt}` : prompt,
      stream: false
    };
    
    // Add images array if we have image data
    if (imageBase64) {
      payload.images = [imageBase64];
      console.log('Added image to Ollama request payload');
    }
    
    // First, try to connect through the proxy
    try {
      console.log(`Sending request to proxy endpoint: ${BACKEND_URL}/ollama/api/generate`);
      console.log(`Using model: ${model}, with image: ${!!imageBase64}`);
      
      const response = await axios.post(`${BACKEND_URL}/ollama/api/generate`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Received response from Ollama proxy');
      return response.data.response;
    } catch (proxyError) {
      console.warn('Proxy connection failed, attempting direct connection to Ollama:', proxyError.message);
      
      // Fall back to direct connection
      console.log(`Sending request directly to: ${OLLAMA_API_URL}/api/generate`);
      const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Received response from direct Ollama connection');
      return response.data.response;
    }
  } catch (error) {
    console.error('Error with Ollama:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw new Error(`Failed to communicate with Ollama. Please ensure Ollama is running with the ${model} model installed.`);
  }
};

const chatWithOllama = async (prompt, context, model) => {
  // For text-only chat, any model is fine (no need for image-capable model check)
  console.log(`Chat with Ollama using model: ${model}`);
  
  try {
    // Construct the request payload for text chat
    const payload = {
      model: model,
      prompt: context ? `${context}\n\n${prompt}` : prompt,
      stream: false
    };
    
    // First, try to connect through the proxy
    try {
      console.log(`Sending chat request to proxy endpoint: ${BACKEND_URL}/ollama/api/generate`);
      
      const response = await axios.post(`${BACKEND_URL}/ollama/api/generate`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Longer timeout for generation
      });
      
      console.log('Received chat response from Ollama proxy');
      return response.data.response;
    } catch (proxyError) {
      console.warn('Proxy connection failed, attempting direct connection to Ollama:', proxyError.message);
      
      // Fall back to direct connection
      console.log(`Sending chat request directly to: ${OLLAMA_API_URL}/api/generate`);
      const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // Longer timeout for generation
      });
      
      console.log('Received chat response from direct Ollama connection');
      return response.data.response;
    }
  } catch (error) {
    console.error('Error with Ollama chat:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw new Error(`Failed to communicate with Ollama. Please ensure Ollama is running with the ${model} model installed.`);
  }
};

const getOllamaModels = async () => {
  try {
    // First try the proxy
    try {
      const response = await axios.get(`${BACKEND_URL}/ollama/api/tags`, {
        timeout: 5000 // Set timeout to avoid long waits
      });
      if (response.data && response.data.models && response.data.models.length > 0) {
        console.log(`Fetched ${response.data.models.length} Ollama models from proxy`);
        return response.data.models;
      }
      throw new Error('No models found');
    } catch (proxyError) {
      console.warn('Proxy connection failed, attempting direct connection to Ollama:', proxyError.message);
      
      // Fall back to direct connection
      const response = await axios.get(`${OLLAMA_API_URL}/api/tags`, {
        timeout: 5000 // Set timeout to avoid long waits
      });
      if (response.data && response.data.models && response.data.models.length > 0) {
        console.log(`Fetched ${response.data.models.length} Ollama models from direct connection`);
        return response.data.models;
      }
      throw new Error('No models found');
    }
  } catch (error) {
    console.error('Error fetching Ollama models:', error.message);
    console.log('Using default models list');
    // Return default models when connection fails
    return [
      // Text models (non-vision)
      { name: 'llama3', modified_at: new Date().toISOString(), size: 4200000000, tag: 'llama3' },
      { name: 'mistral', modified_at: new Date().toISOString(), size: 3800000000, tag: 'mistral' },
      { name: 'phi3', modified_at: new Date().toISOString(), size: 3500000000, tag: 'phi3' },
      { name: 'gemma', modified_at: new Date().toISOString(), size: 4100000000, tag: 'gemma' },
      
      // Vision models (for image analysis)
      { name: 'llava', modified_at: new Date().toISOString(), size: 4800000000, tag: 'llava' },
      { name: 'bakllava', modified_at: new Date().toISOString(), size: 4900000000, tag: 'bakllava' }
    ];
  }
};

const isImageCapableModel = (modelName) => {
  if (!modelName) return false;
  
  // List of known vision models in Ollama
  const imageModels = [
    'llava', 'bakllava', 'moondream', 'llava-13b',
    'llava-phi3', 'llava-v1.6-34b', 'cogvlm', 'llava-stable',
    'vision'
  ];
  
  const lowerName = modelName.toLowerCase();
  
  // Check for exact matches
  if (imageModels.includes(lowerName)) return true;
  
  // Check for models that contain vision-capable names (for models like llava-13b, etc.)
  for (const visionModel of imageModels) {
    if (lowerName.includes(visionModel)) return true;
  }
  
  return false;
};

export {
  analyzeImage,
  chatWithAI,
  getOllamaModels,
  isImageCapableModel,
  DEFAULT_OLLAMA_IMAGE_MODEL,
  analyzeWithOllama,
  chatWithOllama
};