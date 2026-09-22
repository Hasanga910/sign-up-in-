import { useState } from 'react';
import type { FormEvent } from 'react';

interface OtpInputProps {
  onSubmit: (code: string) => Promise<void>;
}

export function OtpInput({ onSubmit }: OtpInputProps) {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(code);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        6-digit code
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          autoComplete="one-time-code"
        />
      </label>
      <button type="submit" disabled={submitting || code.length < 6}>
        {submitting ? 'Verifying…' : 'Verify code'}
      </button>
    </form>
  );
}
