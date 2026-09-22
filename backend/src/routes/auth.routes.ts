import { Router } from 'express';
import { supabaseAdmin } from '../config/supabaseAdmin.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Sign up with email + password (custom/admin path — most apps call supabase.auth.signUp
// directly from the frontend instead; this route exists to demonstrate server-side signup).
router.post('/signup', authRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user });
});

// Send OTP (email or phone)
router.post('/otp/send', authRateLimiter, async (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone required' });
  }

  const { error } = await supabaseAdmin.auth.signInWithOtp(email ? { email } : { phone });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'OTP sent' });
});

// Verify OTP
router.post('/otp/verify', authRateLimiter, async (req, res) => {
  const { email, phone, token } = req.body;
  if (!token || (!email && !phone)) {
    return res.status(400).json({ error: 'Token and email or phone required' });
  }

  const { data, error } = await supabaseAdmin.auth.verifyOtp(
    email ? { email, token, type: 'email' } : { phone, token, type: 'sms' }
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

export default router;
