import React, { useEffect, useState } from 'react';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const AUTO_RESET_FLAG = 'AUTO_RESET_UPDATE_DONE';

export default function AutoResetUpdate({ children }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const alreadyDone = await AsyncStorage.getItem(AUTO_RESET_FLAG);
        if (!alreadyDone) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await AsyncStorage.setItem(AUTO_RESET_FLAG, 'true');
            await Updates.reloadAsync();
          } else {
            await AsyncStorage.setItem(AUTO_RESET_FLAG, 'true');
          }
        }
      } catch (e) {
        // Optionally handle error
      }
      setChecked(true);
    };
    checkAndUpdate();
    // Also listen for app coming to foreground (optional)
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') checkAndUpdate();
    });
    return () => sub.remove();
  }, []);

  // Only render children after check
  return checked ? children : null;
}
