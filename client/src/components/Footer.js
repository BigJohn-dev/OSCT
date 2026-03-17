import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}><span style={{ color: 'var(--accent)' }}>{'<'}</span>OSCT<span style={{ color: 'var(--accent)' }}>{'/>'}</span></span>
          <p style={styles.tagline}>Track contributions. Earn recognition. Build together.</p>
        </div>
        <div style={styles.links}>
          <div style={styles.col}>
            <span style={styles.colTitle}>Navigate</span>
            <Link to="/projects" style={styles.link}>Projects</Link>
            <Link to="/leaderboard" style={styles.link}>Leaderboard</Link>
            <Link to="/rewards" style={styles.link}>Rewards</Link>
          </div>
          <div style={styles.col}>
            <span style={styles.colTitle}>Resources</span>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.link}>GitHub</a>
            <a href="/api-docs" style={styles.link}>API Docs</a>
            <Link to="/admin" style={styles.link}>Admin</Link>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © {new Date().getFullYear()} OSCT — MIT License
        </span>
      </div>
    </footer>
  );
}

const styles = {
  footer: { borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)', marginTop: 'auto' },
  inner: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '48px 24px 32px', gap: 40, flexWrap: 'wrap' },
  brand: { maxWidth: 260 },
  logo: { fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700 },
  tagline: { color: 'var(--text-muted)', fontSize: 14, marginTop: 8, lineHeight: 1.6 },
  links: { display: 'flex', gap: 48 },
  col: { display: 'flex', flexDirection: 'column', gap: 12 },
  colTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 },
  link: { color: 'var(--text-secondary)', fontSize: 14, textDecoration: 'none' },
  bottom: { borderTop: '1px solid var(--border)', padding: '16px 24px', textAlign: 'center' },
};
