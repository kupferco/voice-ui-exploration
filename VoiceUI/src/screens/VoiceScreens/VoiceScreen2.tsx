import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VoiceScreen2 = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Voice Mode Concept 2</Text>
      {/* Another radically different layout or animation */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000' },
  text: { fontSize: 18, color: '#fff' },
});

export default VoiceScreen2;
