# Recipe Book

Recipe Book – receptų katalogas.

## Projekto aprašymas

Tai internetinė aplikacija, kurioje vartotojai galės užsiregistruoti, prisijungti ir saugoti savo mėgstamus receptus vienoje vietoje.

## Naudojamos technologijos

- React
- JavaScript
- Vite
- CSS
- Supabase (Auth + prisijungusio vartotojo receptų CRUD)
- GitHub

## MVP funkcionalumai

Jau veikiančios funkcijos:

- Navigacija tarp „Pagrindinis“ ir „Mano receptai“ (desktop + mobilus), su aktyvaus punkto žymėjimu.
- Pagrindinis puslapis – hero ir skiltis „Populiarūs receptai“ su 3 pavyzdiniais receptais.
- „Mano receptai“ – asmeninių Supabase receptų puslapis su paieška, pridėjimu ir tuščios būsenos pranešimu.
- Receptų peržiūra – modalinis langas su ingredientais ir gaminimo instrukcija.
- Receptų paieška pagal pavadinimą – skiltyje „Mano receptai“ (lietuviškos raidės, galūnės, y/i).
- Receptų pridėjimas – forma modaliniame lange; neprisijungus saugoma `localStorage`, prisijungus – tik Supabase (`public.recipes`).
- Automatinis recepto nuotraukos priskyrimas pagal pavadinimo raktažodžius (salotos, blynai, makaronai, lašiša, vištiena, desertas ir kt.; nuotraukos `public/recipes/`).
- Vartotojo pridėtų receptų redagavimas – peržiūros lange mygtukas „Redaguoti“; `localStorage` receptams – lokaliai, savo Supabase receptams – `UPDATE` (pagal `user_id`).
- Vartotojo pridėtų receptų ištrynimas – su patvirtinimo langu; `localStorage` arba savo Supabase receptų `DELETE` (pagal `user_id` + RLS).
- Vartotojo registracija per Supabase Auth (el. paštas ir slaptažodis).
- Vartotojo prisijungimas ir atsijungimas per Supabase Auth (sesija išlieka perkrovus puslapį).
- Prisijungusio vartotojo receptų CRUD per Supabase – rodomi tik skiltyje „Mano receptai“.
- `localStorage` receptai rodomi atskirai („Šios naršyklės receptai“), nesiejant jų su Supabase paskyra.

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

- Sukurtas React + Vite projektas.
- Sukurtas pradinis „Recipe Book“ svetainės dizainas.
- Įgyvendinta visų trijų pavyzdinių receptų peržiūra bendrame modaliniame lange.
- Įgyvendinta veikianti receptų paieška pagal pavadinimą (su lietuviškų raidžių, galūnių ir y/i variantų normalizavimu).
- Įgyvendintas naujo recepto pridėjimas: neprisijungus – `localStorage`, prisijungus – Supabase CREATE.
- Naujiems ir anksčiau su `default.jpg` išsaugotiems receptams nuotrauka parenkama pagal pavadinimą (atvaizdavime ir kuriant / redaguojant).
- Įgyvendintas vartotojo pridėtų receptų redagavimas: `localStorage` ir savo Supabase receptai (`UPDATE`).
- Įgyvendintas vartotojo pridėtų receptų ištrynimas: `localStorage` ir savo Supabase receptai (`DELETE`).
- Supabase klientas (`@supabase/supabase-js`) paruoštas per `src/lib/supabase.js`.
- Įgyvendinta vartotojo registracija per Supabase Auth.
- Įgyvendintas prisijungimas ir atsijungimas per Supabase Auth.
- Įgyvendintas prisijungusio vartotojo receptų skaitymas (READ) iš Supabase.
- Įgyvendintas prisijungusio vartotojo receptų kūrimas (CREATE) Supabase.
- Supabase receptai rodomi skiltyje „Mano receptai“; pagrindiniame – tik pavyzdiniai.
- Redaguoti / Ištrinti rodomi tik savo receptams (Supabase – pagal `user.id` ir `recipes.user_id`).
