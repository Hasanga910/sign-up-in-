import { supabase } from '../lib/supabaseClient';

async function signInWithGoogle() {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

async function signInWithGithub() {
  await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
}

export function OAuthButtons() {
  return (
    <div className="oauth-buttons">
      <button type="button" onClick={signInWithGoogle}>
        Continue with Google
      </button>
      <button type="button" onClick={signInWithGithub}>
        Continue with GitHub
      </button>
    </div>
  );
}
