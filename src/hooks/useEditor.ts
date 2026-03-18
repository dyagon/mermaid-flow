import { useCallback, useEffect } from 'react';
import { Node, Edge, NodeChange, EdgeChange, Position, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

import { useEditorStore } from '../store/editorStore';
import { parseC4 } from '../features/c4Parser';
import { NodePositionMap, ParsedNode, ParsedRel, ParsedBoundary } from '../types';

const GRID_GAP_X = 200;
const GRID_GAP_Y = 120;
const DEBUG_BOUNDARY = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);
const DEFAULT_NODE_WIDTH = 140;
const DEFAULT_NODE_HEIGHT = 50;

function getNodeSize(node: Node): { width: number; height: number } {
  const width = node.width ?? (node as Node & { measured?: { width?: number } }).measured?.width;
  const height = node.height ?? (node as Node & { measured?: { height?: number } }).measured?.height;

  return {
    width: width ?? DEFAULT_NODE_WIDTH,
    height: height ?? DEFAULT_NODE_HEIGHT,
  };
}

function getNodeCenter(node: Node): { x: number; y: number } {
  const { width, height } = getNodeSize(node);
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
}

function getAnchorPositions(source: Node, target: Node): { sourcePosition: Position; targetPosition: Position } {
  const sourceCenter = getNodeCenter(source);
  const targetCenter = getNodeCenter(target);
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  if (Math.abs(dx) >= Math.abs(dy)) {
    if (dx >= 0) {
      return { sourcePosition: Position.Right, targetPosition: Position.Left };
    }
    return { sourcePosition: Position.Left, targetPosition: Position.Right };
  }

  if (dy >= 0) {
    return { sourcePosition: Position.Bottom, targetPosition: Position.Top };
  }
  return { sourcePosition: Position.Top, targetPosition: Position.Bottom };
}

function getSourceHandleId(position: Position): string {
  switch (position) {
    case Position.Top:
      return 's-top';
    case Position.Right:
      return 's-right';
    case Position.Bottom:
      return 's-bottom';
    case Position.Left:
      return 's-left';
    default:
      return 's-bottom';
  }
}

function getTargetHandleId(position: Position): string {
  switch (position) {
    case Position.Top:
      return 't-top';
    case Position.Right:
      return 't-right';
    case Position.Bottom:
      return 't-bottom';
    case Position.Left:
      return 't-left';
    default:
      return 't-top';
  }
}

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

function parseMermaidCode(
  code: string,
  positionMap: NodePositionMap,
  previousNodes: Node[]
): { nodes: Node[]; edges: Edge[]; boundaries: ParsedBoundary[]; error?: string } {
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

  const previousNodeMap = new Map(previousNodes.map((node) => [node.id, node]));

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

    const previousNode = previousNodeMap.get(node.id);

    return {
      id: node.id,
      type: typeMap[node.type] || 'system',
      position: { x: 0, y: 0 },
      width: previousNode?.width,
      height: previousNode?.height,
      measured: (previousNode as Node & { measured?: { width?: number; height?: number } })?.measured,
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
        draggable: true,
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

    const PADDING = 40;
    const LABEL_SPACE = 40;

    children.forEach(child => {
      const measuredChild = previousNodeMap.get(child.id);
      const { width: childWidth, height: childHeight } = getNodeSize(measuredChild ?? child);
      minX = Math.min(minX, child.position.x);
      minY = Math.min(minY, child.position.y);
      maxX = Math.max(maxX, child.position.x + childWidth);
      maxY = Math.max(maxY, child.position.y + childHeight);
    });

    // Boundary position at top-left of children minus padding
    const boundaryX = minX - PADDING;
    const boundaryY = minY - PADDING - LABEL_SPACE;
    const width = maxX - minX + PADDING * 2;
    const height = maxY - minY + PADDING * 2 + LABEL_SPACE;

    if (DEBUG_BOUNDARY) {
      console.groupCollapsed(`[Boundary/parse] ${boundary.id}`);
      const childRows = children.map((child) => {
        const measuredChild = previousNodeMap.get(child.id);
        const { width: childWidth, height: childHeight } = getNodeSize(measuredChild ?? child);
        return {
          kind: 'child',
          id: child.id,
          label: String((child.data as { label?: string })?.label || ''),
          left: child.position.x,
          top: child.position.y,
          right: child.position.x + childWidth,
          bottom: child.position.y + childHeight,
          width: childWidth,
          height: childHeight,
        };
      });

      const rows = [
        {
          kind: 'boundary',
          id: boundary.id,
          label: boundary.label,
          left: boundaryX,
          top: boundaryY,
          right: boundaryX + width,
          bottom: boundaryY + height,
          width,
          height,
        },
        ...childRows,
      ];
      console.table(rows);
      console.groupEnd();
    }

    return {
      id: boundary.id,
      type: 'boundary',
      position: { x: boundaryX, y: boundaryY },
      draggable: true,
      selectable: false,
      data: {
        label: boundary.label,
        childIds: boundary.childIds,
        boundaryType: boundary.type,
        width,
        height,
      },
    };
  });

  // Insert boundary nodes at the beginning (so they render behind)
  const allNodes = [...boundaryNodes, ...positionedNodes];

  const nodeMap = new Map(positionedNodes.map((node) => [node.id, node]));

  const parsedEdges: Edge[] = result.diagram.edges.map((rel: ParsedRel) => {
    const sourceNode = nodeMap.get(rel.source);
    const targetNode = nodeMap.get(rel.target);
    const anchors = sourceNode && targetNode
      ? getAnchorPositions(sourceNode, targetNode)
      : { sourcePosition: Position.Bottom, targetPosition: Position.Top };

    return {
      id: rel.id,
      source: rel.source,
      target: rel.target,
      sourceHandle: getSourceHandleId(anchors.sourcePosition),
      targetHandle: getTargetHandleId(anchors.targetPosition),
      label: rel.label,
      type: 'straight',
      data: {
        relType: rel.relType,
        protocol: rel.protocol,
      },
    };
  });

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
      node.position.y === other.position.y &&
      JSON.stringify(node.data ?? null) === JSON.stringify(other.data ?? null)
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
  const nodeMeasurementSignature = store.nodes
    .filter((node) => node.type !== 'boundary')
    .map((node) => {
      const measured = (node as Node & { measured?: { width?: number; height?: number } }).measured;
      const width = node.width ?? measured?.width ?? 'na';
      const height = node.height ?? measured?.height ?? 'na';
      return `${node.id}:${width}x${height}`;
    })
    .sort()
    .join('|');

  // Parse mermaid code when mermaidCode or positionMap changes
  useEffect(() => {
    const { mermaidCode, positionMap } = store;
    const { nodes, edges, error } = parseMermaidCode(mermaidCode, positionMap, store.nodes);

    if (!nodesEqual(store.nodes, nodes)) {
      store.setNodes(nodes);
    }
    if (!edgesEqual(store.edges, edges)) {
      store.setEdges(edges);
    }
    if (store.error !== error) {
      store.setError(error);
    }
  }, [store.mermaidCode, store.positionMap, nodeMeasurementSignature]);

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
