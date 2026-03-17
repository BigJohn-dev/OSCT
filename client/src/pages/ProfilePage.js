import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContributionCard from '../components/ContributionCard';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const isOwn = me?._id === id;

  useEffect(() => {
    Promise.all([
      userService.getById(id),
      userService.getContributions(id, { status: 'approved', limit: 6 })
    ]).then(([u, c]) => {
      setProfile(u.data.user);
      setForm({ name: u.data.user.name, bio: u.data.user.bio, location: u.data.user.location, website: u.data.user.website, skills: u.data.user.skills?.join(', ') || '' });
      setContributions(c.data.contributions);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userService.update(id, { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      setProfile(data.user);
      setEditing(false);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!profile) return <div className="page"><div className="container"><div className="empty-state"><h3>User not found</h3></div></div></div>;

  const { name, avatar, githubUsername, bio, location, website, totalPoints, redeemedPoints, badges, skills, createdAt } = profile;
  const available = totalPoints - redeemedPoints;

  return (
    <div className="page">
      <div className="container">
        <div style={styles.layout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div className="card" style={{ textAlign: 'center' }}>
              <img src={avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=22d3ee&color=0f172a&size=128`}
                alt={name} className="avatar" style={{ width: 96, height: 96, margin: '0 auto 16px' }} />
              <h1 style={{ fontSize: 20, marginBottom: 4 }}>{name}</h1>
              {githubUsername && (
                <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer"
                  style={{ color: 'var(--text-muted)', fontSize: 13 }}>@{githubUsername}</a>
              )}
              {bio && <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>{bio}</p>}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {location && <span style={styles.metaItem}>📍 {location}</span>}
                {website && <a href={website} target="_blank" rel="noreferrer" style={{ ...styles.metaItem, color: 'var(--accent)' }}>🔗 {website.replace(/^https?:\/\//, '')}</a>}
                <span style={styles.metaItem}>📅 Joined {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>

              {isOwn && (
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 16, width: '100%' }} onClick={() => setEditing(e => !e)}>
                  {editing ? 'Cancel' : '✏️ Edit Profile'}
                </button>
              )}
            </div>

            {/* Points card */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>// Points</h3>
              {[
                { label: 'Total Earned', value: totalPoints, color: 'var(--accent)' },
                { label: 'Available', value: available, color: 'var(--success)' },
                { label: 'Redeemed', value: redeemedPoints, color: 'var(--warning)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={styles.pointRow}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color }}>{value?.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>// Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {skills.map(s => <span key={s} className="badge badge-gray">{s}</span>)}
                </div>
              </div>
            )}
          </aside>

          {/* Main */}
          <main style={styles.main}>
            {/* Edit form */}
            {editing && (
              <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 20 }}>// Edit Profile</h2>
                <form onSubmit={handleSave}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} style={{ resize: 'vertical' }} />
                  </div>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://…" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Skills (comma separated)</label>
                      <input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, Node.js, Python…" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
                </form>
              </div>
            )}

            {/* Badges */}
            {badges?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 16 }}>// Badges</h2>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {badges.map(b => (
                    <div key={b.name} title={b.name} style={styles.badge}>
                      <span style={{ fontSize: 32 }}>{b.icon}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributions */}
            <div>
              <div className="section-header">
                <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>// Contributions</h2>
                {isOwn && <Link to="/contributions" className="btn btn-ghost btn-sm">View All →</Link>}
              </div>
              {contributions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {contributions.map(c => <ContributionCard key={c._id} contribution={c} showUser={false} />)}
                </div>
              ) : (
                <div className="empty-state"><p>No approved contributions yet.</p></div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 },
  main: { display: 'flex', flexDirection: 'column', gap: 24 },
  metaItem: { fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' },
  pointRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' },
  badge: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px', minWidth: 80 },
};
