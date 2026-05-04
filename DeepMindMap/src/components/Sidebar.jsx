import React from 'react';
import { Upload, ChevronRight, Layers, Info } from 'lucide-react';

const Sidebar = ({ onFileUpload, selectedNode, isProcessing }) => {
  return (
    <div className="glass-panel" style={{
      width: '320px',
      height: 'calc(100vh - 40px)',
      margin: '20px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'absolute',
      zIndex: 10,
      left: 0,
      top: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Layers size={24} color="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>DeepMindMap</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Source Document
        </label>
        <div 
          onClick={() => document.getElementById('pdf-upload').click()}
          style={{
            padding: '20px',
            border: '2px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
          onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        >
          <Upload size={24} style={{ marginBottom: '8px', color: 'var(--accent-cyan)' }} />
          <div style={{ fontSize: '14px' }}>Click to upload PDF</div>
          <input 
            id="pdf-upload" 
            type="file" 
            accept="application/pdf" 
            onChange={onFileUpload} 
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {selectedNode && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Selected Branch
            </label>
            <h3 style={{ margin: '8px 0', fontSize: '16px', color: 'var(--accent-cyan)' }}>
              {selectedNode.data.label}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Click on the node in the map to expand it further into the document's nuances.
            </p>
          </div>
          
          <div className="glass-panel" style={{ padding: '12px', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Info size={14} color="var(--accent-purple)" />
              <span style={{ fontWeight: 600 }}>Pro Tip</span>
            </div>
            You can go up to 10 levels deep. Each level uncovers more specific technical data.
          </div>
        </div>
      )}

      {isProcessing && (
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          right: '24px',
          padding: '12px',
          background: 'var(--bg-glass)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div className="spinner" style={{
            width: '16px',
            height: '16px',
            border: '2px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--accent-cyan)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ fontSize: '13px' }}>Expanding branch...</span>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
