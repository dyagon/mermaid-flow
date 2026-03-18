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
    backgroundColor: '#fef3c7',
    border: '2px solid #f59e0b',
    minWidth: 140,
    maxWidth: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
    overflowWrap: 'anywhere',
  },
  technology: {
    fontSize: 11,
    color: '#92400e',
    marginTop: 2,
    overflowWrap: 'anywhere',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    overflowWrap: 'anywhere',
  },
  handle: {
    background: '#f59e0b',
  },
};

function ContainerNode({ data }: NodeProps & { data: NodeData }) {
  const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

  return (
    <div style={styles.container}>
      {positions.map((position) => (
        <Handle key={`t-${position}`} id={`t-${position}`} type="target" position={position} style={styles.handle} />
      ))}
      {positions.map((position) => (
        <Handle key={`s-${position}`} id={`s-${position}`} type="source" position={position} style={styles.handle} />
      ))}
      <div style={styles.label}>{data.label}</div>
      {data.technology && (
        <div style={styles.technology}>{data.technology}</div>
      )}
      {data.description && (
        <div style={styles.description}>{data.description}</div>
      )}
    </div>
  );
}

export default memo(ContainerNode);
