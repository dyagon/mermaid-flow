interface MermaidInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function MermaidInput({ value, onChange, error }: MermaidInputProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '16px',
      background: '#fff',
      borderRight: '1px solid #ddd',
    }}>
      <div style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Mermaid Input</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter C4 diagram code here..."
        style={{
          flex: 1,
          width: '100%',
          padding: '12px',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.5',
          border: error ? '2px solid #e74c3c' : '1px solid #ddd',
          borderRadius: '4px',
          resize: 'none',
          outline: 'none',
        }}
      />

      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          background: '#fee',
          color: '#c0392b',
          borderRadius: '4px',
          fontSize: '12px',
        }}>
          {error}
        </div>
      )}

      <div style={{
        marginTop: '12px',
        padding: '12px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
      }}>
        <strong>Supported syntax:</strong><br />
        • Person(id, "Label", "Description")<br />
        • System(id, "Label", "Description")<br />
        • Container(id, "Label", "Technology", "Description")<br />
        • Rel(source, target, "Label")
      </div>
    </div>
  );
}
