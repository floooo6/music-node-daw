import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Moteur et Nœuds Logiques
import musicEngine from './engine/MusicEngine';
import { ClockNode } from './nodes/ClockNode';
import { ChordEngineNode } from './nodes/ChordEngineNode';
import { MelodyGeneratorNode } from './nodes/MelodyGeneratorNode';
import { VariationNode } from './nodes/VariationNode';
import { SamplerNode } from './nodes/SamplerNode';

// Composants Nœuds UI
import { ClockUINode } from './ui/ClockUINode';
import { ChordEngineUINode } from './ui/ChordEngineUINode';
import { MelodyGeneratorUINode } from './ui/MelodyGeneratorUINode';
import { VariationUINode } from './ui/VariationUINode';
import { SamplerUINode } from './ui/SamplerUINode';

const nodeTypes = {
  clock: ClockUINode,
  chord: ChordEngineUINode,
  melody: MelodyGeneratorUINode,
  variation: VariationUINode,
  sampler: SamplerUINode,
};

const initialNodes = [
  {
    id: 'clock-1',
    type: 'clock',
    position: { x: 50, y: 150 },
    data: { interval: '4n' },
  },
  {
    id: 'chord-1',
    type: 'chord',
    position: { x: 250, y: 150 },
    data: { progression: 'II-V-I' },
  },
  {
    id: 'melody-1',
    type: 'melody',
    position: { x: 450, y: 150 },
    data: { pattern: 'up' },
  },
  {
    id: 'variation-1',
    type: 'variation',
    position: { x: 650, y: 150 },
    data: { transpose: 0, humanize: 0.02 },
  },
  {
    id: 'sampler-1',
    type: 'sampler',
    position: { x: 850, y: 150 },
    data: {},
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'clock-1', target: 'chord-1' },
  { id: 'e2-3', source: 'chord-1', target: 'melody-1' },
  { id: 'e3-4', source: 'melody-1', target: 'variation-1' },
  { id: 'e4-5', source: 'variation-1', target: 'sampler-1' },
];

const btnStyle = {
  background: '#333',
  color: '#FFF',
  border: '1px solid #555',
  padding: '5px 10px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isPlaying, setIsPlaying] = useState(false);
  const initDone = useRef(false);

  // Initialisation du moteur et des nœuds logiques
  useEffect(() => {
    if (!initDone.current) {
      // Instanciation des nœuds logiques
      const clockLogic = new ClockNode('clock-1');
      const chordLogic = new ChordEngineNode('chord-1');
      const melodyLogic = new MelodyGeneratorNode('melody-1');
      const varLogic = new VariationNode('variation-1');
      const samplerLogic = new SamplerNode('sampler-1');

      musicEngine.addNode('clock-1', clockLogic);
      musicEngine.addNode('chord-1', chordLogic);
      musicEngine.addNode('melody-1', melodyLogic);
      musicEngine.addNode('variation-1', varLogic);
      musicEngine.addNode('sampler-1', samplerLogic);

      // Création des connexions initiales
      initialEdges.forEach(edge => {
        musicEngine.connect(edge.source, edge.target);
      });

      initDone.current = true;
    }

    // Cleanup à la destruction
    return () => {
      musicEngine.stop();
    };
  }, []);


  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
    musicEngine.connect(params.source, params.target);
  }, [setEdges]);

  const onEdgesDelete = useCallback((deletedEdges) => {
    deletedEdges.forEach(edge => {
      musicEngine.disconnect(edge.source, edge.target);
    });
  }, []);

  const onNodesDelete = useCallback((deletedNodes) => {
    deletedNodes.forEach(node => {
      musicEngine.removeNode(node.id);
    });
  }, []);

  const togglePlay = async () => {
    if (!isPlaying) {
      await musicEngine.start();
      // On lance toutes les horloges
      musicEngine.nodes.forEach((node, id) => {
        if (id.startsWith('clock') && typeof node.start === 'function') {
          node.start();
        }
      });
      setIsPlaying(true);
    } else {
      musicEngine.stop();
      musicEngine.nodes.forEach((node, id) => {
        if (id.startsWith('clock') && typeof node.stop === 'function') {
          node.stop();
        }
      });
      setIsPlaying(false);
    }
  };

  const addNode = (type) => {
    const id = `${type}-${Date.now()}`;
    const position = { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 };

    // Add logic node
    let logicNode;
    let data = {};
    if (type === 'clock') {
      logicNode = new ClockNode(id);
      data = { interval: '4n' };
    } else if (type === 'chord') {
      logicNode = new ChordEngineNode(id);
      data = { progression: 'II-V-I' };
    } else if (type === 'melody') {
      logicNode = new MelodyGeneratorNode(id);
      data = { pattern: 'up' };
    } else if (type === 'variation') {
      logicNode = new VariationNode(id);
      data = { transpose: 0, humanize: 0.02, inversion: false, retrograde: false };
    } else if (type === 'sampler') {
      logicNode = new SamplerNode(id);
    }

    musicEngine.addNode(id, logicNode);
    if (isPlaying && type === 'clock') {
      logicNode.start();
    }

    // Add UI node
    setNodes((nds) => [
      ...nds,
      {
        id,
        type,
        position,
        data,
      },
    ]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, background: '#111', padding: '10px', borderRadius: '8px', color: '#FFF' }}>
        <h2>Générateur Musical Nodulaire</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={togglePlay}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: isPlaying ? '#D32F2F' : '#388E3C',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? 'Stop' : 'Start Audio'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxWidth: '300px' }}>
          <button onClick={() => addNode('clock')} style={btnStyle}>+ Clock</button>
          <button onClick={() => addNode('chord')} style={btnStyle}>+ Chord</button>
          <button onClick={() => addNode('melody')} style={btnStyle}>+ Melody</button>
          <button onClick={() => addNode('variation')} style={btnStyle}>+ Variation</button>
          <button onClick={() => addNode('sampler')} style={btnStyle}>+ Sampler</button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#444" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
