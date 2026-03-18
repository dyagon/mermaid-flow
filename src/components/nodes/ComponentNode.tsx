import { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import BaseCardNode, { BaseCardNodeData } from '../base/BaseCardNode';

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '10px 14px',
    borderRadius: 2,
    backgroundColor: '#e0e7ff',
    border: '2px solid #6366f1',
    minWidth: 120,
    maxWidth: 300,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  label: {
    fontWeight: 600,
    fontSize: 15,
    color: '#333',
    overflowWrap: 'anywhere',
  },
  technology: {
    fontSize: 12,
    color: '#4338ca',
    marginTop: 2,
    overflowWrap: 'anywhere',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    overflowWrap: 'anywhere',
  },
  handle: {
    background: '#6366f1',
  },
};

function ComponentNode({ data }: NodeProps & { data: BaseCardNodeData }) {
  return <BaseCardNode data={data} containerStyle={styles.container} labelStyle={styles.label} technologyStyle={styles.technology} descriptionStyle={styles.description} handleStyle={styles.handle} />;
}

export default memo(ComponentNode);
