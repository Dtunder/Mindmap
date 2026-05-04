import React, { useState, useCallback } from 'react';
import { ReactFlowProvider, useNodesState, useEdgesState, addEdge } from 'reactflow';
import MindMap from './components/MindMap';
import Sidebar from './components/Sidebar';
import { extractTextFromPDF, getContextSnippet } from './utils/pdfProcessor';

const initialNodes = [
  {
    id: 'root',
    type: 'input',
    data: { label: 'Upload a PDF to start', depth: 0 },
    position: { x: 250, y: 5 },
    className: 'neon-border-cyan'
  }
];

const App = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsProcessing(true);
      try {
        const text = await extractTextFromPDF(file);
        setPdfText(text);
        
        const initialTopics = [
          'Overview & Abstract',
          'Key Methodology',
          'Results & Discussion',
          'Conclusion'
        ];
        
        const newNodes = initialTopics.map((topic, i) => ({
          id: `node-${i}`,
          data: { label: topic, depth: 1 },
          position: { x: i * 250, y: 150 },
          className: 'neon-border-purple'
        }));
        
        const newEdges = initialTopics.map((_, i) => ({
          id: `edge-${i}`,
          source: 'root',
          target: `node-${i}`
        }));
        
        setNodes([
          { id: 'root', data: { label: file.name, depth: 0 }, position: { x: 250, y: 5 }, className: 'neon-border-cyan' },
          ...newNodes
        ]);
        setEdges(newEdges);
      } catch (error) {
        console.error('PDF Processing Error:', error);
        alert('Failed to process PDF. Check console for details.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleNodeClick = async (event, node) => {
    setSelectedNode(node);
    if (node.id === 'root') return;
    
    setIsProcessing(true);
    
    // Recursive Expansion Logic (Simulation)
    setTimeout(() => {
      // Check if sub-nodes already exist for this node
      const subNodePrefix = `${node.id}-sub-`;
      const hasSubNodes = nodes.some(n => n.id.startsWith(subNodePrefix));
      
      if (hasSubNodes) {
        setIsProcessing(false);
        return;
      }

      const currentDepth = node.data.depth || 1;
      const subTopics = [
        `Detailed Aspect A of ${node.data.label}`,
        `Specific Nuance B`,
        `Technical Detail C`
      ];
      
      const newNodes = subTopics.map((topic, i) => ({
        id: `${node.id}-sub-${i}`,
        data: { label: topic, depth: currentDepth + 1 },
        position: { x: node.position.x + (i - 1) * 200, y: node.position.y + 150 },
        className: 'neon-border-cyan'
      }));
      
      const newEdges = subTopics.map((_, i) => ({
        id: `edge-${node.id}-sub-${i}`,
        source: node.id,
        target: `${node.id}-sub-${i}`
      }));
      
      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Sidebar 
        onFileUpload={handleFileUpload} 
        selectedNode={selectedNode} 
        isProcessing={isProcessing}
      />
      <div style={{ position: 'absolute', inset: 0 }}>
        <MindMap 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick} 
        />
      </div>
    </div>
  );
};

// Wrap with provider
const AppWrapper = () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);

export default AppWrapper;
