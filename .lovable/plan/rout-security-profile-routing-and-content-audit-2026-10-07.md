# ROUT security, profile routing, and content audit

## Goal
Finish the two uploaded checklists as one controlled security and quality pass. Preserve Neon, Better Auth, Brevo, Stripe, and Vercel; do not introduce Lovable Cloud. Database cleanup remains proposal-only and never deletes or renames data without approval.

## Confirmed starting points
- `/u/$username` already reads only `alias_profiles`, while `/$username` reads `profiles`; however, the clean-root lookup does not currently require verification, so an unverified profile can still be exposed at the root URL.
- The Studio has separate, always-clickable Privacy Alias and Verified Profile tabs. The locked verified tab contains `VerificationPanel`, but the root-profile editor also still contains a verification panel, so placement needs consolidation.
- Cross-table handle guards exist in `db/39`, but the live Neon schema and data cannot be verified until `DATABASE_URL` is supplied securely.
- Fediverse email codes already use hashed codes, three attempts, expiry, and a temporary lock. Passkey management exists; TOTP, recovery-code downloads, and multi-channel recovery are not implemented end to end.
- Account merge currently reconfirms both account passwords, but has no three-attempt lock and no email confirmation link from both accounts.
- Admin bootstrap still grants the oldest account admin when no owner exists; this needs the one-time token rule.
- Verification pricing is recomputed server-side. Gift-card pricing and every payment entry point still need a complete trust-boundary audit.
- Contact messages have strict validation, honeypot, timing checks, throttling, persistence, and Brevo delivery. A Turnstile verifier exists but is not wired into the contact submission.
- The required service secrets are not present in this workspace, so live database, email, payment, Turnstile, Telegram, SMS, and WhatsApp checks must be reported as blocked until configured.

## Phase 1 — Regression baseline and evidence
- Refresh the project roadmap so every item below has a visible status and blocker.
- Run lint, type checking, the complete automated test suite, and a production build; fix regressions before feature work.
- Exercise the requested screens in Chromium at desktop and mobile sizes: header, press page, Fediverse email step, Infomaniak tile, Studio/contact icons, profile languages and bio filtering, birthdate dialog, Developer Console consent, locked Studio tab, and admin inbox.
- Capture focused screenshots and record console/runtime/network failures without exposing tokens or personal data.

## Phase 2 — Profile namespace and Studio flow
- Enforce the routing contract server-side:
  - aliases render only from `alias_profiles` at `/u/<handle>`;
  - clean root profiles render only when verified and assigned an approved root handle;
  - old or wrong-form URLs issue a canonical redirect when ownership is unambiguous, otherwise return not found;
  - no fallback may show another account or expose the same profile in both namespaces.
- Make handle claiming transactional and race-safe across root handles, aliases, and subdomain aliases. Add regression tests for duplicates, case differences, reserved paths, approval, claiming, and redirect behavior.
- Keep both Studio tabs clickable. Put all identity, influencer/business verification, prices, payment methods, birthdate gating, application forms, and approved-handle claiming exclusively inside the locked Verified Profile tab; remove the duplicate entry from the editor.
- Keep the alias editor free of verification and payment controls, and test locked, pending, approved, paid, and claimed states.

## Phase 3 — Security patch
- Replace oldest-account auto-promotion with this rule: configured owner addresses may receive admin; otherwise the oldest account is promoted only after a valid, one-use `ADMIN_BOOTSTRAP_TOKEN`. Store only a digest/consumption record and add failure/audit tests.
- Trace every social sign-in and linking path. Require a provider-verified email or the existing hashed Fediverse email-code proof before linking; reject email mismatches and duplicate provider identities.
- Harden account merge with three PIN attempts, a timed lock, authenticated sessions for both accounts, confirmation links sent to both verified email addresses, single-use/expiry enforcement, transaction boundaries, and tests proving partial transfers cannot occur.
- Audit all gift-card, verification, donation, and checkout paths so product prices, fees, discounts, and payable totals are selected or recomputed on the server; client values remain display/input hints only.
- Replace permissive profile/account write validators with strict Zod schemas, bounded arrays/URLs/text, normalized handles, and explicit allowlists.
- Add structured redaction for logs and tests that prevent bunq keys, Stripe secrets/client secrets, session tokens, OTPs, merge tokens, and authorization headers from being logged.

## Phase 4 — Passkeys, TOTP, recovery, and channels
- Keep the existing passkey experience, align it with Better Auth’s supported WebAuthn flow, and test registration, sign-in, deletion, duplicate credentials, and unsupported browsers.
- Add Better Auth TOTP enrollment and verification with QR setup, step-up checks, disable/recovery safeguards, rate limits, and new idempotent Neon migrations numbered `49+`.
- Generate one-time recovery codes, store only hashes, show them once, and support copy, `.txt`, and image downloads with regeneration invalidating the old set.
- Add a preferred recovery channel: Telegram via `routbebot`, WhatsApp through the configured gateway, or SMS only for validated Belgian `+32` numbers. Apply verification, opt-in, replay protection, throttling, and audit records. Email codes remain sign-in/account-proof only, never a second factor.
- Add a dedicated recovery-policy help page and link it from security settings, footer, and documentation.

## Phase 5 — Content, legal pages, footer, and contact
- Compare About, Sovereignty, Manifesto, Privacy, Terms, Contact, Press, and README against the implemented behavior.
- Correct all four languages for profile URL separation, Passkeys/TOTP/recovery, Fediverse codes, birthdates, Console consent, payment methods, “free” claims, current revision dates, and processing through Telegram/SMS/WhatsApp. Remove dead links and unsupported promises.
- Reorganize the footer into clear Legal, Infrastructure, and Support groups, including the new recovery-policy route. Preserve separate, route-specific metadata for every content page.
- Wire Turnstile into the public contact form and server submission, retain the existing validation/throttling/honeypot protections, verify Brevo delivery and confirmation copy, and test graceful behavior when a provider is unavailable.

## Phase 6 — Neon verification and controlled migration
- After `DATABASE_URL` is provided through the secure secret form, connect read-only first and inspect the real schema, migration state, indexes, constraints, duplicate handles, orphaned rows, and suspicious naming.
- Verify `db/45`, `db/46`, and `db/48`; apply only missing idempotent migrations, followed by the new security migrations from this work.
- Produce a separate cleanup proposal for any rename, merge, or deletion. Execute none of those changes without explicit approval and prefer a Neon test branch before production.

## Validation and reporting
- Add focused unit/integration tests for routing, authorization, account linking/merge, amount tampering, validation, redaction, TOTP/recovery codes, and contact anti-spam.
- Repeat the requested browser flows with screenshots after fixes, then rerun lint, type checking, tests, and production build.
- Report after each phase: what works, what changed, evidence captured, and what is blocked by a missing key or external provider.

## Required inputs during implementation
The code-only and mocked portions can start immediately. Live checks will later need secure configuration for `DATABASE_URL`, Brevo, Stripe, Turnstile, `PUBLIC_SITE_URL`, the generated bootstrap token, Telegram, SMS, and WhatsApp. The previously exposed Telegram token must be revoked and replaced through BotFather before use.
