import { Fragment } from 'react';
import { Handle, Position } from '@xyflow/react';

interface DirectionalHandlesProps {
  style?: React.CSSProperties;
}

const POSITIONS: Position[] = [Position.Top, Position.Right, Position.Bottom, Position.Left];

export default function DirectionalHandles({ style }: Readonly<DirectionalHandlesProps>) {
  return (
    <>
      {POSITIONS.map((position) => (
        <Fragment key={`t-${position}`}>
          <Handle id={`t-${position}`} type="target" position={position} style={style} />
        </Fragment>
      ))}
      {POSITIONS.map((position) => (
        <Fragment key={`s-${position}`}>
          <Handle id={`s-${position}`} type="source" position={position} style={style} />
        </Fragment>
      ))}
    </>
  );
}
