# Recipe Book

Recipe Book – receptų katalogas.

## Projekto aprašymas

Tai internetinė aplikacija, kurioje vartotojai gali užsiregistruoti, prisijungti ir saugoti savo mėgstamus receptus vienoje vietoje.

## Naudojamos technologijos

- React
- JavaScript
- Vite
- CSS
- Supabase (Authentication ir PostgreSQL duomenų bazė)
- GitHub

## Receptų saugojimas

- Prisijungusių vartotojų receptai saugomi Supabase `public.recipes` lentelėje.
- Kiekvienas prisijungęs vartotojas mato ir gali valdyti tik savo Supabase receptus (`user_id` + RLS).
- Neprisijungus sukurti receptai saugomi naršyklės `localStorage`, o ne Supabase.
- `localStorage` receptai nėra susieti su vartotojo paskyra ir nesinchronizuojami tarp įrenginių.
- Pagrindiniame puslapyje rodomi 3 pavyzdiniai receptai.
- Skiltyje „Mano receptai“ rodomi vartotojo asmeniniai receptai (Supabase; jei yra – atskirai ir šios naršyklės `localStorage` receptai).

## MVP funkcionalumai

Jau veikiančios funkcijos:

- Navigacija tarp „Pagrindinis“ ir „Mano receptai“ (desktop + mobilus), su aktyvaus punkto žymėjimu.
- Pagrindinis puslapis – hero ir skiltis „Populiarūs receptai“ su 3 pavyzdiniais receptais.
- „Mano receptai“ – asmeninių receptų puslapis su paieška, pridėjimu ir tuščios būsenos pranešimu.
- Receptų peržiūra – modalinis langas su ingredientais ir gaminimo instrukcija.
- Receptų paieška pagal pavadinimą – skiltyje „Mano receptai“ (lietuviškos raidės, galūnės, y/i).
- Receptų pridėjimas – forma modaliniame lange; neprisijungus saugoma `localStorage`, prisijungus – tik Supabase (`public.recipes`).
- Automatinis recepto nuotraukos priskyrimas pagal pavadinimo raktažodžius (salotos, blynai, makaronai, lašiša, vištiena, desertas ir kt.; nuotraukos `public/recipes/`).
- Vartotojo pridėtų receptų redagavimas – peržiūros lange mygtukas „Redaguoti“; `localStorage` receptams – lokaliai, savo Supabase receptams – `UPDATE` (pagal `user_id`).
- Vartotojo pridėtų receptų ištrynimas – su patvirtinimo langu; `localStorage` arba savo Supabase receptų `DELETE` (pagal `user_id` + RLS).
- Vartotojo registracija per Supabase Auth (el. paštas ir slaptažodis).
- Vartotojo prisijungimas ir atsijungimas per Supabase Auth (sesija išlieka perkrovus puslapį).
- Prisijungusio vartotojo receptų CRUD per Supabase – rodomi skiltyje „Mano receptai“.

Planuojamos funkcijos:

- Pilnas perėjimas nuo `localStorage` prie Supabase saugojimo.

## Kaip paleisti projektą

1. Įdiekite priklausomybes:

```bash
npm install
```

2. Paleiskite vystymo serverį:

```bash
npm run dev
```

3. Sukurkite `.env` failą projekto šaknyje ir įrašykite:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`  
   (`.env` failas neturi būti keliamas į Git.)

4. Atidarykite naršyklėje adresą, kurį parodytų Vite (dažniausiai `http://localhost:5173`).

## Dabartinė projekto būsena

- Sukurtas React + Vite projektas su „Recipe Book“ dizainu.
- Supabase prijungta: Auth ir PostgreSQL (`public.recipes` + RLS).
- Veikia registracija, prisijungimas ir atsijungimas.
- Pagrindiniame puslapyje – 3 pavyzdiniai receptai; skiltyje „Mano receptai“ – asmeniniai receptai.
- Prisijungus receptų CREATE, READ, UPDATE ir DELETE veikia per Supabase.
- Neprisijungus receptai saugomi `localStorage` (nesiejami su paskyra).
- Automatinis nuotraukos parinkimas pagal recepto pavadinimą.
- Redaguoti / Ištrinti rodomi tik savo receptams (Supabase – pagal `user.id` ir `recipes.user_id`).
