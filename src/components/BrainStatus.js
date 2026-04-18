import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function BrainStatus({ status = 'OMNIBRAIN ACTIVE', knowledge = 0 }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lil Jr 2.0</Text>
      <Text style={styles.status}>{status}</Text>
      <Text style={styles.meta}>Knowledge: {knowledge}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: THEME.surfaceLight, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#25253a' },
  title: { color: THEME.text, fontSize: 18, fontWeight: '700' },
  status: { color: THEME.success, marginTop: 6, fontWeight: '600' },
  meta: { color: THEME.textMuted, marginTop: 4 }
});
