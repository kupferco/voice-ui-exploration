import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MicHandler from '../../components/voice/MicHandler';
import ConversationHandler from '../../services/ConversationHandler';

const VoiceScreen1 = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleSpeechResult = async (text: string) => {
    setRecognizedText(text);
    if (text.trim() !== '') {
      await ConversationHandler.sendMessage(text);
    }
  };

  const toggleMute = () => setIsMuted((prev) => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Mode</Text>
      <Text style={styles.status}>{isMuted ? 'Muted' : 'Listening...'}</Text>

      <Text style={styles.recognizedText}>{recognizedText || 'Say something...'}</Text>

      <MicHandler onSpeechResult={handleSpeechResult} isMuted={isMuted} />

      {/* Mute/Unmute Button */}
      <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
        <Icon name={isMuted ? 'mic-off' : 'mic'} size={30} color="#fff" />
        <Text style={styles.buttonText}>{isMuted ? 'Unmute' : 'Mute'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  status: {

    fontSize: 18,
    marginBottom: 10
  },
  recognizedText: {
    fontSize: 18,
    color: '#333',
    paddingHorizontal: 20, // Add padding to the left and right
    marginBottom: 20,      // Keep spacing below the text
  },

  muteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: '#fff'
  },
});

export default VoiceScreen1;
