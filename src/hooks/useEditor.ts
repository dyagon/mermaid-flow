import { useCallback, useEffect } from 'react';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

import { useEditorStore } from '../store/editorStore';
import { parseC4 } from '../features/c4Parser';
import { NodePositionMap, ParsedNode, ParsedRel } from '../types';

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

function parseMermaidCode(code: string, positionMap: NodePositionMap): { nodes: Node[]; edges: Edge[]; error?: string } {
  if (!code.trim()) {
    return { nodes: [], edges: [] };
  }

  const result = parseC4(code);

  if (!result.success) {
    return { nodes: [], edges: [], error: result.error };
  }

  if (!result.diagram) {
    return { nodes: [], edges: [] };
  }

  const parsedNodes: Node[] = result.diagram.nodes.map((node: ParsedNode) => ({
    id: node.id,
    type: 'default',
    position: { x: 0, y: 0 },
    data: {
      label: node.label,
      description: node.description,
    },
  }));

  const positionedNodes = calculateInitialPositions(parsedNodes, positionMap);

  const parsedEdges: Edge[] = result.diagram.edges.map((rel: ParsedRel) => ({
    id: rel.id,
    source: rel.source,
    target: rel.target,
    label: rel.label,
    type: 'bezier',
  }));

  return { nodes: positionedNodes, edges: parsedEdges };
}

export function useEditor() {
  const store = useEditorStore();

  // Parse mermaid code when it changes
  useEffect(() => {
    const { mermaidCode, positionMap } = store;
    const { nodes, edges, error } = parseMermaidCode(mermaidCode, positionMap);

    if (store.nodes !== nodes || store.edges !== edges) {
      store.setNodes(nodes);
    }
    if (store.edges !== edges) {
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

  const onNodeDragStop = useCallback((node: Node) => {
    store.updateNodePosition(node.id, { x: node.position.x, y: node.position.y });
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
