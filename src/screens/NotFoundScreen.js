import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404 - Not Found</Text>
      <Text style={styles.text}>Sorry, the page you are looking for does not exist.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: 16
  },
  text: {
    fontSize: 18,
    color: THEME.textMuted
  }
});
