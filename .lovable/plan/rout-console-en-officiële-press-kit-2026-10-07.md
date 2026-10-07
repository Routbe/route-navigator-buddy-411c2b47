# ROUT Console en officiële press kit

## Doel
De ontwikkelaarsomgeving wordt een zelfstandige, brede obsidian workspace onder `/console`. De consumenteninterface verwijst er alleen nog via één duidelijke “Developer Console”-ingang naartoe. De press kit gebruikt uitsluitend afgeleiden van het bestaande officiële vrijstaande konijn.

## Uitvoering

### 1. Zelfstandige Console
- Maak `/console` de centrale, ingelogde console-layout met eigen header, volledige schermbreedte en zonder consumentenfooter.
- Verplaats de huidige console-header uit `/console/apps` naar deze gedeelde layout, zodat alle consolepagina’s dezelfde contextwissel tonen.
- Voeg op `/console` een welkomstdashboard toe met vier grote Quick Access-kaarten:
  - Identity & OAuth → `/console/apps`
  - API Keys & Webhooks → `/console/api`
  - AI & MCP Connectors → `/console/connectors`
  - Billing & Usage → `/console/billing`
- Splits de bestaande API/MCP-inhoud over de nieuwe API- en MCP-pagina’s. Billing krijgt de gevraagde nette placeholder.
- Houd bestaande `/console/apps`- en appdetailpagina’s werkend binnen dezelfde workspace en geef brede consolepagina’s meer bruikbare ruimte.

### 2. Consumentennavigatie opschonen
- Verwijder “API & MCP Endpoints” uit consumentenmenu’s en accountinstellingen.
- Voeg voor ingelogde gebruikers één “Developer Console”-link toe die `/console` in een nieuw tabblad opent en zo de contextwissel duidelijk maakt.
- Laat het oude `/api`-adres veilig doorsturen naar `/console`, zodat bestaande bookmarks niet doodlopen.

### 3. Officiële logo-assets herstellen
- Gebruik het bestaande officiële vrijstaande konijn uit `public/logo.svg` als enige bron voor nieuwe afgeleiden; het konijn wordt niet hertekend.
- Herstel favicon en app-iconen naar het vrijstaande konijn zonder ringen.
- Vervang de huidige persdownloads door exact drie categorieën, elk in SVG en PNG:
  - Volledig logo: officieel konijn + ROUT, zwart en wit.
  - Icoon: officieel vrijstaand konijn, zwart en wit.
  - Social Media Avatar: hetzelfde officiële konijn met uitsluitend de dunne paarse en groene ring uit de aangeleverde referentie.
- Verwijder de foutieve ring-lockups en andere niet-officiële varianten uit de downloadlijst en publieke persbestanden.

### 4. Press kit vernieuwen
- Bouw `/press` om tot een minimalistische obsidian perspagina met een strakke downloadmatrix, duidelijke lichte/donkere previews en directe SVG/PNG-downloads.
- Behoud het kleurenpalet, de standaardtekst en het contactformulier.
- Werk de social-previewmetadata bij zodat die naar een werkelijk getoonde, correcte persafbeelding verwijst.

### 5. Controle
- Controleer alle nieuwe routes, downloads, faviconweergave, mobiele en desktopindeling en de console-contextwissel in de browser.
- Draai de relevante tests en controleer dat de preview zonder fouten bouwt.

## Technische details
- De console blijft onder de bestaande ingelogde routegroep en gebruikt de bestaande Neon/Better Auth-beveiliging.
- Nieuwe pagina’s krijgen eigen route-metadata; privéconsolepagina’s blijven `noindex`.
- De logo-SVG’s worden samengesteld uit de bestaande officiële vectorpaden en krijgen PNG-exporten; er wordt geen AI-logo gegenereerd.
