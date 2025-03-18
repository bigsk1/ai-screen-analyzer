// src/components/ImageAnalysis.js
import React, { useState, useRef, useEffect } from 'react';
import { analyzeImage, getOllamaModels, isImageCapableModel } from '../utils/aiServices';
import { 
  ArrowPathIcon, 
  CheckIcon,
  CloudIcon,
  CpuChipIcon,
  ChevronUpDownIcon,
  DocumentMagnifyingGlassIcon, 
  ExclamationCircleIcon,
  XMarkIcon,
  PhotoIcon,
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ModelSelector = ({ selectedModel, onSelectModel, ollamaModel, setOllamaModel, ollamaModels, isOpen, onClose, buttonRect }) => {
  const [selectedTab, setSelectedTab] = useState(selectedModel);
  const selectorRef = useRef(null);

  // Position the selector properly when it opens
  useEffect(() => {
    if (isOpen && buttonRect && selectorRef.current) {
      // Position the dropdown relative to the button
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const spaceBelow = windowHeight - buttonRect.bottom;
      
      // Determine if the dropdown should appear above or below the button
      if (spaceBelow < 350 && buttonRect.top > 350) {
        selectorRef.current.style.bottom = `${windowHeight - buttonRect.top + 8}px`;
        selectorRef.current.style.top = 'auto';
      } else {
        selectorRef.current.style.top = `${buttonRect.bottom + 8}px`;
        selectorRef.current.style.bottom = 'auto';
      }

      // Position horizontally - align with button
      const leftSpace = buttonRect.left;
      const rightSpace = windowWidth - buttonRect.right;
      
      if (leftSpace < 150 && rightSpace > 200) {
        // Align left edge with button left
        selectorRef.current.style.left = `${buttonRect.left}px`;
        selectorRef.current.style.right = 'auto';
      } else {
        // Align right edge with button right
        selectorRef.current.style.right = `${windowWidth - buttonRect.right}px`;
        selectorRef.current.style.left = 'auto';
      }
      
      selectorRef.current.style.width = '280px';
      selectorRef.current.style.zIndex = '9999';
    }
  }, [isOpen, buttonRect]);

  if (!isOpen) return null;

  // Filter Ollama models to only show image-capable ones for image analysis
  const imageCapableModels = ollamaModels.filter(model => isImageCapableModel(model.name));
  
  const handleModelSelection = (modelType, modelName = null) => {
    onSelectModel(modelType, modelName);
    onClose();
  };

  return (
    <div 
      ref={selectorRef}
      className="fixed animate-slide-down bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 overflow-hidden model-selector-dropdown"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-700">
        <h3 className="font-medium">Select AI Model</h3>
        <button 
          onClick={onClose}
          className="p-1 rounded-full hover:bg-neutral-700"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      <div className="p-2 border-b border-neutral-700">
        <div className="flex space-x-1">
          <button
            className={`flex-1 py-2 px-3 text-sm rounded-md ${
              selectedTab === 'openai' 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-neutral-700'
            }`}
            onClick={() => setSelectedTab('openai')}
          >
            OpenAI
          </button>
          <button
            className={`flex-1 py-2 px-3 text-sm rounded-md ${
              selectedTab === 'anthropic' 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-neutral-700'
            }`}
            onClick={() => setSelectedTab('anthropic')}
          >
            Claude
          </button>
          <button
            className={`flex-1 py-2 px-3 text-sm rounded-md ${
              selectedTab === 'ollama' 
                ? 'bg-primary-600 text-white' 
                : 'hover:bg-neutral-700'
            }`}
            onClick={() => setSelectedTab('ollama')}
          >
            Ollama
          </button>
        </div>
      </div>

      <div className="p-4 max-h-[300px] overflow-y-auto scrollbar-styled">
        {selectedTab === 'openai' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-700 bg-neutral-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-medium">
                  GPT
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">GPT-4o</h4>
                  <p className="text-xs text-neutral-400">Advanced vision & reasoning</p>
                </div>
              </div>
              <button
                onClick={() => handleModelSelection('openai')}
                className={`p-1.5 rounded-full ${
                  selectedModel === 'openai' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                }`}
              >
                {selectedModel === 'openai' ? (
                  <CheckIcon className="h-4 w-4" />
                ) : null}
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'anthropic' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-700 bg-neutral-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium">
                  C3
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium">Claude 3</h4>
                  <p className="text-xs text-neutral-400">Balanced with nuance</p>
                </div>
              </div>
              <button
                onClick={() => handleModelSelection('anthropic')}
                className={`p-1.5 rounded-full ${
                  selectedModel === 'anthropic' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                }`}
              >
                {selectedModel === 'anthropic' ? (
                  <CheckIcon className="h-4 w-4" />
                ) : null}
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'ollama' && (
          <div className="space-y-2">
            {imageCapableModels.length > 0 ? (
              imageCapableModels.map((model) => (
                <div 
                  key={model.name}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-700 bg-neutral-800"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
                      🦙
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium">{model.name}</h4>
                      <p className="text-xs text-neutral-400">Vision-capable local model</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleModelSelection('ollama', model.name)}
                    className={`p-1.5 rounded-full ${
                      selectedModel === 'ollama' && ollamaModel === model.name
                        ? 'bg-primary-600 text-white' 
                        : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                    }`}
                  >
                    {selectedModel === 'ollama' && ollamaModel === model.name ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : null}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 px-3">
                <ExclamationTriangleIcon className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                <p className="text-sm text-neutral-300 mb-1">No vision-capable Ollama models found</p>
                <p className="text-xs text-neutral-400 mb-3">Make sure you have a vision model like llava installed</p>
                <a 
                  href="https://ollama.com/library/llava" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary-400 hover:text-primary-300 underline"
                >
                  Learn how to install vision models
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ImageAnalysis = ({ capture, onAnalysis, onClear }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [ollamaModel, setOllamaModel] = useState('');
  const [ollamaModels, setOllamaModels] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSelectorButtonRect, setModelSelectorButtonRect] = useState(null);
  const modelSelectorButtonRef = useRef(null);
  const textareaRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Clear analysis when capture changes
    if (capture) {
      setAnalysisResult('');
      setError(null);
    }
  }, [capture]);

  // Fetch Ollama models when component mounts
  useEffect(() => {
    const fetchOllamaModels = async () => {
      try {
        const models = await getOllamaModels();
        setOllamaModels(models);
        
        // Find the first vision-capable model
        const visionModels = models.filter(model => isImageCapableModel(model.name));
        if (visionModels.length > 0) {
          setOllamaModel(visionModels[0].name);
        } else {
          // If no vision models, default to first model but display warning when selected
          setOllamaModel(models.length > 0 ? models[0].name : '');
        }
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      }
    };
    
    fetchOllamaModels();
  }, []);
  
  // Set up drag and drop handlers
  useEffect(() => {
    if (!dropZoneRef.current) return;
    
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };
    
    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };
    
    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };
    
    const dropZone = dropZoneRef.current;
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  // Set up clipboard paste handler for the whole component
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            handleFiles([file]);
            e.preventDefault();
            break;
          }
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);
  
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      
      // Create a capture object similar to screen captures
      const uploadedCapture = {
        id: Date.now(),
        dataUrl: imageData,
        timestamp: new Date().toISOString(),
        source: 'upload'
      };
      
      // Set the uploaded image
      setUploadedImage(uploadedCapture);
      
      // Clear any previous errors
      setError(null);
    };
    
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };
  
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle model selector visibility
  const toggleModelSelector = () => {
    if (!showModelSelector && modelSelectorButtonRef.current) {
      const rect = modelSelectorButtonRef.current.getBoundingClientRect();
      setModelSelectorButtonRect(rect);
    }
    setShowModelSelector(!showModelSelector);
  };

  // Select a model
  const handleModelSelection = (modelType, modelName = null) => {
    setSelectedModel(modelType);
    if (modelType === 'ollama' && modelName) {
      setOllamaModel(modelName);
    }
    setShowModelSelector(false);
  };

  // Handle analysis
  const handleAnalysis = async () => {
    if (!capture && !uploadedImage) {
      setError('No image available for analysis');
      return;
    }
    
    // Check if using Ollama model that might not support vision
    if (selectedModel === 'ollama' && !isImageCapableModel(ollamaModel)) {
      setError(`The Ollama model "${ollamaModel}" may not support image analysis. Consider using llava or another vision-capable model.`);
      return;
    }
    
    // Use either the captured screenshot or uploaded image
    const imageToAnalyze = uploadedImage || capture;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(
        imageToAnalyze.dataUrl,
        selectedModel,
        customPrompt || 'Describe what you see in this image in detail.',
        '', // No context for direct analysis
        selectedModel === 'ollama' ? ollamaModel : undefined
      );
      
      setAnalysisResult(result);
      if (onAnalysis) {
      onAnalysis(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle clearing the analysis
  const handleClear = () => {
    setCustomPrompt('');
    setAnalysisResult('');
    setError(null);
    setUploadedImage(null);
    
    if (onClear) {
    onClear();
    }
  };

  // Effect to track clicks outside the model selector
  useEffect(() => {
    if (!showModelSelector) return;

    const handleClickOutside = (event) => {
      if (modelSelectorButtonRef.current && 
          !modelSelectorButtonRef.current.contains(event.target) &&
          !event.target.closest('.model-selector-dropdown')) {
        setShowModelSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModelSelector]);

  return (
    <div ref={dropZoneRef} className={`card animate-fade-in ${isDragging ? 'border-primary-500 bg-primary-500/10' : ''}`}>
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-50 rounded-xl">
          <div className="text-center p-6">
            <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-primary-400 mb-2" />
            <p className="text-xl font-medium text-white">Drop image to upload</p>
            <p className="text-sm text-neutral-400 mt-1">Upload image to analyze</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-neutral-100">Image Analysis</h2>
        
        <div className="flex space-x-3">
          {/* File upload input (hidden) */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
          
          {/* Upload image button */}
            <button 
            onClick={handleUploadClick}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-300 hover:bg-neutral-700"
            title="Upload image"
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            </button>
          
          <div className="relative">
            <button 
              ref={modelSelectorButtonRef}
              onClick={toggleModelSelector}
              className="flex items-center px-2.5 py-1.5 rounded-md border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-sm"
            >
              {selectedModel === 'openai' ? (
                <CloudIcon className="h-4 w-4 mr-1.5 text-emerald-500" />
              ) : selectedModel === 'anthropic' ? (
                <CloudIcon className="h-4 w-4 mr-1.5 text-amber-500" />
              ) : (
                <CpuChipIcon className="h-4 w-4 mr-1.5 text-neutral-400" />
              )}
              
              <span className="mr-1">
                {selectedModel === 'openai' 
                  ? 'GPT-4o' 
                  : selectedModel === 'anthropic' 
                    ? 'Claude' 
                    : ollamaModel}
              </span>
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </button>
            
            <ModelSelector 
              selectedModel={selectedModel}
              onSelectModel={handleModelSelection}
              ollamaModel={ollamaModel}
              setOllamaModel={setOllamaModel}
              ollamaModels={ollamaModels}
              isOpen={showModelSelector}
              onClose={() => setShowModelSelector(false)}
              buttonRect={modelSelectorButtonRect}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-5">
        {(capture || uploadedImage) ? (
          <div className="rounded-lg overflow-hidden bg-black border border-neutral-700">
            <img 
              src={(uploadedImage || capture).dataUrl} 
              alt="Captured Screenshot" 
              className="w-full h-auto max-h-[350px] object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-neutral-800 rounded-lg border border-neutral-700 border-dashed">
            <div className="text-center p-6">
              <PhotoIcon className="h-10 w-10 mx-auto text-neutral-600 mb-3" />
              <p className="text-neutral-400">
                {isDragging 
                  ? "Drop image here" 
                  : "No image available. Capture a screenshot or paste an image (Ctrl+V)"}
              </p>
              <button
                onClick={handleUploadClick}
                className="mt-4 px-4 py-2 text-sm bg-neutral-700 hover:bg-neutral-600 rounded-md inline-flex items-center"
              >
                <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                Upload Image
              </button>
            </div>
            </div>
          )}
        
        <div className="mt-3">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask a question about the image or leave blank for a general description..."
              className="w-full p-3.5 border border-neutral-700 bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none scrollbar-styled"
              rows={2}
              disabled={!capture && !uploadedImage}
            />
          </div>
        </div>
        
        {error && (
          <div className="p-4 rounded-lg bg-danger-500/20 border border-danger-700 text-danger-200 flex items-start">
            <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {analysisResult && (
          <div className="p-4 rounded-lg border border-neutral-700 bg-neutral-800/50 shadow-sm">
            <div className="flex items-center text-xs text-primary-400 mb-3">
              <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-1" />
              <span>Analysis results</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{analysisResult}</p>
            </div>
          </div>
        )}
        
        <div className="flex space-x-3 pt-1">
          <button
            onClick={handleAnalysis}
            disabled={isAnalyzing || (!capture && !uploadedImage)}
            className="flex-grow flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {isAnalyzing ? (
              <>
                <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Analyze Image
              </>
            )}
          </button>
          
          <button
            onClick={handleClear}
            disabled={!capture && !uploadedImage && !analysisResult}
            className="px-4 py-2.5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;