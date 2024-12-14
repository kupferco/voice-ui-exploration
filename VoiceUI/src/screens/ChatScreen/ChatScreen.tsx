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
    {
      id: '2',
      type: 'user',
      text: 'I have a question about my order.',
      animation: new Animated.Value(0),
    },
  ]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: input,
        animation: new Animated.Value(0),
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
          inputRef.current?.focus();
        }, 100);
        return updatedMessages;
      });

      setTimeout(() => animateMessage(newMessage.animation), 100);

      setInput('');
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
                      outputRange: [0.9, 1], // Scale from 90% to 100%
                    }),
                  },
                  {
                    translateY: item.animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0], // Slight upward motion
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

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
