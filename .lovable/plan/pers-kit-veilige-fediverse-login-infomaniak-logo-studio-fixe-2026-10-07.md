# Pers-kit, veilige Fediverse-login, Infomaniak-logo, Studio-fixes, meertaligheid, geboortedatum

Alles blijft op de eigen stack (Neon, Better Auth, Brevo). De kern van de OIDC-provider en de gewone inlogflow worden niet aangeraakt.

## 1. Pers- en merkpagina (/press)
- Nieuwe pagina in de bestaande obsidian-stijl, link in de footer (blok Infrastructuur/Over).
- **Logo's**: konijn-icoon (paarse + groene ring, uit de upload) en lockup "icoon + ROUT". Varianten: transparant, wit op zwart, zwart op wit. Download als SVG en PNG (512 / 1024 / 2048). De bestanden komen in `public/press/`, zodat de links vast blijven.
- **Kleurenpalet**: stalen met HEX-code en kopieerknop. De codes worden uitgelezen uit de bestaande kleurinstellingen, niet verzonnen.
- **Over ROUT**: korte en lange standaardtekst met kopieerknop (NL/EN/FR).
- **Perscontact**: formulier (naam, e-mail, organisatie, onderwerp, bericht, Turnstile) dat de bestaande contactopslag hergebruikt met de categorie "press". De beheerder krijgt een melding via Brevo. Daarnaast staat een vast perscontactadres.

## 2. Bluesky- en Mastodon-login met e-mailcode
- De handshake blijft zoals hij is.
- **Bestaande koppeling** (identiteit al gelinkt): meteen inloggen, zoals nu.
- **Geen koppeling en geen geverifieerd e-mailadres van de provider**: de gebruiker gaat naar `/auth/fediverse` met de vraag "Vul je e-mailadres in om je ROUT-account te voltooien."
- De server maakt een 6-cijferige code: eenmalig te gebruiken, gehasht opgeslagen, 10 minuten geldig, maximaal 3 pogingen en daarna een blokkade. Brevo verstuurt de code.
- Pas na een correcte code wordt het account aangemaakt of de identiteit gekoppeld. Een bestaand account met dat adres wordt alleen gekoppeld als de code klopt. Zo wordt het kapen van accounts geblokkeerd.
- Mastodon maakt nu een nep-e-mailadres aan en zet het als bevestigd. Dat wordt vervangen door dezelfde e-mailstap.
- Nieuwe tabel `db/46_fediverse_email_otp.sql` (idempotent).

## 3. Infomaniak-logo
- Het wolkje wordt vervangen door een strakke SVG: witte "K" op blauw (#0098FF) met afgeronde hoeken. Dit geldt voor de inlogknoppen, de connector-lijst en de e-mailpagina's die het icoon tonen.

## 4. Studio: iconen en "Contact opslaan"
- **Icoonkeuze**: `mailto:` krijgt altijd een envelop en `tel:` altijd een telefoon. Een sociaal logo verschijnt alleen als het domein van de link exact overeenkomt.
- **Eigen links**: standaard het favicon van de site, via een eigen proxy met cache (geen tracking van de bezoeker). Valt dat weg, dan verschijnt een wereldbol. In de editor kan de gebruiker per link kiezen tussen "Favicon" en "Wereldbol".
- **vCard**: bevat de naam (voornaam en achternaam, anders de handle), e-mail, telefoon, profiel-URL en websites. De profielfoto wordt als base64 in de kaart gezet (verkleind tot ongeveer 256 px via de eigen avatar-route), zodat ze op de telefoon verschijnt. Lukt dat niet, dan wordt een gewone link gebruikt.

## 5. Meertalige publieke profielen
- De vaste teksten van het profiel ("Officieel geverifieerd lid", "Lid sinds", "Contact opslaan" en zo verder) komen in een woordenlijst in EN, NL en FR. De taal van de bezoeker wordt na het laden bepaald via `navigator.language`, met Engels als standaard.
- In de Studio krijgt de bio drie tabbladen: EN, NL en FR. De bio's worden opgeslagen in een nieuwe kolom `bio_i18n` (`db/47_profile_bio_i18n.sql`). De huidige bio blijft de Engelse bio en dient als terugval.
- **Validatie**: de server weigert URL's (http, https, www., domein.tld) in de bio en toont een melding die verwijst naar "Links & Componenten". De editor controleert dit ook al tijdens het typen.

## 6. Geboortedatum
- Nieuwe velden `birthdate` en `birthdate_source` (`db/48_birthdate.sql`). De wijziging gebeurt alleen via een eigen server-functie, met een strikte controle: een geldige datum en een minimumleeftijd van 13 jaar.
- **Google**: optioneel de scope `user.birthday.read` via de People-API bij het aanmelden. Dit vraagt een aanpassing in de configuratie van de Google-login. Bevestig dat dit mag, omdat Google voor deze scope een extra controle eist.
- **Op het moment zelf**: bij het indienen van een influencer- of bedrijfsaanvraag, of bij het starten van een betaling, controleert de server of er een geboortedatum is. Ontbreekt die, dan verschijnt een verplichte pop-up: "Vul je geboortedatum in om deze aanvraag te voltooien". Daarna gaat de actie automatisch verder.

## Technische details
- Nieuwe routes: `/press`, `/auth/fediverse`, `/api/public/favicon`.
- De OTP-logica staat in `fediverse-otp.server.ts`. De bestaande callbacks van Bluesky (`bluesky-login.functions.ts`, `api_.public.bluesky.callback.ts`) en Mastodon (`mastodon-auth.server.ts`) worden daarop aangepast.
- Alle invoer wordt gecontroleerd met Zod-schema's, met alleen een vaste lijst velden.
- Testen worden aangevuld voor de icoonkeuze, de vCard-opbouw, de URL-filter op de bio en de OTP-pogingenlimiet.
- Browsercontroles gebeuren met screenshots zodra er een databaseverbinding is (`DATABASE_URL`, nog niet ingesteld).
