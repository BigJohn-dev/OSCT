import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, contributionService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContributionCard from '../components/ContributionCard';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      projectService.getById(id),
      contributionService.getAll({ project: id, status: 'approved', limit: 10 })
    ]).then(([pRes, cRes]) => {
      setProject(pRes.data.project);
      setContributions(cRes.data.contributions);
    }).catch(() => setError('Project not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await projectService.sync(id);
      setProject(data.project);
    } catch {}
    setSyncing(false);
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (error || !project) return <div className="page"><div className="container"><div className="empty-state"><h3>{error || 'Not found'}</h3></div></div></div>;

  const { name, description, githubUrl, websiteUrl, language, difficulty, category, stars, forks, openIssues, topics, contributionCount, logo, maintainer, isFeatured } = project;

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            {logo ? <img src={logo} alt={name} style={styles.logo} /> : (
              <div style={styles.logoFb}>{name.charAt(0)}</div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 28, fontFamily: 'var(--font-mono)' }}>{name}</h1>
                {isFeatured && <span className="badge badge-cyan">⭐ Featured</span>}
                {difficulty && <span className={`badge ${difficulty === 'beginner' ? 'badge-green' : difficulty === 'advanced' ? 'badge-red' : 'badge-yellow'}`}>{difficulty}</span>}
              </div>
              {maintainer && (
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
                  Maintained by <Link to={`/profile/${maintainer._id}`} style={{ color: 'var(--accent)' }}>{maintainer.name}</Link>
                </p>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">GitHub →</a>
            {websiteUrl && <a href={websiteUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">Website</a>}
            {user && (user.role === 'admin' || user.role === 'moderator') && (
              <button className="btn btn-ghost btn-sm" onClick={handleSync} disabled={syncing}>
                {syncing ? 'Syncing…' : '🔄 Sync GitHub'}
              </button>
            )}
          </div>
        </div>

        <div style={styles.grid}>
          {/* Main */}
          <div style={styles.main}>
            <div className="card">
              <h2 style={{ fontSize: 16, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>// About</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{description}</p>
              {topics?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                  {topics.map(t => <span key={t} style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 11, padding: '3px 10px', borderRadius: 100, fontFamily: 'var(--font-mono)' }}>{t}</span>)}
                </div>
              )}
            </div>

            {/* Contribute CTA */}
            {user ? (
              <div className="card" style={{ background: 'var(--accent-dim)', borderColor: 'rgba(34,211,238,0.3)', textAlign: 'center', padding: 32 }}>
                <h3 style={{ marginBottom: 8 }}>Ready to contribute?</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>Log a contribution to this project and earn points.</p>
                <Link to={`/contributions?project=${id}`} className="btn btn-primary">Log Contribution</Link>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: 32 }}>
                <h3 style={{ marginBottom: 8 }}>Join OSCT to contribute</h3>
                <Link to="/login" className="btn btn-primary">Sign in with GitHub</Link>
              </div>
            )}

            {/* Recent contributions */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 16 }}>// Recent Contributions</h2>
              {contributions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {contributions.map(c => <ContributionCard key={c._id} contribution={c} />)}
                </div>
              ) : (
                <div className="empty-state"><p>No contributions yet. Be the first!</p></div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={styles.sidebar}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginBottom: 16, color: 'var(--text-muted)' }}>// Stats</h3>
              {[
                { label: '⭐ Stars', value: stars?.toLocaleString() },
                { label: '🍴 Forks', value: forks?.toLocaleString() },
                { label: '🐛 Open Issues', value: openIssues?.toLocaleString() },
                { label: '🤝 Contributions', value: contributionCount?.toLocaleString() },
                { label: '💻 Language', value: language || '—' },
                { label: '📁 Category', value: category || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={styles.statRow}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 32, flexWrap: 'wrap' },
  headerLeft: { display: 'flex', gap: 20, alignItems: 'center' },
  logo: { width: 64, height: 64, borderRadius: 12, objectFit: 'cover' },
  logoFb: { width: 64, height: 64, borderRadius: 12, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' },
  main: { display: 'flex', flexDirection: 'column', gap: 24 },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 },
  statRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' },
};
