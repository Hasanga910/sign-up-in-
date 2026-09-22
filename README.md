# Sign Up / Sign In (React + Express + Supabase)

Email/password, Google + GitHub OAuth, and email/phone OTP auth, built on Supabase.

## Structure

- `frontend/` — Vite + React + TypeScript SPA (signup, signin, OTP, forgot password, protected dashboard)
- `backend/` — Express + TypeScript API (JWT verification middleware, rate-limited auth routes)
- `supabase/migrations/` — SQL for the `profiles` table + RLS policies

## 1. Set up Supabase

1. In the [Supabase dashboard](https://supabase.com/dashboard), open your project and go to **SQL Editor**. Run, in order:
   - `supabase/migrations/0001_init_profiles.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   (Alternatively, if you have the Supabase CLI linked to this project: `supabase db push`.)
2. Under **Authentication → Providers**, enable:
   - **Email**
   - **Phone** — requires connecting an SMS provider (Twilio or MessageBird) with its own credentials
   - **Google** — needs a Google OAuth Client ID/Secret
   - **GitHub** — needs a GitHub OAuth App Client ID/Secret
3. Under **Authentication → URL Configuration**, set:
   - **Site URL**: `http://localhost:5173`
   - **Redirect URLs**: add `http://localhost:5173/auth/callback`
4. Under **Authentication → Settings**, review OTP expiry and rate-limit settings (defaults are fine to start).
5. From **Project Settings → API**, collect:
   - Project URL
   - `anon` public key
   - `service_role` key (server-side only — never put this in the frontend)
   - JWT secret

## 2. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Fill in the real values from step 1.5 above. Both `.env` files are gitignored — only the `.example` templates are committed.

## 3. Run it

```bash
# terminal 1
cd backend && npm install && npm run dev   # http://localhost:4000

# terminal 2
cd frontend && npm install && npm run dev  # http://localhost:5173
```

## 4. Try it out

- Sign up with email/password at `/signup` → check **Table Editor → profiles** in Supabase for the new row (created by the `on_auth_user_created` trigger).
- Sign in at `/signin`. Wrong credentials show a generic error (no hint about which field was wrong).
- Once signed in, `/dashboard` calls the backend's `GET /api/user/me` with your Supabase access token, proving the `requireAuth` middleware verifies the JWT server-side.
- Sign out, then visit `/dashboard` directly — you'll be bounced to `/signin` (`ProtectedRoute`).
- Try `/verify-otp` for a passwordless email or SMS code.
- Try the Google/GitHub buttons — these only work once the corresponding provider is fully configured in the Supabase dashboard (step 1.2).

## Notes

- The frontend calls Supabase directly with the public anon key for signup/signin/OAuth/OTP — this is the standard pattern for SPAs and is safe because RLS protects the data.
- The backend's `/api/auth/*` routes exist to show the server-side/admin pattern (e.g. for custom validation or audit logging) and are not required for the frontend flows above to work.
- Rate limiting (10 requests/15 min per IP) is applied to all backend auth routes.
