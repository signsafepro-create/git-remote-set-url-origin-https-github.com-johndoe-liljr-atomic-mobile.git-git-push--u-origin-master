import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { api } from '../api/client';

const PROVINCES = ['ON', 'BC', 'AB', 'QC', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'];

export default function SignSafeScreen({ navigation }) {
  const [notaries, setNotaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadNotaries();
  }, [selectedProvince]);

  const loadNotaries = async () => {
    setLoading(true);
    try {
      const response = await api.getNotaries(selectedProvince || undefined);
      setNotaries(response?.notaries || []);
    } catch {
      setNotaries([]);
    } finally {
      setLoading(false);
    }
  };

  const book = async (notary) => {
    setBooking(notary.id);
    try {
      await api.bookNotary(notary.id, 'user@example.com', 'Affidavit');
      Alert.alert('Booked!', `Meeting with ${notary.name} scheduled.`);
    } catch {
      Alert.alert('Unavailable', 'Booking endpoint is not active yet on this backend.');
    } finally {
      setBooking(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>SIGNSAFE</Text>
        <View style={{ width: 30 }} />
      </View>

      <Text style={styles.subtitle}>Find a Notary Public</Text>

      <ScrollView horizontal style={styles.provinces} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.provinceBtn, !selectedProvince && styles.provinceBtnActive]}
          onPress={() => setSelectedProvince(null)}
        >
          <Text style={styles.provinceText}>ALL</Text>
        </TouchableOpacity>
        {PROVINCES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.provinceBtn, selectedProvince === p && styles.provinceBtnActive]}
            onPress={() => setSelectedProvince(p)}
          >
            <Text style={styles.provinceText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#00f0ff" />
      ) : (
        <ScrollView style={styles.list}>
          {notaries.length === 0 ? (
            <Text style={styles.empty}>No notaries available from API yet.</Text>
          ) : (
            notaries.map((n) => (
              <View key={n.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.name}>{n.name}</Text>
                  <View style={[styles.badge, n.available ? styles.available : styles.unavailable]}>
                    <Text style={styles.badgeText}>{n.available ? '●' : '○'}</Text>
                  </View>
                </View>
                <Text style={styles.location}>
                  {n.city}, {n.province}
                </Text>
                <View style={styles.footer}>
                  <Text style={styles.price}>${(n.price || 0) / 100}</Text>
                  <Text style={styles.rating}>★ {n.rating || 0}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.bookBtn, !n.available && styles.bookBtnDisabled]}
                  onPress={() => book(n)}
                  disabled={!n.available || booking === n.id}
                >
                  <Text style={styles.bookBtnText}>{booking === n.id ? 'BOOKING...' : 'BOOK NOW'}</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
    paddingTop: 60
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  back: {
    color: '#00f0ff',
    fontSize: 24,
    padding: 4
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00f0ff',
    letterSpacing: 2
  },
  subtitle: {
    color: '#b829dd',
    textAlign: 'center',
    marginBottom: 20
  },
  provinces: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  provinceBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    backgroundColor: '#0a0a12'
  },
  provinceBtnActive: {
    backgroundColor: '#b829dd',
    borderColor: '#b829dd'
  },
  provinceText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12
  },
  loader: {
    marginTop: 100
  },
  list: {
    paddingHorizontal: 20
  },
  empty: {
    color: '#555',
    textAlign: 'center',
    marginTop: 50
  },
  card: {
    backgroundColor: '#0a0a12',
    borderWidth: 1,
    borderColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700'
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  available: {
    backgroundColor: '#00f0ff'
  },
  unavailable: {
    backgroundColor: '#333'
  },
  badgeText: {
    fontSize: 12
  },
  location: {
    color: '#888',
    marginTop: 4
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12
  },
  price: {
    color: '#00f0ff',
    fontSize: 20,
    fontWeight: '800'
  },
  rating: {
    color: '#ffaa00',
    fontSize: 16
  },
  bookBtn: {
    backgroundColor: '#b829dd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  bookBtnDisabled: {
    backgroundColor: '#333'
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
  }
});
