import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

import { defaultTheme } from '../features/themes';

interface NodeLabelData {
  label: string;
  description?: string;
}

function NodeLabel({ data }: NodeProps & { data: NodeLabelData }) {
  const { fontFamily, node, label: labelStyle, description: descStyle, handle: handleStyle } = defaultTheme;

  return (
    <div style={{
      padding: node.padding,
      borderRadius: `${node.borderRadius}px`,
      background: node.background,
      border: `${node.borderWidth}px solid ${node.borderColor}`,
      minWidth: node.minWidth,
      boxShadow: node.boxShadow,
      fontFamily,
    }}>
      <Handle type="target" position={Position.Top} style={{ background: handleStyle.color }} />
      <div style={{
        fontWeight: labelStyle.fontWeight,
        fontSize: labelStyle.fontSize,
        color: labelStyle.color,
      }}>
        {data.label}
      </div>
      {data.description && (
        <div style={{
          fontSize: descStyle.fontSize,
          color: descStyle.color,
          marginTop: descStyle.marginTop,
        }}>
          {data.description}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: handleStyle.color }} />
    </div>
  );
}

export default memo(NodeLabel);
