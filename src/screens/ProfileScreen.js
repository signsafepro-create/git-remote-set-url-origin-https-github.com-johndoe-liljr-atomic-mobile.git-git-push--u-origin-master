
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../config/theme';
import { AdMobBanner } from 'expo-ads-admob';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.sub}>User: mobile-user</Text>
      <Text style={styles.sub}>Tier: Hustler</Text>
      <Text style={styles.sub}>Voice: Ready</Text>
      {/* AdMob Banner Example (replace adUnitID with your own for production) */}
      <View style={{ marginTop: 32 }}>
        <AdMobBanner
          bannerSize="smartBannerPortrait"
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID
          servePersonalizedAds // true for personalized ads
          onDidFailToReceiveAdWithError={err => console.log('Ad error', err)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background, padding: 16, paddingTop: 56 },
  title: { color: THEME.text, fontSize: 24, fontWeight: '800' },
  sub: { color: THEME.textMuted, marginTop: 10, fontSize: 16 }
});
