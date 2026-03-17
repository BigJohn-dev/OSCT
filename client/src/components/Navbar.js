import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/projects', label: 'Projects' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/contributions', label: 'Contributions', auth: true },
  { to: '/rewards', label: 'Rewards', auth: true },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>{'<'}</span>OSCT<span style={styles.logoIcon}>{'/>'}</span>
        </Link>

        <div style={styles.links}>
          {NAV_LINKS.filter(l => !l.auth || user).map(({ to, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.linkActive : {}) })}>
              {label}
            </NavLink>
          ))}
        </div>

        <div style={styles.actions}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-ghost btn-sm">Admin</Link>
              )}
              <Link to={`/profile/${user._id}`} style={styles.avatarWrap}>
                <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=22d3ee&color=0f172a`}
                  alt={user.name} className="avatar" style={{ width: 36, height: 36 }} />
                <div style={styles.pointsBadge}>{user.totalPoints} pts</div>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <a href={`${process.env.REACT_APP_API_URL || ''}/api/auth/github`} className="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Sign in with GitHub
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.filter(l => !l.auth || user).map(({ to, label }) => (
            <Link key={to} to={to} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {!user && (
            <a href={`${process.env.REACT_APP_API_URL || ''}/api/auth/github`} style={{ ...styles.mobileLink, color: 'var(--accent)' }}>
              Sign in with GitHub
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)' },
  inner: { display: 'flex', alignItems: 'center', gap: 32, height: 72 },
  logo: { fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none', flexShrink: 0 },
  logoIcon: { color: 'var(--accent)' },
  links: { display: 'flex', gap: 4, flex: 1 },
  link: { padding: '6px 12px', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s' },
  linkActive: { color: 'var(--accent)', background: 'var(--accent-dim)' },
  actions: { display: 'flex', alignItems: 'center', gap: 12 },
  avatarWrap: { display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600 },
  pointsBadge: { background: 'var(--accent-dim)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 100, fontFamily: 'var(--font-mono)', fontSize: 12 },
  menuBtn: { display: 'none', flexDirection: 'column', gap: 5, background: 'none', padding: 8, cursor: 'pointer' },
  mobileMenu: { display: 'flex', flexDirection: 'column', padding: '16px 24px', borderTop: '1px solid var(--border)', gap: 4 },
  mobileLink: { padding: '10px 0', color: 'var(--text-secondary)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--border-subtle)' },
};
