import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>User: mobile-user</Text>
      <Text style={styles.sub}>Tier: Hustler</Text>
      <Text style={styles.sub}>Voice: Ready</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 16, paddingTop: 56 },
  title: { color: THEME.text, fontSize: 24, fontWeight: '800' },
  sub: { color: THEME.textMuted, marginTop: 10, fontSize: 16 }
});
