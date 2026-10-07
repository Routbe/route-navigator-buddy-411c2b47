# Scaleway Object Storage (two buckets) + finish the console work

## Current state (checked)
- Profile photos and gallery images are stored as text blobs in the Neon database (`avatar_objects`, `gallery_objects`) and streamed through `/api/public/avatar` and `/api/public/gallery-media`.
- The QR file-sharing upload in the browser posts to `/api/public/qr/upload`, but that address does not exist, so file sharing via QR doesn't work today.
- There is no S3 library in the project yet.
- The console backend (test/production mode, PKCE, token lifetime, IP allowlist, `prompt=none`, verification requests) was already partly built in the previous turn. The new console pages still need to be finished.

## Step 1: Scaleway keys (your action)
- Once you approve, I'll open the secure form for `SCALEWAY_ACCESS_KEY` and `SCALEWAY_SECRET_KEY` (Scaleway console → IAM → API keys → "Generate API key", purpose Object Storage).
- I'll set the fixed values myself: `SCALEWAY_REGION=fr-par`, `SCALEWAY_ENDPOINT=https://s3.fr-par.scw.cloud`, plus the two bucket names. I need those names from you, or I'll use `rout-internal` and `rout-client` (you create them in Scaleway → Object Storage, region Paris).

## Step 2: Storage layer
- One server-only storage module with two buckets:
  - **Internal bucket**: press kit, official logos, platform files. Writable only by admins.
  - **Client bucket**: profile photos, app logos, temporary QR files, stored under `users/<userId>/…`.
- Uploads are checked on the server: max 5 MB, only JPG/PNG/WebP/GIF (and PDF/MP3 for QR sharing). The actual file content is checked, not just the extension.
- Images larger than 1024 px are scaled down in the browser before upload (the existing compression helper). The server checks the size again.
- If the Scaleway keys are missing, uploads fall back to the current Neon storage, so nothing breaks.

## Step 3: Profile photo
- Replace the Neon-blob path in the photo upload with the client bucket. The public URL goes into the existing `avatar_url`.
- Old photos keep working through `/api/public/avatar` (no data loss, no migration of existing images needed).

## Step 4: Temporary QR files
- New table `shared_files` (idempotent `db/51_shared_files.sql`): id, user_id, bucket key, content type, size, `expires_at`, created_at.
- Create the missing upload address `/api/public/qr/upload` (logged-in users only), with a choice of 1 / 7 / 30 days. The object in Scaleway also gets an `expires-at` label.
- Download link `/f/<id>`: serves the file while it is valid, or a clear "expired" page afterwards.
- A daily cleanup job (existing cron setup with `LOVABLE_CRON_SECRET`) removes expired files from Scaleway and from the table.

## Step 5: Press kit + icon
- Check why the press logos don't load and fix it. Make the favicon a transparent PNG/SVG of the official bunny, without rings.
- Optional: put the press files in the internal bucket. The `/press` page then links to them, with the local files kept as a fallback.

## Step 6: Finish the console (from the earlier briefs)
- One persistent left sidebar: Dashboard, Auth & Identity, API & Webhooks, AI Connectors (MCP), Billing. Inside an app, it switches to the app menu with "← Back to all apps". The horizontal top bar goes away.
- App pages: Dashboard (checkup + counters), Credentials (all endpoints), Branding (+ contact details + consent preview), Redirects, Scopes, Publishing & Verification (Testing/Production, test users, badge request), Security (PKCE, token lifetime, IPs, delete), Advanced (Seamless/Strict, `prompt=none`, Rich Identity, with code examples).
- Quick Start card with copy button (`npx routbe@latest init` / `mcp-server`) on the dashboard and API page. These commands don't exist yet; I'll label them "coming soon" unless you publish that package.
- "Sovereign Identity Manifesto" card (collapsible) at the top of Auth & Identity, with the heading "Your Auth Applications".
- Consumer menu: "Developer Console", subtitle "Manage apps, API keys & infrastructure".
- An admin page to approve or reject "ROUT Verified App" requests.

## Step 7: Verification
- Upload test against the real bucket (photo + QR file + expiry), a browser test of the console pages and the press kit, and a build without errors.

## Technical details
- S3 client: `aws4fetch` (lightweight, works on the Worker/Vercel runtime) instead of `@aws-sdk/client-s3`, which is heavy and Node-oriented. Requests are signed with SigV4 against `s3.fr-par.scw.cloud`.
- Files go in `src/lib/storage/s3.server.ts` (client + `putObject`/`deleteObject`/`publicUrl`) and `src/lib/storage/upload.functions.ts` (Zod-validated server functions with `requireAuth`; admin check for the internal bucket).
- Public reading: the client bucket gets a read policy on `users/*/avatar/*` only; QR files stay private and go through `/f/<id>` (with a short presigned redirect).
- Every new variable name goes into `ENVIRONMENT.md` + `.env.example`. The architecture rule "storage = Scaleway, database = Neon" goes into `AGENTS.md`.
