# Fix e-mail login on Vercel + unify the Developer Console layout

## Part 1 — "Inloggen faalt aan serverzijde"

### What the checks showed
- Here, "Verder met e-mail" works: the server answers OK and creates the login link.
- The four Better Auth tables in Neon (user, session, account, verification) are complete, with all expected columns. Bluesky/Mastodon/birthdate tables were already applied earlier.
- So the failure only happens on Vercel. That message is our generic fallback, and it hides the real error. Most likely cause (still to confirm): the Neon connection used for login needs WebSockets. Vercel's Node runtime may not provide them, which makes every login call crash.
- A second, silent problem: if Brevo is missing or rejects the request, the email is not sent, but the screen still says "check your inbox".

### Fix
1. **Make the Neon connection robust:** give the login connection a WebSocket fallback on Node (the `ws` package, only when the runtime has none). Alternatively, use Neon's HTTP-based driver for Better Auth queries where possible.
2. **Show the real cause:** the auth endpoint logs the full error on the server and returns a short, safe error code. The sign-in screen maps that code to clear Dutch text, for example: "Database not reachable", "Email service not set up", "Login secret missing". No secrets are exposed.
3. **Handle email failures gracefully:** if the magic link cannot be sent, the user gets a clear message ("We could not send the email, try a password or Google") instead of a false success or a 500 error. The failure is logged with the reason Brevo gave.
4. **Diagnostics:** extend `/api/public/auth/providers?diagnose=1` with a live database check and an email-service check (yes/no, never values), so a Vercel deploy can be checked in one click.
5. **Verify:** test the magic link and password login here, and also with WebSockets disabled to simulate Vercel. Then check the server logs after your next deploy.

## Part 2 — Developer Console fits the rest of ROUT
- **Top bar:** the same header as the rest of the site, with the ROUT logo leading to the homepage, the NL/EN/FR/DE language switch and the profile menu on the right.
- **Left menu:** stays (Dashboard, Auth & Identity, API & Webhooks, AI Connectors, Billing, and per app: Credentials, Branding…), placed below the header and staying in view while you scroll. On mobile it remains a slide-out menu, opened from a "Console menu" button below the header.
- **Footer:** the standard ROUT footer is back at the bottom of every console page.
- The console keeps its dark look; only the frame becomes the same as the rest of the site.

## Technical details
- `src/lib/better-auth.server.ts`: configure `neonConfig.webSocketConstructor` (dynamic import of `ws` when `globalThis.WebSocket` is missing); add the `ws` dependency.
- `src/routes/api_.auth.$.ts`: finer error classification (db_connect, email, secret, schema), and `console.error` with the stack trace.
- `sendMagicLink`: check the `sendMail` result; on `sent:false`, throw a recognisable `APIError` that the client maps.
- `src/pages/AuthNeon.tsx`: map codes to messages for magic link, password and social login.
- `authDiagnostics`: async `select 1` against Neon and a `BREVO_API_KEY` presence check.
- `src/routes/_authenticated/console.tsx`: reuse the `AppLayout` header pieces (`RoutLogo`, `LanguageToggle`, `ProfileMenu`) plus `Footer`; sticky sidebar at `top-16`, height `calc(100vh-4rem)`.
- Update the AGENTS.md rule for the console layout.
