import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2400);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.logo}>LIL JR</Text>
        <Text style={styles.subtitle}>OMNIBRAIN</Text>
        <Text style={styles.loading}>Initializing consciousness...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050508'
  },
  content: {
    alignItems: 'center'
  },
  logo: {
    fontSize: 52,
    fontWeight: '900',
    color: '#00f0ff',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 240, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20
  },
  subtitle: {
    fontSize: 14,
    color: '#b829dd',
    marginTop: 8,
    letterSpacing: 5,
    fontWeight: '700'
  },
  loading: {
    fontSize: 12,
    color: '#444',
    marginTop: 36,
    letterSpacing: 1
  }
});
