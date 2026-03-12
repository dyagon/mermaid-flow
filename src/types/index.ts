export interface ParsedNode {
  id: string;
  label: string;
  description?: string;
  technology?: string;
  type: 'Person' | 'Person_Ext' | 'System' | 'System_Ext' | 'Container' | 'ContainerDb' | 'Component';
  boundaryId?: string;
}

export interface ParsedRel {
  id: string;
  source: string;
  target: string;
  label: string;
  relType: 'Rel' | 'BiRel';
  protocol?: string;
}

export interface ParsedBoundary {
  id: string;
  type: 'Enterprise_Boundary' | 'System_Boundary';
  label: string;
  childIds: string[];
}

export interface ParsedDiagram {
  title?: string;
  nodes: ParsedNode[];
  edges: ParsedRel[];
  boundaries: ParsedBoundary[];
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
