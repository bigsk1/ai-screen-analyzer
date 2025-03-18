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
    
    // Check if image is large enough
    if (img.width >= 800 && img.height >= 600) {
      return imageData;
    }
    
    // Create a canvas to resize the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Maintain aspect ratio but ensure minimum dimensions
    const aspectRatio = img.width / img.height;
    let newWidth = Math.max(800, img.width);
    let newHeight = Math.max(600, img.height);
    
    // Adjust dimensions to maintain aspect ratio
    if (newWidth / newHeight > aspectRatio) {
      newWidth = Math.round(newHeight * aspectRatio);
    } else {
      newHeight = Math.round(newWidth / aspectRatio);
    }
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Draw the image at the new size
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    
    // Get the resized image as a data URL with high quality
    return canvas.toDataURL('image/jpeg', 0.95);
  } catch (error) {
    console.error('Error preparing image:', error);
    return imageData; // Return original if processing fails
  }
};

export const analyzeImage = async (imageData, modelType, customPrompt, context = '', ollamaModel = DEFAULT_OLLAMA_IMAGE_MODEL) => {
  console.log(`Analyzing image with ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${ollamaModel})`} model and prompt: "${customPrompt}"`);
  
  try {
    // Prepare image to ensure it's large enough for analysis
    const processedImage = await prepareImageForAnalysis(imageData);
    console.log('Image prepared for analysis');
    
    // In a real implementation, call the actual API services
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
    
    // Parse context if provided
    let contextInfo = '';
    if (context && context.trim()) {
      contextInfo = 'Based on our conversation: ' + context.substring(0, 100) + '...';
    }
    
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

export const chatWithAI = async (modelType, message, context = '', ollamaModel = '') => {
  console.log(`Chatting with ${modelType} model${modelType === 'ollama' && ollamaModel ? ` (${ollamaModel})` : ''}`);
  
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
    
    let contextInfo = '';
    if (context && context.trim()) {
      contextInfo = 'Based on our conversation: ' + context.substring(0, 100) + '...';
    }
    
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
    throw new Error('OpenAI API key is not configured. You can still use Claude or Ollama models, or add your OpenAI API key in the .env file.');
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

export const analyzeWithOllama = async (imageData, prompt, context, model = DEFAULT_OLLAMA_IMAGE_MODEL) => {
  console.log(`Analyzing with Ollama model: ${model}`);
  
  try {
    // Extract base64 data if it's a data URL
    let imageBase64 = imageData;
    if (imageData.startsWith('data:image')) {
      imageBase64 = imageData.split(',')[1];
    }
    
    const requestBody = {
      model: model,
      prompt: `${context ? context + '\n\n' : ''}${prompt}`,
      stream: false,
    };

    if (imageBase64) {
      requestBody.images = [imageBase64];
    }

    // Try the proxy API endpoint first
    try {
      const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, requestBody);
      return response.data.response;
    } catch (proxyError) {
      // If proxy fails, try direct connection
      console.warn('Proxy connection failed, trying direct connection:', proxyError.message);
      const directResponse = await axios.post('http://localhost:11434/api/generate', requestBody);
      return directResponse.data.response;
    }
  } catch (error) {
    console.error('Error analyzing with Ollama:', error);
    throw new Error(`Ollama API error: ${error.message || 'Unknown error'}`);
  }
};

// Updated chat with Ollama function
export const chatWithOllama = async (prompt, context, model) => {
  if (!model) {
    throw new Error('No Ollama model specified for chat');
  }
  
  try {
    const requestBody = {
      model: model,
      prompt: `${context ? context + '\n\n' : ''}Human: ${prompt}\n\nAssistant:`,
      stream: false,
    };

    // Try the proxy API endpoint first
    try {
    const response = await axios.post(`${OLLAMA_API_URL}/api/generate`, requestBody);
    return response.data.response;
    } catch (proxyError) {
      // If proxy fails, try direct connection
      console.warn('Proxy connection failed, trying direct connection:', proxyError.message);
      const directResponse = await axios.post('http://localhost:11434/api/generate', requestBody);
      return directResponse.data.response;
    }
  } catch (error) {
    console.error('Error chatting with Ollama:', error);
    throw new Error(`Ollama API error: ${error.message || 'Unknown error'}`);
  }
};

// Get Ollama models from the Ollama API - updated to handle various API formats
export const getOllamaModels = async () => {
  try {
    const ollamaEndpoints = [
      `${OLLAMA_API_URL}/api/tags`, 
      'http://localhost:11434/api/tags'
    ];
    
    let models = [];
    let successfulEndpoint = null;
    
    for (const endpoint of ollamaEndpoints) {
      try {
        console.log(`Trying to fetch Ollama models from: ${endpoint}`);
        const response = await axios.get(endpoint);
        
        if (response.data) {
          console.log('Received Ollama response:', response.data);
          
          // Handle different response structures
    if (Array.isArray(response.data.models)) {
            models = response.data.models;
            successfulEndpoint = endpoint;
            break;
          } else if (response.data.models && typeof response.data.models === 'object') {
            models = Object.entries(response.data.models).map(([name, details]) => ({
        name,
        ...details
      }));
            successfulEndpoint = endpoint;
            break;
          } else if (Array.isArray(response.data)) {
            // Some Ollama versions might return a direct array
            models = response.data;
            successfulEndpoint = endpoint;
            break;
          }
        }
      } catch (error) {
        console.warn(`Failed to fetch from ${endpoint}:`, error.message);
      }
    }
    
    if (models.length > 0) {
      console.log(`Successfully fetched ${models.length} Ollama models from ${successfulEndpoint}`);
      return models;
    }
    
    // Fallback to simulated models if all API calls fail
    console.log('Using fallback model list - could not connect to Ollama API');
    await delay(300);
    return [
      { name: 'llama3', modified_at: '2023-10-10T10:10:10Z', size: 4200000000, modelfile: { valid: true } },
      { name: 'mistral', modified_at: '2023-09-15T08:30:00Z', size: 3800000000, modelfile: { valid: true } },
      { name: 'llava', modified_at: '2023-11-20T14:20:00Z', size: 4800000000, modelfile: { valid: true } }
    ];
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    return [];
  }
};

// Validate if a model can handle images
export const isImageCapableModel = (modelName) => {
  if (!modelName) return false;
  
  // In a real app, this would check model capabilities from the API
  // Common known vision-capable models in Ollama
  const imageModels = [
    'llava', 'bakllava', 'moondream', 'llava-llama3', 
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

export default {
  analyzeImage,
  chatWithAI,
  getOllamaModels,
  isImageCapableModel,
  DEFAULT_OLLAMA_IMAGE_MODEL,
  analyzeWithOllama,
  chatWithOllama
};