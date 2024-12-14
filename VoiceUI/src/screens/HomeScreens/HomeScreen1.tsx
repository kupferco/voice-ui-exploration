import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HomeScreen1 = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home Dashboard Concept 1</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.buttonText}>Go to Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Voice1')}
      >
        <Text style={styles.buttonText}>Go to Voice Mode 1</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20, // Adds spacing between buttons
    width: '80%', // Make the buttons take 80% of the container width
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: 'bold',
  },
});

export default HomeScreen1;
