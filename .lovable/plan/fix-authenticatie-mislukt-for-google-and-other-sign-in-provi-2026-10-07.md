# Fix "Authenticatie mislukt" for Google and other sign-in providers

## What I found
- The old project used its own small Google/GitHub flow. It needed only `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, with `DATABASE_URL` as a fallback secret. The new code uses Better Auth, which has **stricter requirements**:
  1. **`BETTER_AUTH_SECRET` (or `AUTH_SECRET`) is required and must be at least 32 characters.** If it is missing, every request to `/api/auth/*` fails with a server error. The sign-in screen then shows the generic "Authenticatie mislukt" for **every** provider, which matches what you see. This secret is also missing in this workspace.
  2. **Key names:** the code only reads `GOOGLE_CLIENT_ID` / `AUTH_GOOGLE_ID` / `GOOGLE_ID` (and the matching secret names). Your secrets here are named `GOOGLE_OAUTH_CLIENT_ID` / `GOOGLE_OAUTH_CLIENT_SECRET`, so the code does not pick them up.
  3. **Callback URL changed:** Better Auth sends Google back to `/api/auth/callback/google`. The old project used `/api/public/auth/google/callback`. If Google Console only allows the old address, Google rejects the sign-in.
  4. Login only works on a site address Better Auth trusts. If `BETTER_AUTH_URL` is set to a different domain than the one you are visiting, the login cookie breaks.
- The sign-in screen hides the real reason, so the cause has been impossible to see so far.

## Fix (the developer portal and "Login with ROUT" stay untouched)
1. **Accept more key names:** also read `GOOGLE_OAUTH_CLIENT_ID/SECRET`, `GITHUB_OAUTH_*`, `GITLAB_OAUTH_*`, and `APPLE_OAUTH_*`. If `BETTER_AUTH_SECRET` is missing, use a stable secret derived from `SESSION_SECRET`/`OAUTH_STATE_SECRET` instead of crashing, and log a clear warning.
2. **Show the real error:** the auth endpoint returns a readable code (`missing_secret`, `provider_not_configured`, `db_error`). The sign-in screen shows it as "Google is not set up correctly: …" instead of just "Authenticatie mislukt".
3. **Readiness check:** extend the existing provider status so the admin/console can see, per provider, which variable is missing and the exact callback URL to paste into Google, GitHub, and others.
4. **Docs:** list the new aliases and callback URLs in `ENVIRONMENT.md` and `.env.example`, plus a Vercel checklist: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` = the live domain, and the redirect URIs in Google Console.
5. **Verify:** call `/api/auth/sign-in/social` locally for Google and confirm it returns a Google redirect URL. Check that the `neon_auth` tables (they exist: user, session, account, verification) have the columns Better Auth expects.

## What you do on Vercel afterwards
- Add `BETTER_AUTH_SECRET` (a random value of at least 32 characters).
- Set `BETTER_AUTH_URL=https://<your live domain>`.
- In Google Cloud Console, add the redirect URI `https://<domain>/api/auth/callback/google`. Do the same for GitHub and other providers.

## Technical details
- Files: `src/lib/better-auth.server.ts` (ALIASES, secret fallback), `src/routes/api_.auth.$.ts` (try/catch that returns JSON errors), `src/pages/AuthNeon.tsx` (error mapping), `src/routes/api_.public.auth.providers.ts` (diagnostics without secret values), `ENVIRONMENT.md`, `.env.example`.
- Update the AGENTS.md rule on env aliases.
