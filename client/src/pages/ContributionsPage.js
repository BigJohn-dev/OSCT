import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { contributionService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContributionCard from '../components/ContributionCard';
import Pagination from '../components/Pagination';

const TYPES = [
  { value: 'bug_fix', label: 'Bug Fix', points: 10 },
  { value: 'feature', label: 'Feature Addition', points: 25 },
  { value: 'documentation', label: 'Documentation', points: 5 },
  { value: 'code_review', label: 'Code Review', points: 8 },
  { value: 'issue_report', label: 'Issue Report', points: 3 },
  { value: 'test', label: 'Test Addition', points: 12 },
  { value: 'translation', label: 'Translation', points: 7 },
  { value: 'design', label: 'Design', points: 15 },
];

export default function ContributionsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultProject = searchParams.get('project') || '';

  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showForm, setShowForm] = useState(!!defaultProject);
  const [projects, setProjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({ project: defaultProject, type: 'bug_fix', title: '', description: '', githubPrUrl: '', githubIssueUrl: '' });

  const loadContributions = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await contributionService.getAll({ user: user._id, page: p, limit: 10 });
      setContributions(data.contributions);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } catch {}
    setLoading(false);
  }, [user._id]);

  useEffect(() => {
    loadContributions(1);
    projectService.getAll({ limit: 100 }).then(r => setProjects(r.data.projects)).catch(() => {});
  }, [loadContributions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    setSuccess('');
    try {
      await contributionService.create(form);
      setSuccess('Contribution logged! It will be reviewed shortly.');
      setForm({ project: '', type: 'bug_fix', title: '', description: '', githubPrUrl: '', githubIssueUrl: '' });
      setShowForm(false);
      loadContributions(1);
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Failed to submit. Please check your input.');
    }
    setSubmitting(false);
  };

  const selectedType = TYPES.find(t => t.value === form.type);

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28 }}>{'// My Contributions'}</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{total} total contributions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(f => !f)}>
            {showForm ? 'Cancel' : '+ Log Contribution'}
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Log Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 18, marginBottom: 24 }}>{'// Log New Contribution'}</h2>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid-2" style={{ marginBottom: 20 }}>
                <div className="form-group">
                  <label className="form-label">Project *</label>
                  <select value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} required>
                    <option value="">Select a project…</option>
                    {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Contribution Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required>
                    {TYPES.map(t => <option key={t.value} value={t.value}>{t.label} (+{t.points} pts)</option>)}
                  </select>
                  {selectedType && (
                    <div className="form-hint">This contribution is worth <strong style={{ color: 'var(--accent)' }}>{selectedType.points} points</strong></div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Fixed null pointer exception in auth module" required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe your contribution in detail…" style={{ resize: 'vertical' }} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">GitHub PR URL</label>
                  <input value={form.githubPrUrl} onChange={e => setForm(f => ({ ...f, githubPrUrl: e.target.value }))} placeholder="https://github.com/…/pull/123" type="url" />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub Issue URL</label>
                  <input value={form.githubIssueUrl} onChange={e => setForm(f => ({ ...f, githubIssueUrl: e.target.value }))} placeholder="https://github.com/…/issues/456" type="url" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Contribution'}
              </button>
            </form>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="spinner" />
        ) : contributions.length > 0 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {contributions.map(c => (
                <ContributionCard key={c._id} contribution={c} showUser={false}
                  onDelete={async (cid) => { if (window.confirm('Delete this contribution?')) { await contributionService.delete(cid); loadContributions(page); } }}
                />
              ))}
            </div>
            <Pagination page={page} pages={pages} onPage={loadContributions} />
          </>
        ) : (
          <div className="empty-state">
            <h3>No contributions yet</h3>
            <p>Log your first contribution to start earning points!</p>
          </div>
        )}
      </div>
    </div>
  );
}
