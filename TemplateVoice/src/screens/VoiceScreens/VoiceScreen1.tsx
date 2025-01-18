import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VoiceService from '../../services/VoiceService';

const VoiceScreen1 = () => {
  const [transcript, setTranscript] = useState('');
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: string; text: string }[]>([]);


  useEffect(() => {
    const loadHistory = async () => {
      const history = await VoiceService.fetchConversationHistory();
      setConversationHistory(history);
    };
    loadHistory();
  }, []);

  const handleSpeechResult = (text: string) => {
    console.log('Speech Recognition Transcript:', text);
    setTranscript(text);
  };

  const handleStartListening = async () => {
    await VoiceService.startListening(handleSpeechResult);
    setIsTTSPlaying(true);
  };

  const handleStopListening = () => {
    VoiceService.stopListening();
    setIsTTSPlaying(false);
  };

  const handlePlayTTS = async () => {
    const audioBlob = new Blob(['Sample audio content'], { type: 'audio/wav' });
    await VoiceService.playTTS(audioBlob);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Input</Text>
      <Text style={styles.transcript}>{transcript || 'Say something...'}</Text>

      <TouchableOpacity style={styles.button} onPress={handleStartListening}>
        <Text style={styles.buttonText}>
          {isTTSPlaying ? 'Stop Listening' : 'Start Listening'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleStopListening}>
        <Text style={styles.buttonText}>Stop Listening</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={VoiceService.mute}>
        <Text style={styles.buttonText}>Mute</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={VoiceService.unmute}>
        <Text style={styles.buttonText}>Unmute</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={VoiceService.interruptAudio}>
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
