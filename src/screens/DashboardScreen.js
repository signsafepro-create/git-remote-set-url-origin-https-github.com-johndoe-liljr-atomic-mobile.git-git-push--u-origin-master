import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '../api/client';

function StatCard({ label, value, color = '#00f0ff' }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen({ navigation }) {
  const [status, setStatus] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadStatus = async () => {
    try {
      const [health, stats] = await Promise.all([api.health(), api.getBrainStatus()]);
      setStatus({
        architect: stats.architect || 'Lil Jr',
        epoch: stats.epoch || Date.now(),
        status: health.status || 'ONLINE',
        leadsGenerated: stats.total_conversations || 0,
        pendingCampaigns: stats.pending_campaigns || 0,
        totalInsights: stats.knowledge || 0
      });
    } catch {
      setStatus(null);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStatus();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>CORE BRAIN</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00f0ff" />}
      >
        <View style={styles.grid}>
          <StatCard label="STATUS" value={status?.status || 'OFFLINE'} color={status ? '#00f0ff' : '#ff2a6d'} />
          <StatCard label="EPOCH" value={status?.epoch ? new Date(status.epoch).toLocaleTimeString() : '--:--:--'} />
          <StatCard label="LEADS" value={status?.leadsGenerated ?? 0} />
          <StatCard label="CAMPAIGNS" value={status?.pendingCampaigns ?? 0} />
          <StatCard label="KNOWLEDGE" value={`${status?.totalInsights ?? 0} insights`} color="#b829dd" />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>OMNIBRAIN v3.0</Text>
          <Text style={styles.infoText}>
            Architect: {status?.architect || 'Unknown'}{'\n'}
            Last Sync: {new Date().toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e'
  },
  backButton: {
    color: '#00f0ff',
    fontSize: 24,
    padding: 4
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#00f0ff',
    letterSpacing: 2
  },
  content: {
    flex: 1,
    padding: 20
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statCard: {
    width: '47%',
    backgroundColor: '#0a0a12',
    borderWidth: 1,
    borderColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12
  },
  statLabel: {
    color: '#b829dd',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800'
  },
  infoCard: {
    backgroundColor: '#0a0a12',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#ff2a6d'
  },
  infoTitle: {
    color: '#ff2a6d',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8
  },
  infoText: {
    color: '#888',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'monospace'
  }
});
