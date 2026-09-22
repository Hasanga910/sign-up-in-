import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [backendUser, setBackendUser] = useState<unknown>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchProtectedData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        setErrorMessage('Could not load your profile from the backend');
        return;
      }
      const body = await res.json();
      setBackendUser(body.user);
    }
    fetchProtectedData();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/signin');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page is only reachable while signed in.</p>
      <button type="button" onClick={handleSignOut}>
        Sign out
      </button>

      <h2>Backend response (GET /api/user/me)</h2>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {backendUser ? (
        <pre>{JSON.stringify(backendUser, null, 2)}</pre>
      ) : (
        !errorMessage && <p>Loading…</p>
      )}
    </div>
  );
}
