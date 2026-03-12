import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, MarkerType } from '@xyflow/react';

const styles: Record<string, React.CSSProperties> = {
  label: {
    backgroundColor: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 11,
    border: '1px solid #ddd',
  },
  protocol: {
    fontSize: 10,
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
  sourcePosition,
  targetPosition,
  data,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relLabel = (data?.label as string) || (label as string | undefined) || '';
  const protocol = (data?.protocol as string) || '';

  return (
    <>
      {/* Forward arrow */}
      <path
        id={`${id}-forward`}
        style={{ strokeWidth: 2, stroke: '#999' }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={MarkerType.ArrowClosed}
      />
      {/* Backward arrow */}
      <path
        id={`${id}-backward`}
        style={{ strokeWidth: 2, stroke: '#999' }}
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
