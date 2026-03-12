import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

import { defaultTheme } from '../features/themes';

interface NodeLabelData {
  label: string;
  description?: string;
}

function NodeLabel({ data }: NodeProps & { data: NodeLabelData }) {
  const { fontFamily, node, label: labelStyle, description: descStyle, handle: handleStyle } = defaultTheme;

  const containerStyle: React.CSSProperties = {
    padding: node.padding,
    borderRadius: `${node.borderRadius}px`,
    background: node.background,
    border: `${node.borderWidth}px solid ${node.borderColor}`,
    minWidth: node.minWidth,
    boxShadow: node.boxShadow,
    fontFamily,
  };

  const labelStyleCombined: React.CSSProperties = {
    fontWeight: labelStyle.fontWeight,
    fontSize: labelStyle.fontSize,
    color: labelStyle.color,
  };

  const descStyleCombined: React.CSSProperties = {
    fontSize: descStyle.fontSize,
    color: descStyle.color,
    marginTop: descStyle.marginTop,
  };

  return (
    <div style={containerStyle}>
      <Handle type="target" position={Position.Top} style={{ background: handleStyle.color }} />
      <div style={labelStyleCombined}>
        {data.label}
      </div>
      {data.description && (
        <div style={descStyleCombined}>
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: handleStyle.color }} />
    </div>
  );
}

export default memo(NodeLabel);
