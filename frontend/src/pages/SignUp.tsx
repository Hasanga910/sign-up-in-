import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { AuthForm } from '../components/AuthForm';
import { OAuthButtons } from '../components/OAuthButtons';
import { OtpInput } from '../components/OtpInput';

export default function SignUp() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [debugMessage, setDebugMessage] = useState('');
  const [email, setEmail] = useState('');
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSignUp(email: string, password: string) {
    setErrorMessage('');
    setDebugMessage('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error(error);
      setErrorMessage('Could not create account'); // generic message, don't leak specifics
      if (import.meta.env.DEV) setDebugMessage(error.message);
      return;
    }
    setEmail(email);
    setAwaitingCode(true);
  }

  async function handleVerify(token: string) {
    setErrorMessage('');
    setDebugMessage('');
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
    if (error) {
      console.error(error);
      setErrorMessage('Invalid or expired code');
      if (import.meta.env.DEV) setDebugMessage(error.message);
      return;
    }
    navigate('/dashboard');
  }

  async function handleResend() {
    setErrorMessage('');
    setDebugMessage('');
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        console.error(error);
        setErrorMessage('Could not resend code');
        if (import.meta.env.DEV) setDebugMessage(error.message);
      }
    } finally {
      setResending(false);
    }
  }

  if (awaitingCode) {
    return (
      <div>
        <h1>Verify your email</h1>
        <p>We sent a 6-digit code to {email}. Enter it below to finish creating your account.</p>
        <OtpInput onSubmit={handleVerify} />
        <button type="button" onClick={handleResend} disabled={resending}>
          {resending ? 'Sending…' : 'Resend code'}
        </button>
        {errorMessage && <p role="alert">{errorMessage}</p>}
        {import.meta.env.DEV && debugMessage && (
          <p style={{ fontSize: '0.8em', color: 'gray' }}>{debugMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Sign up</h1>
      <AuthForm submitLabel="Create account" onSubmit={handleSignUp} passwordAutoComplete="new-password" />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {import.meta.env.DEV && debugMessage && (
        <p style={{ fontSize: '0.8em', color: 'gray' }}>{debugMessage}</p>
      )}
      <OAuthButtons />
      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
}
