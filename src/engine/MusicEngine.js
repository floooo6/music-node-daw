import * as Tone from 'tone';

class MusicEngine {
  constructor() {
    this.nodes = new Map();
    this.connections = [];
    this.isPlaying = false;
    this.bpm = 120;

    Tone.Transport.bpm.value = this.bpm;
  }

  async start() {
    await Tone.start();
    Tone.Transport.start();
    this.isPlaying = true;
    console.log('MusicEngine started');
  }

  stop() {
    Tone.Transport.stop();
    this.isPlaying = false;
    console.log('MusicEngine stopped');
  }

  setBpm(bpm) {
    this.bpm = bpm;
    Tone.Transport.bpm.value = this.bpm;
  }

  addNode(id, nodeInstance) {
    this.nodes.set(id, nodeInstance);
    // Give the node a reference to the engine to allow dynamic processing
    nodeInstance.engine = this;
  }

  removeNode(id) {
    if (this.nodes.has(id)) {
      const node = this.nodes.get(id);
      if (typeof node.destroy === 'function') {
        node.destroy();
      }
      this.nodes.delete(id);
    }
    this.connections = this.connections.filter(
      (conn) => conn.source !== id && conn.target !== id
    );
  }

  connect(sourceId, targetId, sourceHandle = null, targetHandle = null) {
    this.connections.push({ source: sourceId, target: targetId, sourceHandle, targetHandle });
  }

  disconnect(sourceId, targetId, sourceHandle = null, targetHandle = null) {
    this.connections = this.connections.filter(
      (conn) =>
        !(conn.source === sourceId && conn.target === targetId && conn.sourceHandle === sourceHandle && conn.targetHandle === targetHandle)
    );
  }

  // Called by source nodes (like Clock, etc) to propagate events
  emitEvent(sourceId, event, sourceHandle = null) {
    // Find all connections from this source
    const targets = this.connections.filter(
      (conn) => conn.source === sourceId && (sourceHandle === null || conn.sourceHandle === sourceHandle)
    );

    targets.forEach((conn) => {
      const targetNode = this.nodes.get(conn.target);
      if (targetNode && typeof targetNode.process === 'function') {
        // Execute target logic immediately (synchronously)
        targetNode.process(event, conn.targetHandle);
      }
    });
  }
}

// Export a singleton instance
const musicEngine = new MusicEngine();
export default musicEngine;
