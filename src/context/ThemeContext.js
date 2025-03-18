import React, { createContext, useContext, useEffect } from 'react';

// Create Theme Context
const ThemeContext = createContext({
  darkMode: true,
  toggleDarkMode: () => {}
});

// Theme Provider Component
export const ThemeProvider = ({ children, value }) => {
  const { darkMode } = value;
  
  // Apply dark mode classes to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext; 