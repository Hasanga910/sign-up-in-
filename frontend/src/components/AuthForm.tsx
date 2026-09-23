import { useState } from 'react';
import type { FormEvent } from 'react';

interface AuthFormProps {
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  passwordAutoComplete?: 'current-password' | 'new-password';
}

export function AuthForm({ submitLabel, onSubmit, passwordAutoComplete = 'current-password' }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete={passwordAutoComplete}
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Please wait…' : submitLabel}
      </button>
    </form>
  );
}
