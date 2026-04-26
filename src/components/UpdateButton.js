import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';

export default function UpdateButton() {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const checkForUpdate = async () => {
    setUpdating(true);
    setMessage('');
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setMessage('Update found! Downloading...');
        await Updates.fetchUpdateAsync();
        setMessage('Update downloaded! Restarting...');
        await Updates.reloadAsync();
      } else {
        setMessage('App is up to date.');
      }
    } catch (e) {
      setMessage('Update failed: ' + e.message);
    }
    setUpdating(false);
  };

  return (
    <TouchableOpacity style={styles.updateButton} onPress={checkForUpdate} disabled={updating}>
      <Text style={styles.updateText}>{updating ? 'Checking...' : '🔄 UPDATE APP'}</Text>
      {updating && <ActivityIndicator color="#00f0ff" style={{ marginLeft: 8 }} />}
      {!!message && <Text style={styles.status}>{message}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  updateButton: {
    width: '100%',
    maxWidth: 300,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00f0ff',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#050508',
  },
  updateText: {
    color: '#00f0ff',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  status: {
    color: '#b829dd',
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
  },
});
