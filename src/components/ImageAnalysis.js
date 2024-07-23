// src/components/ImageAnalysis.js
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../utils/aiServices';

const ImageAnalysis = ({ capture, onAnalysis, onClear, darkMode }) => {
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [customPrompt, setCustomPrompt] = useState('');

  const compressImage = (imageData, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = imageData;
    });
  };

  const handleAnalysis = useCallback(async () => {
    if (!capture) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const prompt = customPrompt || "Analyze this image and describe what you see.";
      const compressedImageData = await compressImage(capture.dataUrl);
      const result = await analyzeImage(compressedImageData, selectedModel, prompt);
      setAnalysis(result);
      onAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setError(error.message || 'An error occurred during analysis');
    }
    setIsAnalyzing(false);
  }, [capture, selectedModel, customPrompt, onAnalysis]);

  const handleClear = () => {
    setAnalysis('');
    setError(null);
    setCustomPrompt('');
    onClear();
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200`}>
      <h2 className="text-xl font-semibold mb-4">Image Analysis</h2>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className={`w-full p-2 rounded mb-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
      >
        <option value="openai">OpenAI</option>
        <option value="anthropic">Anthropic</option>
        <option value="ollama">Ollama (LLaVA)</option>
      </select>
      {capture && (
        <div>
          <img 
            src={capture.dataUrl} 
            alt="Captured screenshot" 
            className="max-w-full mb-2 border border-gray-600"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter your question or prompt about the image (optional)"
            className={`w-full p-2 mb-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
            rows="3"
          />
          <div className="flex space-x-2 mb-2">
            <button 
              onClick={handleAnalysis}
              className={`px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
            <button 
              onClick={handleClear}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Clear
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {analysis && (
            <div className={`mt-2 p-4 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
              <pre className="whitespace-pre-wrap">{analysis}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageAnalysis;