import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  description?: string;
  elementType?: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    border: '2px dashed #4a90d9',
    minWidth: 140,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  handle: {
    background: '#4a90d9',
  },
};

function SystemExtNode({ data }: NodeProps & { data: NodeData }) {
  return (
    <div style={styles.container}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <div style={styles.label}>{data.label}</div>
      {data.description && (
        <div style={styles.description}>{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

export default memo(SystemExtNode);
