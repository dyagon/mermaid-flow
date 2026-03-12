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
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  handle: {
    background: '#8b5cf6',
  },
};

function ContainerDbNode({ data }: NodeProps & { data: NodeData }) {
  return (
    <div style={styles.container}>
      <Handle type="target" position={Position.Top} style={styles.handle} />
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
      <Handle type="source" position={Position.Bottom} style={styles.handle} />
    </div>
  );
}

export default memo(ContainerDbNode);
