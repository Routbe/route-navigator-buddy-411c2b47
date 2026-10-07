# Audit and completion: Console, Studio and Verification

## Done, but not yet tested with real data
- **Developer Console:** the app overview, the per-app sidebar with its five pages, and the Developer Hub card.
- **Studio:**
  - Privacy Alias is the default tab.
  - The verified tab is locked until the account is verified.
  - The "Word Early Believer" heading now reads "Identiteitsverificatie en betaling".
- **Verification:**
  - Inbox with all form data already filled in, plus name approval with toggles.
  - "Nieuwe Persoon Verifiëren" panel.
  - Members choose their final name from a dropdown.
  - Emails when a request arrives and when it is approved or rejected.
- **Tests:** 15 rule tests pass, covering Strict, Rich Identity, redirect checks, the name whitelist and the Studio lock.

## Still missing
1. **Keys:** none of the keys are set yet, so nothing can talk to Neon, Brevo, Stripe or the login system.
2. **Database:** `db/45_approved_handles.sql` has not been run on Neon yet.
3. **Browser checks:** the console, Studio and admin pages have not been tested while logged in.
4. **Unchecked behaviour:**
   - Whether the consent screen at `/oauth/authorize` actually shows the code step and the Rich Identity checkbox.
   - Whether the person panel creates the handle from first and last name as expected.
5. **"Gratis" cleanup:** the word was only removed from the Studio, not from other Studio-related labels across the four languages.
6. **Form wording vs the brief:** the brief says "Sociale links (textarea)" and the field "Maatschappelijke zetel". The forms need checking against the exact field names and texts in the brief.

## Steps
1. **Ask for keys** through the secure form, without the values ever appearing in chat. These are needed to run the app and to test it:
   - `DATABASE_URL`
   - `APP_SESSION_SECRET` / `SESSION_SECRET`
   - `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `ADMIN_EMAIL`
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `TURNSTILE_SECRET_KEY`, `VITE_TURNSTILE_SITE_KEY`
   - `PUBLIC_SITE_URL`
   - Optional: bunq, ImprovMX, kChat, Mastodon. These only matter for those specific features.
2. **Database:** run `db/45` on Neon, then confirm that `oauth_clients.flow_preference`, `rich_identity_enabled`, `oauth_step_up_codes` and `approved_handles` exist. These checks only read the database; no other data changes.
3. **Test login:** a test account is needed. Option A is that you share one through the secure form. Option B is that I create a temporary account on Neon and remove it afterwards.
4. **Browser checks**, with screenshots:
   - Create an app, change its branding, add and remove a redirect, switch the flow and Rich Identity, rotate the secret, delete the app.
   - Go through the consent screen in both Seamless and Strict.
   - Studio locked and unlocked.
   - Admin: submit a request, approve two names, claim one as the member, reject another request, verify a person.
5. **Fix whatever the checks turn up, and finish the wording:**
   - Remove the remaining "Gratis" from the Studio labels.
   - Match the form fields and texts exactly to the brief.
6. **Report:** a short list of what works and what doesn't, with the screenshots, and the docs brought up to date.

## Infrastructure
- The app keeps running entirely on your own stack: Neon, Better Auth, Brevo, Stripe and Vercel.
- No Lovable Cloud, no Lovable AI and no Lovable email are added.
- Lovable is only used as the editor; the production version is published through GitHub to Vercel.
