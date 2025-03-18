// src/components/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import { analyzeImage, chatWithAI, getOllamaModels } from '../utils/aiServices';
import { 
  PaperAirplaneIcon, 
  EllipsisHorizontalIcon,
  TrashIcon,
  CpuChipIcon,
  ArrowPathIcon,
  CloudIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon
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
            {ollamaModels.length > 0 ? (
              ollamaModels.map((model) => (
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
                      <p className="text-xs text-neutral-400">Local model</p>
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
              <div className="text-center py-3 text-neutral-400">
                <p>No Ollama models found</p>
                <p className="text-xs">Make sure Ollama is running locally</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Chat = ({ 
  history, 
  onNewMessage, 
  onUpdateMessage, 
  onResetChatHistory,
  selectedCapture, 
  onClearChat, 
  onNewImageUpload 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [ollamaModel, setOllamaModel] = useState('');
  const [ollamaModels, setOllamaModels] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelSelectorButtonRect, setModelSelectorButtonRect] = useState(null);
  const chatEndRef = useRef(null);
  const [context, setContext] = useState('');
  const [captureData, setCaptureData] = useState(null);
  const inputRef = useRef(null);
  const modelSelectorButtonRef = useRef(null);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedImage, setPastedImage] = useState(null);

  // Update context when history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setContext(history.map(msg => `${msg.role}: ${msg.content}`).join('\n'));
  }, [history]);

  // Update captureData when selectedCapture changes
  useEffect(() => {
    if (selectedCapture && selectedCapture !== captureData) {
      setCaptureData(selectedCapture);
      
      // If we have a new capture and no recent welcome message, add a system message
      if (history.length === 0 || history[history.length - 1].role !== 'assistant' || 
          history[history.length - 1].content.includes('How can I assist')) {
        const systemMsg = { 
          role: 'system', 
          content: "A new screenshot has been attached. You can ask questions about it." 
        };
        
        // Add attachment notification to chat
        const assistantMsg = {
          role: 'assistant',
          content: "I'm ready to discuss the screenshot you've attached. What would you like to know about it?",
          hasImage: true,
          timestamp: new Date().toISOString()
        };
        
        onNewMessage(systemMsg);
        onNewMessage(assistantMsg);
      }
    }
  }, [selectedCapture, captureData, history, onNewMessage]);

  // Set up drag and drop handlers
  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

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
    
    // Add drag and drop event listeners
    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    return () => {
      // Clean up
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);
  
  // Set up clipboard paste handler
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        // Look for image content in clipboard
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            handleFiles([file]);
            // Prevent default paste behavior in the textarea
            e.preventDefault();
            break;
          }
        }
      }
    };
    
    // Add paste event listener to document
    document.addEventListener('paste', handlePaste);
    
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  // Process files (from drag-drop or clipboard)
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
      
      // Now we can process this capture
      if (typeof onNewImageUpload === 'function') {
        onNewImageUpload(uploadedCapture);
      }
      
      // Add message to show uploaded image
      const systemMsg = { 
        role: 'system', 
        content: "An image has been uploaded. You can ask questions about it." 
      };
      
      const userMsg = {
        role: 'user',
        content: 'I\'ve uploaded an image.',
        hasImage: true,
        imageData: imageData
      };
      
      // Add messages to chat
      onNewMessage(systemMsg);
      onNewMessage(userMsg);
      
      // Reset UI state
      setPastedImage(imageData);
    };
    
    reader.onerror = () => {
      setError('Failed to read the image file');
    };
    
    reader.readAsDataURL(file);
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };
  
  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    const fetchOllamaModels = async () => {
      try {
        const models = await getOllamaModels();
        setOllamaModels(models);
        if (models.length > 0) {
          setOllamaModel(models[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch Ollama models:', error);
      }
    };
    fetchOllamaModels();
  }, []);

  // Close model selector when clicking outside
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

  const toggleModelSelector = () => {
    if (!showModelSelector && modelSelectorButtonRef.current) {
      const rect = modelSelectorButtonRef.current.getBoundingClientRect();
      setModelSelectorButtonRect(rect);
    }
    setShowModelSelector(!showModelSelector);
  };

  const handleModelSelection = (modelType, modelName = null) => {
    setSelectedModel(modelType);
    if (modelType === 'ollama' && modelName) {
      setOllamaModel(modelName);
    }
    setShowModelSelector(false);

    // Add a message to indicate model switch
    const systemMsg = { 
      role: 'system', 
      content: `Switched to ${modelType === 'openai' ? 'GPT-4o' : modelType === 'anthropic' ? 'Claude' : `Ollama (${modelName})`}` 
    };
    onNewMessage(systemMsg);
  };

  // Add function to remove image from message
  const handleRemoveImage = (index) => {
    // Create a copy of the message without the image
    const message = {...history[index]};
    
    // Keep the content but remove image references
    const updatedMessage = {
      ...message,
      hasImage: false,
      imageData: null
    };
    
    // Update this message
    onUpdateMessage(index, updatedMessage);
    
    // Add a system message indicating the image was removed
    const systemMsg = { 
      role: 'system', 
      content: "Image removed from the conversation.",
      timestamp: new Date().toISOString()
    };
    
    onNewMessage(systemMsg);
  };

  // Modify the formatMessage function to include image info and removal option
  const formatMessage = (content, hasImage, imageData, messageIndex, timestamp) => {
    // Split the content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    
    // Extract image source info if available (captured vs uploaded)
    let sourceInfo = "";
    if (hasImage && selectedCapture) {
      sourceInfo = selectedCapture.source === 'upload' ? 'Uploaded image' : 'Screenshot';
      if (selectedCapture.timestamp) {
        const date = new Date(selectedCapture.timestamp);
        sourceInfo += ` (${date.toLocaleTimeString()})`;
      }
    } else if (hasImage && imageData) {
      sourceInfo = "Uploaded image";
    }
    
    return (
      <div className="space-y-2">
        {hasImage && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center text-primary-400">
                <PhotoIcon className="h-4 w-4 mr-1" />
                <span>{sourceInfo || "Image attached"}</span>
              </div>
              
              {/* Add remove image button */}
              <button 
                onClick={() => handleRemoveImage(messageIndex)}
                className="text-neutral-400 hover:text-danger-400 flex items-center"
                title="Remove image from message"
              >
                <XMarkIcon className="h-4 w-4" />
                <span className="ml-1">Remove</span>
              </button>
            </div>
            {imageData && (
              <div className="p-1 border border-neutral-700 rounded-lg bg-black">
                <img 
                  src={imageData} 
                  alt="Uploaded" 
                  className="max-w-full rounded"
                  style={{ maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        )}
        {parts.map((part, index) => {
          if (part.startsWith('```') && part.endsWith('```')) {
            // This is a code block
            const code = part.slice(3, -3);
            return (
              <pre key={index} className="bg-neutral-900 p-3 rounded mt-2 mb-2 overflow-x-auto text-sm">
                <code className="font-mono">{code}</code>
              </pre>
            );
          } else {
            // This is regular text, preserve line breaks
            return <p key={index} className="whitespace-pre-wrap">{part}</p>;
          }
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { 
        role: 'user', 
        content: input,
        timestamp: new Date().toISOString()
      };
      onNewMessage(userMessage);
      setInput('');
      setIsLoading(true);
      setError(null);

      try {
        let aiResponse;
        if (selectedCapture?.dataUrl) {
          console.log(`Chat using model: ${selectedModel} for image analysis`);
          aiResponse = await analyzeImage(
            selectedCapture.dataUrl, 
            selectedModel, 
            input, 
            context,
            selectedModel === 'ollama' ? ollamaModel : undefined
          );
          const assistantMessage = { 
            role: 'assistant', 
            content: aiResponse,
            hasImage: true,
            timestamp: new Date().toISOString()
          };
          onNewMessage(assistantMessage);
        } else {
          console.log(`Chat using model: ${selectedModel} for text chat`);
          aiResponse = await chatWithAI(selectedModel, input, context, ollamaModel);
          const assistantMessage = { 
            role: 'assistant', 
            content: aiResponse,
            timestamp: new Date().toISOString()
          };
          onNewMessage(assistantMessage);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        let errorMessage = error.message || 'An error occurred while processing your request.';
        
        // Provide more helpful guidance based on the error
        if (errorMessage.includes('API key is not configured')) {
          if (selectedModel === 'openai') {
            errorMessage = 'OpenAI API key is not configured. You can add it to your .env file or switch to Claude or Ollama models.';
          } else if (selectedModel === 'anthropic') {
            errorMessage = 'Anthropic API key is not configured. You can add it to your .env file or switch to GPT or Ollama models.';
          }
        } else if (errorMessage.includes('Ollama') && selectedModel === 'ollama') {
          errorMessage = 'Error connecting to Ollama. Make sure Ollama is running locally and accessible at the configured URL.';
        }
        
        setError(errorMessage);
        onNewMessage({ 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${errorMessage}`,
          timestamp: new Date().toISOString()
        });
      }

      setIsLoading(false);
    }
  };

  const handleClearAllChat = () => {
    // Use the new reset function
    onResetChatHistory([]);
    if (onClearChat) {
      onClearChat();
    }
  };

  return (
    <div 
      ref={dropZoneRef}
      className={`card h-full flex flex-col animate-fade-in ${isDragging ? 'border-primary-500 bg-primary-500/10' : ''}`}
    >
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-50 rounded-xl">
          <div className="text-center p-6">
            <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-primary-400 mb-2" />
            <p className="text-xl font-medium text-white">Drop image to upload</p>
            <p className="text-sm text-neutral-400 mt-1">Upload image to analyze</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-neutral-100">Chat</h2>
        
        <div className="flex space-x-2 items-center">
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
          
          {selectedCapture && (
            <div className="flex items-center text-xs text-neutral-400 bg-neutral-800/50 px-2 py-1 rounded-md">
              <PhotoIcon className="h-4 w-4 mr-1" />
              <span>Image attached</span>
            </div>
          )}
          
          <div className="relative">
            <button
              ref={modelSelectorButtonRef}
              id="model-selector-button"
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
      
      <div className="flex-grow overflow-y-auto mb-4 scrollbar-styled">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-neutral-400 text-sm max-w-sm">
              Start a conversation by typing a message below. You can also capture a screenshot to discuss or paste an image (Ctrl+V).
            </p>
            <p className="text-neutral-500 text-xs mt-3">
              Note: You can use OpenAI, Claude, or just Ollama models locally - only configure the API keys you need.
            </p>
          </div>
        ) : (
          history.map((message, index) => {
            // Skip system messages
            if (message.role === 'system') return null;
            
            return (
              <div 
                key={index} 
                className={`mb-4 ${message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
              >
                <div className={`max-w-3/4 rounded-2xl p-3.5 ${
                  message.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none'
                    : 'bg-neutral-800 text-neutral-100 rounded-tl-none'
                }`}>
                  {formatMessage(message.content, message.hasImage, message.imageData, index, message.timestamp)}
                </div>
              </div>
            );
          })
        )}
        
        {error && (
          <div className="p-3 mb-4 rounded-lg bg-danger-500/20 border border-danger-700 text-danger-200">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center justify-start mb-4">
            <div className="bg-neutral-800 rounded-2xl rounded-tl-none p-4 text-neutral-400">
              <div className="flex space-x-2">
                <div className="h-2 w-2 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-neutral-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <div className="relative mt-auto">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="relative flex-grow">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message or paste an image (Ctrl+V)..."
              className="w-full p-3 pr-10 rounded-xl border border-neutral-700 bg-neutral-800 text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent scrollbar-styled"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              onInput={(e) => {
                const target = e.target;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            {selectedCapture && (
              <div className="absolute left-3 top-3 text-primary-500">
                <PhotoIcon className="h-5 w-5" />
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {isLoading ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClearAllChat}
              className="p-3 rounded-xl bg-neutral-700 text-neutral-300 hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;