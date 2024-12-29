import React, { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

type MicHandlerProps = {
    onSpeechResult: (text: string) => void; // Callback when final transcript is ready
    isMuted: boolean; // Mute or unmute the mic
    isTTSPlaying: boolean; // Prevent mic capturing during TTS playback
    onInterruptPlayback: () => void; // Interrupt TTS playback when user speaks
    onError?: (error: string) => void; // Optional error callback
    pauseDelay?: number; // Optional configurable pause duration (ms)
};

const MicHandler: React.FC<MicHandlerProps> = ({
    onSpeechResult,
    isMuted,
    isTTSPlaying,
    onInterruptPlayback,
    onError,
    pauseDelay = 500,
}) => {
    const recognitionRef = useRef<any>(null);
    const finalTranscriptRef = useRef(''); // Store the final transcript
    const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isRecognitionActive = useRef(false);

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

        recognition.onstart = () => {
            console.log('Speech recognition started');
            isRecognitionActive.current = true;
        };

        recognition.onresult = (event: any) => {
            if (isMuted) {
                console.log('Mic is muted. Ignoring input.');
                return;
            }

            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                // If TTS is playing, interrupt it only when user speaks
                if (isTTSPlaying) {
                    console.log('TTS playback detected. Ignoring mic input.');
                    onInterruptPlayback();
                    return; // Ignore current input during TTS
                }

                if (event.results[i].isFinal) {
                    finalTranscriptRef.current += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            // Reset pause timer
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

            // Detect pause and send final message
            pauseTimeoutRef.current = setTimeout(() => {
                if (onSpeechResult && finalTranscriptRef.current.trim() !== '') {
                    console.log('Pause detected. Sending final transcript:', finalTranscriptRef.current);
                    onSpeechResult(finalTranscriptRef.current.trim());
                    finalTranscriptRef.current = '';
                }
            }, pauseDelay);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech Recognition Error:', event.error);
            if (onError) onError(event.error);
            isRecognitionActive.current = false;
        };

        recognition.onend = () => {
            console.log('Speech recognition ended.');
            isRecognitionActive.current = false;

            // Restart recognition if needed
            if (!isMuted) {
                restartRecognition();
            }
        };

        recognition.start();
        isRecognitionActive.current = true;
    };

    const startRecognition = () => {
        if (!recognitionRef.current || isRecognitionActive.current) return;

        recognitionRef.current.start();
        isRecognitionActive.current = true;
        console.log('Recognition started manually.');
    };

    const stopRecognition = () => {
        if (!recognitionRef.current || !isRecognitionActive.current) return;

        console.log('Stopping recognition manually.');
        recognitionRef.current.abort(); // Use abort for a clean stop
        isRecognitionActive.current = false;
    };

    const restartRecognition = () => {
        console.log('Restarting recognition...');
        stopRecognition();
        setTimeout(() => {
            startRecognition();
        }, 100);
    };

    // Effect: Set up recognition once
    useEffect(() => {
        if (Platform.OS === 'web') {
            setupWebSpeechRecognition();
        }

        return () => {
            console.log('Cleaning up: Stopping recognition and clearing timers.');
            stopRecognition();
            if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
        };
    }, []);

    return null; // No UI needed for this component
};

export default MicHandler;
