import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function MessageBubble({ role, text }) {
  const mine = role === 'user';
  return (
    <View style={[styles.wrap, mine ? styles.right : styles.left]}>
      <View style={[styles.bubble, mine ? styles.user : styles.assistant]}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 6, width: '100%' },
  left: { alignItems: 'flex-start' },
  right: { alignItems: 'flex-end' },
  bubble: { maxWidth: '84%', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12 },
  user: { backgroundColor: THEME.primary },
  assistant: { backgroundColor: THEME.surfaceLight },
  text: { color: THEME.text, fontSize: 15, lineHeight: 20 }
});
