import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const TYPE_LABELS = {
  bug_fix: 'Bug Fix',
  feature: 'Feature',
  documentation: 'Docs',
  code_review: 'Review',
  issue_report: 'Issue',
  test: 'Tests',
  translation: 'i18n',
  design: 'Design',
};

const TYPE_COLORS = {
  bug_fix: 'badge-red',
  feature: 'badge-cyan',
  documentation: 'badge-yellow',
  code_review: 'badge-green',
  issue_report: 'badge-gray',
  test: 'badge-green',
  translation: 'badge-yellow',
  design: 'badge-cyan',
};

const STATUS_BADGE = {
  pending: 'badge-yellow',
  approved: 'badge-green',
  rejected: 'badge-red',
};

export default function ContributionCard({ contribution, showUser = true, onDelete, onReview }) {
  const { user, project, type, title, points, status, createdAt, githubPrUrl } = contribution;

  return (
    <div className="card" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.badges}>
          <span className={`badge ${TYPE_COLORS[type] || 'badge-gray'}`}>{TYPE_LABELS[type] || type}</span>
          <span className={`badge ${STATUS_BADGE[status]}`}>{status}</span>
        </div>
        <span style={styles.points}>+{points} pts</span>
      </div>

      <h3 style={styles.title}>{title}</h3>

      <div style={styles.meta}>
        {showUser && user && (
          <Link to={`/profile/${user._id}`} style={styles.userLink}>
            <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=334155&color=94a3b8`}
              alt={user.name} className="avatar" style={{ width: 20, height: 20 }} />
            {user.name}
          </Link>
        )}
        {project && (
          <Link to={`/projects/${project._id}`} style={styles.projectLink}>
            {project.name}
          </Link>
        )}
        <span style={styles.time}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div>

      <div style={styles.actions}>
        {githubPrUrl && (
          <a href={githubPrUrl} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm">
            View PR →
          </a>
        )}
        {onReview && status === 'pending' && (
          <>
            <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}
              onClick={() => onReview(contribution._id, 'approved')}>✓ Approve</button>
            <button className="btn btn-sm btn-danger" onClick={() => onReview(contribution._id, 'rejected')}>✗ Reject</button>
          </>
        )}
        {onDelete && (
          <button className="btn btn-ghost btn-sm" onClick={() => onDelete(contribution._id)}>Delete</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: { display: 'flex', flexDirection: 'column', gap: 12 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badges: { display: 'flex', gap: 8 },
  points: { fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--accent)' },
  title: { fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.4 },
  meta: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' },
  userLink: { display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500 },
  projectLink: { color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 },
  time: { marginLeft: 'auto' },
  actions: { display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' },
};
