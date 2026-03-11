import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from '@xyflow/react';

import { NodePositionMap } from '../types';

interface EditorState {
  mermaidCode: string;
  positionMap: NodePositionMap;
  nodes: Node[];
  edges: Edge[];
  error?: string;

  setMermaidCode: (code: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setError: (error: string | undefined) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      mermaidCode: '',
      positionMap: {},
      nodes: [],
      edges: [],
      error: undefined,

      setMermaidCode: (code: string) => set({ mermaidCode: code }),

      setNodes: (nodes: Node[]) => set({ nodes }),

      setEdges: (edges: Edge[]) => set({ edges }),

      setError: (error: string | undefined) => set({ error }),

      updateNodePosition: (nodeId: string, position: { x: number; y: number }) =>
        set((state) => ({
          positionMap: { ...state.positionMap, [nodeId]: position },
        })),
    }),
    {
      name: 'mermaid-flow-storage',
      partialize: (state) => ({
        mermaidCode: state.mermaidCode,
        positionMap: state.positionMap,
      }),
    }
  )
);
