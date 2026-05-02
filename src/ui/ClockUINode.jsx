import React from 'react';
import { Handle, Position } from '@xyflow/react';

import { useReactFlow } from '@xyflow/react';
import musicEngine from '../engine/MusicEngine';

export function ClockUINode({ id, data }) {
  const { setNodes } = useReactFlow();

  const handleChange = (e) => {
    const val = e.target.value;
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, interval: val } } : n));
    const logic = musicEngine.nodes.get(id);
    if (logic) logic.setInterval(val);
  };

  return (
    <div style={styles.node}>
      <div style={styles.title}>Horloge</div>
      <div style={styles.content}>
        <label>
          Interval:
          <select value={data.interval} onChange={handleChange} style={styles.select}>
            <option value="4n">Noire</option>
            <option value="8n">Croche</option>
            <option value="16n">Double croche</option>
          </select>
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
    gap: '4px',
  },
  select: {
    marginLeft: '5px',
    background: '#333',
    color: '#FFF',
    border: 'none',
    padding: '2px 4px',
    borderRadius: '4px',
  },
  handle: {
    background: '#888',
    width: '10px',
    height: '10px',
  }
};
