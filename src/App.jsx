import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from './lib/supabase.js'
import './App.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function translateSignUpError(error) {
  const message = (error?.message || '').toLowerCase()

  if (
    message.includes('already registered') ||
    message.includes('already been registered') ||
    message.includes('user already exists')
  ) {
    return 'Šis el. paštas jau užregistruotas.'
  }

  if (
    message.includes('password') &&
    (message.includes('least') ||
      message.includes('short') ||
      message.includes('weak') ||
      message.includes('characters'))
  ) {
    return `Slaptažodis neatitinka saugumo reikalavimų. Naudokite bent ${MIN_PASSWORD_LENGTH} simbolius.`
  }

  if (message.includes('invalid') && message.includes('email')) {
    return 'Neteisingas el. pašto formatas.'
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Per daug bandymų. Bandykite vėliau.'
  }

  return 'Registracija nepavyko. Patikrinkite duomenis ir bandykite dar kartą.'
}

function translateSignInError(error) {
  const message = (error?.message || '').toLowerCase()

  if (message.includes('email not confirmed')) {
    return 'El. paštas dar nepatvirtintas. Patikrinkite savo pašto dėžutę.'
  }

  if (
    message.includes('invalid login') ||
    message.includes('invalid credentials') ||
    message.includes('invalid email or password')
  ) {
    return 'Neteisingas el. paštas arba slaptažodis.'
  }

  if (message.includes('rate limit') || message.includes('too many')) {
    return 'Per daug bandymų. Bandykite vėliau.'
  }

  return 'Prisijungti nepavyko. Patikrinkite duomenis ir bandykite dar kartą.'
}

const STORAGE_KEY = 'recipe-book-user-recipes'

const RECIPE_IMAGES = {
  pasta: '/recipes/pasta.jpg',
  breakfast: '/recipes/breakfast.jpg',
  dinner: '/recipes/dinner.jpg',
  dessert: '/recipes/dessert.jpg',
  default: '/recipes/default.jpg',
}

/**
 * Pagal pavadinimo raktažodžius parenka numatytą recepto nuotrauką.
 * Veikia ir be lietuviškų raidžių (naudoja normalizuotą tekstą).
 */
function getRecipeImageByTitle(title) {
  const normalized = normalizeSearchText(title)

  if (
    normalized.includes('makaron') ||
    normalized.includes('pasta')
  ) {
    return RECIPE_IMAGES.pasta
  }

  if (
    normalized.includes('avokad') ||
    normalized.includes('kiausin')
  ) {
    return RECIPE_IMAGES.breakfast
  }

  if (
    normalized.includes('lasis') ||
    normalized.includes('zuvis')
  ) {
    return RECIPE_IMAGES.dinner
  }

  if (
    normalized.includes('pirag') ||
    normalized.includes('sokolad') ||
    normalized.includes('desert')
  ) {
    return RECIPE_IMAGES.dessert
  }

  return RECIPE_IMAGES.default
}

