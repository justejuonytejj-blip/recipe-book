# Recipe Book

Recipe Book – receptų katalogas.

## Projekto aprašymas

Tai internetinė aplikacija, kurioje vartotojai galės užsiregistruoti, prisijungti ir saugoti savo mėgstamus receptus vienoje vietoje.

## Naudojamos technologijos

- React
- JavaScript
- Vite
- CSS
- Supabase (Auth + prisijungusio vartotojo receptų skaitymas ir kūrimas)
- GitHub

## MVP funkcionalumai

Jau veikiančios funkcijos:

- Receptų peržiūra – paspaudus ant bet kurios iš trijų receptų kortelių atsidaro bendras modalinis recepto langas su ingredientais ir gaminimo instrukcija (vietiniai pavyzdiniai duomenys).
- Receptų paieška pagal pavadinimą – filtruoja bendrą receptų sąrašą realiu laiku (nepriklausomai nuo raidžių dydžio, lietuviškų diakritikų ir dažnų žodžių formų; veikia ir su Supabase receptais).
- Receptų pridėjimas – forma modaliniame lange; neprisijungus saugoma `localStorage`, prisijungus – tik Supabase (`public.recipes`).
- Automatinis naujo recepto nuotraukos priskyrimas pagal pavadinimo raktažodžius (nuotraukos `public/recipes/`).
- Vartotojo pridėtų receptų redagavimas – peržiūros lange mygtukas „Redaguoti“; pakeitimai saugomi `localStorage`.
- Vartotojo pridėtų receptų ištrynimas – su patvirtinimo langu; pašalinimas iš sąrašo ir `localStorage`.
- Vartotojo registracija per Supabase Auth (el. paštas ir slaptažodis).
- Vartotojo prisijungimas ir atsijungimas per Supabase Auth (sesija išlieka perkrovus puslapį).
- Prisijungusio vartotojo receptų nuskaitymas iš Supabase (`public.recipes`) – rodomi tame pačiame bendrame sąraše su pavyzdiniais ir `localStorage` receptais.
- Prisijungusio vartotojo naujo recepto kūrimas Supabase (`INSERT`) – po sėkmės atsiranda bendrame sąraše be perkrovimo.

Planuojamos funkcijos:

- Receptų redagavimas ir trynimas Supabase duomenų bazėje.
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
- Naujiems receptams automatiškai priskiriama nuotrauka pagal pavadinimo raktažodžius.
- Įgyvendintas vartotojo pridėtų receptų redagavimas su `localStorage` saugojimu.
- Įgyvendintas vartotojo pridėtų receptų ištrynimas su patvirtinimu ir `localStorage` atnaujinimu.
- Supabase klientas (`@supabase/supabase-js`) paruoštas per `src/lib/supabase.js`.
- Įgyvendinta vartotojo registracija per Supabase Auth.
- Įgyvendintas prisijungimas ir atsijungimas per Supabase Auth.
- Įgyvendintas prisijungusio vartotojo receptų skaitymas (READ) iš Supabase.
- Įgyvendintas prisijungusio vartotojo receptų kūrimas (CREATE) Supabase.
- Supabase receptai rodomi bendrame receptų sąraše (be atskiros skilties).
- Redagavimas ir trynimas vis dar naudoja `localStorage` (Supabase UPDATE/DELETE dar neįgyvendinta).
