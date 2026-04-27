import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { API_BASE_URL } from '../config/api';

export default function LiveTerminal({ filePath = 'live_code.py' }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const scrollRef = useRef();

  // Fetch file contents periodically
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/read_file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: filePath })
        });
        const data = await res.json();
        setLines(data.lines || []);
      } catch {}
    };
    fetchFile();
    const interval = setInterval(fetchFile, 2000);
    return () => clearInterval(interval);
  }, [filePath]);

  // Send code line to backend
  const sendLine = async () => {
    if (!input.trim()) return;
    setOutput('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/append_file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: filePath, line: input })
      });
      const data = await res.json();
      setOutput(data.status || '');
      setInput('');
    } catch (e) {
      setOutput('Error: ' + e.message);
    }
  };

  // Redeploy/reload backend
  const redeploy = async () => {
    setOutput('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/run_command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'systemctl restart liljr' })
      });
      const data = await res.json();
      setOutput(data.output || data.status || '');
    } catch (e) {
      setOutput('Error: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lil Jr Live Terminal</Text>
      <ScrollView style={styles.terminal} ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {lines.map((line, idx) => (
          <Text key={idx} style={styles.line}>{line}</Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type code or command..."
        onSubmitEditing={sendLine}
        returnKeyType="send"
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={sendLine}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={redeploy}>
          <Text style={styles.buttonText}>Redeploy</Text>
        </TouchableOpacity>
      </View>
      {!!output && <Text style={styles.output}>{output}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', flex: 1, padding: 12 },
  title: { color: '#00f0ff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  terminal: { backgroundColor: '#222', borderRadius: 8, padding: 8, height: 220, marginBottom: 8 },
  line: { color: '#fff', fontFamily: 'monospace', fontSize: 14 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 6, padding: 8, marginBottom: 8 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  button: { backgroundColor: '#00f0ff', borderRadius: 6, padding: 10, marginHorizontal: 4 },
  buttonText: { color: '#111', fontWeight: 'bold' },
  output: { color: '#b829dd', marginTop: 6, fontSize: 13 },
});
