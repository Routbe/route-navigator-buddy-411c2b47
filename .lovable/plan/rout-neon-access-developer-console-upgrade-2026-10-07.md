# ROUT: Neon access + Developer Console upgrade

## Current state (checked)
- The console already exists: `/console` (dashboard), `/console/api`, `/console/connectors`, `/console/billing`, `/console/apps`, and per app: overview (index), credentials, branding, redirects, scopes, security.
- The press kit files are in place (logo, icon and social avatar, each in black/white, SVG + PNG).
- Still missing from the briefs: an **Overview / Project Checkup** page, a **Publishing & Verification Center**, and an **Advanced** page (flow mode, account recognition, rich identity, each with code examples). The database has no fields yet for test/production mode, contact details, a verification request, PKCE enforcement, token lifetime or IP restrictions.

## Step 1: Neon access (your action)
- Once you approve, I'll open the secure form for `DATABASE_URL` (Neon dashboard → your project → **Connect** → copy the connection string, including `?sslmode=require`).
- Optional in the same form: `NEON_API_KEY` (Neon → Account settings → API keys), only if you also want me to manage branches/backups.
- Next, a read-only check of the live database: which `db/NN_*.sql` files have been applied, and whether tables and columns match the code. I report the differences before changing anything.
- Other keys (Stripe, Brevo, bunq, login providers) I only ask for once a feature that needs them gets tested.

## Step 2: Read the whole code
- Go through auth (Better Auth), the OIDC provider (`src/lib/oauth/*`), the console server functions, and the existing console pages, and note bugs and security issues.

## Step 3: Console upgrade (per app, Google Cloud-style left sidebar)
1. **Overview / Project Checkup**: status cards for domains (HTTPS redirects), PKCE, publishing status, and counters (active users, OAuth requests, errors from `oauth_auth_codes`/`oauth_consents`; placeholder when there is no data).
2. **Credentials**: Client ID, secret behind "click to reveal", rotation with a warning, endpoint card (discovery, authorize, token, userinfo) with copy buttons. Improve the existing page.
3. **Branding & consent screen**: existing fields + support email, legal owner, DPO (optional), live consent preview.
4. **Publishing & Verification**: Testing (max 10 test users, managed by e-mail/handle) vs Production; request form for the "Official ROUT Verified App" badge → status Pending/Verified; approval in admin.
5. **Redirects**: HTTPS required except localhost, live validation (enforced on the server too).
6. **Scopes**: openid/profile/email + rich identity, with exactly what data each scope shares.
7. **Security & Advanced**: PKCE enforcement, flow mode Seamless/Strict (`acr_values=urn:rout:acr:strict`), account auto-discovery (`prompt=none` + `login_hint`) with code examples, rich identity toggle, token lifetime, IP restrictions, delete app (with confirmation).
- The authorize/token endpoints honour the new settings (test users only in Testing, PKCE enforcement, token lifetime, `prompt=none` returns `login_required` with no screen).

## Step 4: Check the earlier briefs
- Go through the "Console & press kit" brief: `/api` → `/console` redirect, a single "Developer Console" link (new tab), consumer menus cleaned up, favicon = bunny without rings, `/press` download matrix, og-image. Fix anything that is missing.

## Step 5: Verification
- Browser test of all console pages (desktop + mobile), the `prompt=none` and PKCE flows, the press downloads; run the tests; build without errors.

## Technical details
- New migration `db/50_oauth_client_console.sql` (idempotent): on `oauth_clients` add `publishing_status`, `support_email`, `legal_owner`, `dpo_email`, `require_pkce`, `access_token_ttl`, `allowed_ips text[]`, `account_discovery_enabled`; new tables `oauth_client_test_users` and `oauth_client_verification_requests`. Run on Neon only after your OK, following the architecture rule (Neon only, no Lovable Cloud).
- All writes go through server functions with strict schemas and an owner check; admin approval checks the role on the server.
- Routes keep the existing `$appId` parameter (the briefs say `$clientId`), so existing links keep working; new: `overview`, `publishing`, `advanced`.
- Every new variable name goes into `ENVIRONMENT.md` + `.env.example`.
