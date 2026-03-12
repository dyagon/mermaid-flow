import MermaidInput from './MermaidInput';
import FlowChart from './FlowChart';
import { useEditor } from '../hooks/useEditor';

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
  },
  leftPanel: {
    width: 400,
    flexShrink: 0,
    borderRight: '1px solid #e5e7eb',
    padding: 8,
  },
  rightPanel: {
    flex: 1,
    height: '100%',
    padding: 8,
  },
};

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
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <MermaidInput
          value={mermaidCode}
          onChange={setMermaidCode}
          error={error}
        />
      </div>
      <div style={styles.rightPanel}>
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
