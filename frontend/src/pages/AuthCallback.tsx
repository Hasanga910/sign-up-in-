import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Landing spot for OAuth + password-reset redirects. supabase-js parses the
// session out of the URL automatically; once AuthContext picks it up we move on.
export default function AuthCallback() {
  const { session, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) navigate(session ? '/dashboard' : '/signin');
  }, [loading, session, navigate]);

  return <p>Signing you in…</p>;
}
