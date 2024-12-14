import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View, Text, StyleSheet } from 'react-native';
import { DEV_INITIAL_ROUTE as ENV_ROUTE } from '@env';

import ChatScreen from '../screens/ChatScreen/ChatScreen';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <Button
        title="Go to Chat"
        onPress={() => navigation.navigate('Chat')}
      />
    </View>
  );
};

// Dynamically set the initial route
const DEV_INITIAL_ROUTE = process.env.NODE_ENV === 'development' ? ENV_ROUTE : null;

console.log('DEV_INITIAL_ROUTE:', DEV_INITIAL_ROUTE);

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={DEV_INITIAL_ROUTE || 'Home'}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: 'Home',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerTitle: 'Chat',
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
