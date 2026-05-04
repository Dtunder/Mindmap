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

        // Parse the text into logical paragraphs instead of using hardcoded mock topics
        const paragraphs = text.split(/\n\s*\n/)
          .map(p => p.trim())
          .filter(p => p.length > 20); // Filter out empty or very short lines

        // Take up to the first 4 paragraphs as main topics
        const initialTopics = paragraphs.slice(0, 4);

        if (initialTopics.length === 0) {
          initialTopics.push('No readable text found in PDF');
        }

        const newNodes = initialTopics.map((topicText, i) => {
          // Truncate to make a good label, but store full text
          const label = topicText.length > 60 ? topicText.substring(0, 60) + '...' : topicText;
          return {
            id: `node-${i}`,
            data: { label: label, fullText: topicText, depth: 1 },
            position: { x: (i - (initialTopics.length - 1) / 2) * 350 + 250, y: 150 },
            className: 'neon-border-purple'
          };
        });

        const newEdges = initialTopics.map((_, i) => ({
          id: `edge-${i}`,
          source: 'root',
          target: `node-${i}`,
          animated: true,
          style: { stroke: '#00f2ff', strokeWidth: 2 }
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

    // Recursive Expansion Logic (using real text)
    setTimeout(() => {
      // Check if sub-nodes already exist for this node
      const subNodePrefix = `${node.id}-sub-`;
      const hasSubNodes = nodes.some(n => n.id.startsWith(subNodePrefix));

      if (hasSubNodes || !node.data.fullText) {
        setIsProcessing(false);
        return;
      }

      const currentDepth = node.data.depth || 1;

      // Split the paragraph into sentences
      const sentences = node.data.fullText.match(/[^.!?]+[.!?]+/g) || [node.data.fullText];

      // Take up to 3 sentences as sub-topics (excluding the very first one if it was used for the label mostly)
      const sentencesToUse = sentences.length > 1 ? sentences.slice(1, 4) : sentences;

      const subTopics = sentencesToUse.map(s => s.trim()).filter(s => s.length > 5);

      if (subTopics.length === 0) {
        subTopics.push("End of branch.");
      }

      const newNodes = subTopics.map((topicText, i) => {
        const label = topicText.length > 50 ? topicText.substring(0, 50) + '...' : topicText;
        return {
          id: `${node.id}-sub-${i}`,
          data: { label: label, fullText: topicText, depth: currentDepth + 1 },
          position: { x: node.position.x + (i - (subTopics.length - 1) / 2) * 250, y: node.position.y + 200 },
          className: 'neon-border-cyan'
        };
      });

      const newEdges = subTopics.map((_, i) => ({
        id: `edge-${node.id}-sub-${i}`,
        source: node.id,
        target: `${node.id}-sub-${i}`,
        animated: true,
        style: { stroke: '#00f2ff', strokeWidth: 2 }
      }));

      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
      setIsProcessing(false);
    }, 400);
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
