import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BrainStatus from '../components/BrainStatus';
import { api } from '../api/client';
import { THEME } from '../config/theme';


export default function BrainScreen() {
  const [status, setStatus] = useState('Checking...');
  const [knowledge, setKnowledge] = useState(0);

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

  return (
    <View style={styles.outer}>
      <View style={styles.container}>
        <Text style={styles.title}>Brain</Text>
        <BrainStatus status={status} knowledge={knowledge} />
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
    elevation: 2
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 18,
    letterSpacing: 1.2
  }
});