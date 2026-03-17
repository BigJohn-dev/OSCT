import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');
    if (token) {
      login(token);
      navigate('/', { replace: true });
    } else {
      navigate(`/login?error=${error || 'unknown'}`, { replace: true });
    }
  }, [params, login, navigate]);

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>Signing you in…</p>
      </div>
    </div>
  );
}
