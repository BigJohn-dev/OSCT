import React, { useEffect, useState, useCallback } from 'react';
import { projectService } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';

const DIFFICULTIES = ['', 'beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['', 'web', 'mobile', 'desktop', 'cli', 'library', 'framework', 'devtools', 'ai', 'blockchain', 'other'];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ search: '', difficulty: '', category: '', language: '' });
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 12, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      const { data } = await projectService.getAll(params);
      setProjects(data.projects);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(1); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters(f => ({ ...f, search: searchInput }));
  };

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div className="page">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28 }}>// Projects</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{total} open-source projects to contribute to</p>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search projects…"
              style={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>

          <select value={filters.difficulty} onChange={e => setFilter('difficulty', e.target.value)} style={styles.select}>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d ? d.charAt(0).toUpperCase() + d.slice(1) : 'All Difficulties'}</option>)}
          </select>

          <select value={filters.category} onChange={e => setFilter('category', e.target.value)} style={styles.select}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All Categories'}</option>)}
          </select>

          {(filters.search || filters.difficulty || filters.category) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setFilters({ search: '', difficulty: '', category: '', language: '' }); setSearchInput(''); }}>
              Clear Filters ✕
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : projects.length > 0 ? (
          <>
            <div className="grid-3">
              {projects.map(p => <ProjectCard key={p._id} project={p} />)}
            </div>
            <Pagination page={page} pages={pages} onPage={load} />
          </>
        ) : (
          <div className="empty-state">
            <h3>No projects found</h3>
            <p>Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  filters: { display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' },
  searchForm: { display: 'flex', gap: 8, flex: 1, minWidth: 240 },
  searchInput: { flex: 1 },
  select: { width: 'auto', minWidth: 160 },
};
