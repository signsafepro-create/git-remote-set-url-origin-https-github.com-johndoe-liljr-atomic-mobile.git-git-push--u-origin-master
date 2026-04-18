import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BrainStatus from '../components/BrainStatus';
import { API_BASE_URL, ENDPOINTS } from '../config/api';
import { THEME } from '../config/theme';

export default function BrainScreen() {
  const [status, setStatus] = useState('Checking...');
  const [knowledge, setKnowledge] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.health}`);
        const data = await res.json();
        setStatus(data.status || 'Unknown');
        setKnowledge(data.knowledge || 0);
      } catch {
        setStatus('Offline');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brain</Text>
      <BrainStatus status={status} knowledge={knowledge} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 16, paddingTop: 56 },
  title: { color: THEME.text, fontSize: 24, fontWeight: '800', marginBottom: 12 }
});
