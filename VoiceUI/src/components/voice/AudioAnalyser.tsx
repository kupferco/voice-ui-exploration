import React, { useEffect, useRef } from 'react';

type AudioAnalyserProps = {
  onSpeechDetected: () => void; // Callback when user speech is detected
  isEnabled: boolean; // Enable/disable audio analysis
  threshold?: number; // Volume threshold for detecting speech
  playbackStream?: MediaStream; // Optional playback audio stream for cancellation
  onError?: (error: string) => void; // Optional callback for errors
};

const AudioAnalyser: React.FC<AudioAnalyserProps> = ({
  onSpeechDetected,
  isEnabled,
  threshold = 0.01,
  playbackStream,
  onError,
}) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      cleanup();
      return;
    }

    const initialiseAudio = async () => {
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = micStream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const micSource = audioContext.createMediaStreamSource(micStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;

        analyserRef.current = analyser;

        if (playbackStream) {
          const playbackSource = audioContext.createMediaStreamSource(playbackStream);

          // Create cancellation node (mic - playback)
          const cancellationNode = audioContext.createGain();
          playbackSource.connect(cancellationNode.gain);
          cancellationNode.gain.value = -1; // Invert playback signal
          playbackSource.connect(analyser); // Combine playback + mic

          micSource.connect(analyser);
        } else {
          micSource.connect(analyser); // No playback signal, just mic
        }

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = dataArray;

        startAnalysing();
      } catch (error: any) {
        console.error('AudioAnalyser Error:', error);
        onError?.(error.message || 'An error occurred during audio analysis.');
      }
    };

    initialiseAudio();

    return cleanup;
  }, [isEnabled, playbackStream]);

  const startAnalysing = () => {
    const detectSpeech = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const volume = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length;

      if (volume > threshold * 255) {
        onSpeechDetected();
      }

      animationFrameRef.current = requestAnimationFrame(detectSpeech);
    };

    detectSpeech();
  };

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    dataArrayRef.current = null;
    micStreamRef.current = null;
  };

  return null; // No UI needed
};

export default AudioAnalyser;
