export interface Theme {
  name: string;
  fontFamily: string;
  node: {
    background: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: string;
    minWidth: string;
    boxShadow: string;
  };
  label: {
    fontWeight: number;
    fontSize: string;
    color: string;
  };
  description: {
    fontSize: string;
    color: string;
    marginTop: string;
  };
  handle: {
    color: string;
  };
  edge: {
    strokeColor: string;
    strokeWidth: number;
  };
}

export const defaultTheme: Theme = {
  name: 'default',
  fontFamily: '"LXGW WenKai", cursive',
  node: {
    background: '#ffffff',
    borderColor: '#4a90d9',
    borderWidth: 2,
    borderRadius: 8,
    padding: '12px 16px',
    minWidth: '140px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  label: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#333333',
  },
  description: {
    fontSize: '12px',
    color: '#666666',
    marginTop: '4px',
  },
  handle: {
    color: '#4a90d9',
  },
  edge: {
    strokeColor: '#999999',
    strokeWidth: 2,
  },
};
