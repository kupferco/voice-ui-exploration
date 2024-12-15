import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { GOOGLE_API_KEY } from '@env';

export type TTSHandlerRef = {
  interruptPlayback: () => void; // Method to interrupt playback
};

type TTSHandlerProps = {
  text: string; // Text to be spoken
  isEnabled: boolean; // Enable/disable TTS
  onTTSStart?: () => void; // Optional callback when TTS starts
  onTTSEnd?: () => void; // Optional callback when TTS ends
  onError?: (error: string) => void; // Optional callback for errors
};

const TTSHandler = forwardRef<TTSHandlerRef, TTSHandlerProps>(
  ({ text, isEnabled, onTTSStart, onTTSEnd, onError }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isPlaying = useRef(false);

    useImperativeHandle(ref, () => ({
      interruptPlayback: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          isPlaying.current = false;
        }
        window.speechSynthesis.cancel(); // Cancel speech synthesis (if used)
      },
    }));

    useEffect(() => {
      if (!isEnabled || !text) return;

      const playTTS = async () => {
        try {
          onTTSStart?.();

          // Prepare the request to Google TTS API
          const requestBody = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
          };

          const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${GOOGLE_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(requestBody),
            }
          );

          const data = await response.json();

          if (data.audioContent) {
            // Play the audio
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audioRef.current = audio;
            isPlaying.current = true;

            audio.play();
            audio.onended = () => {
              isPlaying.current = false;
              onTTSEnd?.();
            };
          } else {
            throw new Error('No audioContent received');
          }
        } catch (error: any) {
          console.error('TTS Error:', error);
          onError?.(error.message || 'An error occurred during TTS playback.');
        }
      };

      playTTS();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          isPlaying.current = false;
        }
        window.speechSynthesis.cancel(); // Ensure playback is stopped on cleanup
      };
    }, [text, isEnabled]);

    return null; // No UI needed
  }
);

export default TTSHandler;
