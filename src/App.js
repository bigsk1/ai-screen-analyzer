// src/App.js
import React, { useState, useEffect } from 'react';
import ScreenCapture from './components/ScreenCapture';
import ImageAnalysis from './components/ImageAnalysis';
import Chat from './components/Chat';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

function App() {
  const [captures, setCaptures] = useState([]);
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const loadedCaptures = loadFromLocalStorage('captures') || [];
    const loadedChatHistory = loadFromLocalStorage('chatHistory') || [];
    setCaptures(loadedCaptures);
    setChatHistory(loadedChatHistory);
  }, []);

  useEffect(() => {
    saveToLocalStorage('captures', captures);
    saveToLocalStorage('chatHistory', chatHistory);
  }, [captures, chatHistory]);

  const handleNewCapture = (newCapture) => {
    setCaptures([newCapture, ...captures]);
    setSelectedCapture(newCapture);
  };

  const handleChatMessage = (message) => {
    setChatHistory([...chatHistory, message]);
  };

  const handleImageAnalysis = (analysis) => {
    handleChatMessage({ role: 'assistant', content: analysis });
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  const handleClearScreenshot = () => {
    setSelectedCapture(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-200`}>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-100">AI Screen Analyzer + Chat</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
          >
            {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
          </button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ScreenCapture onNewCapture={handleNewCapture} darkMode={darkMode} />
            <ImageAnalysis 
              capture={selectedCapture}
              onAnalysis={handleImageAnalysis}
              onClear={handleClearScreenshot}
              darkMode={darkMode}
            />
          </div>
          <div>
            <Chat 
              history={chatHistory}
              onNewMessage={handleChatMessage}
              selectedCapture={selectedCapture}
              onClearChat={handleClearChat}
              darkMode={darkMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;