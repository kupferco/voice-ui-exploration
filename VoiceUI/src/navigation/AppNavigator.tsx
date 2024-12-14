import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Button, View, Text, StyleSheet } from 'react-native';
import { DEV_INITIAL_ROUTE as ENV_ROUTE } from '@env';

import ChatScreen from '../screens/ChatScreen/ChatScreen';
import VoiceScreen1 from '../screens/VoiceScreens/VoiceScreen1';

const Stack = createStackNavigator<RootStackParamList>();

// Dynamically set the initial route
const DEV_INITIAL_ROUTE = process.env.NODE_ENV === 'development' ? ENV_ROUTE : null;

console.log('DEV_INITIAL_ROUTE:', DEV_INITIAL_ROUTE);

const HomeScreen = ({ navigation }: any) => {
  // Automatically navigate based on DEV_INITIAL_ROUTE
  useEffect(() => {
    if (DEV_INITIAL_ROUTE === 'Chat') {
      navigation.navigate('Chat');
    } else if (DEV_INITIAL_ROUTE === 'Voice1') {
      navigation.navigate('Voice1');
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate('Chat')}
      />
      <Button
        title="Go to Voice Mode 1"
        onPress={() => navigation.navigate('Voice1')}
      />
    </View>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'Home',
            headerTitleAlign: 'center',
          }}
        />
        {/* Chat Screen */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: 'Chat',
            headerTitleAlign: 'center',
          }}
        />
        {/* Voice Screen 1 */}
        <Stack.Screen
          name="Voice1"
          component={VoiceScreen1}
          options={{
            headerTitle: 'Voice Mode 1',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AppNavigator;
