import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaderboardService, projectService } from '../services/api';
import ProjectCard from '../components/ProjectCard';

export default function HomePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [featured, setFeatured] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    leaderboardService.getStats().then(r => setStats(r.data)).catch(() => {});
    projectService.getFeatured().then(r => setFeatured(r.data.projects)).catch(() => {});
    leaderboardService.get({ limit: 5 }).then(r => setTopUsers(r.data.leaderboard)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={hero.section}>
        <div className="container" style={hero.content}>
          <div style={hero.eyebrow}>Open Source Contribution Tracker</div>
          <h1 style={hero.title}>
            Build. Contribute.<br />
            <span style={{ color: 'var(--accent)' }}>Get Rewarded.</span>
          </h1>
          <p style={hero.sub}>
            Track your open-source contributions, earn points for every commit, pull request, and review — and redeem them for real rewards.
          </p>
          <div style={hero.cta}>
            {!user ? (
              <a href="/api/auth/github" className="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                Start with GitHub
              </a>
            ) : (
              <Link to="/contributions" className="btn btn-primary btn-lg">Log a Contribution</Link>
            )}
            <Link to="/projects" className="btn btn-secondary btn-lg">Browse Projects</Link>
          </div>
        </div>
        <div style={hero.grid} aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} style={{ ...hero.gridDot, opacity: Math.random() * 0.6 + 0.1 }} />
          ))}
        </div>
      </section>

      {/* Stats */}
      {stats && (
        <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <div className="container" style={{ padding: '40px 24px', display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap' }}>
            {[
              { value: stats.totalUsers?.toLocaleString(), label: 'Contributors' },
              { value: stats.totalContributions?.toLocaleString(), label: 'Contributions' },
              { value: stats.totalPointsAwarded?.toLocaleString(), label: 'Points Awarded' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 40, fontWeight: 700, color: 'var(--accent)', display: 'block' }}>{s.value}</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Projects */}
      <section className="page">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">// Featured Projects</h2>
            <Link to="/projects" className="btn btn-ghost btn-sm">All Projects →</Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid-3">
              {featured.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
          ) : (
            <div className="empty-state"><p>No featured projects yet.</p></div>
          )}
        </div>
      </section>

      {/* Top contributors */}
      {topUsers.length > 0 && (
        <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '48px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">// Top Contributors</h2>
              <Link to="/leaderboard" className="btn btn-ghost btn-sm">Full Leaderboard →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topUsers.map((entry, i) => (
                <div key={entry.user._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: i < 3 ? 'var(--accent)' : 'var(--text-muted)', width: 28, textAlign: 'center' }}>
                    {i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </span>
                  <img src={entry.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user.name)}&background=334155&color=94a3b8`}
                    alt={entry.user.name} className="avatar" style={{ width: 40, height: 40 }} />
                  <Link to={`/profile/${entry.user._id}`} style={{ fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', flex: 1 }}>{entry.user.name}</Link>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700 }}>{entry.periodPoints} pts</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>// How It Works</h2>
          <div className="grid-3">
            {[
              { step: '01', title: 'Sign In', desc: 'Connect your GitHub account with one click to get started.' },
              { step: '02', title: 'Contribute', desc: 'Submit contributions to open-source projects — PRs, issues, docs, reviews.' },
              { step: '03', title: 'Earn & Redeem', desc: 'Earn points for approved contributions and redeem them for real rewards.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 48, color: 'var(--accent)', opacity: 0.3, marginBottom: 8 }}>{step}</div>
                <h3 style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const hero = {
  section: { position: 'relative', overflow: 'hidden', padding: '100px 0 80px', background: 'linear-gradient(135deg, var(--bg-primary) 0%, #0c1a2e 100%)', borderBottom: '1px solid var(--border)' },
  content: { position: 'relative', zIndex: 1, textAlign: 'center' },
  eyebrow: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 16 },
  title: { fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 700, marginBottom: 24, lineHeight: 1.1 },
  sub: { fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 },
  cta: { display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' },
  grid: { position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 80, padding: 40, pointerEvents: 'none' },
  gridDot: { width: 200, height: 200, borderRadius: '50%', background: 'var(--accent)', filter: 'blur(80px)' },
};
