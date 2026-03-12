interface MermaidInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

// Static style objects
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
    borderRadius: 8,
  },
  header: {
    padding: '16px 12px',
    borderBottom: '1px solid #f3f4f6',
    backgroundColor: '#fff',
    borderRadius: '8px 8px 0 0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    color: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  editorSection: {
    flex: 1,
    padding: 12,
    overflow: 'hidden',
  },
  editorWrapper: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },
  textarea: {
    flex: 1,
    width: '100%',
    padding: 12,
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 1.6,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    resize: 'none',
    outline: 'none',
  },
  errorBox: {
    padding: '8px 12px',
    margin: '0 12px 8px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: 8,
  },
  errorContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
  },
  errorIcon: {
    width: 16,
    height: 16,
    color: '#ef4444',
    marginTop: 2,
    flexShrink: 0,
  },
  errorText: {
    fontSize: 12,
    color: '#dc2626',
  },
  syntaxSection: {
    padding: '0 12px 12px',
  },
  syntaxBox: {
    padding: 12,
    background: 'linear-gradient(to bottom right, #f9fafb, #eff6ff)',
    borderRadius: 12,
    border: '1px solid #f3f4f6',
  },
  syntaxTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  syntaxIcon: {
    width: 14,
    height: 14,
  },
  syntaxList: {
    fontSize: 12,
    color: '#4b5563',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  syntaxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  syntaxTag: {
    padding: '2px 6px',
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 10,
  },
  syntaxTagPerson: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  syntaxTagSystem: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
  },
  syntaxTagContainer: {
    backgroundColor: '#f3e8ff',
    color: '#7e22ce',
  },
  syntaxTagRel: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
  },
};

export default function MermaidInput({ value, onChange, error }: Readonly<MermaidInputProps>) {
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconBox}>
            <svg style={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <div>
            <h2 style={styles.title}>Mermaid Editor</h2>
            <p style={styles.subtitle}>C4 Diagram Builder</p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div style={styles.editorSection}>
        <div style={styles.editorWrapper}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter C4 diagram code here..."
            style={{
              ...styles.textarea,
              border: `2px solid ${error ? '#f87171' : '#e5e7eb'}`,
            }}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <div style={styles.errorContent}>
            <svg style={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={styles.errorText}>{error}</p>
          </div>
        </div>
      )}

      {/* Syntax Help */}
      <div style={styles.syntaxSection}>
        <div style={styles.syntaxBox}>
          <h3 style={styles.syntaxTitle}>
            <svg style={styles.syntaxIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Syntax Reference
          </h3>
          <div style={styles.syntaxList}>
            <div style={styles.syntaxRow}>
              <span style={{ ...styles.syntaxTag, ...styles.syntaxTagPerson }}>Person</span>
              <span>(id, "Label", "Description")</span>
            </div>
            <div style={styles.syntaxRow}>
              <span style={{ ...styles.syntaxTag, ...styles.syntaxTagSystem }}>System</span>
              <span>(id, "Label", "Description")</span>
            </div>
            <div style={styles.syntaxRow}>
              <span style={{ ...styles.syntaxTag, ...styles.syntaxTagContainer }}>Container</span>
              <span>(id, "Label", "Tech", "Desc")</span>
            </div>
            <div style={styles.syntaxRow}>
              <span style={{ ...styles.syntaxTag, ...styles.syntaxTagRel }}>Rel</span>
              <span>(source, target, "Label")</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
