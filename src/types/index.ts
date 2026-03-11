export interface ParsedNode {
  id: string;
  label: string;
  description?: string;
  type: 'Person' | 'Person_Ext' | 'System' | 'System_Ext' | 'Container' | 'ContainerDb' | 'Component';
}

export interface ParsedRel {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ParsedDiagram {
  title?: string;
  nodes: ParsedNode[];
  edges: ParsedRel[];
}

export interface ParseResult {
  success: boolean;
  diagram?: ParsedDiagram;
  error?: string;
}

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodePositionMap {
  [nodeId: string]: NodePosition;
}
