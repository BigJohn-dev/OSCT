import React, { useEffect, useState, useCallback } from 'react';
import { contributionService, projectService, leaderboardService, rewardService } from '../services/api';
import ContributionCard from '../components/ContributionCard';

const TABS = ['Overview', 'Contributions', 'Projects', 'Redemptions'];

export default function AdminDashboardPage() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    leaderboardService.getStats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const loadContributions = useCallback(async (status = 'pending') => {
    setLoading(true);
    try {
      const { data } = await contributionService.getAll({ status, limit: 20 });
      setContributions(data.contributions);
    } catch {}
    setLoading(false);
  }, []);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await projectService.getAll({ limit: 20 });
      setProjects(data.projects);
    } catch {}
    setLoading(false);
  }, []);

  const loadRedemptions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await rewardService.getMyRedemptions();
      setRedemptions(data.redemptions);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'Contributions') loadContributions('pending');
    if (tab === 'Projects') loadProjects();
    if (tab === 'Redemptions') loadRedemptions();
  }, [tab, loadContributions, loadProjects, loadRedemptions]);

  const handleReview = async (id, status) => {
    try {
      await contributionService.review(id, { status });
      setReviewMsg(`Contribution ${status}!`);
      loadContributions('pending');
      setTimeout(() => setReviewMsg(''), 3000);
    } catch (e) {
      setReviewMsg('Review failed.');
    }
  };

  const handleToggleFeatured = async (project) => {
    await projectService.update(project._id, { isFeatured: !project.isFeatured });
    loadProjects();
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await projectService.delete(id);
    loadProjects();
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28 }}>// Admin Dashboard</h1>
          <span className="badge badge-red">Admin</span>
        </div>

        {/* Tab nav */}
        <div style={styles.tabs}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>{t}</button>
          ))}
        </div>

        {reviewMsg && <div className="alert alert-success" style={{ marginBottom: 16 }}>{reviewMsg}</div>}

        {/* Overview */}
        {tab === 'Overview' && stats && (
          <div>
            <div className="grid-3" style={{ marginBottom: 32 }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
                { label: 'Total Contributions', value: stats.totalContributions, icon: '🤝' },
                { label: 'Points Awarded', value: stats.totalPointsAwarded, icon: '🏆' },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{s.icon}</div>
                  <span className="stat-value">{s.value?.toLocaleString()}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 style={{ fontFamily: 'var(--font-mono)', marginBottom: 16 }}>// Quick Actions</h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={() => setTab('Contributions')}>Review Pending Contributions</button>
                <button className="btn btn-secondary" onClick={() => setTab('Projects')}>Manage Projects</button>
                <button className="btn btn-secondary" onClick={() => setTab('Redemptions')}>View Redemptions</button>
              </div>
            </div>
          </div>
        )}

        {/* Contributions review */}
        {tab === 'Contributions' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              {['pending', 'approved', 'rejected'].map(s => (
                <button key={s} className="btn btn-ghost btn-sm" onClick={() => loadContributions(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
              ))}
            </div>
            {loading ? <div className="spinner" /> : contributions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {contributions.map(c => (
                  <ContributionCard key={c._id} contribution={c} onReview={handleReview} />
                ))}
              </div>
            ) : <div className="empty-state"><p>No contributions in this state.</p></div>}
          </div>
        )}

        {/* Projects management */}
        {tab === 'Projects' && (
          <div>
            {loading ? <div className="spinner" /> : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Language</th>
                        <th>Stars</th>
                        <th>Contributions</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td><span className="badge badge-gray">{p.language || '—'}</span></td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>⭐ {p.stars?.toLocaleString()}</td>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{p.contributionCount}</td>
                          <td>
                            <button className={`btn btn-sm ${p.isFeatured ? 'btn-primary' : 'btn-ghost'}`}
                              onClick={() => handleToggleFeatured(p)}>
                              {p.isFeatured ? '★ Featured' : '☆ Feature'}
                            </button>
                          </td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(p._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Redemptions */}
        {tab === 'Redemptions' && (
          <div>
            {loading ? <div className="spinner" /> : redemptions.length > 0 ? (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Reward</th><th>User</th><th>Points</th><th>Status</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {redemptions.map(r => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600 }}>{r.rewardName}</td>
                          <td>{r.user?.name || '—'}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>-{r.pointsCost}</td>
                          <td><span className={`badge ${r.status === 'fulfilled' ? 'badge-green' : r.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}>{r.status}</span></td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : <div className="empty-state"><p>No redemptions yet.</p></div>}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 4, marginBottom: 28, background: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius)', width: 'fit-content' },
  tab: { padding: '8px 20px', borderRadius: 6, background: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  tabActive: { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
};
