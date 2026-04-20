import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

// Brain regions and color map
const NEURONS = [
  { name: 'CORTEX', color: '#b829dd' },
  { name: 'LANGUAGE', color: '#00f0ff' },
  { name: 'LOGIC', color: '#00ffb8' },
  { name: 'MEMORY', color: '#ff2a6d' },
  { name: 'VISION', color: '#64ff8f' },
  { name: 'VOICE', color: '#ffb300' },
  { name: 'REASON', color: '#00f0ff' },
  { name: 'CORE', color: '#fbbf24' },
  { name: 'EMOTION', color: '#ff2a6d' },
  { name: 'LEARN', color: '#b829dd' },
  { name: 'OUTPUT', color: '#00ffb8' },
  { name: 'STT', color: '#00f0ff' },
  { name: 'TTS', color: '#ffb300' },
  { name: 'AUDITORY', color: '#ff2a6d' },
  { name: 'MOTOR', color: '#64ff8f' },
  { name: 'SENSORY', color: '#b829dd' },
];

// 25 synapse connections (pairs of neuron indices)
const SYNAPSES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [10, 11], [11, 12], [12, 13], [13, 14], [14, 15],
  [15, 0], [0, 8], [2, 10], [4, 12], [6, 14],
  [1, 9], [3, 11], [5, 13], [7, 15], [8, 12]
];

const BRAIN_STATES = [
  { name: 'IDLE', status: 'NEURAL STANDBY', active: [] },
  { name: 'THINKING', status: 'PROCESSING NEURAL PATHWAYS', active: [0,1,2,3,6,10] },
  { name: 'LISTENING', status: 'AUDITORY CORTEX ACTIVE', active: [5,11,12,13] },
];

const WIDTH = 340;
const HEIGHT = 340;
const CENTER = WIDTH / 2;
const RADIUS = 120;

function getNeuronPos(i) {
  // Place neurons in a circle
  const angle = (2 * Math.PI * i) / NEURONS.length;
  return {
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
  };
}

export default function NeuralBrain() {
  const [stateIdx, setStateIdx] = useState(0);
  const [firing, setFiring] = useState(Array(NEURONS.length).fill(false));
  const [pulse, setPulse] = useState(new Animated.Value(1));

  // Animate core node pulse
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  // Cycle brain state
  useEffect(() => {
    const interval = setInterval(() => {
      setStateIdx((idx) => (idx + 1) % BRAIN_STATES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Random firing for synapses and neurons
  useEffect(() => {
    const interval = setInterval(() => {
      setFiring((prev) => {
        const arr = [...prev];
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.random() < 0.25 || BRAIN_STATES[stateIdx].active.includes(i);
        }
        return arr;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [stateIdx]);

  // Holographic brain background (optional, replace with your own image)
  // const brainBg = require('../assets/brain_holo.png');

  return (
    <View style={styles.container}>
      {/* <Image source={brainBg} style={styles.bg} resizeMode="contain" /> */}
      <Svg width={WIDTH} height={HEIGHT} style={StyleSheet.absoluteFill}>
        {/* Synapses */}
        {SYNAPSES.map(([a, b], i) => {
          const p1 = getNeuronPos(a);
          const p2 = getNeuronPos(b);
          const active = firing[a] && firing[b];
          return (
            <Line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={active ? '#fff' : '#444'}
              strokeWidth={active ? 3 : 1.5}
              opacity={active ? 0.9 : 0.4}
            />
          );
        })}
        {/* Neurons */}
        {NEURONS.map((n, i) => {
          const { x, y } = getNeuronPos(i);
          const isCore = n.name === 'CORE';
          const scale = isCore ? pulse : 1;
          return (
            <AnimatedCircle
              key={n.name}
              cx={x}
              cy={y}
              r={isCore ? 22 : 14}
              fill={n.color}
              opacity={firing[i] ? 0.95 : 0.5}
              scale={isCore ? scale : 1}
              stroke={firing[i] ? '#fff' : '#222'}
              strokeWidth={isCore ? 4 : 2}
            />
          );
        })}
      </Svg>
      {/* Overlay neuron labels */}
      {NEURONS.map((n, i) => {
        const { x, y } = getNeuronPos(i);
        return (
          <Text
            key={n.name + '-label'}
            style={[styles.label, { left: x - 28, top: y - 8, color: n.color, opacity: firing[i] ? 1 : 0.5 }]}
          >
            {n.name}
          </Text>
        );
      })}
      {/* Status */}
      <View style={styles.statusWrap}>
        <Text style={[styles.status, { color: BRAIN_STATES[stateIdx].active.length ? '#00f0ff' : '#b829dd' }]}> 
          {BRAIN_STATES[stateIdx].status}
        </Text>
      </View>
    </View>
  );
}

// AnimatedCircle for core node pulse
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  bg: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    opacity: 0.18,
    zIndex: 0,
  },
  label: {
    position: 'absolute',
    fontWeight: 'bold',
    fontSize: 11,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    zIndex: 2,
    letterSpacing: 1,
  },
  statusWrap: {
    position: 'absolute',
    bottom: 18,
    width: '100%',
    alignItems: 'center',
    zIndex: 3,
  },
  status: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
