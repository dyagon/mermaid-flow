import MermaidInput from './MermaidInput';
import FlowChart from './FlowChart';
import { useEditor } from '../hooks/useEditor';

export default function Editor() {
  const {
    mermaidCode,
    nodes,
    edges,
    error,
    setMermaidCode,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
  } = useEditor();

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
    }}>
      <div style={{ width: '400px', flexShrink: 0, borderRight: '1px solid #ddd' }}>
        <MermaidInput
          value={mermaidCode}
          onChange={setMermaidCode}
          error={error}
        />
      </div>
      <div style={{ flex: 1, height: '100%' }}>
        <FlowChart
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStop={onNodeDragStop}
        />
      </div>
    </div>
  );
}
