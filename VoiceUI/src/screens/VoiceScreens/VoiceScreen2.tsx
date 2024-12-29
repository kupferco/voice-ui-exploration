import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MicHandler from '../../components/voice/MicHandler';
import TTSHandler, { TTSHandlerRef } from '../../components/voice/GoogleTTSHandler';
import ConversationHandler from '../../services/ConversationHandler';

const VoiceScreen2 = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const ttsRef = useRef<TTSHandlerRef>(null);

  const handleSpeechResult = (text: string) => {
    setRecognizedText(text);
    ConversationHandler.sendMessage(text);
    if (ttsRef.current) ttsRef.current.interruptPlayback(); // Interrupt playback if user speaks
  };

  useEffect(() => {
    const updateMessages = (messages: any[]) => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.type === 'agent') {
        setResponseText(lastMessage.text);
      }
    };

    ConversationHandler.subscribe(updateMessages);
    return () => ConversationHandler.unsubscribe(updateMessages);
  }, []);

  const toggleMute = () => setIsMuted((prevState) => !prevState);

  const interruptTTS = () => {
    if (ttsRef.current) ttsRef.current.interruptPlayback();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Mode</Text>
      <Text style={styles.status}>{isMuted ? 'Muted' : 'Listening...'}</Text>
      <Text style={styles.recognizedText}>{recognizedText || 'Say something...'}</Text>

      {/* TTSHandler */}
      <TTSHandler ref={ttsRef} text={responseText} isEnabled={!isMuted} />

      <MicHandler onSpeechResult={handleSpeechResult} isMuted={isMuted} />

      {/* Mute/Unmute Button */}
      <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
        <Icon name={isMuted ? 'mic-off' : 'mic'} size={30} color="#fff" />
        <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
      </TouchableOpacity>

      {/* Interrupt TTS Button */}
      <TouchableOpacity style={styles.muteButton} onPress={interruptTTS}>
        <Icon name="stop" size={30} color="#fff" />
        <Text style={styles.buttonText}>Stop Playback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 18, marginBottom: 10, color: '#555' },
  recognizedText: { fontSize: 18, color: '#333', paddingHorizontal: 20, marginBottom: 20 },
  muteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { marginLeft: 10, fontSize: 18, color: '#fff' },
});

export default VoiceScreen2;
