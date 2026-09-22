import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate('/signin');
  }, [loading, session, navigate]);

  if (loading) return <p>Loading…</p>;
  return session ? <>{children}</> : null;
}
