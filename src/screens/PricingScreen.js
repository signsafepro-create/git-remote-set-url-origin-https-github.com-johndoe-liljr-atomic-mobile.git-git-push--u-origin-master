import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { TIERS as TIER_CONFIG } from '../config/api';
import TierCard from '../components/TierCard';

const TIERS = Object.entries(TIER_CONFIG).map(([key, t]) => ({ ...t, key }));

export default function PricingScreen({ navigation }) {
  const [loading, setLoading] = useState(null);
  const [email, setEmail] = useState('');

  // Payment temporarily disabled. Show info only.
  const activateTier = (tier) => {
    Alert.alert('Upgrade Unavailable', 'Payment/upgrade is currently disabled. Contact support for access.');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>CHOOSE YOUR</Text>
      <Text style={styles.power}>POWER LEVEL</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        placeholderTextColor="#666"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.emailInput}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {TIERS.map((tier) => (
          <TierCard key={tier.key} tier={tier} onPress={activateTier} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
    paddingTop: 60
  },
  backButton: {
    padding: 20
  },
  backText: {
    color: '#00f0ff',
    fontSize: 16
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 4
  },
  power: {
    fontSize: 36,
    fontWeight: '900',
    color: '#00f0ff',
    textAlign: 'center',
    marginBottom: 20
  },
  emailInput: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#0a0a12',
    borderColor: '#1a1a2e',
    borderWidth: 1,
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  scroll: {
    paddingHorizontal: 20
  },
  card: {
    backgroundColor: '#0a0a12',
    borderWidth: 2,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tierName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2
  },
  loading: {
    color: '#fff',
    fontSize: 20
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 8
  },
  description: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16
  },
  activateButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center'
  },
  activateText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 2
  }
});
