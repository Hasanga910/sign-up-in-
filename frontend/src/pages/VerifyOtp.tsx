import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { OtpInput } from '../components/OtpInput';

type Channel = 'email' | 'phone';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<Channel>('email');
  const [identifier, setIdentifier] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function sendOtp(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setSending(true);
    try {
      const { error } =
        channel === 'email'
          ? await supabase.auth.signInWithOtp({ email: identifier })
          : await supabase.auth.signInWithOtp({ phone: identifier });
      if (error) {
        console.error(error);
        setErrorMessage('Could not send code');
        return;
      }
      setCodeSent(true);
    } finally {
      setSending(false);
    }
  }

  async function verifyOtp(token: string) {
    setErrorMessage('');
    const { error } =
      channel === 'email'
        ? await supabase.auth.verifyOtp({ email: identifier, token, type: 'email' })
        : await supabase.auth.verifyOtp({ phone: identifier, token, type: 'sms' });
    if (error) {
      console.error(error);
      setErrorMessage('Invalid or expired code');
      return;
    }
    navigate('/dashboard');
  }

  return (
    <div>
      <h1>Sign in with a one-time code</h1>

      {!codeSent ? (
        <form onSubmit={sendOtp}>
          <fieldset>
            <label>
              <input
                type="radio"
                name="channel"
                checked={channel === 'email'}
                onChange={() => setChannel('email')}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                name="channel"
                checked={channel === 'phone'}
                onChange={() => setChannel('phone')}
              />
              Phone
            </label>
          </fieldset>
          <label>
            {channel === 'email' ? 'Email' : 'Phone number'}
            <input
              type={channel === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder={channel === 'phone' ? '+15555550123' : undefined}
            />
          </label>
          <button type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <OtpInput onSubmit={verifyOtp} />
      )}

      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}
