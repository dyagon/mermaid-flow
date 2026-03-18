import { useCallback, useMemo, useRef, useState } from "react";
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

interface MousePosition {
  screenX: number;
  screenY: number;
  flowX: number;
  flowY: number;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  reactFlow: {
    background: "#f8f9fa",
  },
  mousePositionBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    color: '#f9fafb',
    padding: '8px 10px',
    borderRadius: 8,
    fontSize: 14,
    lineHeight: 1.4,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    pointerEvents: 'none',
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
  const { setNodes, screenToFlowPosition } = useReactFlow();
  const [mousePosition, setMousePosition] = useState<MousePosition | null>(null);
  const dragInfoRef = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    childIds: string[];
    originalPositions: Map<string, { x: number; y: number }>;
  } | null>(null);

  const handleNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Group move only when dragging a boundary node.
      if (node.type === 'boundary') {
        const childIds = (node.data as { childIds?: string[] }).childIds ?? [];
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
        if (n.id === node.id) {
          return {
            ...n,
            position: {
              x: node.position.x,
              y: node.position.y,
            },
          };
        }

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
        const { startX, startY, childIds, originalPositions } = dragInfoRef.current;
        const deltaX = node.position.x - startX;
        const deltaY = node.position.y - startY;
        const childNodes = childIds
          .map((childId) => {
            const original = originalPositions.get(childId);
            if (!original) {
              return null;
            }

            return {
              id: childId,
              position: {
                x: original.x + deltaX,
                y: original.y + deltaY,
              },
            };
          })
          .filter((child): child is { id: string; position: { x: number; y: number } } => child !== null)
          .map((child) => {
            const currentNode = nodes.find((current) => current.id === child.id);
            return {
              ...(currentNode ?? { id: child.id, data: {}, position: child.position }),
              position: child.position,
            } as Node;
          });

        onNodeDragStop(node, childNodes);
        dragInfoRef.current = null;
      } else {
        onNodeDragStop(node, [node]);
      }
    },
    [onNodeDragStop, nodes]
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

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setMousePosition({
        screenX: event.clientX,
        screenY: event.clientY,
        flowX: flowPosition.x,
        flowY: flowPosition.y,
      });
    },
    [screenToFlowPosition]
  );

  const handleMouseLeave = useCallback(() => {
    setMousePosition(null);
  }, []);

  return (
    <div
      style={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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

      {mousePosition && (
        <div style={styles.mousePositionBadge}>
          <div>screen: ({Math.round(mousePosition.screenX)}, {Math.round(mousePosition.screenY)})</div>
          <div>flow: ({Math.round(mousePosition.flowX)}, {Math.round(mousePosition.flowY)})</div>
        </div>
      )}
    </div>
  );
}
