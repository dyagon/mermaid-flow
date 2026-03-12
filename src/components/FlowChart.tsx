import { useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  PersonNode,
  PersonExtNode,
  SystemNode,
  SystemExtNode,
  ContainerNode,
  ContainerDbNode,
  ComponentNode,
} from "./nodes";
import { BoundaryNode } from "./boundary";
import { RelEdge, BiRelEdge } from "./edges";

interface FlowChartProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onNodeDragStop: (node: Node, nodes: Node[]) => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
  },
  reactFlow: {
    background: "#f8f9fa",
  },
};

const nodeTypes = {
  person: PersonNode,
  personExt: PersonExtNode,
  system: SystemNode,
  systemExt: SystemExtNode,
  container: ContainerNode,
  containerDb: ContainerDbNode,
  component: ComponentNode,
  boundary: BoundaryNode,
};

const edgeTypes = {
  rel: RelEdge,
  birel: BiRelEdge,
};

export default function FlowChart({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeDragStop,
}: Readonly<FlowChartProps>) {
  const { setNodes, getNodes } = useReactFlow();
  const dragInfoRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    childIds: string[];
    originalPositions: Map<string, { x: number; y: number }>;
  } | null>(null);

  const handleNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Find if this node belongs to a boundary
      const boundaryNode = nodes.find(
        (n) => n.type === 'boundary' && (n.data as { childIds?: string[] }).childIds?.includes(node.id)
      );

      if (boundaryNode) {
        const childIds = (boundaryNode.data as { childIds: string[] }).childIds;
        const childNodes = nodes.filter((n) => childIds.includes(n.id));

        // Store original positions of all children
        const originalPositions = new Map<string, { x: number; y: number }>();
        childNodes.forEach((child) => {
          originalPositions.set(child.id, { x: child.position.x, y: child.position.y });
        });

        dragInfoRef.current = {
          nodeId: node.id,
          startX: node.position.x,
          startY: node.position.y,
          childIds,
          originalPositions,
        };
      } else {
        dragInfoRef.current = null;
      }
    },
    [nodes]
  );

  const handleNodeDrag = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (!dragInfoRef.current) return;

      const { startX, startY, childIds, originalPositions } = dragInfoRef.current;
      const deltaX = node.position.x - startX;
      const deltaY = node.position.y - startY;

      // Update all children in the boundary
      const updatedNodes = nodes.map((n) => {
        if (childIds.includes(n.id)) {
          const original = originalPositions.get(n.id);
          if (original) {
            return {
              ...n,
              position: {
                x: original.x + deltaX,
                y: original.y + deltaY,
              },
            };
          }
        }
        return n;
      });

      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const handleNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (dragInfoRef.current) {
        const { childIds } = dragInfoRef.current;
        const currentNodes = getNodes();
        const childNodes = currentNodes.filter((n) => childIds.includes(n.id));
        onNodeDragStop(node, childNodes);
        dragInfoRef.current = null;
      } else {
        onNodeDragStop(node, [node]);
      }
    },
    [onNodeDragStop, getNodes]
  );

  const styledEdges = useMemo(() => {
    return edges.map(edge => {
      const relType = (edge.data as { relType?: string })?.relType;
      return {
        ...edge,
        type: relType === 'BiRel' ? 'birel' : 'rel',
        data: {
          ...edge.data,
          relType,
        },
      };
    });
  }, [edges]);

  return (
    <div style={styles.container}>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={handleNodeDragStart}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={styles.reactFlow}
      >
        <Background color="#ddd" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
