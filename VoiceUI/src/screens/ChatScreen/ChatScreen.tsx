import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const ChatScreen = ({ styleVariant }: { styleVariant?: 'default' | 'variant1' }) => {
  const styles = styleVariant === 'variant1' ? variant1Styles : defaultStyles;

  return (
    <View style={styles.container}>
      {/* Chat Bubbles */}
      <View style={styles.chatBubbleUser}>
        <Text>User Message</Text>
      </View>
      <View style={styles.chatBubbleAgent}>
        <Text>Agent Reply</Text>
      </View>

      {/* Input Field */}
      <TextInput style={styles.input} placeholder="Type a message..." />
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f5d3',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  chatBubbleAgent: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e2e2',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
});

const variant1Styles = StyleSheet.create({
  ...defaultStyles,
  container: {
    ...defaultStyles.container,
    backgroundColor: '#222',
  },
  chatBubbleUser: {
    ...defaultStyles.chatBubbleUser,
    backgroundColor: '#444',
  },
  chatBubbleAgent: {
    ...defaultStyles.chatBubbleAgent,
    backgroundColor: '#666',
  },
  input: {
    ...defaultStyles.input,
    backgroundColor: '#333',
    color: '#fff',
  },
});

export default ChatScreen;
