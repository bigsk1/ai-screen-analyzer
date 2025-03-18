import React from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import { GitHubIcon } from './Icons';

const Layout = ({ children, darkMode, toggleDarkMode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <div className={`min-h-screen pb-16 ${darkMode ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900'}`}>
      <header className="border-b border-neutral-800 py-3">
        <div className="container mx-auto px-4 xl:px-6 max-w-screen-2xl">
          <div className="flex justify-between items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-semibold">AI</span>
              </div>
              <span className="font-semibold text-lg">AI Screen Analyzer</span>
            </a>
            
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <SunIcon className="h-5 w-5 text-yellow-400" /> : <MoonIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 xl:px-6 py-6 max-w-screen-2xl">
        {children}
      </main>
      
      <footer className="fixed bottom-0 left-0 w-full border-t border-neutral-800 py-2 bg-neutral-900 bg-opacity-90 backdrop-blur-sm">
        <div className="container mx-auto px-4 xl:px-6 max-w-screen-2xl">
          <div className="flex justify-between items-center">
            <div className="text-neutral-500 text-sm">
              AI Screen Analyzer © 2025
            </div>
            <a 
              href="https://github.com/ai-screen-analyzer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-white transition-colors flex items-center"
              aria-label="GitHub repository"
            >
              <GitHubIcon className="h-5 w-5" />
              <span className="ml-2 text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 