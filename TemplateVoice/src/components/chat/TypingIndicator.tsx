// src/components/chat/TypingIndicator.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const startBlinking = (dot: Animated.Value, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: 1,
          duration: 300,
          delay,
          useNativeDriver: Platform.OS !== 'web', // Native driver disabled on web
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startBlinking(dot1, 0);
    startBlinking(dot2, 300);
    startBlinking(dot3, 600);
  }, []);

  return (
    <View style={styles.typingIndicator}>
      <Animated.Text style={[styles.typingDot, { opacity: dot1 }]}>.</Animated.Text>
      <Animated.Text style={[styles.typingDot, { opacity: dot2 }]}>.</Animated.Text>
      <Animated.Text style={[styles.typingDot, { opacity: dot3 }]}>.</Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typingIndicator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 20,
  },
  typingDot: {
    fontSize: 40,
    color: '#0000FF',
  },
});

export default TypingIndicator;
