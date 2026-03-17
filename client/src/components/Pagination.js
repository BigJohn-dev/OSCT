import React from 'react';

export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  const range = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(pages, page + 2); i++) range.push(i);

  return (
    <div style={styles.wrap}>
      <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => onPage(page - 1)}>← Prev</button>
      {range[0] > 1 && <><span style={styles.num} onClick={() => onPage(1)}>1</span><span style={styles.ellipsis}>…</span></>}
      {range.map(p => (
        <span key={p} style={{ ...styles.num, ...(p === page ? styles.active : {}) }} onClick={() => onPage(p)}>{p}</span>
      ))}
      {range[range.length - 1] < pages && <><span style={styles.ellipsis}>…</span><span style={styles.num} onClick={() => onPage(pages)}>{pages}</span></>}
      <button className="btn btn-ghost btn-sm" disabled={page === pages} onClick={() => onPage(page + 1)}>Next →</button>
    </div>
  );
}

const styles = {
  wrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 32 },
  num: { width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 14, color: 'var(--text-secondary)', transition: 'all 0.15s' },
  active: { background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 700 },
  ellipsis: { color: 'var(--text-muted)', padding: '0 4px' },
};
