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
    backgroundColor: '#f0fdf4',
    border: '2px dashed #10b981',
    minWidth: 140,
    maxWidth: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
    overflowWrap: 'anywhere',
  },
  description: {
    fontSize: 12,
    color: '#666',
    overflowWrap: 'anywhere',
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

function PersonExtNode({ data }: NodeProps & { data: NodeData }) {
  const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

  return (
    <div style={styles.container}>
      {positions.map((position) => (
        <Handle key={`t-${position}`} id={`t-${position}`} type="target" position={position} style={styles.handle} />
      ))}
      {positions.map((position) => (
        <Handle key={`s-${position}`} id={`s-${position}`} type="source" position={position} style={styles.handle} />
      ))}
      <svg style={{ ...styles.icon, strokeDasharray: '4 2' }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </svg>
      <div>
        <div style={styles.label}>{data.label}</div>
        {data.description && (
          <div style={styles.description}>{data.description}</div>
        )}
      </div>
    </div>
  );
}

export default memo(PersonExtNode);