const SAMPLE_RECIPES = [
  {
    id: 1,
    title: 'Kreminiai makaronai su grybais',
    tag: 'Pietūs',
    time: '30 min',
    servings: '2',
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80',
    openable: true,
    ingredients: [
      { amount: '250 g', name: 'fetučini arba spagečių' },
      { amount: '300 g', name: 'šviežių pievagrybių' },
      { amount: '1 vnt.', name: 'svogūnas' },
      { amount: '2 skiltelės', name: 'česnako' },
      { amount: '200 ml', name: 'grietinėlės (20–30 %)' },
      { amount: '40 g', name: 'sviesto' },
      { amount: '50 g', name: 'parmezano' },
      { amount: '2 v. š.', name: 'alyvuogių aliejaus' },
      { amount: 'pagal skonį', name: 'druska, pipirai, šviežia petražolė' },
    ],
    steps: [
      'Užvirinkite sūrų vandenį ir išvirkite makaronus pagal pakuotės nurodymus iki „al dente“. Prieš nupildami, atidėkite apie 100 ml virimo vandens.',
      'Kol makaronai verda, grybus nuplaukite, nusausinkite ir supjaustykite plonais griežinėliais. Svogūną smulkiai sukapokite, česnaką – plonais griežinėliais.',
      'Keptuvėje įkaitinkite alyvuogių aliejų su sviestu. Suberkite svogūną ir kepkite 2–3 min., kol jis taps skaidrus.',
      'Įdėkite grybus ir kepkite vidutine ugnimi 6–8 min., kol jie apskrus ir išgarins skysčius. Įberkite česnaką ir kepkite dar 1 minutę.',
      'Įpilkite grietinėlę, sumažinkite ugnį ir troškinkite 3–4 min., kol padažas šiek tiek sutirštės. Pagardinkite druska ir juodaisiais pipirais.',
      'Į keptuvę sudėkite nupiltus makaronus, suberkite tarkuotą parmezaną ir, jei reikia, įpilkite šiek tiek atidėto virimo vandens. Maišykite, kol padažas apgaubs makaronus.',
      'Patiekite iškart, pabarstę smulkinta petražole ir papildomu parmezanu.',
    ],
  },
  {
    id: 2,
    title: 'Avokado skrebučiai su kiaušiniu',
    tag: 'Pusryčiai',
    time: '15 min',
    servings: '1',
    rating: 4.9,
    image:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    openable: true,
    ingredients: [
      { amount: '2 riekės', name: 'rūgštinės duonos (pvz. sourdough)' },
      { amount: '1 vnt.', name: 'prinokęs avokadas' },
      { amount: '1–2 vnt.', name: 'kiaušiniai' },
      { amount: '1 šaukštelis', name: 'citrinos sulčių' },
      { amount: '1 šaukštelis', name: 'alyvuogių aliejaus' },
      { amount: 'žiupsnelis', name: 'druskos ir juodųjų pipirų' },
      { amount: 'pagal skonį', name: 'čili dribsniai arba šviežios žolelės' },
    ],
    steps: [
      'Duoną paskrudinkite tosteriuje arba keptuvėje su lašeliu aliejaus, kol ji taps traški ir auksinė.',
      'Avokadą perpjaukite perpus, išimkite kauliuką, minkštimą išgriebkite šaukštu į dubenėlį. Sutrinkite šakute, įlašinkite citrinos sulčių, įberkite druskos ir pipirų.',
      'Atskirai išvirkite kiaušinius: keptuvėje su trupučiu aliejaus kepkite 3–4 min. saulutei arba 2–3 min. kiekvienoje pusėje, jei mėgstate kietesnį trynį.',
      'Ant skrebučių užtepkite avokado tyrę lygiu sluoksniu.',
      'Ant viršaus uždėkite kiaušinį, pabarstykite čili dribsniais arba smulkintomis žolelėmis ir patiekite iškart.',
    ],
  },
  {
    id: 3,
    title: 'Lašiša su daržovėmis',
    tag: 'Vakarienė',
    time: '35 min',
    servings: '2',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    openable: true,
    ingredients: [
      { amount: '2 vnt.', name: 'lašišos filė (po ~150–180 g)' },
      { amount: '200 g', name: 'brokolių žiedynų' },
      { amount: '1 vnt.', name: 'cukinija' },
      { amount: '1 vnt.', name: 'raudonoji paprika' },
      { amount: '2 v. š.', name: 'alyvuogių aliejaus' },
      { amount: '1 skiltelė', name: 'česnako' },
      { amount: '1 v. š.', name: 'citrinos sulčių' },
      { amount: '1 šaukštelis', name: 'medaus (nebūtina)' },
      { amount: 'pagal skonį', name: 'druska, pipirai, džiovintas raudonėlis' },
    ],
    steps: [
      'Įkaitinkite orkaitę iki 200 °C. Skardą išklokite kepimo popieriumi.',
      'Brokolius padalinkite į žiedynus, cukiniją ir papriką supjaustykite stambiais gabaliukais. Daržoves sumaišykite su 1 v. š. aliejaus, druska, pipirais ir raudonėliu.',
      'Sudėkite daržoves ant skardos ir kepkite 10 minučių, kad jos pradėtų minkštėti.',
      'Kol daržovės kepa, lašišą nusausinkite popieriniu rankšluosčiu. Sumaišykite likusį aliejų su citrinos sultimis, smulkintu česnaku, medumi, druska ir pipirais. Šiuo mišiniu aptepkite žuvį.',
      'Išimkite skardą, pastumkite daržoves į šonus ir įdėkite lašišos filė oda žemyn. Kepkite dar 12–15 min., kol žuvis lengvai skyla šakute, o daržovės apskrunda.',
      'Patiekite lašišą kartu su keptomis daržovėmis. Jei norite, papildomai apšlakstykite citrinos sultimis.',
    ],
  },
]

const LT_CHAR_MAP = {
  ą: 'a',
  č: 'c',
  ę: 'e',
  ė: 'e',
  į: 'i',
  š: 's',
  ų: 'u',
  ū: 'u',
  ž: 'z',
}

/** Pašalina diakritikus, suvienodina y/i ir mažąsias raides. */
function normalizeSearchText(text) {
  return text
    .toLocaleLowerCase('lt')
    .split('')
    .map((char) => LT_CHAR_MAP[char] || char)
    .join('')
    .replace(/y/g, 'i')
}

/**
 * Supaprastina lietuviškas galūnes, kad „makaronai / makaronų / makaronus“
 * ir „avokadas / avokado / avokadu“ atitiktų tą patį kamieną.
 */
function stemSearchWord(word) {
  const endings = [
    'ais',
    'ams',
    'ami',
    'oje',
    'ose',
    'ius',
    'iam',
    'iems',
    'us',
    'as',
    'is',
    'ys',
    'ai',
    'ui',
    'uo',
    'om',
    'os',
    'es',
    'ei',
    'a',
    'o',
    'u',
    'e',
    'i',
  ]

  let stem = word
  for (const ending of endings) {
    if (stem.length - ending.length >= 4 && stem.endsWith(ending)) {
      stem = stem.slice(0, -ending.length)
      break
    }
  }
  return stem
}

