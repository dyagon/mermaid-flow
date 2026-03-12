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
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '2px solid #10b981',
    minWidth: 140,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
  handle: {
    background: '#10b981',
  },
  icon: {
    width: 24,
    height: 24,
    stroke: '#10b981',
  },
};

function PersonNode({ data }: NodeProps & { data: NodeData }) {
  return (
    <div style={styles.container}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
      <svg style={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
      <div>
        <div style={styles.label}>{data.label}</div>
        {data.description && (
          <div style={styles.description}>{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

export default memo(PersonNode);
