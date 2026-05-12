// src/theme.ts
export const colors = {
  primary: '#22d3ee',
  primaryLight: '#67e8f9',
  accent: '#a855f7',
  success: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
  bg: '#0f172a',
  card: '#1e2937',
  border: '#334155',
  text: '#e2e8f0',
  textSecondary: '#94a3b8',
};

export const commonStyles = {
  card: {
    backgroundColor: colors.card,
    borderRadius: '20px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.4)',
  },

  buttonPrimary: {
    background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`,
    color: '#0f172a',
    border: 'none',
    borderRadius: '9999px',
    fontWeight: 'bold',
    padding: '16px 24px',
    fontSize: '17px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)',
    transition: 'all 0.3s ease',
  } as const,
};