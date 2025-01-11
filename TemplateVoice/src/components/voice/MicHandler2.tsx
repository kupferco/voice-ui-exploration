// import React, { useEffect, useRef } from 'react';
// import { Platform } from 'react-native';
// import AudioAnalyser from './AudioAnalyser';

// type MicHandlerProps = {
//     onSpeechResult: (text: string) => void; // Callback when final transcript is ready
//     onSpeechDetected: (text: string) => void; // Handle transcribed speech
//     isMuted: boolean; // Mute or unmute the mic
//     playbackStream?: MediaStream; // TTS playback stream
//     onError?: (error: string) => void; // Optional error callback
//     pauseDelay?: number; // Optional configurable pause duration (ms)
// };

// const MicHandler: React.FC<MicHandlerProps> = ({
//     onSpeechResult,
//     isMuted,
//     playbackStream,
//     onError,
//     pauseDelay = 500, // Default pause duration to 500ms
// }) => {
//     const recognitionRef = useRef<any>(null);
//     const finalTranscriptRef = useRef(''); // Store the final transcript
//     const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Dynamically calculate whether the mic should be enabled
//     const isEnabled = !isMuted && !isTTSPlaying;

//     useEffect(() => {
//         if (!isEnabled || !text) return;

//         const playTTS = async () => {
//             try {
//                 onTTSStart?.(); // Notify start
//                 setIsTTSPlaying(true);

//                 const requestBody = {
//                     input: { text },
//                     voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
//                     audioConfig: { audioEncoding: 'MP3' },
//                 };

//                 const response = await fetch(
//                     `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
//                     {
//                         method: 'POST',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify(requestBody),
//                     }
//                 );

//                 const data = await response.json();

//                 if (data.audioContent) {
//                     const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
//                     audioRef.current = audio;

//                     audio.play();
//                     audio.onended = () => {
//                         setIsTTSPlaying(false);
//                         onTTSEnd?.(); // Notify end
//                     };
//                 } else {
//                     throw new Error('No audioContent received');
//                 }
//             } catch (error: any) {
//                 console.error('TTS Error:', error);
//                 setIsTTSPlaying(false);
//                 onTTSEnd?.(); // Notify end on error
//                 onError?.(error.message || 'An error occurred during TTS playback.');
//             }
//         };

//         playTTS();

//         return cleanup;
//     }, [text, isEnabled]);


//     const handleSpeechDetection = () => {
//         console.log('User speech detected!');
//         // Logic to interrupt TTS or process speech can be added here
//     };

//     const setupWebSpeechRecognition = () => {
//         if (!('webkitSpeechRecognition' in window)) {
//             console.error('Speech Recognition API is not supported in this browser.');
//             return;
//         }

//         const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
//         const recognition = new SpeechRecognition();
//         recognition.continuous = true; // Continuously listen for speech
//         recognition.interimResults = true; // Receive interim speech results
//         recognition.lang = 'en-US'; // Set language to English
//         recognitionRef.current = recognition;

//         recognition.onresult = (event: any) => {
//             if (isMuted) return; // Don't process if mic is muted

//             let interimTranscript = '';
//             for (let i = event.resultIndex; i < event.results.length; i++) {
//                 const transcript = event.results[i][0].transcript;
//                 if (event.results[i].isFinal) {
//                     finalTranscriptRef.current += transcript; // Append to final transcript
//                 } else {
//                     interimTranscript += transcript; // Collect interim transcript
//                 }
//             }

//             // Reset pause timer
//             if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);

//             // Detect pause and send final message
//             pauseTimeoutRef.current = setTimeout(() => {
//                 if (finalTranscriptRef.current.trim() !== '') {
//                     onSpeechResult(finalTranscriptRef.current.trim()); // Send only when paused
//                     finalTranscriptRef.current = ''; // Reset final transcript
//                 }
//             }, pauseDelay);
//         };

//         recognition.onerror = (event: any) => {
//             console.error('Speech Recognition Error:', event.error);
//             if (onError) onError(event.error);
//         };

//         recognition.start(); // Start recognition
//     };

//     return (
//         <AudioAnalyser
//             onSpeechDetected={handleSpeechDetection}
//             isEnabled={!isMuted}
//             threshold={0.02} // Adjust sensitivity as needed
//             playbackStream={playbackStream} // Pass playback stream for cancellation
//             onError={onError}
//         />
//     )
// };

// export default MicHandler;
