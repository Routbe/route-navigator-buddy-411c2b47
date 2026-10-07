# Header: één inlogknop

## Doel
De twee knoppen "Sign in" en "Sign up" in de header leiden allebei naar dezelfde passwordless inlogpagina (`AuthNeon`). Ze worden samengevoegd tot één strakke knop.

## Bevindingen
- `src/components/ProfileMenu.tsx` (regels 91–100) toont bij uitgelogde bezoekers twee knoppen: "Sign in" → `/auth/sign-in` en "Sign up" → `/auth/sign-up`.
- Beide routes renderen dezelfde centrale auth-flow (`AuthNeon`, passwordless/social) — de dubbele knop is dus overbodig.
- Het mobiele menu (`MobileMenu.tsx`) bevat geen eigen inlogknoppen; alleen `ProfileMenu.tsx` hoeft aangepast te worden.
- Op de auth-pagina zelf worden de knoppen al verborgen (regel 90) — dat blijft zo.

## Wijziging
- In `ProfileMenu.tsx` de twee knoppen vervangen door één knop "Sign in" die naar `/auth/sign-in` linkt (de centrale passwordless flow).
- Styling: één primaire knop (`size="sm"`), zichtbaar op alle schermbreedtes, in lijn met de bestaande obsidian-stijl. Geen ghost-variant meer nodig.
- Verder niets aanraken: de auth-flow zelf, het accountmenu voor ingelogde gebruikers en de rest van de header blijven ongewijzigd.

## Verificatie
- Typecheck draaien en met de browser controleren dat de header één knop toont die naar de inlogpagina leidt, op desktop en mobiel.
