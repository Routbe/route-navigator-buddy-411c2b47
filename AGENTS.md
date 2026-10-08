<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Architecture rules
- Neon (`DATABASE_URL`) is the only database; schema changes are idempotent files in `db/NN_*.sql`. Why: the app is deployed on Vercel outside Lovable Cloud.
- Login ON rout.be (Better Auth, `better-auth.server.ts`) and login VIA rout.be (OIDC provider, `src/lib/oauth/*`) never share config; provider env vars use the `ROUT_PROVIDER_*` prefix. Why: prevents one role breaking the other.
- Sign-in tiles are always rendered; unconfigured providers show a notice instead of sending a request. Why: missing keys must never hide options.
- Public profile visibility (`publicProfile`, `timelineVisible` in `display_prefs`) is enforced server-side in the public profile/timeline server functions. Why: client checks alone leak data.
- Influencer/business verification hands out names through the `approved_handles` whitelist (`db/45`); users claim exactly one via `claimApprovedHandle`. Why: the admin approves names, never types them for the user.
- Bluesky/Mastodon accounts without a provider-verified email are created or linked only after a hashed 6-digit email code (`fediverse-otp.server.ts`, `db/46`). Why: typed emails alone allow account takeover.
- Birthdates live in the separate `user_birthdates` table (`db/48`) and are written only via `saveMyBirthdate`; verification requests return `birthdate_required` until present. Why: keeps legal data out of profile mass-assignment paths.

- Every environment variable name is documented in `ENVIRONMENT.md` (+ `.env.example`); login provider env lookups go through `envAny()` aliases in `better-auth.server.ts` (incl. `<PROVIDER>_OAUTH_CLIENT_*`), and the auth secret resolves via `resolveAuthSecret()` with a derived fallback so a missing variable never breaks every sign-in. Why: one findable list for deployers on Vercel.
- The sign-in screen treats a failed provider-status check as unknown (buttons still try), never as "all inactive". Why: a flaky status call must not disable working logins.

- Files live in Scaleway Object Storage via `src/lib/storage/s3.server.ts` (client bucket = member data under `users/<uid>/`, internal bucket = ROUT assets, admin-only); Neon stores only metadata. Why: keeps blobs out of the database and separates customer data from platform assets.
- Temporary QR files are private objects with `expires_at` in `shared_files` (db/51), served only through `/f/<id>` presigned redirects and purged by cron. Why: shared links must stop working after expiry.
- The Developer Console renders the shared site header (logo → home, language, profile) and Footer around its own sticky sidebar in `_authenticated/console.tsx`. Why: the console must feel like part of ROUT.
- OAuth client console settings (publishing status, PKCE, token TTL, IP allowlist, account discovery) are enforced in `provider.server.ts`/`console.functions.ts` server-side, never only in the UI. Why: the console is the developer's control plane; the OIDC endpoints are the security boundary.
