import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import { AppState } from 'react-native';

export default function AutoResetUpdate({ children }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (e) {
        // Optionally handle error
      }
      setChecked(true);
    };
    checkAndUpdate();
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') checkAndUpdate();
    });
    return () => sub.remove();
  }, []);

  return checked ? children : null;
}
