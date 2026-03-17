import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { leaderboardService } from '../services/api';
import Pagination from '../components/Pagination';

const PERIODS = [
  { value: 'all', label: 'All Time' },
  { value: 'month', label: 'This Month' },
  { value: 'week', label: 'This Week' },
];

const RANK_ICONS = ['👑', '🥈', '🥉'];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await leaderboardService.get({ period, page: p, limit: 20 });
      setLeaderboard(data.leaderboard);
      setPages(data.pages || 1);
      setPage(p);
    } catch {}
    setLoading(false);
  }, [period]);

  useEffect(() => { load(1); }, [load]);
  useEffect(() => { leaderboardService.getStats().then(r => setStats(r.data)).catch(() => {}); }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28 }}>{'// Leaderboard'}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Top contributors ranked by points earned</p>
          </div>
        </div>

        {/* Community stats */}
        {stats && (
          <div className="grid-3" style={{ marginBottom: 32 }}>
            {[
              { label: 'Contributors', value: stats.totalUsers },
              { label: 'Contributions', value: stats.totalContributions },
              { label: 'Points Awarded', value: stats.totalPointsAwarded },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <span className="stat-value">{s.value?.toLocaleString()}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Period tabs */}
        <div style={styles.tabs}>
          {PERIODS.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              style={{ ...styles.tab, ...(period === p.value ? styles.tabActive : {}) }}>
              {p.label}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {/* Top 3 podium */}
            {page === 1 && leaderboard.length >= 3 && (
              <div style={styles.podium}>
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, i) => {
                  if (!entry) return null;
                  const rank = i === 1 ? 0 : i === 0 ? 1 : 2;
                  const sizes = [80, 100, 80];
                  return (
                    <Link key={entry.user._id} to={`/profile/${entry.user._id}`} style={{ textDecoration: 'none', textAlign: 'center', flex: 1 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{RANK_ICONS[rank]}</div>
                      <img src={entry.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user.name)}&background=334155&color=94a3b8`}
                        alt={entry.user.name} className="avatar"
                        style={{ width: sizes[i], height: sizes[i], border: rank === 0 ? '3px solid var(--accent)' : '2px solid var(--border)', marginBottom: 8 }} />
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{entry.user.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                        {entry.periodPoints} pts
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Full table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 60 }}>Rank</th>
                      <th>Contributor</th>
                      <th>GitHub</th>
                      <th>Badges</th>
                      <th style={{ textAlign: 'right' }}>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, i) => {
                      const rank = (page - 1) * 20 + i + 1;
                      return (
                        <tr key={entry.user._id}>
                          <td style={{ fontFamily: 'var(--font-mono)', color: rank <= 3 ? 'var(--accent)' : 'var(--text-muted)', textAlign: 'center', fontWeight: 700 }}>
                            {rank <= 3 ? RANK_ICONS[rank - 1] : `#${rank}`}
                          </td>
                          <td>
                            <Link to={`/profile/${entry.user._id}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                              <img src={entry.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.user.name)}&background=334155&color=94a3b8`}
                                alt="" className="avatar" style={{ width: 32, height: 32 }} />
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{entry.user.name}</span>
                            </Link>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                            {entry.user.githubUsername && (
                              <a href={`https://github.com/${entry.user.githubUsername}`} target="_blank" rel="noreferrer"
                                style={{ color: 'var(--text-muted)' }}>@{entry.user.githubUsername}</a>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {entry.user.badges?.slice(0, 3).map(b => (
                                <span key={b.name} title={b.name} style={{ fontSize: 18 }}>{b.icon}</span>
                              ))}
                            </div>
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: 16 }}>
                            {entry.periodPoints?.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination page={page} pages={pages} onPage={load} />
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  tabs: { display: 'flex', gap: 4, marginBottom: 24, background: 'var(--bg-secondary)', padding: 4, borderRadius: 'var(--radius)', width: 'fit-content' },
  tab: { padding: '8px 20px', borderRadius: 6, background: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, transition: 'all 0.15s', cursor: 'pointer' },
  tabActive: { background: 'var(--bg-card)', color: 'var(--text-primary)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' },
  podium: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 32, padding: '40px 24px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 24 },
};
