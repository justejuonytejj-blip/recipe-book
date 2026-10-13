# Recipe Book

Recipe Book – receptų katalogas.

## Projekto aprašymas

Tai internetinė aplikacija, kurioje vartotojai galės užsiregistruoti, prisijungti ir saugoti savo mėgstamus receptus vienoje vietoje.

## Naudojamos technologijos

- React
- JavaScript
- Vite
- CSS
- Supabase (klientas paruoštas; veikia Auth registracija)
- GitHub

## MVP funkcionalumai

Jau veikiančios funkcijos:

- Receptų peržiūra – paspaudus ant bet kurios iš trijų receptų kortelių atsidaro bendras modalinis recepto langas su ingredientais ir gaminimo instrukcija (vietiniai pavyzdiniai duomenys).
- Receptų paieška pagal pavadinimą – filtruoja bendrą receptų sąrašą realiu laiku (nepriklausomai nuo raidžių dydžio, lietuviškų diakritikų ir dažnų žodžių formų; paruošta naudoti su vėliau iš Supabase gaunamais receptais).
- Receptų pridėjimas – forma modaliniame lange; nauji receptai laikinai saugomi naršyklės `localStorage` (ne Supabase).
- Automatinis naujo recepto nuotraukos priskyrimas pagal pavadinimo raktažodžius (nuotraukos `public/recipes/`).
- Vartotojo pridėtų receptų redagavimas – peržiūros lange mygtukas „Redaguoti“; pakeitimai saugomi `localStorage`.
- Vartotojo pridėtų receptų ištrynimas – su patvirtinimo langu; pašalinimas iš sąrašo ir `localStorage`.
- Vartotojo registracija per Supabase Auth (el. paštas ir slaptažodis).

Planuojamos funkcijos:

- Prisijungimas.
- Receptų saugojimas Supabase duomenų bazėje.
- Kiekvienas vartotojas matys tik savo receptus.

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
- Įgyvendintas naujo recepto pridėjimas su `localStorage` saugojimu (Supabase dar nenaudojama).
- Naujiems receptams automatiškai priskiriama nuotrauka pagal pavadinimo raktažodžius.
- Įgyvendintas vartotojo pridėtų receptų redagavimas su `localStorage` saugojimu.
- Įgyvendintas vartotojo pridėtų receptų ištrynimas su patvirtinimu ir `localStorage` atnaujinimu.
- Supabase klientas (`@supabase/supabase-js`) paruoštas per `src/lib/supabase.js`.
- Įgyvendinta vartotojo registracija per Supabase Auth.
- Prisijungimas ir receptų CRUD su Supabase dar neprijungti (receptai kol kas saugomi `localStorage`).
