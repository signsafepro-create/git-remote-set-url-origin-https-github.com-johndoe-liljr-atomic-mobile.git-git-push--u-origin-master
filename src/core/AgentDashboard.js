// AgentDashboard: UI for monitoring and controlling agents
import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useCoreBrain } from './CoreBrain';

export default function AgentDashboard() {
  const { agents, diagnostics, heal, deployAgent } = useCoreBrain();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Core Brain Agents</Text>
      <Text style={styles.status}>System Health: {diagnostics.healthy ? '✅ Healthy' : '❌ Issues'}</Text>
      <Text style={styles.status}>Last Check: {new Date(diagnostics.lastCheck).toLocaleTimeString()}</Text>
      {diagnostics.issues.length > 0 && (
        <View style={styles.issues}>
          {diagnostics.issues.map((issue, i) => (
            <Text key={i} style={styles.issue}>{issue}</Text>
          ))}
        </View>
      )}
      {agents.map(agent => (
        <View key={agent.name} style={styles.agent}>
          <Text style={styles.agentName}>{agent.name}</Text>
          <Text style={styles.agentRole}>{agent.role}</Text>
          <Text style={styles.agentStatus}>Status: {agent.status}</Text>
          <Button title={`Deploy ${agent.name}`} onPress={() => deployAgent(agent.name)} />
        </View>
      ))}
      <Button title="Heal System" color="#4caf50" onPress={heal} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#111' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  status: { color: '#fff', marginBottom: 4 },
  issues: { backgroundColor: '#330', padding: 8, borderRadius: 6, marginBottom: 8 },
  issue: { color: '#ffb300' },
  agent: { backgroundColor: '#222', padding: 12, borderRadius: 8, marginBottom: 16 },
  agentName: { fontSize: 18, fontWeight: 'bold', color: '#4caf50' },
  agentRole: { color: '#bbb', marginBottom: 4 },
  agentStatus: { color: '#fff', marginBottom: 4 },
});
