# Volledige controle van vandaag + nieuwe beveiligingsopdrachten

## Fase 1 — Controle van alles wat vandaag gebouwd is
- Alles opnieuw nalezen en in de browser testen, met schermafbeeldingen:
  - de header met één knop
  - /press
  - de Bluesky/Mastodon-e-mailstap
  - het Infomaniak-logo
  - de iconen in de Studio en de contactkaart
  - de talen op profielen
  - de bio-filter
  - de geboortedatum-pop-up
  - de Developer Console en het toestemmingsscherm
  - de vergrendelde tab in de Studio
  - de admin-inbox
- Alle tests en de typecontrole draaien, en elke fout die opduikt meteen herstellen.

## Fase 2 — Inhoud van de pagina's
- De pagina's About, Sovereignty, Manifesto, Privacy policy, Terms, Contact en de GitHub README naast de huidige functies leggen. Daarbij komen aan bod: Passkeys/2FA, de e-mailcode voor Fediverse, geboortedatums, perskit, Console, aliasprofiel op /u/ tegenover het geverifieerde profiel, en betaalmethodes.
- Nalopen in alle vier de talen:
  - verouderde beloftes
  - ontbrekende gegevensverwerking in de privacyverklaring (geboortedatum, e-mailcodes, Telegram/SMS)
  - "gratis"-teksten
  - dode links
  - de datum van de laatste wijziging
- De volgorde van de footer en de groepering (Legal / Infrastructuur / Support) logisch maken. Pagina's opsplitsen waar dat nodig is, bijvoorbeeld een aparte pagina met het herstelbeleid.
- Het contactformulier: invoercontrole, bescherming tegen spam (Turnstile), aflevering via Brevo en de bevestigingstekst.

## Fase 3 — Neon-database
- Met een databasesleutel (veilig formulier, bij voorkeur een testbranch):
  - het schema alleen uitlezen
  - controleren dat db/45, 46 en 48 bestaan, en ze uitvoeren als ze ontbreken
  - tabellen en kolommen zoeken die dubbel zijn, wees zijn of een slechte naam hebben
  - indexen controleren op handles (geen dubbele /u/ en root)
- Hernoemen of opschonen gebeurt alleen na een voorstel dat jij goedkeurt; er wordt nooit iets stil gewist.

## Fase 4 — Nieuwe opdrachten
1. **Beveiligingspatch:**
   - Beheerdersrol bij het opstarten: het oudste account krijgt de rol alleen nog met een eenmalige `ADMIN_BOOTSTRAP_TOKEN`. Anders krijgt alleen het eigenaarsadres de rol.
   - Koppelen van sociale accounts: alleen met een geverifieerd e-mailadres of een e-mailcode. Alle koppelpaden worden nagelopen.
   - Accounts samenvoegen: maximaal 3 pogingen met de pincode, daarna een slot. Beide accounts moeten ingelogd zijn, plus een bevestigingslink per e-mail.
   - Bedragen voor cadeaubonnen en verificaties worden alleen op de server bepaald.
   - Strikte invoerschema's voor alle profiel- en accountschrijfacties.
   - Logs worden gescreend op tokens van bunq, Stripe en sessies.
2. **Meerdere inlogkanalen en herstel:**
   - Passkeys (WebAuthn) voor registreren en inloggen.
   - Authenticator-apps (TOTP) met een QR-code.
   - Herstelcodes om te kopiëren, als .txt of als afbeelding.
   - Een voorkeurskanaal kiezen: Telegram-bot, WhatsApp, of SMS alleen voor +32 via de eigen gateway.
   - Rate-limiting op alle pogingen; geen beveiligingsvragen en geen e-mailcode als 2FA.
   - Herstelbeleid op een helppagina en in de docs.
3. **Controle van de routes:**
   - Een alias staat alleen op /u/handle en een geverifieerd profiel alleen op /handle, nooit beide.
   - Een oude URL wordt doorgestuurd naar de juiste.
   - Verificatie en betaling staan alleen in de vergrendelde tab, en de tabs blijven altijd klikbaar.

## Benodigde sleutels (veilig formulier, nooit in de chat)
- DATABASE_URL en BREVO_API_KEY
- Stripe-sleutels
- Turnstile
- PUBLIC_SITE_URL
- ADMIN_BOOTSTRAP_TOKEN (wordt automatisch aangemaakt)
- TELEGRAM_BOT_TOKEN
- SMS_GATEWAY_URL/-sleutel
- WhatsApp-gatewaygegevens

**Belangrijk:** de Telegram-token stond leesbaar in je bericht. Vraag via @BotFather een nieuwe token aan en vul die daarna in het veilige formulier in. De token wordt nooit in de code gezet.

## Infrastructuur
Alles blijft op Neon, Better Auth, Brevo, Stripe en Vercel. Er wordt geen Lovable Cloud gebruikt. De basisinstellingen van Better Auth en OIDC blijven onaangeroerd; Passkeys en TOTP komen via de officiële plugins van Better Auth, met eigen tabellen in db/49+.

## Rapport
Na elke fase komt er een kort overzicht van wat werkt, wat hersteld is en wat nog wacht op een sleutel.
