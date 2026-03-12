import { ParseResult, ParsedDiagram, ParsedNode, ParsedRel, ParsedBoundary } from '../../types';

// C4 element type
type C4ElementType =
  | 'Person'
  | 'Person_Ext'
  | 'System'
  | 'System_Ext'
  | 'Container'
  | 'ContainerDb'
  | 'Component'
  | 'Enterprise_Boundary'
  | 'System_Boundary'
  | 'Rel'
  | 'BiRel';

// Valid C4 types
const VALID_TYPES = new Set([
  'Person', 'Person_Ext',
  'System', 'System_Ext',
  'Container', 'ContainerDb',
  'Component',
  'Enterprise_Boundary', 'System_Boundary',
  'Rel', 'BiRel',
]);

// Parse result from line
interface ParsedElement {
  type: C4ElementType;
  params: string[];
}

// Match: Type(params)
const NODE_PATTERN = new RegExp(/^(\w+)\((.*)\)?$/);


function splitParams(paramsStr: string): string[] {
  // Parse params: split by comma, handle quoted strings
  const params: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';

  for (const char of paramsStr) {
    if ((char === '"' || char === "'") && !inQuotes) {
      inQuotes = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuotes) {
      inQuotes = false;
      quoteChar = '';
    } else if (char === ',' && !inQuotes) {
      params.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    params.push(current.trim());
  }
  return params;
}

// Step 1: Match line to element
// Format: Type(param1, param2, "param3", "param4")
function matchLine(line: string): ParsedElement | null {
  // Boundary close
  if (line.trim() === '}') {
    return { type: 'Rel', params: [] }; // Placeholder
  }

  const match = NODE_PATTERN.exec(line);
  if (!match) return null;

  const type = match[1] as C4ElementType;
  const paramsStr = match[2];

  if (!VALID_TYPES.has(type)) {
    return null;
  }
  const params = splitParams(paramsStr);
  return { type, params };
}

// Step 2: Build parsed objects from element
function buildElement(element: ParsedElement, context: { boundaryId?: string; relIdCounter: number }): ParsedNode | ParsedRel | ParsedBoundary | null {
  const { type, params } = element;

  // Boundary
  if (type === 'Enterprise_Boundary' || type === 'System_Boundary') {
    const [alias, label] = params;
    return {
      id: alias,
      type,
      label: label || alias,
      childIds: [],
    };
  }

  // Person/System: alias, label, description
  if (type === 'Person' || type === 'Person_Ext' || type === 'System' || type === 'System_Ext') {
    const [alias, label, description] = params;
    return {
      id: alias,
      label: label || alias,
      description: description || undefined,
      type,
      boundaryId: context.boundaryId,
    };
  }

  // Container/Component: alias, label, technology, description
  if (type === 'Container' || type === 'ContainerDb' || type === 'Component') {
    const [alias, label, technology, description] = params;
    return {
      id: alias,
      label: label || alias,
      description: description || undefined,
      technology: technology || undefined,
      type,
      boundaryId: context.boundaryId,
    };
  }

  // Rel/BiRel: source, target, label, protocol
  if (type === 'Rel' || type === 'BiRel') {
    const [source, target, label, protocol] = params;
    return {
      id: `rel-${context.relIdCounter++}`,
      source,
      target,
      label: label || '',
      relType: type,
      protocol: protocol || undefined,
    };
  }

  return null;
}

// Main parse function
export function parseC4(input: string): ParseResult {
  const lines = input.split('\n').map(line => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return { success: true, diagram: { nodes: [], edges: [], boundaries: [] } };
  }

  const firstLine = lines[0];
  if (!firstLine.startsWith('C4Context') && !firstLine.startsWith('C4Container') && !firstLine.startsWith('C4Component')) {
    return { success: false, error: 'Invalid diagram type. Use C4Context, C4Container, or C4Component' };
  }

  const diagram: ParsedDiagram = {
    nodes: [],
    edges: [],
    boundaries: [],
  };

  let currentBoundaryId: string | undefined;
  let boundaryDepth = 0;
  let relIdCounter = 0;

  // Parse title
  const titleMatch = input.match(/title\s+(.+)/);
  if (titleMatch) {
    diagram.title = titleMatch[1].trim();
  }

  for (const line of lines) {
    // Handle boundary close
    if (line.trim() === '}') {
      if (boundaryDepth > 0) {
        boundaryDepth--;
        if (boundaryDepth === 0) {
          currentBoundaryId = undefined;
        }
      }
      continue;
    }

    // Match and build
    const element = matchLine(line);
    if (!element) continue;

    const context = { boundaryId: currentBoundaryId, relIdCounter };
    const built = buildElement(element, context);
    if (!built) continue;

    relIdCounter = context.relIdCounter;

    // Add to diagram
    if ('childIds' in built) {
      // Boundary
      diagram.boundaries.push(built);
      currentBoundaryId = built.id;
      boundaryDepth++;
    } else if ('source' in built) {
      // Rel
      diagram.edges.push(built);
    } else {
      // Node
      diagram.nodes.push(built);
      const boundary = diagram.boundaries.find(b => b.id === currentBoundaryId);
      if (boundary) {
        boundary.childIds.push(built.id);
      }
    }
  }

  return { success: true, diagram };
}
