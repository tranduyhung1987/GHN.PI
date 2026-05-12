// src/components/auth/RoleSelector.tsx
import { useState } from 'react';

export default function RoleSelector() {
  const [role, setRole] = useState<'guest' | 'shop' | 'driver' | 'warehouse' | 'admin'>('shop');

  return (
    <div style={{
      position: 'fixed',
      top: '15px',
      right: '15px',
      background: '#1e2937',
      padding: '10px 14px',
      borderRadius: '12px',
      border: '2px solid #a855f7',
      zIndex: 99999,
      fontSize: '13px',
      boxShadow: '0 0 25px rgba(168, 85, 247, 0.6)',
      userSelect: 'none'
    }}>
      <div style={{ marginBottom: '6px', color: '#94a3b8' }}>Role hiện tại:</div>
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        {['guest', 'shop', 'driver', 'warehouse', 'admin'].map(r => (
          <button
            key={r}
            onClick={() => setRole(r as any)}
            style={{
              padding: '4px 12px',
              borderRadius: '999px',
              background: role === r ? '#22d3ee' : '#334155',
              color: role === r ? '#0f172a' : '#e2e8f0',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}