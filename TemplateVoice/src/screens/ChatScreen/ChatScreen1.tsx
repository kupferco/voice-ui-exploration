import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import TypingIndicator from '../../components/chat/TypingIndicator';
import { RootStackParamList } from '../../../types';
import ConversationHandler from '../../services/ConversationHandler';

type Message = {
  id: string;
  type: 'user' | 'agent';
  text: string;
  animation: Animated.Value;
};

const ChatScreen1 = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTyping, setIsTyping] = useState(false);

  // Load messages whenever the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      const loadMessages = async () => {
        const existingMessages = await ConversationHandler.getMessages();
        setMessages(
          existingMessages.map((msg) => ({
            ...msg,
            animation: new Animated.Value(1), // Set initial animation state
          }))
        );
      };

      loadMessages();

      // Subscribe to updates
      const updateMessages = (updatedMessages: any[]) => {
        setMessages(
          updatedMessages.map((msg) => ({
            ...msg,
            animation: new Animated.Value(1),
          }))
        );
      };

      ConversationHandler.subscribe(updateMessages);

      return () => {
        ConversationHandler.unsubscribe(updateMessages); // Cleanup on screen blur
      };
    }, [])
  );

  const sendMessage = async () => {
    if (input.trim() === '') return;

    // Clear input field immediately
    const messageToSend = input;
    setInput('');
    inputRef.current?.focus();

    // Process the message
    setIsTyping(true);
    await ConversationHandler.sendMessage(messageToSend);
    setIsTyping(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item, index) => `${item.id}-${index}`} // Unique keys
            renderItem={({ item }) => {
              return (
                <Animated.View
                  style={[
                    styles.chatBubble,
                    item.type === 'user' ? styles.chatBubbleUser : styles.chatBubbleAgent,
                  ]}
                >
                  <Text style={styles.chatText}>{item.text}</Text>
                </Animated.View>
              );
            }}
            contentContainerStyle={styles.chatContainer}
            inverted
            initialNumToRender={messages.length} // Render all messages initially
            maxToRenderPerBatch={messages.length} // Ensure all messages stay rendered
            removeClippedSubviews={false}
          />
        </View>

        {isTyping && <TypingIndicator />}

        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            blurOnSubmit={false}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  chatContainer: {
    padding: 10,
  },
  chatBubble: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '75%',
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

export default ChatScreen1;
