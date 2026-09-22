import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AuthForm } from '../components/AuthForm';
import { OAuthButtons } from '../components/OAuthButtons';

export default function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const [done, setDone] = useState(false);

  async function handleSignUp(email: string, password: string) {
    setErrorMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrorMessage('Could not create account'); // generic message, don't leak specifics
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div>
        <h1>Check your inbox</h1>
        <p>We sent a confirmation link to finish creating your account.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign up</h1>
      <AuthForm submitLabel="Create account" onSubmit={handleSignUp} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <OAuthButtons />
      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
      <p>
        Prefer a one-time code? <Link to="/verify-otp">Sign up with OTP</Link>
      </p>
    </div>
  );
}