function getSearchTokens(text) {
  return normalizeSearchText(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map(stemSearchWord)
}

/** Filtruoja bet kurį receptų sąrašą pagal pavadinimą (veiks ir su Supabase duomenimis). */
function filterRecipesByTitle(recipeList, searchQuery) {
  const normalizedQuery = normalizeSearchText(searchQuery.trim())
  if (!normalizedQuery) return recipeList

  const queryTokens = getSearchTokens(searchQuery)
  if (queryTokens.length === 0) return recipeList

  return recipeList.filter((recipe) => {
    const normalizedTitle = normalizeSearchText(recipe.title)
    if (normalizedTitle.includes(normalizedQuery)) return true

    const titleTokens = getSearchTokens(recipe.title)
    return queryTokens.every((queryToken) =>
      titleTokens.some(
        (titleToken) =>
          titleToken.includes(queryToken) || queryToken.includes(titleToken),
      ),
    )
  })
}

function loadUserRecipes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Užtikriname, kad seni įrašai turėtų reikalingas žymas ištrynimui/redagavimui.
    return parsed.map((recipe) => ({
      ...recipe,
      id: recipe.id,
      isUserRecipe: true,
      openable: true,
    }))
  } catch {
    return []
  }
}

function saveUserRecipes(userRecipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userRecipes))
}

function parseIngredientLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^(\d+[.,]?\d*\s*[a-ząčęėįšųūžA-ZĄČĘĖĮŠŲŪŽ.%]*\.?|\d+\s*v\.?\s*š\.?|pagal\s+skonį)\s+(.+)$/iu,
      )
      if (match) {
        return { amount: match[1].trim(), name: match[2].trim() }
      }
      return { amount: '', name: line }
    })
}

function parseStepLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function LeafLogo() {
  return (
    <svg
      className="logo-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 20c1.2-3.8 4.2-6.8 8-8.2-1.5 4.2-3.8 7-8 8.2Z"
        fill="currentColor"
      />
      <path
        d="M12 20c-1.5-4.2-4.8-7.2-9-8.5 2 4 4.5 6.8 9 8.5Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M12 20c0-5.5 1.2-10.5 4.5-14.5-.8 4.2-2.2 8.2-4.5 14.5Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M12 20V8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Icon({ name }) {
  const icons = {
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
      </svg>
    ),
    plus: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
    clock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l2.5 2.5" strokeLinecap="round" />
      </svg>
    ),
    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="9" r="3.2" />
        <path d="M6 19c1.5-3 10.5-3 12 0" strokeLinecap="round" />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8l-4.8 2.6.9-5.4-3.9-3.8 5.4-.8L12 3.5Z" />
      </svg>
    ),
    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
      </svg>
    ),
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m4 11 8-7 8 7v8a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-8Z" />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21.5V5.5Z" />
        <path d="M5 21.5A2.5 2.5 0 0 1 7.5 19H19" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
      </svg>
    ),
    edit: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 20h9" strokeLinecap="round" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" strokeLinejoin="round" />
      </svg>
    ),
    trash: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 7h16" strokeLinecap="round" />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
        <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" strokeLinejoin="round" />
        <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" strokeLinejoin="round" />
      </svg>
    ),
  }

  return <span className="icon">{icons[name]}</span>
}

