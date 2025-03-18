// src/App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import ScreenCapture from './components/ScreenCapture';
import Chat from './components/Chat';
import ImageAnalysis from './components/ImageAnalysis';
import CaptureHistory from './components/CaptureHistory';
import './index.css';

const App = () => {
  const [captures, setCaptures] = useState([]);
  const [selectedCapture, setSelectedCapture] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [analysisResult, setAnalysisResult] = useState('');

  // When the app first loads, try to get captures from local storage
  useEffect(() => {
    const savedCaptures = localStorage.getItem('captures');
    if (savedCaptures) {
      try {
        setCaptures(JSON.parse(savedCaptures));
      } catch (error) {
        console.error('Error parsing saved captures:', error);
      }
    }
    
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing chat history:', error);
      }
    }
    
    // Add a check for Ollama connection
    const checkOllamaConnection = async () => {
      try {
        const response = await fetch(`${process.env.OLLAMA_API_URL || 'http://localhost:11434'}/api/tags`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          // Short timeout to avoid long waits if Ollama isn't running
          signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
          console.log('Successfully connected to Ollama');
        } else {
          console.warn('Ollama connection check failed - falling back to simulated responses');
        }
      } catch (error) {
        console.warn('Could not connect to Ollama - models will use simulated responses', error);
      }
    };
    
    checkOllamaConnection();
  }, []);

  // Save captures to local storage whenever they change
  useEffect(() => {
    if (captures.length > 0) {
      localStorage.setItem('captures', JSON.stringify(captures));
    }
  }, [captures]);

  // Save chat history to local storage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const handleNewCapture = (capture) => {
    const updatedCaptures = [capture, ...captures].slice(0, 10); // Keep only the most recent 10 captures
    setCaptures(updatedCaptures);
    setSelectedCapture(capture);
    
    // Notify chat about the new capture
    const systemMsg = { 
      role: 'system', 
      content: "A new screenshot has been captured. You can ask questions about it.",
      timestamp: new Date().toISOString()
    };
    handleNewMessage(systemMsg);
  };

  const handleNewImageUpload = (uploadedCapture) => {
    // Similar to handleNewCapture but for uploaded images
    const updatedCaptures = [uploadedCapture, ...captures].slice(0, 10);
    setCaptures(updatedCaptures);
    setSelectedCapture(uploadedCapture);
    
    // Add notification to chat about uploaded image
    const systemMsg = { 
      role: 'system', 
      content: "An image has been uploaded. You can ask questions about it.",
      timestamp: new Date().toISOString()
    };
    handleNewMessage(systemMsg);
  };

  const handleDeleteCapture = (captureId) => {
    const updatedCaptures = captures.filter(capture => capture.id !== captureId);
    setCaptures(updatedCaptures);
    
    if (selectedCapture && selectedCapture.id === captureId) {
      setSelectedCapture(updatedCaptures[0] || null);
      
      // Notify chat that the capture was removed
      if (!updatedCaptures.length) {
        const systemMsg = { 
          role: 'system', 
          content: "The screenshot has been removed.",
          timestamp: new Date().toISOString()
        };
        handleNewMessage(systemMsg);
      }
    }
    
    if (updatedCaptures.length === 0) {
      localStorage.removeItem('captures');
    }
  };

  const handleSelectCapture = (capture) => {
    setSelectedCapture(capture);
    
    // Optional: Notify chat about switching to a different capture
    if (selectedCapture && selectedCapture.id !== capture.id) {
      const systemMsg = { 
        role: 'system', 
        content: "Switched to a different screenshot.",
        timestamp: new Date().toISOString()
      };
      handleNewMessage(systemMsg);
    }
  };

  const handleClearCapture = () => {
    setSelectedCapture(null);
    setAnalysisResult('');
    
    // Notify chat that the capture was cleared
    const systemMsg = { 
      role: 'system', 
      content: "The screenshot has been cleared.",
      timestamp: new Date().toISOString()
    };
    handleNewMessage(systemMsg);
  };

  const handleNewMessage = (message) => {
    // Ensure message has a timestamp
    const messageWithTimestamp = {
      ...message,
      timestamp: message.timestamp || new Date().toISOString()
    };
    
    setChatHistory(prev => [...prev, messageWithTimestamp]);
  };

  // Add a function to update a specific message
  const handleUpdateMessage = (index, updatedMessage) => {
    setChatHistory(prev => {
      const newHistory = [...prev];
      newHistory[index] = updatedMessage;
      return newHistory;
    });
  };

  // Add a function to reset chat history
  const handleResetChatHistory = (newHistory = []) => {
    setChatHistory(newHistory);
    if (newHistory.length === 0) {
      localStorage.removeItem('chatHistory');
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
    localStorage.removeItem('chatHistory');
  };

  const handleAnalysisResult = (result) => {
    setAnalysisResult(result);
    
    // Add the analysis result to the chat with image reference
    if (result && result.trim() && selectedCapture) {
      // Skip if the result already includes "Question:" (indicating it's being handled properly)
      if (!result.includes("Question:")) {
        const botMessage = { 
          role: 'assistant', 
          content: result,
          hasImage: true,
          timestamp: new Date().toISOString()
        };
        handleNewMessage(botMessage);
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider value={{ darkMode, toggleDarkMode }}>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <ScreenCapture onNewCapture={handleNewCapture} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ImageAnalysis 
                  capture={selectedCapture} 
                  onAnalysis={handleAnalysisResult} 
                  onClear={handleClearCapture}
                />
                
                <div className="card animate-fade-in">
                  <h2 className="text-xl font-semibold text-neutral-100 mb-4">Recent Captures</h2>
                  <CaptureHistory 
                    captures={captures} 
                    onSelectCapture={handleSelectCapture} 
                    onDeleteCapture={handleDeleteCapture}
                    selectedCaptureId={selectedCapture?.id}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 h-full">
            <Chat 
              history={chatHistory} 
              onNewMessage={handleNewMessage} 
              onUpdateMessage={handleUpdateMessage}
              onResetChatHistory={handleResetChatHistory}
              selectedCapture={selectedCapture}
              onClearChat={handleClearChat}
              onNewImageUpload={handleNewImageUpload}
            />
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default App;