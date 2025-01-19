import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import VoiceService from '../../services/VoiceService';

interface ConversationMessage {
  role: string;
  text: string;
}

const VoiceScreen1 = () => {
  const [transcript, setTranscript] = useState('');
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false); // Track mute state

  const handleSpeechResult = (text: string) => {
    console.log('Speech Recognition Transcript:', text);
    setTranscript(text);
  };

  const handleInterrupt = useCallback(() => {
    console.log('Interrupting speech...');
    VoiceService.interruptAudio(); // Call the interrupt method
    setIsTTSPlaying(false); // Optionally update state if speech is interrupted
  }, []);

  const handleMuteToggle = () => {
    if (isMuted) {
      VoiceService.unmute();
      console.log('Microphone unmuted.');
    } else {
      VoiceService.mute();
      console.log('Microphone muted.');
    }
    setIsMuted((prev) => !prev); // Toggle mute state
  };

  useFocusEffect(
    useCallback(() => {
      const loadHistory = async () => {
        try {
          const history: ConversationMessage[] = await VoiceService.fetchConversationHistory();
          setConversationHistory(history);
        } catch (error) {
          console.error('Error loading conversation history:', error);
        }
      };

      const startListening = async () => {
        await VoiceService.startListening(handleSpeechResult);
        setIsTTSPlaying(true);
      };

      loadHistory();
      startListening();

      return () => {
        console.log('Cleaning up resources...');
        VoiceService.stopListening(); // Stop listening on cleanup
        setIsTTSPlaying(false); // Reset state
        handleInterrupt();
        VoiceService.unmute();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <Text style={styles.transcript}>{transcript || 'Say something...'}</Text>

      {/* Mute/Unmute Button */}
      <TouchableOpacity style={styles.button} onPress={handleMuteToggle}>
        <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
      </TouchableOpacity>

      {/* Interrupt Button */}
      <TouchableOpacity style={styles.button} onPress={handleInterrupt}>
        <Text style={styles.buttonText}>Interrupt</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  transcript: { fontSize: 18, marginBottom: 20, color: 'gray' },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default VoiceScreen1;
