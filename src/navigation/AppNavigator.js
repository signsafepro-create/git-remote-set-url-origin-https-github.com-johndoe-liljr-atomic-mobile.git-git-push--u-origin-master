import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import PricingScreen from '../screens/PricingScreen';
import BrainScreen from '../screens/BrainScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { THEME } from '../config/theme';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: THEME.surface, borderTopColor: THEME.surfaceLight },
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.textMuted
      }}
    >
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: () => <Text>💬</Text> }} />
      <Tab.Screen name="Voice" component={require('../screens/VoiceChatScreen').default} options={{ tabBarIcon: () => <Text>🎤</Text> }} />
      <Tab.Screen name="Control" component={require('../screens/VoiceControlScreen').default} options={{ tabBarIcon: () => <Text>🛠️</Text> }} />
      <Tab.Screen name="Pricing" component={PricingScreen} options={{ tabBarIcon: () => <Text>💎</Text> }} />
      <Tab.Screen name="Brain" component={BrainScreen} options={{ tabBarIcon: () => <Text>🧠</Text> }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}
