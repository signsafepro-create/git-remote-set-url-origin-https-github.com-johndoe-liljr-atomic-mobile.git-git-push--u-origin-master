// CoreBrain: Central orchestrator for agents, diagnostics, and self-healing
import React, { createContext, useContext, useState, useEffect } from 'react';

const CoreBrainContext = createContext();

export function useCoreBrain() {
  return useContext(CoreBrainContext);
}

const defaultAgents = [
  { name: 'Watcher', status: 'idle', role: 'Monitors health, events, and logs' },
  { name: 'Builder', status: 'idle', role: 'Builds, deploys, and scaffolds new features' },
  { name: 'Healer', status: 'idle', role: 'Diagnoses and fixes issues automatically' },
  { name: 'Optimizer', status: 'idle', role: 'Improves performance, cost, and bundle size' }
];

export function CoreBrainProvider({ children }) {
  const [agents, setAgents] = useState(defaultAgents);
  const [diagnostics, setDiagnostics] = useState({ healthy: true, lastCheck: Date.now(), issues: [] });

  // Simulate agent activity and diagnostics
  useEffect(() => {
    const interval = setInterval(() => {
      setDiagnostics(d => ({ ...d, lastCheck: Date.now() }));
      setAgents(a => a.map(agent => ({ ...agent, status: Math.random() > 0.9 ? 'active' : 'idle' })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Self-healing stub
  function heal() {
    setDiagnostics(d => ({ ...d, healthy: true, issues: [] }));
    setAgents(a => a.map(agent => ({ ...agent, status: 'healing' })));
    setTimeout(() => setAgents(defaultAgents), 2000);
  }

  // Agent deployment stub
  function deployAgent(agentName) {
    setAgents(a => a.map(agent => agent.name === agentName ? { ...agent, status: 'deploying' } : agent));
    setTimeout(() => setAgents(defaultAgents), 2000);
  }

  // Expose context
  return (
    <CoreBrainContext.Provider value={{ agents, diagnostics, heal, deployAgent }}>
      {children}
    </CoreBrainContext.Provider>
  );
}
