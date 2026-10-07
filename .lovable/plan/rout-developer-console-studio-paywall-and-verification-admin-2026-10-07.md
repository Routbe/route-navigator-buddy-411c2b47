# ROUT: Developer Console, Studio paywall, and Verification Admin

Three separate tracks. Rules for all three: the Better Auth setup and platform login stay untouched, the obsidian/dark "White Rabbit" style is used throughout, and there are no new migrations for the OIDC settings.

## Track 1: Developer Console (`/console/apps`)

```text
/console/apps                    Grid of app cards (logo, name, client ID, flow badge) + "Nieuwe app"
/console/apps/$clientId          -> redirects to credentials
  credentials                    Client ID (copy), rotate secret (shown once)
  branding                       Name, logo URL with live preview, website, privacy, terms
  redirects                      Callback URLs: add, remove, validate
  scopes                         openid / profile / email explained, plus PKCE snippet
  security                       Seamless | Strict choice, Rich Identity toggle
```
- Each app gets a sidebar in Google Cloud style, plus a top bar with the app's logo and name and a link back to the overview.
- Apps can be deleted from the overview after confirmation. Access stays limited to verified accounts, using the existing check.
- The Security page reads and saves `flow_preference` and `rich_identity_enabled` through the existing `saveOAuthClient` and `listOAuthClients` functions.
- In the Developer Hub, the "Login met ROUT" tab becomes one card with an "Open Console ->" button. The API and MCP tabs stay as they are.

## Track 2: Profile Hub Studio
- Tab "Gratis aliasprofiel" is renamed to "Privacy Alias (rout.be/u/handle)" and becomes the default tab. The word "Gratis" is removed from the Studio in all four languages.
- Tab "Geverifieerd profiel (rout.be/handle)" is locked when the user is not verified or has not paid. Instead of the editor, it shows a centered premium card containing the existing "Identiteitsverificatie en betaling" flow, which moves here from the alias tab.
- The tabs stay clickable while this tab is locked.
- All "Word Early Believer" text is removed from the Studio.

## Track 3: Verification and Admin CRM
- **Storage:** the influencer and business requests already in `db/41` and `verification-requests.server.ts` are reused. If storing the approved-names list needs it, one new idempotent file `db/45_approved_handles.sql` adds `approved_handles` (request, handle, status). Status values are pending, approved and rejected.
- **User forms:**
  - Influencer: four name choices, social links, a short explanation, and the text "€ 70 — gratis wanneer je al geverifieerd bent."
  - Business: official company name, legal form, VAT number, registered office, domain and contact person, plus the black-badge text.
- **Admin `/admin/verifications`** (admins only, using the existing check):
  - An inbox of pending requests.
  - A detail view with all form data already filled in.
  - Approve or reject toggles for each proposed name.
  - A separate "Nieuwe Persoon Verifiëren" panel: enter first and last name, and the handle and badge are created.
- **Emails** (Brevo, already in the project, logged only when the key is missing):
  - Request received: one email to the user, and one to the admin with a direct link to the ticket.
  - Decision made: the user gets an email with the outcome.
- **Claim:** in their settings, the user sees a dropdown with only the approved names. Choosing one completes verification.

## Quality checks
- Unit tests for when the Strict step is triggered (app set to strict, `prompt=login`, `max_age`, `acr_values=urn:rout:acr:strict`) and for Rich Identity (shared only when the app has it on and the user opts in).
- Tests that the Studio tab is locked or unlocked depending on verification and payment.
- Tests that an influencer can only claim names from the approved list.
- Browser checks of the console, Studio and admin pages. These need a working database connection, so they depend on the keys from the previous step.
- `docs/identity-broker-architecture.md` is updated with the final console layout and the OIDC parameters.

## Technical notes
- Console pages go in `src/routes/_authenticated/console.apps.$clientId.*.tsx` and use the existing `ConsolePage` and `console-data`.
- The Studio changes are in `src/pages/Studio.tsx` and the locale files. The locked state is a new `LockedVerifiedTab` component.
- The admin screens reuse `AdminVerificationQueue` and `verification-requests.functions.ts`.

## Open item
- `DATABASE_URL` and the other keys are not set in this project yet. Without them, the screens build but cannot load real data.
