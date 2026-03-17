import React from 'react';
import { Link } from 'react-router-dom';

const DIFF_COLORS = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' };

export default function ProjectCard({ project }) {
  const { _id, name, description, language, difficulty, stars, forks, contributionCount, topics, logo } = project;

  return (
    <Link to={`/projects/${_id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          {logo ? (
            <img src={logo} alt={name} style={styles.logo} />
          ) : (
            <div style={styles.logoFallback}>{name.charAt(0).toUpperCase()}</div>
          )}
          <div style={styles.topBadges}>
            {difficulty && <span className={`badge ${DIFF_COLORS[difficulty]}`}>{difficulty}</span>}
            {language && <span className="badge badge-gray">{language}</span>}
          </div>
        </div>

        <h3 style={styles.name}>{name}</h3>
        <p style={styles.desc}>{description?.slice(0, 120)}{description?.length > 120 ? '…' : ''}</p>

        {topics?.length > 0 && (
          <div style={styles.topics}>
            {topics.slice(0, 3).map(t => (
              <span key={t} style={styles.topic}>{t}</span>
            ))}
          </div>
        )}

        <div style={styles.stats}>
          <span style={styles.stat}>⭐ {stars?.toLocaleString()}</span>
          <span style={styles.stat}>🍴 {forks?.toLocaleString()}</span>
          <span style={styles.stat}>🤝 {contributionCount}</span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%', cursor: 'pointer', transition: 'all 0.2s', ':hover': { borderColor: 'var(--accent)' } },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 40, height: 40, borderRadius: 8, objectFit: 'cover' },
  logoFallback: { width: 40, height: 40, borderRadius: 8, background: 'var(--accent-dim)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)' },
  topBadges: { display: 'flex', gap: 6 },
  name: { fontSize: 16, fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--text-primary)' },
  desc: { fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 },
  topics: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  topic: { background: 'var(--bg-hover)', color: 'var(--text-muted)', fontSize: 11, padding: '2px 8px', borderRadius: 100, fontFamily: 'var(--font-mono)' },
  stats: { display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', marginTop: 'auto', paddingTop: 4, borderTop: '1px solid var(--border-subtle)' },
  stat: { display: 'flex', alignItems: 'center', gap: 4 },
};
