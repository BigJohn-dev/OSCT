import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 96, fontWeight: 700, color: 'var(--accent)', opacity: 0.2, lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-mono)', fontSize: 28, marginBottom: 12 }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>This route doesn't exist. Let's get you back on track.</p>
        <Link to="/" className="btn btn-primary">← Back to Home</Link>
      </div>
    </div>
  );
}
