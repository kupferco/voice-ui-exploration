import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatBubble from '../../components/chat/ChatBubble'; // Import the ChatBubble component
import { RootStackParamList } from '../../../types';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', type: 'agent', text: 'Hello! How can I help you?' },
    { id: '2', type: 'user', text: 'I have a question about my order.' },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), type: 'user', text: input },
      ]);
      setInput('');
      setTimeout(() => {
        inputRef.current?.focus();
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Bubbles */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble type={item.type} text={item.text} />}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Input Field and Mic Icon */}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.iconButton} onPress={sendMessage}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.iconButton, styles.micButton]}
          onPress={() => navigation.navigate('Voice1')}
        >
          <Icon name="mic" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 8,
  },
  micButton: {
    backgroundColor: '#00C851',
  },
});

export default ChatScreen;
