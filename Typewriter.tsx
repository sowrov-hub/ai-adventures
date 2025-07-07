
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, className = '', onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const timer = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prev => prev + text.charAt(i));
          i++;
        } else {
          clearInterval(timer);
          if (onComplete) {
            onComplete();
          }
        }
      }, speed);

      return () => {
        clearInterval(timer);
      };
    }
  }, [text, speed, onComplete]);

  return <p className={`${className} whitespace-pre-wrap`}>{displayedText}<span className="inline-block w-2 h-5 bg-white animate-pulse ml-1" /></p>;
};

export default Typewriter;
