import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  description?: string;
  technology?: string;
  elementType?: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    border: '2px solid #4a90d9',
    minWidth: 140,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
  },
  technology: {
    fontSize: 11,
    color: '#1e40af',
    marginTop: 2,
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

function SystemNode({ data }: NodeProps & { data: NodeData }) {
  return (
    <div style={styles.container}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <div style={styles.label}>{data.label}</div>
      {data.technology && (
        <div style={styles.technology}>{data.technology}</div>
      )}
      {data.description && (
        <div style={styles.description}>{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

export default memo(SystemNode);
