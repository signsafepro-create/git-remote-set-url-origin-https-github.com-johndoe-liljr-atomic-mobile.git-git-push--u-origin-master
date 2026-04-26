import React from 'react';
import NeuralBrain from '../components/NeuralBrain';
import HomeVoiceControl from '../components/HomeVoiceControl';
import UpdateButton from '../components/UpdateButton';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <NeuralBrain />


      <Text style={styles.logo}>LIL JR 2.0</Text>
      <Text style={styles.tagline}>Your autonomous best friend.</Text>
      <Text style={styles.tagline2}>Never sleeps. Never forgets. Always hustles.</Text>

      {/* Voice Control UI embedded for instant access */}
      <HomeVoiceControl />

      {/* Update Button for OTA updates */}
      <UpdateButton />


      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main', { screen: 'Voice' })}>
        <LinearGradient colors={['#00f0ff', '#b829dd']} style={styles.gradient}>
          <Text style={styles.buttonText}>🎤 VOICE CHAT</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main', { screen: 'Chat' })}>
        <LinearGradient colors={['#b829dd', '#00f0ff']} style={styles.gradient}>
          <Text style={styles.buttonText}>START TALKING</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={() => navigation.navigate('Main', { screen: 'Pricing' })}>
        <Text style={styles.secondaryText}>UPGRADE POWER</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.tertiary]} onPress={() => navigation.navigate('SignSafe')}>
        <Text style={styles.tertiaryText}>SIGNSAFE CANADA</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.quaternary]} onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.quaternaryText}>CORE BRAIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.handoff]} onPress={() => navigation.navigate('OneBrainHandoff')}>
        <Text style={styles.handoffText}>ONE BRAIN HANDOFF</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050508',
    padding: 24
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#00f0ff',
    marginBottom: 8,
    letterSpacing: 2
  },
  tagline: {
    fontSize: 16,
    color: '#b829dd',
    marginBottom: 4
  },
  tagline2: {
    fontSize: 12,
    color: '#666',
    marginBottom: 50
  },
  button: {
    width: '100%',
    maxWidth: 300,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden'
  },
  gradient: {
    padding: 18,
    alignItems: 'center'
  },
  buttonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1
  },
  secondary: {
    borderWidth: 2,
    borderColor: '#b829dd',
    padding: 16,
    alignItems: 'center'
  },
  secondaryText: {
    color: '#b829dd',
    fontWeight: '800',
    fontSize: 16
  },
  tertiary: {
    borderWidth: 1,
    borderColor: '#00f0ff',
    padding: 14,
    alignItems: 'center'
  },
  tertiaryText: {
    color: '#00f0ff',
    fontWeight: '700',
    fontSize: 14
  },
  quaternary: {
    borderWidth: 1,
    borderColor: '#ff2a6d',
    padding: 12,
    alignItems: 'center'
  },
  quaternaryText: {
    color: '#ff2a6d',
    fontWeight: '700',
    fontSize: 14
  },
  handoff: {
    borderWidth: 1,
    borderColor: '#64ff8f',
    padding: 12,
    alignItems: 'center'
  },
  handoffText: {
    color: '#64ff8f',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1
  }
});
