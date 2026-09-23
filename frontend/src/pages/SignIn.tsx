import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AuthForm } from '../components/AuthForm';
import { OAuthButtons } from '../components/OAuthButtons';

export default function SignIn() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSignIn(email: string, password: string) {
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error);
      setErrorMessage('Invalid email or password'); // never say which one is wrong
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div>
      <h1>Sign in</h1>
      <AuthForm submitLabel="Sign in" onSubmit={handleSignIn} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <OAuthButtons />
      <p>
        <Link to="/verify-otp">Use a one-time code instead</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot password?</Link>
      </p>
      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
