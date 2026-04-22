
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import BrainStatus from '../components/BrainStatus';
import NeuralBrain from '../components/NeuralBrain';
import { api } from '../api/client';
import { THEME } from '../config/theme';


export default function BrainScreen() {
  const [status, setStatus] = useState('Checking...');
  const [knowledge, setKnowledge] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState('Voice: Ready');
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const data = await api.health();
        setStatus(data.status || 'Unknown');
        setKnowledge(data.knowledge || 0);
      } catch {
        setStatus('Offline');
      }
    })();
  }, []);

  // Animate the background ring
  useEffect(() => {
    Animated.loop(
      Animated.timing(ringAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [ringAnim]);

  // Simulate voice status (replace with real voice logic as needed)
  useEffect(() => {
    const interval = setInterval(() => {
      setVoiceStatus((prev) => prev === 'Voice: Ready' ? 'Voice: Listening...' : 'Voice: Ready');
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const rotate = ringAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <Text style={styles.title}>Brain</Text>
        {/* Animated moving ring background */}
        <Animated.View style={[styles.ring, { transform: [{ rotate }] }]} />
        <NeuralBrain />
        <BrainStatus status={status} knowledge={knowledge} />
        <Text style={styles.voiceStatus}>{voiceStatus}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: THEME.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },
  container: {
    width: '95%',
    maxWidth: 420,
    backgroundColor: THEME.background,
    borderRadius: 18,
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 18,
    letterSpacing: 1.2
  },
  ring: {
    position: 'absolute',
    top: 60,
    left: '50%',
    marginLeft: -170,
    width: 340,
    height: 340,
    borderRadius: 170,
    borderWidth: 6,
    borderColor: '#00f0ff44',
    opacity: 0.22,
    zIndex: 0,
  },
  voiceStatus: {
    marginTop: 18,
    color: THEME.accent,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 1.1,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});