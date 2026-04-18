import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function TierCard({ tier, onPress }) {
  return (
    <Pressable onPress={() => onPress?.(tier)} style={[styles.card, { borderColor: tier.color || THEME.primary }]}>
      <Text style={styles.name}>{tier.name}</Text>
      <Text style={styles.price}>${tier.price}/mo</Text>
      <Text style={styles.meta}>{tier.messages === Infinity ? 'Unlimited messages' : `${tier.messages} messages`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: THEME.surfaceLight, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 10 },
  name: { color: THEME.text, fontSize: 17, fontWeight: '700' },
  price: { color: THEME.primary, marginTop: 4, fontWeight: '700' },
  meta: { color: THEME.textMuted, marginTop: 4 }
});
