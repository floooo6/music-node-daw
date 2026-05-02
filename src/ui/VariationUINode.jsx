import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useReactFlow } from '@xyflow/react';
import musicEngine from '../engine/MusicEngine';

export function VariationUINode({ id, data }) {
  const { setNodes } = useReactFlow();

  const handleTranspose = (e) => {
    const val = parseInt(e.target.value, 10);
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, transpose: val } } : n));
    const logic = musicEngine.nodes.get(id);
    if (logic) logic.setTranspose(val);
  };

  const handleHumanize = (e) => {
    const val = parseFloat(e.target.value);
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, humanize: val } } : n));
    const logic = musicEngine.nodes.get(id);
    if (logic) logic.setHumanize(val);
  };

  const handleInversion = (e) => {
    const val = e.target.checked;
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, inversion: val } } : n));
    const logic = musicEngine.nodes.get(id);
    if (logic) logic.setInversion(val);
  };

  const handleRetrograde = (e) => {
    const val = e.target.checked;
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, retrograde: val } } : n));
    const logic = musicEngine.nodes.get(id);
    if (logic) logic.setRetrograde(val);
  };

  return (
    <div style={styles.node}>
      <Handle type="target" position={Position.Left} id="in" style={styles.handle} />
      <div style={styles.title}>Variation (Effets)</div>
      <div style={styles.content}>
        <label style={styles.label}>
          Transposition:
          <input
            type="number"
            value={data.transpose}
            onChange={handleTranspose}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Humanisation (s):
          <input
            type="number"
            step="0.01"
            value={data.humanize}
            onChange={handleHumanize}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Inversion (Accords):
          <input
            type="checkbox"
            checked={data.inversion || false}
            onChange={handleInversion}
            style={styles.checkbox}
          />
        </label>
        <label style={styles.label}>
          Rétrograde (Accords):
          <input
            type="checkbox"
            checked={data.retrograde || false}
            onChange={handleRetrograde}
            style={styles.checkbox}
          />
        </label>
      </div>
      <Handle type="source" position={Position.Right} id="out" style={styles.handle} />
    </div>
  );
}

const styles = {
  node: {
    padding: '10px',
    borderRadius: '8px',
    background: '#1A1A1A',
    color: '#FFF',
    border: '1px solid #333',
    minWidth: '150px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '8px',
    borderBottom: '1px solid #444',
    paddingBottom: '4px',
  },
  content: {
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    width: '40px',
    background: '#333',
    color: '#FFF',
    border: 'none',
    padding: '2px 4px',
    borderRadius: '4px',
    marginLeft: '5px'
  },
  handle: {
    background: '#888',
    width: '10px',
    height: '10px',
  }
};
