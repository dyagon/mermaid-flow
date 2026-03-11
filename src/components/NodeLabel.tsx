import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeLabelData {
  label: string;
  description?: string;
}

function NodeLabel({ data }: NodeProps & { data: NodeLabelData }) {
  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: '#fff',
      border: '2px solid #4a90d9',
      minWidth: '140px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#4a90d9' }} />
      <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>{data.label}</div>
      {data.description && (
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#4a90d9' }} />
    </div>
  );
}

export default memo(NodeLabel);
