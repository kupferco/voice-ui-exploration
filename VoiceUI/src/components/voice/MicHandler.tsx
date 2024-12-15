import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

type MicHandlerProps = {
  onSpeechResult: (text: string) => void;
  isMuted: boolean;
  onError?: (error: string) => void;
};

const MicHandler: React.FC<MicHandlerProps> = ({ onSpeechResult, isMuted, onError }) => {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setupWebSpeechRecognition();
    } else {
      console.warn('MicHandler: Unsupported platform for this configuration.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isMuted]);

  const setupWebSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      if (isMuted) return;

      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(' ');
      onSpeechResult(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      if (onError) onError(event.error);
    };

    recognition.start();
  };

  return null; // No UI needed for this component
};

export default MicHandler;
