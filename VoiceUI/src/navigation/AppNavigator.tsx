import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { DEV_INITIAL_ROUTE as ENV_ROUTE } from '@env';

// Import screens
import HomeScreen1 from '../screens/HomeScreens/HomeScreen1';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import ChatScreen2 from '../screens/ChatScreen/ChatScreen2'; // Import the new ChatScreen2
import VoiceScreen1 from '../screens/VoiceScreens/VoiceScreen1';

const Stack = createStackNavigator<RootStackParamList>();

// Dynamically set the initial route
const DEV_INITIAL_ROUTE = process.env.NODE_ENV === 'development' ? ENV_ROUTE : null;

console.log('DEV_INITIAL_ROUTE:', DEV_INITIAL_ROUTE);

// Auto-Navigation Wrapper for HomeScreen1
const AutoNavigationHomeScreen = ({ navigation }: any) => {
  useEffect(() => {
    if (DEV_INITIAL_ROUTE !== '' && DEV_INITIAL_ROUTE !== null) {
      navigation.navigate(DEV_INITIAL_ROUTE);
    }
  }, [navigation]);

  return <HomeScreen1 navigation={navigation} />;
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          cardStyle: { flex: 1 },
        }}>
        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={AutoNavigationHomeScreen}
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

        {/* Chat Screen 2 */}
        <Stack.Screen
          name="ChatScreen2" // Add the new screen to the navigator
          component={ChatScreen2} // Reference the ChatScreen2 component
          options={{
            headerShown: false, // Disable the default header for better control
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

export default AppNavigator;
