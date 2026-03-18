import { ReactNode } from 'react';

import DirectionalHandles from './DirectionalHandles';

export interface BaseCardNodeData {
  label: string;
  description?: string;
  technology?: string;
  elementType?: string;
}

interface BaseCardNodeProps {
  data: BaseCardNodeData;
  containerStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  technologyStyle?: React.CSSProperties;
  handleStyle?: React.CSSProperties;
  leading?: ReactNode;
  contentStyle?: React.CSSProperties;
}

export default function BaseCardNode({
  data,
  containerStyle,
  labelStyle,
  descriptionStyle,
  technologyStyle,
  handleStyle,
  leading,
  contentStyle,
}: Readonly<BaseCardNodeProps>) {
  return (
    <div style={containerStyle}>
      <DirectionalHandles style={handleStyle} />
      {leading}
      <div style={{ textAlign: 'center', ...contentStyle }}>
        <div style={labelStyle}>{data.label}</div>
        {data.technology && technologyStyle && (
          <div style={technologyStyle}>{data.technology}</div>
        )}
        {data.description && descriptionStyle && (
          <div style={descriptionStyle}>{data.description}</div>
        )}
      </div>
    </div>
  );
}
