// -----------------------------------------------------------------------
// NEURO-ACCESSIBILITY CONTEXT (Calm Mode, Reader Mode, Font Scaling)
// -----------------------------------------------------------------------
import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const AccessibilityProvider = ({ children }) => {
  const [readerMode, setReaderMode] = useState(false);
  const [calmMode, setCalmMode] = useState(false);
  const [fontSize, setFontSize] = useState(100); // 100, 125, 150
  const [highContrast, setHighContrast] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vbc_accessibility_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.readerMode !== undefined) setReaderMode(parsed.readerMode);
        if (parsed.calmMode !== undefined) setCalmMode(parsed.calmMode);
        if (parsed.fontSize !== undefined) setFontSize(parsed.fontSize);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
      }
    } catch (e) {}
  }, []);

  // Save changes to localStorage & DOM root
  useEffect(() => {
    try {
      const payload = { readerMode, calmMode, fontSize, highContrast };
      localStorage.setItem('vbc_accessibility_settings', JSON.stringify(payload));
    } catch (e) {}

    // Apply class tags to root HTML
    const root = document.documentElement;
    if (readerMode) {
      root.classList.add('reader-mode');
    } else {
      root.classList.remove('reader-mode');
    }

    if (calmMode) {
      root.classList.add('calm-mode');
    } else {
      root.classList.remove('calm-mode');
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font scale style
    root.style.fontSize = fontSize === 150 ? '120%' : fontSize === 125 ? '110%' : '100%';
  }, [readerMode, calmMode, fontSize, highContrast]);

  const toggleReaderMode = () => setReaderMode(prev => !prev);
  const toggleCalmMode = () => setCalmMode(prev => !prev);
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const cycleFontSize = () => {
    setFontSize(prev => (prev === 100 ? 125 : prev === 125 ? 150 : 100));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        readerMode,
        calmMode,
        fontSize,
        highContrast,
        toggleReaderMode,
        toggleCalmMode,
        toggleHighContrast,
        cycleFontSize,
        setFontSize
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
