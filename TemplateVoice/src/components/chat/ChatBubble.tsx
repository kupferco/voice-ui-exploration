import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  type: 'user' | 'agent';
  text: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ type, text }) => {
  const isUser = type === 'user';

  return (
    <View style={[styles.chatBubble, isUser ? styles.chatBubbleUser : styles.chatBubbleAgent]}>
      <Text style={styles.chatText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f5d3',
  },
  chatBubbleAgent: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e2e2',
  },
  chatText: {
    fontSize: 16,
  },
});

export default ChatBubble;