function Stars({ rating }) {
  return (
    <span className="stars" aria-label={`Įvertinimas ${rating}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon key={n} name="star" />
      ))}
      <span className="rating-value">{rating}</span>
    </span>
  )
}

function serializeIngredients(ingredients) {
  return ingredients
    .map((item) => (item.amount ? `${item.amount} ${item.name}` : item.name))
    .join('\n')
}

function serializeSteps(steps) {
  return steps.join('\n')
}

/**
 * DB saugo tik stabilias nuorodas (kelias arba http/https).
 * blob:/data: ir tuščias reikšmes pakeičia numatytąja nuotrauka.
 */
function toStorableImageUrl(image) {
  if (!image || typeof image !== 'string') {
    return RECIPE_IMAGES.default
  }

  const trimmed = image.trim()
  if (
    !trimmed ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:')
  ) {
    return RECIPE_IMAGES.default
  }

  return trimmed
}

function mapSupabaseRecipe(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    tag: 'Mano receptas',
    image: row.image_url || RECIPE_IMAGES.default,
    openable: true,
    isUserRecipe: false,
    ingredients: parseIngredientLines(row.ingredients || ''),
    steps: parseStepLines(row.instructions || ''),
    source: 'supabase',
  }
}

/**
 * Ar prisijungęs naudotojas gali redaguoti / ištrinti receptą.
 * Supabase – pagal user_id; localStorage – pagal isUserRecipe.
 */
function canManageRecipe(recipe, currentUser) {
  if (!recipe) return false

  if (recipe.source === 'supabase') {
    return Boolean(
      currentUser?.id &&
        recipe.user_id &&
        String(recipe.user_id) === String(currentUser.id),
    )
  }

  return Boolean(recipe.isUserRecipe)
}

function RecipeCards({ recipes, onOpen }) {
  return (
    <div className="recipe-grid">
      {recipes.map((recipe, index) => (
        <article
          key={recipe.id}
          className={`recipe-card${recipe.openable ? ' is-openable' : ''}`}
          style={{ animationDelay: `${index * 80}ms` }}
          onClick={() => onOpen(recipe)}
          onKeyDown={(event) => {
            if (!recipe.openable) return
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onOpen(recipe)
            }
          }}
          role={recipe.openable ? 'button' : undefined}
          tabIndex={recipe.openable ? 0 : undefined}
          aria-label={
            recipe.openable ? `Atidaryti receptą: ${recipe.title}` : undefined
          }
        >
          <div className="recipe-image">
            <img src={recipe.image} alt={recipe.title} loading="lazy" />
          </div>
          <div className="recipe-body">
            {recipe.tag && <span className="tag">{recipe.tag}</span>}
            <h3>{recipe.title}</h3>
            {(recipe.time || recipe.servings || recipe.rating != null) && (
              <div className="recipe-meta">
                {recipe.time && (
                  <span>
                    <Icon name="clock" />
                    {recipe.time}
                  </span>
                )}
                {recipe.servings && (
                  <span>
                    <Icon name="user" />
                    {recipe.servings}
                  </span>
                )}
                {recipe.rating != null && <Stars rating={recipe.rating} />}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}

function RecipeModal({ recipe, onClose, onEdit, onDelete, canManage = false }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (confirmDelete) setConfirmDelete(false)
      else onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, confirmDelete])

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        // Kol atidarytas ištrynimo patvirtinimas, neuždaryti recepto modalų
        // (portalo įvykiai React medyje kyla iki backdrop).
        if (confirmDelete) return
        onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          aria-label="Uždaryti"
          onClick={onClose}
        >
          <Icon name="close" />
        </button>

        <div className="modal-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>

        <div className="modal-body">
          {recipe.tag && <span className="tag">{recipe.tag}</span>}
          <h2 id="recipe-modal-title">{recipe.title}</h2>

          {(recipe.time || recipe.servings) && (
            <div className="modal-meta">
              {recipe.time && (
                <span>
                  <Icon name="clock" />
                  {recipe.time}
                </span>
              )}
              {recipe.servings && (
                <span>
                  <Icon name="user" />
                  {recipe.servings} porcijos
                </span>
              )}
            </div>
          )}

          <section className="modal-section">
            <h3>Ingredientai</h3>
            <ul className="ingredient-list">
              {recipe.ingredients.map((item, index) => (
                <li key={`${index}-${item.name}`}>
                  {item.amount ? (
                    <span className="ingredient-amount">{item.amount}</span>
                  ) : null}
                  <span className={item.amount ? undefined : 'ingredient-full'}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="modal-section">
            <h3>Gaminimo instrukcija</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, index) => (
                <li key={`${index}-${step.slice(0, 24)}`}>
                  <span className="step-number">{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>
          </section>

          <div className="modal-actions">
            {canManage && (
              <>
                <button
                  type="button"
                  className="btn btn-outline modal-action-btn"
                  onClick={() => onEdit(recipe)}
                >
                  <Icon name="edit" />
                  Redaguoti
                </button>
                <button
                  type="button"
                  className="btn btn-danger modal-action-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    setConfirmDelete(true)
                  }}
                >
                  <Icon name="trash" />
                  Ištrinti
                </button>
              </>
            )}
            <button type="button" className="btn btn-primary modal-action-btn" onClick={onClose}>
              Uždaryti
            </button>
          </div>
        </div>
      </div>

      {confirmDelete &&
        createPortal(
          <div
            className="confirm-overlay"
            role="presentation"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="confirm-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-delete-title"
              aria-describedby="confirm-delete-text"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 id="confirm-delete-title">Ištrinti receptą</h3>
              <p id="confirm-delete-text">Ar tikrai norite ištrinti šį receptą?</p>
              <div className="confirm-actions">
                <button
                  type="button"
                  className="btn btn-outline form-btn"
                  onClick={() => setConfirmDelete(false)}
                >
                  Atšaukti
                </button>
                <button
                  type="button"
                  className="btn btn-danger form-btn"
                  onClick={(event) => {
                    event.stopPropagation()
                    onDelete(recipe.id)
                  }}
                >
                  Taip, ištrinti
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

function RecipeFormModal({ recipe = null, onClose, onSave }) {
  const isEdit = Boolean(recipe)
  const [title, setTitle] = useState(recipe?.title ?? '')
  const [ingredientsText, setIngredientsText] = useState(
    recipe ? serializeIngredients(recipe.ingredients) : '',
  )
  const [instructionsText, setInstructionsText] = useState(
    recipe ? serializeSteps(recipe.steps) : '',
  )
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, isSubmitting])

  const handleClose = () => {
    if (isSubmitting) return
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedTitle = title.trim()
    const ingredients = parseIngredientLines(ingredientsText)
    const steps = parseStepLines(instructionsText)

    if (!trimmedTitle || ingredients.length === 0 || steps.length === 0) {
      setError(
        'Užpildykite visus privalomus laukus: pavadinimą, ingredientus ir gaminimo instrukciją.',
      )
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSave({
        ...(recipe ?? {
          tag: 'Mano receptas',
          openable: true,
          isUserRecipe: true,
        }),
        id: recipe?.id ?? `user-${Date.now()}`,
        title: trimmedTitle,
        ingredients,
        steps,
        // Naujiems receptams nuotrauka parenkama automatiškai; redaguojant paliekama esama.
        image: recipe?.image ?? getRecipeImageByTitle(trimmedTitle),
        isUserRecipe: true,
        openable: true,
      })
    } catch (saveError) {
      setError(
        saveError?.message ||
          'Nepavyko išsaugoti recepto. Bandykite dar kartą.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={handleClose}>
      <div
        className="modal modal-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recipe-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          aria-label="Uždaryti"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          <Icon name="close" />
        </button>

        <form className="modal-body add-recipe-form" onSubmit={handleSubmit}>
          <h2 id="recipe-form-title">
            {isEdit ? 'Redaguoti receptą' : 'Pridėti receptą'}
          </h2>
          <p className="form-lead">
            {isEdit
              ? 'Pakeiskite recepto duomenis. Ingredientus ir instrukciją rašykite po vieną eilutę.'
              : 'Užpildykite privalomus laukus. Ingredientus ir instrukciją rašykite po vieną eilutę.'}
          </p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <label className="form-field">
            <span>Recepto pavadinimas *</span>
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="Pvz. Šokoladinis pyragas"
              autoFocus
              disabled={isSubmitting}
            />
          </label>

          <label className="form-field">
            <span>Ingredientai *</span>
            <textarea
              rows={5}
              value={ingredientsText}
              onChange={(event) => {
                setIngredientsText(event.target.value)
                setError('')
              }}
              placeholder={'Pvz.\n200 g miltų\n2 vnt. kiaušiniai\n100 g cukraus'}
              disabled={isSubmitting}
            />
          </label>

          <label className="form-field">
            <span>Gaminimo instrukcija *</span>
            <textarea
              rows={6}
              value={instructionsText}
              onChange={(event) => {
                setInstructionsText(event.target.value)
                setError('')
              }}
              placeholder={'Pvz.\nĮkaitinkite orkaitę.\nSumaišykite ingredientus.\nKepkite 30 min.'}
              disabled={isSubmitting}
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline form-btn"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="btn btn-primary form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saugoma...'
                : isEdit
                  ? 'Išsaugoti pakeitimus'
                  : 'Išsaugoti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function RegisterModal({ onClose, onSuccessToast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, isSubmitting])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setInfo('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password || !confirmPassword) {
      setError('Užpildykite visus privalomus laukus.')
      return
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Įveskite teisingą el. pašto adresą.')
      return
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `Slaptažodis turi būti bent ${MIN_PASSWORD_LENGTH} simbolių ilgio.`,
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Slaptažodžiai nesutampa.')
      return
    }

    setIsSubmitting(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      })

      if (signUpError) {
        setError(translateSignUpError(signUpError))
        return
      }

      if (data.session) {
        onSuccessToast('Registracija sėkminga!')
        onClose()
        return
      }

      setInfo('Patikrinkite savo el. paštą ir patvirtinkite registraciją')
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Registracija nepavyko. Bandykite dar kartą.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      <div
        className="modal modal-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          aria-label="Uždaryti"
          onClick={() => {
            if (!isSubmitting) onClose()
          }}
          disabled={isSubmitting}
        >
          <Icon name="close" />
        </button>

        <form className="modal-body add-recipe-form" onSubmit={handleSubmit}>
          <h2 id="register-title">Registruotis</h2>
          <p className="form-lead">
            Sukurkite paskyrą su el. paštu ir slaptažodžiu. Autentifikaciją tvarko
            Supabase Auth.
          </p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {info && (
            <p className="form-success" role="status">
              {info}
            </p>
          )}

          <label className="form-field">
            <span>El. paštas *</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setInfo('')
              }}
              placeholder="pvz. vardas@pastas.lt"
              disabled={isSubmitting}
              autoFocus
            />
          </label>

          <label className="form-field">
            <span>Slaptažodis *</span>
            <input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
                setInfo('')
              }}
              placeholder={`Bent ${MIN_PASSWORD_LENGTH} simboliai`}
              disabled={isSubmitting}
            />
          </label>

          <label className="form-field">
            <span>Pakartoti slaptažodį *</span>
            <input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value)
                setError('')
                setInfo('')
              }}
              placeholder="Pakartokite slaptažodį"
              disabled={isSubmitting}
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline form-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="btn btn-primary form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registruojama...' : 'Registruotis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LoginModal({ onClose, onSuccessToast }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, isSubmitting])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail || !password) {
      setError('Užpildykite visus privalomus laukus.')
      return
    }

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Įveskite teisingą el. pašto adresą.')
      return
    }

    setIsSubmitting(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      })

      if (signInError) {
        setError(translateSignInError(signInError))
        return
      }

      onSuccessToast('Sėkmingai prisijungėte!')
      onClose()
    } catch {
      setError('Prisijungti nepavyko. Bandykite dar kartą.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={() => {
        if (!isSubmitting) onClose()
      }}
    >
      <div
        className="modal modal-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-icon"
          aria-label="Uždaryti"
          onClick={() => {
            if (!isSubmitting) onClose()
          }}
          disabled={isSubmitting}
        >
          <Icon name="close" />
        </button>

        <form className="modal-body add-recipe-form" onSubmit={handleSubmit}>
          <h2 id="login-title">Prisijungti</h2>
          <p className="form-lead">
            Įveskite savo el. paštą ir slaptažodį. Sesiją tvarko Supabase Auth.
          </p>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <label className="form-field">
            <span>El. paštas *</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              placeholder="pvz. vardas@pastas.lt"
              disabled={isSubmitting}
              autoFocus
            />
          </label>

          <label className="form-field">
            <span>Slaptažodis *</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="Jūsų slaptažodis"
              disabled={isSubmitting}
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline form-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Atšaukti
            </button>
            <button
              type="submit"
              className="btn btn-primary form-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePage, setActivePage] = useState('home')
  const [query, setQuery] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [userRecipes, setUserRecipes] = useState(() => loadUserRecipes())
  const [supabaseRecipes, setSupabaseRecipes] = useState([])
  const [supabaseLoading, setSupabaseLoading] = useState(false)
  const [supabaseError, setSupabaseError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const clearSupabaseRecipes = () => {
    setSupabaseRecipes([])
    setSupabaseError('')
    setSupabaseLoading(false)
  }

  const goHome = () => {
    setActivePage('home')
    setQuery('')
    setMenuOpen(false)
  }

  const goMyRecipes = () => {
    setActivePage('my-recipes')
    setQuery('')
    setMenuOpen(false)
  }

  const openAddRecipe = () => {
    setActivePage('my-recipes')
    setIsAddOpen(true)
  }

  const openRegister = () => {
    setMenuOpen(false)
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const openLogin = () => {
    setMenuOpen(false)
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  useEffect(() => {
    if (!toastMessage) return undefined
    const timer = window.setTimeout(() => setToastMessage(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toastMessage])

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setUser(data.session?.user ?? null)
      setAuthReady(true)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return
      setUser(session?.user ?? null)
      setAuthReady(true)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user?.id) {
      clearSupabaseRecipes()
      return undefined
    }

    let cancelled = false

    const loadSupabaseRecipes = async () => {
      setSupabaseLoading(true)
      setSupabaseError('')

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (cancelled) return

      if (error) {
        setSupabaseRecipes([])
        setSupabaseError(
          'Nepavyko įkelti receptų iš duomenų bazės. Bandykite dar kartą.',
        )
      } else {
        setSupabaseRecipes((data || []).map(mapSupabaseRecipe))
        setSupabaseError('')
      }

      setSupabaseLoading(false)
    }

    loadSupabaseRecipes()

    return () => {
      cancelled = true
    }
  }, [user?.id])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setToastMessage('Atsijungti nepavyko. Bandykite dar kartą.')
        return
      }
      clearSupabaseRecipes()
      setMenuOpen(false)
      setToastMessage('Sėkmingai atsijungėte.')
    } catch {
      setToastMessage('Atsijungti nepavyko. Bandykite dar kartą.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const openRecipe = (recipe) => {
    if (!recipe.openable) return
    setSelectedRecipe(recipe)
  }

  const closeRecipeForm = () => {
    setIsAddOpen(false)
    setEditingRecipe(null)
  }

  const handleEditRecipe = (recipe) => {
    setSelectedRecipe(null)
    setIsAddOpen(false)
    setEditingRecipe(recipe)
  }

  const handleSaveRecipe = async (recipe) => {
    const isLocalEdit = userRecipes.some((item) => item.id === recipe.id)
    const existingSupabase = supabaseRecipes.find(
      (item) => String(item.id) === String(recipe.id),
    )
    const isSupabaseEdit = Boolean(existingSupabase)

    // Savo Supabase recepto redagavimas (UPDATE).
    if (isSupabaseEdit) {
      if (!canManageRecipe(existingSupabase, user)) {
        throw new Error('Neturite teisės redaguoti šio recepto.')
      }

      const { data, error } = await supabase
        .from('recipes')
        .update({
          title: recipe.title,
          ingredients: serializeIngredients(recipe.ingredients),
          instructions: serializeSteps(recipe.steps),
          image_url: toStorableImageUrl(recipe.image),
        })
        .eq('id', recipe.id)
        .eq('user_id', user.id)
        .select('*')
        .single()

      if (error || !data) {
        throw new Error(
          'Nepavyko atnaujinti recepto duomenų bazėje. Bandykite dar kartą.',
        )
      }

      const mapped = mapSupabaseRecipe(data)
      setSupabaseRecipes((prev) =>
        prev.map((item) =>
          String(item.id) === String(mapped.id) ? mapped : item,
        ),
      )
      closeRecipeForm()
      setSelectedRecipe(mapped)
      setToastMessage('Receptas sėkmingai atnaujintas')
      return
    }

    // Prisijungus naują receptą saugome tik Supabase (be localStorage dubliavimo).
    if (user?.id && !isLocalEdit) {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: recipe.title,
          ingredients: serializeIngredients(recipe.ingredients),
          instructions: serializeSteps(recipe.steps),
          image_url: toStorableImageUrl(recipe.image),
        })
        .select('*')
        .single()

      if (error || !data) {
        throw new Error(
          'Nepavyko išsaugoti recepto duomenų bazėje. Bandykite dar kartą.',
        )
      }

      setSupabaseRecipes((prev) => [mapSupabaseRecipe(data), ...prev])
      closeRecipeForm()
      setActivePage('my-recipes')
      setToastMessage('Receptas sėkmingai išsaugotas')
      return
    }

    // Neprisijungusiems arba redaguojant localStorage receptus – kaip anksčiau.
    const nextUserRecipes = isLocalEdit
      ? userRecipes.map((item) => (item.id === recipe.id ? recipe : item))
      : [...userRecipes, recipe]

    setUserRecipes(nextUserRecipes)
    saveUserRecipes(nextUserRecipes)
    closeRecipeForm()
    setActivePage('my-recipes')

    if (isLocalEdit) {
      setSelectedRecipe(recipe)
    }
  }

  const handleDeleteRecipe = async (recipeId) => {
    const existingSupabase = supabaseRecipes.find(
      (item) => String(item.id) === String(recipeId),
    )

    if (existingSupabase) {
      if (!canManageRecipe(existingSupabase, user)) {
        setToastMessage('Neturite teisės ištrinti šio recepto.')
        return
      }

      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id)

      if (error) {
        setToastMessage(
          'Nepavyko ištrinti recepto iš duomenų bazės. Bandykite dar kartą.',
        )
        return
      }

      setSupabaseRecipes((prev) =>
        prev.filter((item) => String(item.id) !== String(recipeId)),
      )
      setSelectedRecipe(null)
      setToastMessage('Receptas sėkmingai ištrintas')
      return
    }

    setUserRecipes((prev) => {
      const nextUserRecipes = prev.filter(
        (item) => String(item.id) !== String(recipeId),
      )
      saveUserRecipes(nextUserRecipes)
      return nextUserRecipes
    })
    setSelectedRecipe(null)
    setToastMessage('Receptas sėkmingai ištrintas')
  }

  const filteredSupabaseRecipes = filterRecipesByTitle(supabaseRecipes, query)
  const filteredLocalRecipes = filterRecipesByTitle(userRecipes, query)

  return (
    <div className="page">
      <header className="header">
        <div className="container header-inner">
          <a
            href="#"
            className="logo"
            onClick={(event) => {
              event.preventDefault()
              goHome()
            }}
          >
            <LeafLogo />
            <span>Recipe Book</span>
          </a>

          <nav className="nav-desktop" aria-label="Pagrindinė navigacija">
            <a
              href="#"
              className={activePage === 'home' ? 'active' : undefined}
              onClick={(event) => {
                event.preventDefault()
                goHome()
              }}
            >
              Pagrindinis
            </a>
            <a
              href="#mano-receptai"
              className={activePage === 'my-recipes' ? 'active' : undefined}
              onClick={(event) => {
                event.preventDefault()
                goMyRecipes()
              }}
            >
              Mano receptai
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn search-btn"
              aria-label="Ieškoti"
              onClick={goMyRecipes}
            >
              <Icon name="search" />
            </button>
            {authReady &&
              (user ? (
                <>
                  <span className="user-email" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? 'Atsijungiama...' : 'Atsijungti'}
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn btn-outline" onClick={openLogin}>
                    Prisijungti
                  </button>
                  <button type="button" className="btn btn-primary" onClick={openRegister}>
                    Registruotis
                  </button>
                </>
              ))}
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label={menuOpen ? 'Uždaryti meniu' : 'Atidaryti meniu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="nav-mobile" aria-label="Mobilioji navigacija">
            <a
              href="#"
              className={activePage === 'home' ? 'active' : undefined}
              onClick={(event) => {
                event.preventDefault()
                goHome()
              }}
            >
              Pagrindinis
            </a>
            <a
              href="#mano-receptai"
              className={activePage === 'my-recipes' ? 'active' : undefined}
              onClick={(event) => {
                event.preventDefault()
                goMyRecipes()
              }}
            >
              Mano receptai
            </a>
            <div className="nav-mobile-actions">
              {authReady &&
                (user ? (
                  <>
                    <p className="user-email user-email-mobile">{user.email}</p>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? 'Atsijungiama...' : 'Atsijungti'}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-outline" onClick={openLogin}>
                      Prisijungti
                    </button>
                    <button type="button" className="btn btn-primary" onClick={openRegister}>
                      Registruotis
                    </button>
                  </>
                ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        {activePage === 'home' && (
          <>
            <section className="hero">
              <div className="container hero-grid">
                <div className="hero-content">
                  <p className="eyebrow">
                    Sveiki atvykę{' '}
                    <span className="eyebrow-line" aria-hidden="true" />
                  </p>
                  <h1>Mano receptų knyga</h1>
                  <p className="hero-lead">
                    Išsaugok, atrask ir kurk savo mėgstamus receptus vienoje
                    vietoje.
                  </p>

                  <div className="hero-controls">
                    <button
                      type="button"
                      className="btn btn-primary btn-add"
                      onClick={openAddRecipe}
                    >
                      <Icon name="plus" />
                      Pridėti receptą
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={goMyRecipes}
                    >
                      Mano receptai
                    </button>
                  </div>
                </div>

                <div className="hero-visual" aria-hidden="true">
                  <div className="hero-circle">
                    <img
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="section recipes-section" id="receptai">
              <div className="container">
                <div className="section-header">
                  <h2>Populiarūs receptai</h2>
                </div>

                <RecipeCards
                  recipes={SAMPLE_RECIPES}
                  onOpen={openRecipe}
                />
              </div>
            </section>
          </>
        )}

        {activePage === 'my-recipes' && (
          <section
            className="section recipes-section my-recipes-page"
            id="mano-receptai"
          >
            <div className="container">
              <div className="my-recipes-header">
                <div className="my-recipes-intro">
                  <p className="eyebrow">
                    Asmeniniai{' '}
                    <span className="eyebrow-line" aria-hidden="true" />
                  </p>
                  <h1 className="my-recipes-title">Mano receptai</h1>
                  <p className="my-recipes-lead">
                    Visi tavo mėgstamiausi receptai vienoje vietoje.
                  </p>
                </div>

                <div className="hero-controls my-recipes-controls">
                  <label className="search-field">
                    <Icon name="search" />
                    <input
                      type="search"
                      placeholder="Ieškoti receptų..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn-primary btn-add"
                    onClick={() => setIsAddOpen(true)}
                  >
                    <Icon name="plus" />
                    Pridėti receptą
                  </button>
                </div>
              </div>

              {user && supabaseLoading && (
                <p className="recipes-empty" role="status">
                  Įkeliami receptai iš duomenų bazės...
                </p>
              )}

              {user && !supabaseLoading && supabaseError && (
                <p className="recipes-empty recipes-error" role="alert">
                  {supabaseError}
                </p>
              )}

              {!user && (
                <div className="recipes-empty-state" role="status">
                  <p>
                    Prisijunkite, kad matytumėte ir valdytumėte savo receptus
                    debesyje.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openLogin}
                  >
                    Prisijungti
                  </button>
                </div>
              )}

              {user &&
                !supabaseLoading &&
                !supabaseError &&
                supabaseRecipes.length === 0 &&
                !query.trim() && (
                  <div className="recipes-empty-state" role="status">
                    <p>Dar neturite receptų</p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsAddOpen(true)}
                    >
                      <Icon name="plus" />
                      Pridėti receptą
                    </button>
                  </div>
                )}

              {user &&
                !supabaseLoading &&
                !supabaseError &&
                supabaseRecipes.length > 0 &&
                filteredSupabaseRecipes.length === 0 && (
                  <p className="recipes-empty" role="status">
                    Receptų nerasta
                  </p>
                )}

              {user &&
                !supabaseLoading &&
                !supabaseError &&
                filteredSupabaseRecipes.length > 0 && (
                  <RecipeCards
                    recipes={filteredSupabaseRecipes}
                    onOpen={openRecipe}
                  />
                )}

              {userRecipes.length > 0 && (
                <div className="local-recipes-block">
                  <div className="section-header">
                    <h2>Šios naršyklės receptai</h2>
                  </div>
                  <p className="local-recipes-note">
                    Šie receptai saugomi tik šiame įrenginyje (localStorage) ir
                    nėra susieti su Supabase paskyra.
                  </p>
                  {filteredLocalRecipes.length === 0 ? (
                    <p className="recipes-empty" role="status">
                      Receptų nerasta
                    </p>
                  ) : (
                    <RecipeCards
                      recipes={filteredLocalRecipes}
                      onOpen={openRecipe}
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <a
            href="#"
            className="logo"
            onClick={(event) => {
              event.preventDefault()
              goHome()
            }}
          >
            <LeafLogo />
            <span>Recipe Book</span>
          </a>
          <p>© {new Date().getFullYear()} Recipe Book. Visi receptai — tavo.</p>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Apatinė navigacija">
        <a
          href="#"
          className={activePage === 'home' ? 'active' : undefined}
          onClick={(event) => {
            event.preventDefault()
            goHome()
          }}
        >
          <Icon name="home" />
          <span>Pagrindinis</span>
        </a>
        <a
          href="#mano-receptai"
          className={activePage === 'my-recipes' ? 'active' : undefined}
          onClick={(event) => {
            event.preventDefault()
            goMyRecipes()
          }}
        >
          <Icon name="book" />
          <span>Mano receptai</span>
        </a>
        <a
          href="#"
          onClick={(event) => {
            event.preventDefault()
            if (user) goMyRecipes()
            else openLogin()
          }}
        >
          <Icon name="user" />
          <span>Profilis</span>
        </a>
      </nav>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={handleEditRecipe}
          onDelete={handleDeleteRecipe}
          canManage={canManageRecipe(selectedRecipe, user)}
        />
      )}

      {(isAddOpen || editingRecipe) && (
        <RecipeFormModal
          recipe={editingRecipe}
          onClose={closeRecipeForm}
          onSave={handleSaveRecipe}
        />
      )}

      {isRegisterOpen && (
        <RegisterModal
          onClose={() => setIsRegisterOpen(false)}
          onSuccessToast={setToastMessage}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSuccessToast={setToastMessage}
        />
      )}

      {toastMessage && (
        <div className="toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default App
