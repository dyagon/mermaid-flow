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
    padding: '10px 14px',
    borderRadius: 2,
    backgroundColor: '#e0e7ff',
    border: '2px solid #6366f1',
    minWidth: 120,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: 13,
    color: '#333',
  },
  technology: {
    fontSize: 10,
    color: '#4338ca',
    marginTop: 2,
  },
  description: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  handle: {
    background: '#6366f1',
  },
};

function ComponentNode({ data }: NodeProps & { data: NodeData }) {
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

export default memo(ComponentNode);
