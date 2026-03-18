import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseCardNode, { BaseCardNodeData } from '../base/BaseCardNode';

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    border: '2px solid #10b981',
    minWidth: 140,
    maxWidth: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: 600,
    fontSize: 16,
    color: '#333',
    overflowWrap: 'anywhere',
  },
  description: {
    fontSize: 14,
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
  content: {
    flex: 1,
    minWidth: 0,
  },
};

function PersonNode({ data }: NodeProps & { data: BaseCardNodeData }) {
  return (
    <BaseCardNode
      data={data}
      containerStyle={styles.container}
      labelStyle={styles.label}
      descriptionStyle={styles.description}
      handleStyle={styles.handle}
      contentStyle={styles.content}
      leading={(
        <svg style={styles.icon} viewBox="0 0 24 24" fill="none" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      )}
    />
  );
}

export default memo(PersonNode);
