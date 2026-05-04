import React, { useCallback, useState } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState 
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'root',
    type: 'input',
    data: { label: 'Upload a PDF to start' },
    position: { x: 250, y: 5 },
    className: 'neon-border-cyan'
  },
];

const initialEdges = [];

const MindMap = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#1a1a20" gap={20} />
        <Controls />
        <MiniMap 
          nodeColor="#bc13fe" 
          maskColor="rgba(0, 0, 0, 0.3)" 
          style={{ background: '#0a0a0c', border: '1px solid rgba(255,255,255,0.1)' }}
        />
      </ReactFlow>
    </div>
  );
};

export default MindMap;
