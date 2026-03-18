import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseCardNode, { BaseCardNodeData } from '../base/BaseCardNode';

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '12px 16px',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    border: '2px solid #4a90d9',
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
    color: '#1e40af',
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
    background: '#4a90d9',
  },
};

function SystemNode({ data }: NodeProps & { data: BaseCardNodeData }) {
  return <BaseCardNode data={data} containerStyle={styles.container} labelStyle={styles.label} technologyStyle={styles.technology} descriptionStyle={styles.description} handleStyle={styles.handle} />;
}

export default memo(SystemNode);
