import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { GOOGLE_API_KEY } from '@env';

export type TTSHandlerRef = {
  interruptPlayback: () => void; // Method to interrupt playback
  isTTSPlaying: boolean; // Tracks whether TTS is playing
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
    const [isTTSPlaying, setIsTTSPlaying] = useState(false);

    useImperativeHandle(ref, () => ({
      interruptPlayback: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsTTSPlaying(false);
        }
      },
      isTTSPlaying,
    }));

    useEffect(() => {
      // console.log('111 === TTSHandler UseEffect called')
      if (!isEnabled || !text) return;
      // console.log('222 ==== Text updated :: TTS happening')

      const playTTS = async () => {
        try {
          onTTSStart?.();
          setIsTTSPlaying(true);

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
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
            audioRef.current = audio;

            audio.play();
            audio.onended = () => {
              setIsTTSPlaying(false);
              onTTSEnd?.();
            };
          } else {
            throw new Error('No audioContent received');
          }
        } catch (error: any) {
          console.error('TTS Error:', error);
          setIsTTSPlaying(false);
          onTTSEnd?.();
          onError?.(error.message || 'An error occurred during TTS playback.');
        }
      };

      playTTS();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsTTSPlaying(false);
        }
      };
    }, [text, isEnabled]);

    return null;
  }
);

export default TTSHandler;
