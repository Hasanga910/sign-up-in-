import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
}

// Service role key bypasses RLS — this client must only ever be used server-side.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  // Node 20 has no native WebSocket; supabase-js's realtime client needs one
  // even though this app doesn't use realtime features.
  realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
});
