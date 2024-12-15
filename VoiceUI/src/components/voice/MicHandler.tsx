import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

type MicHandlerProps = {
  onSpeechResult: (text: string) => void; // Callback when final transcript is ready
  isMuted: boolean; // Mute or unmute the mic
  onError?: (error: string) => void; // Optional error callback
  pauseDelay?: number; // Optional configurable pause duration (ms)
};

const MicHandler: React.FC<MicHandlerProps> = ({
  onSpeechResult,
  isMuted,
  onError,
  pauseDelay = 500, // Default pause duration to 500ms
}) => {
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef(''); // Store the final transcript
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setupWebSpeechRecognition();
    }

    // Cleanup recognition and timers on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [isMuted]);

  const setupWebSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech Recognition API is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Continuously listen for speech
    recognition.interimResults = true; // Receive interim speech results
    recognition.lang = 'en-US'; // Set language to English
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      if (isMuted) return; // Don't process if mic is muted

      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript; // Append to final transcript
        } else {
          interimTranscript += transcript; // Collect interim transcript
        }
      }

      // Reset pause timer
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

      // Detect pause and send final message
      pauseTimeoutRef.current = setTimeout(() => {
        if (finalTranscriptRef.current.trim() !== '') {
          onSpeechResult(finalTranscriptRef.current.trim()); // Send only when paused
          finalTranscriptRef.current = ''; // Reset final transcript
        }
      }, pauseDelay);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      if (onError) onError(event.error);
    };

    recognition.start(); // Start recognition
  };

  return null; // No UI needed for this component
};

export default MicHandler;
