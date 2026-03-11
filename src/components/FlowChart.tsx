import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { defaultTheme } from "../features/themes";
import NodeLabel from "./NodeLabel";

interface FlowChartProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onNodeDragStop: (node: Node) => void;
}

const nodeTypes = {
  default: NodeLabel,
};

export default function FlowChart({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeDragStop,
}: Readonly<FlowChartProps>) {
  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeDragStop(node);
    },
    [onNodeDragStop],
  );

  // Apply edge styling from theme
  const styledEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      style: {
        stroke: defaultTheme.edge.strokeColor,
        strokeWidth: defaultTheme.edge.strokeWidth,
      },
    }));
  }, [edges]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={{ background: "#f8f9fa" }}
      >
        <Background color="#ddd" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
