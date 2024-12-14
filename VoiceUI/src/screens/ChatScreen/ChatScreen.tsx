import React, { useState, useRef } from 'react';
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
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../../types';
import TypingIndicator from '../../components/chat/TypingIndicator';
import ApiRouter from '../../services/ApiRouter';

type Message = {
  id: string;
  type: 'user' | 'agent';
  text: string;
  animation: Animated.Value;
};

const ChatScreen2 = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      text: 'Hello! How can I help you?',
      animation: new Animated.Value(0),
    },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (input.trim() !== '') {
      // Add user's message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: input,
        animation: new Animated.Value(0),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      animateMessage(userMessage.animation);
      setInput('');
      inputRef.current?.focus();

      // Show typing indicator while waiting for a response
      setIsTyping(true);
      ApiRouter.sendMessage(input)
        .then((response) => {
          setIsTyping(false);
          const agentMessage: Message = {
            id: Date.now().toString(),
            type: 'agent',
            text: response,
            animation: new Animated.Value(0),
          };

          setMessages((prevMessages) => [...prevMessages, agentMessage]);
          animateMessage(agentMessage.animation);
        })
        .catch(() => {
          setIsTyping(false);
          const errorMessage: Message = {
            id: Date.now().toString(),
            type: 'agent',
            text: 'Oops! Something went wrong.',
            animation: new Animated.Value(0),
          };

          setMessages((prevMessages) => [...prevMessages, errorMessage]);
          animateMessage(errorMessage.animation);
        });
    }
  };

  const animateMessage = (animation: Animated.Value) => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animated.View
            style={[
              styles.chatBubble,
              item.type === 'user' ? styles.chatBubbleUser : styles.chatBubbleAgent,
              {
                opacity: item.animation,
                transform: [
                  {
                    scale: item.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                  {
                    translateY: item.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.chatText}>{item.text}</Text>
          </Animated.View>
        )}
        contentContainerStyle={styles.chatContainer}
        inverted
        onContentSizeChange={() => flatListRef.current?.scrollToIndex({ index: 0 })}
      />

      {/* Typing Indicator */}
      {isTyping && <TypingIndicator />}

      {/* Input Field and Icons */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginRight: 10,
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

export default ChatScreen2;
