import { memo } from 'react';
import { NodeProps } from '@xyflow/react';

interface BoundaryData {
  label: string;
  childIds: string[];
  boundaryType?: 'Enterprise_Boundary' | 'System_Boundary';
  width?: number;
  height?: number;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  label: {
    position: 'absolute' as const,
    top: -24,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '2px 8px',
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    textAlign: 'center' as const,
  },
};

function BoundaryNode({ data }: NodeProps) {
  const boundaryData = data as unknown as BoundaryData;

  const borderColor = boundaryData.boundaryType === 'Enterprise_Boundary' ? '#dc2626' : '#059669';
  const borderStyle = boundaryData.boundaryType === 'Enterprise_Boundary' ? '2px dashed' : '2px solid';

  return (
    <div
      style={{
        ...styles.container,
        width: boundaryData.width || 200,
        height: boundaryData.height || 150,
        border: `${borderStyle} ${borderColor}`,
      }}
    >
      <div style={{ ...styles.label, color: borderColor }}>
        {boundaryData.label}
      </div>
    </div>
  );
}

export default memo(BoundaryNode);
