import { memo } from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer, MarkerType } from '@xyflow/react';

const styles: Record<string, React.CSSProperties> = {
  label: {
    backgroundColor: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 13,
    border: '1px solid #ddd',
    maxWidth: 220,
    whiteSpace: 'normal' as const,
    overflowWrap: 'anywhere',
    wordBreak: 'break-word' as const,
    textAlign: 'center' as const,
  },
  protocol: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
};

function BiRelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const relLabel = (data?.label as string) || (label as string | undefined) || '';
  const protocol = (data?.protocol as string) || '';

  return (
    <>
      {/* Forward arrow */}
      <path
        id={`${id}-forward`}
        style={{ strokeWidth: 2, stroke: '#999', strokeDasharray: '6 4' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={MarkerType.ArrowClosed}
      />
      {/* Backward arrow */}
      <path
        id={`${id}-backward`}
        style={{ strokeWidth: 2, stroke: '#999', strokeDasharray: '6 4' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerStart={MarkerType.ArrowClosed}
      />
      {(relLabel || protocol) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            <div style={styles.label}>
              {relLabel || ''}
              {protocol && <div style={styles.protocol}>{protocol}</div>}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export default memo(BiRelEdge);
