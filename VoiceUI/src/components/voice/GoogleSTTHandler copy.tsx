import { GOOGLE_API_KEY } from '@env';
import { useEffect, useRef } from 'react';

type GoogleSTTHandlerProps = {
    onSpeechResult: (text: string) => void; // Callback for the final transcript
    isTTSPlaying: boolean; // Pause mic capture during TTS playback
    onError?: (error: string) => void; // Optional error callback
};

const GoogleSTTHandler: React.FC<GoogleSTTHandlerProps> = ({
    onSpeechResult,
    isTTSPlaying,
    onError,
}) => {
    const micStreamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]); // Store raw audio Blobs
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const isTranscribingRef = useRef<boolean>(false);


    useEffect(() => {
        if (!isTTSPlaying) {
            startRecording();
        } else {
            stopRecording();
        }

        return () => {
            stopRecording(); // Cleanup on unmount
        };
    }, [isTTSPlaying]);

    const startRecording = async () => {
        console.log("Start Recording");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            micStreamRef.current = stream;

            const audioContext = new AudioContext();
            const micInput = audioContext.createMediaStreamSource(stream);
            const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1); // Buffer size 2048

            audioChunksRef.current = [];
            silenceTimerRef.current = null;

            // Connect mic input to script processor
            micInput.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);

            let finalAudioBuffer: Float32Array[] = []; // Array to store recorded chunks

            scriptProcessor.onaudioprocess = (event) => {
                const inputBuffer = event.inputBuffer.getChannelData(0); // Mono audio data
                const isSilent = detectSilence(inputBuffer, 0.01); // Silence threshold: 0.01

                // Accumulate audio data
                finalAudioBuffer.push(Float32Array.from(inputBuffer));

                if (!isSilent) {
                    if (silenceTimerRef.current) {
                        clearTimeout(silenceTimerRef.current);
                        silenceTimerRef.current = null; // Reset timer reference
                    }
                    console.log("Speaking detected, reset timer");
                } else if (!silenceTimerRef.current) {
                    console.log("Silence detected, starting timer...");
                    silenceTimerRef.current = setTimeout(() => {
                        console.log("Silence longer than 500ms, finalizing transcript...");
                        finaliseTranscript(finalAudioBuffer)
                            .then(() => {
                                finalAudioBuffer = []; // Clear audio buffer after processing
                                silenceTimerRef.current = null; // Reset timer reference
                            })
                            .catch((error) => {
                                console.error("Error during transcription finalization:", error);
                                silenceTimerRef.current = null; // Ensure timer resets even on error
                            });
                    }, 1500); // 500ms silence threshold
                }
            };






            console.log("Audio stream started");
        } catch (error) {
            console.error("Error accessing microphone:", error);
            onError?.("Failed to access microphone");
        }
    };

    const detectSilence = (buffer: Float32Array, threshold: number): boolean => {
        const sum = buffer.reduce((acc, value) => acc + Math.abs(value), 0);
        const average = sum / buffer.length;
        return average < threshold; // Returns true if below the threshold
    };



    const finaliseTranscript = async (audioChunks: Float32Array[]) => {
        console.log("Finalizing transcript...");

        try {
            // Flatten and convert Float32Array to PCM16
            const pcm16Audio = float32ToPCM16(Float32Array.from(audioChunks.flat()));

            // Encode to Base64
            const base64Audio = btoa(
                new Uint8Array(pcm16Audio).reduce((data, byte) => data + String.fromCharCode(byte), "")
            );

            // Send to Google STT API
            await sendAudioToGoogleSTT(base64Audio);
        } catch (error) {
            console.error("Error finalizing transcript:", error);
            onError?.("Failed to process audio");
        }
    };




    const mergeAudioChunks = (audioChunks: Float32Array[]): Float32Array => {
        const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const combined = new Float32Array(totalLength);

        let offset = 0;
        for (const chunk of audioChunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
        }

        return combined;
    };





    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach((track) => track.stop());
            micStreamRef.current = null;
        }

        console.log("Stop recording")
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    };

    // const finaliseTranscript = async () => {
    //     console.log('Finalise Transcript')
    //     if (audioChunksRef.current.length === 0) return;

    //     const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    //     const base64Audio = await convertBlobToBase64(audioBlob);

    //     audioChunksRef.current = []; // Reset chunks for next session

    //     if (base64Audio) {
    //         sendAudioToGoogleSTT(base64Audio);
    //     }
    // };

    const sendAudioToGoogleSTT = async (audioContent: string) => {
        const url = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_API_KEY}`;

        const requestBody = {
            config: {
                // encoding: 'LINEAR16',
                // sampleRateHertz: 44100, // Match AudioContext default
                languageCode: 'en-US',
            },
            audio: {
                content: audioContent, // Base64 encoded audio data
            },
        };


        console.log(requestBody)
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const transcript = data.results[0]?.alternatives[0]?.transcript || '';
                onSpeechResult(transcript);
            } else {
                console.error('No transcription available:', data);
                onError?.('Failed to process transcription');
            }
        } catch (error) {
            console.error('Error sending audio to Google STT:', error);
            onError?.(error.message || 'An error occurred');
        }
    };

    const convertBlobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result?.toString().split(',')[1];
                resolve(base64String || '');
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const convertFloat32ToPCM16Blob = (float32Array: Float32Array): Blob => {
        const buffer = new ArrayBuffer(float32Array.length * 2);
        const view = new DataView(buffer);

        for (let i = 0; i < float32Array.length; i++) {
            let sample = float32Array[i] * 0x7fff; // Scale to 16-bit PCM range
            sample = Math.max(-0x8000, Math.min(0x7fff, sample)); // Clamp value
            view.setInt16(i * 2, sample, true); // Little-endian
        }

        return new Blob([buffer], { type: "audio/wav" });
    };

    const convertFloat32ToWAV = (float32Array: Float32Array, sampleRate = 16000): Blob => {
        const buffer = new ArrayBuffer(44 + float32Array.length * 2);
        const view = new DataView(buffer);

        // WAV file header
        writeString(view, 0, "RIFF");
        view.setUint32(4, 36 + float32Array.length * 2, true);
        writeString(view, 8, "WAVE");
        writeString(view, 12, "fmt ");
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, "data");
        view.setUint32(40, float32Array.length * 2, true);

        // PCM samples
        const index = 44;
        let offset = 0;
        for (let i = 0; i < float32Array.length; i++, offset += 2) {
            const sample = Math.max(-1, Math.min(1, float32Array[i]));
            view.setInt16(index + offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        }

        return new Blob([buffer], { type: "audio/wav" });
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };




    const blobToFloat32Array = (blob: Blob): Promise<Float32Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const float32Array = new Float32Array(arrayBuffer);
                resolve(float32Array);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    };

    const float32ToPCM16 = (inputBuffer: Float32Array): Uint8Array => {
        const output = new DataView(new ArrayBuffer(inputBuffer.length * 2));
        for (let i = 0; i < inputBuffer.length; i++) {
            const s = Math.max(-1, Math.min(1, inputBuffer[i]));
            output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true); // Little endian
        }
        return new Uint8Array(output.buffer);
    };


    return null; // No UI needed
};

export default GoogleSTTHandler;
