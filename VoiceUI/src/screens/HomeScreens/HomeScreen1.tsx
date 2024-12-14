import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen1 = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Dashboard Concept 1</Text>
      <Button title="Go to Chat" onPress={() => navigation.navigate('Chat')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  text: { fontSize: 20, marginBottom: 20 },
});

export default HomeScreen1;
