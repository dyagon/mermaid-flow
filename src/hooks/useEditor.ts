import { useCallback, useEffect } from 'react';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

import { useEditorStore } from '../store/editorStore';
import { parseC4 } from '../features/c4Parser';
import { NodePositionMap, ParsedNode, ParsedRel, ParsedBoundary } from '../types';

const GRID_GAP_X = 200;
const GRID_GAP_Y = 120;

function calculateInitialPositions(
  nodes: Node[],
  positionMap: NodePositionMap
): Node[] {
  const centerX = 300;
  const startY = 100;

  return nodes.map((node, index) => {
    const savedPosition = positionMap[node.id];
    if (savedPosition) {
      return { ...node, position: savedPosition };
    }

    const row = Math.floor(index / 3);
    const col = index % 3;
    return {
      ...node,
      position: {
        x: centerX + (col - 1) * GRID_GAP_X,
        y: startY + row * GRID_GAP_Y,
      },
    };
  });
}

function parseMermaidCode(code: string, positionMap: NodePositionMap): { nodes: Node[]; edges: Edge[]; boundaries: ParsedBoundary[]; error?: string } {
  if (!code.trim()) {
    return { nodes: [], edges: [], boundaries: [] };
  }

  const result = parseC4(code);

  if (!result.success) {
    return { nodes: [], edges: [], boundaries: [], error: result.error };
  }

  if (!result.diagram) {
    return { nodes: [], edges: [], boundaries: [] };
  }

  const parsedNodes: Node[] = result.diagram.nodes.map((node: ParsedNode) => {
    // Map C4 type to element component
    const typeMap: Record<string, string> = {
      'Person': 'person',
      'Person_Ext': 'personExt',
      'System': 'system',
      'System_Ext': 'systemExt',
      'Container': 'container',
      'ContainerDb': 'containerDb',
      'Component': 'component',
    };

    return {
      id: node.id,
      type: typeMap[node.type] || 'system',
      position: { x: 0, y: 0 },
      data: {
        label: node.label,
        description: node.description,
        technology: node.technology,
        elementType: node.type,
        boundaryId: node.boundaryId,
      },
    };
  });

  const positionedNodes = calculateInitialPositions(parsedNodes, positionMap);

  // Create boundary nodes - position based on all children
  const boundaryNodes: Node[] = result.diagram.boundaries.map((boundary: ParsedBoundary) => {
    const children = positionedNodes.filter(n => boundary.childIds.includes(n.id));

    if (children.length === 0) {
      return {
        id: boundary.id,
        type: 'boundary',
        position: { x: 100, y: 100 },
        draggable: false,
        selectable: false,
        data: {
          label: boundary.label,
          childIds: boundary.childIds,
          boundaryType: boundary.type,
        },
      };
    }

    // Calculate bounds from children
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    const NODE_WIDTH = 140;
    const NODE_HEIGHT = 50;
    const PADDING = 40;
    const LABEL_SPACE = 40;

    children.forEach(child => {
      minX = Math.min(minX, child.position.x);
      minY = Math.min(minY, child.position.y);
      maxX = Math.max(maxX, child.position.x + NODE_WIDTH);
      maxY = Math.max(maxY, child.position.y + NODE_HEIGHT);
    });

    // Boundary position at top-left of children minus padding
    const boundaryX = minX - PADDING;
    const boundaryY = minY - PADDING - LABEL_SPACE;

    return {
      id: boundary.id,
      type: 'boundary',
      position: { x: boundaryX, y: boundaryY },
      draggable: false,
      selectable: false,
      data: {
        label: boundary.label,
        childIds: boundary.childIds,
        boundaryType: boundary.type,
        width: maxX - minX + PADDING * 2,
        height: maxY - minY + PADDING * 2 + LABEL_SPACE,
      },
    };
  });

  // Insert boundary nodes at the beginning (so they render behind)
  const allNodes = [...boundaryNodes, ...positionedNodes];

  const parsedEdges: Edge[] = result.diagram.edges.map((rel: ParsedRel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    label: rel.label,
    type: 'straight',
    data: {
      relType: rel.relType,
    },
  }));

  return { nodes: allNodes, edges: parsedEdges, boundaries: result.diagram.boundaries };
}

// Helper to compare nodes
function nodesEqual(a: Node[], b: Node[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((node, i) => {
    const other = b[i];
    return (
      node.id === other.id &&
      node.type === other.type &&
      node.position.x === other.position.x &&
      node.position.y === other.position.y
    );
  });
}

function edgesEqual(a: Edge[], b: Edge[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((edge, i) => {
    const other = b[i];
    return (
      edge.id === other.id &&
      edge.source === other.source &&
      edge.target === other.target
    );
  });
}

export function useEditor() {
  const store = useEditorStore();

  // Parse mermaid code when mermaidCode or positionMap changes
  useEffect(() => {
    const { mermaidCode, positionMap } = store;
    const { nodes, edges, error } = parseMermaidCode(mermaidCode, positionMap);

    if (!nodesEqual(store.nodes, nodes)) {
      store.setNodes(nodes);
    }
    if (!edgesEqual(store.edges, edges)) {
      store.setEdges(edges);
    }
    if (store.error !== error) {
      store.setError(error);
    }
  }, [store.mermaidCode, store.positionMap]);

  const setMermaidCode = useCallback((code: string) => {
    store.setMermaidCode(code);
  }, [store]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    store.setNodes(applyNodeChanges(changes, store.nodes) as Node[]);
  }, [store.nodes, store.setNodes]);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    store.setEdges(applyEdgeChanges(changes, store.edges) as Edge[]);
  }, [store.edges, store.setEdges]);

  const onNodeDragStop = useCallback((_node: Node, movedNodes: Node[]) => {
    // Save positions for all moved nodes (for boundary children)
    movedNodes.forEach((movedNode) => {
      store.updateNodePosition(movedNode.id, {
        x: movedNode.position.x,
        y: movedNode.position.y,
      });
    });
  }, [store]);

  return {
    mermaidCode: store.mermaidCode,
    nodes: store.nodes,
    edges: store.edges,
    error: store.error,
    setMermaidCode,
    onNodesChange,
    onEdgesChange,
    onNodeDragStop,
  };
}
