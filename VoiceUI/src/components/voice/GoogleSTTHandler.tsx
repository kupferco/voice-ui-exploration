import { useEffect, useRef } from "react";
import { GOOGLE_API_KEY } from "@env";

type GoogleSTTHandlerProps = {
  onSpeechResult: (text: string) => void; // Callback for the final transcription
  isTTSPlaying: boolean; // Pause mic capture during TTS playback
  onError?: (error: string) => void; // Optional error callback
};

const GoogleSTTHandler: React.FC<GoogleSTTHandlerProps> = ({
  onSpeechResult,
  isTTSPlaying,
  onError,
}) => {
  const micStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // Store recorded audio chunks

  useEffect(() => {
    if (!isTTSPlaying) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isTTSPlaying]);

  // Start recording audio
  const startRecording = async () => {
    console.log("Start Recording");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = []; // Reset chunks

      mediaRecorder.ondataavailable = (event) => {
        console.log(123123)
        audioChunksRef.current.push(event.data); // Collect audio data
      };

      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, processing audio...");
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        await sendAudioToGoogleSTT(audioBlob);
      };

      mediaRecorder.start();
      console.log("MediaRecorder started");
    } catch (error) {
      console.error("Error starting recording:", error);
      onError?.("Failed to access microphone");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    console.log("Stop Recording");

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
  };

  // Send audio to Google Speech-to-Text API
  const sendAudioToGoogleSTT = async (audioBlob: Blob) => {
    console.log("Sending audio to Google STT...");

    try {
      const base64Audio = await convertBlobToBase64(audioBlob);

      const requestBody = {
        config: {
        //   encoding: "LINEAR16",
        //   sampleRateHertz: 16000, // Change if needed
          languageCode: "en-US",
        },
        audio: {
          content: base64Audio,
        },
      };

      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.results) {
        const transcript = data.results[0]?.alternatives[0]?.transcript || "";
        console.log("Transcription:", transcript);
        onSpeechResult(transcript); // Pass transcription back
      } else {
        console.error("No transcription available:", data);
        onError?.("Failed to process transcription");
      }
    } catch (error) {
      console.error("Error sending audio to Google STT:", error);
      onError?.("Error sending audio to Google STT");
    }
  };

  // Convert audio Blob to Base64
  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1];
        resolve(base64String || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  return null; // No UI needed
};

export default GoogleSTTHandler;
