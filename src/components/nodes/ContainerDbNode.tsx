import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface NodeData {
  label: string;
  description?: string;
  elementType?: string;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    padding: '16px 20px',
    minWidth: 140,
    maxWidth: 300,
  },
  cylinder: {
    width: 80,
    height: 60,
    margin: '0 auto',
    position: 'relative',
  },
  ellipse: {
    width: 80,
    height: 20,
    backgroundColor: '#ddd6fe',
    border: '2px solid #8b5cf6',
    borderRadius: '50%',
    position: 'absolute',
    left: 0,
  },
  rectangle: {
    width: 80,
    height: 40,
    backgroundColor: '#ddd6fe',
    border: '2px solid #8b5cf6',
    borderTop: 'none',
    position: 'absolute',
    top: 10,
    left: 0,
  },
  label: {
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 600,
    fontSize: 14,
    color: '#333',
    overflowWrap: 'anywhere',
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    overflowWrap: 'anywhere',
  },
  handle: {
    background: '#8b5cf6',
  },
};

function ContainerDbNode({ data }: NodeProps & { data: NodeData }) {
  const positions = [Position.Top, Position.Right, Position.Bottom, Position.Left];

  return (
    <div style={styles.container}>
      {positions.map((position) => (
        <Handle key={`t-${position}`} id={`t-${position}`} type="target" position={position} style={styles.handle} />
      ))}
      {positions.map((position) => (
        <Handle key={`s-${position}`} id={`s-${position}`} type="source" position={position} style={styles.handle} />
      ))}
      <div style={styles.cylinder}>
        <div style={{ ...styles.ellipse, top: 0 }} />
        <div style={{ ...styles.ellipse, bottom: 0 }} />
        <div style={styles.rectangle} />
      </div>
      <div style={styles.label}>
        {data.label}
      </div>
      {data.description && (
        <div style={styles.description}>
          {data.description}
        </div>
      )}
    </div>
  );
}

export default memo(ContainerDbNode);
