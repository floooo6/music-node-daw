import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function SamplerUINode({ data }) {
  return (
    <div style={styles.node}>
      <Handle type="target" position={Position.Left} id="in" style={styles.handle} />
      <div style={styles.title}>Sampler (Audio)</div>
      <div style={styles.content}>
        <em>Joue les notes entrantes</em>
      </div>
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
    color: '#AAA',
  },
  handle: {
    background: '#888',
    width: '10px',
    height: '10px',
  }
};
