import React from "react";
import { useAccessibility } from "@/components/AccessibilitySettings";

interface TTSTextProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "li";
}

/**
 * Reusable Text-to-Speech Wrapper Component
 * 
 * When TTS is enabled in accessibility settings, this component makes text clickable.
 * Clicking the text will read it aloud using the Web Speech API.
 * 
 * Usage:
 * <TTSText text="This will be spoken">This will be spoken</TTSText>
 * 
 * Features:
 * - Only active when TTS is enabled in settings
 * - Shows yellow highlight on hover when TTS is enabled
 * - Visual feedback with wavy underline
 * - Works with any HTML element (span, p, h1, h2, etc.)
 */
export const TTSText: React.FC<TTSTextProps> = ({ 
  text, 
  children, 
  className = "",
  as: Component = "span"
}) => {
  const { settings, readText, stopReading, isReading } = useAccessibility();
  
  // If TTS is not enabled, just render the text normally
  if (!settings.textToSpeech) {
    return <Component className={className}>{children}</Component>;
  }
  
  // Handle click to speak
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isReading) {
      stopReading();
    }
    readText(text);
  };
  
  return (
    <Component 
      className={`${className} cursor-pointer hover:bg-yellow-200/50 hover:underline decoration-wavy decoration-2 transition-all rounded px-1`}
      onClick={handleClick}
      title="Click to hear this text"
      role="button"
      aria-label={`Click to hear: ${text}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {children}
    </Component>
  );
};

/**
 * TTS Banner Component - Shows at the top of pages when TTS is enabled
 */
export const TTSBanner: React.FC = () => {
  const { settings } = useAccessibility();
  
  if (!settings.textToSpeech) {
    return null;
  }
  
  return (
    <div className="fixed top-20 left-0 right-0 z-30 bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200 px-4 py-3 shadow-lg">
      <div className="container mx-auto max-w-7xl flex items-center justify-center gap-3">
        <svg 
          className="h-5 w-5 text-blue-600 animate-pulse" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
        <span className="font-bold text-sm text-blue-800">
          🔊 TTS ENABLED — Click on ANY highlighted text to hear it spoken aloud!
        </span>
      </div>
    </div>
  );
};
