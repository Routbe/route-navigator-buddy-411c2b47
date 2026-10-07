# Login herstellen + lijst met omgevingsvariabelen + Mastodon/Bluesky gemakkelijker

## Wat er nu gebeurt (vastgesteld in de code)
- Het inlogscherm vraagt bij het openen aan de server welke providers ingesteld zijn. **Mislukt die vraag om welke reden ook, dan wordt de lijst leeg gezet** en zegt elke knop (Google, GitHub, GitLab, Apple, Infomaniak, OIDC) "Deze inlogoptie is nog niet actief" — ook als je sleutels wel kloppen. Bluesky en Mastodon werken omdat ze die controle niet gebruiken.
- De server herkent alleen exact deze namen: `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `GITHUB_…`, `GITLAB_…`, `APPLE_…`, `INFOMANIAK_…`, `OIDC_…` + `OIDC_DISCOVERY_URL`. Andere gangbare namen (bv. `AUTH_GOOGLE_ID`, `GOOGLE_ID`) worden genegeerd.
- Daarnaast vereist elke login `DATABASE_URL` en `BETTER_AUTH_SECRET` (min. 32 tekens); zonder die faalt Google zelfs als de knop wel actief is.
- De build gebruikt standaard het Cloudflare-doel, niet Vercel. Op Vercel kan dat ervoor zorgen dat de server-aanvraag faalt of variabelen anders gelezen worden.

## Wat ik ga doen

### 1. Knoppen nooit meer onterecht "niet actief"
- Als de providercontrole faalt: knop gewoon proberen (de server geeft dan zelf een duidelijke fout), in plaats van alles te blokkeren.
- De controle verplaatsen naar een eenvoudig, openbaar adres `/api/public/auth/providers` (alleen namen, nooit waarden) — betrouwbaarder op Vercel dan de huidige interne aanroep.
- Bij een echte fout van Google/GitHub een leesbare melding tonen (bv. "BETTER_AUTH_SECRET ontbreekt op de server", "redirect-URL komt niet overeen").

### 2. Diagnosepagina voor de beheerder
- In het beheerpaneel (bestaand "Env health"-blok) per provider tonen: ingesteld ja/nee, welke naam ontbreekt, en de exacte callback-URL die je in Google/GitHub/… moet invullen (`https://rout.be/api/auth/callback/google`, enz.). Geen geheime waarden.

### 3. Vercel correct ondersteunen
- Builddoel instelbaar maken zodat Vercel een echte Vercel-build krijgt (`NITRO_PRESET=vercel`), Lovable-preview blijft ongewijzigd.
- Alternatieve namen accepteren als terugval (`AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, enz.), met de officiële naam als voorkeur.

### 4. Lijst met alle variabelen in GitHub
- Nieuw bestand **`ENVIRONMENT.md`** in de hoofdmap (+ link bovenaan README): tabel per onderdeel (Database, Login, Login-providers, E-mail, Betalingen, Bots/Turnstile, Cron, Telegram/SMS/WhatsApp, Login met ROUT-provider `ROUT_PROVIDER_*`) met: Key-naam, verplicht/optioneel, waar je hem haalt, en callback-URL. Plus `.env.example` met alle namen zonder waarden.
- Korte checklist: "na wijzigen in Vercel altijd opnieuw deployen; variabelen ook aanzetten voor Production".

### 5. Mastodon: servers voorstellen tijdens typen
- Lijst met populaire servers direct zichtbaar (mastodon.social, mastodon.online, mstdn.social, mas.to, fosstodon.org, toot.community, mastodon.nl, mastodon.world, …).
- Tijdens typen filteren + suggesties van de openbare serverlijst (joinmastodon) via een kleine server-aanvraag met cache; toetsenbord- en klikbaar. Ook `@naam@server` plakken werkt.

### 6. Bluesky: domein met één klik
- Naast het invoerveld klikbare chips: `.bsky.social` (standaard), plus eigen domein. Typt iemand alleen "jona", dan wordt automatisch `jona.bsky.social` voorgesteld. `@` vooraan wordt weggehaald.

### 7. Nalopen van andere loginfouten
- Callback-URL consistent met `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL`; magic link en wachtwoord testen; foutmeldingen uit de URL tonen.
- Tests toevoegen: providerlijst met alias-namen, faalgedrag van de knoppen, Bluesky-handle-aanvulling, Mastodon-serverfilter.

## Wat jij daarna moet doen
- In Vercel de variabelen controleren tegen `ENVIRONMENT.md` (vooral `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://rout.be`, `DATABASE_URL`) en `NITRO_PRESET=vercel` toevoegen, dan opnieuw deployen.
- In Google/GitHub de callback-URL uit de diagnosepagina invullen.

## Technische details
- `src/pages/AuthNeon.tsx`: `.catch(() => setEnabled([]))` → `setEnabled(null)`; `isInactive` alleen bij bekende lijst.
- Nieuwe route `src/routes/api_.public.auth.providers.ts`; `enabledProviders()` + `pair()` met aliasnamen in `better-auth.server.ts`; `missingAuthEnv()` voor diagnose, uitgebreid in `env.ts`/`EnvHealthPanel`.
- `vite.config.ts`: nitro preset uit `process.env.NITRO_PRESET` indien gezet.
- Nieuw `src/lib/mastodon-servers.ts` (statische lijst + filter), route `api_.public.mastodon.servers.ts` (joinmastodon API, gecachet, timeout); Bluesky-normalisatie in `src/lib/bluesky-handle.ts`.
- `ENVIRONMENT.md`, `.env.example`, README-link; AGENTS.md regel: env-namen worden alleen in `ENVIRONMENT.md` gedocumenteerd.
