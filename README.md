# Recipe Book

Recipe Book – receptų katalogas.

## Projekto aprašymas

Tai internetinė aplikacija, kurioje vartotojai galės užsiregistruoti, prisijungti ir saugoti savo mėgstamus receptus vienoje vietoje.

## Naudojamos technologijos

- React
- JavaScript
- Vite
- CSS
- Supabase (bus prijungta vėliau)
- GitHub

## MVP funkcionalumai

Jau veikiančios funkcijos:

- Receptų peržiūra – paspaudus ant bet kurios iš trijų receptų kortelių atsidaro bendras modalinis recepto langas su ingredientais ir gaminimo instrukcija (vietiniai pavyzdiniai duomenys).
- Receptų paieška pagal pavadinimą – filtruoja bendrą receptų sąrašą realiu laiku (nepriklausomai nuo raidžių dydžio, lietuviškų diakritikų ir dažnų žodžių formų; paruošta naudoti su vėliau iš Supabase gaunamais receptais).

Planuojamos funkcijos:

- Registracija ir prisijungimas.
- Receptų pridėjimas.
- Receptų redagavimas.
- Receptų ištrynimas.
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

3. Atidarykite naršyklėje adresą, kurį parodytų Vite (dažniausiai `http://localhost:5173`).

## Dabartinė projekto būsena

- Sukurtas React + Vite projektas.
- Sukurtas pradinis „Recipe Book“ svetainės dizainas.
- Įgyvendinta visų trijų pavyzdinių receptų peržiūra bendrame modaliniame lange.
- Įgyvendinta veikianti receptų paieška pagal pavadinimą (su lietuviškų raidžių, galūnių ir y/i variantų normalizavimu).
- Registracija ir prisijungimas dar neįgyvendinti.
- Supabase duomenų bazė dar neprijungta.
- Receptų pridėjimas, redagavimas ir ištrynimas dar neįgyvendinti.
