import React from 'react';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import SignSafeScreen from './src/screens/SignSafeScreen';
import AppNavigator from './src/navigation/AppNavigator';
import OneBrainHandoffScreen from './src/screens/OneBrainHandoffScreen';
import NotFoundScreen from './src/screens/NotFoundScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#050508' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Main" component={AppNavigator} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="SignSafe" component={SignSafeScreen} />
        <Stack.Screen name="OneBrainHandoff" component={OneBrainHandoffScreen} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: '404' }} />
      </Stack.Navigator>
    // Handle undefined routes for web
    export const linking = {
      prefixes: [],
      config: {
        screens: {
          Splash: 'splash',
          Home: 'home',
          Main: 'main',
          Dashboard: 'dashboard',
          SignSafe: 'signsafe',
          OneBrainHandoff: 'onebrainhandoff',
          NotFound: '*',
        },
      },
    };

    // Use linking prop in NavigationContainer
    </NavigationContainer>
  );
}
