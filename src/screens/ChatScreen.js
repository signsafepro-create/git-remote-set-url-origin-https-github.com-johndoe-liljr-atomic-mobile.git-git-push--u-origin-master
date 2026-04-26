import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';
import {
  View,
  TextInput,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { api } from '../api/client';
import MessageBubble from '../components/MessageBubble';
import VoiceButton from '../components/VoiceButton';

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Yo. What's good? I'm Lil Jr and I remember everything. What are we building today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // Voice input disabled due to incompatibility
  const [realisticMode, setRealisticMode] = useState(false);

  // Free talk mode: no wake word required

  // Voice input disabled due to incompatibility with Expo SDK 55

  // Voice button now triggers text-to-speech for the last assistant message
  const handleVoice = () => {
    const lastAssistant = messages.slice().reverse().find(m => m.role === 'assistant');
    if (lastAssistant) {
      Speech.speak(lastAssistant.content, { rate: 1.0, pitch: 1.0 });
    }
  };
  const scrollViewRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    // Add user message to local state
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Pass a flag to the backend for realistic mode (for now, just append to message)
      const messageToSend = realisticMode ? `[REALISTIC] ${userMsg.content}` : userMsg.content;
      // Send last 10 messages as history for memory
      const history = [...messages, userMsg].slice(-10).map(({ role, content }) => ({ role, content }));
      const response = await api.chat(messageToSend, 'mobile-user', 'street', history);
      const assistantMsg = {
        id: generateId(),
        role: 'assistant',
        content: response.reply || response.response || 'No response yet.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, assistantMsg]);
      // Speak the assistant's reply
      Speech.speak(assistantMsg.content, { rate: 1.0, pitch: 1.0 });
    } catch {
      const errorMsg = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I could not process your request. Please try again.',
        timestamp: Date.now()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [input, loading, scrollToBottom, realisticMode, messages]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.toggleButton, realisticMode && styles.toggleButtonActive]}
          onPress={() => setRealisticMode((v) => !v)}
        >
          <Text style={styles.toggleButtonText}>{realisticMode ? 'Realistic ON' : 'Realistic OFF'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LIL JR</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, loading && styles.statusDotThinking]} />
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} text={msg.content} />
        ))}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#00f0ff" />
            <Text style={styles.loadingText}>Lil Jr is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <VoiceButton active={voiceActive} onPress={handleVoice} />
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Say something..."
          placeholderTextColor="#555"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 60,
    padding: 8
  },
  backText: {
    color: '#00f0ff',
    fontSize: 24
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#00f0ff',
    letterSpacing: 2
  },
  statusIndicator: {
    position: 'absolute',
    right: 20,
    top: 66
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00f0ff'
  },
  statusDotThinking: {
    backgroundColor: '#ffaa00'
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 8,
    maxWidth: '100%'
  },
  userRow: {
    flexDirection: 'row-reverse'
  },
  assistantRow: {
    flexDirection: 'row'
  },
  avatarContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  avatarText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '700'
  },
  bubble: {
    maxWidth: '75%',
    padding: 14,
    borderRadius: 16
  },
  userBubble: {
    backgroundColor: '#b829dd',
    borderBottomRightRadius: 4
  },
  assistantBubble: {
    backgroundColor: '#0a0a12',
    borderLeftWidth: 3,
    borderLeftColor: '#00f0ff',
    borderBottomLeftRadius: 4
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20
  },
  timestamp: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 48,
    marginTop: 8,
    gap: 8
  },
  loadingText: {
    color: '#ffaa00',
    fontSize: 12,
    fontStyle: 'italic'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    backgroundColor: '#050508',
    gap: 12
  },
  input: {
    flex: 1,
    backgroundColor: '#0a0a12',
    borderWidth: 1,
    borderColor: '#1a1a2e',
    borderRadius: 24,
    padding: 14,
    paddingHorizontal: 18,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#00f0ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonDisabled: {
    backgroundColor: '#1a1a2e'
  },
  sendText: {
    color: '#000',
    fontSize: 22,
    fontWeight: '800'
  }
});
