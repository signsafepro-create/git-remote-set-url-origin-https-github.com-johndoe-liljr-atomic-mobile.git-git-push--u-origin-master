import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function VoiceButton({ active = false, onPress }) {
  return (
    <Pressable style={[styles.btn, active && styles.active]} onPress={onPress}>
      <Text style={styles.text}>{active ? 'Listening...' : 'Voice'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: THEME.secondary,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: { backgroundColor: THEME.accent },
  text: { color: THEME.text, fontWeight: '700' }
});
