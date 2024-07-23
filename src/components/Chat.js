// src/components/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import { analyzeImage, chatWithAI, getOllamaModels } from '../utils/aiServices';

const Chat = ({ history, onNewMessage, selectedCapture, onClearChat, darkMode }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('openai');
  const [ollamaModel, setOllamaModel] = useState('');
  const [ollamaModels, setOllamaModels] = useState([]);
  const chatEndRef = useRef(null);
  const [context, setContext] = useState('');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setContext(history.map(msg => `${msg.role}: ${msg.content}`).join('\n'));
  }, [history]);

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

  const formatMessage = (content) => {
    // Split the content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const code = part.slice(3, -3);
        return (
          <pre key={index} className="bg-gray-800 p-2 rounded mt-2 mb-2 overflow-x-auto">
            <code>{code}</code>
          </pre>
        );
      } else {
        // This is regular text, preserve line breaks
        return <p key={index} className="whitespace-pre-wrap">{part}</p>;
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: 'user', content: input };
      onNewMessage(userMessage);
      setInput('');
      setIsLoading(true);
      setError(null);

      try {
        let aiResponse;
        if (selectedCapture?.dataUrl) {
          aiResponse = await analyzeImage(selectedCapture.dataUrl, selectedModel, input, context);
        } else {
          aiResponse = await chatWithAI(selectedModel, input, context, ollamaModel);
        }
        const assistantMessage = { role: 'assistant', content: aiResponse };
        onNewMessage(assistantMessage);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setError(error.message || 'An error occurred while processing your request.');
        onNewMessage({ role: 'assistant', content: 'Sorry, I encountered an error while processing your request.' });
      }

      setIsLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md transition-colors duration-200 h-full flex flex-col`}>
      <h2 className="text-xl font-semibold mb-4">Chat</h2>
      {selectedCapture && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Currently discussing image:</p>
          <img src={selectedCapture.dataUrl} alt="Selected" className="w-32 h-32 object-cover rounded" />
        </div>
      )}
      <div className="flex mb-2">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className={`p-2 rounded mr-2 ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="ollama">Ollama</option>
        </select>
        {selectedModel === 'ollama' && (
          <select
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
            className={`p-2 rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
          >
            {ollamaModels.map((model) => (
              <option key={model.name} value={model.name}>{model.name}</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {history.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-3 rounded ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              {formatMessage(message.content)}
            </span>
          </div>
        ))}
        {error && (
          <div className="text-red-500 mb-2">
            Error: {error}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-grow p-2 rounded-l ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`bg-blue-600 text-white p-2 rounded-r ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      <button
        onClick={onClearChat}
        className="bg-red-600 text-white p-2 rounded w-full hover:bg-red-700"
      >
        Clear Chat
      </button>
    </div>
  );
};

export default Chat;