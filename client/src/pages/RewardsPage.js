import React, { useEffect, useState } from 'react';
import { rewardService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPE_ICONS = { discount: '🎫', content: '📚', mentorship: '🧑‍💻', swag: '👕' };

export default function RewardsPage() {
  const { user, refetch } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const available = user ? user.totalPoints - user.redeemedPoints : 0;

  useEffect(() => {
    Promise.all([rewardService.getAll(), rewardService.getMyRedemptions()])
      .then(([r, red]) => { setRewards(r.data.rewards); setRedemptions(red.data.redemptions); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRedeem = async (reward) => {
    if (!window.confirm(`Redeem "${reward.name}" for ${reward.cost} points?`)) return;
    setRedeeming(reward.name);
    setError('');
    setSuccess('');
    try {
      await rewardService.redeem(reward.name);
      setSuccess(`"${reward.name}" redeemed! Check your email for details.`);
      refetch();
      const red = await rewardService.getMyRedemptions();
      setRedemptions(red.data.redemptions);
    } catch (err) {
      setError(err.response?.data?.error || 'Redemption failed.');
    }
    setRedeeming('');
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28 }}>// Rewards</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Redeem your points for real-world rewards</p>
          </div>
          <div style={styles.pointsBox}>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Available Points</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{available.toLocaleString()}</span>
          </div>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Rewards grid */}
        <div className="grid-3" style={{ marginBottom: 48 }}>
          {rewards.map(reward => {
            const canRedeem = available >= reward.cost;
            return (
              <div key={reward.name} className="card" style={{ ...styles.rewardCard, opacity: canRedeem ? 1 : 0.6 }}>
                <div style={styles.rewardIcon}>{TYPE_ICONS[reward.type] || '🎁'}</div>
                <h3 style={{ fontSize: 16, marginBottom: 8 }}>{reward.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, flex: 1 }}>{reward.description}</p>
                <div style={styles.rewardFooter}>
                  <span style={styles.cost}>{reward.cost} pts</span>
                  <button
                    className={`btn btn-sm ${canRedeem ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!canRedeem || redeeming === reward.name}
                    onClick={() => handleRedeem(reward)}
                  >
                    {redeeming === reward.name ? 'Processing…' : canRedeem ? 'Redeem' : 'Not enough points'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Points breakdown */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 20 }}>// Points Breakdown</h2>
          <div className="grid-4">
            {[
              { type: 'Bug Fix', pts: 10, icon: '🐛' },
              { type: 'Feature', pts: 25, icon: '✨' },
              { type: 'Documentation', pts: 5, icon: '📝' },
              { type: 'Code Review', pts: 8, icon: '👀' },
              { type: 'Issue Report', pts: 3, icon: '🔍' },
              { type: 'Tests', pts: 12, icon: '🧪' },
              { type: 'Translation', pts: 7, icon: '🌐' },
              { type: 'Design', pts: 15, icon: '🎨' },
            ].map(({ type, pts, icon }) => (
              <div key={type} className="card" style={{ textAlign: 'center', padding: 16 }}>
                <span style={{ fontSize: 28 }}>{icon}</span>
                <div style={{ fontWeight: 600, fontSize: 13, marginTop: 8, color: 'var(--text-secondary)' }}>{type}</div>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700, marginTop: 4 }}>+{pts} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption history */}
        {redemptions.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 16 }}>// Redemption History</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reward</th>
                      <th>Points Used</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map(r => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 600 }}>{r.rewardName}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--warning)' }}>-{r.pointsCost}</td>
                        <td><span className={`badge ${r.status === 'fulfilled' ? 'badge-green' : r.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`}>{r.status}</span></td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pointsBox: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, background: 'var(--accent-dim)', padding: '16px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(34,211,238,0.2)' },
  rewardCard: { display: 'flex', flexDirection: 'column', gap: 12 },
  rewardIcon: { fontSize: 40 },
  rewardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' },
  cost: { fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 18, color: 'var(--accent)' },
};
