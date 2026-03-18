import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge } from '@xyflow/react';

import { NodePositionMap } from '../types';

const DEFAULT_MERMAID_CODE = `C4Context
  Person(customer, "Personal Banking Customer", "A customer of the bank with one of more personal bank accounts")
  System(internet_banking_system, "Internet Banking System",
    "Allows customers to view information about their bank accounts and make payments via the web.")
  System(core_banking_system, "Core Banking System",
    "Handles core banking functions including customer information, bank account management, transactions, etc.")
  System_Ext(amazon_web_services, "Amazon Web Services Simple Email Service", "Cloud-based email service provider.")

  Rel(customer, internet_banking_system, "Views account balances and makes payments using")
  Rel(amazon_web_services, customer, "Sends e-mails to")
  Rel(internet_banking_system, amazon_web_services, "Sends e-mails to customers using")
  Rel(internet_banking_system, core_banking_system, "Gets bank account information from and makes payments using")`;

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
      mermaidCode: DEFAULT_MERMAID_CODE,
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
