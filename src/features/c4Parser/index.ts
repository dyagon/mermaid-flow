import { ParseResult, ParsedDiagram, ParsedNode, ParsedRel } from '../../types';

// Parse C4 diagram syntax
export function parseC4(input: string): ParseResult {
  const lines = input.split('\n').map(line => line.trim()).filter(Boolean);

  if (lines.length === 0) {
    return { success: true, diagram: { nodes: [], edges: [] } };
  }

  const firstLine = lines[0];
  if (!firstLine.startsWith('C4Context') && !firstLine.startsWith('C4Container') && !firstLine.startsWith('C4Component')) {
    return { success: false, error: 'Invalid diagram type. Use C4Context, C4Container, or C4Component' };
  }

  const diagram: ParsedDiagram = {
    nodes: [],
    edges: [],
  };

  // Parse title
  const titleMatch = input.match(/title\s+(.+)/);
  if (titleMatch) {
    diagram.title = titleMatch[1].trim();
  }

  // Parse nodes
  const nodePatterns = [
    /^(Person|Person_Ext)\((\w+),\s*"([^"]+)"(?:,\s*"([^"]+)")?\)/,
    /^(System|System_Ext)\((\w+),\s*"([^"]+)"(?:,\s*"([^"]+)")?\)/,
    /^(Container|ContainerDb)\((\w+),\s*"([^"]+)"(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?\)/,
    /^(Component)\((\w+),\s*"([^"]+)"(?:,\s*"([^"]+)")?(?:,\s*"([^"]+)")?\)/,
  ];

  // Parse relationships
  const relPattern = /^Rel\((\w+),\s*(\w+)(?:,\s*"([^"]+)")?\)/;

  for (const line of lines) {
    // Try node patterns
    for (const pattern of nodePatterns) {
      const match = line.match(pattern);
      if (match) {
        const node: ParsedNode = {
          type: match[1] as ParsedNode['type'],
          id: match[2],
          label: match[3],
          description: match[4] || match[5],
        };
        diagram.nodes.push(node);
        break;
      }
    }

    // Try rel pattern
    const relMatch = line.match(relPattern);
    if (relMatch) {
      const rel: ParsedRel = {
        id: `rel-${diagram.edges.length}`,
        source: relMatch[1],
        target: relMatch[2],
        label: relMatch[3],
      };
      diagram.edges.push(rel);
    }
  }

  return { success: true, diagram };
}
